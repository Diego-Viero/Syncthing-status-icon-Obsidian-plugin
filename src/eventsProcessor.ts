import { SyncthingMonitor } from "./SyncthingMonitor";
import { EventType } from "../types/events/eventType";
import { SyncthingEvent } from "types/events";
import { Icon } from "types/iconEnum";
import { Notice } from "obsidian";

export const eventProcessor = (event: SyncthingEvent, monitor: SyncthingMonitor) => {

  console.log(event.type, event.data);

  switch (event.type) {

    // --- Folder Completion ---
    case EventType.FolderCompletion:

      // Avoid processing changes from other folders
      if (monitor.folderId && event.data.folder !== monitor.folderId)
        break;

      const completion = event.data.completion;
      const globalItems = event.data.globalItems;
      const needItems = event.data.needItems;
      monitor.fileCompletion = completion; // Percentage of synced files
      monitor.globalItems = globalItems;
      monitor.needItems = needItems;

      if (completion !== 100) {
        monitor.setStatusIcon(Icon.YELLOW_CIRCLE)
      } else  {
        monitor.setStatusIcon(Icon.GREEN_CIRCLE)
      }
      break;

    // --- State Changed ---
    case EventType.StateChanged:

      // Avoid processing changes from other folders
      if (monitor.folderId && event.data.folder !== monitor.folderId)
        break;

      const newStatus = event.data.to;  //idle, scanning, scan-waiting
      monitor.status = newStatus;

      if (newStatus === "scanning") {
        monitor.setStatusIcon(Icon.YELLOW_CIRCLE);
      } else {
        monitor.setStatusIcon(Icon.GREEN_CIRCLE);
      }
      break;

    // --- Device Disconnected ---
    //TODO not triggered when internet connection is lost
    case EventType.DeviceDisconnected:
      monitor.setStatusIcon(Icon.RED_CIRCLE);
      monitor.status = "Disconnected";
      break;

  }
}
