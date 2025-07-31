import { SyncthingMonitor } from "./SyncthingMonitor";

export const createWidget = (containerEl: HTMLElement, monitor: SyncthingMonitor): HTMLElement => {
  const floatingDiv = document.createElement('div');
  floatingDiv.classList.add('floating-widget');

  // Create elements for each line
  const statusLine = document.createElement('div');
  const completionLine = document.createElement('div');
  const totalFilesLine = document.createElement('div');
  const unsyncedFilesLine = document.createElement('div');
  const connectedDevicesLine = document.createElement('div');

  // Append each line to the main widget container
  floatingDiv.appendChild(statusLine);
  floatingDiv.appendChild(completionLine);
  floatingDiv.appendChild(totalFilesLine);
  floatingDiv.appendChild(unsyncedFilesLine);
  floatingDiv.appendChild(connectedDevicesLine);

  document.body.appendChild(floatingDiv);

  // Function to update the widget content
  const updateWidgetContent = () => {
    statusLine.textContent = ''; 

    if (monitor.status === 'Invalid API key' || !monitor.isTokenSet) {
      completionLine.textContent = '';
      totalFilesLine.textContent = '';
      unsyncedFilesLine.textContent = '';
      connectedDevicesLine.textContent = '';

      if (!monitor.isTokenSet)
        statusLine.textContent = 'Please insert your Syncthing API key in the plugin settings.';

      else if (monitor.status === 'Invalid API key')
        statusLine.textContent = 'Invalid Syncthing API key. Please check your settings.';

      return;
    }



    const parsedCompletionPercentage = monitor.fileCompletion !== undefined
      ? parseFloat(monitor.fileCompletion.toFixed(2))
      : undefined;

    //statusLine.textContent = `Status: ${monitor.status}`;
    completionLine.textContent = `Sync status: ${parsedCompletionPercentage ?? 'N/A'}%`;
    unsyncedFilesLine.textContent = `Files not synced: ${monitor.needItems ?? 'N/A'}`;
    connectedDevicesLine.textContent = `Connected devices: ${monitor.connectedDevicesCount}/${monitor.availableDevices}`;
  };

  // Initial update
  updateWidgetContent();

  // Listen for status updates from the monitor
  monitor.on('status-update', updateWidgetContent);

  containerEl.addEventListener('mouseenter', () => {
    floatingDiv.style.display = 'block';
    
    // Temporarily show it to measure size
    floatingDiv.style.visibility = 'hidden';
    floatingDiv.style.left = '0';
    floatingDiv.style.top = '0';

    requestAnimationFrame(() => {
      const rect = containerEl.getBoundingClientRect();
      const floatRect = floatingDiv.getBoundingClientRect();

      let left = rect.left + window.scrollX - floatRect.width + rect.width;
      const top = rect.top + window.scrollY - floatRect.height - 8;

      // Prevent going off-screen on the left
      if (left < 0) left = 8;

      floatingDiv.style.left = `${left}px`;
      floatingDiv.style.top = `${top}px`;

      floatingDiv.style.visibility = 'visible';
    });
  });

  containerEl.addEventListener('mouseleave', () => {
    floatingDiv.style.display = 'none';
  });

  // Return the floatingDiv, but also ensure the event listener is cleaned up if the widget is ever removed
  // (though in this plugin's lifecycle, it might not be explicitly removed)
  // For robustness, we could return a cleanup function or handle it in the plugin's onunload.
  return floatingDiv;
};
