function initCustomPlayer(url, options = {}) {
  const video = document.getElementById("videoPlayer");
  const wrapper = video.closest(".videoWrapper");
  const btn = document.getElementById("centerPlayPause");
  const seekBar = document.getElementById("seekBar");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  const playIcon = document.getElementById("playIcon").content.cloneNode(true);
  const pauseIcon = document.getElementById("pauseIcon").content.cloneNode(true);

  let controlTimeout;

  video.src = url;
  video.controls = false;
  video.autoplay = true;
  video.playsInline = true;

  function updateSeekBarColor() {
    if (!seekBar || !video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    const isDark = document.body.classList.contains("dark");
    const fillColor = isDark ? "#a03070" : "#ff0";
    const bgColor = isDark ? "#666" : "#ccc";
    seekBar.style.background = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percent}%, ${bgColor} ${percent}%)`;
  }
  window.updateSeekBarColor = updateSeekBarColor;

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
    showControls(); // ボタン押下時は表示
  });

  fullscreenBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapper.requestFullscreen();
    }
    showControls();
  });

  seekBar.addEventListener("input", () => {
    video.currentTime = seekBar.value;
    updateSeekBarColor();
    showControls();
  });

  video.addEventListener("timeupdate", () => {
    seekBar.max = video.duration;
    seekBar.value = video.currentTime;
    updateSeekBarColor();
  });

  video.addEventListener("loadeddata", () => {
    seekBar.max = video.duration;
    seekBar.value = video.currentTime;
    updateSeekBarColor();
    if (options?.onReady) options.onReady(video);
    hideControls(); // 初期状態で非表示
  });

  video.addEventListener("play", setPauseIcon);
  video.addEventListener("pause", setPlayIcon);
  video.addEventListener("ended", setPlayIcon);

  // 🎯 タップ/クリックで表示 ⇄ 非表示トグル
  video.addEventListener("click", toggleControls);
  video.addEventListener("touchstart", (e) => {
    e.preventDefault(); // iOSダブル発火防止
    toggleControls();
  });

  wrapper.addEventListener("mouseenter", showControls); // PCでのhover表示

  function showControls() {
    wrapper.classList.remove("hide-controls");
    clearTimeout(controlTimeout);
    controlTimeout = setTimeout(hideControls, 3000);
  }

  function hideControls() {
    wrapper.classList.add("hide-controls");
    clearTimeout(controlTimeout);
  }

  function toggleControls() {
    if (wrapper.classList.contains("hide-controls")) {
      showControls(); // 表示して3秒保持
    } else {
      hideControls(); // 即非表示
    }
  }

  if (video.paused) {
    setPlayIcon();
  } else {
    setPauseIcon();
  }
}
