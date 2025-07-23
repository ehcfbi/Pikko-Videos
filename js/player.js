function initCustomPlayer(videoUrl) {
  const container = document.getElementById("customPlayer");

  container.innerHTML = `
    <video id="videoOverlay" src="${videoUrl}" muted playsinline autoplay></video>
    <div id="playOverlay">
      <img src="img/play.svg" alt="play" width="64" height="64">
    </div>
    <div class="custom-controls">
      <input type="range" id="seekBar" value="0" min="0" max="100" />
      <span id="timeText">0:00 / 0:00</span>
      <button id="fsBtn">⛶</button>
    </div>
  `;

  const video = container.querySelector("#videoOverlay");
  const overlay = container.querySelector("#playOverlay");
  const seekBar = container.querySelector("#seekBar");
  const timeText = container.querySelector("#timeText");
  const fsBtn = container.querySelector("#fsBtn");

  overlay.onclick = () => video.play();
  video.onclick = () => video.paused ? video.play() : video.pause();
  video.onpause = () => (overlay.style.display = "block");
  video.onplay = () => (overlay.style.display = "none");

  video.ontimeupdate = () => {
    if (video.duration) {
      seekBar.value = (video.currentTime / video.duration) * 100;
      timeText.textContent = formatTime(video.currentTime) + " / " + formatTime(video.duration);
    }
  };

  seekBar.oninput = () => {
    if (video.duration) {
      video.currentTime = (seekBar.value / 100) * video.duration;
    }
  };

  fsBtn.onclick = () => {
    const playerBox = document.getElementById("customPlayer");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      playerBox.requestFullscreen();
    }
  };

  // 🕒 UI自動非表示管理
  let lastMouseMove = Date.now();
  let hideTimeout;

  function updateMouseTime() {
    lastMouseMove = Date.now();
    showUI();
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(checkIdle, 3000);
  }

  function checkIdle() {
    if (Date.now() - lastMouseMove >= 3000) {
      hideUI();
    }
  }

  function showUI() {
    container.classList.remove("hide-ui");
  }

  function hideUI() {
    container.classList.add("hide-ui");
  }

  container.addEventListener("mousemove", updateMouseTime);
  hideTimeout = setTimeout(checkIdle, 3000);
}

function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
