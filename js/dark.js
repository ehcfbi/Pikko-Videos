function toggleTheme() {
  const dark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");

  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.textContent = dark ? "Dark Mode" : "Light Mode";
  }

  const logoImg = document.querySelector(".logo");
  if (logoImg) {
    logoImg.src = dark ? "./logo_glow.png" : "./logo.png";
  }

  // 🎨 シークバー色更新（プレイヤーが存在する場合のみ）
  if (window.updateSeekBarColor) {
    setTimeout(() => updateSeekBarColor(), 50);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");
  const themeBtn = document.getElementById("themeBtn");
  const logoImg = document.querySelector(".logo");

  if (saved === "dark") {
    document.body.classList.add("dark");
    if (themeBtn) themeBtn.textContent = "Dark Mode";
    if (logoImg) logoImg.src = "./logo_glow.png";
  } else {
    if (themeBtn) themeBtn.textContent = "Light Mode";
    if (logoImg) logoImg.src = "./logo.png";
  }

  // 🎨 初期表示時にもシークバー色を即反映
  if (window.updateSeekBarColor) {
    setTimeout(() => updateSeekBarColor(), 50);
  }
});
