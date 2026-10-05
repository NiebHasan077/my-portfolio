(() => {
  const saved = localStorage.getItem("portfolio-theme");
  const theme =
    saved ||
    (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "light" ? "#f4f7fb" : "#0b1118");
})();
