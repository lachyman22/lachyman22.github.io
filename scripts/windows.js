document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("window-container");

  document.querySelectorAll(".dock-item").forEach((item) => {
    item.addEventListener("click", () => {
      const label = item.querySelector(".dock-label").textContent;
      spawnWindow(label);
    });
  });
});

function spawnWindow(title) {
  const container = document.getElementById("window-container");

  const win = document.createElement("div");
  win.className = "window";
  win.style.top = `${100 + Math.random() * 200}px`;
  win.style.left = `${100 + Math.random() * 200}px`;

  win.innerHTML = `
    <div class="window-header">
      <img src="assets/buttons/red.png" class="window-btn btn-close" data-hover="assets/buttons/red-hover.png" data-src="assets/buttons/red.png" />
      <img src="assets/buttons/yellow.png" class="window-btn btn-minimize" data-hover="assets/buttons/yellow-hover.png" data-src="assets/buttons/yellow.png" />
      <img src="assets/buttons/green.png" class="window-btn btn-zoom" data-hover="assets/buttons/green-hover.png" data-src="assets/buttons/green.png" />
      <div class="window-title">${title}</div>
    </div>
    <div class="window-content">Loading...</div>
  `;

  const header = win.querySelector(".window-header");
  win.style.minHeight = `23px`;

  win.querySelectorAll(".window-btn").forEach(btn => {
    const original = btn.getAttribute("data-src");
    const hover = btn.getAttribute("data-hover");
    btn.addEventListener("mouseenter", () => btn.src = hover);
    btn.addEventListener("mouseleave", () => btn.src = original);
  });

  win.querySelector(".btn-close").addEventListener("click", () => win.remove());

  const zoomBtn = win.querySelector(".btn-zoom");
  zoomBtn.addEventListener("click", () => {
    const content = win.querySelector(".window-content");
    if (isMinimized) {
      content.style.display = "";
      isMinimized = false;
    }
    const newHeight = content.scrollHeight + header.offsetHeight;
    win.style.height = `${newHeight}px`;
  });

  const minimizeBtn = win.querySelector(".btn-minimize");
  let isMinimized = false;
  minimizeBtn.addEventListener("click", () => {
    const content = win.querySelector(".window-content");
    if (!isMinimized) {
      win.dataset.originalHeight = win.style.height;
      content.style.display = "none";
      win.style.height = `${header.offsetHeight}px`;
      isMinimized = true;
    } else {
      content.style.display = "";
      win.style.height = win.dataset.originalHeight || "300px";
      isMinimized = false;
    }
  });

  let offsetX, offsetY, isDragging = false;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = parseInt(win.style.zIndex) + 1 || 101;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    requestAnimationFrame(() => {
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    });
  });

  document.addEventListener("mouseup", () => isDragging = false);

    const safeTitle = title.trim().toLowerCase().replace(/[^a-z0-9]/gi, '');
    const contentDiv = win.querySelector(".window-content");

    fetch(`windows/${safeTitle}.html`)
    .then(res => res.ok ? res.text() : Promise.reject("404"))
    .then(html => contentDiv.innerHTML = html)
    .catch(() => contentDiv.innerHTML = `<p><strong>${title}</strong> content not found.</p>`);

  container.appendChild(win);
}

window.spawnWindow = spawnWindow;
