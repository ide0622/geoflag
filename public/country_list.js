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
  { name: "オーストラリア", flagImage: "https://flagcdn.com/au.svg", region: "Oceania", area: 7692, population: 2600, capital: "キャンベラ", subregion: "オーストラリア・ニュージーランド", lat: -35.2809, lng: 149.1300 },
  { name: "サウジアラビア", flagImage: "https://flagcdn.com/sa.svg", region: "Asia", area: 2149, population: 3600, capital: "リヤド", subregion: "西アジア", lat: 24.7136, lng: 46.6753 },
  { name: "カタール", flagImage: "https://flagcdn.com/qa.svg", region: "Asia", area: 12, population: 300, capital: "ドーハ", subregion: "西アジア", lat: 25.276987, lng: 51.520008 },
  { name: "ヨルダン", flagImage: "https://flagcdn.com/jo.svg", region: "Asia", area: 89, population: 1000, capital: "アンマン", subregion: "西アジア", lat: 31.9539, lng: 35.9106 },
  { name: "ウズベキスタン", flagImage: "https://flagcdn.com/uz.svg", region: "Asia", area: 447, population: 3400, capital: "タシュケント", subregion: "中央アジア", lat: 41.2995, lng: 69.2401 },
  { name: "モロッコ", flagImage: "https://flagcdn.com/ma.svg", region: "Africa", area: 447, population: 3700, capital: "ラバト", subregion: "北アフリカ", lat: 34.020882, lng: -6.84165 },
  { name: "チュニジア", flagImage: "https://flagcdn.com/tn.svg", region: "Africa", area: 164, population: 1200, capital: "チュニス", subregion: "北アフリカ", lat: 36.8065, lng: 10.1815 },
  { name: "エジプト", flagImage: "https://flagcdn.com/eg.svg", region: "Africa", area: 1002, population: 10400, capital: "カイロ", subregion: "北アフリカ", lat: 30.0444, lng: 31.2357 },
  { name: "アルジェリア", flagImage: "https://flagcdn.com/dz.svg", region: "Africa", area: 2382, population: 4400, capital: "アルジェ", subregion: "北アフリカ", lat: 36.7538, lng: 3.0588 },
  { name: "ガーナ", flagImage: "https://flagcdn.com/gh.svg", region: "Africa", area: 239, population: 3200, capital: "アクラ", subregion: "西アフリカ", lat: 5.6037, lng: -0.1870 },
  { name: "南アフリカ", flagImage: "https://flagcdn.com/za.svg", region: "Africa", area: 1221, population: 6000, capital: "プレトリア", subregion: "南部アフリカ", lat: -25.7479, lng: 28.2293 },
  { name: "コートジボワール", flagImage: "https://flagcdn.com/ci.svg", region: "Africa", area: 322, population: 2700, capital: "ヤムスクロ", subregion: "西アフリカ", lat: 7.5460, lng: -5.5471 },
  { name: "セネガル", flagImage: "https://flagcdn.com/sn.svg", region: "Africa", area: 197, population: 1700, capital: "ダカール", subregion: "西アフリカ", lat: 14.6928, lng: -17.4467 },
  { name: "フランス", flagImage: "https://flagcdn.com/fr.svg", region: "Europe", area: 551, population: 6700, capital: "パリ", subregion: "西ヨーロッパ", lat: 48.8566, lng: 2.3522 },
  { name: "クロアチア", flagImage: "https://flagcdn.com/hr.svg", region: "Europe", area: 57, population: 400, capital: "ザグレブ", subregion: "東ヨーロッパ", lat: 45.8150, lng: 15.9819 },
  { name: "スペイン", flagImage: "https://flagcdn.com/es.svg", region: "Europe", area: 505, population: 4700, capital: "マドリード", subregion: "南ヨーロッパ", lat: 40.4168, lng: -3.7038 },
  { name: "ポルトガル", flagImage: "https://flagcdn.com/pt.svg", region: "Europe", area: 92, population: 1000, capital: "リスボン", subregion: "南ヨーロッパ", lat: 38.7223, lng: -9.1393 },
  { name: "ベルギー", flagImage: "https://flagcdn.com/be.svg", region: "Europe", area: 31, population: 1200, capital: "ブリュッセル", subregion: "西ヨーロッパ", lat: 50.8503, lng: 4.3517 },
  { name: "オーストリア", flagImage: "https://flagcdn.com/at.svg", region: "Europe", area: 84, population: 900, capital: "ウィーン", subregion: "西ヨーロッパ", lat: 48.2082, lng: 16.3738 },
  { name: "ドイツ", flagImage: "https://flagcdn.com/de.svg", region: "Europe", area: 357, population: 8300, capital: "ベルリン", subregion: "西ヨーロッパ", lat: 52.52, lng: 13.4050 },
  { name: "オランダ", flagImage: "https://flagcdn.com/nl.svg", region: "Europe", area: 42, population: 1700, capital: "アムステルダム", subregion: "西ヨーロッパ", lat: 52.3676, lng: 4.9041 },
  { name: "ノルウェー", flagImage: "https://flagcdn.com/no.svg", region: "Europe", area: 385, population: 500, capital: "オスロ", subregion: "北ヨーロッパ", lat: 59.9139, lng: 10.7522 },
  { name: "イギリス", flagImage: "https://flagcdn.com/gb.svg", region: "Europe", area: 243, population: 6700, capital: "ロンドン", subregion: "北ヨーロッパ", lat: 51.5074, lng: -0.1278 },
  { name: "スイス", flagImage: "https://flagcdn.com/ch.svg", region: "Europe", area: 41, population: 900, capital: "ベルン", subregion: "西ヨーロッパ", lat: 46.9480, lng: 7.4474 },
  { name: "イタリア", flagImage: "https://flagcdn.com/it.svg", region: "Europe", area: 301, population: 6000, capital: "ローマ", subregion: "南ヨーロッパ", lat: 41.9028, lng: 12.4964 },
  { name: "ブラジル", flagImage: "https://flagcdn.com/br.svg", region: "Americas", area: 8516, population: 21300, capital: "ブラジリア", subregion: "南アメリカ", lat: -15.7939, lng: -47.8828 },
  { name: "インド", flagImage: "https://flagcdn.com/in.svg", region: "Asia", area: 3287, population: 13900, capital: "ニューデリー", subregion: "南アジア", lat: 28.6139, lng: 77.2090 },
  { name: "ロシア", flagImage: "https://flagcdn.com/ru.svg", region: "Europe", area: 17098, population: 14600, capital: "モスクワ", subregion: "東ヨーロッパ" },
  { name: "トルコ", flagImage: "https://flagcdn.com/tr.svg", region: "Asia", area: 783, population: 8200, capital: "アンカラ", subregion: "西アジア" },
  { name: "インドネシア", flagImage: "https://flagcdn.com/id.svg", region: "Asia", area: 1910, population: 27300, capital: "ジャカルタ", subregion: "東南アジア" },
  { name: "アルゼンチン", flagImage: "https://flagcdn.com/ar.svg", region: "Americas", area: 2780, population: 4500, capital: "ブエノスアイレス", subregion: "南アメリカ" },
  { name: "スウェーデン", flagImage: "https://flagcdn.com/se.svg", region: "Europe", area: 450, population: 1000, capital: "ストックホルム", subregion: "北ヨーロッパ" },
  { name: "ポーランド", flagImage: "https://flagcdn.com/pl.svg", region: "Europe", area: 313, population: 3800, capital: "ワルシャワ", subregion: "東ヨーロッパ" },
  { name: "ギリシャ", flagImage: "https://flagcdn.com/gr.svg", region: "Europe", area: 132, population: 1070, capital: "アテネ", subregion: "南ヨーロッパ" },
  { name: "ウクライナ", flagImage: "https://flagcdn.com/ua.svg", region: "Europe", area: 604, population: 4400, capital: "キエフ", subregion: "東ヨーロッパ", lat: 49.0, lng: 32.0 },
  { name: "チェコ", flagImage: "https://flagcdn.com/cz.svg", region: "Europe", area: 79, population: 1100, capital: "プラハ", subregion: "中央ヨーロッパ", lat: 50.0, lng: 15.0 },
  { name: "アイルランド", flagImage: "https://flagcdn.com/ie.svg", region: "Europe", area: 70, population: 500, capital: "ダブリン", subregion: "北ヨーロッパ", lat: 53.0, lng: -8.0 },
  { name: "フィンランド", flagImage: "https://flagcdn.com/fi.svg", region: "Europe", area: 338, population: 600, capital: "ヘルシンキ", subregion: "北ヨーロッパ", lat: 64.0, lng: 26.0 },
  { name: "デンマーク", flagImage: "https://flagcdn.com/dk.svg", region: "Europe", area: 43, population: 600, capital: "コペンハーゲン", subregion: "北ヨーロッパ", lat: 56.0, lng: 10.0 },
  { name: "コロンビア", flagImage: "https://flagcdn.com/co.svg", region: "Americas", area: 1142, population: 5100, capital: "ボゴタ", subregion: "南アメリカ", lat: 4.0, lng: -72.0 },
  { name: "ペルー", flagImage: "https://flagcdn.com/pe.svg", region: "Americas", area: 1285, population: 3300, capital: "リマ", subregion: "南アメリカ", lat: -10.0, lng: -76.0 },
  { name: "チリ", flagImage: "https://flagcdn.com/cl.svg", region: "Americas", area: 756, population: 1900, capital: "サンティアゴ", subregion: "南アメリカ", lat: -30.0, lng: -71.0 },
  { name: "ボリビア", flagImage: "https://flagcdn.com/bo.svg", region: "Americas", area: 1099, population: 1200, capital: "スクレ", subregion: "南アメリカ", lat: -17.0, lng: -65.0 },
  { name: "ウルグアイ", flagImage: "https://flagcdn.com/uy.svg", region: "Americas", area: 176, population: 300, capital: "モンテビデオ", subregion: "南アメリカ", lat: -33.0, lng: -56.0 },
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
  renderRegionButtons();
  renderIndicatorButtons();
  currentIndicator = indicators[0].key;
  renderRankingTable();
  renderCountryList();
});
