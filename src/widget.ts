export const createWidget = (containerEl: HTMLElement): HTMLElement => {
  const floatingDiv = document.createElement('div');
  floatingDiv.textContent = 'This is a floating widget';
  floatingDiv.classList.add('floating-widget');

  document.body.appendChild(floatingDiv);

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

  return floatingDiv;
};
