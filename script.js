// Expanded Plant Data
const plantData = [
    {
        name: "Kudzu",
        habitat: "Forest Edges",
        threat: "Smothers trees & breaks power lines.",
        howToKill: "Continuous mowing or digging up the 'root crown'.",
        dangerLevel: "High"
    },
    {
        name: "Purple Loosestrife",
        habitat: "Wetlands/Marshes",
        threat: "Chokes out native water plants and destroys bird nesting sites.",
        howToKill: "Pulling by hand before seeds drop or using leaf-eating beetles.",
        dangerLevel: "Medium"
    },
    {
        name: "Giant Hogweed",
        habitat: "Riverbanks",
        threat: "Grows 15ft tall! Its sap causes severe skin burns.",
        howToKill: "DANGER: Professional removal only. Do not touch!",
        dangerLevel: "Extreme"
    }
];

// Function to build the "How it Kills" section
function loadHabitatInfo() {
    const habitatSection = document.querySelector('#habitats');
    let html = '<h2>Habitats Under Attack</h2><div class="habitat-grid">';

    plantData.forEach(plant => {
        html += `
            <div class="habitat-card ${plant.dangerLevel.toLowerCase()}">
                <span class="badge">${plant.dangerLevel} Danger</span>
                <h3>${plant.name}</h3>
                <p><strong>Found in:</strong> ${plant.habitat}</p>
                <p><strong>The Threat:</strong> ${plant.threat}</p>
                <p class="kill-method"><strong>How to stop it:</strong> ${plant.howToKill}</p>
            </div>
        `;
    });

    html += '</div>';
    habitatSection.innerHTML = html;
}

// Initialize when page loads
window.onload = () => {
    loadLearnSection(); // From previous step
    loadHabitatInfo();



    // Game State
const gamePlants = ['🌿', '🌿', '🌵', '🌵', '🍃', '🍃', '🍄', '🍄']; // Simplified for now
let flippedCards = [];
let matchedCount = 0;

function setupGame() {
    const board = document.getElementById('memory-board');
    // Shuffle the cards
    const shuffled = gamePlants.sort(() => 0.5 - Math.random());
    
    board.innerHTML = ''; // Clear board
    shuffled.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.emoji = emoji;
        card.dataset.id = index;
        card.innerHTML = '?';
        card.onclick = () => flipCard(card);
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.innerHTML = card.dataset.emoji;
        card.classList.add('flipped');
        flippedCards.push(card);
    }

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 700);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.emoji === card2.dataset.emoji) {
        matchedCount += 2;
        if (matchedCount === gamePlants.length) alert("Great job! You identified them all!");
    } else {
        card1.innerHTML = '?';
        card2.innerHTML = '?';
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards = [];
}

function resetGame() {
    matchedCount = 0;
    flippedCards = [];
    setupGame();
}

// Add this to your existing window.onload
window.onload = () => {
    loadLearnSection();
    setupGame();
};



    
