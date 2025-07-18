import { ItemView, Stat, ViewStateResult, WorkspaceLeaf } from 'obsidian';
import { SyncthingMonitor } from './SyncthingMonitor';

export const VIEW_TYPE_SYNCTHING = 'syncthing-status';

interface StatusState {
  status: string,
  fileCompletion: number,
  globalItems: number,
  needItems: number
}

export class SyncthingMenuView extends ItemView implements StatusState {

  private monitor: SyncthingMonitor; 
  status: string;
  fileCompletion: number;
  globalItems: number;
  needItems: number;
  connectedDevicesCount: number; 

  constructor(leaf: WorkspaceLeaf, syncthingMonitor: SyncthingMonitor) {
    super(leaf);
    this.monitor = syncthingMonitor;
    this.status = this.monitor.status;
    this.fileCompletion = this.monitor.fileCompletion || NaN;
    this.globalItems = this.monitor.globalItems || NaN;
    this.needItems = this.monitor.needItems || NaN;
    this.connectedDevicesCount = this.monitor.connectedDevicesCount || NaN; // Initialize
  }

  getViewType() {
    return VIEW_TYPE_SYNCTHING;
  }

  getDisplayText() {
    return 'Syncthing Status';
  }

  async onOpen() {
    this.render(); // Initial render

    // Register event listener for real-time updates from the monitor
    this.monitor.on('status-update', this.handleStatusUpdate);
  }

  async onClose() {
    // Unregister event listener to prevent memory leaks
    this.monitor.off('status-update', this.handleStatusUpdate);
  }

  private handleStatusUpdate = (data: StatusState & { connectedDevicesCount: number }) => {
    this.status = data.status;
    this.fileCompletion = data.fileCompletion;
    this.globalItems = data.globalItems;
    this.needItems = data.needItems;
    this.connectedDevicesCount = data.connectedDevicesCount;
    this.render(); // Re-render the view with updated data
  }

  private render() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl('h4', { text: 'Syncthing Status' });
    container.createEl('div', { text: `Status: ${this.status}`});
    container.createEl('div', { text: `Files synced: ${parseFloat(this.fileCompletion.toFixed(2))}%`});
    container.createEl('div', { text: `Total files: ${this.globalItems}`});
    container.createEl('div', { text: `Files not synced: ${this.needItems}`});
    container.createEl('div', { text: `Connected devices: ${this.connectedDevicesCount}`});
  }

  async setState(state: StatusState, result: ViewStateResult): Promise<void> {
    // The `state` coming in 
    if (state.status) {
      this.status = state.status;
    }

    if (state.fileCompletion) {
      this.fileCompletion = state.fileCompletion;
    }
    if (state.globalItems) {
      this.globalItems = state.globalItems;
    }
    if (state.needItems) {
      this.needItems = state.needItems;
    }
    // Note: connectedDevicesCount is updated via the custom event, not setState
    // The setState method is primarily for Obsidian's internal view state management.

    return super.setState(state, result);
  }
}
