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

  // 🌙 色更新（外部からも呼び出せる）
  function updateSeekBarColor() {
    if (!seekBar || !video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    const isDark = document.body.classList.contains("dark");
    const fillColor = isDark ? "#a03070" : "#ff0";
    const bgColor = isDark ? "#666" : "#ccc";
    seekBar.style.background = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percent}%, ${bgColor} ${percent}%)`;
  }
  window.updateSeekBarColor = updateSeekBarColor;

  // ▶️ 再生／停止アイコン切り替え
  function setPlayIcon() {
    btn.innerHTML = "";
    btn.appendChild(playIcon.cloneNode(true));
  }
  function setPauseIcon() {
    btn.innerHTML = "";
    btn.appendChild(pauseIcon.cloneNode(true));
  }

  // ⏯️ 中央ボタンによる再生／一時停止
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

  // 📺 フルスクリーンボタン
  fullscreenBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapper.requestFullscreen();
    }
    resetControlTimeout();
  });

  // 🎚️ seekBar 操作
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

  // ⏱️ 表示されたら3秒後に自動で非表示
  function resetControlTimeout() {
    wrapper.classList.remove("hide-controls");
    clearTimeout(controlTimeout);
    controlTimeout = setTimeout(() => {
      wrapper.classList.add("hide-controls");
    }, 3000);
  }

  // 🖱️ ホバー時も3秒タイマー
  wrapper.addEventListener("mouseenter", resetControlTimeout);
  wrapper.addEventListener("mouseleave", resetControlTimeout);

  // 📱 動画タップ／クリックでトグル
  video.addEventListener("click", () => {
    if (wrapper.classList.contains("hide-controls")) {
      resetControlTimeout();
    } else {
      wrapper.classList.add("hide-controls");
      clearTimeout(controlTimeout);
    }
  });

  // 🛠️ スマホタッチ表示の安定化（←今回の唯一の修正）
  video.addEventListener("touchstart", () => {
    if (wrapper.classList.contains("hide-controls")) {
      resetControlTimeout();
    } else {
      wrapper.classList.add("hide-controls");
      clearTimeout(controlTimeout);
    }
  });

  // ⏮️ 状態変化に応じたアイコン更新
  video.addEventListener("play", setPauseIcon);
  video.addEventListener("pause", setPlayIcon);
  video.addEventListener("ended", setPlayIcon);

  // 🌟 初期状態
  if (video.paused) {
    setPlayIcon();
  } else {
    setPauseIcon();
  }
  resetControlTimeout();
}
