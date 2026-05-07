import { getState, setState, resetGame } from "../models/GameState.js";
import { playSound } from "../services/AudioService.js";
import {
  generateQuestion,
  getCurrentAnswer,
} from "../services/CombatService.js";
import { updateScore, updateBars, setLog } from "../views/HudView.js";
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
}

function restartGame() {
  hide("end-screen");
  show("menu");
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
  window.addEventListener("click", dismissIntro, { once: true });

  document.querySelectorAll("button[data-level]").forEach((btn) => {
    btn.addEventListener("click", () => {
      playSound("click");
      startGame(btn.dataset.level);
    });
  });

  document.getElementById("restart-btn").addEventListener("click", restartGame);
}

bindEvents();
