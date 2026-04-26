const weeds = [
    {
        name: "Giant Hogweed",
        id: "Look for: Hollow stems with purple spots and huge white flower umbrellas.",
        danger: "TOXIC: Sap causes massive blisters in sunlight. NEVER TOUCH.",
        habitat: "Often found along rivers and damp areas.",
        warning: "EXTREME"
    },
    {
        name: "Japanese Knotweed",
        id: "Look for: Reddish bamboo-like stems and heart-shaped leaves.",
        danger: "ECONOMY KILLER: Can grow through house foundations and concrete.",
        habitat: "Common on roadsides and near construction sites.",
        warning: "HIGH"
    },
    {
        name: "Kudzu",
        id: "Look for: Large leaves in groups of three. It looks like a green blanket.",
        danger: "SMOTHERER: It grows so fast it literally crushes trees under its weight.",
        habitat: "Forest edges and abandoned fields.",
        warning: "HIGH"
    }
];

function loadIdentificationGuide() {
    const guide = document.getElementById('plant-guide');
    if (!guide) return;

    let html = "";
    weeds.forEach(weed => {
        html += `
            <div class="plant-card">
                <div class="plant-info">
                    <span class="danger-tag">${weed.warning} DANGER</span>
                    <h2>${weed.name}</h2>
                    <p><strong>Identification:</strong> ${weed.id}</p>
                    <p><strong>Habitat:</strong> ${weed.habitat}</p>
                    <div class="kill-zone">
                        <strong>The Threat:</strong> ${weed.danger}
                    </div>
                </div>
            </div>
        `;
    });
    guide.innerHTML = html;
}

// Start the app
window.onload = loadIdentificationGuide;
