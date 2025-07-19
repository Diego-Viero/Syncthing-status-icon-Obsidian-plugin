import * as http from 'http';
import { EventEmitter } from 'events';
import { eventProcessor } from './eventsProcessor';
import { Icon } from 'types/iconEnum';
import { SyncthingStatusSettings } from 'types/settings';

interface Connection {
  connected: boolean;
}

interface ConnectionsResponse {
  connections: { [key: string]: Connection };
  total: any; 
}

export class SyncthingMonitor extends EventEmitter {
  private token: string | null = null;
  private timeout: number;
  private lastEventId: number | undefined;
  private pollingTimeoutId: NodeJS.Timeout | undefined;
  private currentSettings: SyncthingStatusSettings | undefined;

  public fileCompletion: number | undefined;
  public status: string;
  public folderId: string | null;
  public connectedDevicesCount: number = 0;
  public availableDevices: number = 0;
  public globalItems: number | undefined;
  public needItems: number | undefined;
  public isTokenSet: boolean = false;

  public setStatusIcon: (_: Icon) => void;

  public listenForEvents(
    settings: SyncthingStatusSettings,
    setStatusIcon: (_: Icon) => void
  ) {
    this.currentSettings = settings;
    this.token = settings.syncthingToken;
    this.timeout = settings.pollingTimeout;
    this.folderId = settings.folderId || null;
    this.status = "idle";
    this.setStatusIcon = setStatusIcon;
    this.isTokenSet = !!settings.syncthingToken; // Set isTokenSet based on whether the token exists

    if (this.isTokenSet) {
      this.poll();
      this.checkConnections();
    } else {
      this.status = "API key not set";
      this.emit('status-update', {
        status: this.status,
        fileCompletion: NaN,
        globalItems: NaN,
        needItems: NaN,
        connectedDevicesCount: NaN,
        availableDevices: NaN
      });
    }
  }

  public updateSettings(newSettings: SyncthingStatusSettings) {
    this.stopPolling();
    this.listenForEvents(newSettings, this.setStatusIcon);
  }

  private stopPolling() {
    if (this.pollingTimeoutId) {
      clearTimeout(this.pollingTimeoutId);
      this.pollingTimeoutId = undefined;
    }
    this.lastEventId = undefined; // Reset last event ID
    this.status = "stopped"; // Indicate that polling has stopped
    this.emit('disconnected'); // Emit disconnected event to update UI
  }

  private poll() {
    const lastId = this.lastEventId ?? 0;

    if (!this.token) {
      console.error('Syncthing API token is not set. Cannot poll for events.');
      this.status = "API key not set";
      this.emit('status-update', {
        status: this.status,
        fileCompletion: NaN,
        globalItems: NaN,
        needItems: NaN,
        connectedDevicesCount: NaN,
        availableDevices: NaN
      });
      return;
    }

    const options = {
      hostname: 'localhost',
      port: 8384,
      path: `/rest/events?since=${lastId}&timeout=${this.timeout}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      }
    };

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        const csrfErrorRegex = /CSRF Error/i;

        if (res.statusCode === 401 || csrfErrorRegex.test(body)) {
          console.error('Syncthing API key is invalid (401 Unauthorized or CSRF Error).');
          this.status = "Invalid API key";
          this.emit('status-update', {
            status: this.status,
            fileCompletion: NaN,
            globalItems: NaN,
            needItems: NaN,
            connectedDevicesCount: NaN,
            availableDevices: NaN
          });
          this.pollingTimeoutId = setTimeout(() => this.poll(), 5000); // Retry after delay
          return;
        }

        try {
          const events = JSON.parse(body);
          const eventsLength = events.length;

          if (Array.isArray(events)) {
            for (const event of events) {
              this.lastEventId = Math.max(this.lastEventId ?? 0, event.id);
              eventProcessor(event, this);
            }
          }
        } catch (err) {
          console.error('Failed to parse Syncthing events or unexpected response:', err);
        } finally {
          this.checkConnections();
          this.emit('status-update', { // Emit custom event
            status: this.status,
            fileCompletion: this.fileCompletion,
            globalItems: this.globalItems,
            needItems: this.needItems,
            connectedDevicesCount: this.connectedDevicesCount
          });
          this.pollingTimeoutId = setTimeout(() => this.poll(), this.timeout * 1000); // Schedule next poll
        }
      });
    });

    req.on('error', (err) => {
      console.error('Syncthing connection error:', err);
      this.pollingTimeoutId = setTimeout(() => this.poll(), 5000); // Retry after delay
    });

    req.end();
  }

  private checkConnections() {
    if (!this.token) {
      console.error('Syncthing API token is not set. Cannot check connections.');
      this.status = "API key not set";
      this.emit('status-update', {
        status: this.status,
        fileCompletion: NaN,
        globalItems: NaN,
        needItems: NaN,
        connectedDevicesCount: NaN,
        availableDevices: NaN
      });
      return;
    }

    const options = {
      hostname: 'localhost',
      port: 8384,
      path: '/rest/system/connections',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      }
    };

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        const csrfErrorRegex = /CSRF Error/i;

        if (res.statusCode === 401 || csrfErrorRegex.test(body)) {
          console.error('Syncthing API key is invalid (401 Unauthorized or CSRF Error).');
          this.status = "Invalid API key";
          this.emit('status-update', {
            status: this.status,
            fileCompletion: NaN,
            globalItems: NaN,
            needItems: NaN,
            connectedDevicesCount: NaN,
            availableDevices: NaN
          });
          return;
        }

        try {
          const data: ConnectionsResponse = JSON.parse(body);
          const connectionsArray = Object.values(data.connections);

          this.availableDevices = connectionsArray.length;
          this.connectedDevicesCount = connectionsArray.filter(conn => conn.connected).length;

          // If only 1 device is connected, set icon to yellow
          if (this.connectedDevicesCount === 0) {
            this.setStatusIcon(Icon.YELLOW_CIRCLE);
          }
          // Note: Other icon statuses (red/green) are handled by eventProcessor
          // This logic specifically adds the yellow icon condition for 1 connected device.

        } catch (err) {
          console.error('Failed to parse Syncthing connections or unexpected response:', err);
        } finally {
          this.emit('status-update', { // Emit custom event
            status: this.status,
            fileCompletion: this.fileCompletion,
            globalItems: this.globalItems,
            needItems: this.needItems,
            connectedDevicesCount: this.connectedDevicesCount,
            availableDevices: this.availableDevices
          });
        }
      });
    });

    req.on('error', (err) => {
      console.error('Syncthing connections API error:', err);
    });

    req.end();
  }
}
