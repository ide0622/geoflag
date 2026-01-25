// country_list.js
// main.jsのcountries[]を利用して国名と国旗画像を表示
// 指標リスト
const indicators = [
  { key: 'area', label: '面積', unit: '千km²' },
  { key: 'population', label: '人口', unit: '万人' },
  { key: 'life', label: '平均寿命', unit: '年' },
  { key: 'gdp', label: 'GDP', unit: '百万US$' },
  { key: 'medals', label: 'メダル数', unit: '' },
  { key: 'passport', label: 'パスポート', unit: '' },
  { key: 'tourists', label: '観光客数', unit: '' },
  { key: 'rain', label: '降水量', unit: 'mm' },
  { key: 'altitude', label: '平均標高', unit: 'm' },
  { key: 'rice', label: '米の消費量', unit: 't' },
  { key: 'internet', label: 'インターネット普及率', unit: '%' },
  { key: 'wheat', label: '小麦の消費量', unit: 't' },
  { key: 'temp', label: '平均気温', unit: '℃' },
  { key: 'bigmac', label: 'ビッグマック指数', unit: 'US$' },
  { key: 'sleep', label: '睡眠時間', unit: 'h' },
  { key: 'heritage', label: '世界遺産数', unit: '件' },
  { key: 'happiness', label: '幸福度', unit: '' }
];

// geodata.csvからすべての国データを読み込む
let countries = [];

function parseCSVCountries() {
  return fetch('geodata.csv')
    .then(res => res.text())
    .then(csv => {
      const lines = csv.split('\n');
      const header = lines[0].split(',');
      
      // ヘッダーインデックスを取得
      const nameIdx = header.indexOf('国名');
      const flagIdx = header.indexOf('国旗');
      const codeIdx = header.indexOf('国コード(CCA2)');
      const regionIdx = header.indexOf('地域');
      const subregionIdx = header.indexOf('サブ地域');
      const capitalIdx = header.indexOf('首都');
      const areaIdx = header.indexOf('面積');
      const populationIdx = header.indexOf('人口');
      const latIdx = header.indexOf('緯度');
      const lngIdx = header.indexOf('経度');
      const lifeIdx = header.indexOf('平均寿命');
      const gdpIdx = header.indexOf('GDP');
      const medalsIdx = header.indexOf('メダル数');
      const passportIdx = header.indexOf('パスポート');
      const touristsIdx = header.indexOf('観光客数');
      const rainIdx = header.indexOf('降水量');
      const altitudeIdx = header.indexOf('平均標高');
      const riceIdx = header.indexOf('米の消費量');
      const internetIdx = header.indexOf('インターネット普及率');
      const wheatIdx = header.indexOf('小麦の消費量');
      const tempIdx = header.indexOf('平均気温');
      const bigmacIdx = header.indexOf('ビッグマック指数');
      const sleepIdx = header.indexOf('睡眠時間');
      const heritageIdx = header.indexOf('世界遺産数');
      const happinessIdx = header.indexOf('幸福度');
      
      // CSVデータを解析
      for (let i = 1; i < lines.length; ++i) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(',');
        if (cols.length < 10) continue;
        
        const country = {
          name: cols[nameIdx] || '',
          flagImage: `https://flagcdn.com/${cols[codeIdx]?.toLowerCase() || 'xx'}.svg`,
          code: cols[codeIdx] || '',
          region: cols[regionIdx] || '',
          subregion: cols[subregionIdx] || '',
          capital: cols[capitalIdx] || '',
          area: parseFloat(cols[areaIdx]) || 0,
          population: parseFloat(cols[populationIdx]) || 0,
          lat: parseFloat(cols[latIdx]) || 0,
          lng: parseFloat(cols[lngIdx]) || 0
        };
        
        // 統計データを追加
        if (!isNaN(parseFloat(cols[lifeIdx]))) country.life = parseFloat(cols[lifeIdx]);
        if (!isNaN(parseFloat(cols[gdpIdx]))) country.gdp = Math.round(parseFloat(cols[gdpIdx]) / 1000);
        if (!isNaN(parseFloat(cols[medalsIdx]))) country.medals = parseFloat(cols[medalsIdx]);
        if (!isNaN(parseFloat(cols[passportIdx]))) country.passport = parseFloat(cols[passportIdx]);
        if (!isNaN(parseFloat(cols[touristsIdx]))) country.tourists = parseFloat(cols[touristsIdx]);
        if (!isNaN(parseFloat(cols[rainIdx]))) country.rain = parseFloat(cols[rainIdx]);
        if (!isNaN(parseFloat(cols[altitudeIdx]))) country.altitude = parseFloat(cols[altitudeIdx]);
        if (!isNaN(parseFloat(cols[riceIdx]))) country.rice = parseFloat(cols[riceIdx]);
        if (!isNaN(parseFloat(cols[internetIdx]))) country.internet = parseFloat(cols[internetIdx]);
        if (!isNaN(parseFloat(cols[wheatIdx]))) country.wheat = parseFloat(cols[wheatIdx]);
        if (!isNaN(parseFloat(cols[tempIdx]))) country.temp = parseFloat(cols[tempIdx]);
        if (!isNaN(parseFloat(cols[bigmacIdx]))) country.bigmac = parseFloat(cols[bigmacIdx]);
        if (!isNaN(parseFloat(cols[sleepIdx]))) country.sleep = parseFloat(cols[sleepIdx]);
        if (!isNaN(parseFloat(cols[heritageIdx]))) country.heritage = parseFloat(cols[heritageIdx]);
        if (!isNaN(parseFloat(cols[happinessIdx]))) country.happiness = parseFloat(cols[happinessIdx]);
        
        if (country.name) {
          countries.push(country);
        }
      }
      
      return countries;
    });
}
let currentIndicator = null;

function renderIndicatorButtons() {
  const indicatorDiv = document.getElementById('indicatorButtons');
  if (!indicatorDiv) return;
  indicatorDiv.innerHTML = '';
  indicators.forEach(ind => {
    const btn = document.createElement('button');
    btn.textContent = ind.label;
    const isActive = currentIndicator === ind.key;
    btn.className = isActive 
      ? 'px-4 py-2 m-1 rounded-lg bg-blue-500 text-white font-semibold shadow-md transition-all duration-200 hover:bg-blue-600'
      : 'px-4 py-2 m-1 rounded-lg bg-blue-100 text-blue-800 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-200';
    btn.onclick = () => {
      currentIndicator = ind.key;
      renderIndicatorButtons();
      renderRankingTable();
    };
    indicatorDiv.appendChild(btn);
  });
}

function renderRankingTable() {
  const tableDiv = document.getElementById('rankingTable');
  tableDiv.innerHTML = '';
  if (!currentIndicator) return;
  const ind = indicators.find(i => i.key === currentIndicator);
  if (!ind) return;
  const filtered = currentRegion === 'all' ? countries : countries.filter(c => c.region === currentRegion);
  const ranked = filtered
    .filter(c => typeof c[ind.key] === 'number' && !isNaN(c[ind.key]))
    .sort((a, b) => b[ind.key] - a[ind.key]);
  
  // 最大値を取得（棒グラフ用）
  const maxValue = ranked.length > 0 ? ranked[0][ind.key] : 0;
  
  const table = document.createElement('table');
  table.className = 'min-w-full border border-gray-200 bg-white rounded-lg shadow-md overflow-hidden';
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
    <th class="px-4 py-3 font-bold text-sm">順位</th>
    <th class="px-4 py-3 font-bold text-sm text-left">国名</th>
    <th class="px-4 py-3 font-bold text-sm text-right">${ind.label} (${ind.unit})</th>
    <th class="px-4 py-3 font-bold text-sm">1位の国に対する割合</th>
  </tr>`;
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  ranked.forEach((c, i) => {
    const tr = document.createElement('tr');
    // 順位に応じた背景色
    let bgClass = 'bg-white hover:bg-blue-50';
    if (i === 0) bgClass = 'bg-gradient-to-r from-yellow-50 to-yellow-100 hover:bg-yellow-100';
    else if (i === 1) bgClass = 'bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gray-100';
    else if (i === 2) bgClass = 'bg-gradient-to-r from-orange-50 to-orange-100 hover:bg-orange-100';
    tr.className = bgClass + ' border-b border-gray-200 transition-all duration-200';
    
    // 順位表示（1-3はメダルのみ、4以降は黒い数字）
    let rankDisplay = '';
    if (i === 0) {
      rankDisplay = `<div class="text-3xl">🥇</div>`;
    } else if (i === 1) {
      rankDisplay = `<div class="text-3xl">🥈</div>`;
    } else if (i === 2) {
      rankDisplay = `<div class="text-3xl">🥉</div>`;
    } else {
      rankDisplay = `<div class="text-2xl font-bold text-black">${i + 1}</div>`;
    }
    
    // 棒グラフの幅を計算
    const barWidth = maxValue > 0 ? (c[ind.key] / maxValue * 100) : 0;
    const barColor = i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-400' : 'bg-blue-400';
    
    tr.innerHTML = `
      <td class="px-4 py-3 text-center">
        ${rankDisplay}
      </td>
      <td class="px-4 py-3">
        <div class="flex items-center gap-2">
          ${c.flagImage ? `<img src='${c.flagImage}' alt='${c.name}' class='w-8 h-8 object-contain rounded shadow-sm'/>` : ''}
          <span class="font-semibold">${c.name}</span>
        </div>
      </td>
      <td class="px-4 py-3 text-right">
        <span class="font-bold text-lg text-blue-900">${c[ind.key].toLocaleString()}</span>
      </td>
      <td class="px-4 py-3">
        <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div class="${barColor} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2" style="width: ${barWidth}%">
            <span class="text-xs font-bold text-white">${barWidth.toFixed(0)}%</span>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableDiv.appendChild(table);
}

// regionリストを取得
const regionNameMap = {
  'Americas': 'アメリカ大陸',
  'Asia': 'アジア',
  'Oceania': 'オセアニア',
  'Africa': 'アフリカ',
  'Europe': 'ヨーロッパ'
};
let regions = [];
let currentRegion = 'all';

function updateRegions() {
  regions = Array.from(new Set(countries.map(c => c.region))).filter(Boolean);
}

function renderRegionButtons() {
  updateRegions();
  const regionDiv = document.getElementById('regionButtons');
  if (!regionDiv) return;
  regionDiv.innerHTML = '';
  // 「すべて」ボタン
  const allBtn = document.createElement('button');
  allBtn.textContent = 'すべて';
  const isAllActive = currentRegion === 'all';
  allBtn.className = isAllActive
    ? 'px-4 py-2 m-1 rounded-lg bg-blue-500 text-white font-semibold shadow-md transition-all duration-200 hover:bg-blue-600'
    : 'px-4 py-2 m-1 rounded-lg bg-blue-100 text-blue-800 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-200';
  allBtn.onclick = () => { currentRegion = 'all'; renderRegionButtons(); renderCountryList(); renderRankingTable(); };
  regionDiv.appendChild(allBtn);
  regions.forEach(region => {
    const btn = document.createElement('button');
    btn.textContent = regionNameMap[region] || region;
    const isActive = currentRegion === region;
    btn.className = isActive
      ? 'px-4 py-2 m-1 rounded-lg bg-blue-500 text-white font-semibold shadow-md transition-all duration-200 hover:bg-blue-600'
      : 'px-4 py-2 m-1 rounded-lg bg-blue-100 text-blue-800 font-semibold shadow-sm transition-all duration-200 hover:bg-blue-200';
    btn.onclick = () => { currentRegion = region; renderRegionButtons(); renderCountryList(); renderRankingTable(); };
    regionDiv.appendChild(btn);
  });
}

function renderCountryList() {
  const listDiv = document.getElementById('countryList');
  listDiv.innerHTML = '';
  // regionでフィルタ
  const filtered = currentRegion === 'all' ? countries : countries.filter(c => c.region === currentRegion);
  // 件数表示
  const countDiv = document.createElement('div');
  countDiv.className = 'col-span-4 text-right text-sm text-gray-500 mb-2';
  countDiv.textContent = `取得国数: ${filtered.length}`;
  listDiv.appendChild(countDiv);
  filtered.forEach(c => {
    const div = document.createElement('div');
    div.className = 'col-span-1 bg-white rounded shadow p-3 cursor-pointer hover:bg-blue-50 flex flex-col items-center justify-center';
    div.innerHTML = `
      ${c.flagImage ? `<img src="${c.flagImage}" alt="${c.name}" class="w-20 h-20 object-contain mb-2" />` : `<span class='w-20 h-20 flex items-center justify-center bg-gray-200 mb-2'>?</span>`}
      <span class="text-base text-center">${c.name}</span>
    `;
    div.onclick = () => showCountryStats(c);
    listDiv.appendChild(div);
  });
}

// 国の統計情報を表示するダイアログ
function showCountryStats(country) {
  const area = country.area !== undefined ? country.area + '千km²' : '不明';
  const population = country.population !== undefined ? country.population + '万人' : '不明';
  const capital = country.capital || '不明';
  const subregion = country.subregion || '不明';
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = '#0005';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  const dialog = document.createElement('div');
  dialog.style.padding = '1.5em 1em';
  dialog.style.background = '#fff';
  dialog.style.borderRadius = '1em';
  dialog.style.maxWidth = '340px';
  dialog.style.margin = 'auto';
  dialog.style.boxShadow = '0 2px 16px #0002';
  dialog.style.textAlign = 'center';
  dialog.innerHTML = `
    <div style="font-size:2em;">${country.flagImage ? `<img src='${country.flagImage}' alt='${country.name}' style='width:2em;height:2em;display:inline-block;vertical-align:middle;'/>` : ''} ${country.name}</div>
    <div style=\"margin-top:1em; font-size:1.1em;\">首都: <b>${capital}</b></div>
    <div style=\"margin-top:0.5em; font-size:1.1em;\">地域: <b>${subregion}</b></div>
    <div style=\"margin-top:0.5em; font-size:1.1em;\">面積: <b>${area}</b></div>
    <div style=\"margin-top:0.5em; font-size:1.1em;\">人口: <b>${population}</b></div>
    <div id=\"osm-map\" style=\"margin:1em auto 0 auto;width:300px;height:180px;border-radius:0.5em;overflow:hidden;\"></div>
    <button id=\"closeCountryStatsBtn\" style=\"margin-top:1.5em; padding:0.5em 2em; background:#2563eb; color:#fff; border:none; border-radius:0.5em; font-size:1em; cursor:pointer;\">閉じる</button>
  `;
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  // 地図描画
  setTimeout(() => {
    if (country.lat && country.lng && window.L) {
      const map = L.map('osm-map', { zoomControl: false, attributionControl: false });
      map.setView([country.lat, country.lng], 5);
      // 日本語地名タイル（osm-jp）
      L.tileLayer('https://tile.openstreetmap.jp/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors, osm.jp'
      }).addTo(map);
      L.marker([country.lat, country.lng]).addTo(map);
    } else {
      document.getElementById('osm-map').innerHTML = '<span style="color:#888">地図データなし</span>';
    }
  }, 0);
  dialog.querySelector('#closeCountryStatsBtn').onclick = (e) => {
    e.stopPropagation();
    overlay.remove();
  };
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}




window.addEventListener('DOMContentLoaded', () => {
  // CSVから国データを読み込む
  parseCSVCountries().then(() => {
    renderRegionButtons();
    renderIndicatorButtons();
    currentIndicator = indicators[0].key;
    renderRankingTable();
    renderCountryList();
  }).catch(err => console.error('Error loading countries:', err));
  
  // タブ切り替え機能
  const tabCountryList = document.getElementById('tabCountryList');
  const tabRanking = document.getElementById('tabRanking');
  const countryListTab = document.getElementById('countryListTab');
  const rankingTab = document.getElementById('rankingTab');
  
  tabCountryList.addEventListener('click', () => {
    // 国一覧タブをアクティブに
    tabCountryList.classList.add('border-blue-500', 'text-blue-600');
    tabCountryList.classList.remove('border-transparent', 'text-gray-500');
    tabRanking.classList.remove('border-blue-500', 'text-blue-600');
    tabRanking.classList.add('border-transparent', 'text-gray-500');
    
    countryListTab.classList.remove('hidden');
    rankingTab.classList.add('hidden');
  });
  
  tabRanking.addEventListener('click', () => {
    // 統計ランキングタブをアクティブに
    tabRanking.classList.add('border-blue-500', 'text-blue-600');
    tabRanking.classList.remove('border-transparent', 'text-gray-500');
    tabCountryList.classList.remove('border-blue-500', 'text-blue-600');
    tabCountryList.classList.add('border-transparent', 'text-gray-500');
    
    rankingTab.classList.remove('hidden');
    countryListTab.classList.add('hidden');
  });
});
