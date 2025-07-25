function setupPlayer(options) {
  const video = document.querySelector("video");
  const controls = document.querySelector(".videoControls");
  const seekBar = document.querySelector(".seekBar");
  const playButton = document.querySelector(".playButton");
  const fullscreenButton = document.querySelector(".fullscreenButton");

  let hideTimeout;

  function showControls() {
    controls.classList.remove("hide-controls");
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      controls.classList.add("hide-controls");
    }, 3000);
  }

  function toggleControls() {
    if (controls.classList.contains("hide-controls")) {
      showControls();
    } else {
      controls.classList.add("hide-controls");
    }
  }

  function updateSeekBarColor() {
    const percent = video.currentTime / video.duration;
    const color = document.body.classList.contains("dark") ? "#ccc" : "#333";
    seekBar.style.background = `linear-gradient(to right, ${color} ${percent * 100}%, transparent ${percent * 100}%)`;
  }

  function setPlayIcon() {
    playButton.innerHTML = "▶️";
  }

  function setPauseIcon() {
    playButton.innerHTML = "⏸️";
  }

  playButton.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", () => {
    setPauseIcon();
  });

  video.addEventListener("pause", () => {
    setPlayIcon();
  });

  video.addEventListener("timeupdate", () => {
    seekBar.value = video.currentTime;
    updateSeekBarColor();
  });

  seekBar.addEventListener("input", () => {
    video.currentTime = seekBar.value;
    updateSeekBarColor();
  });

  fullscreenButton.addEventListener("click", () => {
    const wrapper = document.querySelector(".videoWrapper");
    if (wrapper.requestFullscreen) {
      wrapper.requestFullscreen();
    } else if (wrapper.webkitRequestFullscreen) {
      wrapper.webkitRequestFullscreen();
    } else if (wrapper.msRequestFullscreen) {
      wrapper.msRequestFullscreen();
    }
  });

  video.addEventListener("click", toggleControls);
  video.addEventListener("touchstart", toggleControls);

  video.addEventListener("mousemove", showControls);
  video.addEventListener("touchmove", showControls);

  seekBar.max = video.duration;

  if (options?.onReady) {
    video.addEventListener("loadedmetadata", options.onReady);
  }

  window.updateSeekBarColor = updateSeekBarColor;
}
