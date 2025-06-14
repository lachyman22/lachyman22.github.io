document.addEventListener("DOMContentLoaded", () => {
  const icons = document.querySelectorAll('.desktop-icon');

  icons.forEach(icon => {
    icon.addEventListener('dblclick', () => {
      const title = icon.dataset.title;
      spawnWindow(title);
    });

    icon.addEventListener('click', (e) => {
      document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
      e.stopPropagation(); 
    });

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

  document.addEventListener('click', () => {
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
  });
});
