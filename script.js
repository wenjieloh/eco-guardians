// Data for the 'Learn' Section
const plants = [
    {
        name: "Kudzu",
        issue: "The 'Vine that ate the South.' It grows a foot a day and smothers trees by blocking sunlight.",
        action: "Mechanical removal (digging up the root crown) or specific grazing by goats!"
    },
    {
        name: "Japanese Knotweed",
        issue: "It can grow through concrete and tarmac, damaging roads and house foundations.",
        action: "Never just mow it! It needs professional treatment or specialized root barriers."
    }
];

// Function to load the Learn Cards
function loadLearnSection() {
    const container = document.querySelector('#learn');
    let html = '<h2>Invasive Species Profiles</h2><div class="card-grid">';
    
    plants.forEach(plant => {
        html += `
            <div class="card">
                <h3>${plant.name}</h3>
                <p><strong>The Problem:</strong> ${plant.issue}</p>
                <p><strong>The Fix:</strong> ${plant.action}</p>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Simple Greeting to test connectivity
console.log("EcoGuardians Site Loaded!");
window.onload = loadLearnSection;
