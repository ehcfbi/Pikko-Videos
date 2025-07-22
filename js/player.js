function initCustomPlayer(video) {
  const container = document.getElementById("customPlayer");
  container.innerHTML = `
    <div class="custom-controls">
      <button id="playBtn">⏵︎</button>
      <input type="range" id="seekBar" value="0" min="0" max="100" />
      <span id="timeText">0:00 / 0:00</span>
    </div>
  `;

  const playBtn = container.querySelector("#playBtn");
  const seekBar = container.querySelector("#seekBar");
  const timeText = container.querySelector("#timeText");

  playBtn.onclick = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  video.onplay = () => playBtn.textContent = "⏸︎";
  video.onpause = () => playBtn.textContent = "⏵︎";

  video.ontimeupdate = () => {
    if (video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      seekBar.value = percent;
      timeText.textContent = formatTime(video.currentTime) + " / " + formatTime(video.duration);
    }
  };

  seekBar.oninput = () => {
    if (video.duration) {
      const time = (seekBar.value / 100) * video.duration;
      video.currentTime = time;
    }
  };
}

function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
