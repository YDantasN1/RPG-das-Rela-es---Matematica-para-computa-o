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

export { updateScore, updateBars, setLog };
