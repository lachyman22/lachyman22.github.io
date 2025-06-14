document.addEventListener("DOMContentLoaded", () => {
  const icons = document.querySelectorAll(".desktop-icon");

  icons.forEach((icon) => {
    icon.addEventListener("dblclick", () => {
      const title = icon.dataset.title;
      spawnWindow(title, 1000, 300);
    });

    icon.addEventListener("click", (e) => {
      document
        .querySelectorAll(".desktop-icon")
        .forEach((i) => i.classList.remove("selected"));
      icon.classList.add("selected");
      e.stopPropagation();
    });

    let isDragging = false;
    let offsetX = 0,
      offsetY = 0;

    icon.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - icon.offsetLeft;
      offsetY = e.clientY - icon.offsetTop;
      icon.style.position = "absolute";
      icon.style.zIndex = 1000;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const iconWidth = icon.offsetWidth;
      const iconHeight = icon.offsetHeight;
      const maxLeft = window.innerWidth - iconWidth;
      const maxTop = window.innerHeight - iconHeight;

      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(26, Math.min(newTop, maxTop)); // 26px = height of menu bar

      icon.style.left = `${newLeft}px`;
      icon.style.top = `${newTop}px`;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      icon.style.zIndex = "";
    });
  });

  document.addEventListener("click", () => {
    document
      .querySelectorAll(".desktop-icon")
      .forEach((i) => i.classList.remove("selected"));
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".desktop-icon").forEach((icon) => {
      const rect = icon.getBoundingClientRect();
      const iconWidth = icon.offsetWidth;
      const iconHeight = icon.offsetHeight;

      let newLeft = icon.offsetLeft;
      let newTop = icon.offsetTop;

      const maxLeft = window.innerWidth - iconWidth;
      const maxTop = window.innerHeight - iconHeight;

      if (newLeft > maxLeft) newLeft = maxLeft;
      if (newTop > maxTop) newTop = maxTop;

      newLeft = Math.max(0, newLeft);
      newTop = Math.max(26, newTop);

      icon.style.left = `${newLeft}px`;
      icon.style.top = `${newTop}px`;
    });
  });
});
