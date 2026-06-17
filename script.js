// ============================================================
// NAVIGATION
// ============================================================
var gameScores = { quiz: 0, memory: 0, spot: 0, runner: 0 };

function showPage(name) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('active');
  }

  var navLinks = document.querySelectorAll('.nav-links a');
  for (var j = 0; j < navLinks.length; j++) {
    navLinks[j].classList.remove('active');
  }

  document.getElementById('page-' + name).classList.add('active');

  var activeLink = document.querySelector('[data-page="' + name + '"]');
  if (activeLink) activeLink.classList.add('active');

  window.scrollTo(0, 0);

  if (name === 'action') {
    restorePledge();
  }
}

// Hamburger menu
document.getElementById('hamburger').addEventListener('click', function() {
  document.getElementById('navLinks').classList.toggle('open');
});

var navLinkItems = document.querySelectorAll('.nav-links a');
for (var ni = 0; ni < navLinkItems.length; ni++) {
  navLinkItems[ni].addEventListener('click', function() {
    document.getElementById('navLinks').classList.remove('open');
  });
}

// Toast notification
function showToast(msg, duration) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() {
    t.classList.remove('show');
  }, duration || 2500);
}

// Update all score displays
function updateAllScores() {
  document.getElementById('quizScoreVal').textContent = gameScores.quiz;
  document.getElementById('memoryScoreVal').textContent = gameScores.memory;
  document.getElementById('spotScoreVal').textContent = gameScores.spot;
  document.getElementById('runnerScoreVal').textContent = gameScores.runner;
  var total = gameScores.quiz + gameScores.memory + gameScores.spot + gameScores.runner;
  document.getElementById('totalScoreVal').textContent = total;
  document.getElementById('navScore').textContent = '⭐ ' + total + ' pts';
}

// ============================================================
// FALLING LEAVES ON HERO
// ============================================================
var heroLeaves = document.getElementById('heroLeaves');
var leafEmojis = ['🍃', '🌿', '🌱', '🍂', '🌾'];
for (var li = 0; li < 18; li++) {
  var leaf = document.createElement('div');
  leaf.className = 'leaf-particle';
  leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
  leaf.style.left = (Math.random() * 100) + 'vw';
  leaf.style.animationDuration = (7 + Math.random() * 10) + 's';
  leaf.style.animationDelay = (Math.random() * 12) + 's';
  leaf.style.fontSize = (0.9 + Math.random() * 1.2) + 'rem';
  heroLeaves.appendChild(leaf);
}

// ============================================================
// LEARN PAGE — TABS
// ============================================================
var tabBtns = document.querySelectorAll('.tab-btn');
for (var ti = 0; ti < tabBtns.length; ti++) {
  tabBtns[ti].addEventListener('click', function() {
    var allBtns = document.querySelectorAll('.tab-btn');
    var allPanes = document.querySelectorAll('.tab-pane');
    for (var x = 0; x < allBtns.length; x++) {
      allBtns[x].classList.remove('active');
    }
    for (var y = 0; y < allPanes.length; y++) {
      allPanes[y].classList.remove('active');
    }
    this.classList.add('active');
    document.getElementById('tab-' + this.dataset.tab).classList.add('active');
  });
}

// Reading progress
var readTabsSet = [];
try {
  readTabsSet = JSON.parse(localStorage.getItem('readTabs_v4') || '[]');
} catch(e) {
  readTabsSet = [];
}

function updateProgress() {
  var pct = Math.round((readTabsSet.length / 5) * 100);
  var fill = document.getElementById('progressFill');
  var pctEl = document.getElementById('progressPct');
  if (fill) fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
}

function markRead(tabId, btn) {
  if (readTabsSet.indexOf(tabId) === -1) {
    readTabsSet.push(tabId);
    try { localStorage.setItem('readTabs_v4', JSON.stringify(readTabsSet)); } catch(e) {}
  }
  updateProgress();
  btn.textContent = '✅ Done!';
  btn.classList.add('done');
  showToast('📖 Section read! ' + Math.round((readTabsSet.length / 5) * 100) + '% complete');
}

// Restore read state
for (var ri = 0; ri < readTabsSet.length; ri++) {
  var rBtn = document.querySelector('#tab-' + readTabsSet[ri] + ' .mark-btn');
  if (rBtn) {
    rBtn.textContent = '✅ Done!';
    rBtn.classList.add('done');
  }
}
updateProgress();

// ============================================================
// SPECIES — FILTER + EXPAND
// ============================================================
var filterBtns = document.querySelectorAll('.filter-btn');
for (var fi = 0; fi < filterBtns.length; fi++) {
  filterBtns[fi].addEventListener('click', function() {
    var allFBtns = document.querySelectorAll('.filter-btn');
    for (var k = 0; k < allFBtns.length; k++) {
      allFBtns[k].classList.remove('active');
    }
    this.classList.add('active');
    var filter = this.dataset.filter;
    var spCards = document.querySelectorAll('.sp-card');
    for (var sc = 0; sc < spCards.length; sc++) {
      var cat = spCards[sc].dataset.category || '';
      if (filter === 'all' || cat.indexOf(filter) !== -1) {
        spCards[sc].classList.remove('hidden');
      } else {
        spCards[sc].classList.add('hidden');
      }
    }
  });
}

function toggleSpecies(id, btn) {
  var detail = document.getElementById(id);
  if (!detail) return;
  var isOpen = detail.classList.contains('open');
  if (isOpen) {
    detail.classList.remove('open');
    detail.style.display = 'none';
    btn.textContent = 'Full Profile ▼';
  } else {
    detail.classList.add('open');
    detail.style.display = 'block';
    btn.textContent = 'Show Less ▲';
  }
}

// ============================================================
// GAME SWITCHER
// ============================================================
function switchGame(name, clickedTab) {
  var panels = document.querySelectorAll('.game-panel');
  for (var p = 0; p < panels.length; p++) {
    panels[p].classList.remove('active-panel');
  }
  var tabs = document.querySelectorAll('.game-tab');
  for (var t = 0; t < tabs.length; t++) {
    tabs[t].classList.remove('active-tab');
  }
  document.getElementById('game-' + name).classList.add('active-panel');
  clickedTab.classList.add('active-tab');

  // Scroll game into view
  setTimeout(function() {
    document.getElementById('game-' + name).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);

  if (name === 'spread') resetSim();
  if (name === 'memory') startMemory();
  if (name === 'spot') startSpot();
  if (name === 'quiz') initQuiz();
}

// ============================================================
// QUIZ GAME
// ============================================================
var quizData = [
  {
    q: "Which invasive plant is considered Singapore's most problematic weed by NParks?",
    a: ["Zanzibar Yam", "Mile-a-Minute (Mikania micrantha)", "Lantana", "Water Hyacinth"],
    c: 1,
    e: "Mile-a-Minute grows up to 8cm per day and is found in virtually every nature area in Singapore, smothering native vegetation wherever it spreads."
  },
  {
    q: "How did Mile-a-Minute first arrive in Singapore?",
    a: ["Carried by migratory birds", "Deliberately planted by NParks", "Via contaminated grass seed in the 1960s", "Through the aquarium trade"],
    c: 2,
    e: "Contaminated grass seed imports in the 1960s — a single preventable mistake that created decades of ongoing management costs and irreversible forest damage."
  },
  {
    q: "The Zanzibar Yam spreads in Singapore primarily through:",
    a: ["Wind-dispersed seeds", "Bulbils that fall and remain dormant in soil for years", "Underground root runners", "Being eaten and spread by birds"],
    c: 1,
    e: "Bulbils are small aerial tubers that drop from the vine. They can remain viable in soil for years before sprouting into new plants, making complete removal very difficult."
  },
  {
    q: "Why is Senduduk Bulu especially dangerous in Singapore's forests?",
    a: ["It only grows in open fields", "It tolerates shade and can invade intact forest understorey", "It is spread only by humans", "It only affects aquatic habitats"],
    c: 1,
    e: "Unlike most invasives that start at forest edges, Senduduk Bulu can invade shaded forest understorey — breaking the regeneration cycle of native forest completely."
  },
  {
    q: "What is an 'invasion meltdown' as seen with Senduduk Bulu in Singapore?",
    a: ["When a forest burns due to invasives", "When two invasive species help each other spread — like the Javan Myna spreading Senduduk Bulu", "When invasives spread faster in hot weather", "When NParks runs out of budget for management"],
    c: 1,
    e: "The invasive Javan Myna eats Senduduk Bulu berries and disperses seeds throughout forests. Two invasive species helping each other spread is called an invasion meltdown."
  },
  {
    q: "The Albizia tree is dangerous in Singapore because:",
    a: ["Its berries are toxic to humans", "It grows very fast but produces structurally weak wood that breaks dangerously in storms", "It blocks waterways and canals", "It releases toxic chemicals into the soil"],
    c: 1,
    e: "Albizia grows up to 7m per year but produces brittle wood. In Singapore's frequent tropical storms, branches and whole trees can fall suddenly — a serious safety hazard."
  },
  {
    q: "Why was Water Hyacinth originally introduced to Singapore?",
    a: ["As a water treatment plant", "For fish farming and aquaculture", "As a decorative ornamental pond plant due to its beautiful purple flowers", "For scientific research purposes"],
    c: 2,
    e: "Introduced as a decorative pond plant because of its beautiful purple flowers — now one of Singapore's costliest aquatic invasives to manage, clogging waterways and harbouring mosquitoes."
  },
  {
    q: "Which agency should you contact if you spot Water Hyacinth in a Singapore canal?",
    a: ["Ministry of Education", "PUB (Public Utilities Board) at 1800-284-6600", "Urban Redevelopment Authority", "Singapore Tourism Board"],
    c: 1,
    e: "PUB manages Singapore's waterways and has specialist teams for aquatic invasive removal. Early reports save enormous management costs!"
  },
  {
    q: "What makes Singapore especially vulnerable to new invasive plant introductions?",
    a: ["Its very small geographical size alone", "Being a major global port and aviation hub, combined with a tropical climate perfect for invasive growth all year round", "Having too many parks and green spaces", "Its clay soil composition"],
    c: 1,
    e: "Singapore's position as a major port and aviation hub means invasive species constantly arrive hidden in cargo, soil, and luggage. Our tropical climate then allows year-round explosive growth."
  },
  {
    q: "Giant Salvinia is primarily spread in Singapore through:",
    a: ["Migratory water birds", "Flood events washing it between water bodies", "Aquarium hobbyists dumping plants into waterways and canals", "Wind dispersal of tiny spores"],
    c: 2,
    e: "Aquarium hobbyists dumping plants into Singapore canals and waterways is the main vector. Giant Salvinia can double its biomass in just 2.5 days — making every dumped plant a potential disaster."
  },
  {
    q: "What is Singapore's City in Nature initiative?",
    a: ["A plan to build more indoor gardens and conservatories", "NParks' initiative to integrate nature throughout Singapore's urban landscape and restore biodiversity", "A tourism campaign promoting Singapore's parks", "A programme for importing more ornamental plants"],
    c: 1,
    e: "City in Nature is NParks' flagship initiative. Managing invasive plants is one of its biggest ongoing challenges — which is exactly why citizen action like yours matters so much."
  },
  {
    q: "Bukit Timah Nature Reserve is scientifically remarkable because:",
    a: ["It is the largest park in Singapore by area", "At just 163 hectares, it has more plant species than the entire North American continent — making it critical to protect from invasives", "It has no invasive plants at all", "It was entirely created by humans through reforestation"],
    c: 1,
    e: "Bukit Timah is one of Earth's most biodiverse urban forest patches — harbouring extraordinary species density. Protecting it from Mile-a-Minute and Zanzibar Yam is a top NParks priority."
  }
];

var currentQuestion = 0;
var quizScore = 0;
var quizAnswered = false;

function initQuiz() {
  currentQuestion = 0;
  quizScore = 0;
  quizAnswered = false;
  document.getElementById('quizComplete').style.display = 'none';
  document.getElementById('quizPlayArea').style.display = 'block';
  renderQuestion();
}

function renderQuestion() {
  quizAnswered = false;
  var q = quizData[currentQuestion];
  document.getElementById('qNum').textContent = currentQuestion + 1;
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('quizProgressFill').style.width = ((currentQuestion / quizData.length) * 100) + '%';

  var grid = document.getElementById('answersGrid');
  grid.innerHTML = '';
  for (var i = 0; i < q.a.length; i++) {
    var btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = q.a[i];
    btn.dataset.index = i;
    btn.addEventListener('click', function() {
      pickAnswer(parseInt(this.dataset.index));
    });
    grid.appendChild(btn);
  }

  document.getElementById('quizFeedback').style.display = 'none';
  document.getElementById('quizNextBtn').style.display = 'none';
}

function pickAnswer(idx) {
  if (quizAnswered) return;
  quizAnswered = true;

  var q = quizData[currentQuestion];
  var btns = document.querySelectorAll('.answer-btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].disabled = true;
  }
  btns[q.c].classList.add('correct');

  var fb = document.getElementById('quizFeedback');
  if (idx === q.c) {
    fb.className = 'quiz-feedback correct-fb';
    fb.textContent = '✅ Correct! ' + q.e;
    quizScore++;
    showToast('✅ Correct! +10 pts');
  } else {
    btns[idx].classList.add('wrong');
    fb.className = 'quiz-feedback wrong-fb';
    fb.textContent = '❌ Not quite. ' + q.e;
    showToast('❌ Not this time!');
  }
  fb.style.display = 'block';
  document.getElementById('quizNextBtn').style.display = 'inline-block';
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= quizData.length) {
    document.getElementById('quizPlayArea').style.display = 'none';
    document.getElementById('quizComplete').style.display = 'block';
    document.getElementById('quizFinalScore').textContent = quizScore;

    var msgs = [
      { min: 0, max: 4, text: "Keep exploring the Learn section — Singapore needs informed defenders! 📚" },
      { min: 5, max: 7, text: "Good effort! You are building solid knowledge about Singapore's invasives. 🌱" },
      { min: 8, max: 10, text: "Great job! You know Singapore's invasive species very well. 🌿" },
      { min: 11, max: 12, text: "PERFECT SCORE! You are a Singapore Plant Defender! 🏆🇸🇬" }
    ];
    var msg = msgs[0];
    for (var i = 0; i < msgs.length; i++) {
      if (quizScore >= msgs[i].min && quizScore <= msgs[i].max) {
        msg = msgs[i];
        break;
      }
    }
    document.getElementById('quizMessage').textContent = msg.text;
    if (quizScore * 10 > gameScores.quiz) {
      gameScores.quiz = quizScore * 10;
    }
    updateAllScores();
    showToast('Quiz done! ' + quizScore + '/12 — ' + (quizScore * 10) + ' points!', 3000);
  } else {
    renderQuestion();
  }
}

function restartQuiz() {
  initQuiz();
}

// ============================================================
// MEMORY GAME
// ============================================================
var memPairsData = [
  { id: 'zanzibar', plant: 'Zanzibar Yam', origin: 'Africa & Asia', color: '#e74c3c' },
  { id: 'mam', plant: 'Mile-a-Minute', origin: 'C. & S. America', color: '#e67e22' },
  { id: 'hyacinth', plant: 'Water Hyacinth', origin: 'South America', color: '#9b59b6' },
  { id: 'clidemia', plant: 'Senduduk Bulu', origin: 'Tropical Americas', color: '#e91e8c' },
  { id: 'siam', plant: 'Siam Weed', origin: 'C. & S. America', color: '#f39c12' },
  { id: 'albizia', plant: 'Albizia', origin: 'Maluku, Indonesia', color: '#27ae60' },
  { id: 'lantana', plant: 'Lantana', origin: 'Central America', color: '#16a085' },
  { id: 'salvinia', plant: 'Giant Salvinia', origin: 'South America', color: '#2980b9' }
];

var memFlipped = [];
var memMatchedCount = 0;
var memMoveCount = 0;
var memLocked = false;

function startMemory() {
  memFlipped = [];
  memMatchedCount = 0;
  memMoveCount = 0;
  memLocked = false;
  document.getElementById('memMoves').textContent = '0';
  document.getElementById('memPairs').textContent = '0';
  document.getElementById('memoryComplete').style.display = 'none';

  // Build legend
  var legend = document.getElementById('memoryLegend');
  legend.innerHTML = '<strong style="font-size:0.75rem; color:#3d5a47; display:block; margin-bottom:0.4rem;">Colour guide — matched pairs share a colour:</strong>';
  for (var pi = 0; pi < memPairsData.length; pi++) {
    var chip = document.createElement('div');
    chip.className = 'mem-legend-chip';
    chip.style.backgroundColor = memPairsData[pi].color;
    chip.innerHTML = '<div class="mem-legend-dot"></div>' + memPairsData[pi].plant + ' = ' + memPairsData[pi].origin;
    legend.appendChild(chip);
  }

  // Build all cards
  var allCards = [];
  for (var ai = 0; ai < memPairsData.length; ai++) {
    var p = memPairsData[ai];
    allCards.push({ id: p.id, type: 'plant', mainText: p.plant, subText: '🌿 invasive plant', color: p.color });
    allCards.push({ id: p.id, type: 'origin', mainText: p.origin, subText: '📍 region of origin', color: p.color });
  }

  // Shuffle
  for (var si = allCards.length - 1; si > 0; si--) {
    var randIdx = Math.floor(Math.random() * (si + 1));
    var temp = allCards[si];
    allCards[si] = allCards[randIdx];
    allCards[randIdx] = temp;
  }

  var grid = document.getElementById('memoryGrid');
  grid.innerHTML = '';
  for (var ci = 0; ci < allCards.length; ci++) {
    var card = document.createElement('button');
    card.className = 'mem-card';
    card.dataset.id = allCards[ci].id;
    card.dataset.type = allCards[ci].type;
    card.dataset.color = allCards[ci].color;
    card.innerHTML =
      '<div class="mem-card-inner">' +
        '<div class="mem-front">🌿</div>' +
        '<div class="mem-back">' +
          '<div class="mem-back-main">' + allCards[ci].mainText + '</div>' +
          '<div class="mem-back-sub">' + allCards[ci].subText + '</div>' +
        '</div>' +
      '</div>';
    card.addEventListener('click', onMemCardClick);
    grid.appendChild(card);
  }
}

function onMemCardClick() {
  var card = this;
  if (memLocked) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;

  card.classList.add('flipped');
  card.style.backgroundColor = card.dataset.color;
  card.style.borderColor = card.dataset.color;
  memFlipped.push(card);

  if (memFlipped.length === 2) {
    memLocked = true;
    memMoveCount++;
    document.getElementById('memMoves').textContent = memMoveCount;

    var cardA = memFlipped[0];
    var cardB = memFlipped[1];

    if (cardA.dataset.id === cardB.dataset.id && cardA.dataset.type !== cardB.dataset.type) {
      // Match!
      cardA.classList.add('matched');
      cardB.classList.add('matched');
      memMatchedCount++;
      document.getElementById('memPairs').textContent = memMatchedCount;
      showToast('✅ Match found!', 1500);
      memFlipped = [];
      memLocked = false;

      if (memMatchedCount === memPairsData.length) {
        setTimeout(function() {
          document.getElementById('memoryComplete').style.display = 'block';
          document.getElementById('memFinalMoves').textContent = memMoveCount;
          var pts = Math.max(50, 300 - memMoveCount * 8);
          if (pts > gameScores.memory) gameScores.memory = pts;
          updateAllScores();
          showToast('🏆 All matched! ' + pts + ' points!', 3000);
        }, 500);
      }
    } else {
      // No match
      setTimeout(function() {
        cardA.classList.remove('flipped');
        cardB.classList.remove('flipped');
        cardA.style.backgroundColor = '';
        cardA.style.borderColor = '';
        cardB.style.backgroundColor = '';
        cardB.style.borderColor = '';
        memFlipped = [];
        memLocked = false;
      }, 1000);
    }
  }
}

// ============================================================
// SPOT THE INVADER
// ============================================================
var spotPlants = [
  {
    name: 'Tembusu Tree',
    img: 'images/tembusu.jpg',
    type: 'native',
    clue: 'This iconic tree appears on Singapore\'s $5 note. It has been growing in Singapore\'s parks and forests for centuries, supporting dozens of native insect and bird species through its ecosystem role.',
    origin: '✅ Native to Singapore and Southeast Asia'
  },
  {
    name: 'Mile-a-Minute',
    img: 'images/mam.jpg',
    type: 'invasive',
    clue: 'This vine drapes over other plants like a thick green blanket, growing up to 8cm per day in Singapore\'s tropical climate. It was introduced accidentally via contaminated grass seed in the 1960s.',
    origin: '🚨 Native to Central and South America'
  },
  {
    name: 'Sea Apple',
    img: 'images/seaapple.jpg',
    type: 'native',
    clue: 'A beautiful flowering tree commonly seen along Singapore\'s roadsides and parks. It produces distinctive pink fluffy flowers and is a crucial food source for native pollinators including bees.',
    origin: '✅ Native to Singapore and Malaysia'
  },
  {
    name: 'Zanzibar Yam',
    img: 'images/zanzibar.jpg',
    type: 'invasive',
    clue: 'This climbing vine produces small bulb-like structures called bulbils that fall and spread through soil. It twines aggressively around trees, smothering everything beneath its large heart-shaped leaves.',
    origin: '🚨 Native to Africa and parts of Asia'
  },
  {
    name: 'Singapore Kopsia',
    img: 'images/kopsia.jpg',
    type: 'native',
    clue: 'This shrub produces beautiful pink flowers and is found naturally in Singapore\'s secondary forests. It is part of Singapore\'s native forest understorey and supports local pollinator communities.',
    origin: '✅ Native to Singapore and Peninsula Malaysia'
  },
  {
    name: 'Siam Weed',
    img: 'images/siam.jpg',
    type: 'invasive',
    clue: 'This bushy plant grows up to 3 metres tall in a single season, releasing allelopathic chemicals that prevent other plants from growing nearby. It dominates wasteland areas on Pulau Ubin.',
    origin: '🚨 Native to Central and South America'
  },
  {
    name: 'Nipah Palm',
    img: 'images/nipah.jpg',
    type: 'native',
    clue: 'This palm has grown in Singapore\'s mangroves for thousands of years and is a key part of our coastal ecosystem. Its leaves are used in traditional Malay cooking to make ketupat pouches.',
    origin: '✅ Native to Singapore and Southeast Asia'
  },
  {
    name: 'Water Hyacinth',
    img: 'images/hyacinth.jpg',
    type: 'invasive',
    clue: 'This beautiful floating plant with purple flowers forms thick mats on water surfaces. It blocks sunlight, depletes oxygen for fish, and creates ideal breeding habitat for Aedes mosquitoes in Singapore.',
    origin: '🚨 Native to South America'
  },
  {
    name: 'Albizia',
    img: 'images/albizia.jpg',
    type: 'invasive',
    clue: 'This tree grows up to 7 metres per year but produces structurally weak wood. Its branches can fall without warning in Singapore\'s frequent tropical storms, making it a dangerous widow-maker tree.',
    origin: '🚨 Native to Maluku, Indonesia'
  },
  {
    name: 'Lantana',
    img: 'images/lantana.jpg',
    type: 'invasive',
    clue: 'This prickly shrub has colourful flowers that change colour as they age — from yellow to orange to red. Despite looking pretty, its berries are toxic to children and it forms impenetrable thickets.',
    origin: '🚨 Native to Central America'
  }
];

var spotRound = 0;
var spotScore = 0;
var spotAnswered = false;
var spotOrder = [];

function startSpot() {
  spotRound = 0;
  spotScore = 0;
  spotAnswered = false;
  spotOrder = [];
  for (var i = 0; i < spotPlants.length; i++) {
    spotOrder.push(i);
  }
  // Shuffle
  for (var si = spotOrder.length - 1; si > 0; si--) {
    var ri = Math.floor(Math.random() * (si + 1));
    var tmp = spotOrder[si];
    spotOrder[si] = spotOrder[ri];
    spotOrder[ri] = tmp;
  }

  document.getElementById('spotComplete').style.display = 'none';
  document.getElementById('spotPlayArea').style.display = 'block';
  renderSpotRound();
}

function renderSpotRound() {
  spotAnswered = false;
  var plant = spotPlants[spotOrder[spotRound]];
  document.getElementById('spotRoundNum').textContent = spotRound + 1;
  document.getElementById('spotPts').textContent = spotScore * 10;

  var img = document.getElementById('spotPlantImg');
  img.src = plant.img;
  img.style.display = 'block';
  document.getElementById('spotPlantName').textContent = plant.name;
  document.getElementById('spotPlantClue').textContent = plant.clue;
  document.getElementById('spotPlantOrigin').textContent = '';

  var fb = document.getElementById('spotFeedback');
  fb.style.display = 'none';
  fb.className = 'spot-feedback';

  var btns = document.querySelectorAll('.spot-native-btn, .spot-invasive-btn');
  for (var bi = 0; bi < btns.length; bi++) {
    btns[bi].disabled = false;
  }
}

function answerSpot(answer) {
  if (spotAnswered) return;
  spotAnswered = true;

  var plant = spotPlants[spotOrder[spotRound]];
  document.getElementById('spotPlantOrigin').textContent = plant.origin;

  var btns = document.querySelectorAll('.spot-native-btn, .spot-invasive-btn');
  for (var bi = 0; bi < btns.length; bi++) {
    btns[bi].disabled = true;
  }

  var fb = document.getElementById('spotFeedback');
  if (answer === plant.type) {
    fb.className = 'spot-feedback spot-correct';
    fb.textContent = '✅ Correct! "' + plant.name + '" is ' + (plant.type === 'invasive' ? 'an INVASIVE species' : 'NATIVE to Singapore') + '.';
    spotScore++;
    showToast('✅ Correct! +10 pts');
  } else {
    fb.className = 'spot-feedback spot-wrong';
    fb.textContent = '❌ "' + plant.name + '" is actually ' + (plant.type === 'invasive' ? 'an INVASIVE species' : 'NATIVE to Singapore') + '.';
    showToast('❌ Not this time!');
  }
  fb.style.display = 'block';

  setTimeout(function() {
    spotRound++;
    if (spotRound >= 10) {
      document.getElementById('spotPlayArea').style.display = 'none';
      document.getElementById('spotComplete').style.display = 'block';
      document.getElementById('spotFinalScore').textContent = spotScore;
      if (spotScore * 10 > gameScores.spot) gameScores.spot = spotScore * 10;
      updateAllScores();
      showToast('Round done! ' + spotScore + '/10 correct!', 3000);
    } else {
      renderSpotRound();
    }
  }, 2200);
}

// ============================================================
// PLANT DEFENDER RUNNER
// ============================================================
var canvas = document.getElementById('runnerCanvas');
var ctx = canvas ? canvas.getContext('2d') : null;

var RW = 680;
var RH = 260;
var GROUND_Y = RH - 45;

var OBSTACLE_EMOJIS = ['🌿', '🎋', '🍃', '🌾', '🌺'];
var COLLECT_EMOJIS = ['🌸', '🌼', '⭐', '🛡️', '🌱'];

var SG_FACTS = [
  'Mile-a-Minute grows 8cm per day in Singapore!',
  'Bukit Timah has more plant species than all of North America!',
  'The Zanzibar Yam was originally introduced as a food crop in colonial times.',
  'Singapore handles 37 million shipping containers per year — each a potential invasive vector.',
  'The Javan Myna helps spread Senduduk Bulu seeds — an invasion meltdown!',
  'Water Hyacinth doubles its coverage in just 2 weeks.',
  'Albizia was deliberately planted for reforestation in the 1970s — now a major problem!',
  '40% of Singapore\'s original biodiversity has already been lost.',
  'Giant Salvinia can double in biomass in just 2.5 days!',
  'Siam Weed is highly flammable when dry — a fire risk in Singapore forests.'
];

var runner = {
  active: false,
  x: 75,
  y: GROUND_Y,
  vy: 0,
  w: 32,
  h: 46,
  jumping: false,
  sliding: false,
  slideTimer: 0,
  score: 0,
  lives: 3,
  speed: 4,
  frameCount: 0,
  shieldActive: false,
  shieldTimer: 0,
  obstacles: [],
  collectibles: [],
  clouds: [],
  animLoop: null
};

function initRunnerDisplay() {
  if (!ctx) return;
  drawRunnerBackground();
  showRunnerStartScreen('Plant Defender Runner', 'Run through Bukit Timah! Jump over invasive plants and collect native species for bonus points. Watch your lives!', 'Start Running! 🌿');
  updateRunnerHUD();
  displayRunnerFact();
  var stored = localStorage.getItem('runnerHigh_sg4') || '0';
  document.getElementById('runnerBest').textContent = stored;
}

function showRunnerStartScreen(title, msg, btnText) {
  var screen = document.getElementById('runnerStartScreen');
  screen.classList.remove('hidden');
  screen.querySelector('h3').textContent = title;
  screen.querySelector('p').textContent = msg;
  screen.querySelector('button').textContent = btnText;
  screen.querySelector('button').onclick = startRunner;
  screen.querySelector('.rss-emoji').textContent = title.indexOf('Plant') !== -1 ? '🏃' : '💀';
}

function drawRunnerBackground() {
  if (!ctx) return;
  var sky = ctx.createLinearGradient(0, 0, 0, RH);
  sky.addColorStop(0, '#0a1f14');
  sky.addColorStop(0.6, '#1a4a2a');
  sky.addColorStop(1, '#2d6a4f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, RW, RH);

  // Stars
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (var s = 0; s < 35; s++) {
    ctx.fillRect((s * 193 + 7) % RW, (s * 137) % (RH * 0.5), 1.5, 1.5);
  }

  // Ground
  var grd = ctx.createLinearGradient(0, GROUND_Y, 0, RH);
  grd.addColorStop(0, '#2d8a4e');
  grd.addColorStop(1, '#1a3a2a');
  ctx.fillStyle = grd;
  ctx.fillRect(0, GROUND_Y, RW, RH - GROUND_Y);

  ctx.fillStyle = '#3da862';
  for (var gi = 0; gi < RW; gi += 35) {
    ctx.fillRect(gi, GROUND_Y, 18, 3);
  }
}

function startRunner() {
  if (!ctx) return;
  runner.active = true;
  runner.x = 75;
  runner.y = GROUND_Y;
  runner.vy = 0;
  runner.jumping = false;
  runner.sliding = false;
  runner.slideTimer = 0;
  runner.score = 0;
  runner.lives = 3;
  runner.speed = 4;
  runner.frameCount = 0;
  runner.shieldActive = false;
  runner.shieldTimer = 0;
  runner.obstacles = [];
  runner.collectibles = [];
  runner.clouds = [];

  for (var ci = 0; ci < 5; ci++) {
    runner.clouds.push({
      x: Math.random() * RW,
      y: 18 + Math.random() * 55,
      speed: 0.3 + Math.random() * 0.4
    });
  }

  document.getElementById('runnerStartScreen').classList.add('hidden');
  updateRunnerHUD();

  if (runner.animLoop) cancelAnimationFrame(runner.animLoop);
  runnerLoop();
}

function runnerLoop() {
  if (!runner.active) return;
  runner.frameCount++;
  ctx.clearRect(0, 0, RW, RH);
  drawRunnerBackground();

  // Clouds
  for (var ci = 0; ci < runner.clouds.length; ci++) {
    var cloud = runner.clouds[ci];
    cloud.x -= cloud.speed;
    if (cloud.x < -80) {
      cloud.x = RW + 60;
      cloud.y = 18 + Math.random() * 55;
    }
    ctx.font = '26px serif';
    ctx.globalAlpha = 0.22;
    ctx.fillText('☁', cloud.x, cloud.y);
    ctx.globalAlpha = 1;
  }

  // Background trees
  ctx.font = '26px serif';
  for (var bt = 0; bt < 5; bt++) {
    var bx = ((runner.frameCount * 1.4 + bt * 138) % (RW + 40)) - 20;
    ctx.fillText('🌲', bx, GROUND_Y - 18);
  }

  // Speed up over time
  runner.speed = 4 + Math.floor(runner.score / 150) * 0.5;

  // Physics
  runner.vy += 0.65;
  runner.y += runner.vy;
  if (runner.y >= GROUND_Y) {
    runner.y = GROUND_Y;
    runner.vy = 0;
    runner.jumping = false;
  }

  // Slide timer
  if (runner.sliding) {
    runner.slideTimer--;
    if (runner.slideTimer <= 0) runner.sliding = false;
  }

  // Shield timer
  if (runner.shieldTimer > 0) {
    runner.shieldTimer--;
    if (runner.shieldTimer <= 0) runner.shieldActive = false;
  }

  // Spawn obstacles
  var spawnRate = Math.max(50, 105 - Math.floor(runner.score / 25));
  if (runner.frameCount % spawnRate === 0) {
    var isTall = Math.random() > 0.5;
    runner.obstacles.push({
      x: RW + 20,
      type: Math.floor(Math.random() * OBSTACLE_EMOJIS.length),
      tall: isTall,
      w: 34,
      h: isTall ? 52 : 36
    });
  }

  // Spawn collectibles
  if (runner.frameCount % 68 === 0) {
    var isFlying = Math.random() > 0.55;
    runner.collectibles.push({
      x: RW + 20,
      y: isFlying ? GROUND_Y - 68 : GROUND_Y - 14,
      type: Math.floor(Math.random() * COLLECT_EMOJIS.length),
      w: 28,
      h: 28
    });
  }

  // Draw and move obstacles
  ctx.font = '30px serif';
  var newObstacles = [];
  for (var oi = 0; oi < runner.obstacles.length; oi++) {
    var ob = runner.obstacles[oi];
    ob.x -= runner.speed;
    var obY = GROUND_Y - (ob.tall ? 38 : 18);
    ctx.fillText(OBSTACLE_EMOJIS[ob.type], ob.x, obY + 8);
    if (ob.x > -50) newObstacles.push(ob);
  }
  runner.obstacles = newObstacles;

  // Draw and move collectibles
  ctx.font = '24px serif';
  var newCollectibles = [];
  for (var col = 0; col < runner.collectibles.length; col++) {
    var colItem = runner.collectibles[col];
    colItem.x -= runner.speed;
    var colBob = Math.sin(runner.frameCount * 0.1 + colItem.x * 0.05) * 4;
    ctx.fillText(COLLECT_EMOJIS[colItem.type], colItem.x, colItem.y + colBob);
    if (colItem.x > -40) newCollectibles.push(colItem);
  }
  runner.collectibles = newCollectibles;

  // Player dimensions
  var playerH = runner.sliding ? 24 : 44;
  var playerW = runner.sliding ? 48 : 30;
  var playerTop = runner.sliding ? runner.y - playerH + 8 : runner.y - playerH;

  // Shield glow
  if (runner.shieldActive) {
    ctx.save();
    ctx.globalAlpha = 0.28 + 0.18 * Math.sin(runner.frameCount * 0.25);
    ctx.fillStyle = '#74c69d';
    ctx.beginPath();
    ctx.ellipse(runner.x + 18, playerTop + playerH / 2, playerW + 14, playerH / 2 + 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Draw player
  ctx.font = runner.sliding ? '40px serif' : '36px serif';
  ctx.fillText('🧑', runner.x - 4, playerTop + playerH);
  if (runner.sliding) {
    ctx.font = '13px serif';
    ctx.fillText('💨', runner.x + 30, playerTop + playerH - 8);
  }

  // Check collisions with obstacles
  var safeObstacles = [];
  for (var oci = 0; oci < runner.obstacles.length; oci++) {
    var obst = runner.obstacles[oci];
    var obY2 = GROUND_Y - (obst.tall ? 38 : 18);
    var obHitH = obst.tall ? 48 : 30;
    var hitX = runner.x + 6 < obst.x + obst.w - 6 && runner.x + playerW - 6 > obst.x + 6;
    var hitY = playerTop < obY2 && playerTop + playerH > obY2 - obHitH + 8;
    if (!runner.shieldActive && hitX && hitY) {
      runner.lives--;
      updateRunnerHUD();
      showToast('🌿 Hit by an invasive! -1 life', 1500);
      if (runner.lives <= 0) {
        endRunner();
        return;
      }
    } else {
      safeObstacles.push(obst);
    }
  }
  runner.obstacles = safeObstacles;

  // Check collisions with collectibles
  var safeCollectibles = [];
  for (var cci = 0; cci < runner.collectibles.length; cci++) {
    var col2 = runner.collectibles[cci];
    var chitX = runner.x + 6 < col2.x + col2.w - 4 && runner.x + playerW - 4 > col2.x + 4;
    var chitY = playerTop < col2.y + col2.h && playerTop + playerH > col2.y;
    if (chitX && chitY) {
      var emoji = COLLECT_EMOJIS[col2.type];
      if (emoji === '⭐') {
        runner.score += 50;
        showToast('⭐ Star! +50 pts', 1200);
      } else if (emoji === '🛡️') {
        runner.shieldActive = true;
        runner.shieldTimer = 180;
        showToast('🛡️ Shield! 3 seconds of invincibility!', 1500);
      } else {
        runner.score += 10;
        showToast('🌸 Native plant! +10 pts', 900);
      }
      updateRunnerHUD();
    } else {
      safeCollectibles.push(col2);
    }
  }
  runner.collectibles = safeCollectibles;

  // Distance score
  if (runner.frameCount % 14 === 0) {
    runner.score++;
    updateRunnerHUD();
  }

  // HUD overlay
  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  ctx.fillRect(0, 0, RW, 28);
  ctx.fillStyle = '#74c69d';
  ctx.font = 'bold 12px Nunito, sans-serif';
  ctx.fillText('Score: ' + runner.score, 10, 19);
  ctx.fillText('Speed: ' + runner.speed.toFixed(1) + 'x', 110, 19);
  if (runner.shieldActive) {
    ctx.fillStyle = '#f4d03f';
    ctx.fillText('🛡️ SHIELD ACTIVE', 210, 19);
  }

  // Rotating facts
  if (runner.frameCount % 460 === 0) {
    displayRunnerFact();
  }

  runner.animLoop = requestAnimationFrame(runnerLoop);
}

function updateRunnerHUD() {
  document.getElementById('runnerScoreDisplay').textContent = runner.score;
  var stored = parseInt(localStorage.getItem('runnerHigh_sg4') || '0');
  if (runner.score > stored) {
    stored = runner.score;
    try { localStorage.setItem('runnerHigh_sg4', stored); } catch(e) {}
  }
  document.getElementById('runnerBest').textContent = stored;
  var hearts = '';
  for (var h = 0; h < runner.lives; h++) hearts += '❤️';
  for (var d = runner.lives; d < 3; d++) hearts += '🖤';
  document.getElementById('runnerLivesDisplay').textContent = hearts || '💀';
}

function endRunner() {
  runner.active = false;
  if (runner.animLoop) cancelAnimationFrame(runner.animLoop);
  var stored = parseInt(localStorage.getItem('runnerHigh_sg4') || '0');
  if (runner.score > stored) {
    try { localStorage.setItem('runnerHigh_sg4', runner.score); } catch(e) {}
  }
  if (runner.score > gameScores.runner) {
    gameScores.runner = runner.score;
  }
  updateAllScores();
  var title = runner.score >= 200 ? '🏆 Great Run!' : '💀 Invaded!';
  var msg = 'You scored ' + runner.score + ' points! High score: ' + Math.max(runner.score, parseInt(localStorage.getItem('runnerHigh_sg4') || '0')) + '. The invasive plants got you — try again!';
  showRunnerStartScreen(title, msg, 'Try Again 🔄');
  showToast('Game over! ' + runner.score + ' pts scored!', 3000);
}

function displayRunnerFact() {
  var el = document.getElementById('runnerFact');
  if (el) {
    el.textContent = '💡 Did you know? ' + SG_FACTS[Math.floor(Math.random() * SG_FACTS.length)];
  }
}

// Jump on key/tap/click
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' || e.key === 'ArrowUp') {
    e.preventDefault();
    doJump();
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    doSlide();
  }
});

if (canvas) {
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    doJump();
  }, { passive: false });
  canvas.addEventListener('click', function() {
    doJump();
  });
}

function doJump() {
  if (!runner.active) return;
  if (!runner.jumping && !runner.sliding) {
    runner.vy = -13;
    runner.jumping = true;
  }
}

function doSlide() {
  if (!runner.active) return;
  if (!runner.jumping) {
    runner.sliding = true;
    runner.slideTimer = 44;
  }
}

// ============================================================
// SPREAD SIMULATOR
// ============================================================
var simCanvas = document.getElementById('simCanvas');
var simCtx = simCanvas ? simCanvas.getContext('2d') : null;
var SIM_COLS = 60;
var SIM_ROWS = 32;
var simGrid = [];
var simRunning = false;
var simTimer = null;
var simYear = 0;

var SIM_RATES = { mam: 0.13, zanzibar: 0.08, siam: 0.04, hyacinth: 0.09 };
var SIM_SIZES = { large: 1.0, medium: 0.72, small: 0.48 };

function resetSim() {
  simRunning = false;
  clearInterval(simTimer);
  simYear = 0;

  var btn = document.getElementById('simPlayBtn');
  if (btn) btn.textContent = '▶️ Start';

  var yearEl = document.getElementById('simYear');
  if (yearEl) yearEl.textContent = '0';

  var pctEl = document.getElementById('simPct');
  if (pctEl) pctEl.textContent = '0';

  var tip = document.getElementById('simTip');
  if (tip) tip.textContent = 'Select a species and press Start to begin the 30-year simulation.';

  simGrid = [];
  for (var r = 0; r < SIM_ROWS; r++) {
    var row = [];
    for (var c = 0; c < SIM_COLS; c++) {
      row.push(0);
    }
    simGrid.push(row);
  }

  // Add water body on right side
  for (var wr = Math.floor(SIM_ROWS * 0.25); wr < Math.floor(SIM_ROWS * 0.75); wr++) {
    for (var wc = Math.floor(SIM_COLS * 0.63); wc < Math.floor(SIM_COLS * 0.78); wc++) {
      simGrid[wr][wc] = 3;
    }
  }

  // Start invasive at left edge
  simGrid[Math.floor(SIM_ROWS / 2)][4] = 1;

  drawSim();
}

function drawSim() {
  if (!simCtx || !simCanvas) return;
  var cw = simCanvas.width;
  var ch = simCanvas.height;
  var cellW = cw / SIM_COLS;
  var cellH = ch / SIM_ROWS;

  for (var r = 0; r < SIM_ROWS; r++) {
    for (var c = 0; c < SIM_COLS; c++) {
      var v = simGrid[r][c];
      if (v === 0) {
        simCtx.fillStyle = 'hsl(' + (138 + (r * c % 14)) + ', 52%, ' + (27 + (r + c) % 7) + '%)';
      } else if (v === 1) {
        simCtx.fillStyle = 'hsl(' + (4 + (r * 3 % 10)) + ', 73%, ' + (40 + r % 8) + '%)';
      } else if (v === 2) {
        simCtx.fillStyle = '#1a4a2a';
      } else {
        simCtx.fillStyle = 'hsl(210, 63%, ' + (37 + c % 8) + '%)';
      }
      simCtx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
    }
  }

  // Legend bar at bottom
  simCtx.fillStyle = 'rgba(0,0,0,0.55)';
  simCtx.fillRect(0, ch - 22, cw, 22);
  simCtx.font = '11px Nunito, sans-serif';
  simCtx.fillStyle = '#fff';
  simCtx.fillText('🟢 Native', 8, ch - 6);
  simCtx.fillText('🔴 Invaded', 100, ch - 6);
  simCtx.fillText('🔵 Water', 200, ch - 6);
  simCtx.fillText('🟫 Protected', 290, ch - 6);
}

function simStep() {
  var species = document.getElementById('simSpecies').value;
  var size = document.getElementById('simSize').value;
  var rate = SIM_RATES[species] * SIM_SIZES[size];
  var isAquatic = (species === 'hyacinth');

  var newGrid = [];
  for (var r = 0; r < SIM_ROWS; r++) {
    var row = [];
    for (var c = 0; c < SIM_COLS; c++) {
      row.push(simGrid[r][c]);
    }
    newGrid.push(row);
  }

  var dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];
  for (var r = 0; r < SIM_ROWS; r++) {
    for (var c = 0; c < SIM_COLS; c++) {
      if (simGrid[r][c] === 1) {
        for (var di = 0; di < dirs.length; di++) {
          var nr = r + dirs[di][0];
          var nc = c + dirs[di][1];
          if (nr < 0 || nr >= SIM_ROWS || nc < 0 || nc >= SIM_COLS) continue;
          var target = simGrid[nr][nc];
          if (isAquatic && target === 3 && Math.random() < rate) {
            newGrid[nr][nc] = 1;
          } else if (!isAquatic && target === 0 && Math.random() < rate) {
            newGrid[nr][nc] = 1;
          }
        }
      }
    }
  }

  simGrid = newGrid;
  simYear++;

  var invaded = 0;
  var total = 0;
  for (var gr = 0; gr < SIM_ROWS; gr++) {
    for (var gc = 0; gc < SIM_COLS; gc++) {
      if (simGrid[gr][gc] !== 3) total++;
      if (simGrid[gr][gc] === 1) invaded++;
    }
  }
  var pct = Math.round((invaded / total) * 100);

  document.getElementById('simYear').textContent = simYear;
  document.getElementById('simPct').textContent = pct;

  var tip = document.getElementById('simTip');
  if (pct > 5 && pct <= 25) {
    tip.textContent = '🔴 Invasion spreading! Native species are being displaced. Press Intervene!';
  } else if (pct > 25 && pct <= 55) {
    tip.textContent = '🚨 Over 25% invaded! Habitats are collapsing — click NParks Intervenes!';
  } else if (pct > 55) {
    tip.textContent = '💀 Over half the reserve is destroyed. Early action is everything!';
  }

  if (simYear >= 30) {
    clearInterval(simTimer);
    simRunning = false;
    document.getElementById('simPlayBtn').textContent = '▶️ Start';
    tip.textContent = '30 years later: ' + pct + '% of the reserve was invaded. Press Reset to try a different scenario!';
    showToast('Simulation done — ' + pct + '% invaded!', 3000);
  }

  drawSim();
}

function toggleSim() {
  if (simRunning) {
    clearInterval(simTimer);
    simRunning = false;
    document.getElementById('simPlayBtn').textContent = '▶️ Resume';
  } else {
    simRunning = true;
    document.getElementById('simPlayBtn').textContent = '⏸️ Pause';
    simTimer = setInterval(simStep, 185);
  }
}

function simIntervene() {
  var count = 0;
  for (var r = 0; r < SIM_ROWS && count < 28; r++) {
    for (var c = 0; c < SIM_COLS && count < 28; c++) {
      if (simGrid[r][c] === 1 && Math.random() < 0.38) {
        simGrid[r][c] = 2;
        count++;
      }
    }
  }
  var tip = document.getElementById('simTip');
  tip.textContent = '🛡️ NParks intervened! Dark brown cells resist further invasion. Will it be enough?';
  showToast('🛡️ NParks is removing invasives!', 2000);
  drawSim();
}

// ============================================================
// PLEDGE SYSTEM
// ============================================================
function updatePledge() {
  var checkboxes = document.querySelectorAll('.pledge-list input[type="checkbox"]');
  var checked = 0;
  var states = [];
  for (var i = 0; i < checkboxes.length; i++) {
    states.push(checkboxes[i].checked);
    if (checkboxes[i].checked) checked++;
  }
  document.getElementById('pledgeDone').textContent = checked;
  var pct = (checked / checkboxes.length) * 100;
  document.getElementById('pledgeBarFill').style.width = pct + '%';

  var completeMsg = document.getElementById('pledgeCompleteMsg');
  if (checked === checkboxes.length) {
    completeMsg.style.display = 'block';
    showToast('🏅 You are now a Singapore Plant Defender!', 3000);
  } else {
    completeMsg.style.display = 'none';
  }

  try { localStorage.setItem('pledge_sg4', JSON.stringify(states)); } catch(e) {}
}

function restorePledge() {
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem('pledge_sg4') || '[]'); } catch(e) {}
  var checkboxes = document.querySelectorAll('.pledge-list input[type="checkbox"]');
  for (var i = 0; i < checkboxes.length; i++) {
    if (saved[i]) checkboxes[i].checked = true;
  }
  if (checkboxes.length > 0) updatePledge();
}

// ============================================================
// INIT ON PAGE LOAD
// ============================================================
window.addEventListener('load', function() {
  updateProgress();
  updateAllScores();
  initQuiz();
  startMemory();
  startSpot();
  resetSim();
  initRunnerDisplay();

  var stored = localStorage.getItem('runnerHigh_sg4') || '0';
  var bestEl = document.getElementById('runnerBest');
  if (bestEl) bestEl.textContent = stored;
});



// Example Game Loop or Movement Function
const GAME_BOTTOM_BOUNDARY = 300; // Adjust this to your actual ground Y-coordinate
const player = { x: 50, y: 300, speed: 5 };

function movePlayer(direction) {
  if (direction === 'down') {
    player.y += player.speed;
  }
  
  // THE FIX: Clamp the position so they can't go below the floor
  if (player.y > GAME_BOTTOM_BOUNDARY) {
    player.y = GAME_BOTTOM_BOUNDARY;
  }
}




const playerSprite = document.getElementById('player-sprite');
let isDucking = false;

// Listen for the key press (The Duck)
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown' && !isDucking) {
    isDucking = true;
    playerSprite.classList.add('duck-active'); 
    
    // Optional: Add a timeout to force them to stand up after 2 seconds
    // setTimeout(() => standUp(), 2000); 
  }
});

// Listen for the key release (The Stand Up)
document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowDown') {
    standUp();
  }
});

function standUp() {
  isDucking = false;
  playerSprite.classList.remove('duck-active');
}




// Function initializer for Gallery Filter Actions
function initFlowerGallery() {
  const filterButtons = document.querySelectorAll('.gallery-filters .tab-btn');
  const flowerCards = document.querySelectorAll('.flower-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 1. Reset selection styling on buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // 2. Extract selected category evaluation string
      const selectedFilter = button.getAttribute('data-filter');

      // 3. Loop cards and safely apply responsive visual flags
      flowerCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (selectedFilter === 'all' || cardCategory === selectedFilter) {
          card.style.display = 'flex';
          // Triggers your pre-built fadeUp keyframe animation gracefully
          card.style.animation = 'fadeUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Instantiate within your existing DomContentLoaded pipeline listener
document.addEventListener('DOMContentLoaded', () => {
  initFlowerGallery();
});



// A single function to rule them all
function initNavigation() {
  const navLinks = document.querySelectorAll('[data-target]');
  const pages = document.querySelectorAll('.page');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPageId = link.getAttribute('data-target');

      pages.forEach(page => {
        if (page.id === `${targetPageId}-page`) {
          page.classList.add('active');
          page.setAttribute('aria-hidden', 'false');
        } else {
          page.classList.remove('active');
          page.setAttribute('aria-hidden', 'true');
        }
      });

      // Update active nav link styling
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}




// Save score whenever they earn points
function updateScore(points) {
  let currentScore = parseInt(localStorage.getItem('ecoScore')) || 0;
  currentScore += points;
  
  localStorage.setItem('ecoScore', currentScore);
  displayScore(currentScore);
}

// Load score when the web page first boot ups
document.addEventListener('DOMContentLoaded', () => {
  const savedScore = localStorage.getItem('ecoScore') || 0;
  displayScore(savedScore);
});

function displayScore(score) {
  document.querySelector('.nav-score').textContent = `🍃 Score: ${score}`;
}





document.addEventListener('DOMContentLoaded', () => {
  initApplicationRouter();
});

function initApplicationRouter() {
  const navAnchors = document.querySelectorAll('.nav-links a, .nav-logo');
  const targetPages = document.querySelectorAll('.page');

  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      
      // Fallback fallback to dashboard page if logo wrapper element clicked
      const targetId = anchor.getAttribute('data-target') || 'hero';
      const destinationPage = document.getElementById(`${targetId}-page`);

      if (!destinationPage) return;

      // Clean viewport panel cycling execution loop
      targetPages.forEach(page => {
        page.classList.remove('active');
        page.setAttribute('aria-hidden', 'true');
      });

      destinationPage.classList.add('active');
      destinationPage.setAttribute('aria-hidden', 'false');

      // Update active state indication across nav links
      document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
      if (anchor.tagName === 'A') {
        anchor.classList.add('active');
      }
      
      // Automatically scroll window layout seamlessly to viewport top point
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}



let gameScore = 0;

function enemyDodgedOrItemCollected(points) {
  gameScore += points;
  document.querySelector('.nav-score').textContent = `🍃 Score: ${gameScore}`;
  
  // Instant Reward Milestones
  if (gameScore === 50) {
    showToast("🏅 Badge Earned: Novice Ranger!");
  } else if (gameScore === 150) {
    showToast("🌟 Badge Earned: Habitat Guardian!");
  }
}





document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('spread-grid');
  const btnAdvance = document.getElementById('btn-advance');
  const statNative = document.getElementById('stat-native');
  const statKudzu = document.getElementById('stat-kudzu');
  
  let grid = [];
  const gridSize = 10; // 10x10 grid (100 cells)

  // 1. Setup the initial forest
  function initSim() {
    gridContainer.innerHTML = '';
    grid = Array(gridSize * gridSize).fill('native');
    
    // Plant two invasive seeds to start
    grid[0] = 'invasive'; 
    grid[9] = 'invasive';

    drawGrid();
  }

  // 2. Draw the grid to the screen
  function drawGrid() {
    gridContainer.innerHTML = '';
    let invasiveCount = 0;

    grid.forEach(cellState => {
      const cell = document.createElement('div');
      cell.className = `sim-cell cell-${cellState}`;
      gridContainer.appendChild(cell);
      if (cellState === 'invasive') invasiveCount++;
    });

    // Update the UI stats
    statNative.textContent = `${100 - invasiveCount}%`;
    statKudzu.textContent = `${invasiveCount}%`;
  }

  // 3. The Spread Logic (When button is clicked)
  btnAdvance.addEventListener('click', () => {
    let newGrid = [...grid];

    for (let i = 0; i < grid.length; i++) {
      if (grid[i] === 'invasive') {
        // Spread logic: Target adjacent cells (up, down, left, right)
        const adjacent = [i - 1, i + 1, i - gridSize, i + gridSize];
        
        adjacent.forEach(adjIndex => {
          // Check boundaries and random chance of spreading
          if (adjIndex >= 0 && adjIndex < grid.length && Math.random() > 0.3) {
            newGrid[adjIndex] = 'invasive';
          }
        });
      }
    }
    grid = newGrid;
    drawGrid();
  });

  // Start it up!
  initSim();
});




// 1. The Translation Dictionary
const translations = {
  en: {
    hero_title: "Habitat Defender",
    hero_subtitle: "Protect Singapore's rainforest from invaders!",
    btn_start: "DEFEND NOW"
  },
  zh: {
    hero_title: "栖息地卫士",
    hero_subtitle: "保护新加坡的雨林免受入侵！",
    btn_start: "立即保卫"
  },
  ms: {
    hero_title: "Pembela Habitat",
    hero_subtitle: "Lindungi hutan hujan Singapura dari penceroboh!",
    btn_start: "PERTAHANKAN SEKARANG"
  },
  ta: {
    hero_title: "வாழ்விட பாதுகாவலர்",
    hero_subtitle: "சிங்கப்பூரின் மழைக்காடுகளை பாதுகாப்போம்!",
    btn_start: "இப்போதே பாதுகாக்கவும்"
  },
  jp: {
    hero_title: "ハビタット・ディフェンダー",
    hero_subtitle: "シンガポールの熱帯雨林を侵略者から守れ！",
    btn_start: "今すぐ守る"
  },
  hokkien: {
    hero_title: "Seng-thài Uē-sū", // Example Romanized Hokkien
    hero_subtitle: "Pó-hōo Sin-ka-pho ê hōo-lîm!",
    btn_start: "CHIT-MÁ PÓ-HŌO"
  }
};

// 2. The Language Switcher Function
function setLanguage(languageCode) {
  // Find all elements on the page that have the data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    const translationKey = element.getAttribute('data-i18n');
    
    // Check if the translation exists in our dictionary
    if (translations[languageCode] && translations[languageCode][translationKey]) {
      element.textContent = translations[languageCode][translationKey];
    }
  });

  // Optional: Save the user's preference so it stays when they refresh
  localStorage.setItem('preferredLanguage', languageCode);
}

// 3. Hooking up the Event Listener
document.addEventListener('DOMContentLoaded', () => {
  const langSelector = document.getElementById('language-selector');
  
  // Check if the user already chose a language previously
  const savedLang = localStorage.getItem('preferredLanguage') || 'en';
  langSelector.value = savedLang;
  setLanguage(savedLang);

  // Listen for dropdown changes
  langSelector.addEventListener('change', (event) => {
    setLanguage(event.target.value);
  });
});





let currentZoom = 1.0;

function changeZoom(amount) {
  currentZoom += amount;
  
  // Set safety limits so the user can't zoom to infinity or zero
  if (currentZoom < 0.8) currentZoom = 0.8;
  if (currentZoom > 2.0) currentZoom = 2.0;
  
  document.body.style.zoom = currentZoom;
}

function resetZoom() {
  currentZoom = 1.0;
  document.body.style.zoom = currentZoom;
}




function readContent(button) {
  // 1. Find the parent card or the nearest text content
  const card = button.closest('.eco-card') || button.closest('.page');
  const textToRead = card.querySelector('p, h1, h3').innerText;

  // 2. Create the speech object
  const speech = new SpeechSynthesisUtterance(textToRead);
  
  // 3. Set the language based on your current selector
  const langSelector = document.getElementById('language-selector');
  speech.lang = langSelector.value === 'zh' ? 'zh-CN' : 
                langSelector.value === 'ms' ? 'ms-MY' : 
                langSelector.value === 'ta' ? 'ta-IN' : 
                'en-US';

  // 4. Speak!
  window.speechSynthesis.speak(speech);
}
