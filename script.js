// ============================================================
// NAVIGATION
// ============================================================
const scores = { quiz: 0, memory: 0, spot: 0, runner: 0 };

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const link = document.querySelector(`[data-page="${name}"]`);
  if (link) link.classList.add('active');
  window.scrollTo(0, 0);
  if (name === 'games') { setTimeout(initAllGames, 100); }
  if (name === 'action') restorePledge();
}

document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function updateScores() {
  document.getElementById('quizScoreVal').textContent = scores.quiz;
  document.getElementById('memoryScoreVal').textContent = scores.memory;
  document.getElementById('spotScoreVal').textContent = scores.spot;
  document.getElementById('runnerScoreVal').textContent = scores.runner;
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  document.getElementById('totalScoreVal').textContent = total;
  document.getElementById('navTotalScore').textContent = `⭐ ${total} pts`;
}

// ============================================================
// HERO PARTICLES
// ============================================================
const hp = document.getElementById('heroParticles');
const colors = ['#74c69d','#52b788','#f4d03f','#e67e22','#3498db'];
for (let i = 0; i < 25; i++) {
  const p = document.createElement('div');
  p.className = 'h-particle';
  const size = 4 + Math.random() * 10;
  p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${8+Math.random()*12}s;animation-delay:${Math.random()*10}s`;
  hp.appendChild(p);
}

// ============================================================
// SCROLL ANIMATIONS
// ============================================================
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.hook-card, .action-card, .info-card').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = (i % 6 * 0.08) + 's';
  obs.observe(el);
});

// ============================================================
// LEARN PAGE — TABS + PROGRESS
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

const readTabs = new Set(JSON.parse(localStorage.getItem('readTabs_sg3') || '[]'));
function updateProgress() {
  const pct = Math.round((readTabs.size / 5) * 100);
  const f = document.getElementById('progressFill');
  const p = document.getElementById('progressPct');
  if (f) f.style.width = pct + '%';
  if (p) p.textContent = pct + '%';
}
function markRead(tabId, btn) {
  readTabs.add(tabId);
  localStorage.setItem('readTabs_sg3', JSON.stringify([...readTabs]));
  updateProgress();
  btn.textContent = '✅ Done!';
  btn.classList.add('done');
  showToast('📖 Section marked as read! ' + Math.round((readTabs.size / 5) * 100) + '% complete');
}
readTabs.forEach(t => {
  const b = document.querySelector(`#tab-${t} .mark-read-btn`);
  if (b) { b.textContent = '✅ Done!'; b.classList.add('done'); }
});
updateProgress();

// ============================================================
// SPECIES — FILTER + EXPAND
// ============================================================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.sp-card').forEach(c => {
      c.classList.toggle('hidden', f !== 'all' && !c.dataset.category.includes(f));
    });
  });
});

function toggleSp(id, btn) {
  const d = document.getElementById(id);
  const open = d.classList.contains('open');
  d.classList.toggle('open', !open);
  d.style.display = open ? 'none' : 'block';
  btn.textContent = open ? 'Full Profile ▼' : 'Show Less ▲';
}

// ============================================================
// GAME SYSTEM
// ============================================================
function selectGame(name) {
  document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active-panel'));
  document.querySelectorAll('.gsc').forEach(c => c.classList.remove('active-gsc'));
  document.getElementById('game-' + name).classList.add('active-panel');
  const idx = ['quiz', 'memory', 'spot', 'runner', 'spread'].indexOf(name);
  const cards = document.querySelectorAll('.gsc');
  if (cards[idx]) cards[idx].classList.add('active-gsc');
  document.getElementById('game-' + name).scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (name === 'spread') resetSim();
}

function initAllGames() {
  initQuiz();
  initMemory();
  initSpot();
  resetSim();
  initRunnerDisplay();
}

// ============================================================
// QUIZ — 12 SINGAPORE QUESTIONS
// ============================================================
const quizData = [
  { q: "Which invasive plant is considered Singapore's most problematic weed by NParks?", a: ["Zanzibar Yam", "Mile-a-Minute (Mikania micrantha)", "Lantana", "Water Hyacinth"], c: 1, e: "Mile-a-Minute grows up to 8cm per day and is found in virtually every nature area in Singapore, smothering native vegetation wherever it spreads." },
  { q: "How did Mile-a-Minute first arrive in Singapore?", a: ["Carried by migratory birds", "Deliberately planted by NParks", "Via contaminated grass seed in the 1960s", "Through the aquarium trade"], c: 2, e: "Contaminated grass seed imports in the 1960s — a preventable mistake that created decades of ongoing management costs." },
  { q: "The Zanzibar Yam spreads in Singapore primarily through:", a: ["Wind-dispersed seeds", "Bulbils that fall and remain dormant in soil", "Underground root runners", "Being eaten and spread by birds"], c: 1, e: "Bulbils are small aerial tubers that drop from the vine. They can remain viable in soil for years before sprouting into new plants." },
  { q: "Why is Senduduk Bulu especially dangerous in Singapore's forests?", a: ["It only grows in open fields", "It tolerates shade and can invade intact forest understorey", "It is spread only by humans", "It only affects aquatic habitats"], c: 1, e: "Unlike most invasives, Senduduk Bulu can invade shaded forest understorey — preventing native tree seedlings from establishing and breaking the forest regeneration cycle." },
  { q: "What is an 'invasion meltdown'?", a: ["When a forest burns down due to invasives", "When two invasive species help each other spread — like the Javan Myna spreading Senduduk Bulu", "When invasives spread faster in summer", "When NParks runs out of budget"], c: 1, e: "The Javan Myna (itself invasive) eats Senduduk Bulu berries and disperses seeds throughout forests. Two invasives helping each other is called an invasion meltdown." },
  { q: "The Albizia tree is dangerous in Singapore because:", a: ["Its berries are toxic to humans", "It grows very fast but produces weak wood that breaks dangerously in storms", "It blocks waterways", "It releases toxic chemicals"], c: 1, e: "Albizia grows up to 7m/year but produces brittle wood. In Singapore's storms, branches and whole trees can fall suddenly — a serious widow-maker hazard." },
  { q: "Why was Water Hyacinth originally introduced to Singapore?", a: ["As a water treatment plant", "For aquaculture", "As a decorative ornamental pond plant", "For scientific research"], c: 2, e: "Introduced as a decorative pond plant due to its beautiful purple flowers — now one of Singapore's costliest aquatic invasives." },
  { q: "Which agency should you contact if you spot Water Hyacinth in a Singapore canal?", a: ["Ministry of Education", "PUB (Public Utilities Board) — 1800-284-6600", "Urban Redevelopment Authority", "Singapore Tourism Board"], c: 1, e: "PUB manages Singapore's waterways and has specialist aquatic invasive removal teams. Their 24-hour hotline is 1800-284-6600." },
  { q: "What makes Singapore especially vulnerable to invasive plant introductions?", a: ["Its small size alone", "Being a major port and aviation hub with a tropical climate perfect for invasive growth", "Having too many parks", "Its soil composition"], c: 1, e: "Singapore's position as a global port and aviation hub means invasives constantly arrive in cargo, soil, and luggage — then our tropical climate allows year-round explosive growth." },
  { q: "Giant Salvinia is primarily spread in Singapore through:", a: ["Migratory birds", "Flood events", "Aquarium hobbyists dumping plants into waterways", "Wind dispersal"], c: 2, e: "Aquarium hobbyists dumping plants into Singapore canals and waterways is the main vector. Giant Salvinia can double its biomass in just 2.5 days!" },
  { q: "What is Singapore's 'City in Nature' initiative?", a: ["A plan to build more indoor gardens", "NParks' initiative to weave nature throughout Singapore's urban landscape and restore biodiversity", "A tourism campaign", "A programme for importing ornamental plants"], c: 1, e: "City in Nature is NParks' flagship initiative. Managing invasive plants is one of its biggest ongoing challenges — which is why citizen action matters so much." },
  { q: "Bukit Timah Nature Reserve is remarkable because:", a: ["It's the largest park in Singapore", "It has more plant species than the entire North American continent in just 163 hectares", "It has no invasive plants", "It was created artificially"], c: 1, e: "Bukit Timah is one of Earth's most biodiverse urban forest patches — making it absolutely critical to protect from invasive plants like Mile-a-Minute and Zanzibar Yam." }
];

let qIdx = 0, qScore = 0, qAnswered = false;

function initQuiz() {
  qIdx = 0; qScore = 0; qAnswered = false;
  document.getElementById('quizComplete').style.display = 'none';
  document.getElementById('quizArea').style.display = 'block';
  renderQ();
}
function renderQ() {
  qAnswered = false;
  const q = quizData[qIdx];
  document.getElementById('qNum').textContent = qIdx + 1;
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('quizProgressFill').style.width = (qIdx / quizData.length * 100) + '%';
  const grid = document.getElementById('answerGrid');
  grid.innerHTML = '';
  q.a.forEach((ans, i) => {
    const b = document.createElement('button');
    b.className = 'a-btn';
    b.textContent = ans;
    b.onclick = () => pickAnswer(i);
    grid.appendChild(b);
  });
  document.getElementById('feedbackBox').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
}
function pickAnswer(idx) {
  if (qAnswered) return;
  qAnswered = true;
  const q = quizData[qIdx];
  const btns = document.querySelectorAll('.a-btn');
  btns.forEach(b => b.disabled = true);
  btns[q.c].classList.add('correct');
  const fb = document.getElementById('feedbackBox');
  if (idx === q.c) {
    fb.className = 'q-feedback correct-fb';
    fb.innerHTML = '✅ Correct! ' + q.e;
    qScore++;
    showToast('✅ Correct! +10 pts');
  } else {
    btns[idx].classList.add('wrong');
    fb.className = 'q-feedback wrong-fb';
    fb.innerHTML = '❌ Not quite. ' + q.e;
    showToast('❌ Not this time!');
  }
  fb.style.display = 'block';
  document.getElementById('nextBtn').style.display = 'inline-block';
}
function nextQuestion() {
  qIdx++;
  if (qIdx >= quizData.length) {
    document.getElementById('quizArea').style.display = 'none';
    document.getElementById('quizComplete').style.display = 'block';
    document.getElementById('finalScore').textContent = qScore;
    const msgs = [
      [0, 4, "Keep exploring the Learn section — Singapore needs informed defenders! 📚"],
      [5, 7, "Good effort! You're building solid knowledge about Singapore's invasives. 🌱"],
      [8, 10, "Great job! You know Singapore's invasive species very well. 🌿"],
      [11, 12, "PERFECT SCORE! You're a Singapore Plant Defender! NParks would hire you! 🏆🇸🇬"]
    ];
    const m = msgs.find(([mn, mx]) => qScore >= mn && qScore <= mx);
    document.getElementById('scoreMessage').textContent = m[2];
    scores.quiz = Math.max(scores.quiz, qScore * 10);
    updateScores();
    showToast(`Quiz done! ${qScore}/12 — ${qScore * 10} points!`);
  } else { renderQ(); }
}
function restartQuiz() { initQuiz(); }

// ============================================================
// MEMORY GAME — COLOUR CODED
// ============================================================
const memPairs = [
  { id: 'zanzibar', plant: 'Zanzibar Yam', origin: 'Africa & Asia', color: '#e74c3c' },
  { id: 'mam', plant: 'Mile-a-Minute', origin: 'C. & S. America', color: '#e67e22' },
  { id: 'hyacinth', plant: 'Water Hyacinth', origin: 'South America', color: '#9b59b6' },
  { id: 'clidemia', plant: 'Senduduk Bulu', origin: 'Tropical Americas', color: '#e91e8c' },
  { id: 'siam', plant: 'Siam Weed', origin: 'C. & S. America', color: '#f39c12' },
  { id: 'albizia', plant: 'Albizia', origin: 'Maluku, Indonesia', color: '#27ae60' },
  { id: 'lantana', plant: 'Lantana', origin: 'Central America', color: '#16a085' },
  { id: 'salvinia', plant: 'Giant Salvinia', origin: 'South America', color: '#2980b9' }
];

let memFlipped = [], memMatched = 0, memMoves = 0, memLocked = false;

function initMemory() {
  memFlipped = []; memMatched = 0; memMoves = 0; memLocked = false;
  document.getElementById('moveCount').textContent = 0;
  document.getElementById('pairCount').textContent = 0;
  document.getElementById('memoryComplete').style.display = 'none';

  const legend = document.getElementById('memoryLegend');
  legend.innerHTML = '<strong style="font-size:0.78rem;color:var(--text-mid);display:block;margin-bottom:0.4rem">Colour key — matched pairs share a colour:</strong>';
  memPairs.forEach(p => {
    const el = document.createElement('div');
    el.className = 'ml-item';
    el.style.cssText = `border-color:${p.color};background:${p.color}`;
    el.textContent = `${p.plant} = ${p.origin}`;
    legend.appendChild(el);
  });

  const all = [];
  memPairs.forEach(p => {
    all.push({ id: p.id, type: 'plant', text: p.plant, sub: '🌿 invasive plant', color: p.color });
    all.push({ id: p.id, type: 'origin', text: p.origin, sub: '📍 region of origin', color: p.color });
  });
  all.sort(() => Math.random() - 0.5);

  const grid = document.getElementById('memoryGrid');
  grid.innerHTML = '';
  all.forEach(c => {
    const card = document.createElement('button');
    card.className = 'mem-card';
    card.dataset.id = c.id;
    card.dataset.type = c.type;
    card.dataset.color = c.color;
    card.innerHTML = `<div class="mem-card-front">🌿</div><div class="mem-card-back"><div class="mem-card-back-main">${c.text}</div><div class="mem-card-back-sub">${c.sub}</div></div>`;
    card.onclick = () => flipMemCard(card, c.color);
    grid.appendChild(card);
  });
}

function flipMemCard(card, color) {
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
      showToast('✅ Match! ' + a.dataset.id.toUpperCase());
      memFlipped = []; memLocked = false;
      if (memMatched === memPairs.length) {
        setTimeout(() => {
          document.getElementById('memoryComplete').style.display = 'block';
          document.getElementById('finalMoves').textContent = memMoves;
          const pts = Math.max(50, 300 - memMoves * 8);
          scores.memory = Math.max(scores.memory, pts);
          updateScores();
          showToast(`🏆 All matched! ${pts} points!`, 3000);
        }, 500);
      }
    } else {
      setTimeout(() => {
        a.classList.remove('flipped'); b.classList.remove('flipped');
        a.style.backgroundColor = ''; a.style.borderColor = '';
        b.style.backgroundColor = ''; b.style.borderColor = '';
        memFlipped = []; memLocked = false;
      }, 1000);
    }
  }
}

// ============================================================
// SPOT THE INVADER
// ============================================================
const spotData = [
  { name: 'Tembusu Tree', img: 'images/tembusu.jpg', type: 'native', clue: 'This iconic tree appears on Singapore\'s $5 note and has been growing in our parks for centuries. It supports dozens of native insect and bird species.', origin: '✅ Native to Singapore & Southeast Asia' },
  { name: 'Mile-a-Minute', img: 'images/mam.jpg', type: 'invasive', clue: 'This vine drapes over other plants like a blanket, growing up to 8cm per day. Introduced via contaminated grass seed in the 1960s.', origin: '🚨 Native to Central & South America' },
  { name: 'Sea Apple', img: 'images/seaapple.jpg', type: 'native', clue: 'A beautiful flowering tree commonly seen along Singapore\'s roadsides and parks. It produces pink fluffy flowers and supports native pollinators.', origin: '✅ Native to Singapore & Malaysia' },
  { name: 'Zanzibar Yam', img: 'images/zanzibar.jpg', type: 'invasive', clue: 'This climbing vine produces small bulb-like structures that fall and spread through soil. It twines aggressively around trees, smothering everything beneath it.', origin: '🚨 Native to Africa & parts of Asia' },
  { name: 'Singapore Kopsia', img: 'images/kopsia.jpg', type: 'native', clue: 'This shrub produces beautiful pink flowers and is endemic to Singapore and surrounding regions. Found naturally in Singapore\'s secondary forests.', origin: '✅ Native to Singapore & Peninsula Malaysia' },
  { name: 'Siam Weed', img: 'images/siam.jpg', type: 'invasive', clue: 'This bushy plant grows up to 3 metres tall in a single season, releasing chemicals that prevent other plants from growing nearby. Dominates Pulau Ubin wasteland.', origin: '🚨 Native to Central & South America' },
  { name: 'Nipah Palm', img: 'images/nipah.jpg', type: 'native', clue: 'This palm grows in Singapore\'s mangroves and has been part of our coastal ecosystem for thousands of years. Its leaves are used in traditional Malay cooking.', origin: '✅ Native to Singapore & Southeast Asia' },
  { name: 'Water Hyacinth', img: 'images/hyacinth.jpg', type: 'invasive', clue: 'This floating plant has beautiful purple flowers but forms thick mats on water. It blocks sunlight, depletes oxygen for fish, and creates mosquito habitat.', origin: '🚨 Native to South America' },
  { name: 'Albizia', img: 'images/albizia.jpg', type: 'invasive', clue: 'This tree grows up to 7 metres per year but produces structurally weak wood. Its branches can fall without warning in Singapore\'s tropical storms.', origin: '🚨 Native to Maluku, Indonesia' },
  { name: 'Lantana', img: 'images/lantana.jpg', type: 'invasive', clue: 'This prickly shrub has colourful flowers that change colour as they age. Its berries are toxic to children and it forms dense thickets blocking native plants.', origin: '🚨 Native to Central America' }
];

let spotRound = 0, spotScore = 0, spotAnswered = false, spotOrder = [];

function initSpot() {
  spotRound = 0; spotScore = 0; spotAnswered = false;
  spotOrder = [...Array(spotData.length).keys()].sort(() => Math.random() - 0.5);
  document.getElementById('spotComplete').style.display = 'none';
  document.getElementById('spotArea').style.display = 'block';
  renderSpot();
}
function renderSpot() {
  spotAnswered = false;
  const p = spotData[spotOrder[spotRound]];
  document.getElementById('spotRound').textContent = spotRound + 1;
  document.getElementById('spotPoints').textContent = spotScore * 10;
  const img = document.getElementById('spotImg');
  img.src = p.img; img.style.display = 'block';
  document.getElementById('spotName').textContent = p.name;
  document.getElementById('spotClue').textContent = p.clue;
  document.getElementById('spotOrigin').textContent = '';
  document.getElementById('spotFeedback').style.display = 'none';
  document.querySelectorAll('.spot-btn').forEach(b => b.disabled = false);
}
function spotAnswer(answer) {
  if (spotAnswered) return;
  spotAnswered = true;
  const p = spotData[spotOrder[spotRound]];
  document.getElementById('spotOrigin').textContent = p.origin;
  document.querySelectorAll('.spot-btn').forEach(b => b.disabled = true);
  const fb = document.getElementById('spotFeedback');
  if (answer === p.type) {
    fb.className = 'spot-feedback correct';
    fb.textContent = `✅ Correct! "${p.name}" is ${p.type === 'invasive' ? 'an INVASIVE species' : 'a NATIVE plant to Singapore'}.`;
    spotScore++;
    showToast('✅ Correct! +10 pts');
  } else {
    fb.className = 'spot-feedback wrong';
    fb.textContent = `❌ "${p.name}" is actually ${p.type === 'invasive' ? 'an INVASIVE species' : 'a NATIVE plant'}.`;
    showToast('❌ Not this time!');
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
  }, 2200);
}

// ============================================================
// PLANT DEFENDER RUNNER GAME
// ============================================================
const RC = document.getElementById('runnerCanvas');
const RX = RC ? RC.getContext('2d') : null;
const RW = 700, RH = 280;
const GROUND = RH - 50;

const INVADERS = ['🌿','🎋','🍃','🌾'];
const NATIVES  = ['🌺','🌸','⭐','🌼','🛡️'];
const SG_FACTS = [
  "Mile-a-Minute grows 8cm per day in Singapore!",
  "Bukit Timah has more plant species than all of North America!",
  "The Zanzibar Yam was originally introduced as food in colonial times.",
  "Singapore handles 37 million containers per year — each a potential invasive vector.",
  "The Javan Myna helps spread Senduduk Bulu seeds — an 'invasion meltdown'!",
  "Water Hyacinth doubles its coverage in just 2 weeks.",
  "Albizia was deliberately planted for reforestation in the 1970s — now it's a problem!",
  "40% of Singapore's original biodiversity has already been lost.",
  "Giant Salvinia can double in biomass in just 2.5 days!",
  "Siam Weed is flammable when dry — a fire risk in Singapore's forests."
];

let runner = {
  running: false,
  x: 80, y: GROUND, vy: 0,
  w: 40, h: 50,
  jumping: false, sliding: false,
  slideTimer: 0,
  score: 0, lives: 3,
  speed: 4, frameCount: 0,
  shield: 0, shieldTimer: 0,
  obstacles: [], collectibles: [],
  bg: [], clouds: [],
  lastFact: 0
};

function initRunnerDisplay() {
  if (!RX) return;
  runner.running = false;
  drawRunnerBg();
  document.getElementById('runnerOverlay').classList.remove('hidden');
  document.getElementById('roTitle').textContent = 'Plant Defender';
  document.getElementById('roMsg').textContent = 'Run through Bukit Timah! Jump over invasive plants, collect native species for points. Watch out — invasives cost you a life!';
  document.getElementById('roBtn').textContent = 'Start Running! 🌿';
  document.getElementById('roBtn').onclick = startRunner;
  displayFact();
}

function drawRunnerBg() {
  if (!RX) return;
  // Sky gradient
  const sky = RX.createLinearGradient(0, 0, 0, RH);
  sky.addColorStop(0, '#0d2b1a');
  sky.addColorStop(0.6, '#1a4a2a');
  sky.addColorStop(1, '#2d6a4f');
  RX.fillStyle = sky;
  RX.fillRect(0, 0, RW, RH);
  // Stars
  RX.fillStyle = 'rgba(255,255,255,0.4)';
  for (let i = 0; i < 40; i++) {
    RX.fillRect((i * 197 + 11) % RW, (i * 137) % (RH * 0.5), 1.5, 1.5);
  }
  // Ground
  const grd = RX.createLinearGradient(0, GROUND, 0, RH);
  grd.addColorStop(0, '#2d8a4e');
  grd.addColorStop(1, '#1a3a2a');
  RX.fillStyle = grd;
  RX.fillRect(0, GROUND, RW, RH - GROUND);
  // Ground detail
  RX.fillStyle = '#3da862';
  for (let i = 0; i < RW; i += 40) {
    RX.fillRect(i, GROUND, 20, 3);
  }
}

function startRunner() {
  runner.running = true;
  runner.x = 80; runner.y = GROUND; runner.vy = 0;
  runner.jumping = false; runner.sliding = false; runner.slideTimer = 0;
  runner.score = 0; runner.lives = 3; runner.speed = 4; runner.frameCount = 0;
  runner.shield = 0; runner.shieldTimer = 0;
  runner.obstacles = []; runner.collectibles = [];
  runner.bg = []; runner.clouds = [];
  for (let i = 0; i < 6; i++) runner.clouds.push({ x: Math.random() * RW, y: 20 + Math.random() * 60, speed: 0.3 + Math.random() * 0.5 });
  document.getElementById('runnerOverlay').classList.add('hidden');
  updateRunnerHUD();
  requestAnimationFrame(runnerLoop);
}

function runnerJump() {
  if (!runner.running) return;
  if (!runner.jumping && !runner.sliding) {
    runner.vy = -13;
    runner.jumping = true;
  }
}
function runnerSlide() {
  if (!runner.running) return;
  if (!runner.jumping) {
    runner.sliding = true;
    runner.slideTimer = 45;
  }
}

// Controls
document.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); runnerJump(); }
  if (e.key === 'ArrowDown') { e.preventDefault(); runnerSlide(); }
});
if (RC) {
  RC.addEventListener('touchstart', e => { e.preventDefault(); runnerJump(); }, { passive: false });
  RC.addEventListener('click', () => runnerJump());
}

function runnerLoop() {
  if (!runner.running) return;
  runner.frameCount++;
  RX.clearRect(0, 0, RW, RH);
  drawRunnerBg();

  // Clouds
  runner.clouds.forEach(c => {
    c.x -= c.speed;
    if (c.x < -80) { c.x = RW + 60; c.y = 20 + Math.random() * 60; }
    RX.font = '28px serif';
    RX.globalAlpha = 0.25;
    RX.fillText('☁', c.x, c.y);
    RX.globalAlpha = 1;
  });

  // Scroll speed increase
  runner.speed = 4 + Math.floor(runner.score / 200) * 0.5;

  // Background trees
  RX.font = '28px serif';
  for (let i = 0; i < 5; i++) {
    const bx = ((runner.frameCount * 1.5 + i * 140) % (RW + 40)) - 20;
    RX.fillText('🌲', bx, GROUND - 20);
  }

  // Physics
  runner.vy += 0.7;
  runner.y += runner.vy;
  if (runner.y >= GROUND) { runner.y = GROUND; runner.vy = 0; runner.jumping = false; }

  // Slide timer
  if (runner.sliding) {
    runner.slideTimer--;
    if (runner.slideTimer <= 0) runner.sliding = false;
  }

  // Shield timer
  if (runner.shieldTimer > 0) {
    runner.shieldTimer--;
    if (runner.shieldTimer <= 0) runner.shield = 0;
  }

  // Spawn obstacles
  if (runner.frameCount % Math.max(55, 110 - runner.score / 30) === 0) {
    const type = Math.floor(Math.random() * INVADERS.length);
    const tall = Math.random() > 0.5;
    runner.obstacles.push({ x: RW + 20, type, tall, w: 36, h: tall ? 55 : 38 });
  }

  // Spawn collectibles
  if (runner.frameCount % 70 === 0) {
    const flying = Math.random() > 0.6;
    const type = Math.floor(Math.random() * NATIVES.length);
    runner.collectibles.push({ x: RW + 20, y: flying ? GROUND - 70 : GROUND - 15, type, w: 30, h: 30, flying });
  }

  // Draw obstacles
  RX.font = '32px serif';
  runner.obstacles = runner.obstacles.filter(ob => {
    ob.x -= runner.speed;
    const oy = GROUND - (ob.tall ? 40 : 20);
    RX.fillText(INVADERS[ob.type], ob.x, oy + 10);
    return ob.x > -50;
  });

  // Draw collectibles
  RX.font = '26px serif';
  runner.collectibles = runner.collectibles.filter(col => {
    col.x -= runner.speed;
    const bob = Math.sin(runner.frameCount * 0.1 + col.x) * 5;
    RX.fillText(NATIVES[col.type], col.x, col.y + bob);
    return col.x > -40;
  });

  // Player hitbox
  const ph = runner.sliding ? 25 : 46;
  const py = runner.sliding ? runner.y - ph + 10 : runner.y - ph;
  const pw = runner.sliding ? 50 : 32;

  // Shield glow
  if (runner.shield > 0) {
    RX.save();
    RX.globalAlpha = 0.3 + 0.2 * Math.sin(runner.frameCount * 0.3);
    RX.fillStyle = '#74c69d';
    RX.beginPath();
    RX.ellipse(runner.x + 18, py + ph / 2, pw + 12, ph / 2 + 12, 0, 0, Math.PI * 2);
    RX.fill();
    RX.restore();
  }

  // Draw player
  RX.font = runner.sliding ? '42px serif' : '38px serif';
  RX.fillText(runner.sliding ? '🏃' : '🧑', runner.x - 5, py + ph);
  if (runner.sliding) { RX.font = '14px serif'; RX.fillText('💨', runner.x + 30, py + ph - 10); }

  // Collision — obstacles
  runner.obstacles = runner.obstacles.filter(ob => {
    const oy = GROUND - (ob.tall ? 40 : 20);
    const ohitH = ob.tall ? 50 : 32;
    if (runner.shield === 0 &&
      runner.x + 8 < ob.x + ob.w - 6 &&
      runner.x + pw - 8 > ob.x + 6 &&
      py < oy &&
      py + ph > oy - ohitH + 10) {
      runner.lives--;
      updateRunnerHUD();
      showToast('🌿 Hit by an invasive! -1 life', 1500);
      if (runner.lives <= 0) { endRunner(); return false; }
      return false;
    }
    return true;
  });

  // Collision — collectibles
  runner.collectibles = runner.collectibles.filter(col => {
    if (runner.x + 8 < col.x + col.w - 4 &&
      runner.x + pw - 4 > col.x + 4 &&
      py < col.y + col.h &&
      py + ph > col.y) {
      const emoji = NATIVES[col.type];
      if (emoji === '⭐') { runner.score += 50; showToast('⭐ Star! +50 pts'); }
      else if (emoji === '🛡️') { runner.shield = 1; runner.shieldTimer = 180; showToast('🛡️ Shield activated! 3s invincibility'); }
      else { runner.score += 10; showToast(`🌺 Native plant! +10 pts`, 1000); }
      runner.score += 0; // base from speed
      updateRunnerHUD();
      return false;
    }
    return true;
  });

  // Distance score
  if (runner.frameCount % 15 === 0) { runner.score += 1; updateRunnerHUD(); }

  // HUD overlay
  RX.fillStyle = 'rgba(0,0,0,0.4)';
  RX.fillRect(0, 0, RW, 30);
  RX.fillStyle = '#74c69d';
  RX.font = 'bold 13px Nunito, sans-serif';
  RX.fillText(`Score: ${runner.score}`, 12, 20);
  RX.fillText(`Speed: ${runner.speed.toFixed(1)}x`, 120, 20);
  if (runner.shield > 0) { RX.fillStyle = '#f4d03f'; RX.fillText('🛡️ SHIELD ACTIVE', 220, 20); }

  // Fact ticker
  if (runner.frameCount - runner.lastFact > 480) {
    displayFact();
    runner.lastFact = runner.frameCount;
  }

  requestAnimationFrame(runnerLoop);
}

function updateRunnerHUD() {
  document.getElementById('runnerScore').textContent = runner.score;
  const high = Math.max(runner.score, parseInt(localStorage.getItem('runnerHigh_sg') || '0'));
  localStorage.setItem('runnerHigh_sg', high);
  document.getElementById('runnerHigh').textContent = high;
  const livesStr = ['❤️', '❤️', '❤️'].slice(0, runner.lives).join('') + ['🖤', '🖤', '🖤'].slice(runner.lives).join('');
  document.getElementById('runnerLives').textContent = livesStr || '💀';
}

function endRunner() {
  runner.running = false;
  const high = Math.max(runner.score, parseInt(localStorage.getItem('runnerHigh_sg') || '0'));
  localStorage.setItem('runnerHigh_sg', high);
  scores.runner = Math.max(scores.runner, runner.score);
  updateScores();
  const overlay = document.getElementById('runnerOverlay');
  overlay.classList.remove('hidden');
  document.getElementById('roTitle').textContent = runner.score >= 200 ? '🏆 Great Run!' : '💀 Invaded!';
  document.getElementById('roMsg').textContent = `You scored ${runner.score} points! High score: ${high}. The invasive plants got you — but you can fight back!`;
  document.getElementById('roBtn').textContent = 'Try Again 🔄';
  document.getElementById('roBtn').onclick = startRunner;
  showToast(`Game over! ${runner.score} pts scored!`, 3000);
}

function displayFact() {
  const el = document.getElementById('runnerFact');
  if (el) el.textContent = '💡 Did you know? ' + SG_FACTS[Math.floor(Math.random() * SG_FACTS.length)];
}

// Init high score display
window.addEventListener('load', () => {
  const high = localStorage.getItem('runnerHigh_sg') || '0';
  const el = document.getElementById('runnerHigh');
  if (el) el.textContent = high;
});

// ============================================================
// SPREAD SIMULATOR
// ============================================================
const SC = document.getElementById('simCanvas');
const SX = SC ? SC.getContext('2d') : null;
const SCOLS = 60, SROWS = 34;
const RATES = { mam: 0.13, zanzibar: 0.08, siam: 0.04, hyacinth: 0.09 };
const SIZES = { large: 1.0, medium: 0.75, small: 0.5 };

let simGrid = [], simRunning = false, simTimer = null, simYear = 0;

function resetSim() {
  simRunning = false; clearInterval(simTimer); simYear = 0;
  const pb = document.getElementById('simPlayBtn');
  if (pb) pb.textContent = '▶️ Start';
  if (document.getElementById('simYear')) document.getElementById('simYear').textContent = 0;
  if (document.getElementById('simCoverage')) document.getElementById('simCoverage').textContent = 0;
  const tip = document.getElementById('simTip');
  if (tip) tip.textContent = 'Select a species and press Start to begin the 30-year simulation.';

  simGrid = Array.from({ length: SROWS }, () => Array(SCOLS).fill(0));
  // Water body (right side)
  for (let r = Math.floor(SROWS * 0.25); r < Math.floor(SROWS * 0.75); r++)
    for (let c = Math.floor(SCOLS * 0.62); c < Math.floor(SCOLS * 0.77); c++)
      simGrid[r][c] = 3;
  // Start invasion
  simGrid[Math.floor(SROWS / 2)][4] = 1;
  drawSim();
}

function drawSim() {
  if (!SX || !SC) return;
  const cw = SC.width, ch = SC.height;
  const cW = cw / SCOLS, cH = ch / SROWS;
  for (let r = 0; r < SROWS; r++) {
    for (let c = 0; c < SCOLS; c++) {
      const v = simGrid[r][c];
      SX.fillStyle = v === 0 ? `hsl(${140 + (r * c % 15)},55%,${28 + (r + c) % 6}%)` :
                     v === 1 ? `hsl(${5 + (r * 3 % 10)},75%,${40 + r % 8}%)` :
                     v === 2 ? '#1a4a2a' : `hsl(210,65%,${38 + c % 8}%)`;
      SX.fillRect(c * cW, r * cH, cW - 0.5, cH - 0.5);
    }
  }
  // Legend
  SX.fillStyle = 'rgba(0,0,0,0.55)';
  SX.fillRect(0, ch - 22, cw, 22);
  const items = [['#3da862','🟢 Native'], ['#e74c3c','🔴 Invaded'], ['#3498db','🔵 Water'], ['#1a4a2a','🟤 Protected']];
  let lx = 10;
  SX.font = '11px Nunito, sans-serif'; SX.fillStyle = '#fff';
  items.forEach(([, label]) => { SX.fillText(label, lx, ch - 6); lx += 140; });
}

function stepSim() {
  const species = document.getElementById('simSpecies').value;
  const size = document.getElementById('simSize').value;
  const rate = RATES[species] * SIZES[size];
  const isAquatic = species === 'hyacinth';
  const newGrid = simGrid.map(r => [...r]);
  for (let r = 0; r < SROWS; r++) {
    for (let c = 0; c < SCOLS; c++) {
      if (simGrid[r][c] === 1) {
        [[r-1,c],[r+1,c],[r,c-1],[r,c+1],[r-1,c+1],[r+1,c-1]].forEach(([nr,nc]) => {
          if (nr < 0 || nr >= SROWS || nc < 0 || nc >= SCOLS) return;
          const t = simGrid[nr][nc];
          if (isAquatic && t === 3 && Math.random() < rate) newGrid[nr][nc] = 1;
          if (!isAquatic && t === 0 && Math.random() < rate) newGrid[nr][nc] = 1;
        });
      }
    }
  }
  simGrid = newGrid; simYear++;
  const invaded = simGrid.flat().filter(v => v === 1).length;
  const total = simGrid.flat().filter(v => v !== 3).length;
  const pct = Math.round((invaded / total) * 100);
  if (document.getElementById('simYear')) document.getElementById('simYear').textContent = simYear;
  if (document.getElementById('simCoverage')) document.getElementById('simCoverage').textContent = pct;
  const tip = document.getElementById('simTip');
  if (tip) {
    if (pct > 5 && pct <= 25) tip.textContent = '🔴 Invasion spreading! Native species are being displaced.';
    else if (pct > 25 && pct <= 55) tip.textContent = '🚨 Over 25% invaded! Habitats are collapsing — click Intervene!';
    else if (pct > 55) tip.textContent = '💀 Over half the reserve is destroyed. Early action is everything!';
  }
  if (simYear >= 30) {
    clearInterval(simTimer); simRunning = false;
    if (document.getElementById('simPlayBtn')) document.getElementById('simPlayBtn').textContent = '▶️ Start';
    if (tip) tip.textContent = `30 years later: ${pct}% invaded. Press Reset to try a different scenario!`;
    showToast(`Simulation done — ${pct}% of the reserve was invaded!`, 3000);
  }
  drawSim();
}

function toggleSim() {
  if (simRunning) {
    clearInterval(simTimer); simRunning = false;
    document.getElementById('simPlayBtn').textContent = '▶️ Resume';
  } else {
    simRunning = true;
    document.getElementById('simPlayBtn').textContent = '⏸️ Pause';
    simTimer = setInterval(stepSim, 180);
  }
}

function addIntervention() {
  let count = 0;
  for (let r = 0; r < SROWS && count < 30; r++)
    for (let c = 0; c < SCOLS && count < 30; c++)
      if (simGrid[r][c] === 1 && Math.random() < 0.4) { simGrid[r][c] = 2; count++; }
  const tip = document.getElementById('simTip');
  if (tip) tip.textContent = '🛡️ NParks intervened! Dark green cells resist further invasion. Will it be enough?';
  showToast('🛡️ NParks intervened! Removing invasives...', 2000);
  drawSim();
}

// ============================================================
// PLEDGE SYSTEM
// ============================================================
function updatePledge() {
  const cbs = document.querySelectorAll('.pledge-items input[type=checkbox]');
  const checked = [...cbs].filter(c => c.checked).length;
  document.getElementById('pledgeCount').textContent = checked;
  document.getElementById('pledgeFill').style.width = (checked / cbs.length * 100) + '%';
  document.getElementById('pledgeComplete').style.display = checked === cbs.length ? 'block' : 'none';
  if (checked === cbs.length) showToast('🏅 You are now a Singapore Plant Defender!', 3000);
  localStorage.setItem('pledge_sg3', JSON.stringify([...cbs].map(c => c.checked)));
}
function restorePledge() {
  const saved = JSON.parse(localStorage.getItem('pledge_sg3') || '[]');
  const cbs = document.querySelectorAll('.pledge-items input[type=checkbox]');
  saved.forEach((s, i) => { if (cbs[i]) cbs[i].checked = s; });
  if (cbs.length) updatePledge();
}

// ============================================================
// INIT
// ============================================================
window.addEventListener('load', () => {
  updateProgress();
  restorePledge();
  updateScores();
  const high = localStorage.getItem('runnerHigh_sg') || '0';
  const el = document.getElementById('runnerHigh');
  if (el) el.textContent = high;
  // Draw initial sim canvas
  resetSim();
});
