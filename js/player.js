function initCustomPlayer(url, options = {}) {
  const video = document.getElementById("videoPlayer");
  const playIcon = document.getElementById("playIcon").content.cloneNode(true);
  const pauseIcon = document.getElementById("pauseIcon").content.cloneNode(true);
  const btn = document.getElementById("centerPlayPause");
  const seekBar = document.getElementById("seekBar");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  video.src = url;
  video.controls = false;
  video.autoplay = true;
  video.playsInline = true;

  updateSeekBarColor();

  function setPlayIcon() {
    btn.innerHTML = "";
    btn.appendChild(playIcon.cloneNode(true));
  }

  function setPauseIcon() {
    btn.innerHTML = "";
    btn.appendChild(pauseIcon.cloneNode(true));
  }

  btn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      setPauseIcon();
    } else {
      video.pause();
      setPlayIcon();
    }
  });

  fullscreenBtn.addEventListener("click", () => {
    const wrapper = video.closest(".videoWrapper");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapper.requestFullscreen();
    }
  });

  seekBar.addEventListener("input", () => {
    video.currentTime = seekBar.value;
    updateSeekBarColor();
  });

  video.addEventListener("timeupdate", () => {
    seekBar.max = video.duration;
    seekBar.value = video.currentTime;
    updateSeekBarColor();
  });

  video.addEventListener("play", setPauseIcon);
  video.addEventListener("pause", setPlayIcon);
  video.addEventListener("ended", setPlayIcon);

  function updateSeekBarColor() {
    if (!seekBar || !video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    const isDark = document.body.classList.contains("dark");
    const fillColor = isDark ? "#a03070" : "#ff0";
    const bgColor = isDark ? "#666" : "#ccc";
    seekBar.style.background = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percent}%, ${bgColor} ${percent}%)`;
  }

  // 外部からモード切替後に色更新したい場合
  window.updateSeekBarColor = updateSeekBarColor;

  if (options?.onReady) {
    video.addEventListener("loadeddata", options.onReady);
  }

  // 初期表示時にアイコンをセット
  if (video.paused) {
    setPlayIcon();
  } else {
    setPauseIcon();
  }
}

video.addEventListener("click", () => {
  const wrapper = video.closest(".videoWrapper");
  wrapper.classList.toggle("hide-controls");
});
