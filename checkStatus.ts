import * as http from 'http';
import { EventEmitter } from 'events';

export class SyncthingMonitor extends EventEmitter {
  private isRunning = false;
  private hasCheckedInitialState = false;

  checkStatus() {
    const options = {
      hostname: 'localhost',
      port: 8384,
      path: '/',
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      if (!this.isRunning) {
        this.isRunning = true;
        this.emit('connected');
      }
      this.hasCheckedInitialState = true; 
    });

    console.log(req);

    req.on('error', () => {
      if (this.isRunning) {
        this.isRunning = false;
        this.emit('disconnected'); 
      } else if (!this.hasCheckedInitialState) {
        this.emit('disconnected');
        this.hasCheckedInitialState = true; 
      }
    });

    req.end();
  }
}
