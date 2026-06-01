import { getState, setState, resetGame } from "../models/GameState.js";
import { playSound } from "../services/AudioService.js";
import {
  generateQuestion,
  getCurrentAnswer,
} from "../services/CombatService.js";
import { updateScore, updateBars, setLog, TotalScore } from "../views/HudView.js";
import {
  shakeArena,
  animateCharacter,
  spawnDamageFloat,
  lockAnswers,
} from "../views/ArenaView.js";
import { show, hide, setEndScreen, fadeOutThen } from "../views/ScreenView.js";

function onAnswer(selected) {
  const { locked, playerHP, enemyHP, difficulty, score } = getState();
  if (locked || playerHP <= 0 || enemyHP <= 0) return;

  setState({ locked: true });
  lockAnswers();

  const damage = Math.floor(Math.random() * 8) + 4;
  const correct = selected === getCurrentAnswer();

  if (correct) {
    setState({ score: score + 1, enemyHP: enemyHP - damage });
    setLog(`ACERTOU! -${damage} HP`);
    spawnDamageFloat("enemyChar", damage, "enemy");
    animateCharacter("hero");
    playSound("hit");

    const totalAtual = parseInt(sessionStorage.getItem("total_accumulated_score")) || 0;
    sessionStorage.setItem("total_accumulated_score", totalAtual + 1);

    TotalScore();

  } else {
    setState({ playerHP: playerHP - damage });
    setLog(`ERROU! -${damage} HP`);
    spawnDamageFloat("heroChar", damage, "hero");
    animateCharacter("enemy");
    playSound("error");
  }

  const updated = getState();
  updateBars(updated.playerHP, updated.enemyHP);
  updateScore(updated.score);
  shakeArena();

  setTimeout(() => {
    if (updated.playerHP <= 0 || updated.enemyHP <= 0) {
      endGame();
    } else {
      generateQuestion(updated.difficulty, onAnswer);
      setState({ locked: false });
    }
  }, 820);
}

function startGame(difficulty) {
  resetGame(difficulty);
  fadeOutThen("menu", () => {
    hide("menu");
    show("game-view");
    updateBars(100, 100);
    updateScore(0);
    setLog("");
    generateQuestion(difficulty, onAnswer);
  });
}

function endGame() {
  const { enemyHP, score } = getState();
  hide("game-view");
  setEndScreen(enemyHP <= 0, score);
  show("end-screen");
  if (enemyHP <= 0) playSound("win");
  else playSound("lose");
}

function restartGame() {
  hide("end-screen");
  show("menu");
}

function backMenu() {
  hide("game-view");
  show("menu");
}

function skipQuestion() {
  const { locked, playerHP, enemyHP, difficulty } = getState();
  
  // Se as respostas estiverem travadas ou alguém já morreu, não deixa pular
  if (locked || playerHP <= 0 || enemyHP <= 0) return;

  // Reseta o log de combate indicando que pulou
  setLog("Questão pulada!");
  
  // Gera uma nova questão usando a dificuldade atualizada do estado
  generateQuestion(difficulty, onAnswer);
}

function dismissIntro() {
  const intro = document.getElementById("intro");
  intro.classList.add("anim-intro-out");
  setTimeout(() => {
    hide("intro");
    show("menu");
  }, 850);
}

function bindEvents() {
  window.removeEventListener("click", dismissIntro);
  window.addEventListener("click", dismissIntro, { once: true });

  document.querySelectorAll("button[data-level]").forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener("click", () => {
      playSound("click");
      startGame(newBtn.dataset.level);
    });
  });

  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) {
    const newRestart = restartBtn.cloneNode(true);
    restartBtn.parentNode.replaceChild(newRestart, restartBtn);
    newRestart.addEventListener("click", restartGame);
  }

  const backMenuBtn = document.getElementById("back-menu");
  if (backMenuBtn) {
    const newBack = backMenuBtn.cloneNode(true);
    backMenuBtn.parentNode.replaceChild(newBack, backMenuBtn);
    newBack.addEventListener("click", backMenu);
  }

  const skipBtn = document.getElementById("skip-quest");
  if (skipBtn) {
    const newSkip = skipBtn.cloneNode(true);
    skipBtn.parentNode.replaceChild(newSkip, skipBtn);
    newSkip.addEventListener("click", skipQuestion);
  }
  TotalScore();
}

bindEvents()