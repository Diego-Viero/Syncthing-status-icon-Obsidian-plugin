import { ItemView, Stat, ViewStateResult, WorkspaceLeaf } from 'obsidian';
import { SyncthingMonitor } from './SyncthingMonitor';

export const VIEW_TYPE_SYNCTHING = 'syncthing-status';

interface StatusState {
  status: string,
  fileCompletion: number,
  globalItems: number,
  needItems: number,
  availableDevices: number
}

export class SyncthingMenuView extends ItemView implements StatusState {

  private monitor: SyncthingMonitor; 
  status: string;
  fileCompletion: number;
  globalItems: number;
  needItems: number;
  connectedDevicesCount: number; 
  availableDevices: number;

  constructor(leaf: WorkspaceLeaf, syncthingMonitor: SyncthingMonitor) {
    super(leaf);
    this.monitor = syncthingMonitor;
    this.status = this.monitor.status;
    this.fileCompletion = this.monitor.fileCompletion || NaN;
    this.globalItems = this.monitor.globalItems || NaN;
    this.needItems = this.monitor.needItems || NaN;
    this.connectedDevicesCount = this.monitor.connectedDevicesCount || NaN; // Initialize
    this.availableDevices = this.monitor.availableDevices || NaN;

    this.icon = 'syncthing-icon'
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

  private handleStatusUpdate = (data: StatusState & { connectedDevicesCount: number, availableDevices: number }) => {
    this.status = data.status;
    this.fileCompletion = data.fileCompletion;
    this.globalItems = data.globalItems;
    this.needItems = data.needItems;
    this.connectedDevicesCount = data.connectedDevicesCount;
    this.availableDevices = data.availableDevices;
    this.render(); // Re-render the view with updated data
  }

  private render() {
    const container = this.containerEl.children[1];
    container.empty();
    //container.addClass('syncthing-status-view');

    container.createEl('h4', { text: 'Syncthing Status' });

    if (!this.monitor.isTokenSet) {
      container.createEl('p', { text: 'Please insert your Syncthing API key in the plugin settings to monitor status.' });
      return;
    }

    if (this.status === 'Invalid API key') {
      container.createEl('p', { text: 'Invalid Syncthing API key. Please check your settings.' });
      return;
    }

    // Status
    /*
    const statusItem = container.createEl('div', { cls: 'syncthing-status-item' });
    statusItem.createEl('span', { cls: 'syncthing-status-label', text: 'Status:' });
    const statusValue = statusItem.createEl('span', { cls: 'syncthing-status-value', text: this.status });
    if (this.status === 'connected') {
      statusValue.addClass('status-connected');
    } else if (this.status === 'disconnected') {
      statusValue.addClass('status-disconnected');
    } else if (this.status === 'syncing') {
      statusValue.addClass('status-syncing');
    }
    */

    // File Completion
    const fileCompletionItem = container.createEl('div', { cls: 'syncthing-status-item syncthing-no-border' }); // Added syncthing-no-border class
    fileCompletionItem.createEl('span', { cls: 'syncthing-status-label', text: 'Sync status:' });
    fileCompletionItem.createEl('span', { cls: 'syncthing-status-value', text: `${isNaN(this.fileCompletion) ? '0.00' : parseFloat(this.fileCompletion.toFixed(2))}%` });
    const progressBarContainer = container.createEl('div', { cls: 'syncthing-progress-bar-container' });
    const progressBar = progressBarContainer.createEl('div', { cls: 'syncthing-progress-bar' });
    progressBar.style.width = `${isNaN(this.fileCompletion) ? 0 : this.fileCompletion}%`;

    // Files not synced
    const needItemsItem = container.createEl('div', { cls: 'syncthing-status-item' });
    const needItemsLabel = needItemsItem.createEl('span', { cls: 'syncthing-status-label', text: 'Files not synced' });
    needItemsLabel.createEl('span', { text: ' (includes .obsidian files)', cls: 'syncthing-small-text' });
    needItemsItem.createEl('span', { cls: 'syncthing-status-value', text: `${isNaN(this.needItems) ? 0 : this.needItems}` });

    // Connected devices
    const connectedDevicesItem = container.createEl('div', { cls: 'syncthing-status-item' });
    connectedDevicesItem.createEl('span', { cls: 'syncthing-status-label', text: 'Connected devices:' });
    connectedDevicesItem.createEl('span', { cls: 'syncthing-status-value', text: `${isNaN(this.connectedDevicesCount) ? 0 : this.connectedDevicesCount}/${isNaN(this.availableDevices) ? 0 : this.availableDevices}` });
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
    if (state.availableDevices) {
      this.availableDevices = state.availableDevices;
    }
    // Note: connectedDevicesCount is updated via the custom event, not setState
    // The setState method is primarily for Obsidian's internal view state management.

    return super.setState(state, result);
  }
}
