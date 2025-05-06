import * as http from 'http';
import { EventEmitter } from 'events';
import { eventProcessor } from './eventsProcessor';

export class SyncthingMonitor extends EventEmitter {
  private token: string;
  private timeout: number
  private lastEventId: number | undefined;

  public listenForEvents(token: string, timeout: number) {
    this.token = token;
    this.timeout = timeout;
    this.poll(); 
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
              eventProcessor(event);
            }
          }

          console.log(this.lastEventId);
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
