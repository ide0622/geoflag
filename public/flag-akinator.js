// Flag Akinator: asks single-shot questions using geodata.csv to guess the country
(function() {
  const startButton = document.getElementById('startFlagAkinator');
  const backButton = document.getElementById('flagAkinatorBack');
  const nextButton = document.getElementById('akinatorNext');
  const restartButton = document.getElementById('akinatorRestart');
  const yesButton = document.getElementById('akinatorYes');
  const probablyYesButton = document.getElementById('akinatorProbablyYes');
  const noButton = document.getElementById('akinatorNo');
  const probablyNoButton = document.getElementById('akinatorProbablyNo');
  const maybeButton = document.getElementById('akinatorMaybe');
  const confirmYesButton = document.getElementById('akinatorConfirmYes');
  const confirmNoButton = document.getElementById('akinatorConfirmNo');
  const questionEl = document.getElementById('akinatorQuestion');
  const statusEl = document.getElementById('akinatorStatus');
  const resultBox = document.getElementById('akinatorResult');
  const guessEl = document.getElementById('akinatorGuess');
  const guessDetailEl = document.getElementById('akinatorGuessDetail');
  const shortlistEl = document.getElementById('akinatorShortlist');
  const noticeEl = document.getElementById('akinatorNotice');
  const answerGrid = document.getElementById('akinatorAnswerGrid');
  const statsDisplay = document.getElementById('akinatorStatsDisplay');
  const statsCountryName = document.getElementById('statsCountryName');
  const statsContent = document.getElementById('statsContent');
  const statsBackButton = document.getElementById('akinatorStatsBack');

  const startScreen = document.getElementById('startScreen');
  const akinatorScreen = document.getElementById('flagAkinatorScreen');

  if (!startButton || !backButton || !questionEl) {
    return; // DOM not ready or screen missing
  }

  let countries = [];
  let candidates = [];
  let scoreMap = new Map();
  let asked = new Set();
  let currentQuestion = null;
  let awaitingConfirm = false;
  let currentGuess = null;
  let loading = false;
  let dataReady = false;

  const CSV_URL = 'geodata.csv';

  const QUESTION_BANK = [
    { id: 'region-asia', text: '地域はアジアですか？', predicate: c => c.region === 'Asia' },
    { id: 'region-europe', text: '地域はヨーロッパですか？', predicate: c => c.region === 'Europe' },
    { id: 'region-africa', text: '地域はアフリカですか？', predicate: c => c.region === 'Africa' },
    { id: 'region-americas', text: '地域はアメリカ大陸ですか？', predicate: c => c.region === 'Americas' },
    { id: 'region-oceania', text: '地域はオセアニアですか？', predicate: c => c.region === 'Oceania' },
    { id: 'population-gt-100', text: '人口は1億人より多いですか？', predicate: c => numberGuard(c.population) && c.population >= 100 },
    { id: 'population-lt-20', text: '人口は2千万人未満ですか？', predicate: c => numberGuard(c.population) && c.population < 20 },
    { id: 'area-gt-1000', text: '面積は100万km²より大きいですか？', predicate: c => numberGuard(c.area) && c.area >= 1000 },
    { id: 'internet-gt-90', text: 'インターネット普及率は90%以上ですか？', predicate: c => numberGuard(c.internet) && c.internet >= 90 },
    { id: 'temp-gt-20', text: '平均気温は20℃以上ですか？', predicate: c => numberGuard(c.avgTemp) && c.avgTemp >= 20 },
    { id: 'gdp-gt-1m', text: 'GDPは1,000,000（百万USD換算）以上ですか？', predicate: c => numberGuard(c.gdp) && c.gdp >= 1_000_000 },
    { id: 'happiness-gt-6', text: '幸福度は6以上ですか？', predicate: c => numberGuard(c.happiness) && c.happiness >= 6 }
  ];

  function numberGuard(v) {
    return typeof v === 'number' && Number.isFinite(v);
  }

  function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/);
    lines.shift(); // header
    return lines.map(line => {
      const cells = line.split(',');
      return {
        name: cells[0],
        flag: cells[1],
        code: cells[2],
        region: cells[4],
        subregion: cells[5],
        capital: cells[6],
        area: toNumber(cells[7]),
        population: toNumber(cells[8]),
        latitude: toNumber(cells[9]),
        longitude: toNumber(cells[10]),
        timezones: toNumber(cells[11]),
        languages: toNumber(cells[12]),
        borders: toNumber(cells[13]),
        continents: toNumber(cells[14]),
        currencies: toNumber(cells[15]),
        callingCode: cells[16],
        life: toNumber(cells[17]),
        gdp: toNumber(cells[18]),
        medals: toNumber(cells[19]),
        passport: toNumber(cells[20]),
        tourists: toNumber(cells[21]),
        rainfall: toNumber(cells[22]),
        elevation: toNumber(cells[23]),
        rice: toNumber(cells[24]),
        internet: toNumber(cells[25]),
        wheat: toNumber(cells[26]),
        avgTemp: toNumber(cells[27]),
        bigMac: toNumber(cells[28]),
        sleep: toNumber(cells[29]),
        heritage: toNumber(cells[30]),
        happiness: toNumber(cells[31])
      };
    });
  }

  function toNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  async function ensureDataLoaded() {
    if (dataReady || loading) return;
    loading = true;
    questionEl.textContent = 'データを読み込み中...';
    try {
      const res = await fetch(CSV_URL);
      const text = await res.text();
      countries = parseCsv(text);
      dataReady = true;
    } catch (err) {
      console.error('Failed to load geodata.csv', err);
      questionEl.textContent = 'データ読み込みに失敗しました。リロードしてください。';
    } finally {
      loading = false;
    }
  }

  function resetGame() {
    asked = new Set();
    candidates = countries.slice();
    scoreMap = new Map();
    for (const c of countries) scoreMap.set(c.code, 0);
    currentQuestion = null;
    awaitingConfirm = false;
    currentGuess = null;
    hideResult();
    updateStatus();
  }

  function hideResult() {
    resultBox.classList.add('hidden');
    shortlistEl.classList.add('hidden');
    guessEl.textContent = '';
    guessDetailEl.textContent = '';
    shortlistEl.innerHTML = '';
  }

  function pickNextQuestion() {
    // 候補が多い場合（50以上）はランダムに質問
    if (candidates.length >= 50) {
      const available = QUESTION_BANK.filter(q => !asked.has(q.id));
      if (available.length === 0) return null;
      return available[Math.floor(Math.random() * available.length)];
    }

    // 候補が絞れた場合（50未満）は分別性が高い質問を選ぶ
    let best = null;
    let bestScore = -1;
    for (const q of QUESTION_BANK) {
      if (asked.has(q.id)) continue;
      let yes = 0;
      let no = 0;
      for (const c of candidates) {
        const res = q.predicate(c);
        if (res) yes++; else no++;
      }
      if (yes === 0 || no === 0) continue; // 分割できない質問はスキップ
      // はい/いいえの分割がより均等な質問を選ぶ
      const score = Math.min(yes, no);
      if (score > bestScore) {
        bestScore = score;
        best = q;
      }
    }
    if (!best) {
      best = QUESTION_BANK.find(q => !asked.has(q.id)) || null;
    }
    return best;
  }

  function setQuestion(q) {
    currentQuestion = q;
    if (q) {
      asked.add(q.id);
      questionEl.textContent = q.text;
    } else {
      questionEl.textContent = 'これ以上質問がありません。結果を確認してください。';
    }
    updateStatus();
  }

  function updateStatus() {
    statusEl.textContent = `候補: ${candidates.length} カ国 (最有力を優先表示)`;
    if (candidates.length <= 3) {
      renderShortlist();
    } else {
      shortlistEl.classList.add('hidden');
    }
  }

  function renderShortlist() {
    shortlistEl.classList.remove('hidden');
    const top = [...candidates].slice(0, 5).map(c => {
      const s = scoreMap.get(c.code) ?? 0;
      return `<span class="font-semibold text-purple-800">${c.flag || ''} ${c.name} <span class="text-xs text-gray-500">(${s.toFixed(1)})</span></span>`;
    });
    shortlistEl.innerHTML = `候補が絞れました: ${top.join(' / ')}`;
  }

  function showGuessIfReady() {
    if (candidates.length === 0) return;
    const top = candidates[0];
    const topScore = scoreMap.get(top.code) ?? 0;
    const second = candidates[1];
    const secondScore = second ? (scoreMap.get(second.code) ?? 0) : -Infinity;
    const confident = candidates.length === 1 || (topScore - secondScore >= 2);
    if (!confident) return;

    awaitingConfirm = true;
    currentGuess = top;
    answerGrid.classList.add('hidden');
    resultBox.classList.remove('hidden');
    nextButton.classList.add('hidden');
    restartButton.classList.add('hidden');
    
    // 紫い質問セクションに確認メッセージを表示
    questionEl.textContent = `思い浮かべている国は「${top.flag || ''} ${top.name}」ですか？`;
    
    // 確認ボックスには国情報を表示
    guessEl.textContent = `${top.flag || ''} ${top.name}`;
    guessDetailEl.textContent = `地域: ${top.region || '-'} / 人口: ${safeNum(top.population)}百万人 / 平均気温: ${safeNum(top.avgTemp)}℃`;
  }

  function safeNum(v) {
    return numberGuard(v) ? v : '-';
  }

  function displayStats(country) {
    statsCountryName.textContent = `${country.flag || ''} ${country.name}`;
    const stats = [
      { label: '国旗', value: country.flag || 'N/A' },
      { label: '地域', value: country.region || 'N/A' },
      { label: 'サブ地域', value: country.subregion || 'N/A' },
      { label: '首都', value: country.capital || 'N/A' },
      { label: '人口', value: `${safeNum(country.population)} 百万人` },
      { label: '面積', value: `${safeNum(country.area)} km²` },
      { label: '緯度', value: safeNum(country.latitude) },
      { label: '経度', value: safeNum(country.longitude) },
      { label: 'タイムゾーン', value: safeNum(country.timezones) },
      { label: '言語数', value: safeNum(country.languages) },
      { label: '隣国数', value: safeNum(country.borders) },
      { label: '大陸数', value: safeNum(country.continents) },
      { label: '通貨種', value: safeNum(country.currencies) },
      { label: 'GDP', value: safeNum(country.gdp) },
      { label: '幸福度', value: safeNum(country.happiness) },
      { label: 'インターネット普及率', value: `${safeNum(country.internet)}%` },
      { label: '平均気温', value: `${safeNum(country.avgTemp)}℃` },
      { label: '平均寿命', value: safeNum(country.lifeExpectancy) }
    ];
    statsContent.innerHTML = stats
      .map(s => `<div><span class="font-semibold text-blue-800">${s.label}:</span> ${s.value}</div>`)
      .join('');
    answerGrid.classList.add('hidden');
    resultBox.classList.add('hidden');
    statsDisplay.classList.remove('hidden');
  }

  function hideAll() {
    answerGrid.classList.add('hidden');
    resultBox.classList.add('hidden');
    statsDisplay.classList.add('hidden');
    shortlistEl.classList.add('hidden');
  }

  function hideResult() {
    resultBox.classList.add('hidden');
    statsDisplay.classList.add('hidden');
    answerGrid.classList.add('hidden');
  }

  function applyAnswer(answer) {
    if (awaitingConfirm) return; // awaiting confirmation; ignore question answers
    if (!currentQuestion) return;
    const predicate = currentQuestion.predicate;
    const weight = {
      yes: { hit: 2, miss: -2 },
      probablyYes: { hit: 1, miss: -1 },
      maybe: { hit: 0.3, miss: -0.3 },
      probablyNo: { hit: -1, miss: 1 },
      no: { hit: -2, miss: 2 }
    }[answer];
    if (!weight) return;

    for (const c of countries) {
      const current = scoreMap.get(c.code) ?? 0;
      const hit = predicate(c);
      const delta = hit ? weight.hit : weight.miss;
      scoreMap.set(c.code, current + delta);
    }

    // トップ候補を残しつつ誤回答にも耐性を持たせる
    const sorted = [...countries].sort((a, b) => (scoreMap.get(b.code) ?? 0) - (scoreMap.get(a.code) ?? 0));
    const bestScore = scoreMap.get(sorted[0]?.code) ?? 0;
    const threshold = bestScore - 3; // 誤差許容幅
    candidates = sorted.filter(c => (scoreMap.get(c.code) ?? 0) >= threshold);

    updateStatus();
    showGuessIfReady();
  }

  function nextQuestion() {
    const q = pickNextQuestion();
    setQuestion(q);
    if (!q) {
      noticeEl.textContent = '質問が尽きました。結果を確認し、合わない場合はリスタートしてください。';
    } else {
      noticeEl.textContent = '最適な質問を選びました。回答してください。';
    }
  }

  function startFlow() {
    hideResult();
    resetGame();
    answerGrid.classList.remove('hidden');
    nextButton.classList.remove('hidden');
    restartButton.classList.remove('hidden');
    nextQuestion();
    startScreen.classList.add('hidden');
    akinatorScreen.classList.remove('hidden');
  }

  startButton.addEventListener('click', async () => {
    await ensureDataLoaded();
    if (!dataReady) return;
    startFlow();
  });

  backButton.addEventListener('click', () => {
    akinatorScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  });

  restartButton.addEventListener('click', () => {
    hideResult();
    resetGame();
    nextQuestion();
  });

  nextButton.addEventListener('click', () => {
    nextQuestion();
  });

  yesButton.addEventListener('click', () => {
    applyAnswer('yes');
    nextQuestion();
  });
  if (probablyYesButton) {
    probablyYesButton.addEventListener('click', () => {
      applyAnswer('probablyYes');
      nextQuestion();
    });
  }
  noButton.addEventListener('click', () => {
    applyAnswer('no');
    nextQuestion();
  });
  if (probablyNoButton) {
    probablyNoButton.addEventListener('click', () => {
      applyAnswer('probablyNo');
      nextQuestion();
    });
  }
  maybeButton.addEventListener('click', () => {
    applyAnswer('maybe');
    nextQuestion();
  });

  if (confirmYesButton && confirmNoButton) {
    confirmYesButton.addEventListener('click', () => {
      if (!currentGuess) return;
      displayStats(currentGuess);
      awaitingConfirm = false;
    });

    confirmNoButton.addEventListener('click', () => {
      if (!currentGuess) return;
      // ペナルティを与えて次の質問を続行
      const code = currentGuess.code;
      const current = scoreMap.get(code) ?? 0;
      scoreMap.set(code, current - 3);
      candidates = candidates.filter(c => c.code !== code);
      awaitingConfirm = false;
      currentGuess = null;
      resultBox.classList.add('hidden');
      answerGrid.classList.remove('hidden');
      nextButton.classList.remove('hidden');
      restartButton.classList.remove('hidden');
      updateStatus();
      nextQuestion();
    });
  }

  if (statsBackButton) {
    statsBackButton.addEventListener('click', () => {
      hideAll();
      resetGame();
      answerGrid.classList.remove('hidden');
      nextQuestion();
    });
  }
})();
