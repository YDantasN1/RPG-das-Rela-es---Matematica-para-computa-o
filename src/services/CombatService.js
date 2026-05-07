import { drawDiagram } from "../views/ArenaView.js";
import { setQuestion, renderAnswerButtons } from "../views/ArenaView.js";
import {
  buildEasyPairs,
  buildNormalPairs,
  buildHardPairs,
  isReflexive,
  isSymmetric,
  isAntisymmetric,
  isTransitive,
  isInjective,
  isSurjective,
  isBijective,
  hasElementWithoutImage,
  generateWrongSets,
} from "../models/MathEngine.js";

const DOMAIN = [1, 2, 3];

let currentAnswer = "";
let answerCallback = () => {};

function getCurrentAnswer() {
  return currentAnswer;
}

function applyQuestion({ answer, question, options }) {
  currentAnswer = answer;
  setQuestion(question);
  renderAnswerButtons(options, answerCallback);
}

function buildEasyQuestion() {
  const { pairs, codomain, isFunc } = buildEasyPairs();
  drawDiagram(pairs, codomain);
  applyQuestion({
    answer: isFunc ? "E funcao" : "Nao e funcao",
    question: "Esse diagrama representa uma funcao?",
    options: ["E funcao", "Nao e funcao"],
  });
}

function buildNormalQuestion() {
  const { pairs, codomain } = buildNormalPairs();
  drawDiagram(pairs, codomain);

  const configs = [
    {
      answer: `{${DOMAIN.join(",")}}`,
      question: "Qual e o dominio (A) da relacao?",
      options: [`{${DOMAIN.join(",")}}`, "{1,2}", "{2,3}", "{1,3}"],
    },
    {
      answer: isReflexive(pairs, DOMAIN) ? "Sim" : "Nao",
      question: "A relacao e Reflexiva?",
      options: ["Sim", "Nao"],
    },
    {
      answer: isSymmetric(pairs) ? "Sim" : "Nao",
      question: "A relacao e Simetrica?",
      options: ["Sim", "Nao"],
    },
    {
      answer: isAntisymmetric(pairs) ? "Sim" : "Nao",
      question: "A relacao e Antissimetrica?",
      options: ["Sim", "Nao"],
    },
    {
      answer: isTransitive(pairs) ? "Sim" : "Nao",
      question: "A relacao e Transitiva?",
      options: ["Sim", "Nao"],
    },
  ];

  applyQuestion(configs[Math.floor(Math.random() * configs.length)]);
}

function buildHardQuestion() {
  const type = Math.floor(Math.random() * 7);
  const { pairs, codomain } = buildHardPairs(type);
  drawDiagram(pairs, codomain);

  const imgSet = [...new Set(pairs.map((p) => p[1]))].sort();
  const isFunc = DOMAIN.every(
    (x) => pairs.filter((p) => p[0] === x).length === 1,
  );

  const configs = [
    {
      answer: isFunc ? "E funcao" : "Nao e funcao",
      question: "E uma funcao?",
      options: ["E funcao", "Nao e funcao"],
    },
    {
      answer: `{${imgSet.join(",")}}`,
      question: "Qual a Imagem (Im)?",
      options: [`{${imgSet.join(",")}}`, ...generateWrongSets(imgSet)],
    },
    {
      answer: `{${codomain.join(",")}}`,
      question: "Qual o Contradominio (CD)?",
      options: [`{${codomain.join(",")}}`, "{1,2,3}", "{1,2,3,4}"],
    },
    {
      answer: isInjective(pairs) ? "Sim" : "Nao",
      question: "A funcao e Injetora?",
      options: ["Sim", "Nao"],
    },
    {
      answer: isSurjective(pairs, codomain) ? "Sim" : "Nao",
      question: "A funcao e Sobrejetora?",
      options: ["Sim", "Nao"],
    },
    {
      answer: isBijective(pairs, codomain) ? "Sim" : "Nao",
      question: "A funcao e Bijetora?",
      options: ["Sim", "Nao"],
    },
    {
      answer: hasElementWithoutImage(pairs, DOMAIN) ? "Sim" : "Nao",
      question: "Ha elemento no dominio sem imagem?",
      options: ["Sim", "Nao"],
    },
  ];

  applyQuestion(configs[type]);
}

function generateQuestion(difficulty, onSelect) {
  document.getElementById("diagram").innerHTML = "";
  document.getElementById("options").innerHTML = "";
  answerCallback = onSelect;

  if (difficulty === "facil") buildEasyQuestion();
  else if (difficulty === "normal") buildNormalQuestion();
  else buildHardQuestion();
}

export { generateQuestion, getCurrentAnswer };
