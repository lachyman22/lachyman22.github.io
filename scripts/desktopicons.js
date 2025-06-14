document.addEventListener("DOMContentLoaded", () => {
  const icons = document.querySelectorAll('.desktop-icon');

  icons.forEach(icon => {
    // Double-click to open window
    icon.addEventListener('dblclick', () => {
      const title = icon.dataset.title;
      spawnWindow(title);
    });

    // Single-click to select
    icon.addEventListener('click', (e) => {
      document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
      e.stopPropagation(); // prevents deselect from global click handler
    });

    // Dragging
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    icon.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - icon.offsetLeft;
      offsetY = e.clientY - icon.offsetTop;
      icon.style.position = 'absolute';
      icon.style.zIndex = 1000;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      icon.style.left = `${e.clientX - offsetX}px`;
      icon.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      icon.style.zIndex = '';
    });
  });

  // Deselect all when clicking on empty desktop
  document.addEventListener('click', () => {
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
  });
});
