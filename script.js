// ============================================================
// PAGE NAVIGATION
// ============================================================
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const navLink = document.querySelector(`[data-page="${name}"]`);
  if (navLink) navLink.classList.add('active');
  window.scrollTo(0, 0);
  if (name === 'games') initAllGames();
  if (name === 'action') restorePledge();
}

// NAVBAR
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// FALLING LEAVES
const leavesContainer = document.getElementById('leavesContainer');
const leafEmojis = ['🍃', '🌿', '🌱', '🍂', '🌾'];
for (let i = 0; i < 20; i++) {
  const leaf = document.createElement('div');
  leaf.classList.add('falling-leaf');
  leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
  leaf.style.left = Math.random() * 100 + 'vw';
  leaf.style.animationDuration = (7 + Math.random() * 10) + 's';
  leaf.style.animationDelay = (Math.random() * 12) + 's';
  leaf.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
  leavesContainer.appendChild(leaf);
}

// SCROLL FADE-UP
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.info-card, .step-card, .hook-card').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = (i * 0.07) + 's';
  observer.observe(el);
});

// ============================================================
// LEARN TABS
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

const readTabs = new Set(JSON.parse(localStorage.getItem('readTabs_sg') || '[]'));
function updateProgress() {
  const pct = Math.round((readTabs.size / 5) * 100);
  const fill = document.getElementById('progressFill');
  const pctEl = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
}
function markRead(tabId) {
  readTabs.add(tabId);
  localStorage.setItem('readTabs_sg', JSON.stringify([...readTabs]));
  updateProgress();
  const btn = document.querySelector(`#tab-${tabId} .mark-read-btn`);
  if (btn) { btn.textContent = '✅ Done!'; btn.classList.add('done'); }
}
readTabs.forEach(tabId => {
  const btn = document.querySelector(`#tab-${tabId} .mark-read-btn`);
  if (btn) { btn.textContent = '✅ Done!'; btn.classList.add('done'); }
});
updateProgress();

// ============================================================
// SPECIES FILTER + EXPAND
// ============================================================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.sp-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && !card.dataset.category.includes(filter));
    });
  });
});

function toggleSpecies(id, btn) {
  const detail = document.getElementById(id);
  const isOpen = detail.classList.contains('open');
  detail.classList.toggle('open', !isOpen);
  detail.style.display = isOpen ? 'none' : 'block';
  btn.textContent = isOpen ? 'Full Profile ▼' : 'Show Less ▲';
}

// ============================================================
// GAME SYSTEM
// ============================================================
const scores = { quiz: 0, memory: 0, spot: 0, id: 0 };
function updateScores() {
  document.getElementById('quizScoreVal').textContent = scores.quiz;
  document.getElementById('memoryScoreVal').textContent = scores.memory;
  document.getElementById('spotScoreVal').textContent = scores.spot;
  document.getElementById('idScoreVal').textContent = scores.id;
  document.getElementById('totalScoreVal').textContent = Object.values(scores).reduce((a, b) => a + b, 0);
}

function selectGame(name) {
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active-panel'));
  document.querySelectorAll('.game-select-card').forEach(c => c.classList.remove('active-game'));
  document.getElementById('game-' + name).classList.add('active-panel');
  const idx = ['quiz','memory','spot','plantid','spread'].indexOf(name);
  document.querySelectorAll('.game-select-card')[idx]?.classList.add('active-game');
  document.getElementById('game-' + name).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initAllGames() {
  initQuiz(); initMemory(); initSpot(); initPlantId(); resetSim();
}

// ============================================================
// QUIZ — 12 SINGAPORE QUESTIONS
// ============================================================
const quizQuestions = [
  { q: "Which invasive plant is considered Singapore's #1 most problematic weed by NParks?", a: ["Zanzibar Yam", "Mile-a-Minute (Mikania micrantha)", "Lantana", "Water Hyacinth"], correct: 1, explain: "Mile-a-Minute (Mikania micrantha) is Singapore's most widespread invasive plant. Growing up to 8cm per day, it smothers native vegetation across virtually every nature area in Singapore." },
  { q: "How did Mile-a-Minute first arrive in Singapore?", a: ["Carried by migratory birds", "Deliberately planted by NParks", "Accidentally introduced via contaminated grass seed in the 1960s", "Brought in through the aquarium trade"], correct: 2, explain: "Mile-a-Minute arrived through contaminated grass seed imports in the 1960s — a preventable mistake that has cost Singapore decades of ongoing management efforts." },
  { q: "The Zanzibar Yam (Dioscorea bulbifera) spreads in Singapore primarily through:", a: ["Wind-dispersed seeds", "Bulbils that fall to the ground and remain dormant in soil", "Root runners underground", "Being eaten and spread by birds"], correct: 1, explain: "The Zanzibar Yam produces bulbils — small aerial tubers — that drop to the ground and can remain viable in soil for years before sprouting into new plants." },
  { q: "Why is Senduduk Bulu (Clidemia hirta) especially dangerous in Singapore's forests?", a: ["It only grows in open fields", "It tolerates shade and can invade intact forest understorey", "It is spread only by humans", "It only affects aquatic habitats"], correct: 1, explain: "Unlike most invasives that start at forest edges, Senduduk Bulu can invade shaded forest understorey — preventing native tree seedlings from establishing and breaking the forest regeneration cycle." },
  { q: "Which invasive species partnership is called an 'invasion meltdown' by scientists?", a: ["Water Hyacinth and PUB drains", "Senduduk Bulu berries being spread by the invasive Javan Myna", "Albizia and construction sites", "Siam Weed and fire"], correct: 1, explain: "Senduduk Bulu produces berries that the invasive Javan Myna eats and spreads throughout Singapore's forests — two invasive species helping each other spread, a phenomenon scientists call 'invasion meltdown'." },
  { q: "The Albizia tree is dangerous in Singapore because:", a: ["Its berries are toxic to humans", "It grows extremely fast but produces structurally weak wood that breaks dangerously in storms", "It blocks waterways", "It produces allelopathic chemicals"], correct: 1, explain: "Albizia grows up to 7 metres per year but produces brittle wood. In Singapore's frequent storms, branches and whole trees can fall suddenly — creating what arborists call 'widow-maker' hazards." },
  { q: "Why was Water Hyacinth originally introduced to Singapore?", a: ["As a water treatment plant", "For use in aquaculture", "As a decorative ornamental pond plant", "For scientific research"], correct: 2, explain: "Water Hyacinth was introduced as a decorative pond plant due to its beautiful purple flowers. It escaped into Singapore's waterways and is now one of our most costly aquatic invasives." },
  { q: "Which Singapore government agency should you contact if you spot Water Hyacinth in a canal?", a: ["Ministry of Education", "PUB (Public Utilities Board)", "Urban Redevelopment Authority", "National Heritage Board"], correct: 1, explain: "PUB manages Singapore's waterways and has specialist teams for aquatic invasive removal. Their 24-hour hotline is 1800-284-6600. Early reporting saves enormous management costs!" },
  { q: "What makes Singapore particularly vulnerable to invasive plant introductions?", a: ["Its small size", "Being one of the world's busiest ports and aviation hubs, with a tropical climate perfect for growth", "Having too many parks", "Its soil type"], correct: 1, explain: "Singapore's position as a major port and aviation hub means invasive species constantly arrive hidden in cargo, soil, and luggage. Our tropical climate then provides ideal year-round growing conditions." },
  { q: "Giant Salvinia (Salvinia molesta) is primarily spreading in Singapore through:", a: ["Migratory birds", "Flood events only", "Aquarium plant releases by hobbyists dumping plants into waterways", "Wind dispersal"], correct: 2, explain: "Giant Salvinia is mostly introduced when aquarium hobbyists dump plants into Singapore canals and waterways. It can double its biomass in 2.5 days — making every dumped plant a potential disaster." },
  { q: "What is Singapore's 'City in Nature' initiative?", a: ["A plan to build more indoor gardens", "NParks' initiative to weave nature throughout Singapore's urban landscape and restore biodiversity", "A programme for importing ornamental plants", "A tourism campaign"], correct: 1, explain: "City in Nature is NParks' flagship initiative to integrate greenery throughout Singapore's urban landscape. Managing invasive plants is one of its biggest ongoing challenges — which is why citizen action matters so much." },
  { q: "Which Singapore nature area is described as one of the most biodiverse urban forests on Earth?", a: ["East Coast Park", "Gardens by the Bay", "Bukit Timah Nature Reserve", "Sentosa"], correct: 2, explain: "Bukit Timah Nature Reserve, at just 163 hectares, has more plant species than the entire North American continent — making it one of Earth's most biodiverse urban forest patches, and a critical habitat worth protecting from invasives." }
];

let currentQ = 0, quizQScore = 0, quizAnswered = false;

function initQuiz() {
  currentQ = 0; quizQScore = 0; quizAnswered = false;
  document.getElementById('quizComplete').style.display = 'none';
  document.getElementById('quizArea').style.display = 'block';
  renderQuestion();
}
function renderQuestion() {
  quizAnswered = false;
  const q = quizQuestions[currentQ];
  document.getElementById('qNum').textContent = currentQ + 1;
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('quizProgressFill').style.width = ((currentQ / quizQuestions.length) * 100) + '%';
  const grid = document.getElementById('answerGrid');
  grid.innerHTML = '';
  q.a.forEach((ans, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = ans;
    btn.onclick = () => selectAnswer(i);
    grid.appendChild(btn);
  });
  document.getElementById('feedbackBox').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
}
function selectAnswer(idx) {
  if (quizAnswered) return;
  quizAnswered = true;
  const q = quizQuestions[currentQ];
  const btns = document.querySelectorAll('.answer-btn');
  btns.forEach(b => b.disabled = true);
  btns[q.correct].classList.add('correct');
  const fb = document.getElementById('feedbackBox');
  if (idx === q.correct) {
    fb.className = 'feedback-box correct-fb';
    fb.innerHTML = '✅ Correct! ' + q.explain;
    quizQScore++;
  } else {
    btns[idx].classList.add('wrong');
    fb.className = 'feedback-box wrong-fb';
    fb.innerHTML = '❌ Not quite. ' + q.explain;
  }
  fb.style.display = 'block';
  document.getElementById('nextBtn').style.display = 'inline-block';
}
function nextQuestion() {
  currentQ++;
  if (currentQ >= quizQuestions.length) {
    document.getElementById('quizArea').style.display = 'none';
    document.getElementById('quizComplete').style.display = 'block';
    document.getElementById('finalScore').textContent = quizQScore;
    const msgs = [
      [0, 4, "Keep exploring the Learn section — Singapore's ecosystems need informed defenders! 📚"],
      [5, 7, "Good effort! You're building real knowledge about Singapore's invasive plants. 🌱"],
      [8, 10, "Great job! You know Singapore's invasive species well. 🌿"],
      [11, 12, "PERFECT! You're a Singapore Plant Defender — NParks would be proud! 🏆🇸🇬"]
    ];
    const m = msgs.find(([mn, mx]) => quizQScore >= mn && quizQScore <= mx);
    document.getElementById('scoreMessage').textContent = m[2];
    scores.quiz = Math.max(scores.quiz, quizQScore * 10);
    updateScores();
  } else { renderQuestion(); }
}
function restartQuiz() { initQuiz(); }

// ============================================================
// MEMORY GAME — COLOUR CODED
// ============================================================
const memoryPairs = [
  { id: 'zanzibar', plant: 'Zanzibar Yam', origin: 'Africa & Asia', color: '#e74c3c', colorName: 'Red' },
  { id: 'mam', plant: 'Mile-a-Minute', origin: 'C. & S. America', color: '#e67e22', colorName: 'Orange' },
  { id: 'hyacinth', plant: 'Water Hyacinth', origin: 'South America', color: '#9b59b6', colorName: 'Purple' },
  { id: 'clidemia', plant: 'Senduduk Bulu', origin: 'Tropical Americas', color: '#e91e8c', colorName: 'Pink' },
  { id: 'siam', plant: 'Siam Weed', origin: 'C. & S. America', color: '#f39c12', colorName: 'Amber' },
  { id: 'albizia', plant: 'Albizia Tree', origin: 'Maluku, Indonesia', color: '#27ae60', colorName: 'Green' },
  { id: 'lantana', plant: 'Lantana', origin: 'Central America', color: '#16a085', colorName: 'Teal' },
  { id: 'salvinia', plant: 'Giant Salvinia', origin: 'South America', color: '#2980b9', colorName: 'Blue' }
];

let memFlipped = [], memMatched = 0, memMoves = 0, memLocked = false;

function initMemory() {
  memFlipped = []; memMatched = 0; memMoves = 0; memLocked = false;
  document.getElementById('moveCount').textContent = 0;
  document.getElementById('pairCount').textContent = 0;
  document.getElementById('memoryComplete').style.display = 'none';

  // Build legend
  const legend = document.getElementById('memoryLegend');
  legend.innerHTML = '';
  memoryPairs.forEach(p => {
    const item = document.createElement('div');
    item.className = 'mem-legend-item';
    item.style.borderColor = p.color;
    item.style.color = p.color;
    item.innerHTML = `<span style="width:10px;height:10px;background:${p.color};border-radius:50%;display:inline-block"></span>${p.plant} = ${p.origin}`;
    legend.appendChild(item);
  });

  const allCards = [];
  memoryPairs.forEach(p => {
    allCards.push({ id: p.id, type: 'plant', text: p.plant, sub: 'invasive plant', color: p.color });
    allCards.push({ id: p.id, type: 'origin', text: p.origin, sub: 'region of origin', color: p.color });
  });
  allCards.sort(() => Math.random() - 0.5);

  const grid = document.getElementById('memoryGrid');
  grid.innerHTML = '';
  allCards.forEach(c => {
    const card = document.createElement('button');
    card.className = 'mem-card';
    card.dataset.id = c.id;
    card.dataset.type = c.type;
    card.dataset.color = c.color;
    card.style.backgroundColor = var_to_hex('--green-mid');
    card.style.borderColor = '#ccc';
    card.innerHTML = `
      <div class="card-inner">
        <span class="card-front-icon">🌿</span>
        <div class="card-back-content">
          <span class="card-back-text">${c.text}</span>
          <span class="card-back-sub">${c.sub}</span>
        </div>
      </div>`;
    card.onclick = () => flipCard(card, c.color);
    grid.appendChild(card);
  });
}

function var_to_hex(v) { return '#2d6a4f'; }

function flipCard(card, color) {
  if (memLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  card.style.backgroundColor = color;
  card.style.borderColor = color;
  memFlipped.push(card);

  if (memFlipped.length === 2) {
    memLocked = true; memMoves++;
    document.getElementById('moveCount').textContent = memMoves;
    const [a, b] = memFlipped;
    if (a.dataset.id === b.dataset.id && a.dataset.type !== b.dataset.type) {
      a.classList.add('matched'); b.classList.add('matched');
      memMatched++;
      document.getElementById('pairCount').textContent = memMatched;
      memFlipped = []; memLocked = false;
      if (memMatched === memoryPairs.length) {
        setTimeout(() => {
          document.getElementById('memoryComplete').style.display = 'block';
          document.getElementById('finalMoves').textContent = memMoves;
          scores.memory = Math.max(scores.memory, Math.max(0, 300 - memMoves * 8));
          updateScores();
        }, 500);
      }
    } else {
      setTimeout(() => {
        a.classList.remove('flipped'); b.classList.remove('flipped');
        a.style.backgroundColor = '#2d6a4f'; a.style.borderColor = '#ccc';
        b.style.backgroundColor = '#2d6a4f'; b.style.borderColor = '#ccc';
        memFlipped = []; memLocked = false;
      }, 1000);
    }
  }
}

// ============================================================
// SPOT THE INVADER — SINGAPORE PLANTS
// ============================================================
const spotPlants = [
  { name: 'Tembusu Tree', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Fagraea_fragrans_-_Tembusu.jpg/320px-Fagraea_fragrans_-_Tembusu.jpg', type: 'native', clue: 'This iconic tree appears on Singapore\'s $5 note and has been growing in our parks for centuries. It supports dozens of native insect species and is part of Singapore\'s ecological heritage.', origin: 'Native to Singapore & Southeast Asia' },
  { name: 'Mile-a-Minute', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mikania_micrantha_W_IMG_2100.jpg/320px-Mikania_micrantha_W_IMG_2100.jpg', type: 'invasive', clue: 'This vine drapes itself over other plants like a blanket, growing up to 8cm per day. It was introduced via contaminated grass seed in the 1960s and is now Singapore\'s most problematic invasive weed.', origin: 'Native to Central & South America' },
  { name: 'Sea Apple', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Syzygium_grande_flowers_2.jpg/320px-Syzygium_grande_flowers_2.jpg', type: 'native', clue: 'A beautiful flowering tree commonly seen along Singapore\'s roadsides and parks. It produces pink fluffy flowers and supports native pollinators. It\'s one of Singapore\'s most beloved native tree species.', origin: 'Native to Singapore & Malaysia' },
  { name: 'Zanzibar Yam', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Dioscorea_bulbifera_bulbils.jpg/320px-Dioscorea_bulbifera_bulbils.jpg', type: 'invasive', clue: 'This climbing vine produces small bulb-like structures that fall and spread through soil. It twines aggressively around trees and shrubs, smothering everything beneath its heart-shaped leaves.', origin: 'Native to Africa & parts of Asia' },
  { name: 'Singapore Kopsia', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Kopsia_fruticosa1.jpg/320px-Kopsia_fruticosa1.jpg', type: 'native', clue: 'This shrub produces beautiful pink flowers and is endemic to Singapore and surrounding regions. It is found naturally in Singapore\'s secondary forests and is a key part of native forest understorey.', origin: 'Native to Singapore & Peninsula Malaysia' },
  { name: 'Siam Weed', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Chromolaena_odorata_MS_4321.jpg/320px-Chromolaena_odorata_MS_4321.jpg', type: 'invasive', clue: 'This bushy plant grows up to 3 metres tall in a single season, releasing chemicals that prevent other plants from growing nearby. It dominates wasteland on Pulau Ubin.', origin: 'Native to Central & South America' },
  { name: 'Seashore Paspalum', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Paspalum_vaginatum_Blanco1.23.jpg/320px-Paspalum_vaginatum_Blanco1.23.jpg', type: 'native', clue: 'This grass is naturally found along Singapore\'s coastal areas and is an important stabiliser of sandy and muddy shorelines. It has evolved alongside local coastal ecosystems.', origin: 'Native to tropical coastal regions globally' },
  { name: 'Water Hyacinth', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Water_hyacinth_%28Eichhornia_crassipes%29_fleur.jpg/320px-Water_hyacinth_%28Eichhornia_crassipes%29_fleur.jpg', type: 'invasive', clue: 'This floating plant has beautiful purple flowers but forms thick mats on water surfaces. It blocks sunlight, depletes oxygen for fish, and creates mosquito breeding habitat in Singapore\'s waterways.', origin: 'Native to South America' },
  { name: 'Nipah Palm', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nypa_fruticans_Blanco2.415.jpg/320px-Nypa_fruticans_Blanco2.415.jpg', type: 'native', clue: 'This palm grows in Singapore\'s mangroves and has been part of our coastal ecosystem for thousands of years. Its leaves are used in traditional Malay cooking (ketupat). It supports many mangrove species.', origin: 'Native to Singapore & Southeast Asia' },
  { name: 'Lantana', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Lantana_camara_1.jpg/320px-Lantana_camara_1.jpg', type: 'invasive', clue: 'This prickly shrub has colourful flowers that change colour as they age. Despite its pretty appearance, its berries are toxic and it forms dense thickets that prevent native plants from growing.', origin: 'Native to Central America' }
];

let spotRound = 0, spotScore = 0, spotAnswered = false, spotOrder = [];

function initSpot() {
  spotRound = 0; spotScore = 0; spotAnswered = false;
  spotOrder = [...Array(spotPlants.length).keys()].sort(() => Math.random() - 0.5);
  document.getElementById('spotComplete').style.display = 'none';
  document.getElementById('spotArea').style.display = 'block';
  renderSpot();
}
function renderSpot() {
  spotAnswered = false;
  const plant = spotPlants[spotOrder[spotRound]];
  document.getElementById('spotRound').textContent = spotRound + 1;
  document.getElementById('spotPoints').textContent = spotScore;
  const img = document.getElementById('spotImg');
  img.src = plant.img;
  img.style.display = 'block';
  document.getElementById('spotName').textContent = plant.name;
  document.getElementById('spotClue').textContent = plant.clue;
  document.getElementById('spotOrigin').textContent = '';
  document.getElementById('spotFeedback').style.display = 'none';
  document.querySelectorAll('.spot-btn').forEach(b => { b.disabled = false; b.style.opacity = 1; });
}
function spotAnswer(answer) {
  if (spotAnswered) return;
  spotAnswered = true;
  const plant = spotPlants[spotOrder[spotRound]];
  document.getElementById('spotOrigin').textContent = plant.origin;
  document.querySelectorAll('.spot-btn').forEach(b => b.disabled = true);
  const fb = document.getElementById('spotFeedback');
  if (answer === plant.type) {
    fb.className = 'spot-feedback correct';
    fb.textContent = `✅ Correct! "${plant.name}" is ${plant.type === 'invasive' ? 'an INVASIVE species' : 'a NATIVE plant to Singapore'}.`;
    spotScore++;
  } else {
    fb.className = 'spot-feedback wrong';
    fb.textContent = `❌ Not quite! "${plant.name}" is actually ${plant.type === 'invasive' ? 'an INVASIVE species' : 'a NATIVE plant to Singapore'}.`;
  }
  fb.style.display = 'block';
  setTimeout(() => {
    spotRound++;
    if (spotRound >= 10) {
      document.getElementById('spotArea').style.display = 'none';
      document.getElementById('spotComplete').style.display = 'block';
      document.getElementById('spotFinalScore').textContent = spotScore;
      scores.spot = Math.max(scores.spot, spotScore * 10);
      updateScores();
    } else { renderSpot(); }
  }, 2000);
}

// ============================================================
// PLANT ID CHALLENGE
// ============================================================
const plantIdRounds = [
  { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mikania_micrantha_W_IMG_2100.jpg/400px-Mikania_micrantha_W_IMG_2100.jpg', answer: 'Mile-a-Minute', options: ['Mile-a-Minute', 'Zanzibar Yam', 'Siam Weed', 'Lantana'], clues: ['Grows up to 8cm per day in Singapore', 'Forms a continuous blanket over other vegetation', 'Has small white daisy-like flowers', 'Introduced via contaminated grass seed in the 1960s'], explain: "Mile-a-Minute (Mikania micrantha) is identifiable by its heart-shaped leaves, twining growth habit, and the way it drapes completely over other plants. It's Singapore's most widespread invasive weed." },
  { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Dioscorea_bulbifera_bulbils.jpg/400px-Dioscorea_bulbifera_bulbils.jpg', answer: 'Zanzibar Yam', options: ['Zanzibar Yam', 'Water Hyacinth', 'Giant Salvinia', 'Mile-a-Minute'], clues: ['Produces small bulb-like structures called bulbils', 'Has large heart-shaped leaves', 'Climbs and twines around trees', 'Bulbils can remain dormant in soil for years'], explain: "The Zanzibar Yam is identified by its distinctive bulbils — small aerial tubers that hang from the vine and eventually drop to spread the plant. Its large, glossy heart-shaped leaves are also distinctive." },
  { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Water_hyacinth_%28Eichhornia_crassipes%29_fleur.jpg/400px-Water_hyacinth_%28Eichhornia_crassipes%29_fleur.jpg', answer: 'Water Hyacinth', options: ['Water Hyacinth', 'Giant Salvinia', 'Nipah Palm', 'Senduduk Bulu'], clues: ['Floats freely on water surfaces', 'Produces beautiful purple flowers', 'Has distinctive bulbous, spongy leaf stalks', 'Can double its coverage in 2 weeks'], explain: "Water Hyacinth is unmistakable with its purple flowers, rounded floating leaves, and distinctively swollen (bulbous) leaf stalks filled with air that help it float. It forms dense mats in Singapore's waterways." },
  { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Clidemia_hirta_-_Koster%27s_curse_-_desc-flower.jpg/400px-Clidemia_hirta_-_Koster%27s_curse_-_desc-flower.jpg', answer: 'Senduduk Bulu', options: ['Senduduk Bulu', 'Lantana', 'Siam Weed', 'Albizia'], clues: ['Grows in shaded forest understorey', 'Has hairy (bulu means hairy) leaves with prominent veins', 'Produces small white flowers and dark purple berries', 'Spread by the invasive Javan Myna bird'], explain: "Senduduk Bulu (Clidemia hirta) is identified by its hairy, ribbed leaves with 5–7 prominent veins running lengthwise, small white flowers, and dark purple berries. 'Bulu' means hairy in Malay, describing its key feature." },
  { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Chromolaena_odorata_MS_4321.jpg/400px-Chromolaena_odorata_MS_4321.jpg', answer: 'Siam Weed', options: ['Siam Weed', 'Mile-a-Minute', 'Lantana', 'Zanzibar Yam'], clues: ['Grows into a large bushy shrub, 2–3 metres tall', 'Has opposite, triangular-toothed leaves', 'Produces clusters of small pale lilac/white flowers', 'Has a distinctive strong smell when leaves are crushed'], explain: "Siam Weed is identified by its bushy shrub growth, opposite leaves with toothed margins, small lilac flower clusters, and a strong, distinctive smell when you crush its leaves. It dominates wasteland and forest edges." },
  { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Falcataria_moluccana_in_singapore.jpg/400px-Falcataria_moluccana_in_singapore.jpg', answer: 'Albizia', options: ['Albizia', 'Tembusu', 'Sea Apple', 'Nipah Palm'], clues: ['One of the world\'s fastest-growing trees — up to 7m per year', 'Has a flat-topped, spreading canopy', 'Produces feathery, bipinnate leaves', 'Commonly seen across Singapore but structurally dangerous'], explain: "Albizia (Falcataria moluccana) is identified by its extremely rapid growth, flat umbrella-like canopy, and feathery compound leaves. Despite looking impressive, its wood is brittle and it poses a falling hazard in storms." },
  { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Lantana_camara_1.jpg/400px-Lantana_camara_1.jpg', answer: 'Lantana', options: ['Lantana', 'Siam Weed', 'Senduduk Bulu', 'Sea Apple'], clues: ['Has small flowers that change colour as they age', 'Produces small dark berries toxic to children', 'Has rough, prickly stems', 'Still sold in some Singapore nurseries as an ornamental'], explain: "Lantana is identified by its clusters of small multi-coloured flowers (often yellow, orange, and red mixed on the same plant), its rough hairy leaves, prickly stems, and small dark berries. The colour-changing flowers are its most distinctive feature." },
  { img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Salvinia_molesta_3.jpg/400px-Salvinia_molesta_3.jpg', answer: 'Giant Salvinia', options: ['Giant Salvinia', 'Water Hyacinth', 'Water Lettuce', 'Nipah Palm'], clues: ['A floating fern — not a flowering plant', 'Covered in tiny egg-beater shaped water-repelling hairs', 'Grows in dense mats on still or slow water', 'Primarily spread by aquarium plant dumping in Singapore'], explain: "Giant Salvinia is a floating fern identified by its paired floating leaves covered in distinctive water-repelling hairs (shaped like tiny egg-beaters), and a third submerged leaf that acts as roots. Its mats grow extremely dense." }
];

let plantIdRound = 0, plantIdScore = 0, plantIdAnswered = false;

function initPlantId() {
  plantIdRound = 0; plantIdScore = 0; plantIdAnswered = false;
  document.getElementById('plantidComplete').style.display = 'none';
  document.getElementById('plantidArea').style.display = 'block';
  renderPlantId();
}
function renderPlantId() {
  plantIdAnswered = false;
  const r = plantIdRounds[plantIdRound];
  document.getElementById('idRound').textContent = plantIdRound + 1;
  const img = document.getElementById('plantidImg');
  img.src = r.img;
  img.className = 'plantid-img';
  const overlay = document.querySelector('.plantid-overlay');
  overlay.classList.remove('hidden');
  const cluesDiv = document.getElementById('plantidClues');
  cluesDiv.innerHTML = '<h4>🔍 Clues:</h4>' + r.clues.map(c => `<div class="plantid-clue-item">${c}</div>`).join('');
  const answersDiv = document.getElementById('plantidAnswers');
  const shuffled = [...r.options].sort(() => Math.random() - 0.5);
  answersDiv.innerHTML = '';
  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'plantid-btn';
    btn.textContent = opt;
    btn.onclick = () => selectPlantId(opt, r.answer, r.explain, btn);
    answersDiv.appendChild(btn);
  });
  document.getElementById('plantidFeedback').style.display = 'none';
  document.getElementById('plantidNextBtn').style.display = 'none';
}
function selectPlantId(chosen, correct, explain, clickedBtn) {
  if (plantIdAnswered) return;
  plantIdAnswered = true;
  document.querySelectorAll('.plantid-btn').forEach(b => b.disabled = true);
  document.getElementById('plantidImg').classList.add('revealed');
  document.querySelector('.plantid-overlay').classList.add('hidden');
  const fb = document.getElementById('plantidFeedback');
  if (chosen === correct) {
    clickedBtn.classList.add('correct');
    fb.className = 'plantid-feedback correct-fb';
    fb.innerHTML = `✅ Correct! This is <strong>${correct}</strong>. ${explain}`;
    plantIdScore++;
  } else {
    clickedBtn.classList.add('wrong');
    document.querySelectorAll('.plantid-btn').forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
    fb.className = 'plantid-feedback wrong-fb';
    fb.innerHTML = `❌ This is <strong>${correct}</strong>. ${explain}`;
  }
  fb.style.display = 'block';
  document.getElementById('plantidNextBtn').style.display = 'inline-block';
}
function nextPlantId() {
  plantIdRound++;
  if (plantIdRound >= plantIdRounds.length) {
    document.getElementById('plantidArea').style.display = 'none';
    document.getElementById('plantidComplete').style.display = 'block';
    document.getElementById('plantidFinal').textContent = plantIdScore;
    scores.id = Math.max(scores.id, plantIdScore * 15);
    updateScores();
  } else {
    renderPlantId();
  }
}

// ============================================================
// SPREAD SIMULATOR
// ============================================================
let simGrid = [], simRunning = false, simInterval = null, simYearCount = 0;
const SIM_COLS = 60, SIM_ROWS = 35;
const spreadRates = { mam: 0.12, zanzibar: 0.07, siam: 0.04, hyacinth: 0.09 };
const sizeMultipliers = { ideal: 1.0, good: 0.8, poor: 0.6 };

function resetSim() {
  simRunning = false; clearInterval(simInterval); simYearCount = 0;
  const btn = document.getElementById('simPlayBtn');
  if (btn) btn.textContent = '▶️ Start Simulation';
  ['simYear','simCoverage'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = 0; });
  const tip = document.getElementById('simTip');
  if (tip) tip.textContent = 'Select a species and press Start. Watch what happens over 30 years!';
  simGrid = Array.from({ length: SIM_ROWS }, () => Array(SIM_COLS).fill(0));
  // Add some water cells for realism
  for (let c = 0; c < SIM_COLS; c++) {
    if (c > SIM_COLS * 0.6 && c < SIM_COLS * 0.75) {
      for (let r = SIM_ROWS * 0.3; r < SIM_ROWS * 0.7; r++) simGrid[Math.floor(r)][c] = 3;
    }
  }
  simGrid[Math.floor(SIM_ROWS / 2)][5] = 1;
  drawSim();
}
function drawSim() {
  const canvas = document.getElementById('simCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cw = canvas.width, ch = canvas.height;
  const cellW = cw / SIM_COLS, cellH = ch / SIM_ROWS;
  for (let r = 0; r < SIM_ROWS; r++) {
    for (let c = 0; c < SIM_COLS; c++) {
      const v = simGrid[r][c];
      ctx.fillStyle = v === 0 ? '#2d6a4f' : v === 1 ? '#e74c3c' : v === 2 ? '#1a5c2a' : '#3498db';
      ctx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
    }
  }
  // Legend
  const items = [['#2d6a4f','Native'], ['#e74c3c','Invaded'], ['#3498db','Water'], ['#1a5c2a','Protected']];
  let lx = 8;
  ctx.font = '11px Nunito, sans-serif';
  items.forEach(([col, label]) => {
    ctx.fillStyle = col; ctx.fillRect(lx, ch - 24, 14, 14);
    ctx.fillStyle = 'white'; ctx.fillText(label, lx + 17, ch - 12);
    lx += 85;
  });
}
function stepSim() {
  const species = document.getElementById('simSpecies').value;
  const size = document.getElementById('simClimate').value;
  const rate = spreadRates[species] * sizeMultipliers[size];
  const isAquatic = species === 'hyacinth';
  const newGrid = simGrid.map(r => [...r]);
  for (let r = 0; r < SIM_ROWS; r++) {
    for (let c = 0; c < SIM_COLS; c++) {
      if (simGrid[r][c] === 1) {
        [[r-1,c],[r+1,c],[r,c-1],[r,c+1],[r-1,c-1],[r+1,c+1]].forEach(([nr,nc]) => {
          if (nr<0||nr>=SIM_ROWS||nc<0||nc>=SIM_COLS) return;
          const target = simGrid[nr][nc];
          if (isAquatic && target === 3 && Math.random() < rate) newGrid[nr][nc] = 1;
          else if (!isAquatic && target === 0 && Math.random() < rate) newGrid[nr][nc] = 1;
        });
      }
    }
  }
  simGrid = newGrid; simYearCount++;
  const invaded = simGrid.flat().filter(v => v === 1).length;
  const total = simGrid.flat().filter(v => v !== 3).length;
  const pct = Math.round((invaded / total) * 100);
  document.getElementById('simYear').textContent = simYearCount;
  document.getElementById('simCoverage').textContent = pct;
  const tip = document.getElementById('simTip');
  if (pct > 5 && pct <= 20) tip.textContent = '🔴 Invasion spreading! Native species are being displaced.';
  else if (pct > 20 && pct <= 50) tip.textContent = '🚨 Over 20% invaded! Wildlife habitats are collapsing.';
  else if (pct > 50) tip.textContent = '💀 Over half the reserve is destroyed. This is why early action matters so much!';
  if (simYearCount >= 30) {
    clearInterval(simInterval); simRunning = false;
    document.getElementById('simPlayBtn').textContent = '▶️ Start Simulation';
    tip.textContent = `30 years later: ${pct}% of the reserve is invaded. Press Reset to try a different scenario!`;
  }
  drawSim();
}
function toggleSim() {
  if (simRunning) {
    clearInterval(simInterval); simRunning = false;
    document.getElementById('simPlayBtn').textContent = '▶️ Resume';
  } else {
    simRunning = true;
    document.getElementById('simPlayBtn').textContent = '⏸️ Pause';
    simInterval = setInterval(stepSim, 180);
  }
}
function addIntervention() {
  let count = 0;
  for (let r = 0; r < SIM_ROWS && count < 25; r++) {
    for (let c = 0; c < SIM_COLS && count < 25; c++) {
      if (simGrid[r][c] === 1 && Math.random() < 0.35) { simGrid[r][c] = 2; count++; }
    }
  }
  const tip = document.getElementById('simTip');
  if (tip) tip.textContent = '🛡️ NParks intervened! Protected cells (dark green) resist further invasion. But is it enough?';
  drawSim();
}

// ============================================================
// PLEDGE SYSTEM
// ============================================================
function updatePledge() {
  const checkboxes = document.querySelectorAll('.pledge-items input[type="checkbox"]');
  const checked = [...checkboxes].filter(c => c.checked).length;
  document.getElementById('pledgeCount').textContent = checked;
  document.getElementById('pledgeFill').style.width = (checked / checkboxes.length * 100) + '%';
  document.getElementById('pledgeComplete').style.display = checked === checkboxes.length ? 'block' : 'none';
  localStorage.setItem('pledgeState_sg', JSON.stringify([...checkboxes].map(c => c.checked)));
}
function restorePledge() {
  const saved = JSON.parse(localStorage.getItem('pledgeState_sg') || '[]');
  const checkboxes = document.querySelectorAll('.pledge-items input[type="checkbox"]');
  saved.forEach((state, i) => { if (checkboxes[i]) checkboxes[i].checked = state; });
  if (checkboxes.length) updatePledge();
}

// INIT
window.addEventListener('load', () => {
  updateProgress();
  restorePledge();
});
