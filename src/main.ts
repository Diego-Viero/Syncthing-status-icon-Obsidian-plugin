import { SyncthingMonitor } from 'src/SyncthingMonitor';
import { Plugin } from 'obsidian';
import { SettingsTab } from './settings';
import { Icon } from 'types/iconEnum';
import { SyncthingStatusSettings } from 'types/settings';
import { createWidget } from './widget';

const DEFAULT_SETTINGS: SyncthingStatusSettings = {
	pollingTimeout: 30,	// Seconds
	syncthingToken: "",
	folderId: ""
}

export default class SyncthingStatus extends Plugin {
	settings: SyncthingStatusSettings;
	statusBarItem: HTMLElement;

	async onload() {

		const monitor = new SyncthingMonitor();

		await this.loadSettings();

    this.addSettingTab(new SettingsTab(this.app, this));

		this.statusBarItem = this.addStatusBarItem();
		this.statusBarItem.setText('Loading...');

		monitor.on('connected', () => {
			this.statusBarItem.setText(Icon.GREEN_CIRCLE);
			this.statusBarItem.setAttribute('title', 'Connected to Syncthing');
		});

		monitor.on('disconnected', () => {
			this.statusBarItem.setText(Icon.RED_CIRCLE);
			this.statusBarItem.setAttribute('title', 'Disconnected from Syncthing');
		});

		monitor.listenForEvents(
			this.settings, 
			this.setStatusIcon
		);

		createWidget(this.statusBarItem);

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// Must be an arrow function to bind `this`
	setStatusIcon = (icon: Icon) => {
		this.statusBarItem.setText(icon);
	}
}