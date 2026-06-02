function updateScore(points) {
  const el = document.getElementById("score-display");
  if (!el) return;
  el.textContent = `${points} pts`;
}

function updateBars(playerHP, enemyHP) {
  const playerBar = document.getElementById("playerBar");
  const enemyBar = document.getElementById("enemyBar");

  if (playerBar) {
    playerBar.style.width = Math.max(0, playerHP) + "%";
  }

  if (enemyBar) {
    enemyBar.style.width = Math.max(0, enemyHP) + "%";
  }
}

function setLog(message) {
  const el = document.getElementById("log");
  if (!el) return;
  el.textContent = message;
}

function updateTimerDisplay(timeLeft) {
  const el = document.getElementById("timer-display");
  if (!el) return;

  if (timeLeft === null) {
    el.textContent = "Tempo livre";
    return;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  el.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export { updateScore, updateBars, setLog, updateTimerDisplay };
