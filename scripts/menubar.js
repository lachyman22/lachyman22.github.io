document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".dropdown-trigger");
  const menus = {
    github: document.getElementById("dropdown-github"),
    prof: document.getElementById("dropdown-prof"),
    contact: document.getElementById("dropdown-contact"),
    apple: document.getElementById("dropdown-apple"),
    about: document.getElementById("dropdown-about"),
  };

  let openMenu = null;

  function closeMenus() {
    Object.values(menus).forEach((menu) => (menu.style.display = "none"));
    document
      .querySelectorAll(".dropdown-trigger")
      .forEach((el) => el.classList.remove("menu-open"));
    openMenu = null;
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const key = trigger.dataset.menu;
      const menu = menus[key];
      const rect = trigger.getBoundingClientRect();

      if (openMenu === menu) {
        trigger.classList.remove("menu-open");
        closeMenus();
        return;
      }

      closeMenus();

      const menuWidth = menu.offsetWidth || 180;
      let left = rect.left;

      const padding = 16;
      const maxLeft = window.innerWidth - menuWidth - padding;
      if (left > maxLeft) {
        left = Math.max(padding, maxLeft - 90); // extra nudge left
      }

      menu.style.left = `${left}px`;
      menu.style.top = `${rect.bottom}px`;

      menu.style.display = "block";
      trigger.classList.add("menu-open");
      openMenu = menu;
    });
  });

  document.querySelectorAll(".copyable").forEach((item) => {
    item.addEventListener("click", (e) => {
      const text = item.dataset.copy;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          const feedback = document.getElementById("copy-feedback");
          feedback.textContent = `Copied!`;

          const rect = item.getBoundingClientRect();
          const safeLeft = Math.min(rect.right + 8, window.innerWidth - 100);
          const safeTop = Math.max(rect.top, 40);
          feedback.style.left = `${safeLeft}px`;
          feedback.style.top = `${safeTop}px`;
          feedback.style.opacity = "1";

          clearTimeout(feedback._timeout);
          feedback._timeout = setTimeout(() => {
            feedback.style.opacity = "0";
          }, 1000);
        })
        .catch(() => {
          alert("Copy failed – your browser may not support it.");
        });

      e.stopPropagation(); // don't close dropdown immediately
    });
  });

  document.addEventListener("click", () => closeMenus());

  document.getElementById("close-all-windows").addEventListener("click", () => {
    document.querySelectorAll(".window").forEach((win) => win.remove());
  });

  document.getElementById("open-about-window").addEventListener("click", () => {
    spawnWindow("About", 1000, 635, 100, 80);
  });
});
