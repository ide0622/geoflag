// country_list.js
// main.jsのcountries[]を利用して国名と国旗画像を表示
// 指標リスト
const indicators = [
  { key: 'area', label: '面積', unit: '千km²', minValue: 0, maxValue: 20000 },
  { key: 'population', label: '人口', unit: '万人', minValue: 0, maxValue: 2000 },
  { key: 'life', label: '平均寿命', unit: '年', minValue: 0, maxValue: 130 },
  { key: 'gdp', label: 'GDP', unit: '百万US$', minValue: 0, maxValue: 40000000 },
  { key: 'medals', label: 'メダル数', unit: '', minValue: 0, maxValue: 10000 },
  { key: 'passport', label: 'パスポート', unit: '', minValue: 0, maxValue: 250 },
  { key: 'tourists', label: '観光客数', unit: '', minValue: 0, maxValue: 200000 },
  { key: 'rain', label: '降水量', unit: 'mm', minValue: 0, maxValue: 15000 },
  { key: 'altitude', label: '平均標高', unit: 'm', minValue: -500, maxValue: 9000 },
  { key: 'rice', label: '米の消費量', unit: 't', minValue: 0, maxValue: 300000000 },
  { key: 'internet', label: 'インターネット普及率', unit: '%', minValue: 0, maxValue: 100 },
  { key: 'wheat', label: '小麦の消費量', unit: 't', minValue: 0, maxValue: 200000000 },
  { key: 'temp', label: '平均気温', unit: '℃', minValue: -50, maxValue: 60 },
  { key: 'bigmac', label: 'ビッグマック指数', unit: 'US$', minValue: 0, maxValue: 20 },
  { key: 'sleep', label: '睡眠時間', unit: 'h', minValue: 0, maxValue: 1440 },
  { key: 'heritage', label: '世界遺産数', unit: '件', minValue: 0, maxValue: 200 },
  { key: 'happiness', label: '幸福度', unit: '', minValue: 0, maxValue: 10 }
];

// モバイル(SP)用: 指標カテゴリ（階層表示）
const indicatorCategories = [
  { key: 'geo', label: '地理', items: ['area', 'altitude', 'temp', 'rain'] },
  { key: 'soc', label: '人口・社会', items: ['population', 'life', 'internet', 'sleep', 'happiness'] },
  { key: 'eco', label: '経済', items: ['gdp', 'bigmac'] },
  { key: 'tour', label: '観光・遺産', items: ['tourists', 'heritage'] },
  { key: 'food', label: '食', items: ['rice', 'wheat'] },
  { key: 'other', label: 'その他', items: ['medals', 'passport'] }
];

// geodata.csvからすべての国データを読み込む
let countries = [];

function parseCsvLine(line) {
  const cols = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cols.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cols.push(current);
  return cols;
}

function toNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function sanitizeValue(indicatorKey, value) {
  const indicator = indicators.find((item) => item.key === indicatorKey);
  if (value === null || !indicator) return value;
  if (typeof indicator.minValue === 'number' && value < indicator.minValue) return null;
  if (typeof indicator.maxValue === 'number' && value > indicator.maxValue) return null;
  return value;
}

function normalizeCsvCells(cells, expectedLength) {
  const normalized = cells.slice();
  while (normalized.length > expectedLength && normalized[normalized.length - 1] === '') {
    normalized.pop();
  }
  if (
    normalized.length === expectedLength - 1 &&
    toNumber(normalized[15]) !== null &&
    toNumber(normalized[15]) >= 200 &&
    toNumber(normalized[16]) !== null &&
    toNumber(normalized[16]) >= 40 &&
    toNumber(normalized[16]) <= 95
  ) {
    normalized.splice(15, 0, '');
  }
  while (normalized.length < expectedLength) {
    normalized.push('');
  }
  return normalized.slice(0, expectedLength);
}

function parseCSVCountries() {
  return fetch('geodata.csv')
    .then(res => res.text())
    .then(csv => {
      const lines = csv.split(/\r?\n/).filter(line => line.trim());
      const header = parseCsvLine(lines[0]);
      const expectedLength = header.length;
      
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
        const cols = normalizeCsvCells(parseCsvLine(lines[i]), expectedLength);
        if (cols.length < 10) continue;
        
        const country = {
          name: cols[nameIdx] || '',
          flagImage: `https://flagcdn.com/${cols[codeIdx]?.toLowerCase() || 'xx'}.svg`,
          code: cols[codeIdx] || '',
          region: cols[regionIdx] || '',
          subregion: cols[subregionIdx] || '',
          capital: cols[capitalIdx] || '',
          area: sanitizeValue('area', toNumber(cols[areaIdx])) || 0,
          population: sanitizeValue('population', toNumber(cols[populationIdx])) || 0,
          lat: toNumber(cols[latIdx]) || 0,
          lng: toNumber(cols[lngIdx]) || 0
        };
        
        // 統計データを追加
        const life = sanitizeValue('life', toNumber(cols[lifeIdx]));
        if (life !== null) country.life = life;
        const gdp = sanitizeValue('gdp', toNumber(cols[gdpIdx]));
        if (gdp !== null) country.gdp = Math.round(gdp / 1000);
        const medals = sanitizeValue('medals', toNumber(cols[medalsIdx]));
        if (medals !== null) country.medals = medals;
        const passport = sanitizeValue('passport', toNumber(cols[passportIdx]));
        if (passport !== null) country.passport = passport;
        const tourists = sanitizeValue('tourists', toNumber(cols[touristsIdx]));
        if (tourists !== null) country.tourists = tourists;
        const rain = sanitizeValue('rain', toNumber(cols[rainIdx]));
        if (rain !== null) country.rain = rain;
        const altitude = sanitizeValue('altitude', toNumber(cols[altitudeIdx]));
        if (altitude !== null) country.altitude = altitude;
        const rice = sanitizeValue('rice', toNumber(cols[riceIdx]));
        if (rice !== null) country.rice = rice;
        const internet = sanitizeValue('internet', toNumber(cols[internetIdx]));
        if (internet !== null) country.internet = internet;
        const wheat = sanitizeValue('wheat', toNumber(cols[wheatIdx]));
        if (wheat !== null) country.wheat = wheat;
        const temp = sanitizeValue('temp', toNumber(cols[tempIdx]));
        if (temp !== null) country.temp = temp;
        const bigmac = sanitizeValue('bigmac', toNumber(cols[bigmacIdx]));
        if (bigmac !== null) country.bigmac = bigmac;
        const sleep = sanitizeValue('sleep', toNumber(cols[sleepIdx]));
        if (sleep !== null) country.sleep = sleep;
        const heritage = sanitizeValue('heritage', toNumber(cols[heritageIdx]));
        if (heritage !== null) country.heritage = heritage;
        const happiness = sanitizeValue('happiness', toNumber(cols[happinessIdx]));
        if (happiness !== null) country.happiness = happiness;
        
        if (country.name) {
          countries.push(country);
        }
      }
      
      return countries;
    });
}
let currentIndicator = null;
let currentIndicatorCategory = null; // SP用: 展開中カテゴリ

function renderIndicatorButtons() {
  const indicatorDiv = document.getElementById('indicatorButtons');
  if (!indicatorDiv) return;
  indicatorDiv.innerHTML = '';

  const isMobile = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;

  if (!isMobile) {
    // PC: 従来のフラットなボタン群
    const wrap = document.createElement('div');
    wrap.className = 'flex flex-wrap gap-2';
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
      wrap.appendChild(btn);
    });
    indicatorDiv.appendChild(wrap);
    return;
  }

  // SP: カテゴリ → サブ指標の二層表示
  const categoryBar = document.createElement('div');
  categoryBar.className = '-mx-4 px-4 flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1';
  indicatorCategories.forEach(cat => {
    const isOpen = currentIndicatorCategory === cat.key;
    const btn = document.createElement('button');
    btn.textContent = cat.label;
    btn.className = (isOpen ? 'bg-blue-500 text-white ' : 'bg-blue-100 text-blue-800 ') +
      'px-4 py-2 rounded-lg font-semibold shadow-sm transition-all duration-200 hover:bg-blue-200 flex-shrink-0 snap-start';
    btn.onclick = () => {
      currentIndicatorCategory = (currentIndicatorCategory === cat.key ? null : cat.key);
      renderIndicatorButtons();
    };
    categoryBar.appendChild(btn);
  });
  indicatorDiv.appendChild(categoryBar);

  // サブ指標（選択中のカテゴリのみ展開）
  if (currentIndicatorCategory) {
    const cat = indicatorCategories.find(c => c.key === currentIndicatorCategory);
    if (cat) {
      const sub = document.createElement('div');
      sub.className = 'mt-2 flex flex-wrap gap-2';
      cat.items.forEach(key => {
        const ind = indicators.find(i => i.key === key);
        if (!ind) return;
        const isActive = currentIndicator === ind.key;
        const b = document.createElement('button');
        b.textContent = ind.label;
        b.className = isActive
          ? 'px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow transition hover:bg-blue-700'
          : 'px-3 py-2 rounded-lg bg-blue-50 text-blue-800 text-sm font-semibold shadow-sm transition hover:bg-blue-100';
        b.onclick = () => {
          currentIndicator = ind.key;
          renderIndicatorButtons();
          renderRankingTable();
        };
        sub.appendChild(b);
      });
      indicatorDiv.appendChild(sub);
    }
  }
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
  // SPでは横スクロールできるよう最小幅を確保＆改行禁止
  table.className = 'min-w-[400px] sm:min-w-full border border-gray-200 bg-white rounded-lg shadow-md overflow-hidden whitespace-nowrap';
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
    <th class="px-2 sm:px-4 py-3 font-bold text-sm whitespace-nowrap w-[40px] sm:w-auto text-center">順位</th>
    <th class="px-2 sm:px-4 py-3 font-bold text-xs sm:text-sm text-left whitespace-nowrap w-[64px] sm:w-auto">国名</th>
    <th class="px-2 sm:px-4 py-3 font-bold text-xs sm:text-sm text-right whitespace-nowrap w-[100px] sm:w-auto">${ind.label} (${ind.unit})</th>
    <th class="px-2 sm:px-4 py-3 font-bold text-xs sm:text-sm whitespace-nowrap">1位の国に対する割合</th>
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
      <td class="px-2 sm:px-4 py-3 text-center whitespace-nowrap w-[40px] sm:w-auto">
        ${rankDisplay}
      </td>
      <td class="px-2 sm:px-4 py-3 whitespace-nowrap w-[64px] sm:w-auto">
        <div class="flex items-center gap-1 w-full">
          ${c.flagImage ? `<img src='${c.flagImage}' alt='${c.name}' class='w-6 h-4 object-contain rounded flex-shrink-0'/>` : ''}
          <span class="text-xs sm:text-sm font-semibold truncate min-w-0">${c.name}</span>
        </div>
      </td>
      <td class="px-2 sm:px-4 py-3 text-right whitespace-nowrap w-[100px] sm:w-auto">
        <span class="font-bold text-sm sm:text-lg text-blue-900">${c[ind.key].toLocaleString()}</span>
      </td>
      <td class="px-2 sm:px-4 py-3 whitespace-nowrap">
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
  // 横スクロール用ラッパー（SPのみ有効）
  const wrapper = document.createElement('div');
  wrapper.className = 'overflow-x-auto sm:overflow-visible -mx-4 sm:mx-0';
  wrapper.appendChild(table);
  tableDiv.appendChild(wrapper);
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
      L.polyline([[0, -180], [0, 180]], {
        color: '#ef4444',
        weight: 1,
        opacity: 0.22,
        interactive: false
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
  const tabStatsMap = document.getElementById('tabStatsMap');
  const countryListTab = document.getElementById('countryListTab');
  const rankingTab = document.getElementById('rankingTab');
  const statsMapTab = document.getElementById('statsMapTab');
  const regionSection = document.getElementById('regionSection');
  let statsMapLoaded = false;

  const ALL_TABS = [tabCountryList, tabRanking, tabStatsMap];
  const ALL_CONTENTS = [countryListTab, rankingTab, statsMapTab];

  function activateTab(activeTab) {
    ALL_TABS.forEach(t => {
      t.classList.remove('border-blue-500', 'text-blue-600');
      t.classList.add('border-transparent', 'text-gray-500');
    });
    activeTab.classList.add('border-blue-500', 'text-blue-600');
    activeTab.classList.remove('border-transparent', 'text-gray-500');

    const idx = ALL_TABS.indexOf(activeTab);
    ALL_CONTENTS.forEach((c, i) => {
      if (i === idx) c.classList.remove('hidden');
      else c.classList.add('hidden');
    });

    // 地域フィルタは統計マップタブでは非表示
    if (regionSection) {
      if (activeTab === tabStatsMap) regionSection.classList.add('hidden');
      else regionSection.classList.remove('hidden');
    }
  }

  tabCountryList.addEventListener('click', () => activateTab(tabCountryList));
  tabRanking.addEventListener('click', () => activateTab(tabRanking));
  tabStatsMap.addEventListener('click', () => {
    activateTab(tabStatsMap);
    // 統計マップは初回クリック時にiframeをロード（遅延ロード）
    if (!statsMapLoaded) {
      document.getElementById('statsMapFrame').src = 'geo-stats-map.html?embedded=1';
      statsMapLoaded = true;
    }
  });
});
