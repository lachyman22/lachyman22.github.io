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

      menu.style.left = `${rect.left}px`;
      menu.style.top = `${rect.bottom}px`;
      menu.style.display = "block";
      trigger.classList.add("menu-open");
      openMenu = menu;
    });
  });

  document.querySelectorAll(".copyable").forEach((item) => {
    item.addEventListener("click", (e) => {
      const text = item.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        const feedback = document.getElementById("copy-feedback");
        feedback.textContent = `Copied!`;

        const rect = item.getBoundingClientRect();
        feedback.style.left = `${rect.right + 8}px`;
        feedback.style.top = `${rect.top}px`;
        feedback.style.opacity = "1";

        clearTimeout(feedback._timeout);
        feedback._timeout = setTimeout(() => {
          feedback.style.opacity = "0";
        }, 1000);
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
