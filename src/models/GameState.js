const INITIAL_STATE = {
  difficulty: "facil",
  score: 0,
  playerHP: 100,
  enemyHP: 100,
  locked: false,
};

let state = { ...INITIAL_STATE };

function getState() {
  return { ...state };
}

function setState(partial) {
  state = { ...state, ...partial };
}

function resetGame(difficulty) {
  state = { ...INITIAL_STATE, difficulty };
}

export { getState, setState, resetGame };
