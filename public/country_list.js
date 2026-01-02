// country_list.js
// main.jsのcountries[]を利用して国名と国旗画像を表示
// 指標リスト
const indicators = [
  { key: 'area', label: '面積', unit: '千km²' },
  { key: 'population', label: '人口', unit: '万人' }
];
let currentIndicator = null;

function renderIndicatorButtons() {
  const indicatorDiv = document.getElementById('indicatorButtons');
  if (!indicatorDiv) return;
  indicatorDiv.innerHTML = '';
  indicators.forEach(ind => {
    const btn = document.createElement('button');
    btn.textContent = ind.label;
    btn.className = 'px-3 py-1 m-1 rounded bg-green-100 text-green-800 hover:bg-green-300';
    btn.onclick = () => {
      currentIndicator = ind.key;
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
  // regionでフィルタ
  const filtered = currentRegion === 'all' ? countries : countries.filter(c => c.region === currentRegion);
  // 指標で降順ソート
  const ranked = filtered
    .filter(c => typeof c[ind.key] === 'number')
    .sort((a, b) => b[ind.key] - a[ind.key]);
  // テーブル生成
  const table = document.createElement('table');
  table.className = 'min-w-full border border-gray-300 bg-white rounded';
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr class="bg-gray-200"><th class="px-2 py-1">順位</th><th class="px-2 py-1">国名</th><th class="px-2 py-1">${ind.label} (${ind.unit})</th></tr>`;
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  ranked.forEach((c, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="px-2 py-1 text-center">${i + 1}</td><td class="px-2 py-1">${c.name}</td><td class="px-2 py-1 text-right">${c[ind.key]}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableDiv.appendChild(table);
}

// main.jsのcountries[]を参照するため、data.jsをimportし、同じAPIから取得する

// countries[]の取得（main.jsと同じAPIを使う）

// main.jsのcountries[]（region情報付き）から全ての国（name, flagImage, region）を抽出
// area, populationも含める
const countries = [
  { name: "アメリカ合衆国", flagImage: "https://flagcdn.com/us.svg", region: "Americas", area: 9834, population: 33100, capital: "ワシントンD.C.", subregion: "北アメリカ", lat: 38.89511, lng: -77.03637 },
  { name: "メキシコ", flagImage: "https://flagcdn.com/mx.svg", region: "Americas", area: 1964, population: 12900, capital: "メキシコシティ", subregion: "北アメリカ", lat: 19.4326, lng: -99.1332 },
  { name: "カナダ", flagImage: "https://flagcdn.com/ca.svg", region: "Americas", area: 9985, population: 3800, capital: "オタワ", subregion: "北アメリカ", lat: 45.4215, lng: -75.6997 },
  { name: "日本", flagImage: "https://flagcdn.com/jp.svg", region: "Asia", area: 378, population: 12500, capital: "東京", subregion: "東アジア", lat: 35.6895, lng: 139.6917 },
  { name: "イラン", flagImage: "https://flagcdn.com/ir.svg", region: "Asia", area: 1648, population: 8500, capital: "テヘラン", subregion: "西アジア", lat: 35.6892, lng: 51.3890 },
  { name: "韓国", flagImage: "https://flagcdn.com/kr.svg", region: "Asia", area: 100, population: 5200, capital: "ソウル", subregion: "東アジア", lat: 37.5665, lng: 126.9780 },
  { name: "オーストラリア", flagImage: "https://flagcdn.com/au.svg", region: "Oceania", area: 7692, population: 2600, capital: "キャンベラ", subregion: "オーストラリア・ニュージーランド" },
  { name: "サウジアラビア", flagImage: "https://flagcdn.com/sa.svg", region: "Asia", area: 2149, population: 3600, capital: "リヤド", subregion: "西アジア" },
  { name: "カタール", flagImage: "https://flagcdn.com/qa.svg", region: "Asia", area: 12, population: 300, capital: "ドーハ", subregion: "西アジア" },
  { name: "ヨルダン", flagImage: "https://flagcdn.com/jo.svg", region: "Asia", area: 89, population: 1000, capital: "アンマン", subregion: "西アジア" },
  { name: "ウズベキスタン", flagImage: "https://flagcdn.com/uz.svg", region: "Asia", area: 447, population: 3400, capital: "タシュケント", subregion: "中央アジア" },
  { name: "モロッコ", flagImage: "https://flagcdn.com/ma.svg", region: "Africa", area: 447, population: 3700, capital: "ラバト", subregion: "北アフリカ" },
  { name: "チュニジア", flagImage: "https://flagcdn.com/tn.svg", region: "Africa", area: 164, population: 1200, capital: "チュニス", subregion: "北アフリカ" },
  { name: "エジプト", flagImage: "https://flagcdn.com/eg.svg", region: "Africa", area: 1002, population: 10400, capital: "カイロ", subregion: "北アフリカ" },
  { name: "アルジェリア", flagImage: "https://flagcdn.com/dz.svg", region: "Africa", area: 2382, population: 4400, capital: "アルジェ", subregion: "北アフリカ" },
  { name: "ガーナ", flagImage: "https://flagcdn.com/gh.svg", region: "Africa", area: 239, population: 3200, capital: "アクラ", subregion: "西アフリカ" },
  { name: "南アフリカ", flagImage: "https://flagcdn.com/za.svg", region: "Africa", area: 1221, population: 6000, capital: "プレトリア", subregion: "南部アフリカ" },
  { name: "コートジボワール", flagImage: "https://flagcdn.com/ci.svg", region: "Africa", area: 322, population: 2700, capital: "ヤムスクロ", subregion: "西アフリカ" },
  { name: "セネガル", flagImage: "https://flagcdn.com/sn.svg", region: "Africa", area: 197, population: 1700, capital: "ダカール", subregion: "西アフリカ" },
  { name: "フランス", flagImage: "https://flagcdn.com/fr.svg", region: "Europe", area: 551, population: 6700, capital: "パリ", subregion: "西ヨーロッパ" },
  { name: "クロアチア", flagImage: "https://flagcdn.com/hr.svg", region: "Europe", area: 57, population: 400, capital: "ザグレブ", subregion: "東ヨーロッパ" },
  { name: "スペイン", flagImage: "https://flagcdn.com/es.svg", region: "Europe", area: 505, population: 4700, capital: "マドリード", subregion: "南ヨーロッパ" },
  { name: "ポルトガル", flagImage: "https://flagcdn.com/pt.svg", region: "Europe", area: 92, population: 1000, capital: "リスボン", subregion: "南ヨーロッパ" },
  { name: "ベルギー", flagImage: "https://flagcdn.com/be.svg", region: "Europe", area: 31, population: 1200, capital: "ブリュッセル", subregion: "西ヨーロッパ" },
  { name: "オーストリア", flagImage: "https://flagcdn.com/at.svg", region: "Europe", area: 84, population: 900, capital: "ウィーン", subregion: "西ヨーロッパ" },
  { name: "ドイツ", flagImage: "https://flagcdn.com/de.svg", region: "Europe", area: 357, population: 8300, capital: "ベルリン", subregion: "西ヨーロッパ" },
  { name: "オランダ", flagImage: "https://flagcdn.com/nl.svg", region: "Europe", area: 42, population: 1700, capital: "アムステルダム", subregion: "西ヨーロッパ" },
  { name: "ノルウェー", flagImage: "https://flagcdn.com/no.svg", region: "Europe", area: 385, population: 500, capital: "オスロ", subregion: "北ヨーロッパ" },
  { name: "イギリス", flagImage: "https://flagcdn.com/gb.svg", region: "Europe", area: 243, population: 6700, capital: "ロンドン", subregion: "北ヨーロッパ" },
  { name: "スイス", flagImage: "https://flagcdn.com/ch.svg", region: "Europe", area: 41, population: 900, capital: "ベルン", subregion: "西ヨーロッパ" },
  // ...（他の国も同様にarea, population, capital, subregionをmain.jsから追加）
];



// regionリストを取得
const regionNameMap = {
  'Americas': 'アメリカ大陸',
  'Asia': 'アジア',
  'Oceania': 'オセアニア',
  'Africa': 'アフリカ',
  'Europe': 'ヨーロッパ'
};
const regions = Array.from(new Set(countries.map(c => c.region))).filter(Boolean);

let currentRegion = 'all';

function renderRegionButtons() {
  const regionDiv = document.getElementById('regionButtons');
  if (!regionDiv) return;
  regionDiv.innerHTML = '';
  // 「すべて」ボタン
  const allBtn = document.createElement('button');
  allBtn.textContent = 'すべて';
  allBtn.className = 'px-3 py-1 m-1 rounded bg-blue-500 text-white hover:bg-blue-700';
  allBtn.onclick = () => { currentRegion = 'all'; renderCountryList(); renderRankingTable(); };
  regionDiv.appendChild(allBtn);
  regions.forEach(region => {
    const btn = document.createElement('button');
    btn.textContent = regionNameMap[region] || region;
    btn.className = 'px-3 py-1 m-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-300';
    btn.onclick = () => { currentRegion = region; renderCountryList(); renderRankingTable(); };
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
    div.className = 'flex items-center gap-2 bg-white rounded shadow p-3 cursor-pointer hover:bg-blue-50';
    div.innerHTML = `
      ${c.flagImage ? `<img src="${c.flagImage}" alt="${c.name}" class="w-8 h-8 object-contain rounded border" />` : `<span class='w-8 h-8 flex items-center justify-center bg-gray-200 rounded border'>?</span>`}
      <span class="text-lg">${c.name}</span>
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
  renderRegionButtons();
  renderIndicatorButtons();
  currentIndicator = indicators[0].key;
  renderRankingTable();
  renderCountryList();
});
