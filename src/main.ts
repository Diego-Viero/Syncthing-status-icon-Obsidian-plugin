import { SyncthingMonitor } from 'src/checkStatus';
import { Plugin } from 'obsidian';
import { ExampleSettingTab } from './settings';

const GREEN_CIRCLE = '🟢';
const RED_CIRCLE = '🔴';

interface SyncthingStatusSettings {
	pollingTimeout: number;	// Seconds		
	syncthingToken: string
}

const DEFAULT_SETTINGS: SyncthingStatusSettings = {
	pollingTimeout: 30,	// Seconds
	syncthingToken: ""
}

export default class SyncthingStatus extends Plugin {
	settings: SyncthingStatusSettings;

	async onload() {
		await this.loadSettings();

    this.addSettingTab(new ExampleSettingTab(this.app, this));
		const monitor = new SyncthingMonitor();

		const statusBarItemEl = this.addStatusBarItem();

		statusBarItemEl.setText('Loading...');

		monitor.on('connected', () => {
			statusBarItemEl.setText(GREEN_CIRCLE);
			statusBarItemEl.setAttribute('title', 'Connected to Syncthing');
		});

		monitor.on('disconnected', () => {
			statusBarItemEl.setText(RED_CIRCLE);
			statusBarItemEl.setAttribute('title', 'Disconnected from Syncthing');
		});

		monitor.listenForEvents(
			this.settings.syncthingToken, 
			this.settings.pollingTimeout
		);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}