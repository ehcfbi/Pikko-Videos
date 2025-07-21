function toggleTheme() {
  const dark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  document.getElementById("themeBtn").textContent = dark ? "Dark Mode" : "Light Mode";
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode"); // 既存の切り替え処理
  const logoImg = document.querySelector(".logo");

  if (isDark) {
    logoImg.src = "./logo_glow.png"; // ダーク用ロゴ
  } else {
    logoImg.src = "./logo.png"; // ライト用ロゴ
  }

// 初期化
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeBtn").textContent = "Dark Mode";
  }
});
