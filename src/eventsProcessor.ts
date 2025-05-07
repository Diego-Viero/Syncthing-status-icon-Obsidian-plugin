import { SyncthingMonitor } from "./SyncthingMonitor";
import { EventType } from "../types/events/eventType";
import { SyncthingEvent } from "types/events";
import { Icon } from "types/iconEnum";

export const eventProcessor = (event: SyncthingEvent, monitor: SyncthingMonitor) => {

  switch (event.type) {

    // --- Folder Completion ---
    case EventType.FolderCompletion:

      // Avoid processing changes from other folders
      if (monitor.folderId && event.data.folder !== monitor.folderId)
        break;

      const completion = event.data.completion;
      monitor.setCompletion(completion); // Percentage of synced files

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
      monitor.setStatus(newStatus) 

      if (newStatus === "scanning") {
        monitor.setStatusIcon(Icon.YELLOW_CIRCLE);
      } else {
        monitor.setStatusIcon(Icon.GREEN_CIRCLE);
      }
      break;

    // --- Device Disconnected ---
    case EventType.DeviceDisconnected:
      monitor.setStatusIcon(Icon.RED_CIRCLE);
      monitor.setStatus("Disconnected");
      break;

  }
}