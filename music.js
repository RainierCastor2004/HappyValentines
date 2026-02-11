(() => {
  const audioSrc = 'music.mp3'; // place your audio file here
  const audio = new Audio(audioSrc);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.6;

  // Create or reuse an in-page <audio> element so music persists while SPA navigation occurs
  document.addEventListener('DOMContentLoaded', () => {
    let audioEl = document.getElementById('site-audio');
    if (!audioEl) {
      audioEl = document.createElement('audio');
      audioEl.id = 'site-audio';
      audioEl.src = audioSrc;
      audioEl.loop = true;
      audioEl.preload = 'auto';
      audioEl.volume = 0.6;
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
    }
    // Try to play; may be blocked until user gesture
    audioEl.play().catch(() => {});
    // expose for manual control
    window._bgAudio = audioEl;
  });
})();
