import { SyncthingMonitor } from 'src/SyncthingMonitor';
import { Plugin, WorkspaceLeaf } from 'obsidian';
import { SettingsTab } from './settings';
import { Icon } from 'types/iconEnum';
import { SyncthingStatusSettings } from 'types/settings';
import { createWidget } from './widget';
import { SyncthingMenuView, VIEW_TYPE_SYNCTHING } from './SyncthingMenuView';

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
		console.log('test')

		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));


		this.registerView(
			VIEW_TYPE_SYNCTHING,
			(leaf) => new SyncthingMenuView(leaf, monitor)
		);

		//TODO: add syncthing icon
		this.addRibbonIcon('dice', 'Activate view', () => {
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
		else
			console.error(`No leaf found: ${leaf}`)
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// Must be an arrow function to bind `this`
	setStatusIcon = (icon: Icon) => {
		this.statusBarItem.setText(icon);
	}
}