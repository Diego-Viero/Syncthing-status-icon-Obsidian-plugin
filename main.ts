import { SyncthingMonitor } from 'checkStatus';
import { Plugin } from 'obsidian';

const GREEN_CIRCLE = '🟢';
const RED_CIRCLE = '🔴';

interface SyncthingStatusSettings {
	check_interval: number;	// Seconds		
}

const DEFAULT_SETTINGS: SyncthingStatusSettings = {
	check_interval: 30	// Seconds
}

export default class SyncthingStatus extends Plugin {
	settings: SyncthingStatusSettings;


	async onload() {
		await this.loadSettings();

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

		this.registerInterval(window.setInterval(() => monitor.checkStatus(), this.settings.check_interval * 1000));

		monitor.checkStatus();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}