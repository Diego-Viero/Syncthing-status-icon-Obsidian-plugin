import * as http from 'http';
import { EventEmitter } from 'events';
import { eventProcessor } from './eventsProcessor';
import { Icon } from 'types/iconEnum';
import { SyncthingStatusSettings } from 'types/settings';

export class SyncthingMonitor extends EventEmitter {
  private token: string;
  private timeout: number
  private lastEventId: number | undefined;
  private fileCompletion: number | undefined; 
  private status: string;

  public folderId: string | null;

  public setStatusIcon: (_: Icon) => void;

  public listenForEvents(
    settings: SyncthingStatusSettings,
    setStatusIcon: (_: Icon) => void
  ) {
    this.token = settings.syncthingToken;
    this.timeout = settings.pollingTimeout;
    this.folderId = settings.folderId || null;  // sets value to null if it's an empty string
    this.status = "idle";
    this.setStatusIcon = setStatusIcon;

    this.poll(); 
  }

  public setCompletion = (x: number): void => {
    this.fileCompletion = x;
  }
  public setStatus = (s: string): void => {
    this.status = s;
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
}
