function show(id) {
  document.getElementById(id)?.classList.remove("hidden");
}

function hide(id) {
  document.getElementById(id)?.classList.add("hidden");
}

function setEndScreen(win, score) {
  document.getElementById("end-title").textContent = win
    ? "VITORIA!"
    : "DERROTA!";
  document.getElementById("end-score").textContent = `Pontos: ${score}`;
}

function fadeOutThen(id, callback) {
  const el = document.getElementById(id);
  el.classList.add("anim-fade-out");
  setTimeout(() => {
    el.classList.remove("anim-fade-out");
    callback();
  }, 520);
}

export { show, hide, setEndScreen, fadeOutThen };
