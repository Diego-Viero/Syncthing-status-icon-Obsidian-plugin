# Syncthing Sync Status

> ⚠️ **This plugin has been removed from the Obsidian Community Plugins list** (as of May 21, 2026) and can no longer be installed or updated through Obsidian's plugin browser. It is no longer actively maintained. Existing installations will continue to work, but new users will need to install manually — see [Installation](#installation) below.

This Obsidian plugin enhances your Syncthing integration by providing real-time synchronization status directly within your Obsidian vault. It adds a dynamic icon to the status bar and offers a dedicated view with detailed sync information, ensuring you're always aware of your file synchronization health.

![Plugin Downloads](https://img.shields.io/badge/Plugin%20Downloads-2%2C883%20(final%20count%2C%20May%202026)-7f6df2)

# Prevent API Key from Syncing
> **Avoid syncing your API key**  
> To prevent your API key and other local settings from being synced across devices, create a `.stignore` file in the root of your Obsidian vault (if you don't already have one) containing:
> ```
> /.obsidian/plugins/syncthing-status-icon/data.json
> ```
> This ensures that your plugin's settings file remains local to each device.
---
## Features
### Status Bar Icon
The plugin displays a colored dot in the Obsidian status bar, providing immediate visual feedback on your Syncthing connection:
- 🟢: Syncthing is running and connected.
- 🟡: Syncthing is running but currently scanning or syncing files, or only one device is connected.
- 🔴: Syncthing is disconnected or not running.
### Detailed Syncthing View
Access a comprehensive view of your Syncthing status by clicking the ribbon icon or using the "Display Syncthing information" command. This view provides:
- **Sync status**: Percentage of files synchronized.
- **Files not synced**: Number of files awaiting synchronization (including `.obsidian` files).
- **Connected devices**: Shows how many devices are currently connected out of the total available.
### Customizable Settings
Tailor the plugin's behavior to your needs:
- **Polling timeout**: Adjust how frequently the plugin checks for new Syncthing events.
- **Syncthing API Token**: Securely connect to your Syncthing instance using an API token.
- **Folder ID**: Specify a particular Syncthing folder to monitor, or leave blank to monitor all synced folders.
## Requirements
- A running Syncthing instance (typically on `localhost:8384`).
- An API key generated from your Syncthing interface (Settings → General → API Key).
## How It Works
1. The plugin periodically sends requests to your local Syncthing instance (`localhost:8384`).
2. It uses the Syncthing API to fetch events and connection status.
3. Based on the API responses, it updates the status bar icon and the detailed Syncthing view.
4. It processes events like `FolderCompletion` (sync progress) and `StateChanged` (scanning/idle) to provide accurate status.
## Installation
**This plugin is no longer available through Obsidian's Community Plugins browser.** To install manually:
1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/Diego-Viero/Syncthing-status-icon-Obsidian-plugin/releases).
2. Create a folder named `syncthing-status-icon` inside your vault's `.obsidian/plugins/` directory.
3. Copy the three downloaded files into that folder.
4. Reload Obsidian and enable the plugin under Settings → Community Plugins → Installed plugins.
5. **Important**: Open the plugin settings and enter your Syncthing API token. Optionally, configure the polling timeout and folder ID.
## Feedback and Contributions
If you encounter issues, have feature requests, or want to contribute improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/Diego-Viero/Syncthing-status-icon-Obsidian-plugin).
