/* --- VARIÁVEIS GLOBAIS --- */
let canClick = true;
let difficulty = "facil";
let score = 0;
let playerHP = 250;
let enemyHP = 250;
let currentAnswer = "";
let isProcessing = false;
let introStarted = false;

/* --- SISTEMA DE INTRODUÇÃO --- */
window.addEventListener("click", startIntro);

function startIntro() {
    if (introStarted) return;
    introStarted = true;

    let intro = document.getElementById("intro");
    let menu = document.getElementById("menu");

    intro.classList.add("intro-hide");

    setTimeout(() => {
        intro.style.display = "none";
        menu.classList.remove("hidden");
    }, 1000);
}

/* --- CONTROLE DO JOGO --- */
function startGame(level) {
    difficulty = level;
    score = 0;
    playerHP = 100;
    enemyHP = 100;
    isProcessing = false;
    canClick = true;

    let menu = document.getElementById("menu");
    let game = document.getElementById("game");

    menu.classList.add("fade-out");

    setTimeout(() => {
        menu.classList.add("hidden");
        menu.classList.remove("fade-out");
        menu.style.opacity = "1";
        menu.style.transform = "scale(1)";

        game.classList.remove("hidden");

        updateBars();
        generateQuestion();
    }, 500);
}

/* --- GERADOR DE PERGUNTAS (LÓGICA MATEMÁTICA) --- */
function generateQuestion() {
    let diagramDiv = document.getElementById("diagram");
    let questionText = document.getElementById("questionText");
    diagramDiv.innerHTML = "";
    document.getElementById("options").innerHTML = "";

    let pairs = [];
    let domain = [1, 2, 3];
    let codomain = [1, 2, 3, 4];
    let type = Math.floor(Math.random() * 7); 

    // MODO FÁCIL
    if (difficulty === "facil") {
        let isFunc = Math.random() > 0.5;
        domain.forEach(x => {
            pairs.push([x, Math.floor(Math.random() * 3) + 1]);
            if (!isFunc && x === 1) pairs.push([1, 2]); // Erro: elemento com 2 imagens
        });
        drawDiagram(pairs, [1, 2, 3]);
        currentAnswer = isFunc ? "É função" : "Não é função";
        questionText.innerText = "Esse diagrama representa uma função?";
        generateOptionsText(currentAnswer, ["É função", "Não é função"]);
    } 
    
    // MODO NORMAL - Agora com propriedades de Relações
    else if (difficulty === "normal") {
        codomain = [1, 2, 3]; // Fixado para ser de A para A
        
        // Gera uma quantidade aleatória de pares (entre 2 e 5) para criar relações variadas
        let numPairs = Math.floor(Math.random() * 4) + 2;
        for(let i=0; i < numPairs; i++) {
            let a = domain[Math.floor(Math.random() * domain.length)];
            let b = codomain[Math.floor(Math.random() * codomain.length)];
            // Evita duplicatas exatas no array de pares
            if(!pairs.some(p => p[0] === a && p[1] === b)) pairs.push([a, b]);
        }

        drawDiagram(pairs, codomain);

        // Sorteia qual propriedade perguntar
        let subType = Math.floor(Math.random() * 5); 

        if (subType === 0) {
            currentAnswer = `{${domain.join(",")}}`;
            questionText.innerText = "Qual é o domínio (A) da relação?";
            generateOptionsText(currentAnswer, [currentAnswer, "{1,2}", "{2,3}", "{1,3}"]);
        } else if (subType === 1) {
            currentAnswer = isReflexive(pairs, domain) ? "Sim" : "Não";
            questionText.innerText = "A relação é Reflexiva?";
            generateOptionsText(currentAnswer, ["Sim", "Não"]);
        } else if (subType === 2) {
            currentAnswer = isSymmetric(pairs) ? "Sim" : "Não";
            questionText.innerText = "A relação é Simétrica?";
            generateOptionsText(currentAnswer, ["Sim", "Não"]);
        } else if (subType === 3) {
            currentAnswer = isAntisymmetric(pairs) ? "Sim" : "Não";
            questionText.innerText = "A relação é Antissimétrica?";
            generateOptionsText(currentAnswer, ["Sim", "Não"]);
        } else {
            currentAnswer = isTransitive(pairs) ? "Sim" : "Não";
            questionText.innerText = "A relação é Transitiva?";
            generateOptionsText(currentAnswer, ["Sim", "Não"]);
        }
    }

    // MODO DIFÍCIL
    else {
        if (type === 4 || type === 5) codomain = [1, 2, 3]; 
        let shouldBeTrue = Math.random() > 0.5;

        // Gerador de Relações Específicas
        if (type === 3 && shouldBeTrue) { // Injetora
            let avail = [...codomain];
            domain.forEach(x => pairs.push([x, avail.splice(Math.floor(Math.random()*avail.length), 1)[0]]));
        } else if (type === 6 && shouldBeTrue) { // Sem imagem
            pairs.push([1, 1], [2, 2]); 
        } else {
            domain.forEach(x => pairs.push([x, codomain[Math.floor(Math.random()*codomain.length)]]));
        }

        drawDiagram(pairs, codomain);

        if (type === 0) {
            let isF = domain.every(x => pairs.filter(p => p[0] === x).length === 1);
            currentAnswer = isF ? "É função" : "Não é função";
            questionText.innerText = "É uma função?";
            generateOptionsText(currentAnswer, ["É função", "Não é função"]);
        } else if (type === 1) {
            let imgSet = [...new Set(pairs.map(p => p[1]))].sort();
            currentAnswer = `{${imgSet.join(",")}}`;
            questionText.innerText = "Qual a Imagem (Im)?";
            generateOptionsText(currentAnswer, [currentAnswer, ...generateWrongSets(imgSet)]);
        } else if (type === 2) {
            currentAnswer = `{${codomain.join(",")}}`;
            questionText.innerText = "Qual o Contradomínio (CD)?";
            generateOptionsText(currentAnswer, [currentAnswer, "{1,2,3}", "{1,2,3,4}"]);
        } else if (type === 3) {
            currentAnswer = isInjective(pairs) ? "Sim" : "Não";
            questionText.innerText = "A função é Injetora?";
            generateOptionsText(currentAnswer, ["Sim", "Não"]);
        } else if (type === 4) {
            currentAnswer = isSurjective(pairs, codomain) ? "Sim" : "Não";
            questionText.innerText = "A função é Sobrejetora?";
            generateOptionsText(currentAnswer, ["Sim", "Não"]);
        } else if (type === 5) {
            currentAnswer = isBijective(pairs, codomain) ? "Sim" : "Não";
            questionText.innerText = "A função é Bijetora?";
            generateOptionsText(currentAnswer, ["Sim", "Não"]);
        } else {
            currentAnswer = hasElementWithoutImage(pairs, domain) ? "Sim" : "Não";
            questionText.innerText = "Há elemento no domínio sem imagem?";
            generateOptionsText(currentAnswer, ["Sim", "Não"]);
        }
    }
}

/* --- SISTEMA DE COMBATE --- */
function attack(answer) {
    if (playerHP <= 0 || enemyHP <= 0 || isProcessing || !canClick) return;

    canClick = false;
    isProcessing = true;
    document.getElementById("options").style.pointerEvents = "none";

    let hero = document.querySelector(".hero");
    let enemy = document.querySelector(".enemyChar");
    let game = document.getElementById("game");
    let damage = Math.floor(Math.random() * 8) + 4;

    if (answer === currentAnswer) {
        score++;
        enemyHP -= damage;
        showDamage(enemy, damage, "enemy");
        document.getElementById("log").innerText = `🔥 ACERTOU! -${damage} HP`;
        hero.classList.add("attack", "hero");
    } else {
        playerHP -= damage;
        showDamage(hero, damage, "player");
        document.getElementById("log").innerText = `❌ ERROU! -${damage} HP`;
        enemy.classList.add("attack", "enemyChar");
    }

    game.classList.add("shake");
    updateBars();

    setTimeout(() => {
        hero.classList.remove("attack");
        enemy.classList.remove("attack");
        game.classList.remove("shake");
        document.getElementById("options").style.pointerEvents = "auto";
        
        if (playerHP > 0 && enemyHP > 0) {
            generateQuestion();
            isProcessing = false;
            canClick = true;
        } else {
            checkGame();
        }
    }, 800);
}

/* --- INTERFACE E DRAWING --- */
function generateOptionsText(correct, list) {
    let optionsDiv = document.getElementById("options");
    let options = [...new Set(list)];
    options.sort(() => Math.random() - 0.5);

    options.forEach(opt => {
        let btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerText = opt;
        btn.onclick = () => { playClick(); attack(opt); };
        optionsDiv.appendChild(btn);
    });
}

function drawDiagram(pairs, codomain) {
    let container = document.getElementById("diagram");
    container.innerHTML = "";
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    
    // O viewBox define o "espaço de desenho" interno, independente do tamanho da tela
    svg.setAttribute("viewBox", "0 0 300 200");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    let leftX = 50;  // Ajustado para dar mais folga
    let rightX = 250; // Ajustado para dar mais folga
    let leftY = [50, 100, 150];
    let rightY = codomain.map((_, i) => (200 / (codomain.length + 1)) * (i + 1));

    // Desenhar números do Domínio (A)
    [1, 2, 3].forEach((num, i) => {
        svg.appendChild(createText(leftX, leftY[i], num));
    });

    // Desenhar números do Contradomínio (B)
    codomain.forEach((num, i) => {
        svg.appendChild(createText(rightX, rightY[i], num));
    });

    // Desenhar as flechas (linhas)
    pairs.forEach(([x, y]) => {
        let yIdx = codomain.indexOf(y);
        if (yIdx !== -1) {
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            // Adicionamos um pequeno offset (±15) para a linha não cobrir o número
            line.setAttribute("x1", leftX + 15);
            line.setAttribute("y1", leftY[x-1]);
            line.setAttribute("x2", rightX - 15);
            line.setAttribute("y2", rightY[yIdx]);
            line.setAttribute("stroke", "white");
            line.setAttribute("stroke-width", "2");
            // Adiciona uma pontinha de flecha (opcional, mas ajuda visualmente)
            line.setAttribute("marker-end", "url(#arrowhead)"); 
            svg.appendChild(line);
        }
    });
    
    container.appendChild(svg);
}

function createText(x, y, value) {
    let t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", x); t.setAttribute("y", y + 5);
    t.setAttribute("fill", "white"); t.setAttribute("text-anchor", "middle");
    t.textContent = value;
    return t;
}

/* --- FEEDBACK E BARRAS --- */
function updateBars() {
    document.getElementById("playerBar").style.width = Math.max(0, playerHP) + "%";
    document.getElementById("enemyBar").style.width = Math.max(0, enemyHP) + "%";
}

function showDamage(target, value, type) {
    let damage = document.createElement("div");
    damage.classList.add("damage", type);
    damage.innerText = "-" + value;
    let arena = document.querySelector(".arena");
    let rect = target.getBoundingClientRect();
    let arenaRect = arena.getBoundingClientRect();
    damage.style.left = (rect.left - arenaRect.left + rect.width / 2) + "px";
    damage.style.top = (rect.top - arenaRect.top) + "px";
    arena.appendChild(damage);
    setTimeout(() => damage.remove(), 1000);
}

/* --- FIM DE JOGO --- */
function checkGame() {
    let win = enemyHP <= 0;
    document.getElementById("game").classList.add("hidden");
    let endScreen = document.getElementById("endScreen");
    endScreen.classList.remove("hidden");
    document.getElementById("endTitle").innerText = win ? "🏆 VITÓRIA!" : "💀 DERROTA!";
    document.getElementById("endScore").innerText = `Pontos: ${score}`;
}

function restartGame() {
    document.getElementById("endScreen").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
}

/* --- AUXILIARES MATEMÁTICOS --- */
function isInjective(pairs) {
    let images = pairs.map(p => p[1]);
    return new Set(images).size === images.length;
}

function isSurjective(pairs, codomain) {
    let image = [...new Set(pairs.map(p => p[1]))];
    return codomain.length === image.length;
}

function isBijective(pairs, codomain) {
    return isInjective(pairs) && isSurjective(pairs, codomain);
}

function hasElementWithoutImage(pairs, domain) {
    let usedX = pairs.map(p => p[0]);
    return domain.some(x => !usedX.includes(x));
}

function generateWrongSets(correctArray) {
    let all = [1,2,3,4];
    let options = [];
    while (options.length < 3) {
        let temp = all.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random()*3)+1);
        let set = `{${temp.sort().join(",")}}`;
        if (set !== `{${correctArray.join(",")}}` && !options.includes(set)) options.push(set);
    }
    return options;
}

function playClick() {
    const snd = document.getElementById("clickSound");
    if(snd) snd.play();
}

// Event Listeners dos botões de dificuldade
document.querySelectorAll("#menu .pixel-btn").forEach(btn => {
    btn.onclick = () => { playClick(); startGame(btn.dataset.level); };
});

/* --- NOVAS PROPRIEDADES PARA O MODO NORMAL --- */
function isReflexive(pairs, domain) {
    return domain.every(x => pairs.some(p => p[0] === x && p[1] === x));
}

function isSymmetric(pairs) {
    if (pairs.length === 0) return true;
    return pairs.every(p => pairs.some(sidekick => sidekick[0] === p[1] && sidekick[1] === p[0]));
}

function isAntisymmetric(pairs) {
    for (let p of pairs) {
        for (let s of pairs) {
            if (p[0] === s[1] && p[1] === s[0] && p[0] !== p[1]) return false;
        }
    }
    return true;
}

function isTransitive(pairs) {
    for (let p1 of pairs) {
        for (let p2 of pairs) {
            if (p1[1] === p2[0]) {
                let exists = pairs.some(p3 => p3[0] === p1[0] && p3[1] === p2[1]);
                if (!exists) return false;
            }
        }
    }
    return true;
}
