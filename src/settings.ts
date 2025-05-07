import SyncthingPlugin from './main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export class SettingsTab extends PluginSettingTab {
  plugin: SyncthingPlugin;

  constructor(app: App, plugin: SyncthingPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    //TODO check if supports only numbers
    new Setting(containerEl)
      .setName('Polling timeout')
      .setDesc('How often the system checks for new events.')
      .addText((text) =>
        text
          .setPlaceholder("1")
          .setValue(String(this.plugin.settings.pollingTimeout))
          .onChange(async (value) => {

            const parsedValue = Number(value);

            if (!Number.isNaN(parsedValue)) {
              this.plugin.settings.pollingTimeout = parsedValue;
              await this.plugin.saveSettings();
            } else {
              // TODO display warning/error invalid value
              console.log("Couldn't parse number");
            }
          })
      );

    new Setting(containerEl)
      .setName('Syncthing token')
      .setDesc('API token to use Syncthing API')
      .addText((text) =>
        text
          .setPlaceholder("")
          .setValue(this.plugin.settings.syncthingToken)
          .onChange(async (value) => {
            this.plugin.settings.syncthingToken = value;
            await this.plugin.saveSettings();
          })
      );


    new Setting(containerEl)
      .setName('Folder ID')
      .setDesc('Syncthing folder ID, without setting this the plugin will pickup changes from any of your synced folders')
      .addText((text) =>
        text
          .setPlaceholder("")
          .setValue(this.plugin.settings.folderId)
          .onChange(async (value) => {
            this.plugin.settings.folderId = value;
            await this.plugin.saveSettings();
          })
      );
  }
}