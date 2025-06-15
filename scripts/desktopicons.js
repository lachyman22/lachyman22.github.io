document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.innerWidth <= 1000;
  const icons = document.querySelectorAll(".desktop-icon");

  icons.forEach((icon) => {
    const title = icon.dataset.title;
    const openWindow = () => spawnWindow(title, 1000, 300);

    if (isMobile) {
      icon.addEventListener(
        "touchend",
        (e) => {
          e.preventDefault();
          openWindow();
        },
        { passive: false }
      );

      icon.addEventListener("click", openWindow);
    } else {
      icon.addEventListener("dblclick", openWindow);
    }

    icon.addEventListener("click", (e) => {
      document
        .querySelectorAll(".desktop-icon")
        .forEach((i) => i.classList.remove("selected"));
      icon.classList.add("selected");
      e.stopPropagation();
    });

    if (!isMobile) {
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
        newTop = Math.max(26, Math.min(newTop, maxTop));

        icon.style.left = `${newLeft}px`;
        icon.style.top = `${newTop}px`;
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
        icon.style.zIndex = "";
      });
    }
  });
});
