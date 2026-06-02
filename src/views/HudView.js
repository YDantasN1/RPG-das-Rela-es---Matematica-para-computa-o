function updateScore(points) {
  document.getElementById("score-display").textContent = `${points} pts`;
}

function updateBars(playerHP, enemyHP) {
  document.getElementById("playerBar").style.width =
    Math.max(0, playerHP) + "%";
  document.getElementById("enemyBar").style.width = Math.max(0, enemyHP) + "%";
}

function setLog(message) {
  document.getElementById("log").textContent = message;
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
