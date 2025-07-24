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

  btn.innerHTML = "";
  btn.appendChild(pauseIcon);

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

  video.addEventListener("timeupdate", () => {
    seekBar.max = video.duration;
    seekBar.value = video.currentTime;
    const percent = (video.currentTime / video.duration) * 100;
    const thumbColor = document.body.classList.contains("dark") ? "#ff8080" : "#90ee90";
    const fillColor = document.body.classList.contains("dark") ? "#a03070" : "#ff0";
    const bgColor = document.body.classList.contains("dark") ? "#666" : "#ccc";
    seekBar.style.background = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${percent}%, ${bgColor} ${percent}%)`;
  });

  seekBar.addEventListener("input", () => {
    video.currentTime = seekBar.value;
  });

  fullscreenBtn.addEventListener("click", () => {
    const wrapper = video.closest(".videoWrapper");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapper.requestFullscreen();
    }
  });

  video.addEventListener("ended", () => {
    btn.innerHTML = "";
    btn.appendChild(playIcon);
  });

  video.addEventListener("play", () => {
    btn.innerHTML = "";
    btn.appendChild(pauseIcon);
  });

  video.addEventListener("pause", () => {
    btn.innerHTML = "";
    btn.appendChild(playIcon);
  });

  if (options?.onReady) {
    video.addEventListener("loadeddata", options.onReady);
  }
}
