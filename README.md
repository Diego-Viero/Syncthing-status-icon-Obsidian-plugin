# Syncthing Sync Status

This Obsidian plugin enhances your Syncthing integration by providing real-time synchronization status directly within your Obsidian vault. It adds a dynamic icon to the status bar and offers a dedicated view with detailed sync information, ensuring you're always aware of your file synchronization health.

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
- An API key generated from your Syncthing interface (Settings -> General -> API Key).

## How It Works
1. The plugin periodically sends requests to your local Syncthing instance (`localhost:8384`).
2. It uses the Syncthing API to fetch events and connection status.
3. Based on the API responses, it updates the status bar icon and the detailed Syncthing view.
4. It processes events like `FolderCompletion` (sync progress) and `StateChanged` (scanning/idle) to provide accurate status.

## Installation
From the Obsidian Community Plugins:
- Open Settings > Community Plugins.
- Click Browse, search for “Syncthing Sync Status”.
- Click Install, then enable the plugin.
- **Important**: Open the plugin settings and enter your Syncthing API token. Optionally, configure the polling timeout and folder ID.

## Feedback and Contributions

If you encounter issues, have feature requests, or want to contribute improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/Diego-Viero/Syncthing-status-icon-Obsidian-plugin).
