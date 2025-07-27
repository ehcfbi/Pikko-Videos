function initCustomPlayer(url, options = {}) {
  const video = document.getElementById("videoPlayer");
  const wrapper = video.closest(".videoWrapper");
  const btn = document.getElementById("centerPlayPause");
  const seekBar = document.getElementById("seekBar");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  const playIcon = document.getElementById("playIcon").content.cloneNode(true);
  const pauseIcon = document.getElementById("pauseIcon").content.cloneNode(true);

  video.src = url;
  video.controls = false;
  video.autoplay = true;
  video.playsInline = true;

  // 🌙 色更新
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
  });

  fullscreenBtn.addEventListener("click", () => {
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

  video.addEventListener("loadeddata", () => {
    seekBar.max = video.duration;
    seekBar.value = video.currentTime;
    updateSeekBarColor();
    if (options?.onReady) options.onReady(video);
  });

  // ✅ トグル処理（クリック／タップで表示⇄非表示）
  function toggleControls() {
    wrapper.classList.toggle("hide-controls");
  }

  video.addEventListener("pointerup", toggleControls);

  video.addEventListener("play", setPauseIcon);
  video.addEventListener("pause", setPlayIcon);
  video.addEventListener("ended", setPlayIcon);

  if (video.paused) {
    setPlayIcon();
  } else {
    setPauseIcon();
  }

  // 初期は非表示
  wrapper.classList.add("hide-controls");

  // ✅ スマホフルスクリーン時に横向き＆サイズ最適化
  wrapper.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      const isMobile = /Android|iPhone|iPad/.test(navigator.userAgent);
      if (isMobile && screen.orientation?.lock) {
        screen.orientation.lock("landscape").catch(() => {});
      }
      video.style.width = "100vw";
      video.style.height = "100vh";
      video.style.objectFit = "contain";
    } else {
      video.style.width = "";
      video.style.height = "";
      video.style.objectFit = "";
    }
  });
}
