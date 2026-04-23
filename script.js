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
};
