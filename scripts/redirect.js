function handleViewportRedirect() {
  const isMobile = window.innerWidth <= 1000;
  const onMobilePage = window.location.pathname.includes("mobile.html");
  const onDesktopPage =
    window.location.pathname.includes("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html";

  if (isMobile && !onMobilePage) {
    window.location.href = "mobile.html";
  }

  if (!isMobile && onMobilePage) {
    window.location.href = "index.html";
  }
}

handleViewportRedirect();
window.addEventListener("resize", handleViewportRedirect);
