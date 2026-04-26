const weeds = [
    {
        name: "Mile-a-Minute",
        id: "Heart-shaped leaves that blanket everything.",
        danger: "Chokes Singapore's native trees and blocks all sunlight.",
        warning: "HIGH"
    },
    {
        name: "Giant Hogweed",
        id: "Huge umbrella flowers and purple-spotted stems.",
        danger: "TOXIC: Sap causes extreme chemical burns and blisters.",
        warning: "EXTREME"
    },
    {
        name: "Water Hyacinth",
        id: "Shiny leaves and purple flowers in our reservoirs.",
        danger: "Starves fish of oxygen by covering the water surface.",
        warning: "CRITICAL"
    }
];

function init() {
    console.log("System Initializing...");
    const guide = document.getElementById('plant-guide');
    
    if (!guide) {
        console.error("Layout Error: plant-guide div not found.");
        return;
    }

    let html = "";
    weeds.forEach(weed => {
        html += `
            <div class="plant-card">
                <span class="danger-tag">${weed.warning} ALERT</span>
                <h2 style="font-size: 2rem; margin: 15px 0;">${weed.name}</h2>
                <p><strong>Identity:</strong> ${weed.id}</p>
                <div class="kill-zone">
                    <strong>The Threat:</strong> ${weed.danger}
                </div>
            </div>
        `;
    });

    guide.innerHTML = html;
    console.log("Guide Deployed Successfully.");
}

// This is the strongest way to start the script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
