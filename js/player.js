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
    resetControlTimeout();
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

  video.addEventListener("loadeddata", () => {
    seekBar.max = video.duration;
    seekBar.value = video.currentTime;
    updateSeekBarColor();
    resetControlTimeout();
    if (options?.onReady) options.onReady(video);
  });

  function resetControlTimeout() {
    wrapper.classList.remove("hide-controls");
    clearTimeout(controlTimeout);
    controlTimeout = setTimeout(() => {
      wrapper.classList.add("hide-controls");
    }, 3000);
  }

  wrapper.addEventListener("mouseenter", resetControlTimeout);
  wrapper.addEventListener("mouseleave", resetControlTimeout);

  // 📱 タッチ・クリックどちらでも確実に表示をトリガー
  video.addEventListener("touchstart", (e) => {
    e.preventDefault(); // iOSの誤動作防止
    resetControlTimeout();
  });

  video.addEventListener("click", () => {
    resetControlTimeout();
  });

  video.addEventListener("play", setPauseIcon);
  video.addEventListener("pause", setPlayIcon);
  video.addEventListener("ended", setPlayIcon);

  if (video.paused) {
    setPlayIcon();
  } else {
    setPauseIcon();
  }
  resetControlTimeout();
}
