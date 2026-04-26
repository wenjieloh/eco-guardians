// ==========================================
// 1. DATA VAULT
// ==========================================
const plantData = [
    {
        name: "Kudzu",
        habitat: "Forest Edges",
        threat: "Grows a foot a day, smothering native trees.",
        howToKill: "Continuous mowing or digging up root crowns.",
        dangerLevel: "High",
        icon: "🌿"
    },
    {
        name: "Purple Loosestrife",
        habitat: "Wetlands",
        threat: "Chokes out native plants and bird nesting sites.",
        howToKill: "Manual pulling or using specialist beetles.",
        dangerLevel: "Medium",
        icon: "🌸"
    },
    {
        name: "Giant Hogweed",
        habitat: "Riverbanks",
        threat: "Sap causes severe skin burns and blisters.",
        howToKill: "DANGER: Professional removal only. Do not touch!",
        dangerLevel: "Extreme",
        icon: "⚠️"
    },
    {
        name: "Japanese Knotweed",
        habitat: "Urban/Roadsides",
        threat: "Grows through concrete and damages buildings.",
        howToKill: "Chemical treatment by professionals.",
        dangerLevel: "High",
        icon: "🏢"
    }
];

const gameEmojis = ['🌿', '🌿', '🌸', '🌸', '⚠️', '⚠️', '🏢', '🏢'];
let flippedCards = [];
let matchedCount = 0;

// ==========================================
// 2. HABITAT & PROFILE BUILDER
// ==========================================
function loadHabitats() {
    const container = document.getElementById('habitats');
    if (!container) return;

    let html = `<h2>Invasive Profiles</h2><div class="habitat-grid">`;
    plantData.forEach(plant => {
        html += `
            <div class="habitat-card ${plant.dangerLevel.toLowerCase()}">
                <div class="card-icon">${plant.icon}</div>
                <h3>${plant.name}</h3>
                <p><strong>Habitat:</strong> ${plant.habitat}</p>
                <p><strong>The Threat:</strong> ${plant.threat}</p>
                <p class="kill-note"><strong>Fix:</strong> ${plant.howToKill}</p>
                <span class="badge">${plant.dangerLevel} Danger</span>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
}

// ==========================================
// 3. MEMORY GAME LOGIC
// ==========================================
function setupGame() {
    const board = document.getElementById('memory-board');
    if (!board) return;

    const shuffled = [...gameEmojis].sort(() => Math.random() - 0.5);
    board.innerHTML = '';
    matchedCount = 0;
    flippedCards = [];
    document.getElementById('game-stats').innerText = `Matches: 0 / 4`;

    shuffled.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.emoji = emoji;
        card.innerHTML = "?";
        card.onclick = () => {
            if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
                card.innerHTML = card.dataset.emoji;
                card.classList.add('flipped');
                flippedCards.push(card);
                if (flippedCards.length === 2) setTimeout(checkMatch, 700);
            }
        };
        board.appendChild(card);
    });
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.emoji === c2.dataset.emoji) {
        matchedCount++;
        document.getElementById('game-stats').innerText = `Matches: ${matchedCount} / 4`;
    } else {
        c1.innerHTML = "?"; c2.innerHTML = "?";
        c1.classList.remove('flipped'); c2.classList.remove('flipped');
    }
    flippedCards = [];
    if (matchedCount === 4) alert("Great job, Eco-Guardian!");
}

// ==========================================
// 4. QUIZ LOGIC
// ==========================================
function loadQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    container.innerHTML = `
        <div class="quiz-box">
            <h3>Knowledge Check</h3>
            <p>True or False: Every fast-growing plant is considered an "Invasive Species."</p>
            <button onclick="checkQuiz(false)">True</button>
            <button onclick="checkQuiz(true)">False</button>
            <p id="quiz-feedback"></p>
        </div>
    `;
}

function checkQuiz(isCorrect) {
    const fb = document.getElementById('quiz-feedback');
    if (isCorrect) {
        fb.innerHTML = "✅ Correct! A plant is only 'Invasive' if it causes harm to the local ecosystem.";
        fb.style.color = "green";
    } else {
        fb.innerHTML = "❌ Not quite. Some fast growers are native and helpful!";
        fb.style.color = "red";
    }
}

// ==========================================
// 5. MASTER INITIALIZATION
// ==========================================
window.onload = () => {
    loadHabitats();
    setupGame();
    loadQuiz();
};
