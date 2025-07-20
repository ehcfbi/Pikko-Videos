function toggleTheme() {
  const dark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  document.getElementById("themeBtn").textContent = dark ? "Dark Mode" : "Light Mode";
}

// 初期化
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeBtn").textContent = "Dark Mode";
  }
});
