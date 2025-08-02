function initCustomPlayer(videoUrl) {
  const video = document.getElementById("videoPlayer");
  const centerPlayPause = document.getElementById("centerPlayPause");
  const videoControls = document.querySelector(".videoControls");
  const seekBar = document.getElementById("seekBar");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  video.src = videoUrl;
  video.load();

  // 初期アイコンの設定
  updateCenterIcon(true);

  // イベント登録（PC・スマホ両対応）
  video.addEventListener("pointerdown", toggleControls);
  centerPlayPause.addEventListener("pointerdown", togglePlayPause);
  fullscreenBtn.addEventListener("click", toggleFullScreen);

  // 再生・停止に応じたアイコン切替
  video.addEventListener("play", () => updateCenterIcon(false));
  video.addEventListener("pause", () => updateCenterIcon(true));

  // 時間更新に応じてシークバー更新
  video.addEventListener("timeupdate", () => {
    seekBar.value = video.currentTime;
  });

  // メタデータ取得後に最大時間設定
  video.addEventListener("loadedmetadata", () => {
    seekBar.max = video.duration;
  });

  // シークバー操作
  seekBar.addEventListener("input", () => {
    video.currentTime = seekBar.value;
  });

  function toggleControls() {
    const isVisible = videoControls.style.opacity === "1";
    const nextOpacity = isVisible ? "0" : "1";
    const nextVisibility = isVisible ? "hidden" : "visible";

    videoControls.style.opacity = nextOpacity;
    videoControls.style.visibility = nextVisibility;

    centerPlayPause.style.opacity = nextOpacity;
    centerPlayPause.style.visibility = nextVisibility;
  }

  function togglePlayPause() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      video.requestFullscreen?.() || video.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
  }

  function updateCenterIcon(showPlayIcon) {
    const templateId = showPlayIcon ? "playIcon" : "pauseIcon";
    const template = document.getElementById(templateId);
    centerPlayPause.innerHTML = "";
    centerPlayPause.appendChild(template.content.cloneNode(true));
  }
}
