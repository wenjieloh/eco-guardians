// ============================================================
// NAVIGATION
// ============================================================
var gameScores = { quiz: 0, memory: 0, spot: 0, chain: 0 };

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
  if (name === 'action') restorePledge();
}

document.getElementById('hamburger').addEventListener('click', function () {
  document.getElementById('navLinks').classList.toggle('open');
});

var navLinkItems = document.querySelectorAll('.nav-links a');
for (var ni = 0; ni < navLinkItems.length; ni++) {
  navLinkItems[ni].addEventListener('click', function () {
    document.getElementById('navLinks').classList.remove('open');
  });
}

function showToast(msg, duration) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () {
    t.classList.remove('show');
  }, duration || 2500);
}

function updateAllScores() {
  document.getElementById('quizScoreVal').textContent = gameScores.quiz;
  document.getElementById('memoryScoreVal').textContent = gameScores.memory;
  document.getElementById('spotScoreVal').textContent = gameScores.spot;
  document.getElementById('chainScoreVal').textContent = gameScores.chain;
  var total = gameScores.quiz + gameScores.memory + gameScores.spot + gameScores.chain;
  document.getElementById('totalScoreVal').textContent = total;
  document.getElementById('navScore').textContent = total + ' pts';
}

// ============================================================
// FALLING LEAVES ON HERO — CSS only, no emoji text
// ============================================================
var heroLeaves = document.getElementById('heroLeaves');
for (var li = 0; li < 22; li++) {
  var leaf = document.createElement('div');
  leaf.className = 'leaf-particle';
  leaf.style.left = (Math.random() * 100) + 'vw';
  leaf.style.animationDuration = (8 + Math.random() * 10) + 's';
  leaf.style.animationDelay = (Math.random() * 14) + 's';
  heroLeaves.appendChild(leaf);
}

// ============================================================
// LEARN PAGE — TABS
// ============================================================
var tabBtns = document.querySelectorAll('.tab-btn');
for (var ti = 0; ti < tabBtns.length; ti++) {
  tabBtns[ti].addEventListener('click', function () {
    var allBtns = document.querySelectorAll('.tab-btn');
    var allPanes = document.querySelectorAll('.tab-pane');
    for (var x = 0; x < allBtns.length; x++) allBtns[x].classList.remove('active');
    for (var y = 0; y < allPanes.length; y++) allPanes[y].classList.remove('active');
    this.classList.add('active');
    document.getElementById('tab-' + this.dataset.tab).classList.add('active');
  });
}

var readTabsSet = [];
try { readTabsSet = JSON.parse(localStorage.getItem('readTabs_v4') || '[]'); } catch (e) { readTabsSet = []; }

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
    try { localStorage.setItem('readTabs_v4', JSON.stringify(readTabsSet)); } catch (e) {}
  }
  updateProgress();
  btn.textContent = 'Done!';
  btn.classList.add('done');
  showToast('Section read! ' + Math.round((readTabsSet.length / 5) * 100) + '% complete');
}

for (var ri = 0; ri < readTabsSet.length; ri++) {
  var rBtn = document.querySelector('#tab-' + readTabsSet[ri] + ' .mark-btn');
  if (rBtn) { rBtn.textContent = 'Done!'; rBtn.classList.add('done'); }
}
updateProgress();

// ============================================================
// SPECIES — FILTER + EXPAND
// ============================================================
var filterBtns = document.querySelectorAll('.filter-btn');
for (var fi = 0; fi < filterBtns.length; fi++) {
  filterBtns[fi].addEventListener('click', function () {
    var allFBtns = document.querySelectorAll('.filter-btn');
    for (var k = 0; k < allFBtns.length; k++) allFBtns[k].classList.remove('active');
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
    btn.textContent = 'Full Profile';
  } else {
    detail.classList.add('open');
    detail.style.display = 'block';
    btn.textContent = 'Show Less';
  }
}

// ============================================================
// GAME SWITCHER
// ============================================================
function switchGame(name, clickedTab) {
  var panels = document.querySelectorAll('.game-panel');
  for (var p = 0; p < panels.length; p++) panels[p].classList.remove('active-panel');
  var tabs = document.querySelectorAll('.game-tab');
  for (var t = 0; t < tabs.length; t++) tabs[t].classList.remove('active-tab');
  document.getElementById('game-' + name).classList.add('active-panel');
  clickedTab.classList.add('active-tab');
  setTimeout(function () {
    document.getElementById('game-' + name).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
  if (name === 'memory') startMemory();
  if (name === 'spot') startSpot();
  if (name === 'quiz') initQuiz();
  if (name === 'chain') initChain();
}

// ============================================================
// QUIZ GAME — REWORKED
// Timed per-question, streak multiplier, animated feedback
// ============================================================
var quizData = [
  {
    q: "Which invasive plant is considered Singapore's most problematic weed by NParks?",
    a: ["Zanzibar Yam", "Mile-a-Minute (Mikania micrantha)", "Lantana", "Water Hyacinth"],
    c: 1,
    e: "Mile-a-Minute grows up to 8cm per day and is found in virtually every nature area in Singapore, smothering native vegetation wherever it spreads.",
    difficulty: "medium"
  },
  {
    q: "How did Mile-a-Minute first arrive in Singapore?",
    a: ["Carried by migratory birds", "Deliberately planted by NParks", "Via contaminated grass seed in the 1960s", "Through the aquarium trade"],
    c: 2,
    e: "Contaminated grass seed imports in the 1960s — a single preventable mistake that created decades of ongoing management costs and irreversible forest damage.",
    difficulty: "hard"
  },
  {
    q: "The Zanzibar Yam spreads in Singapore primarily through:",
    a: ["Wind-dispersed seeds", "Bulbils that fall and remain dormant in soil for years", "Underground root runners", "Being eaten and spread by birds"],
    c: 1,
    e: "Bulbils are small aerial tubers that drop from the vine. They can remain viable in soil for years before sprouting, making complete removal very difficult.",
    difficulty: "medium"
  },
  {
    q: "Why is Senduduk Bulu especially dangerous in Singapore's forests?",
    a: ["It only grows in open fields", "It tolerates shade and can invade intact forest understorey", "It is spread only by humans", "It only affects aquatic habitats"],
    c: 1,
    e: "Unlike most invasives that start at forest edges, Senduduk Bulu can invade shaded forest understorey — breaking the regeneration cycle of native forest completely.",
    difficulty: "hard"
  },
  {
    q: "What is an 'invasion meltdown' as seen with Senduduk Bulu in Singapore?",
    a: ["When a forest burns due to invasives", "When two invasive species help each other spread — like the Javan Myna spreading Senduduk Bulu", "When invasives spread faster in hot weather", "When NParks runs out of budget for management"],
    c: 1,
    e: "The invasive Javan Myna eats Senduduk Bulu berries and disperses seeds throughout forests. Two invasive species helping each other spread is called an invasion meltdown.",
    difficulty: "hard"
  },
  {
    q: "The Albizia tree is dangerous in Singapore because:",
    a: ["Its berries are toxic to humans", "It grows very fast but produces structurally weak wood that breaks dangerously in storms", "It blocks waterways and canals", "It releases toxic chemicals into the soil"],
    c: 1,
    e: "Albizia grows up to 7m per year but produces brittle wood. In Singapore's frequent tropical storms, branches and whole trees can fall suddenly — a serious safety hazard.",
    difficulty: "medium"
  },
  {
    q: "Why was Water Hyacinth originally introduced to Singapore?",
    a: ["As a water treatment plant", "For fish farming and aquaculture", "As a decorative ornamental pond plant due to its beautiful purple flowers", "For scientific research purposes"],
    c: 2,
    e: "Introduced as a decorative pond plant because of its beautiful purple flowers — now one of Singapore's costliest aquatic invasives to manage, clogging waterways and harbouring mosquitoes.",
    difficulty: "easy"
  },
  {
    q: "Which agency should you contact if you spot Water Hyacinth in a Singapore canal?",
    a: ["Ministry of Education", "PUB (Public Utilities Board) at 1800-284-6600", "Urban Redevelopment Authority", "Singapore Tourism Board"],
    c: 1,
    e: "PUB manages Singapore's waterways and has specialist teams for aquatic invasive removal. Early reports save enormous management costs!",
    difficulty: "easy"
  },
  {
    q: "What makes Singapore especially vulnerable to new invasive plant introductions?",
    a: ["Its very small geographical size alone", "Being a major global port and aviation hub, combined with a tropical climate perfect for invasive growth all year round", "Having too many parks and green spaces", "Its clay soil composition"],
    c: 1,
    e: "Singapore's position as a major port and aviation hub means invasive species constantly arrive hidden in cargo, soil, and luggage. Our tropical climate allows year-round explosive growth.",
    difficulty: "medium"
  },
  {
    q: "Giant Salvinia is primarily spread in Singapore through:",
    a: ["Migratory water birds", "Flood events washing it between water bodies", "Aquarium hobbyists dumping plants into waterways and canals", "Wind dispersal of tiny spores"],
    c: 2,
    e: "Aquarium hobbyists dumping plants into Singapore canals is the main vector. Giant Salvinia can double its biomass in just 2.5 days — making every dumped plant a potential disaster.",
    difficulty: "medium"
  },
  {
    q: "What is Singapore's City in Nature initiative?",
    a: ["A plan to build more indoor gardens and conservatories", "NParks' initiative to integrate nature throughout Singapore's urban landscape and restore biodiversity", "A tourism campaign promoting Singapore's parks", "A programme for importing more ornamental plants"],
    c: 1,
    e: "City in Nature is NParks' flagship initiative. Managing invasive plants is one of its biggest ongoing challenges — which is exactly why citizen action like yours matters so much.",
    difficulty: "easy"
  },
  {
    q: "Bukit Timah Nature Reserve is scientifically remarkable because:",
    a: ["It is the largest park in Singapore by area", "At just 163 hectares, it has more plant species than the entire North American continent — making it critical to protect from invasives", "It has no invasive plants at all", "It was entirely created by humans through reforestation"],
    c: 1,
    e: "Bukit Timah is one of Earth's most biodiverse urban forest patches — harbouring extraordinary species density. Protecting it from Mile-a-Minute and Zanzibar Yam is a top NParks priority.",
    difficulty: "hard"
  }
];

var currentQuestion = 0;
var quizScore = 0;
var quizAnswered = false;
var quizStreak = 0;
var quizTimer = null;
var quizTimeLeft = 0;
var QUIZ_TIME_PER_Q = 18;

function initQuiz() {
  currentQuestion = 0;
  quizScore = 0;
  quizAnswered = false;
  quizStreak = 0;
  clearInterval(quizTimer);
  document.getElementById('quizComplete').style.display = 'none';
  document.getElementById('quizPlayArea').style.display = 'block';

  // Inject streak + timer bar if not already present
  var header = document.querySelector('.quiz-box .game-box-header');
  if (header && !document.getElementById('quizStreakBadge')) {
    var badge = document.createElement('div');
    badge.id = 'quizStreakBadge';
    badge.style.cssText = 'background:rgba(244,208,63,0.15);border:1px solid rgba(244,208,63,0.4);color:#f4d03f;font-weight:800;font-size:0.8rem;padding:0.3rem 0.75rem;border-radius:50px;';
    badge.textContent = 'Streak: 0';
    header.appendChild(badge);
  }

  if (!document.getElementById('quizTimerBar')) {
    var timerWrap = document.createElement('div');
    timerWrap.id = 'quizTimerWrap';
    timerWrap.style.cssText = 'height:6px;background:rgba(45,106,79,0.12);border-radius:50px;margin-bottom:1.2rem;overflow:hidden;';
    var timerFill = document.createElement('div');
    timerFill.id = 'quizTimerBar';
    timerFill.style.cssText = 'height:100%;background:linear-gradient(90deg,#e74c3c,#f4d03f,#52b788);border-radius:50px;transition:width 0.9s linear;width:100%;';
    timerWrap.appendChild(timerFill);
    var progressBar = document.querySelector('.quiz-progress-bar');
    if (progressBar) progressBar.parentNode.insertBefore(timerWrap, progressBar.nextSibling);
  }

  renderQuestion();
}

function startQuizTimer() {
  clearInterval(quizTimer);
  quizTimeLeft = QUIZ_TIME_PER_Q;
  var bar = document.getElementById('quizTimerBar');
  if (bar) bar.style.width = '100%';

  quizTimer = setInterval(function () {
    quizTimeLeft--;
    var pct = (quizTimeLeft / QUIZ_TIME_PER_Q) * 100;
    var bar2 = document.getElementById('quizTimerBar');
    if (bar2) bar2.style.width = pct + '%';
    if (quizTimeLeft <= 0) {
      clearInterval(quizTimer);
      if (!quizAnswered) {
        timeOutQuestion();
      }
    }
  }, 1000);
}

function timeOutQuestion() {
  quizAnswered = true;
  quizStreak = 0;
  updateStreakBadge();
  var q = quizData[currentQuestion];
  var btns = document.querySelectorAll('.answer-btn');
  for (var i = 0; i < btns.length; i++) btns[i].disabled = true;
  btns[q.c].classList.add('correct');
  var fb = document.getElementById('quizFeedback');
  fb.className = 'quiz-feedback wrong-fb';
  fb.innerHTML = '<strong>Time\'s up!</strong> The correct answer was: <em>' + q.a[q.c] + '</em>. ' + q.e;
  fb.style.display = 'block';
  document.getElementById('quizNextBtn').style.display = 'inline-block';
  showToast('Time\'s up! Streak broken.', 1800);
}

function updateStreakBadge() {
  var badge = document.getElementById('quizStreakBadge');
  if (badge) {
    badge.textContent = 'Streak: ' + quizStreak;
    badge.style.background = quizStreak >= 3
      ? 'linear-gradient(135deg,rgba(244,208,63,0.35),rgba(230,126,34,0.25))'
      : 'rgba(244,208,63,0.15)';
  }
}

function renderQuestion() {
  quizAnswered = false;
  var q = quizData[currentQuestion];
  document.getElementById('qNum').textContent = currentQuestion + 1;
  document.getElementById('questionText').innerHTML =
    '<span style="font-size:0.7rem;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;padding:0.18rem 0.55rem;border-radius:50px;margin-right:0.5rem;background:' +
    (q.difficulty === 'easy' ? 'rgba(82,183,136,0.15);color:#2d6a4f' : q.difficulty === 'medium' ? 'rgba(244,208,63,0.15);color:#b7860a' : 'rgba(231,76,60,0.12);color:#c0392b') +
    '">' + q.difficulty.toUpperCase() + '</span>' + q.q;

  document.getElementById('quizProgressFill').style.width = ((currentQuestion / quizData.length) * 100) + '%';

  var grid = document.getElementById('answersGrid');
  grid.innerHTML = '';

  // Shuffle answers for display but track correct one
  var indices = [0, 1, 2, 3];
  for (var si = indices.length - 1; si > 0; si--) {
    var ri = Math.floor(Math.random() * (si + 1));
    var tmp = indices[si]; indices[si] = indices[ri]; indices[ri] = tmp;
  }

  for (var ii = 0; ii < indices.length; ii++) {
    var btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = q.a[indices[ii]];
    btn.dataset.origIndex = indices[ii];
    btn.addEventListener('click', function () {
      pickAnswer(parseInt(this.dataset.origIndex));
    });
    grid.appendChild(btn);
  }

  document.getElementById('quizFeedback').style.display = 'none';
  document.getElementById('quizNextBtn').style.display = 'none';

  startQuizTimer();
}

function pickAnswer(idx) {
  if (quizAnswered) return;
  quizAnswered = true;
  clearInterval(quizTimer);

  var q = quizData[currentQuestion];
  var btns = document.querySelectorAll('.answer-btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].disabled = true;
    if (parseInt(btns[i].dataset.origIndex) === q.c) btns[i].classList.add('correct');
  }

  var fb = document.getElementById('quizFeedback');

  if (idx === q.c) {
    quizStreak++;
    var bonus = quizStreak >= 3 ? Math.min(quizStreak - 2, 3) * 5 : 0;
    var pts = 10 + (quizTimeLeft >= 12 ? 5 : 0) + bonus;
    quizScore += pts;
    fb.className = 'quiz-feedback correct-fb';
    var streakMsg = quizStreak >= 3 ? ' Streak x' + quizStreak + '! +' + bonus + ' bonus pts!' : '';
    fb.innerHTML = '<strong>Correct! +' + pts + ' pts' + (quizTimeLeft >= 12 ? ' (Speed bonus!)' : '') + streakMsg + '</strong><br>' + q.e;
    showToast('Correct! +' + pts + ' pts' + (quizStreak >= 3 ? ' — Streak x' + quizStreak + '!' : ''));
  } else {
    btns[Array.prototype.findIndex
      ? Array.prototype.findIndex.call(btns, function (b) { return parseInt(b.dataset.origIndex) === idx; })
      : (function () { for (var x = 0; x < btns.length; x++) { if (parseInt(btns[x].dataset.origIndex) === idx) return x; } return 0; })()
    ].classList.add('wrong');
    quizStreak = 0;
    fb.className = 'quiz-feedback wrong-fb';
    fb.innerHTML = '<strong>Not quite.</strong> ' + q.e;
    showToast('Not this time! Streak broken.');
  }

  updateStreakBadge();
  fb.style.display = 'block';
  document.getElementById('quizNextBtn').style.display = 'inline-block';
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= quizData.length) {
    clearInterval(quizTimer);
    document.getElementById('quizPlayArea').style.display = 'none';
    document.getElementById('quizComplete').style.display = 'block';
    document.getElementById('quizFinalScore').textContent = quizScore;

    var grade = quizScore >= 120 ? 'PERFECT DEFENDER! You are ready to join NParks research!' :
                quizScore >= 80  ? 'Excellent! You know Singapore\'s invasives very well.' :
                quizScore >= 50  ? 'Good effort! Review the Learn section to go higher.' :
                                   'Keep studying — Singapore needs informed defenders!';
    document.getElementById('quizMessage').textContent = grade;

    if (quizScore > gameScores.quiz) gameScores.quiz = quizScore;
    updateAllScores();
    showToast('Quiz done! ' + quizScore + ' points!', 3000);
  } else {
    renderQuestion();
  }
}

function restartQuiz() { initQuiz(); }

// ============================================================
// MEMORY GAME — REWORKED
// Harder 5x4 grid (20 cards = 10 pairs), time pressure,
// combo multiplier, animated match flash
// ============================================================
var memPairsData = [
  { id: 'zanzibar', plant: 'Zanzibar Yam', origin: 'Africa & Asia', color: '#e74c3c' },
  { id: 'mam', plant: 'Mile-a-Minute', origin: 'C. & S. America', color: '#e67e22' },
  { id: 'hyacinth', plant: 'Water Hyacinth', origin: 'South America', color: '#9b59b6' },
  { id: 'clidemia', plant: 'Senduduk Bulu', origin: 'Tropical Americas', color: '#e91e8c' },
  { id: 'siam', plant: 'Siam Weed', origin: 'C. & S. America', color: '#f39c12' },
  { id: 'albizia', plant: 'Albizia', origin: 'Maluku, Indonesia', color: '#27ae60' },
  { id: 'lantana', plant: 'Lantana', origin: 'Central America', color: '#16a085' },
  { id: 'salvinia', plant: 'Giant Salvinia', origin: 'South America', color: '#2980b9' },
  { id: 'cogon', plant: 'Cogon Grass', origin: 'Southeast Asia', color: '#8e44ad' },
  { id: 'paragrass', plant: 'Para Grass', origin: 'Africa', color: '#c0392b' }
];

var memFlipped = [];
var memMatchedCount = 0;
var memMoveCount = 0;
var memLocked = false;
var memCombo = 0;
var memTotalTime = 0;
var memTimerInterval = null;
var memGameActive = false;

function startMemory() {
  memFlipped = [];
  memMatchedCount = 0;
  memMoveCount = 0;
  memLocked = false;
  memCombo = 0;
  memTotalTime = 0;
  memGameActive = false;
  clearInterval(memTimerInterval);

  document.getElementById('memMoves').textContent = '0';
  document.getElementById('memPairs').textContent = '0';
  document.getElementById('memoryComplete').style.display = 'none';

  // Inject combo + timer into header if needed
  var memHeader = document.querySelector('.memory-box .game-box-header');
  if (memHeader && !document.getElementById('memComboEl')) {
    var combo = document.createElement('div');
    combo.id = 'memComboEl';
    combo.style.cssText = 'background:rgba(244,208,63,0.15);border:1px solid rgba(244,208,63,0.35);color:#f4d03f;font-weight:800;font-size:0.8rem;padding:0.3rem 0.75rem;border-radius:50px;';
    combo.textContent = 'Combo x1';
    memHeader.appendChild(combo);
  }
  if (memHeader && !document.getElementById('memTimerEl')) {
    var timer = document.createElement('div');
    timer.id = 'memTimerEl';
    timer.style.cssText = 'background:rgba(52,152,219,0.12);border:1px solid rgba(52,152,219,0.3);color:#2980b9;font-weight:800;font-size:0.8rem;padding:0.3rem 0.75rem;border-radius:50px;';
    timer.textContent = '0s';
    memHeader.appendChild(timer);
  }

  // Legend — now 10 pairs
  var legend = document.getElementById('memoryLegend');
  legend.innerHTML = '<strong style="font-size:0.72rem;color:#3d5a47;display:block;margin-bottom:0.4rem;">Match each plant to its region of origin:</strong>';
  for (var pi = 0; pi < memPairsData.length; pi++) {
    var chip = document.createElement('div');
    chip.className = 'mem-legend-chip';
    chip.style.backgroundColor = memPairsData[pi].color;
    chip.innerHTML = '<div class="mem-legend-dot"></div>' + memPairsData[pi].plant + ' = ' + memPairsData[pi].origin;
    legend.appendChild(chip);
  }

  var allCards = [];
  for (var ai = 0; ai < memPairsData.length; ai++) {
    var p = memPairsData[ai];
    allCards.push({ id: p.id, type: 'plant',  mainText: p.plant,  subText: 'invasive plant',    color: p.color });
    allCards.push({ id: p.id, type: 'origin', mainText: p.origin, subText: 'region of origin',   color: p.color });
  }

  // Shuffle
  for (var si = allCards.length - 1; si > 0; si--) {
    var randIdx = Math.floor(Math.random() * (si + 1));
    var temp = allCards[si]; allCards[si] = allCards[randIdx]; allCards[randIdx] = temp;
  }

  var grid = document.getElementById('memoryGrid');
  grid.innerHTML = '';
  // 5 columns for 20 cards
  grid.style.gridTemplateColumns = 'repeat(5, 1fr)';

  for (var ci = 0; ci < allCards.length; ci++) {
    var card = document.createElement('button');
    card.className = 'mem-card';
    card.dataset.id = allCards[ci].id;
    card.dataset.type = allCards[ci].type;
    card.dataset.color = allCards[ci].color;
    card.innerHTML =
      '<div class="mem-card-inner">' +
        '<div class="mem-front"><div class="mem-front-leaf"></div></div>' +
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
  if (memLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  // Start timer on first flip
  if (!memGameActive) {
    memGameActive = true;
    memTimerInterval = setInterval(function () {
      memTotalTime++;
      var el = document.getElementById('memTimerEl');
      if (el) el.textContent = memTotalTime + 's';
    }, 1000);
  }

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
      memCombo++;
      var comboEl = document.getElementById('memComboEl');
      if (comboEl) comboEl.textContent = 'Combo x' + memCombo;

      cardA.classList.add('matched');
      cardB.classList.add('matched');
      // Flash
      cardA.style.boxShadow = '0 0 22px ' + cardA.dataset.color;
      cardB.style.boxShadow = '0 0 22px ' + cardB.dataset.color;
      setTimeout(function () {
        cardA.style.boxShadow = '';
        cardB.style.boxShadow = '';
      }, 500);

      memMatchedCount++;
      document.getElementById('memPairs').textContent = memMatchedCount;
      var comboMsg = memCombo >= 3 ? ' Combo x' + memCombo + '!' : '';
      showToast('Match!' + comboMsg, 1200);
      memFlipped = [];
      memLocked = false;

      if (memMatchedCount === memPairsData.length) {
        clearInterval(memTimerInterval);
        setTimeout(function () {
          document.getElementById('memoryComplete').style.display = 'block';
          document.getElementById('memFinalMoves').textContent = memMoveCount;
          // Score: base 500, minus moves penalty, minus time penalty, plus combo
          var pts = Math.max(50, 500 - memMoveCount * 6 - Math.floor(memTotalTime / 3) * 2 + memCombo * 8);
          if (pts > gameScores.memory) gameScores.memory = pts;
          updateAllScores();
          showToast('All matched! ' + memMoveCount + ' moves, ' + memTotalTime + 's — ' + pts + ' pts!', 3500);
        }, 500);
      }
    } else {
      memCombo = 0;
      var comboEl2 = document.getElementById('memComboEl');
      if (comboEl2) comboEl2.textContent = 'Combo x1';
      setTimeout(function () {
        cardA.classList.remove('flipped');
        cardB.classList.remove('flipped');
        cardA.style.backgroundColor = '';
        cardA.style.borderColor = '';
        cardB.style.backgroundColor = '';
        cardB.style.borderColor = '';
        memFlipped = [];
        memLocked = false;
      }, 950);
    }
  }
}

// ============================================================
// SPOT THE INVADER — REWORKED
// Timed rounds, confidence betting, streak tracking,
// detailed photo card with fun facts
// ============================================================
var spotPlants = [
  {
    name: 'Tembusu Tree',
    img: 'images/tembusu.jpg',
    type: 'native',
    clue: 'This iconic tree appears on Singapore\'s $5 note. It has been growing in Singapore\'s parks and forests for centuries, supporting dozens of native insect and bird species.',
    origin: 'Native to Singapore and Southeast Asia',
    funfact: 'The Tembusu at Singapore Botanic Gardens is over 150 years old and is one of Singapore\'s most beloved heritage trees.'
  },
  {
    name: 'Mile-a-Minute',
    img: 'images/mam.jpg',
    type: 'invasive',
    clue: 'This vine drapes over other plants like a thick green blanket, growing up to 8cm per day in Singapore\'s tropical climate. It arrived via contaminated grass seed in the 1960s.',
    origin: 'Native to Central and South America',
    funfact: 'A single Mile-a-Minute plant can cover an entire tree within weeks, cutting off all sunlight and killing it within months.'
  },
  {
    name: 'Sea Apple',
    img: 'images/seaapple.jpg',
    type: 'native',
    clue: 'A beautiful flowering tree commonly seen along Singapore\'s roadsides. It produces distinctive pink fluffy flowers and is a crucial food source for native pollinators including bees.',
    origin: 'Native to Singapore and Malaysia',
    funfact: 'Sea Apple (Syzygium grande) is one of the most commonly planted roadside trees in Singapore and can live for over 100 years.'
  },
  {
    name: 'Zanzibar Yam',
    img: 'images/zanzibar.jpg',
    type: 'invasive',
    clue: 'This climbing vine produces small bulb-like structures called bulbils that fall and spread through soil. It twines aggressively around trees, smothering everything beneath its large heart-shaped leaves.',
    origin: 'Native to Africa and parts of Asia',
    funfact: 'The Zanzibar Yam was likely introduced as a food crop during colonial times. Now it costs Singapore millions to manage annually.'
  },
  {
    name: 'Singapore Kopsia',
    img: 'images/kopsia.jpg',
    type: 'native',
    clue: 'This shrub produces beautiful pink flowers and is found naturally in Singapore\'s secondary forests. It is part of Singapore\'s native forest understorey and supports local pollinator communities.',
    origin: 'Native to Singapore and Peninsula Malaysia',
    funfact: 'Kopsia singapurensis is named after Singapore itself — it was first scientifically described from specimens collected here.'
  },
  {
    name: 'Siam Weed',
    img: 'images/siam.jpg',
    type: 'invasive',
    clue: 'This bushy plant grows up to 3 metres tall in a single season, releasing allelopathic chemicals that prevent other plants from growing nearby. It dominates wasteland areas on Pulau Ubin.',
    origin: 'Native to Central and South America',
    funfact: 'Siam Weed is classified as one of the world\'s 100 worst invasive species by the IUCN. It is highly flammable when dry — a fire risk in Singapore\'s forests.'
  },
  {
    name: 'Nipah Palm',
    img: 'images/nipah.jpg',
    type: 'native',
    clue: 'This palm has grown in Singapore\'s mangroves for thousands of years and is a key part of our coastal ecosystem. Its leaves are used in traditional Malay cooking to make ketupat pouches.',
    origin: 'Native to Singapore and Southeast Asia',
    funfact: 'Nipah Palm leaves are used to make attap roofing — a traditional building material still seen in kampungs and heritage buildings in Singapore.'
  },
  {
    name: 'Water Hyacinth',
    img: 'images/hyacinth.jpg',
    type: 'invasive',
    clue: 'This beautiful floating plant with purple flowers forms thick mats on water surfaces. It blocks sunlight, depletes oxygen for fish, and creates ideal breeding habitat for Aedes mosquitoes.',
    origin: 'Native to South America',
    funfact: 'Water Hyacinth was sold as an ornamental pond plant in Singapore garden centres. Some are still for sale — which is why public education is so important.'
  },
  {
    name: 'Albizia',
    img: 'images/albizia.jpg',
    type: 'invasive',
    clue: 'This tree grows up to 7 metres per year but produces structurally weak wood. Its branches can fall without warning in Singapore\'s frequent tropical storms, making it a dangerous widow-maker tree.',
    origin: 'Native to Maluku, Indonesia',
    funfact: 'Albizia was deliberately planted across Singapore in the 1970s for reforestation. It is a reminder that good intentions without ecological research can create lasting problems.'
  },
  {
    name: 'Lantana',
    img: 'images/lantana.jpg',
    type: 'invasive',
    clue: 'This prickly shrub has colourful flowers that change colour as they age — from yellow to orange to red. Despite looking pretty, its berries are toxic to children and it forms impenetrable thickets.',
    origin: 'Native to Central America',
    funfact: 'Lantana is still sold in some Singapore nurseries as an ornamental plant — meaning buyers are unknowingly purchasing and planting one of the world\'s worst invasives.'
  }
];

var spotRound = 0;
var spotScore = 0;
var spotAnswered = false;
var spotOrder = [];
var spotStreak = 0;
var spotTimerInterval = null;
var spotTimeLeft = 0;
var SPOT_TIME = 14;
var spotConfidencePending = null;

function startSpot() {
  spotRound = 0;
  spotScore = 0;
  spotAnswered = false;
  spotOrder = [];
  spotStreak = 0;
  clearInterval(spotTimerInterval);
  spotConfidencePending = null;

  for (var i = 0; i < spotPlants.length; i++) spotOrder.push(i);
  for (var si2 = spotOrder.length - 1; si2 > 0; si2--) {
    var ri2 = Math.floor(Math.random() * (si2 + 1));
    var tmp2 = spotOrder[si2]; spotOrder[si2] = spotOrder[ri2]; spotOrder[ri2] = tmp2;
  }

  // Inject streak + timer bar
  var spotHeader = document.querySelector('.spot-box .game-box-header');
  if (spotHeader && !document.getElementById('spotStreakEl')) {
    var sb = document.createElement('div');
    sb.id = 'spotStreakEl';
    sb.style.cssText = 'background:rgba(244,208,63,0.15);border:1px solid rgba(244,208,63,0.35);color:#f4d03f;font-weight:800;font-size:0.8rem;padding:0.3rem 0.75rem;border-radius:50px;';
    sb.textContent = 'Streak: 0';
    spotHeader.appendChild(sb);
  }

  if (!document.getElementById('spotTimerBar')) {
    var stWrap = document.createElement('div');
    stWrap.style.cssText = 'height:5px;background:rgba(45,106,79,0.1);border-radius:50px;margin-bottom:1rem;overflow:hidden;';
    var stFill = document.createElement('div');
    stFill.id = 'spotTimerBar';
    stFill.style.cssText = 'height:100%;background:linear-gradient(90deg,#e74c3c,#f4d03f,#52b788);border-radius:50px;transition:width 0.9s linear;width:100%;';
    stWrap.appendChild(stFill);
    var spotCard = document.querySelector('.spot-plant-card');
    if (spotCard) spotCard.parentNode.insertBefore(stWrap, spotCard);
  }

  // Inject confidence buttons if not present
  if (!document.getElementById('spotConfidenceRow')) {
    var confRow = document.createElement('div');
    confRow.id = 'spotConfidenceRow';
    confRow.style.cssText = 'display:none;text-align:center;margin-bottom:0.8rem;';
    confRow.innerHTML =
      '<p style="font-size:0.82rem;color:#3d5a47;margin-bottom:0.5rem;font-weight:700;">How confident are you? (doubles or halves your points!)</p>' +
      '<div style="display:flex;gap:0.6rem;justify-content:center;flex-wrap:wrap;">' +
        '<button onclick="setConfidence(0.5)" style="background:rgba(231,76,60,0.1);color:#e74c3c;border:2px solid rgba(231,76,60,0.3);padding:0.4rem 0.9rem;border-radius:50px;font-family:Nunito,sans-serif;font-weight:700;font-size:0.8rem;cursor:pointer;">Not Sure (x0.5)</button>' +
        '<button onclick="setConfidence(1)" style="background:rgba(244,208,63,0.12);color:#b7860a;border:2px solid rgba(244,208,63,0.3);padding:0.4rem 0.9rem;border-radius:50px;font-family:Nunito,sans-serif;font-weight:700;font-size:0.8rem;cursor:pointer;">Pretty Sure (x1)</button>' +
        '<button onclick="setConfidence(2)" style="background:rgba(82,183,136,0.12);color:#2d6a4f;border:2px solid rgba(82,183,136,0.3);padding:0.4rem 0.9rem;border-radius:50px;font-family:Nunito,sans-serif;font-weight:700;font-size:0.8rem;cursor:pointer;">Certain! (x2)</button>' +
      '</div>';
    var spotButtons = document.querySelector('.spot-buttons');
    if (spotButtons) spotButtons.parentNode.insertBefore(confRow, spotButtons);
  }

  // Inject fun fact area if not present
  if (!document.getElementById('spotFunFact')) {
    var ffBox = document.createElement('div');
    ffBox.id = 'spotFunFact';
    ffBox.style.cssText = 'display:none;background:rgba(244,208,63,0.1);border:1px solid rgba(244,208,63,0.28);border-radius:12px;padding:0.9rem 1rem;font-size:0.83rem;color:#3d5a47;line-height:1.5;margin-top:0.7rem;';
    var spotFb = document.getElementById('spotFeedback');
    if (spotFb) spotFb.parentNode.insertBefore(ffBox, spotFb.nextSibling);
  }

  document.getElementById('spotComplete').style.display = 'none';
  document.getElementById('spotPlayArea').style.display = 'block';
  renderSpotRound();
}

function setConfidence(mult) {
  spotConfidencePending = mult;
  var confRow = document.getElementById('spotConfidenceRow');
  if (confRow) confRow.style.display = 'none';
  var spotBtns = document.querySelector('.spot-buttons');
  if (spotBtns) spotBtns.style.display = 'flex';
  var label = mult === 2 ? 'CERTAIN' : mult === 1 ? 'PRETTY SURE' : 'NOT SURE';
  showToast('Confidence set: ' + label + ' (x' + mult + ')', 1200);
}

function startSpotTimer() {
  clearInterval(spotTimerInterval);
  spotTimeLeft = SPOT_TIME;
  var bar = document.getElementById('spotTimerBar');
  if (bar) bar.style.width = '100%';

  spotTimerInterval = setInterval(function () {
    spotTimeLeft--;
    var pct = (spotTimeLeft / SPOT_TIME) * 100;
    var bar2 = document.getElementById('spotTimerBar');
    if (bar2) bar2.style.width = pct + '%';
    if (spotTimeLeft <= 0) {
      clearInterval(spotTimerInterval);
      if (!spotAnswered) {
        spotAnswered = true;
        spotStreak = 0;
        updateSpotStreak();
        var plant = spotPlants[spotOrder[spotRound]];
        document.getElementById('spotPlantOrigin').textContent = plant.origin;
        var fb = document.getElementById('spotFeedback');
        fb.className = 'spot-feedback spot-wrong';
        fb.textContent = 'Time\'s up! ' + plant.name + ' is ' + (plant.type === 'invasive' ? 'an INVASIVE species' : 'NATIVE to Singapore') + '.';
        fb.style.display = 'block';
        showFunFact(plant.funfact);
        var spotBtns = document.querySelectorAll('.spot-native-btn, .spot-invasive-btn');
        for (var bi = 0; bi < spotBtns.length; bi++) spotBtns[bi].disabled = true;
        var confRow = document.getElementById('spotConfidenceRow');
        if (confRow) confRow.style.display = 'none';
        setTimeout(advanceSpotRound, 2800);
      }
    }
  }, 1000);
}

function updateSpotStreak() {
  var el = document.getElementById('spotStreakEl');
  if (el) el.textContent = 'Streak: ' + spotStreak;
}

function showFunFact(fact) {
  var ffBox = document.getElementById('spotFunFact');
  if (ffBox) {
    ffBox.textContent = 'Did you know? ' + fact;
    ffBox.style.display = 'block';
  }
}

function renderSpotRound() {
  spotAnswered = false;
  spotConfidencePending = null;

  var plant = spotPlants[spotOrder[spotRound]];
  document.getElementById('spotRoundNum').textContent = spotRound + 1;
  document.getElementById('spotPts').textContent = spotScore;

  var img = document.getElementById('spotPlantImg');
  img.src = plant.img;
  img.style.display = 'block';
  document.getElementById('spotPlantName').textContent = plant.name;
  document.getElementById('spotPlantClue').textContent = plant.clue;
  document.getElementById('spotPlantOrigin').textContent = '';

  var fb = document.getElementById('spotFeedback');
  fb.style.display = 'none';
  fb.className = 'spot-feedback';

  var ffBox = document.getElementById('spotFunFact');
  if (ffBox) ffBox.style.display = 'none';

  var btns = document.querySelectorAll('.spot-native-btn, .spot-invasive-btn');
  for (var bi = 0; bi < btns.length; bi++) btns[bi].disabled = false;

  // Show confidence selector first, hide answer buttons until confidence chosen
  var confRow = document.getElementById('spotConfidenceRow');
  var spotButtonsEl = document.querySelector('.spot-buttons');
  if (confRow) confRow.style.display = 'block';
  if (spotButtonsEl) spotButtonsEl.style.display = 'none';

  startSpotTimer();
}

function answerSpot(answer) {
  if (spotAnswered) return;
  // If confidence not yet set, default to x1
  if (spotConfidencePending === null) spotConfidencePending = 1;
  spotAnswered = true;
  clearInterval(spotTimerInterval);

  var plant = spotPlants[spotOrder[spotRound]];
  document.getElementById('spotPlantOrigin').textContent = plant.origin;

  var btns = document.querySelectorAll('.spot-native-btn, .spot-invasive-btn');
  for (var bi = 0; bi < btns.length; bi++) btns[bi].disabled = true;

  var fb = document.getElementById('spotFeedback');

  if (answer === plant.type) {
    spotStreak++;
    updateSpotStreak();
    var basePoints = 10 + (spotTimeLeft >= 8 ? 5 : 0) + (spotStreak >= 3 ? 5 : 0);
    var finalPoints = Math.round(basePoints * spotConfidencePending);
    spotScore += finalPoints;
    document.getElementById('spotPts').textContent = spotScore;
    fb.className = 'spot-feedback spot-correct';
    fb.innerHTML = '<strong>Correct! +' + finalPoints + ' pts</strong>' +
      (spotStreak >= 3 ? ' — Streak x' + spotStreak + '!' : '') +
      (spotConfidencePending === 2 ? ' Confidence bonus!' : '') +
      '<br>' + plant.name + ' is ' + (plant.type === 'invasive' ? 'an INVASIVE species.' : 'NATIVE to Singapore.');
    showToast('Correct! +' + finalPoints + ' pts', 1500);
  } else {
    spotStreak = 0;
    updateSpotStreak();
    var lostPoints = Math.round(5 * spotConfidencePending);
    spotScore = Math.max(0, spotScore - lostPoints);
    document.getElementById('spotPts').textContent = spotScore;
    fb.className = 'spot-feedback spot-wrong';
    fb.innerHTML = '<strong>Wrong' + (spotConfidencePending === 2 ? ' — and you were so sure!' : '') + ' -' + lostPoints + ' pts</strong><br>' +
      plant.name + ' is actually ' + (plant.type === 'invasive' ? 'an INVASIVE species.' : 'NATIVE to Singapore.');
    showToast('Wrong! -' + lostPoints + ' pts', 1500);
  }

  fb.style.display = 'block';
  showFunFact(plant.funfact);

  var confRow2 = document.getElementById('spotConfidenceRow');
  if (confRow2) confRow2.style.display = 'none';

  setTimeout(advanceSpotRound, 2800);
}

function advanceSpotRound() {
  spotRound++;
  if (spotRound >= 10) {
    document.getElementById('spotPlayArea').style.display = 'none';
    document.getElementById('spotComplete').style.display = 'block';
    document.getElementById('spotFinalScore').textContent = spotScore;
    if (spotScore > gameScores.spot) gameScores.spot = spotScore;
    updateAllScores();
    showToast('Round done! ' + spotScore + ' pts!', 3000);
  } else {
    renderSpotRound();
  }
}

// ============================================================
// NEW GAME: INVASION CHAIN — REWORKED ENTIRELY
// Students must sort 8 events into the correct
// chronological order showing how ONE invasive plant
// (Mile-a-Minute) devastates a Singapore forest.
// They drag or click-to-select then place steps in order.
// Scoring: 10 pts per correct position, bonus for full order.
// ============================================================
var chainScenarios = [
  {
    title: 'The Mile-a-Minute Invasion Timeline',
    intro: 'Put these 8 events in the correct order to show how Mile-a-Minute takes over a patch of Bukit Timah Forest. Click a card then click a slot to place it.',
    events: [
      { id: 'a', text: 'Contaminated grass seed is imported and spills at a construction site near Bukit Timah.' },
      { id: 'b', text: 'A single Mile-a-Minute seedling germinates in disturbed soil at the forest edge.' },
      { id: 'c', text: 'The vine begins climbing over native shrubs, growing up to 8cm per day.' },
      { id: 'd', text: 'A dense green blanket forms over an entire patch of forest floor, blocking all light.' },
      { id: 'e', text: 'Native trees begin to die beneath the canopy, unable to photosynthesise.' },
      { id: 'f', text: 'Wind carries lightweight Mikania seeds into adjacent intact forest, starting new patches.' },
      { id: 'g', text: 'Biodiversity in the invaded patch collapses — native insects, birds, and plants disappear.' },
      { id: 'h', text: 'NParks mobilises volunteer teams for manual cutting over multiple seasons.' }
    ],
    order: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  },
  {
    title: 'Water Hyacinth Invades the Reservoir',
    intro: 'Put these 8 events in order to show how Water Hyacinth turns a clean Singapore reservoir into an environmental crisis.',
    events: [
      { id: 'a', text: 'A hobbyist buys Water Hyacinth from a garden centre as a decorative pond plant.' },
      { id: 'b', text: 'The plant outgrows the home pond and is dumped into a nearby canal.' },
      { id: 'c', text: 'The plant doubles its coverage in two weeks through vegetative reproduction.' },
      { id: 'd', text: 'Flood rains wash a mass of plants into Kranji Reservoir.' },
      { id: 'e', text: 'A thick floating mat blocks sunlight — submerged aquatic plants begin to die.' },
      { id: 'f', text: 'Oxygen levels drop and fish begin suffocating beneath the mat.' },
      { id: 'g', text: 'Stagnant water beneath the mat becomes a prime Aedes mosquito breeding site.' },
      { id: 'h', text: 'PUB deploys mechanical harvesting boats to begin costly removal operations.' }
    ],
    order: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  },
  {
    title: 'The Invasion Meltdown: Senduduk Bulu + Javan Myna',
    intro: 'Order these 8 events to reveal how two invasive species team up to devastate Singapore\'s forest understorey.',
    events: [
      { id: 'a', text: 'Senduduk Bulu is introduced to Singapore — possibly through the ornamental plant trade.' },
      { id: 'b', text: 'The Javan Myna, another invasive species, spreads across Singapore\'s urban areas.' },
      { id: 'c', text: 'Javan Mynas discover Senduduk Bulu berries and begin eating them in large quantities.' },
      { id: 'd', text: 'Myna droppings deposit viable Senduduk Bulu seeds deep into Bukit Timah forest.' },
      { id: 'e', text: 'Senduduk Bulu thrives in the shade — unlike most invasives it needs no forest gap to establish.' },
      { id: 'f', text: 'A dense thicket of Senduduk Bulu fills the understorey, preventing native seedlings from growing.' },
      { id: 'g', text: 'Without understorey regeneration, the forest cannot replace its canopy trees when they die.' },
      { id: 'h', text: 'Researchers identify this as an invasion meltdown — two invasives amplifying each other\'s spread.' }
    ],
    order: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  }
];

var chainCurrentScenario = 0;
var chainPlaced = [];        // array of event ids placed in slots (8 slots)
var chainSelectedCard = null;
var chainScore = 0;
var chainRound = 0;

function initChain() {
  chainRound = 0;
  chainScore = 0;
  chainSelectedCard = null;
  renderChainRound();
}

function renderChainRound() {
  var scenario = chainScenarios[chainRound % chainScenarios.length];
  chainPlaced = new Array(8).fill(null);
  chainSelectedCard = null;

  var container = document.getElementById('game-chain');
  if (!container) return;

  container.innerHTML =
    '<div class="game-box chain-box" style="border-top:5px solid #e74c3c;">' +
      '<div class="game-box-header">' +
        '<h2 style="font-family:Fredoka,sans-serif;color:#1a3a2a;font-size:1.4rem;">Invasion Chain</h2>' +
        '<div class="game-stat">Round <span id="chainRoundNum">' + (chainRound + 1) + '</span>/' + chainScenarios.length + ' &nbsp;|&nbsp; Score: <span id="chainScoreDisplay">' + chainScore + '</span></div>' +
      '</div>' +
      '<div style="background:rgba(231,76,60,0.06);border-radius:14px;padding:1.2rem 1.4rem;margin-bottom:1.2rem;border-left:4px solid #e74c3c;">' +
        '<h3 style="font-family:Fredoka,sans-serif;color:#1a3a2a;margin-bottom:0.4rem;font-size:1.1rem;">' + scenario.title + '</h3>' +
        '<p style="font-size:0.86rem;color:#3d5a47;line-height:1.6;">' + scenario.intro + '</p>' +
      '</div>' +

      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.4rem;">' +

        // Left: shuffled event cards
        '<div>' +
          '<p style="font-size:0.75rem;font-weight:800;color:#3d5a47;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:0.7rem;">Event Cards — click one to select</p>' +
          '<div id="chainCards" style="display:flex;flex-direction:column;gap:0.5rem;"></div>' +
        '</div>' +

        // Right: numbered placement slots
        '<div>' +
          '<p style="font-size:0.75rem;font-weight:800;color:#3d5a47;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:0.7rem;">Timeline — click a slot to place selected card</p>' +
          '<div id="chainSlots" style="display:flex;flex-direction:column;gap:0.5rem;"></div>' +
        '</div>' +

      '</div>' +

      '<div style="text-align:center;margin-top:1.4rem;">' +
        '<button onclick="checkChain()" style="background:linear-gradient(135deg,#2d6a4f,#1a3a2a);color:#fff;border:none;padding:0.75rem 2rem;border-radius:50px;font-family:Nunito,sans-serif;font-weight:800;font-size:0.95rem;cursor:pointer;">Check My Order</button>' +
        '&nbsp;&nbsp;' +
        '<button onclick="clearChain()" style="background:rgba(231,76,60,0.1);color:#e74c3c;border:2px solid rgba(231,76,60,0.3);padding:0.75rem 1.5rem;border-radius:50px;font-family:Nunito,sans-serif;font-weight:700;font-size:0.9rem;cursor:pointer;">Clear All</button>' +
      '</div>' +

      '<div id="chainFeedback" style="display:none;margin-top:1.2rem;border-radius:14px;padding:1.2rem 1.4rem;"></div>' +

      '<div id="chainComplete" style="display:none;text-align:center;padding:2rem 1rem;border-top:2px solid rgba(45,106,79,0.1);margin-top:1.2rem;">' +
        '<div style="width:60px;height:60px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f4d03f,#c8860a);box-shadow:0 8px 24px rgba(244,208,63,0.4);margin:0 auto 1rem;"></div>' +
        '<h3 style="font-family:Fredoka,sans-serif;font-size:1.7rem;color:#1a3a2a;margin-bottom:0.5rem;">Scenario Complete!</h3>' +
        '<p id="chainCompleteMsg" style="color:#3d5a47;margin-bottom:1.4rem;"></p>' +
        '<button onclick="nextChainRound()" style="background:linear-gradient(135deg,#52b788,#74c69d);color:#fff;border:none;padding:0.8rem 2rem;border-radius:50px;font-family:Nunito,sans-serif;font-weight:800;font-size:0.95rem;cursor:pointer;box-shadow:0 4px 18px rgba(82,183,136,0.4);">Next Scenario</button>' +
      '</div>' +
    '</div>';

  // Build shuffled event cards
  var events = scenario.events.slice();
  for (var si = events.length - 1; si > 0; si--) {
    var ri = Math.floor(Math.random() * (si + 1));
    var tmp = events[si]; events[si] = events[ri]; events[ri] = tmp;
  }

  var cardsEl = document.getElementById('chainCards');
  for (var ci = 0; ci < events.length; ci++) {
    (function (ev) {
      var card = document.createElement('div');
      card.id = 'chain-card-' + ev.id;
      card.dataset.id = ev.id;
      card.style.cssText =
        'background:#fff;border:2px solid rgba(45,106,79,0.15);border-radius:12px;padding:0.65rem 0.9rem;' +
        'font-size:0.8rem;color:#1a2b1e;line-height:1.45;cursor:pointer;transition:all 0.18s;';
      card.textContent = ev.text;
      card.addEventListener('click', function () { selectChainCard(ev.id); });
      cardsEl.appendChild(card);
    })(events[ci]);
  }

  // Build numbered slots
  var slotsEl = document.getElementById('chainSlots');
  for (var si2 = 0; si2 < 8; si2++) {
    (function (slotIdx) {
      var slot = document.createElement('div');
      slot.id = 'chain-slot-' + slotIdx;
      slot.style.cssText =
        'min-height:42px;border:2px dashed rgba(45,106,79,0.2);border-radius:12px;padding:0.55rem 0.9rem;' +
        'font-size:0.78rem;color:#3d5a47;line-height:1.4;cursor:pointer;transition:all 0.18s;display:flex;align-items:center;gap:0.5rem;';
      slot.innerHTML =
        '<span style="font-family:Fredoka,sans-serif;font-size:1rem;font-weight:700;color:rgba(45,106,79,0.35);flex-shrink:0;">' + (slotIdx + 1) + '</span>' +
        '<span id="chain-slot-text-' + slotIdx + '" style="color:#b0c4b8;font-style:italic;">Empty slot</span>';
      slot.addEventListener('click', function () { placeInChainSlot(slotIdx); });
      slotsEl.appendChild(slot);
    })(si2);
  }
}

function selectChainCard(id) {
  // Deselect previous
  if (chainSelectedCard) {
    var prev = document.getElementById('chain-card-' + chainSelectedCard);
    if (prev) {
      prev.style.border = '2px solid rgba(45,106,79,0.15)';
      prev.style.background = '#fff';
    }
  }

  // Check if card is already placed — if so, lift it back
  var alreadyInSlot = -1;
  for (var i = 0; i < chainPlaced.length; i++) {
    if (chainPlaced[i] === id) { alreadyInSlot = i; break; }
  }

  if (alreadyInSlot !== -1) {
    chainPlaced[alreadyInSlot] = null;
    var slotTextEl = document.getElementById('chain-slot-text-' + alreadyInSlot);
    if (slotTextEl) slotTextEl.innerHTML = '<span style="color:#b0c4b8;font-style:italic;">Empty slot</span>';
    var slotEl2 = document.getElementById('chain-slot-' + alreadyInSlot);
    if (slotEl2) slotEl2.style.borderStyle = 'dashed';
    var cardEl = document.getElementById('chain-card-' + id);
    if (cardEl) cardEl.style.opacity = '1';
  }

  chainSelectedCard = id;
  var selected = document.getElementById('chain-card-' + id);
  if (selected) {
    selected.style.border = '2px solid #52b788';
    selected.style.background = 'rgba(82,183,136,0.08)';
  }
}

function placeInChainSlot(slotIdx) {
  if (!chainSelectedCard) {
    showToast('Select an event card first!', 1500);
    return;
  }

  // Remove from previous slot if it was there
  for (var i = 0; i < chainPlaced.length; i++) {
    if (chainPlaced[i] === chainSelectedCard && i !== slotIdx) {
      chainPlaced[i] = null;
      var old = document.getElementById('chain-slot-text-' + i);
      if (old) old.innerHTML = '<span style="color:#b0c4b8;font-style:italic;">Empty slot</span>';
      var oldSlot = document.getElementById('chain-slot-' + i);
      if (oldSlot) oldSlot.style.borderStyle = 'dashed';
    }
  }

  // If slot already occupied, swap
  if (chainPlaced[slotIdx] !== null) {
    var displaced = chainPlaced[slotIdx];
    var displacedCard = document.getElementById('chain-card-' + displaced);
    if (displacedCard) displacedCard.style.opacity = '1';
  }

  chainPlaced[slotIdx] = chainSelectedCard;

  // Get event text
  var scenario = chainScenarios[chainRound % chainScenarios.length];
  var evText = '';
  for (var ei = 0; ei < scenario.events.length; ei++) {
    if (scenario.events[ei].id === chainSelectedCard) { evText = scenario.events[ei].text; break; }
  }

  var slotText = document.getElementById('chain-slot-text-' + slotIdx);
  if (slotText) slotText.innerHTML = '<span style="color:#1a2b1e;">' + evText + '</span>';
  var slotEl = document.getElementById('chain-slot-' + slotIdx);
  if (slotEl) slotEl.style.borderStyle = 'solid';

  // Dim the placed card
  var placedCard = document.getElementById('chain-card-' + chainSelectedCard);
  if (placedCard) {
    placedCard.style.border = '2px solid rgba(45,106,79,0.15)';
    placedCard.style.background = 'rgba(45,106,79,0.04)';
    placedCard.style.opacity = '0.45';
  }

  chainSelectedCard = null;
}

function clearChain() {
  chainPlaced = new Array(8).fill(null);
  chainSelectedCard = null;
  for (var i = 0; i < 8; i++) {
    var slotText = document.getElementById('chain-slot-text-' + i);
    if (slotText) slotText.innerHTML = '<span style="color:#b0c4b8;font-style:italic;">Empty slot</span>';
    var slotEl = document.getElementById('chain-slot-' + i);
    if (slotEl) slotEl.style.borderStyle = 'dashed';
  }
  var scenario = chainScenarios[chainRound % chainScenarios.length];
  for (var ei = 0; ei < scenario.events.length; ei++) {
    var card = document.getElementById('chain-card-' + scenario.events[ei].id);
    if (card) {
      card.style.opacity = '1';
      card.style.border = '2px solid rgba(45,106,79,0.15)';
      card.style.background = '#fff';
    }
  }
}

function checkChain() {
  var scenario = chainScenarios[chainRound % chainScenarios.length];

  // Check all slots filled
  for (var i = 0; i < 8; i++) {
    if (chainPlaced[i] === null) {
      showToast('Fill all 8 slots before checking!', 1800);
      return;
    }
  }

  var correct = 0;
  var resultsHtml = '<div style="display:flex;flex-direction:column;gap:0.5rem;">';
  for (var si = 0; si < 8; si++) {
    var isCorrect = chainPlaced[si] === scenario.order[si];
    if (isCorrect) correct++;
    var evText = '';
    for (var ei = 0; ei < scenario.events.length; ei++) {
      if (scenario.events[ei].id === chainPlaced[si]) { evText = scenario.events[ei].text; break; }
    }
    resultsHtml +=
      '<div style="display:flex;align-items:flex-start;gap:0.6rem;background:' + (isCorrect ? 'rgba(39,174,96,0.08)' : 'rgba(231,76,60,0.06)') + ';border-left:3px solid ' + (isCorrect ? '#27ae60' : '#e74c3c') + ';border-radius:0 10px 10px 0;padding:0.5rem 0.8rem;">' +
        '<span style="font-family:Fredoka,sans-serif;font-weight:700;font-size:0.9rem;color:' + (isCorrect ? '#27ae60' : '#e74c3c') + ';flex-shrink:0;min-width:20px;">' + (si + 1) + '</span>' +
        '<span style="font-size:0.78rem;color:#3d5a47;line-height:1.4;">' + evText + '</span>' +
        '<span style="margin-left:auto;flex-shrink:0;font-weight:800;font-size:0.75rem;color:' + (isCorrect ? '#27ae60' : '#e74c3c') + ';">' + (isCorrect ? '+10' : '✗') + '</span>' +
      '</div>';
  }
  resultsHtml += '</div>';

  var roundPts = correct * 10 + (correct === 8 ? 30 : 0);
  chainScore += roundPts;
  document.getElementById('chainScoreDisplay').textContent = chainScore;

  var fb = document.getElementById('chainFeedback');
  if (fb) {
    fb.style.display = 'block';
    fb.style.background = correct === 8 ? 'rgba(39,174,96,0.08)' : 'rgba(45,106,79,0.05)';
    fb.style.border = correct === 8 ? '1px solid rgba(39,174,96,0.25)' : '1px solid rgba(45,106,79,0.12)';
    var gradeMsg = correct === 8 ? 'Perfect! +30 bonus pts!' : correct >= 6 ? 'Great!' : correct >= 4 ? 'Not bad — study the chain again.' : 'Keep learning the sequence!';
    fb.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.9rem;flex-wrap:wrap;gap:0.5rem;">' +
        '<strong style="font-family:Fredoka,sans-serif;font-size:1rem;color:#1a3a2a;">' + correct + '/8 correct — ' + gradeMsg + ' +' + roundPts + ' pts</strong>' +
        '<button onclick="nextChainRound()" style="background:linear-gradient(135deg,#52b788,#74c69d);color:#fff;border:none;padding:0.5rem 1.2rem;border-radius:50px;font-family:Nunito,sans-serif;font-weight:800;font-size:0.85rem;cursor:pointer;">' +
          (chainRound + 1 < chainScenarios.length ? 'Next Scenario' : 'See Final Score') +
        '</button>' +
      '</div>' +
      resultsHtml;
  }

  if (correct === 8) showToast('Perfect order! +' + roundPts + ' pts!', 2500);
  else showToast(correct + '/8 correct. +' + roundPts + ' pts', 2000);
}

function nextChainRound() {
  chainRound++;
  if (chainRound >= chainScenarios.length) {
    // Show final complete screen
    if (chainScore > gameScores.chain) gameScores.chain = chainScore;
    updateAllScores();

    var container = document.getElementById('game-chain');
    if (container) {
      container.innerHTML =
        '<div class="game-box chain-box" style="border-top:5px solid #e74c3c;text-align:center;padding:3rem 2rem;">' +
          '<div style="width:70px;height:70px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f4d03f,#c8860a);box-shadow:0 10px 30px rgba(244,208,63,0.5);margin:0 auto 1.2rem;"></div>' +
          '<h2 style="font-family:Fredoka,sans-serif;font-size:2rem;color:#1a3a2a;margin-bottom:0.5rem;">All Scenarios Complete!</h2>' +
          '<p style="color:#3d5a47;margin-bottom:0.5rem;font-size:1rem;">You scored <strong>' + chainScore + '</strong> points across ' + chainScenarios.length + ' invasion scenarios.</p>' +
          '<p style="color:#3d5a47;margin-bottom:1.5rem;font-size:0.9rem;">' +
            (chainScore >= 200 ? 'Outstanding! You understand how invasions unfold step by step — NParks would be proud.' :
             chainScore >= 140 ? 'Great work! Review the sequences you got wrong to master the full picture.' :
             'Good effort! Go back to the Learn section to strengthen your understanding of invasion sequences.') +
          '</p>' +
          '<button onclick="initChain()" style="background:linear-gradient(135deg,#52b788,#74c69d);color:#fff;border:none;padding:0.9rem 2.2rem;border-radius:50px;font-family:Nunito,sans-serif;font-weight:800;font-size:1rem;cursor:pointer;box-shadow:0 4px 18px rgba(82,183,136,0.4);">Play Again</button>' +
        '</div>';
    }
    showToast('Invasion Chain done! ' + chainScore + ' pts total!', 3000);
  } else {
    renderChainRound();
  }
}
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
    showToast('You are now a Singapore Plant Defender!', 3000);
  } else {
    completeMsg.style.display = 'none';
  }
  try { localStorage.setItem('pledge_sg4', JSON.stringify(states)); } catch (e) {}
}

function restorePledge() {
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem('pledge_sg4') || '[]'); } catch (e) {}
  var checkboxes = document.querySelectorAll('.pledge-list input[type="checkbox"]');
  for (var i = 0; i < checkboxes.length; i++) {
    if (saved[i]) checkboxes[i].checked = true;
  }
  if (checkboxes.length > 0) updatePledge();
}

// ============================================================
// INIT ON PAGE LOAD
// ============================================================
window.addEventListener('load', function () {
  updateProgress();
  updateAllScores();
  initQuiz();
  startMemory();
  startSpot();
  initChain();
});
