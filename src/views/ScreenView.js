function show(id) {
  document.getElementById(id).classList.remove("hidden");
}

function hide(id) {
  document.getElementById(id).classList.add("hidden");
}

function fadeOutThen(id, callback) {
  const el = document.getElementById(id);
  el.classList.add("anim-intro-out");

  setTimeout(() => {
    el.classList.remove("anim-intro-out");
    callback();
  }, 850);
}

function setEndScreen(victory, score, stats, hardestTopic, functionType) {
  document.getElementById("end-title").textContent = victory
    ? "VITÓRIA"
    : "DERROTA";

  document.getElementById("end-score").textContent =
    `Pontuação final: ${score} pts`;

  document.getElementById("end-stats").innerHTML = `
    <div class="rounded-lg bg-black/25 border border-white/10 px-3 py-3">
      <p class="text-white/50 text-xs uppercase tracking-wider mb-1">Acertos</p>
      <p class="text-gold-light text-lg font-bold">${stats.correctAnswers}</p>
    </div>

    <div class="rounded-lg bg-black/25 border border-white/10 px-3 py-3">
      <p class="text-white/50 text-xs uppercase tracking-wider mb-1">Erros</p>
      <p class="text-red-300 text-lg font-bold">${stats.wrongAnswers}</p>
    </div>

    <div class="rounded-lg bg-black/25 border border-white/10 px-3 py-3">
      <p class="text-white/50 text-xs uppercase tracking-wider mb-1">Tempo esgotado</p>
      <p class="text-amber-200 text-lg font-bold">${stats.timeoutAnswers}</p>
    </div>

    <div class="rounded-lg bg-black/25 border border-white/10 px-3 py-3">
      <p class="text-white/50 text-xs uppercase tracking-wider mb-1">Maior combo</p>
      <p class="text-emerald-300 text-lg font-bold">${stats.maxCombo}</p>
    </div>
  `;

  document.getElementById("end-hardest-topic").textContent =
    `Conteúdo com mais dificuldade: ${hardestTopic}`;

  document.getElementById("end-function-type").textContent =
    `Último tipo enfrentado: ${functionType}`;
}

export { show, hide, setEndScreen, fadeOutThen };
