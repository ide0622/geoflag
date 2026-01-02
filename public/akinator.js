// ===== 国旗アキネーター =====

// 国旗データ
const AKINATOR_COUNTRIES = [
  { name: "日本", flag: "🇯🇵", continent: "アジア", colors: ["white", "red"], shape: "rectangular", population: "small" },
  { name: "中国", flag: "🇨🇳", continent: "アジア", colors: ["red", "yellow"], shape: "rectangular", population: "large" },
  { name: "インド", flag: "🇮🇳", continent: "アジア", colors: ["orange", "white", "green"], shape: "rectangular", population: "large" },
  { name: "アメリカ", flag: "🇺🇸", continent: "北米", colors: ["red", "white", "blue"], shape: "rectangular", population: "large" },
  { name: "カナダ", flag: "🇨🇦", continent: "北米", colors: ["red", "white"], shape: "rectangular", population: "medium" },
  { name: "メキシコ", flag: "🇲🇽", continent: "北米", colors: ["green", "white", "red"], shape: "rectangular", population: "medium" },
  { name: "ブラジル", flag: "🇧🇷", continent: "南米", colors: ["green", "yellow", "blue"], shape: "rectangular", population: "large" },
  { name: "アルゼンチン", flag: "🇦🇷", continent: "南米", colors: ["light blue", "white"], shape: "rectangular", population: "medium" },
  { name: "ペルー", flag: "🇵🇪", continent: "南米", colors: ["red", "white"], shape: "rectangular", population: "small" },
  { name: "イギリス", flag: "🇬🇧", continent: "ヨーロッパ", colors: ["red", "white", "blue"], shape: "rectangular", population: "medium" },
  { name: "フランス", flag: "🇫🇷", continent: "ヨーロッパ", colors: ["blue", "white", "red"], shape: "rectangular", population: "medium" },
  { name: "ドイツ", flag: "🇩🇪", continent: "ヨーロッパ", colors: ["black", "red", "gold"], shape: "rectangular", population: "medium" },
  { name: "イタリア", flag: "🇮🇹", continent: "ヨーロッパ", colors: ["green", "white", "red"], shape: "rectangular", population: "medium" },
  { name: "スペイン", flag: "🇪🇸", continent: "ヨーロッパ", colors: ["red", "yellow"], shape: "rectangular", population: "medium" },
  { name: "オランダ", flag: "🇳🇱", continent: "ヨーロッパ", colors: ["red", "white", "blue"], shape: "rectangular", population: "small" },
  { name: "ベルギー", flag: "🇧🇪", continent: "ヨーロッパ", colors: ["black", "yellow", "red"], shape: "rectangular", population: "small" },
  { name: "ギリシャ", flag: "🇬🇷", continent: "ヨーロッパ", colors: ["blue", "white"], shape: "rectangular", population: "small" },
  { name: "ポーランド", flag: "🇵🇱", continent: "ヨーロッパ", colors: ["white", "red"], shape: "rectangular", population: "small" },
  { name: "ロシア", flag: "🇷🇺", continent: "ヨーロッパ", colors: ["white", "blue", "red"], shape: "rectangular", population: "large" },
  { name: "スウェーデン", flag: "🇸🇪", continent: "ヨーロッパ", colors: ["blue", "yellow"], shape: "rectangular", population: "small" },
  { name: "ノルウェー", flag: "🇳🇴", continent: "ヨーロッパ", colors: ["red", "blue", "white"], shape: "rectangular", population: "small" },
  { name: "オーストリア", flag: "🇦🇹", continent: "ヨーロッパ", colors: ["red", "white"], shape: "rectangular", population: "small" },
  { name: "スイス", flag: "🇨🇭", continent: "ヨーロッパ", colors: ["red", "white"], shape: "square", population: "small" },
  { name: "ポルトガル", flag: "🇵🇹", continent: "ヨーロッパ", colors: ["green", "red"], shape: "rectangular", population: "small" },
  { name: "オーストラリア", flag: "🇦🇺", continent: "オセアニア", colors: ["blue", "red", "white", "yellow"], shape: "rectangular", population: "medium" },
  { name: "ニュージーランド", flag: "🇳🇿", continent: "オセアニア", colors: ["blue", "red", "white"], shape: "rectangular", population: "small" },
  { name: "南アフリカ", flag: "🇿🇦", continent: "アフリカ", colors: ["green", "yellow", "red", "black", "white"], shape: "rectangular", population: "medium" },
  { name: "エジプト", flag: "🇪🇬", continent: "アフリカ", colors: ["red", "white", "black"], shape: "rectangular", population: "medium" },
  { name: "ナイジェリア", flag: "🇳🇬", continent: "アフリカ", colors: ["green", "white"], shape: "rectangular", population: "large" },
  { name: "ケニア", flag: "🇰🇪", continent: "アフリカ", colors: ["black", "red", "green", "white"], shape: "rectangular", population: "medium" },
  { name: "韓国", flag: "🇰🇷", continent: "アジア", colors: ["white", "red", "blue"], shape: "rectangular", population: "small" },
  { name: "タイ", flag: "🇹🇭", continent: "アジア", colors: ["red", "white", "blue"], shape: "rectangular", population: "small" },
  { name: "ベトナム", flag: "🇻🇳", continent: "アジア", colors: ["red", "yellow"], shape: "rectangular", population: "small" },
  { name: "フィリピン", flag: "🇵🇭", continent: "アジア", colors: ["blue", "white", "red", "yellow"], shape: "rectangular", population: "small" },
  { name: "インドネシア", flag: "🇮🇩", continent: "アジア", colors: ["red", "white"], shape: "rectangular", population: "large" },
  { name: "マレーシア", flag: "🇲🇾", continent: "アジア", colors: ["red", "white", "blue", "yellow"], shape: "rectangular", population: "small" },
  { name: "シンガポール", flag: "🇸🇬", continent: "アジア", colors: ["red", "white"], shape: "rectangular", population: "small" },
  { name: "パキスタン", flag: "🇵🇰", continent: "アジア", colors: ["green", "white"], shape: "rectangular", population: "medium" },
  { name: "バングラデシュ", flag: "🇧🇩", continent: "アジア", colors: ["green", "red"], shape: "rectangular", population: "medium" },
  { name: "トルコ", flag: "🇹🇷", continent: "アジア", colors: ["red", "white"], shape: "rectangular", population: "medium" },
  { name: "イラン", flag: "🇮🇷", continent: "アジア", colors: ["green", "white", "red"], shape: "rectangular", population: "medium" },
  { name: "サウジアラビア", flag: "🇸🇦", continent: "アジア", colors: ["green", "white"], shape: "rectangular", population: "small" },
  { name: "アイスランド", flag: "🇮🇸", continent: "ヨーロッパ", colors: ["blue", "white", "red"], shape: "rectangular", population: "small" },
  { name: "デンマーク", flag: "🇩🇰", continent: "ヨーロッパ", colors: ["red", "white"], shape: "rectangular", population: "small" },
  { name: "フィンランド", flag: "🇫🇮", continent: "ヨーロッパ", colors: ["white", "blue"], shape: "rectangular", population: "small" },
];

// 質問リスト
const AKINATOR_QUESTIONS = [
  { text: "国旗に赤色が使われていますか？", attr: "colors", check: (val) => val.includes("red") },
  { text: "国旗に青色が使われていますか？", attr: "colors", check: (val) => val.includes("blue") },
  { text: "国旗に白色が使われていますか？", attr: "colors", check: (val) => val.includes("white") },
  { text: "国旗に黄色が使われていますか？", attr: "colors", check: (val) => val.includes("yellow") },
  { text: "国旗に緑色が使われていますか？", attr: "colors", check: (val) => val.includes("green") },
  { text: "国旗にアジアの国ですか？", attr: "continent", check: (val) => val === "アジア" },
  { text: "ヨーロッパの国ですか？", attr: "continent", check: (val) => val === "ヨーロッパ" },
  { text: "アフリカの国ですか？", attr: "continent", check: (val) => val === "アフリカ" },
  { text: "南米の国ですか？", attr: "continent", check: (val) => val === "南米" },
  { text: "北米の国ですか？", attr: "continent", check: (val) => val === "北米" },
  { text: "正方形に近い形ですか？", attr: "shape", check: (val) => val === "square" },
  { text: "人口が多い国ですか？", attr: "population", check: (val) => val === "large" },
];

class FlagAkinator {
  constructor() {
    this.candidates = [...AKINATOR_COUNTRIES];
    this.history = [];
    this.currentGuess = null;
    
    this.setupElements();
    this.setupEventListeners();
  }

  setupElements() {
    this.questionText = document.getElementById("questionText");
    this.questionArea = document.getElementById("questionArea");
    this.resultArea = document.getElementById("resultArea");
    this.resultFlag = document.getElementById("resultFlag");
    this.resultCountry = document.getElementById("resultCountry");
    this.yesBtn = document.getElementById("akinatorYes");
    this.noBtn = document.getElementById("akinatorNo");
    this.maybeBtn = document.getElementById("akinatorMaybe");
    this.undoBtn = document.getElementById("akinatorUndo");
    this.correctBtn = document.getElementById("akinatorCorrect");
    this.wrongBtn = document.getElementById("akinatorWrong");
  }

  setupEventListeners() {
    this.yesBtn.addEventListener("click", () => this.answer(true));
    this.noBtn.addEventListener("click", () => this.answer(false));
    this.maybeBtn.addEventListener("click", () => this.answer(null));
    this.undoBtn.addEventListener("click", () => this.undo());
    this.correctBtn.addEventListener("click", () => this.correct());
    this.wrongBtn.addEventListener("click", () => this.wrong());
  }

  start() {
    this.candidates = [...AKINATOR_COUNTRIES];
    this.history = [];
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.candidates.length === 0) {
      this.showNoAnswer();
      return;
    }

    if (this.candidates.length === 1) {
      this.makeGuess();
      return;
    }

    // 最も情報量が多い質問を選ぶ
    const bestQuestion = this.getBestQuestion();
    if (!bestQuestion) {
      this.makeGuess();
      return;
    }

    this.questionText.textContent = bestQuestion.text;
    this.undoBtn.style.display = this.history.length > 0 ? "block" : "none";
  }

  getBestQuestion() {
    let bestQuestion = null;
    let bestEntropy = -1;

    for (const q of AKINATOR_QUESTIONS) {
      const yes = this.candidates.filter(c => q.check(c[q.attr])).length;
      const no = this.candidates.length - yes;

      if (yes === 0 || no === 0) continue;

      const entropy = -(yes / this.candidates.length * Math.log2(yes / this.candidates.length) +
                        no / this.candidates.length * Math.log2(no / this.candidates.length));

      if (entropy > bestEntropy) {
        bestEntropy = entropy;
        bestQuestion = q;
      }
    }

    return bestQuestion;
  }

  answer(response) {
    if (!this.questionText.textContent) return;

    // 現在の質問を取得
    const question = AKINATOR_QUESTIONS.find(q => q.text === this.questionText.textContent);
    if (!question) return;

    this.history.push({ question, response });

    // 候補を絞り込む
    if (response === true) {
      this.candidates = this.candidates.filter(c => question.check(c[question.attr]));
    } else if (response === false) {
      this.candidates = this.candidates.filter(c => !question.check(c[question.attr]));
    }
    // response === null の場合は候補を絞らない

    this.nextQuestion();
  }

  makeGuess() {
    if (this.candidates.length === 0) {
      this.showNoAnswer();
      return;
    }

    this.currentGuess = this.candidates[0];
    this.questionArea.classList.add("hidden");
    this.resultArea.classList.remove("hidden");
    this.resultFlag.textContent = this.currentGuess.flag;
    this.resultCountry.textContent = this.currentGuess.name;
  }

  correct() {
    this.resetGame();
    alert("やった！当たった！");
  }

  wrong() {
    this.resetGame();
    alert("申し訳ない。もう一度試してみてください。");
  }

  undo() {
    if (this.history.length === 0) return;

    this.history.pop();
    this.candidates = [...AKINATOR_COUNTRIES];

    // 履歴を再度処理
    for (const { question, response } of this.history) {
      if (response === true) {
        this.candidates = this.candidates.filter(c => question.check(c[question.attr]));
      } else if (response === false) {
        this.candidates = this.candidates.filter(c => !question.check(c[question.attr]));
      }
    }

    if (this.resultArea.classList.contains("hidden") === false) {
      this.resultArea.classList.add("hidden");
      this.questionArea.classList.remove("hidden");
    }

    this.nextQuestion();
  }

  showNoAnswer() {
    this.questionArea.classList.add("hidden");
    this.resultArea.classList.remove("hidden");
    this.resultFlag.textContent = "❓";
    this.resultCountry.textContent = "わかりませんでした...";
    this.correctBtn.style.display = "none";
    this.wrongBtn.style.display = "none";
  }

  resetGame() {
    this.resultArea.classList.add("hidden");
    this.questionArea.classList.remove("hidden");
    this.correctBtn.style.display = "block";
    this.wrongBtn.style.display = "block";
    this.start();
  }
}

// ===== イベントリスナー =====
document.addEventListener("DOMContentLoaded", () => {
  const akineatorBtn = document.getElementById("akineatorBtn");
  const backFromAkinatorBtn = document.getElementById("backFromAkinator");
  const akinatorScreen = document.getElementById("akinatorScreen");
  const startScreen = document.getElementById("startScreen");
  const highlowBtn = document.getElementById("highlowBtn");

  let akinator = null;

  akineatorBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    akinatorScreen.classList.remove("hidden");
    akinator = new FlagAkinator();
    akinator.start();
  });

  backFromAkinatorBtn.addEventListener("click", () => {
    akinatorScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  });

  // High & Low ボタン
  if (highlowBtn) {
    highlowBtn.addEventListener("click", () => {
      if (window.startHighLowGame) {
        window.startHighLowGame();
      }
    });
  }
});
