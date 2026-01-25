// データキャッシュ
let countriesData = [];
let gameState = {
  currentStat: '人口',
  difficulty: null,
  availableCountries: [],
  score: 0,
  totalRounds: 10,
  currentRound: 0,
  deckCountry: null,
  handCountry: null,
  answered: false
};

// 統計項目のマッピング
const statLabels = {
  '人口': '(百万人)',
  '面積': '(千km²)',
  'GDP': '(10億USD)',
  '平均寿命': '(年)',
  '世界遺産数': '(個)',
  'インターネット普及率': '(%)',
  '観光客数': '(千人)',
  '降水量': '(mm)'
};

// 国グループの定義（国旗バトルと同じ）
const COUNTRY_GROUPS = {
  easy: [
    "アメリカ合衆国", "カナダ", "メキシコ", 
    "ブラジル", "アルゼンチン",
    "イギリス", "フランス", "ドイツ", "イタリア", "スペイン","ロシア", "オランダ", "スウェーデン", "ポルトガル", "アイルランド",
    "中国", "日本", "韓国", "インド","インドネシア","パキスタン", "サウジアラビア", "トルコ", "イラン","イスラエル", 
    "エジプト", "南アフリカ", "ナイジェリア", "セネガル", "オーストラリア"
  ],
  normal: [
    "ベルギー", "スイス", "ノルウェー",
    "ポーランド", "ウクライナ", "チェコ", "ギリシャ",
    "ハンガリー", "フィンランド", "デンマーク", "ルーマニア",
    "ブルガリア", "セルビア", "クロアチア", "スロベニア", "スロバキア",
    "モロッコ", "アルジェリア", "チュニジア", "ガーナ", "コートジボワール",
    "ケニア", "エチオピア",
    "チリ", "コロンビア", "ペルー", "ウルグアイ", "ボリビア",
    "ドミニカ共和国", "パナマ", "コスタリカ",
    "マレーシア", "シンガポール", "スリランカ",
    "カザフスタン", "ウズベキスタン",
    "アゼルバイジャン", "ジョージア", "アルメニア",
    "ヨルダン", "オマーン", "カタール", "クウェート", "バーレーン", "アラブ首長国連邦",
    "ベトナム", "タイ", "フィリピン", "バングラデシュ", "ニュージーランド"
  ],
  hard: [
    "エストニア", "ラトビア", "リトアニア", "アルバニア", "北マケドニア",
    "モンテネグロ", "モルドバ", "ルクセンブルク", "キプロス",
    "タンザニア", "ウガンダ", "ルワンダ", "ザンビア", "ジンバブエ",
    "マラウイ", "モザンビーク", "ボツワナ", "ナミビア",
    "エルサルバドル", "ホンジュラス", "ニカラグア", "グアテマラ",
    "ネパール", "ミャンマー", "カンボジア", "モンゴル",
    "フィジー", "ソロモン諸島", "バヌアツ", "サモア", "トンガ",
    "スリナム", "ガイアナ", "ハイチ",
    "エクアドル", "パラグアイ",
    "ベナン", "トーゴ", "ガボン", "コンゴ共和国", "赤道ギニア", "カメルーン",
    "セーシェル", "モーリシャス",
    "ガンビア", "マリ", "ニジェール", "モーリタニア",
    "ジブチ", "エリトリア", "レソト", "ブルンジ"
  ],
  extreme: [
    "キリバス", "ツバル", "ナウル", "ミクロネシア連邦", "マーシャル諸島", "パラオ",
    "サントメ・プリンシペ", "カーボベルデ", "コモロ",
    "エスワティニ",
    "中央アフリカ共和国", "南スーダン", "チャド", "ブルキナファソ",
    "ギニア", "ギニアビサウ", "シエラレオネ", "リベリア",
    "西サハラ", "東ティモール", "ブルネイ", "モルディブ",
    "セントクリストファー・ネイビス", "セントルシア",
    "セントビンセントおよびグレナディーン諸島", "グレナダ", "ドミニカ国",
    "アンティグア・バーブーダ", "バルバドス", "トリニダード・トバゴ",
    "サンマリノ", "アンドラ", "モナコ", "リヒテンシュタイン", "バチカン市国",
    "コソボ", "パレスチナ", "ソマリア", "スーダン", "イエメン",
    "アフガニスタン", "タジキスタン",
    "アイスランド", "マルタ",
    "ブータン", "ラオス", "パプアニューギニア", "ベリーズ"
  ]
};

// CSV解析関数
function parseCSV(text) {
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const obj = {};
    const values = lines[i].split(',');
    
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j];
    }
    
    data.push(obj);
  }
  
  return data;
}

// 初期化
async function initGame() {
  try {
    const response = await fetch('geodata.csv');
    const csvText = await response.text();
    countriesData = parseCSV(csvText).filter(country => {
      // 必要なデータが揃っている国のみを選定
      return country['国名'] && 
             country['人口'] && 
             country['面積'] &&
             country['GDP'];
    });
    
    console.log(`${countriesData.length}国のデータを読み込みました`);
  } catch (error) {
    console.error('データの読み込みエラー:', error);
  }
}

// ランダムに異なる2つの国を選ぶ
function getRandomCountries() {
  let deck, hand;
  
  do {
    const randomIndex1 = Math.floor(Math.random() * gameState.availableCountries.length);
    const randomIndex2 = Math.floor(Math.random() * gameState.availableCountries.length);
    
    deck = gameState.availableCountries[randomIndex1];
    hand = gameState.availableCountries[randomIndex2];
  } while (deck === hand);
  
  return { deck, hand };
}

// 統計値を取得
function getStatValue(country, stat) {
  const value = country[stat];
  return value ? parseFloat(value) : null;
}

// ゲーム開始
function startGame(difficulty) {
  const selectedStat = document.getElementById('statSelect').value;
  gameState.currentStat = selectedStat;
  gameState.difficulty = difficulty;
  gameState.score = 0;
  gameState.currentRound = 0;
  
  // 難易度に応じた国リストを設定
  const difficultyCountries = COUNTRY_GROUPS[difficulty] || [];
  gameState.availableCountries = countriesData.filter(country => 
    difficultyCountries.includes(country['国名'])
  );
  
  if (gameState.availableCountries.length === 0) {
    alert('選択した難易度には利用可能な国がありません');
    return;
  }
  
  document.getElementById('highlowStartScreen').classList.add('hidden');
  document.getElementById('highlowGameScreen').classList.remove('hidden');
  document.getElementById('highlowGameOverScreen').classList.add('hidden');
  
  document.getElementById('statNameDisplay').textContent = selectedStat;
  
  nextRound();
}

// 次のラウンドへ
function nextRound() {
  gameState.currentRound++;
  gameState.answered = false;
  
  // ゲーム終了判定
  if (gameState.currentRound > gameState.totalRounds) {
    endGame();
    return;
  }
  
  // 新しい国を選ぶ
  const { deck, hand } = getRandomCountries();
  gameState.deckCountry = deck;
  gameState.handCountry = hand;
  
  // UI更新
  document.getElementById('scoreDisplay').textContent = gameState.score;
  document.getElementById('totalDisplay').textContent = gameState.totalRounds;
  document.getElementById('deckCountry').textContent = deck['国旗'] || '🏳️';
  document.getElementById('deckCountryName').textContent = deck['国名'];
  document.getElementById('handCountry').textContent = hand['国旗'] || '🏳️';
  document.getElementById('handCountryName').textContent = hand['国名'];
  
  const deckValue = getStatValue(deck, gameState.currentStat);
  document.getElementById('deckValue').textContent = formatValue(deckValue, gameState.currentStat);
  document.getElementById('deckLabel').textContent = gameState.currentStat + ' ' + statLabels[gameState.currentStat];
  
  // 結果コンテナを隠す
  document.getElementById('resultContainer').classList.add('hidden');
  
  // 結果表示をリセット
  document.getElementById('resultMessage').textContent = '';
  document.getElementById('resultDetails').textContent = '';
  
  // ボタンを有効化
  document.getElementById('highBtn').disabled = false;
  document.getElementById('lowBtn').disabled = false;
  document.getElementById('highBtn').style.opacity = '1';
  document.getElementById('lowBtn').style.opacity = '1';
}

// 値をフォーマット
function formatValue(value, stat) {
  if (value === null || value === undefined) return 'N/A';
  
  if (stat === 'GDP') {
    return (value / 1000).toFixed(1);
  } else if (stat === 'インターネット普及率') {
    return value.toFixed(1) + '%';
  } else if (stat === '平均寿命') {
    return value.toFixed(1);
  } else if (stat === '人口') {
    return (value).toFixed(1);
  } else {
    return value.toFixed(0);
  }
}

// 答え判定
function checkAnswer(isHigh) {
  if (gameState.answered) return;
  gameState.answered = true;
  
  const deckValue = getStatValue(gameState.deckCountry, gameState.currentStat);
  const handValue = getStatValue(gameState.handCountry, gameState.currentStat);
  
  const isCorrect = (isHigh && handValue > deckValue) || (!isHigh && handValue < deckValue);
  
  // 手札の値を表示
  document.getElementById('deckCountry').parentElement.classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
  
  const handCard = document.getElementById('handCountry').parentElement;
  const handValueElement = document.createElement('div');
  handValueElement.className = 'stat-value';
  handValueElement.textContent = formatValue(handValue, gameState.currentStat);
  const handLabel = document.createElement('div');
  handLabel.className = 'stat-label';
  handLabel.textContent = gameState.currentStat + ' ' + statLabels[gameState.currentStat];
  
  handCard.innerHTML = `
    <div class="text-9xl" id="handCountry">${gameState.handCountry['国旗'] || '🏳️'}</div>
    <p class="text-lg font-semibold text-gray-800 mb-4" id="handCountryName">${gameState.handCountry['国名']}</p>
  `;
  handCard.appendChild(handValueElement);
  handCard.appendChild(handLabel);
  
  if (isCorrect) {
    gameState.score++;
    document.getElementById('scoreDisplay').textContent = gameState.score;
    document.getElementById('resultMessage').innerHTML = '<span class="text-green-600">正解！</span>';
  } else {
    document.getElementById('resultMessage').innerHTML = '<span class="text-red-600">不正解</span>';
  }
  
  document.getElementById('resultDetails').innerHTML = `
    <p class="mb-2"><strong>${gameState.deckCountry['国名']}</strong>: ${formatValue(deckValue, gameState.currentStat)}</p>
    <p><strong>${gameState.handCountry['国名']}</strong>: ${formatValue(handValue, gameState.currentStat)}</p>
  `;
  
  document.getElementById('resultContainer').classList.remove('hidden');
  
  // ボタンを無効化
  document.getElementById('highBtn').disabled = true;
  document.getElementById('lowBtn').disabled = true;
  document.getElementById('highBtn').style.opacity = '0.5';
  document.getElementById('lowBtn').style.opacity = '0.5';
}

// ゲーム終了
function endGame() {
  document.getElementById('highlowGameScreen').classList.add('hidden');
  document.getElementById('highlowGameOverScreen').classList.remove('hidden');
  
  const score = gameState.score;
  document.getElementById('finalScore').textContent = score;
  
  let evaluation = '';
  if (score === 10) {
    evaluation = '完璧です！地理の達人ですね！';
  } else if (score >= 8) {
    evaluation = '素晴らしい！かなり知識があります';
  } else if (score >= 6) {
    evaluation = 'まあまあです。もう一度チャレンジしてみましょう';
  } else if (score >= 4) {
    evaluation = '頑張れば上達します。もう一度トライ！';
  } else {
    evaluation = 'もっと統計情報を学んでみましょう';
  }
  
  document.getElementById('resultEvaluation').textContent = evaluation;
}

// イベントリスナー設定
document.addEventListener('DOMContentLoaded', async () => {
  await initGame();
  
  // スタート画面 - 難易度選択
  const difficultyBtns = document.querySelectorAll('.difficultyBtn');
  let selectedDifficulty = null;
  
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyBtns.forEach(b => b.classList.remove('ring-4', 'ring-yellow-400'));
      btn.classList.add('ring-4', 'ring-yellow-400');
      selectedDifficulty = btn.getAttribute('data-difficulty');
      document.getElementById('selectedDifficulty').textContent = `Level${['easy', 'normal', 'hard', 'extreme'].indexOf(selectedDifficulty) + 1}`;
      
      // スタートボタンを有効化
      document.getElementById('startHighlowBtn').disabled = false;
      document.getElementById('startHighlowBtn').classList.remove('bg-gray-400');
      document.getElementById('startHighlowBtn').classList.add('bg-orange-600', 'hover:bg-orange-700');
    });
  });
  
  // スタートボタン
  document.getElementById('startHighlowBtn').addEventListener('click', () => {
    if (selectedDifficulty) {
      startGame(selectedDifficulty);
    }
  });
  
  document.getElementById('backToMain').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  
  // ゲーム画面
  document.getElementById('highBtn').addEventListener('click', () => {
    checkAnswer(true);
  });
  
  document.getElementById('lowBtn').addEventListener('click', () => {
    checkAnswer(false);
  });
  
  document.getElementById('nextBtn').addEventListener('click', nextRound);
  
  document.getElementById('quitGame').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  
  // ゲームオーバー画面
  document.getElementById('restartBtn').addEventListener('click', () => {
    document.getElementById('highlowStartScreen').classList.remove('hidden');
    document.getElementById('highlowGameScreen').classList.add('hidden');
    document.getElementById('highlowGameOverScreen').classList.add('hidden');
    
    // 難易度ボタンをリセット
    document.querySelectorAll('.difficultyBtn').forEach(b => b.classList.remove('ring-4', 'ring-yellow-400'));
    document.getElementById('selectedDifficulty').textContent = '未選択';
    document.getElementById('startHighlowBtn').disabled = true;
    document.getElementById('startHighlowBtn').classList.add('bg-gray-400');
    document.getElementById('startHighlowBtn').classList.remove('bg-orange-600', 'hover:bg-orange-700');
  });
  
  document.getElementById('backToMainFromGameOver').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});
