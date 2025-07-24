// 初期設定：localStorageの値に基づいてテーマを反映
const savedTheme = localStorage.getItem("theme");
const body = document.body;
const themeBtn = document.getElementById("themeBtn");

if (savedTheme === "dark") {
  body.classList.add("dark");
  if (themeBtn) themeBtn.textContent = "Light Mode";
} else {
  body.classList.remove("dark");
  if (themeBtn) themeBtn.textContent = "Dark Mode";
}

// テーマ切り替え関数
function toggleTheme() {
  const body = document.body;
  const themeBtn = document.getElementById("themeBtn");

  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    localStorage.setItem("theme", "light");
    if (themeBtn) themeBtn.textContent = "Dark Mode";
  } else {
    body.classList.add("dark");
    localStorage.setItem("theme", "dark");
    if (themeBtn) themeBtn.textContent = "Light Mode";
  }

  // 💡 シークバー更新（存在する場合）
  if (window.updateSeekBarColor) {
    setTimeout(() => {
      updateSeekBarColor();
    }, 50);
  }
}
