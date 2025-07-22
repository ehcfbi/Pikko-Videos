function initCustomPlayer(videoOriginal) {
  const container = document.getElementById("customPlayer");

  // 映像とUIの組み込み
  container.innerHTML = `
    <video id="videoOverlay" muted playsinline></video>
    <div id="playOverlay">⏵︎</div>
    <div class="custom-controls">
      <input type="range" id="seekBar" value="0" min="0" max="100" />
      <span id="timeText">0:00 / 0:00</span>
    </div>
  `;

  const video = container.querySelector("#videoOverlay");
  video.src = videoOriginal.src;
  video.currentTime = 0;

  const playOverlay = container.querySelector("#playOverlay");
  const seekBar = container.querySelector("#seekBar");
  const timeText = container.querySelector("#timeText");

  // 再生オーバーレイクリックで開始
  playOverlay.onclick = () => {
    video.play();
    playOverlay.style.display = "none";
  };

  video.onclick = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  video.onpause = () => {
    playOverlay.style.display = "block";
  };

  video.onplay = () => {
    playOverlay.style.display = "none";
  };

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
}

function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
