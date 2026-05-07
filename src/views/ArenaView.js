const NS = "http://www.w3.org/2000/svg";

function createSvgEl(tag, attrs) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function buildArrowMarker() {
  const marker = createSvgEl("marker", {
    id: "arr",
    markerWidth: "8",
    markerHeight: "8",
    refX: "6",
    refY: "3",
    orient: "auto",
  });
  const poly = createSvgEl("polygon", {
    points: "0 0, 8 3, 0 6",
    fill: "rgba(255,255,255,0.9)",
  });
  marker.appendChild(poly);
  return marker;
}

function buildNode(x, y, label) {
  const g = createSvgEl("g", {});
  g.appendChild(
    createSvgEl("circle", {
      cx: x,
      cy: y,
      r: "12",
      fill: "rgba(212,175,55,0.12)",
      stroke: "rgba(212,175,55,0.5)",
      "stroke-width": "1",
    }),
  );
  const t = createSvgEl("text", {
    x,
    y: y + 5,
    fill: "#f5d76e",
    "text-anchor": "middle",
    "font-size": "13",
    "font-weight": "700",
  });
  t.textContent = label;
  g.appendChild(t);
  return g;
}

function buildArrow(x1, y1, x2, y2) {
  return createSvgEl("line", {
    x1,
    y1,
    x2,
    y2,
    stroke: "rgba(255,255,255,0.75)",
    "stroke-width": "1.6",
    "marker-end": "url(#arr)",
  });
}

function drawDiagram(pairs, codomain) {
  const container = document.getElementById("diagram");
  container.innerHTML = "";

  const svg = createSvgEl("svg", {
    viewBox: "0 0 300 200",
    preserveAspectRatio: "xMidYMid meet",
  });

  const defs = createSvgEl("defs", {});
  defs.appendChild(buildArrowMarker());
  svg.appendChild(defs);

  const leftX = 55,
    rightX = 245;
  const leftY = [45, 100, 155];
  const rightY = codomain.map(
    (_, i) => (200 / (codomain.length + 1)) * (i + 1),
  );

  [1, 2, 3].forEach((n, i) => svg.appendChild(buildNode(leftX, leftY[i], n)));
  codomain.forEach((n, i) => svg.appendChild(buildNode(rightX, rightY[i], n)));

  pairs.forEach(([x, y]) => {
    const yi = codomain.indexOf(y);
    if (yi !== -1)
      svg.appendChild(
        buildArrow(leftX + 14, leftY[x - 1], rightX - 14, rightY[yi]),
      );
  });

  container.appendChild(svg);
}

function renderAnswerButtons(options, onSelect) {
  const container = document.getElementById("options");
  container.innerHTML = "";
  container.style.pointerEvents = "auto";

  [...new Set(options)]
    .sort(() => Math.random() - 0.5)
    .forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = [
        "px-4 py-2 min-w-[110px] rounded-md text-sm font-bold text-white",
        "bg-[#0e7490] border border-white/15",
        "[text-shadow:0_1px_3px_rgba(0,0,0,0.5)]",
        "hover:bg-[#0891b2] hover:-translate-y-0.5",
        "active:translate-y-0 transition-all duration-150",
      ].join(" ");
      btn.textContent = opt;
      btn.addEventListener("click", () => onSelect(opt));
      container.appendChild(btn);
    });
}

function lockAnswers() {
  document.getElementById("options").style.pointerEvents = "none";
}

function setQuestion(text) {
  document.getElementById("question-text").textContent = text;
}

function shakeArena() {
  const arena = document.getElementById("arena");
  arena.classList.add("anim-shake");
  setTimeout(() => arena.classList.remove("anim-shake"), 420);
}

function animateCharacter(side) {
  const id = side === "hero" ? "heroChar" : "enemyChar";
  const cls = side === "hero" ? "anim-atk-hero" : "anim-atk-enemy";
  const el = document.getElementById(id);
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 420);
}

function spawnDamageFloat(targetId, value, type) {
  const target = document.getElementById(targetId);
  const arena = document.getElementById("arena");
  const tRect = target.getBoundingClientRect();
  const aRect = arena.getBoundingClientRect();

  const el = document.createElement("div");
  el.className = `anim-float-up absolute font-bold text-xl pointer-events-none
    [text-shadow:2px_2px_4px_rgba(0,0,0,0.8)]
    ${type === "enemy" ? "text-green-400" : "text-red-400"}`;
  el.textContent = `-${value}`;
  el.style.left = tRect.left - aRect.left + tRect.width / 2 + "px";
  el.style.top = tRect.top - aRect.top + "px";
  arena.appendChild(el);
  setTimeout(() => el.remove(), 1050);
}

function clearBoard() {
  document.getElementById("diagram").innerHTML = "";
  document.getElementById("options").innerHTML = "";
}

export {
  drawDiagram,
  renderAnswerButtons,
  lockAnswers,
  setQuestion,
  shakeArena,
  animateCharacter,
  spawnDamageFloat,
  clearBoard,
};
