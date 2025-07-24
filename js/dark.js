// 初期設定：localStorageの値に基づいてテーマを反映
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  document.getElementById("themeBtn").textContent = "Light Mode";
} else {
  document.body.classList.remove("dark");
  document.getElementById("themeBtn").textContent = "Dark Mode";
}

// 切り替えボタン
function toggleTheme() {
  const body = document.body;
  const themeBtn = document.getElementById("themeBtn");

  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    themeBtn.textContent = "Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    body.classList.add("dark");
    themeBtn.textContent = "Light Mode";
    localStorage.setItem("theme", "dark");
  }

  // 💡 シークバーの色を即座に更新
  const video = document.getElementById("videoPlayer");
  const seekBar = document.getElementById("seekBar");
  if (video && seekBar) {
    const percent = (video.currentTime / video.duration) * 100;
    const fillColor = body.classList.contains("dark") ? "#a03070" : "#ff0";
    const bgColor = body.classList.contains("dark") ? "#666" : "#ccc";
    seekBar.style.background = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percent}%, ${bgColor} ${percent}%)`;
  }
}
