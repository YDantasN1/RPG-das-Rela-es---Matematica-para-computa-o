const sounds = {
  click: document.getElementById("snd-click"),
  hit: document.getElementById("snd-hit"),
  error: document.getElementById("snd-error"),
  win: document.getElementById("snd-win"),
};

function playSound(name) {
  const el = sounds[name];
  if (!el) return;
  el.currentTime = 0;
  el.play().catch(() => {});
}

export { playSound };
