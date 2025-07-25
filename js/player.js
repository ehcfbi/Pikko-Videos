function initializePlayer(video, options = {}) {
  const wrapper = video.closest(".videoWrapper");
  const btn = wrapper.querySelector(".centerPlayPause");
  const seekBar = wrapper.querySelector(".seekBar");
  const fullscreenBtn = wrapper.querySelector(".fullscreenBtn");
  const controls = wrapper.querySelector(".videoControls");

  video.controls = false;
  video.autoplay = false;
  video.playsInline = true;

  const playIcon = document.getElementById("playIcon").content.cloneNode(true);
  const pauseIcon = document.getElementById("pauseIcon").content.cloneNode(true);

  const setPlayIcon = () => {
    btn.innerHTML = "";
    btn.appendChild(playIcon.cloneNode(true));
  };

  const setPauseIcon = () => {
    btn.innerHTML = "";
    btn.appendChild(pauseIcon.cloneNode(true));
  };

  const showControls = () => {
    wrapper.classList.remove("hide-controls");
  };

  const hideControls = () => {
    wrapper.classList.add("hide-controls");
  };

  let controlTimeout;
  const resetControlTimeout = () => {
    showControls();
    clearTimeout(controlTimeout);
    controlTimeout = setTimeout(() => {
      hideControls();
    }, 3000);
  };

  const updateSeekBarColor = () => {
    const percentage = (video.currentTime / video.duration) * 100 || 0;
    const mode = document.body.classList.contains("dark") ? "dark" : "light";
    seekBar.classList.remove("light-complete", "dark-complete");
    seekBar.classList.add(`${mode}-complete`);
    seekBar.style.background = `linear-gradient(to right, ${
      mode === "dark" ? "#a03070" : "#ff0"
    } 0%, ${mode === "dark" ? "#a03070" : "#ff0"} ${percentage}%, ${
      mode === "dark" ? "#666" : "#ccc"
    } ${percentage}%, ${mode === "dark" ? "#666" : "#ccc"} 100%)`;
  };

  window.updateSeekBarColor = updateSeekBarColor;

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

  seekBar.addEventListener("input", () => {
    video.currentTime = seekBar.value;
    updateSeekBarColor();
    resetControlTimeout();
  });

  fullscreenBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapper.requestFullscreen();
    }
  });

  video.addEventListener("timeupdate", () => {
    seekBar.value = video.currentTime;
    updateSeekBarColor();
  });

  video.addEventListener("loadeddata", () => {
    seekBar.max = video.duration;
    seekBar.value = video.currentTime;
    updateSeekBarColor();
    resetControlTimeout();
    if (options.onReady) options.onReady(video);
  });

  video.addEventListener("mousemove", resetControlTimeout);
  video.addEventListener("touchstart", resetControlTimeout);
  video.addEventListener("click", resetControlTimeout);

  video.addEventListener("play", setPauseIcon);
  video.addEventListener("pause", setPlayIcon);
  video.addEventListener("ended", setPlayIcon);

  wrapper.addEventListener("mouseenter", showControls);
  wrapper.addEventListener("mouseleave", hideControls);

  hideControls();
  setPlayIcon();
}
