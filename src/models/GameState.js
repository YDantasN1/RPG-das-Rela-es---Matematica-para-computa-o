const INITIAL_STATE = {
  difficulty: "facil",
  gameMode: "classic",
  timeLimit: null,
  timeLeft: null,
  score: 0,
  combo: 0,
  maxCombo: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  timeoutAnswers: 0,
  playerHP: 100,
  enemyHP: 100,
  locked: false,
  statsByTopic: {},
  lastTopic: null,
};

let state = { ...INITIAL_STATE };

function getState() {
  return { ...state };
}

function setState(partial) {
  state = { ...state, ...partial };
}

function resetGame(difficulty, gameMode = "classic", timeLimit = null) {
  state = {
    ...INITIAL_STATE,
    difficulty,
    gameMode,
    timeLimit,
    timeLeft: timeLimit,
  };
}

export { getState, setState, resetGame };
