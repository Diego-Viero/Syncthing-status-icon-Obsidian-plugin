import { SyncthingMonitor } from 'src/SyncthingMonitor';
import { addIcon, Plugin, WorkspaceLeaf } from 'obsidian';
import { SettingsTab } from './settings';
import { Icon } from 'types/iconEnum';
import { SyncthingStatusSettings } from 'types/settings';
import { createWidget } from './widget';
import { SyncthingMenuView, VIEW_TYPE_SYNCTHING } from './SyncthingMenuView';

import syncthingIcon from './syncthingIcon';

const DEFAULT_SETTINGS: SyncthingStatusSettings = {
	pollingTimeout: 1,	// Seconds
	syncthingToken: "",
	folderId: ""
}

export default class SyncthingStatus extends Plugin {
	settings: SyncthingStatusSettings;
	statusBarItem: HTMLElement;

	async onload() {

		const monitor = new SyncthingMonitor();

		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this, monitor));


		this.registerView(
			VIEW_TYPE_SYNCTHING,
			(leaf) => new SyncthingMenuView(leaf, monitor)
		);


		addIcon('syncthing-icon', syncthingIcon);

		this.addRibbonIcon('syncthing-icon', 'Activate view', () => {
			this.activateView();
		});


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

		this.addCommand({
			id: 'display-syncthing-view',
			name: 'Display Syncthing information',
			callback: () => {

				this.activateView();
				//TODO open SyncthingView
				//new ExampleModal(this.app, monitor).open();
			},
		});

		createWidget(this.statusBarItem, monitor);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async activateView() {

		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_SYNCTHING);

		if (leaves.length > 0) {
			// A leaf with the view already exists
			leaf = leaves[0];
		} else {
			// View could not be found in the workspace, create a new leaf in the right sidebar
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: VIEW_TYPE_SYNCTHING, active: true });
		}

		if (leaf)
			workspace.revealLeaf(leaf);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// Must be an arrow function to bind `this`
	setStatusIcon = (icon: Icon) => {
		this.statusBarItem.setText(icon);
	}
}
