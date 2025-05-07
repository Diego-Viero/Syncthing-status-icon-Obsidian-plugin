import { EventType } from "./eventType";

// FolderCompletion
export interface FolderCompletionEvent {
  type: EventType.FolderCompletion;
  data: {
    completion: number;
    device: string;
    folder: string;
    globalBytes: number;
    globalItems: number;
    needBytes: number;
    needDeletes: number;
    needItems: number;
    remoteState: string;
    sequence: number;
  };
}

// FolderSummary
export interface FolderSummaryEvent {
  type: EventType.FolderSummary;
  data: {
    folder: string;
    summary: {
      error: string;
      errors: number;
      globalBytes: number;
      globalDeleted: number;
      globalDirectories: number;
      globalFiles: number;
      globalSymlinks: number;
      globalTotalItems: number;
      ignorePatterns: boolean;
      inSyncBytes: number;
      inSyncFiles: number;
      invalid: string;
      localBytes: number;
      localDeleted: number;
      localDirectories: number;
      localFiles: number;
      localSymlinks: number;
      localTotalItems: number;
      needBytes: number;
      needDeletes: number;
      needDirectories: number;
      needFiles: number;
      needSymlinks: number;
      needTotalItems: number;
      pullErrors: number;
      receiveOnlyChangedBytes: number;
      receiveOnlyChangedDeletes: number;
      receiveOnlyChangedDirectories: number;
      receiveOnlyChangedFiles: number;
      receiveOnlyChangedSymlinks: number;
      receiveOnlyTotalItems: number;
      remoteSequence: Record<string, number>;
      sequence: number;
      state: string;
      stateChanged: string;
      version: number;
      watchError: string;
    };
  };
}

// RemoteIndexUpdated
export interface RemoteIndexUpdatedEvent {
  type: EventType.RemoteIndexUpdated;
  data: {
    device: string;
    folder: string;
    items: number;
  };
}

// StateChanged
export interface StateChangedEvent {
  type: EventType.StateChanged;
  data: {
    folder: string;
    from: string;
    duration: number;
    to: string;
  };
}

// LocalIndexUpdated
export interface LocalIndexUpdatedEvent {
  type: EventType.LocalIndexUpdated;
  data: {
    folder: string;
    items: number;
    filenames: string[];
    sequence: number;
    version: number;
  };
}

// FolderScanProgress
export interface FolderScanProgressEvent {
  type: EventType.FolderScanProgress;
  data: {
    total: number;
    rate: number;
    current: number;
    folder: string;
  };
}

// DeviceDisconnected
export interface DeviceDisconnectedEvent {
  type: EventType.DeviceDisconnected;
  data: {
    error: string,
    id: string
  };
}