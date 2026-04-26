const weeds = [{
        name: "Mile-a-Minute (Mikania micrantha)",
        id: "Heart-shaped leaves that grow incredibly fast over other plants.",
        danger: "ECO-CHOKER: One of Singapore's worst weeds. It blankets forests and kills native trees by blocking sun.",
        warning: "HIGH"
    },
    {
        name: "Lantana",
        id: "Small, colorful clusters of flowers (pink, orange, yellow). Rough, sandpaper-like leaves.",
        danger: "TOXIC: Forms dense thickets that prevent native seedlings from growing. Berries are toxic to pets.",
        warning: "MEDIUM"
    },
    {
        name: "Water Hyacinth",
        id: "Floating plants with thick, shiny leaves and purple flowers. Seen in Singapore's reservoirs.",
        danger: "WATER BLOCKER: Carpets the water surface, killing fish by removing oxygen from the water.",
        warning: "HIGH"
    }
    {
        name: "Giant Hogweed",
        id: "Huge white flowers and purple-spotted stems.",
        danger: "TOXIC: Causes severe skin blisters. DO NOT TOUCH.",
        warning: "EXTREME"
    },
    {
        name: "Japanese Knotweed",
        id: "Bamboo-like stems and heart-shaped leaves.",
        danger: "DESTRUCTIVE: Grows through concrete and house foundations.",
        warning: "HIGH"
    },
    {
        name: "Kudzu",
        id: "Groups of three leaves; covers everything like a blanket.",
        danger: "SMOTHERER: Kills trees by blocking all sunlight.",
        warning: "HIGH"
    }
];

function init() {
    const guide = document.getElementById('plant-guide');
    if (!guide) return;

    let html = "";
    weeds.forEach(weed => {
        html += `
            <div class="plant-card">
                <span class="danger-tag">${weed.warning}</span>
                <h2>${weed.name}</h2>
                <p><strong>Look for:</strong> ${weed.id}</p>
                <div class="kill-zone">
                    <strong>The Threat:</strong> ${weed.danger}
                </div>
            </div>
        `;
    });
    guide.innerHTML = html;
}

window.onload = init;
