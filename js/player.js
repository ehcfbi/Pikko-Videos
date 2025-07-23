export function initCustomPlayer(url, options = {}) {
  const video = document.getElementById("videoPlayer");
  const btn = document.getElementById("centerPlayPause");
  const playIcon = document.getElementById("playIcon").content.cloneNode(true);
  const pauseIcon = document.getElementById("pauseIcon").content.cloneNode(true);

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

  if (options?.onReady) {
    video.addEventListener("loadeddata", options.onReady);
  }
}
