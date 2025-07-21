function toggleTheme() {
  const dark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  document.getElementById("themeBtn").textContent = dark ? "Dark Mode" : "Light Mode";

  // ロゴ切り替え
  const logoImg = document.querySelector(".logo");
  if (logoImg) {
    logoImg.src = dark ? "./logo_glow.png" : "./logo.png"; // パスは環境に合わせて
  }
}

// 初期化
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");
  const logoImg = document.querySelector(".logo");

  if (saved === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeBtn").textContent = "Dark Mode";
    if (logoImg) logoImg.src = "./logo_glow.png";
  } else {
    if (logoImg) logoImg.src = "./logo.png";
  }
});
