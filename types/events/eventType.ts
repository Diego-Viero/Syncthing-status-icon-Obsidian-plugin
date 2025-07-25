export enum EventType {
  ClusterConfigReceived = 'ClusterConfigReceived',
  ConfigSaved = 'ConfigSaved',
  DeviceConnected = 'DeviceConnected',
  DeviceDisconnected = 'DeviceDisconnected',
  DeviceDiscovered = 'DeviceDiscovered',
  DevicePaused = 'DevicePaused',
  DeviceRejected = 'DeviceRejected', // DEPRECATED
  DeviceResumed = 'DeviceResumed',
  DownloadProgress = 'DownloadProgress',
  Failure = 'Failure',
  FolderCompletion = 'FolderCompletion',
  FolderErrors = 'FolderErrors',
  FolderPaused = 'FolderPaused',
  FolderRejected = 'FolderRejected', // DEPRECATED
  FolderResumed = 'FolderResumed',
  FolderScanProgress = 'FolderScanProgress',
  FolderSummary = 'FolderSummary',
  FolderWatchStateChanged = 'FolderWatchStateChanged',
  ItemFinished = 'ItemFinished',
  ItemStarted = 'ItemStarted',
  ListenAddressesChanged = 'ListenAddressesChanged',
  LocalChangeDetected = 'LocalChangeDetected',
  LocalIndexUpdated = 'LocalIndexUpdated',
  LoginAttempt = 'LoginAttempt',
  PendingDevicesChanged = 'PendingDevicesChanged',
  PendingFoldersChanged = 'PendingFoldersChanged',
  RemoteChangeDetected = 'RemoteChangeDetected',
  RemoteDownloadProgress = 'RemoteDownloadProgress',
  RemoteIndexUpdated = 'RemoteIndexUpdated',
  Starting = 'Starting',
  StartupComplete = 'StartupComplete',
  StateChanged = 'StateChanged'
}
