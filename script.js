// PAGE NAVIGATION
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const navLink = document.querySelector(`[data-page="${name}"]`);
  if (navLink) navLink.classList.add('active');
  window.scrollTo(0, 0);
  if (name === 'games') { initQuiz(); initMemory(); initSpot(); resetSim(); }
  if (name === 'action') restorePledge();
}

// NAVBAR TOGGLE
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// FALLING LEAVES
const leavesContainer = document.getElementById('leavesContainer');
const leafEmojis = ['🍃', '🌿', '🌱', '🍂', '🌾'];
for (let i = 0; i < 18; i++) {
  const leaf = document.createElement('div');
  leaf.classList.add('falling-leaf');
  leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
  leaf.style.left = Math.random() * 100 + 'vw';
  leaf.style.animationDuration = (6 + Math.random() * 10) + 's';
  leaf.style.animationDelay = (Math.random() * 10) + 's';
  leaf.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
  leavesContainer.appendChild(leaf);
}

// SCROLL FADE-UP
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.info-card, .step-card').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = (i * 0.08) + 's';
  observer.observe(el);
});

// LEARN TABS
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// PROGRESS TRACKER
const readTabs = new Set(JSON.parse(localStorage.getItem('readTabs') || '[]'));
function updateProgress() {
  const pct = Math.round((readTabs.size / 5) * 100);
  const fill = document.getElementById('progressFill');
  const pctEl = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
}
function markRead(tabId) {
  readTabs.add(tabId);
  localStorage.setItem('readTabs', JSON.stringify([...readTabs]));
  updateProgress();
  const btn = document.querySelector(`#tab-${tabId} .mark-read-btn`);
  if (btn) { btn.textContent = '✅ Done!'; btn.classList.add('done'); }
}
readTabs.forEach(tabId => {
  const btn = document.querySelector(`#tab-${tabId} .mark-read-btn`);
  if (btn) { btn.textContent = '✅ Done!'; btn.classList.add('done'); }
});
updateProgress();

// SPECIES FILTER
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.sp-card').forEach(card => {
      const cats = card.dataset.category || '';
      card.classList.toggle('hidden', filter !== 'all' && !cats.includes(filter));
    });
  });
});

// SPECIES EXPAND
function toggleSpecies(id, btn) {
  const detail = document.getElementById(id);
  if (detail.classList.contains('open')) {
    detail.classList.remove('open');
    detail.style.display = 'none';
    btn.textContent = 'Learn More ▼';
  } else {
    detail.classList.add('open');
    detail.style.display = 'block';
    btn.textContent = 'Show Less ▲';
  }
}

// GAME SCORES
const scores = { quiz: 0, memory: 0, spot: 0 };
function updateScores() {
  document.getElementById('quizScoreVal').textContent = scores.quiz;
  document.getElementById('memoryScoreVal').textContent = scores.memory;
  document.getElementById('spotScoreVal').textContent = scores.spot;
  document.getElementById('totalScoreVal').textContent = scores.quiz + scores.memory + scores.spot;
}

// GAME SELECTION
function selectGame(name) {
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active-panel'));
  document.querySelectorAll('.game-select-card').forEach(c => c.classList.remove('active-game'));
  document.getElementById('game-' + name).classList.add('active-panel');
  const idx = ['quiz','memory','spot','spread'].indexOf(name);
  const cards = document.querySelectorAll('.game-select-card');
  if (cards[idx]) cards[idx].classList.add('active-game');
  document.getElementById('game-' + name).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// QUIZ
const quizQuestions = [
  { q: "What does 'invasive' mean when describing a plant species?", a: ["It's poisonous to humans", "It's non-native and causes ecological harm", "It grows very slowly", "It only grows in deserts"], correct: 1, explain: "An invasive plant is non-native to an ecosystem and causes environmental, economic, or health damage." },
  { q: "Why do invasive plants often spread so quickly in new environments?", a: ["They have better roots", "They need less sunlight", "They have no natural predators or diseases", "They grow during winter"], correct: 2, explain: "In their home country, insects, fungi, and animals keep them in check. In a new place, these natural controls don't exist!" },
  { q: "Which invasive plant is nicknamed 'The Vine That Ate the South'?", a: ["Japanese Knotweed", "Water Hyacinth", "Kudzu", "Purple Loosestrife"], correct: 2, explain: "Kudzu from East Asia can grow 30cm in a single day and has smothered vast areas of the southern USA." },
  { q: "Water Hyacinth is harmful in aquatic ecosystems because it...", a: ["Makes water taste bad", "Blocks sunlight and depletes oxygen for fish", "Freezes waterways", "Attracts too many insects"], correct: 1, explain: "Water hyacinth forms thick floating mats that block sunlight to underwater plants and deplete oxygen, suffocating fish." },
  { q: "Japanese Knotweed is notorious for...", a: ["Being extremely colourful", "Cracking foundations and concrete structures", "Only growing in water", "Producing dangerous fruits"], correct: 1, explain: "Japanese Knotweed roots can penetrate building foundations, walls, and pavements, causing millions in property damage." },
  { q: "Which of these is NOT a way invasive plants spread?", a: ["Wind dispersal of seeds", "Birds eating and depositing seeds", "Photosynthesis", "Seeds sticking to clothing"], correct: 2, explain: "Photosynthesis is how plants make food from sunlight — not a method of spreading!" },
  { q: "What is 'allelopathy' in the context of invasive plants?", a: ["When a plant grows underground", "When a plant releases toxins to poison surrounding soil", "When a plant flowers twice a year", "When a plant needs a lot of water"], correct: 1, explain: "Allelopathy is when a plant releases chemicals into the soil that prevent other plants from growing nearby." },
  { q: "Which biological control has been successfully used against Water Hyacinth?", a: ["Kudzu bugs", "Neochetina weevils", "Lantana beetles", "Knotweed psyllids"], correct: 1, explain: "Neochetina weevils are natural enemies of water hyacinth from South America. They've been used successfully across Africa." },
  { q: "Why are island ecosystems particularly vulnerable to invasive plants?", a: ["They have more rainfall", "Islands are always hotter", "Island species evolved in isolation with no defences against invasives", "Soil is better on islands"], correct: 2, explain: "Island species evolved without exposure to many competitors, making them defenceless when an aggressive invasive arrives." },
  { q: "What is the BEST method to prevent invasive plant spread?", a: ["Cutting plants frequently", "Using strong herbicides everywhere", "Prevention — stopping introductions before they happen", "Introducing more animals"], correct: 2, explain: "Prevention is always more effective and cheaper than controlling established invasive plants." }
];

let currentQ = 0, quizQScore = 0, answered = false;

function initQuiz() {
  currentQ = 0; quizQScore = 0; answered = false;
  document.getElementById('quizComplete').style.display = 'none';
  document.getElementById('quizArea').style.display = 'block';
  renderQuestion();
}
function renderQuestion() {
  answered = false;
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
  if (answered) return;
  answered = true;
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
    fb.innerHTML = '❌ Not quite! ' + q.explain;
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
    const msgs = [[0,3,'Keep studying! Visit the Learn section 📚'],[4,6,"Good effort! You're getting there 🌱"],[7,8,'Great job! You know your invasive plants 🌿'],[9,10,"AMAZING! You're a true Plant Defender! 🏆"]];
    const m = msgs.find(([mn,mx]) => quizQScore >= mn && quizQScore <= mx);
    document.getElementById('scoreMessage').textContent = m[2];
    scores.quiz = Math.max(scores.quiz, quizQScore * 10);
    updateScores();
  } else { renderQuestion(); }
}
function restartQuiz() { initQuiz(); }

// MEMORY GAME
const memoryPairs = [
  { id: 'kudzu', plant: '🌿 Kudzu', origin: '🌏 East Asia' },
  { id: 'hyacinth', plant: '💜 W. Hyacinth', origin: '🌎 S. America' },
  { id: 'knotweed', plant: '🎋 Knotweed', origin: '🌏 Japan' },
  { id: 'lantana', plant: '🌸 Lantana', origin: '🌎 C. America' },
  { id: 'loosestrife', plant: '🌺 Loosestrife', origin: '🌍 Europe' },
  { id: 'cogon', plant: '🌾 Cogon Grass', origin: '🌏 SE Asia' },
  { id: 'ivy', plant: '🍃 English Ivy', origin: '🌍 W. Europe' },
  { id: 'mimosa', plant: '🌲 Mimosa Tree', origin: '🌏 E. Asia' }
];

let memFlipped = [], memMatched = 0, memMoves = 0, memLocked = false;

function initMemory() {
  memFlipped = []; memMatched = 0; memMoves = 0; memLocked = false;
  document.getElementById('moveCount').textContent = 0;
  document.getElementById('pairCount').textContent = 0;
  document.getElementById('memoryComplete').style.display = 'none';
  const allCards = [];
  memoryPairs.forEach(p => {
    allCards.push({ id: p.id, type: 'plant', text: p.plant });
    allCards.push({ id: p.id, type: 'origin', text: p.origin });
  });
  allCards.sort(() => Math.random() - 0.5);
  const grid = document.getElementById('memoryGrid');
  grid.innerHTML = '';
  allCards.forEach(c => {
    const card = document.createElement('button');
    card.className = 'mem-card';
    card.dataset.id = c.id;
    card.dataset.type = c.type;
    card.innerHTML = `<span class="card-front">🌿</span><span class="card-back">${c.text}</span>`;
    card.onclick = () => flipCard(card);
    grid.appendChild(card);
  });
}
function flipCard(card) {
  if (memLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
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
          scores.memory = Math.max(scores.memory, Math.max(0, 200 - memMoves * 5));
          updateScores();
        }, 400);
      }
    } else {
      setTimeout(() => {
        a.classList.remove('flipped'); b.classList.remove('flipped');
        memFlipped = []; memLocked = false;
      }, 900);
    }
  }
}

// SPOT THE INVADER
const spotPlants = [
  { name: 'Red Maple', emoji: '🍁', type: 'native', clue: 'This tree is found throughout eastern North America and provides habitat for dozens of native insects and birds.', origin: 'Native to North America' },
  { name: 'Kudzu', emoji: '🌿', type: 'invasive', clue: 'This fast-growing vine came from East Asia. It can completely smother trees and grows up to 30cm per day.', origin: 'Native to East Asia' },
  { name: 'White Oak', emoji: '🌳', type: 'native', clue: 'This tree has deep roots that prevent erosion. Its acorns feed over 500 species of wildlife in its native range.', origin: 'Native to Eastern North America' },
  { name: 'Water Hyacinth', emoji: '💜', type: 'invasive', clue: 'This floating plant forms thick mats on water surfaces. It came from South America and depletes oxygen for fish.', origin: 'Native to South America' },
  { name: 'Blue Flag Iris', emoji: '💙', type: 'native', clue: 'This beautiful wetland plant is an important food source for native bees. It evolved alongside local wildlife.', origin: 'Native to North America' },
  { name: 'Japanese Knotweed', emoji: '🎋', type: 'invasive', clue: 'This plant has hollow bamboo-like stems. Its roots can crack building foundations and are extremely hard to kill.', origin: 'Native to Japan and China' },
  { name: 'Longleaf Pine', emoji: '🌲', type: 'native', clue: 'This tree can live for 500 years and supports 900 plant species beneath it.', origin: 'Native to Southeast USA' },
  { name: 'Lantana', emoji: '🌸', type: 'invasive', clue: 'This shrub has pretty flowers but its berries are toxic to livestock and children. It forms dense thickets blocking native plants.', origin: 'Native to Central and South America' },
  { name: 'Wild Bergamot', emoji: '🌼', type: 'native', clue: 'This flowering plant is a crucial nectar source for native bees and butterflies. It evolved with local pollinators.', origin: 'Native to North America' },
  { name: 'Purple Loosestrife', emoji: '🌺', type: 'invasive', clue: 'This plant has attractive purple flowers but destroys wetland habitats. Each plant produces 2.7 million seeds per year!', origin: 'Native to Europe and Asia' }
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
  document.getElementById('spotEmoji').textContent = plant.emoji;
  document.getElementById('spotName').textContent = plant.name;
  document.getElementById('spotClue').textContent = plant.clue;
  document.getElementById('spotOrigin').textContent = '';
  document.getElementById('spotFeedback').style.display = 'none';
  document.querySelectorAll('.spot-btn').forEach(b => { b.disabled = false; });
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
    fb.innerHTML = `✅ Correct! "${plant.name}" is indeed ${plant.type === 'invasive' ? 'an INVASIVE species' : 'a NATIVE plant'}!`;
    spotScore++;
  } else {
    fb.className = 'spot-feedback wrong';
    fb.innerHTML = `❌ Not quite! "${plant.name}" is actually ${plant.type === 'invasive' ? 'an INVASIVE species' : 'a NATIVE plant'}.`;
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
  }, 1800);
}

// SPREAD SIMULATOR
let simGrid = [], simRunning = false, simInterval = null, simYearCount = 0;
const SIM_COLS = 60, SIM_ROWS = 35;
const spreadRates = { slow: 0.03, fast: 0.1, water: 0.07 };
const climateMultipliers = { ideal: 1.5, good: 1.0, poor: 0.5 };

function resetSim() {
  simRunning = false; clearInterval(simInterval); simYearCount = 0;
  const playBtn = document.getElementById('simPlayBtn');
  if (playBtn) playBtn.textContent = '▶️ Start Simulation';
  if (document.getElementById('simYear')) document.getElementById('simYear').textContent = 0;
  if (document.getElementById('simCoverage')) document.getElementById('simCoverage').textContent = 0;
  if (document.getElementById('simTip')) document.getElementById('simTip').textContent = 'Press Start to begin. Watch what happens over 50 years!';
  simGrid = Array.from({ length: SIM_ROWS }, () => Array(SIM_COLS).fill(0));
  simGrid[Math.floor(SIM_ROWS/2)][Math.floor(SIM_COLS/2)] = 1;
  drawSim();
}
function drawSim() {
  const canvas = document.getElementById('simCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cw = canvas.width, ch = canvas.height;
  const cellW = cw / SIM_COLS, cellH = ch / SIM_ROWS;
  ctx.clearRect(0, 0, cw, ch);
  for (let r = 0; r < SIM_ROWS; r++) {
    for (let c = 0; c < SIM_COLS; c++) {
      const v = simGrid[r][c];
      ctx.fillStyle = v === 0 ? '#2d6a4f' : v === 1 ? '#e74c3c' : '#1a5c2a';
      ctx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
    }
  }
  ctx.fillStyle = '#2d6a4f'; ctx.fillRect(10, ch-25, 15, 15);
  ctx.fillStyle = '#e74c3c'; ctx.fillRect(90, ch-25, 15, 15);
  ctx.fillStyle = '#1a5c2a'; ctx.fillRect(175, ch-25, 15, 15);
  ctx.fillStyle = 'white'; ctx.font = '11px Nunito, sans-serif';
  ctx.fillText('Native', 28, ch-13);
  ctx.fillText('Invaded', 108, ch-13);
  ctx.fillText('Protected', 193, ch-13);
}
function stepSim() {
  const species = document.getElementById('simSpecies').value;
  const climate = document.getElementById('simClimate').value;
  const rate = spreadRates[species] * climateMultipliers[climate];
  const newGrid = simGrid.map(r => [...r]);
  for (let r = 0; r < SIM_ROWS; r++) {
    for (let c = 0; c < SIM_COLS; c++) {
      if (simGrid[r][c] === 1) {
        [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr,nc]) => {
          if (nr>=0 && nr<SIM_ROWS && nc>=0 && nc<SIM_COLS && newGrid[nr][nc] === 0 && Math.random() < rate) newGrid[nr][nc] = 1;
        });
      }
    }
  }
  simGrid = newGrid;
  simYearCount++;
  const invaded = simGrid.flat().filter(v => v === 1).length;
  const pct = Math.round((invaded / (SIM_ROWS * SIM_COLS)) * 100);
  document.getElementById('simYear').textContent = simYearCount;
  document.getElementById('simCoverage').textContent = pct;
  const tip = document.getElementById('simTip');
  if (pct >= 5 && pct < 20) tip.textContent = '🔴 Invasion spreading! Native species are starting to be displaced.';
  else if (pct >= 20 && pct < 50) tip.textContent = '🚨 Over 20% invaded! Wildlife habitats are collapsing.';
  else if (pct >= 50) tip.textContent = '💀 More than half the habitat is destroyed. This is why early detection matters!';
  if (simYearCount >= 50) {
    clearInterval(simInterval); simRunning = false;
    document.getElementById('simPlayBtn').textContent = '▶️ Start Simulation';
    tip.textContent = `50 years later: ${pct}% of the habitat has been invaded. Press Reset to try again!`;
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
    simInterval = setInterval(stepSim, 200);
  }
}
function addIntervention() {
  let count = 0;
  for (let r = 0; r < SIM_ROWS && count < 20; r++) {
    for (let c = 0; c < SIM_COLS && count < 20; c++) {
      if (simGrid[r][c] === 1 && Math.random() < 0.3) { simGrid[r][c] = 2; count++; }
    }
  }
  document.getElementById('simTip').textContent = '🛡️ Intervention applied! Protected cells resist further invasion.';
  drawSim();
}

// PLEDGE
function updatePledge() {
  const checkboxes = document.querySelectorAll('.pledge-items input[type="checkbox"]');
  const checked = [...checkboxes].filter(c => c.checked).length;
  document.getElementById('pledgeCount').textContent = checked;
  document.getElementById('pledgeFill').style.width = (checked / checkboxes.length * 100) + '%';
  document.getElementById('pledgeComplete').style.display = checked === checkboxes.length ? 'block' : 'none';
  localStorage.setItem('pledgeState', JSON.stringify([...checkboxes].map(c => c.checked)));
}
function restorePledge() {
  const saved = JSON.parse(localStorage.getItem('pledgeState') || '[]');
  const checkboxes = document.querySelectorAll('.pledge-items input[type="checkbox"]');
  saved.forEach((state, i) => { if (checkboxes[i]) checkboxes[i].checked = state; });
  if (checkboxes.length) updatePledge();
}

window.addEventListener('load', () => {
  updateProgress();
  restorePledge();
});
