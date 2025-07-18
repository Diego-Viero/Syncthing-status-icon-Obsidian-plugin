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
  private token: string;
  private timeout: number
  private lastEventId: number | undefined;

  public fileCompletion: number | undefined;
  public status: string;
  public folderId: string | null;
  public connectedDevicesCount: number = 0;
  public globalItems: number | undefined;
  public needItems: number | undefined;

  public setStatusIcon: (_: Icon) => void;

  public listenForEvents(
    settings: SyncthingStatusSettings,
    setStatusIcon: (_: Icon) => void
  ) {
    this.token = settings.syncthingToken;
    this.timeout = settings.pollingTimeout;
    this.folderId = settings.folderId || null;
    this.status = "idle";
    this.setStatusIcon = setStatusIcon;

    this.poll();
    this.checkConnections(); 
  }

  private poll() {
    const lastId = this.lastEventId ?? 0;

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
          console.error('Failed to parse Syncthing events:', err);
        } finally {
          this.checkConnections();
          this.emit('status-update', { // Emit custom event
            status: this.status,
            fileCompletion: this.fileCompletion,
            globalItems: this.globalItems,
            needItems: this.needItems,
            connectedDevicesCount: this.connectedDevicesCount
          });
          this.poll();
        }
      });
    });

    req.on('error', (err) => {
      console.error('Syncthing connection error:', err);
      setTimeout(() => this.poll(), 5000); // Retry after delay
    });

    req.end();
  }

  private checkConnections() {
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
        try {
          const data: ConnectionsResponse = JSON.parse(body);
          let connectedCount = 0;
          for (const deviceId in data.connections) {
            if (data.connections[deviceId].connected) {
              connectedCount++;
            }
          }
          this.connectedDevicesCount = connectedCount;

          // If only 1 device is connected, set icon to yellow
          if (this.connectedDevicesCount === 0) {
            this.setStatusIcon(Icon.YELLOW_CIRCLE);
          }
          // Note: Other icon statuses (red/green) are handled by eventProcessor
          // This logic specifically adds the yellow icon condition for 1 connected device.

        } catch (err) {
          console.error('Failed to parse Syncthing connections:', err);
        } finally {
          this.emit('status-update', { // Emit custom event
            status: this.status,
            fileCompletion: this.fileCompletion,
            globalItems: this.globalItems,
            needItems: this.needItems,
            connectedDevicesCount: this.connectedDevicesCount
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
