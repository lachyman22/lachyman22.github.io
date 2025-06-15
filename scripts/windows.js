let highestZ = 101;

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("window-container");

  document.querySelectorAll(".dock-item").forEach((item) => {
    item.addEventListener("click", () => {
      const label = item.querySelector(".dock-label").textContent;
      spawnWindow(label);
    });
  });
});

function spawnWindow(
  title,
  width = 500,
  height = 300,
  top = null,
  left = null
) {
  const isMobile = window.innerWidth <= 1000;
  if (isMobile) {
    const container = document.getElementById("window-container");
    if (isMobile) {
      document.querySelectorAll(".window").forEach((win) => win.remove());
    }
    const mobileWin = document.createElement("div");
    mobileWin.className = "window mobile-window"; 
    mobileWin.style.top = `70px`;
    mobileWin.style.left = `5%`;
    mobileWin.style.width = `90%`;
    mobileWin.style.height = `70vh`;
    mobileWin.style.zIndex = ++highestZ;

    mobileWin.innerHTML = `
      <div class="window-header mobile-header">
        <div class="window-title">${title}</div>
        <button class="btn-close-mobile">×</button>
      </div>
      <div class="window-content">Loading...</div>
    `;

    mobileWin
      .querySelector(".btn-close-mobile")
      .addEventListener("click", () => {
        mobileWin.remove();
      });

    const contentDiv = mobileWin.querySelector(".window-content");
    const safeTitle = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "");

    fetch(`windows/${safeTitle}.html?v=1.1`)
      .then((res) => (res.ok ? res.text() : Promise.reject("404")))
      .then((html) => (contentDiv.innerHTML = html))
      .catch(
        () =>
          (contentDiv.innerHTML = `<p><strong>${title}</strong> content not found.</p>`)
      );

    container.appendChild(mobileWin);
    return; // skip the rest of the spawnWindow logic
  }
  const container = document.getElementById("window-container");

  const win = document.createElement("div");
  win.className = "window";
  const defaultTop = top !== null ? top : 100 + Math.random() * 200;
  const defaultLeft = left !== null ? left : 100 + Math.random() * 200;

  const maxTop = window.innerHeight - height - 20;
  const maxLeft = window.innerWidth - width - 20;

  win.style.top = `${Math.min(Math.max(26, defaultTop), maxTop)}px`;
  win.style.left = `${Math.min(Math.max(0, defaultLeft), maxLeft)}px`;

  highestZ++;
  win.style.zIndex = highestZ;
  // Always bring to front when clicked
  win.addEventListener("mousedown", () => {
    highestZ++;
    win.style.zIndex = highestZ;
  });

  win.innerHTML = `
    <div class="window-header">
      <img src="assets/buttons/red.png" class="window-btn btn-close" data-hover="assets/buttons/red-hover.png" data-src="assets/buttons/red.png" />
      <img src="assets/buttons/yellow.png" class="window-btn btn-minimize" data-hover="assets/buttons/yellow-hover.png" data-src="assets/buttons/yellow.png" />
      <img src="assets/buttons/green.png" class="window-btn btn-zoom" data-hover="assets/buttons/green-hover.png" data-src="assets/buttons/green.png" />
      <div class="window-title">${title}</div>
    </div>
    <div class="window-content">Loading...</div>
    <div class="resize-handle resize-right"></div>
    <div class="resize-handle resize-left"></div>
    <div class="resize-handle resize-bottom"></div>
    <div class="resize-handle resize-corner"></div>
  `;

  const header = win.querySelector(".window-header");
  win.style.minHeight = `23px`;
  win.style.minWidth = `200px`;
  win.style.width = `${width}px`;
  win.style.height = `${height}px`;

  win.querySelectorAll(".window-btn").forEach((btn) => {
    const original = btn.getAttribute("data-src");
    const hover = btn.getAttribute("data-hover");
    btn.addEventListener("mouseenter", () => (btn.src = hover));
    btn.addEventListener("mouseleave", () => (btn.src = original));
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

  let offsetX,
    offsetY,
    isDragging = false;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    highestZ++;
    win.style.zIndex = highestZ;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    requestAnimationFrame(() => {
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    });
  });

  document.addEventListener("mouseup", () => (isDragging = false));

  // Load window content
  const safeTitle = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "");
  const contentDiv = win.querySelector(".window-content");

  fetch(`windows/${safeTitle}.html?v=1.1`)
    .then((res) => (res.ok ? res.text() : Promise.reject("404")))
    .then((html) => (contentDiv.innerHTML = html))
    .catch(
      () =>
        (contentDiv.innerHTML = `<p><strong>${title}</strong> content not found.</p>`)
    );

  const startResizing = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = win.offsetWidth;
    const startHeight = win.offsetHeight;
    const startLeft = win.offsetLeft;

    const onMouseMove = (e) => {
      if (direction === "right") {
        win.style.width = `${Math.max(200, startWidth + e.clientX - startX)}px`;
      } else if (direction === "bottom") {
        win.style.height = `${Math.max(
          100,
          startHeight + e.clientY - startY
        )}px`;
      } else if (direction === "left") {
        const dx = startX - e.clientX;
        const newWidth = Math.max(200, startWidth + dx);
        const newLeft = startLeft - dx;
        win.style.width = `${newWidth}px`;
        win.style.left = `${newLeft}px`;
      } else if (direction === "corner") {
        win.style.width = `${Math.max(200, startWidth + e.clientX - startX)}px`;
        win.style.height = `${Math.max(
          100,
          startHeight + e.clientY - startY
        )}px`;
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  win
    .querySelector(".resize-right")
    .addEventListener("mousedown", (e) => startResizing(e, "right"));
  win
    .querySelector(".resize-left")
    .addEventListener("mousedown", (e) => startResizing(e, "left"));
  win
    .querySelector(".resize-bottom")
    .addEventListener("mousedown", (e) => startResizing(e, "bottom"));
  win
    .querySelector(".resize-corner")
    .addEventListener("mousedown", (e) => startResizing(e, "corner"));

  container.appendChild(win);
}

window.spawnWindow = spawnWindow;

document.addEventListener("DOMContentLoaded", () => {
  spawnWindow("About", 900, 635, 100, 80);
});
