const wrapper = document.querySelector(".videoWrapper");
const video = wrapper.querySelector("video");
const btn = wrapper.querySelector(".centerPlayPause");
const seekBar = wrapper.querySelector(".seekBar");
const fullscreenBtn = wrapper.querySelector(".fullscreenBtn");

const playIcon = document.querySelector("#playIconTemplate").content.cloneNode(true);
const pauseIcon = document.querySelector("#pauseIconTemplate").content.cloneNode(true);

let controlTimeout;

function setPlayIcon() {
  btn.innerHTML = "";
  btn.appendChild(playIcon.cloneNode(true));
}

function setPauseIcon() {
  btn.innerHTML = "";
  btn.appendChild(pauseIcon.cloneNode(true));
}

function resetControlTimeout() {
  wrapper.classList.remove("hide-controls");
  clearTimeout(controlTimeout);
  controlTimeout = setTimeout(() => {
    wrapper.classList.add("hide-controls");
  }, 3000);
}

function toggleControls() {
  if (wrapper.classList.contains("hide-controls")) {
    resetControlTimeout();
  } else {
    wrapper.classList.add("hide-controls");
    clearTimeout(controlTimeout);
  }
}

wrapper.classList.add("hide-controls");

video.addEventListener("click", toggleControls);

// 👇 スマホ操作で一瞬だけ表示される問題への対応
video.addEventListener("touchstart", (e) => {
  e.preventDefault();
  resetControlTimeout();
});

wrapper.addEventListener("mouseenter", resetControlTimeout);

btn.addEventListener("click", () => {
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

seekBar.addEventListener("input", () => {
  const value = seekBar.value;
  video.currentTime = value;
  updateSeekBarColor();
});

video.addEventListener("timeupdate", () => {
  seekBar.value = video.currentTime;
  updateSeekBarColor();
});

video.addEventListener("loadeddata", () => {
  seekBar.max = video.duration;
  updateSeekBarColor();
});

function updateSeekBarColor() {
  const value = (seekBar.value / seekBar.max) * 100;
  const color = document.body.classList.contains("dark")
    ? "#888888"
    : "#cccccc";
  seekBar.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${value}%, #aaaaaa ${value}%, #aaaaaa 100%)`;
}

window.updateSeekBarColor = updateSeekBarColor;

fullscreenBtn.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    wrapper.requestFullscreen();
  }
});
