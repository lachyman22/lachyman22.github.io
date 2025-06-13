document.addEventListener('DOMContentLoaded', () => {
  const dock = document.getElementById('dock-icons');
  const items = [...dock.querySelectorAll('.dock-item')];
  const dockBg = document.getElementById('dock-bg');
  const maxScale = 1.8;
  const baseScale = 1;
  const influence = 250;

  dock.addEventListener('mousemove', (e) => {
    const rect = dock.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    let anyActive = false;

    items.forEach((item) => {
      const icon = item.querySelector('.dock-icon');
      const reflection = item.querySelector('.dock-reflection');
      const itemRect = item.getBoundingClientRect();
      const iconX = itemRect.left + itemRect.width / 2 - rect.left;

      const dist = Math.abs(mouseX - iconX);
      const norm = Math.max(0, 1 - dist / influence);
      const scale = baseScale + (maxScale - baseScale) * Math.pow(norm, 3);

      icon.style.transform = `scale(${scale})`;
      reflection.style.transform = `scale(${scale}) scaleY(-1)`;

      if (norm > 0.01) anyActive = true;
    });

    dockBg.style.maxWidth = anyActive ? '1100px' : '1000px';
  });

  dock.addEventListener('mouseleave', () => {
    items.forEach((item) => {
      const icon = item.querySelector('.dock-icon');
      const reflection = item.querySelector('.dock-reflection');
      icon.style.transform = `scale(${baseScale})`;
      reflection.style.transform = `scale(${baseScale}) scaleY(-1)`;
    });

    dockBg.style.maxWidth = `1000px`;
  });
});
