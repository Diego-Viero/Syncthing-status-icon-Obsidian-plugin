import {
  FolderCompletionEvent,
  FolderSummaryEvent,
  RemoteIndexUpdatedEvent,
  StateChangedEvent,
  LocalIndexUpdatedEvent,
  FolderScanProgressEvent,
  DeviceDisconnectedEvent
} from "./eventInterfaces";

 
type SpecificSyncthingEvent =
  | FolderCompletionEvent
  | FolderSummaryEvent
  | RemoteIndexUpdatedEvent
  | StateChangedEvent
  | LocalIndexUpdatedEvent
  | FolderScanProgressEvent
  | DeviceDisconnectedEvent;

interface SyncthingEventMetadata {
  id: number;
  globalID: number;
  time: string;
}

export type SyncthingEvent = SyncthingEventMetadata & SpecificSyncthingEvent;