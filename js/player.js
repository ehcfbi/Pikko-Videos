function initCustomPlayer(url, options = {}) {
  const video = document.getElementById("videoPlayer");
  const playIcon = document.getElementById("playIcon").content.cloneNode(true);
  const pauseIcon = document.getElementById("pauseIcon").content.cloneNode(true);
  const btn = document.getElementById("centerPlayPause");
  const seekBar = document.getElementById("seekBar");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const wrapper = video.closest(".videoWrapper");

  let controlTimeout;

  video.src = url;
  video.controls = false;
  video.autoplay = true;
  video.playsInline = true;

  updateSeekBarColor();

  // 🔘 タップで UI 表示／非表示の切り替え
  video.addEventListener("click", () => {
    if (wrapper.classList.contains("hide-controls")) {
      wrapper.classList.remove("hide-controls");
      resetControlTimeout();
    } else {
      wrapper.classList.add("hide-controls");
      clearTimeout(controlTimeout);
    }
  });

  // 🖱️ ホバー時に表示し、3秒後に自動非表示
  wrapper.addEventListener("mouseenter", () => {
    wrapper.classList.remove("hide-controls");
    resetControlTimeout();
  });

  wrapper.addEventListener("mouseleave", () => {
    resetControlTimeout();
  });

  function resetControlTimeout() {
    clearTimeout(controlTimeout);
    controlTimeout = setTimeout(() => {
      wrapper.classList.add("hide-controls");
    }, 3000);
  }

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
    resetControlTimeout(); // 再操作時にも自動非表示のタイマー再設定
  });

  fullscreenBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapper.requestFullscreen();
    }
    resetControlTimeout();
  });

  seekBar.addEventListener("input", () => {
    video.currentTime = seekBar.value;
    updateSeekBarColor();
    resetControlTimeout();
  });

  video.addEventListener("timeupdate", () => {
    seekBar.max = video.duration;
    seekBar.value = video.currentTime;
    updateSeekBarColor();
  });

  video.addEventListener("play", () => {
    setPauseIcon();
    resetControlTimeout();
  });

  video.addEventListener("pause", () => {
    setPlayIcon();
    resetControlTimeout();
  });

  video.addEventListener("ended", setPlayIcon);

  function updateSeekBarColor() {
    if (!seekBar || !video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    const isDark = document.body.classList.contains("dark");
    const fillColor = isDark ? "#a03070" : "#ff0";
    const bgColor = isDark ? "#666" : "#ccc";
    seekBar.style.background = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percent}%, ${bgColor} ${percent}%)`;
  }

  window.updateSeekBarColor = updateSeekBarColor;

  if (options?.onReady) {
    video.addEventListener("loadeddata", options.onReady);
  }

  if (video.paused) {
    setPlayIcon();
  } else {
    setPauseIcon();
  }

  resetControlTimeout(); // 初期表示時にも自動消失タイマーを開始
}
