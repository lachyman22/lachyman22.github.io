document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("window-container");

  document.querySelectorAll(".dock-item").forEach((item, index) => {
    item.addEventListener("click", () => {
      const label = item.querySelector(".dock-label").textContent;
      spawnWindow(label);
    });
  });

  function spawnWindow(title) {
    const win = document.createElement("div");
    win.className = "window";
    win.style.top = `${100 + Math.random() * 200}px`;
    win.style.left = `${100 + Math.random() * 200}px`;

    win.innerHTML = `
        <div class="window-header">
        <div class="window-close"></div>
        <div class="window-minimize"></div>
        <div class="window-zoom"></div>
        <div class="window-title">${title}</div>
        </div>
    `;

    const header = win.querySelector(".window-header");
    const closeBtn = win.querySelector(".window-close");

    // Close window
    closeBtn.addEventListener("click", () => win.remove());

    // Drag behavior
    let offsetX, offsetY, isDragging = false;

    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      win.style.zIndex = parseInt(win.style.zIndex) + 1;
    });

    document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    requestAnimationFrame(() => {
        win.style.left = `${e.clientX - offsetX}px`;
        win.style.top = `${e.clientY - offsetY}px`;
    });
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    container.appendChild(win);
  }
});
