function initCustomPlayer(url, options = {}) {
  const video = document.getElementById("videoPlayer");
  const btn = document.getElementById("centerPlayPause");
  const playIcon = document.getElementById("playIcon").content.cloneNode(true);
  const pauseIcon = document.getElementById("pauseIcon").content.cloneNode(true);
  const seekBar = document.getElementById("seekBar");
  const volumeBar = document.getElementById("volumeBar");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  video.src = url;
  video.controls = false;
  video.autoplay = false;
  video.playsInline = true;

  btn.innerHTML = "";
  btn.appendChild(playIcon);

  btn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
      btn.innerHTML = "";
      btn.appendChild(pauseIcon);
    } else {
      video.pause();
      btn.innerHTML = "";
      btn.appendChild(playIcon);
    }
  });

  video.addEventListener("click", () => {
    btn.style.display = btn.style.display === "none" ? "block" : "none";
  });

  video.addEventListener("ended", () => {
    btn.innerHTML = "";
    btn.appendChild(playIcon);
  });

  video.addEventListener("timeupdate", () => {
    seekBar.max = video.duration;
    seekBar.value = video.currentTime;
  });

  seekBar.addEventListener("input", () => {
    video.currentTime = seekBar.value;
  });

  volumeBar.addEventListener("input", () => {
    video.volume = volumeBar.value;
  });

  fullscreenBtn.addEventListener("click", () => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  });

  if (options?.onReady) {
    video.addEventListener("loadeddata", options.onReady);
  }
}
