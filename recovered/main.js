// ===== データ =====
const countries = [
  { name:"日本", flag:"🇯🇵", area:378, population:125, gdp:4200 },
  { name:"アメリカ", flag:"🇺🇸", area:9834, population:331, gdp:26000 },
  { name:"中国", flag:"🇨🇳", area:9597, population:1410, gdp:18000 },
  { name:"ドイツ", flag:"🇩🇪", area:357, population:83, gdp:4200 },
  { name:"フランス", flag:"🇫🇷", area:551, population:67, gdp:3000 },
  { name:"イギリス", flag:"🇬🇧", area:243, population:67, gdp:3100 },
  { name:"イタリア", flag:"🇮🇹", area:301, population:59, gdp:2100 },
  { name:"カナダ", flag:"🇨🇦", area:9985, population:38, gdp:2100 },
  { name:"ロシア", flag:"🇷🇺", area:17098, population:146, gdp:2000 },
  { name:"ブラジル", flag:"🇧🇷", area:8516, population:214, gdp:2200 },
  { name:"オーストラリア", flag:"🇦🇺", area:7692, population:26, gdp:1700 },
  { name:"韓国", flag:"🇰🇷", area:100, population:52, gdp:1800 },
  { name:"スペイン", flag:"🇪🇸", area:505, population:47, gdp:1600 },
  { name:"メキシコ", flag:"🇲🇽", area:1964, population:129, gdp:1500 },
  { name:"インド", flag:"🇮🇳", area:3287, population:1430, gdp:3500 },
  { name:"インドネシア", flag:"🇮🇩", area:1905, population:277, gdp:1400 },
  { name:"トルコ", flag:"🇹🇷", area:783, population:85, gdp:1100 },
  { name:"サウジアラビア", flag:"🇸🇦", area:2149, population:36, gdp:1100 },
  { name:"スイス", flag:"🇨🇭", area:41, population:9, gdp:900 },
  { name:"オランダ", flag:"🇳🇱", area:42, population:17, gdp:1000 }
];

const themes = [
  { text:"面積が大きい国", key:"area" },
  { text:"人口が多い国", key:"population" },
  { text:"GDPが大きい国", key:"gdp" },
  { text:"人口密度が高い国", key:"density" },
  { text:"一人当たりGDPが高い国", key:"gdpPerCapita" }
];

// ===== 状態 =====
let round = 0;
let playerHand = [];
let cpuHand = [];
let results = [];

// ===== DOM =====
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const summaryScreen = document.getElementById("summaryScreen");

const startBtn = document.getElementById("startGame");
const nextBtn = document.getElementById("nextRound");
const restartBtn = document.getElementById("restartGame");

const themeTitle = document.getElementById("themeTitle");
const banner = document.getElementById("resultBanner");
const playerField = document.getElementById("playerField");
const cpuField = document.getElementById("cpuField");
const playerHandDiv = document.getElementById("playerHand");
const cpuHandDiv = document.getElementById("cpuHand");
const summaryDetails = document.getElementById("summaryDetails");
const roundList = document.getElementById("roundList");

// ===== イベント =====
startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", nextRound);
restartBtn.addEventListener("click", () => location.reload());

// ===== ゲーム開始 =====
function startGame() {
  // 🔥 重要：startScreen を完全に無効化
  startScreen.classList.add("hidden");

  // 🔥 gameScreen を明示的に操作可能に
  gameScreen.classList.remove("hidden");
  gameScreen.style.pointerEvents = "auto";

  const shuffled = [...countries].sort(() => Math.random() - 0.5);
  playerHand = shuffled.slice(0, 5);
  cpuHand = shuffled.slice(5, 10);
  round = 0;
  results = [];

  renderRounds();
  renderHands();
  showTheme();
}

// ===== UI =====
function renderRounds() {
  roundList.innerHTML = "";
  themes.forEach((_, i) => {
    const d = document.createElement("div");
    d.id = `r${i}`;
    d.textContent = `第${i+1}問`;
    d.className = "px-3 py-1 rounded";
    roundList.appendChild(d);
  });
  updateRoundHighlight();
}

function showTheme() {
  themeTitle.textContent = `第${round+1}問：${themes[round].text}`;
}

function renderHands() {
  playerHandDiv.innerHTML = "";
  playerHand.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = c.flag;
    b.className =
      "text-5xl p-4 bg-blue-50 rounded shadow cursor-pointer hover:scale-110 transition";
    b.onclick = () => playCard(i);
    playerHandDiv.appendChild(b);
  });

  cpuHandDiv.innerHTML = "";
  cpuHand.forEach(c => {
    const s = document.createElement("span");
    s.textContent = c.flag;
    s.className = "text-5xl bg-red-50 p-2 rounded";
    cpuHandDiv.appendChild(s);
  });
}

// ===== プレイ =====
function playCard(i) {
  const theme = themes[round];
  const p = playerHand.splice(i, 1)[0];
  const c = cpuHand.splice(Math.floor(Math.random() * cpuHand.length), 1)[0];

  const pv = getValue(p, theme.key);
  const cv = getValue(c, theme.key);

  playerField.textContent = p.flag;
  cpuField.textContent = c.flag;

  let winner = "draw";
  if (pv > cv) winner = "player";
  if (pv < cv) winner = "cpu";

  results.push({ theme: theme.text, p, c, pv, cv, winner });

  banner.innerHTML = `
    <div class="text-3xl font-bold">
      ${winner === "player" ? "あなたの勝ち 🎉" :
        winner === "cpu" ? "CPUの勝ち 🤖" : "引き分け"}
    </div>
    <div class="mt-2">
      ${p.name}: ${pv.toFixed(2)} / ${c.name}: ${cv.toFixed(2)}
    </div>
  `;
  banner.className =
    `text-center py-6 ${
      winner === "player" ? "bg-blue-200" :
      winner === "cpu" ? "bg-red-200" : "bg-gray-200"
    }`;
  banner.classList.remove("hidden");

  nextBtn.classList.remove("hidden");
  renderHands();
}

// ===== 次のラウンド =====
function nextRound() {
  banner.classList.add("hidden");
  nextBtn.classList.add("hidden");
  playerField.textContent = "❓";
  cpuField.textContent = "❓";

  round++;
  if (round === 5) return showSummary();

  updateRoundHighlight();
  showTheme();
}

// ===== サマリー =====
function showSummary() {
  gameScreen.classList.add("hidden");
  summaryScreen.classList.remove("hidden");

  let pScore = 0, cScore = 0;
  summaryDetails.innerHTML = results.map((r, i) => {
    if (r.winner === "player") pScore++;
    if (r.winner === "cpu") cScore++;
    return `
      <div class="border-b py-2">
        第${i + 1}問 ${r.theme}：
        ${r.winner === "player" ? "あなた勝利" : "CPU勝利"}
      </div>`;
  }).join("");

  summaryDetails.innerHTML += `
    <div class="mt-4 text-2xl font-bold">
      最終結果：${pScore} - ${cScore}
    </div>`;
}

// ===== 補助 =====
function getValue(c, key) {
  if (key === "density") return c.population / c.area;
  if (key === "gdpPerCapita") return (c.gdp * 1000) / c.population;
  return c[key];
}

function updateRoundHighlight() {
  themes.forEach((_, i) => {
    document.getElementById(`r${i}`).className =
      i === round
        ? "px-3 py-1 bg-blue-600 text-white rounded"
        : "px-3 py-1 text-gray-400";
  });
}
