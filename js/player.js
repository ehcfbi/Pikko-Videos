function initCustomPlayer(videoUrl) {
  const wrapper = document.createElement('div');
  wrapper.className = 'videoWrapper';

  const video = document.createElement('video');
  video.id = 'videoPlayer';
  video.src = videoUrl;
  video.controls = false;
  video.playsInline = true;

  const centerPlayPause = document.createElement('div');
  centerPlayPause.className = 'centerPlayPause';
  centerPlayPause.innerHTML = `<svg viewBox="0 0 64 64"><path d="M16 16h12v32H16zM36 16h12v32H36z"/></svg>`;

  const videoControls = document.createElement('div');
  videoControls.className = 'videoControls';

  const seekWrapper = document.createElement('div');
  seekWrapper.className = 'seekWrapper';

  const seekBar = document.createElement('input');
  seekBar.type = 'range';
  seekBar.className = 'seekBar';
  seekBar.value = 0;

  seekWrapper.appendChild(seekBar);

  const fullscreenBtn = document.createElement('div');
  fullscreenBtn.className = 'fullscreenBtn';
  fullscreenBtn.textContent = 'Fullscreen';

  videoControls.appendChild(seekWrapper);
  videoControls.appendChild(fullscreenBtn);

  wrapper.appendChild(video);
  wrapper.appendChild(centerPlayPause);
  wrapper.appendChild(videoControls);

  document.body.appendChild(wrapper);

  centerPlayPause.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', () => {
    centerPlayPause.style.opacity = 0;
    centerPlayPause.style.visibility = 'hidden';
    videoControls.style.opacity = 1;
    videoControls.style.visibility = 'visible';
  });

  video.addEventListener('pause', () => {
    centerPlayPause.style.opacity = 1;
    centerPlayPause.style.visibility = 'visible';
  });

  seekBar.addEventListener('input', () => {
    video.currentTime = (video.duration * seekBar.value) / 100;
  });

  video.addEventListener('timeupdate', () => {
    seekBar.value = (video.currentTime / video.duration) * 100;
  });

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      wrapper.classList.add('fullscreen');
    } else {
      wrapper.classList.remove('fullscreen');
    }
  });
}
