// ===== High & Low ゲーム =====

// 国旗データと統計情報
const HIGHLOW_COUNTRIES = [
  { name: "日本", flag: "🇯🇵", area: 377975, population: 125100000, gdp: 4230000000000 },
  { name: "中国", flag: "🇨🇳", area: 9596961, population: 1425887337, gdp: 17700000000000 },
  { name: "インド", flag: "🇮🇳", area: 3287263, population: 1417173173, gdp: 3385090000000 },
  { name: "アメリカ", flag: "🇺🇸", area: 9833520, population: 338289857, gdp: 27360000000000 },
  { name: "カナダ", flag: "🇨🇦", area: 9984670, population: 39858480, gdp: 2138000000000 },
  { name: "メキシコ", flag: "🇲🇽", area: 1964375, population: 126014024, gdp: 1294000000000 },
  { name: "ブラジル", flag: "🇧🇷", area: 8514877, population: 215313498, gdp: 1839000000000 },
  { name: "アルゼンチン", flag: "🇦🇷", area: 2780400, population: 46044703, gdp: 588000000000 },
  { name: "イギリス", flag: "🇬🇧", area: 242495, population: 67736802, gdp: 3332000000000 },
  { name: "フランス", flag: "🇫🇷", area: 643801, population: 68042591, gdp: 3030000000000 },
  { name: "ドイツ", flag: "🇩🇪", area: 357022, population: 83369843, gdp: 4080000000000 },
  { name: "イタリア", flag: "🇮🇹", area: 301340, population: 58940550, gdp: 2010000000000 },
  { name: "スペイン", flag: "🇪🇸", area: 505990, population: 47614373, gdp: 1390000000000 },
  { name: "オランダ", flag: "🇳🇱", area: 41865, population: 17590672, gdp: 1120000000000 },
  { name: "ベルギー", flag: "🇧🇪", area: 30528, population: 11590324, gdp: 594000000000 },
  { name: "ギリシャ", flag: "🇬🇷", area: 131957, population: 10724599, gdp: 219000000000 },
  { name: "ポーランド", flag: "🇵🇱", area: 312696, population: 37746412, gdp: 688000000000 },
  { name: "ロシア", flag: "🇷🇺", area: 17098246, population: 144444359, gdp: 1800000000000 },
  { name: "スウェーデン", flag: "🇸🇪", area: 450295, population: 10549347, gdp: 585000000000 },
  { name: "ノルウェー", flag: "🇳🇴", area: 385207, population: 5457127, gdp: 598000000000 },
  { name: "オーストリア", flag: "🇦🇹", area: 83879, population: 9042000, gdp: 516000000000 },
  { name: "スイス", flag: "🇨🇭", area: 41285, population: 8776000, gdp: 992000000000 },
  { name: "ポルトガル", flag: "🇵🇹", area: 92090, population: 10463511, gdp: 251000000000 },
  { name: "オーストラリア", flag: "🇦🇺", area: 7692024, population: 26608792, gdp: 1772000000000 },
  { name: "ニュージーランド", flag: "🇳🇿", area: 270467, population: 5228100, gdp: 250000000000 },
  { name: "南アフリカ", flag: "🇿🇦", area: 1221037, population: 60142978, gdp: 405000000000 },
  { name: "エジプト", flag: "🇪🇬", area: 1002000, population: 110990103, gdp: 476000000000 },
  { name: "ナイジェリア", flag: "🇳🇬", area: 923768, population: 223804632, gdp: 477000000000 },
  { name: "ケニア", flag: "🇰🇪", area: 580367, population: 54027487, gdp: 119000000000 },
  { name: "韓国", flag: "🇰🇷", area: 100363, population: 51329899, gdp: 1740000000000 },
  { name: "タイ", flag: "🇹🇭", area: 513120, population: 71801915, gdp: 504000000000 },
  { name: "ベトナム", flag: "🇻🇳", area: 331212, population: 98186856, gdp: 429000000000 },
  { name: "フィリピン", flag: "🇵🇭", area: 300000, population: 123287291, gdp: 536000000000 },
  { name: "インドネシア", flag: "🇮🇩", area: 1904569, population: 277534122, gdp: 1319000000000 },
  { name: "マレーシア", flag: "🇲🇾", area: 330803, population: 34160669, gdp: 530000000000 },
  { name: "シンガポール", flag: "🇸🇬", area: 728, population: 5917600, gdp: 526000000000 },
  { name: "パキスタン", flag: "🇵🇰", area: 881913, population: 240485658, gdp: 378000000000 },
  { name: "バングラデシュ", flag: "🇧🇩", area: 147570, population: 173562364, gdp: 460000000000 },
  { name: "トルコ", flag: "🇹🇷", area: 783562, population: 85326000, gdp: 905000000000 },
  { name: "イラン", flag: "🇮🇷", area: 1648195, population: 91567416, gdp: 611000000000 },
];

// 統計項目の定義
const STATS = [
  { key: "area", label: "面積", format: (v) => (v / 1000).toFixed(0) + "千km²" },
  { key: "population", label: "人口", format: (v) => (v / 1000000).toFixed(1) + "百万人" },
  { key: "gdp", label: "GDP", format: (v) => (v / 1000000000000).toFixed(2) + "兆ドル" },
];

class HighLowGame {
  constructor() {
    this.setupElements();
    this.setupEventListeners();
    this.reset();
  }

  setupElements() {
    this.gamePlayArea = document.getElementById("gamePlayArea");
    this.gameOverArea = document.getElementById("gameOverArea");
    this.myFlagEl = document.getElementById("myFlag");
    this.myCountryEl = document.getElementById("myCountry");
    this.myValueEl = document.getElementById("myValue");
    this.deckFlagEl = document.getElementById("deckFlag");
    this.deckCountryEl = document.getElementById("deckCountry");
    this.deckValueEl = document.getElementById("deckValue");
    this.myFlagArea = document.getElementById("myFlagArea");
    this.deckFlagArea = document.getElementById("deckFlagArea");
    this.finalScore = document.getElementById("finalScore");
    this.highlowRestart = document.getElementById("highlowRestart");
    this.highlowBackHome = document.getElementById("highlowBackHome");
  }

  setupEventListeners() {
    this.myFlagArea.addEventListener("click", () => this.guess(false));
    this.deckFlagArea.addEventListener("click", () => this.guess(true));
    this.highlowRestart.addEventListener("click", () => this.restart());
    this.highlowBackHome.addEventListener("click", () => this.backHome());
  }

  reset() {
    this.score = 0;
    this.currentStat = STATS[Math.floor(Math.random() * STATS.length)];
    this.myCountryData = this.getRandomCountry();
    this.deckCountryData = this.getRandomCountry();
    this.updateDisplay();
  }

  getRandomCountry() {
    return HIGHLOW_COUNTRIES[Math.floor(Math.random() * HIGHLOW_COUNTRIES.length)];
  }

  updateDisplay() {
    this.myFlagEl.textContent = this.myCountryData.flag;
    this.myCountryEl.textContent = this.myCountryData.name;
    this.myValueEl.textContent = this.currentStat.format(this.myCountryData[this.currentStat.key]);

    this.deckFlagEl.textContent = this.deckCountryData.flag;
    this.deckCountryEl.textContent = this.deckCountryData.name;
    this.deckValueEl.textContent = "?";
    this.deckValueEl.style.opacity = "0";
  }

  guess(isHigh) {
    const myValue = this.myCountryData[this.currentStat.key];
    const deckValue = this.deckCountryData[this.currentStat.key];
    const isCorrect = isHigh ? (deckValue > myValue) : (deckValue < myValue);

    // 答えを表示
    this.deckValueEl.textContent = this.currentStat.format(deckValue);
    this.deckValueEl.style.opacity = "1";
    
    // クリック可能エリアを一時的に無効化
    this.myFlagArea.style.pointerEvents = "none";
    this.deckFlagArea.style.pointerEvents = "none";

    setTimeout(() => {
      if (isCorrect) {
        this.score++;
        // 山札が新しい手札になる
        this.myCountryData = this.deckCountryData;
        this.deckCountryData = this.getRandomCountry();
        
        // 新しい統計項目を選択（時々は同じ）
        if (Math.random() > 0.5) {
          this.currentStat = STATS[Math.floor(Math.random() * STATS.length)];
        }
        
        this.updateDisplay();
        this.myFlagArea.style.pointerEvents = "auto";
        this.deckFlagArea.style.pointerEvents = "auto";
      } else {
        this.gameOver();
      }
    }, 1500);
  }

  gameOver() {
    this.gamePlayArea.classList.add("hidden");
    this.gameOverArea.classList.remove("hidden");
    this.finalScore.textContent = this.score;
  }

  restart() {
    this.gamePlayArea.classList.remove("hidden");
    this.gameOverArea.classList.add("hidden");
    this.reset();
  }

  backHome() {
    const highlowScreen = document.getElementById("highlowScreen");
    const startScreen = document.getElementById("startScreen");
    highlowScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  }

  start() {
    this.reset();
    this.gamePlayArea.classList.remove("hidden");
    this.gameOverArea.classList.add("hidden");
  }
}

// ===== イベントリスナー =====
document.addEventListener("DOMContentLoaded", () => {
  let highlowGame = null;

  // High & Low ボタンがクリックされたときの処理（将来用）
  // 現在は手動でゲーム画面に遷移するための仕組みが必要
  
  // ゲーム開始関数を外部に公開
  window.startHighLowGame = () => {
    const startScreen = document.getElementById("startScreen");
    const highlowScreen = document.getElementById("highlowScreen");
    startScreen.classList.add("hidden");
    highlowScreen.classList.remove("hidden");
    
    if (!highlowGame) {
      highlowGame = new HighLowGame();
    }
    highlowGame.start();
  };
});
