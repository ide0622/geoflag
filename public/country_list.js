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
  const filtered = currentRegion === 'all' ? countries : countries.filter(c => c.region === currentRegion);
  const ranked = filtered
    .filter(c => typeof c[ind.key] === 'number')
    .sort((a, b) => b[ind.key] - a[ind.key]);
  const table = document.createElement('table');
  table.className = 'min-w-full border border-gray-200 bg-white rounded-lg shadow-sm overflow-hidden';
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr class="bg-blue-50 text-blue-900">
    <th class="px-3 py-2 font-semibold text-sm">順位</th>
    <th class="px-3 py-2 font-semibold text-sm">国名</th>
    <th class="px-3 py-2 font-semibold text-sm">${ind.label} (${ind.unit})</th>
  </tr>`;
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  ranked.forEach((c, i) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-blue-100 transition';
    tr.innerHTML = `
      <td class="px-3 py-2 text-center">
        <span class="inline-block bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1">${i + 1}</span>
      </td>
      <td class="px-3 py-2 flex items-center gap-2">
        ${c.flagImage ? `<img src='${c.flagImage}' alt='${c.name}' class='w-6 h-6 object-contain' style='display:inline-block;vertical-align:middle;border-radius:0.2em;'/>` : ''}
        <span>${c.name}</span>
      </td>
      <td class="px-3 py-2 text-right font-mono">${c[ind.key]}</td>
    `;
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
  { name: "ロシア", flagImage: "https://flagcdn.com/ru.svg", region: "Europe", area: 17098, population: 14600, capital: "モスクワ", subregion: "東ヨーロッパ", lat: 55.7558, lng: 37.6173 },
  { name: "トルコ", flagImage: "https://flagcdn.com/tr.svg", region: "Asia", area: 783, population: 8200, capital: "アンカラ", subregion: "西アジア", lat: 39.9334, lng: 32.8597 },
  { name: "アルゼンチン", flagImage: "https://flagcdn.com/ar.svg", region: "Americas", area: 2780, population: 4500, capital: "ブエノスアイレス", subregion: "南アメリカ", lat: -34.6037, lng: -58.3816 },
  { name: "スウェーデン", flagImage: "https://flagcdn.com/se.svg", region: "Europe", area: 450, population: 1000, capital: "ストックホルム", subregion: "北ヨーロッパ", lat: 59.3293, lng: 18.0686 },
  { name: "ポーランド", flagImage: "https://flagcdn.com/pl.svg", region: "Europe", area: 313, population: 3800, capital: "ワルシャワ", subregion: "東ヨーロッパ", lat: 52.2297, lng: 21.0122 },
  { name: "ギリシャ", flagImage: "https://flagcdn.com/gr.svg", region: "Europe", area: 132, population: 1070, capital: "アテネ", subregion: "南ヨーロッパ", lat: 37.9838, lng: 23.7275 },
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
    { name: "中国", flagImage: "https://flagcdn.com/cn.svg", region: "Asia", area: 9597, population: 141200, capital: "北京", subregion: "東アジア", lat: 39.9042, lng: 116.4074 },
    { name: "インド", flagImage: "https://flagcdn.com/in.svg", region: "Asia", area: 3287, population: 139000, capital: "ニューデリー", subregion: "南アジア", lat: 28.6139, lng: 77.2090 },
    { name: "バングラデシュ", flagImage: "https://flagcdn.com/bd.svg", region: "Asia", area: 148, population: 16600, capital: "ダッカ", subregion: "南アジア", lat: 23.8103, lng: 90.4125 },
    { name: "ベトナム", flagImage: "https://flagcdn.com/vn.svg", region: "Asia", area: 331, population: 9800, capital: "ハノイ", subregion: "東南アジア", lat: 21.0285, lng: 105.8542 },
    { name: "タイ", flagImage: "https://flagcdn.com/th.svg", region: "Asia", area: 513, population: 7000, capital: "バンコク", subregion: "東南アジア", lat: 13.7563, lng: 100.5018 },
    { name: "フィリピン", flagImage: "https://flagcdn.com/ph.svg", region: "Asia", area: 300, population: 11100, capital: "マニラ", subregion: "東南アジア", lat: 14.5995, lng: 120.9842 },
    { name: "マレーシア", flagImage: "https://flagcdn.com/my.svg", region: "Asia", area: 330, population: 3300, capital: "クアラルンプール", subregion: "東南アジア", lat: 3.139, lng: 101.6869 },
    { name: "シンガポール", flagImage: "https://flagcdn.com/sg.svg", region: "Asia", area: 0.72, population: 600, capital: "シンガポール", subregion: "東南アジア", lat: 1.3521, lng: 103.8198 },
    { name: "パキスタン", flagImage: "https://flagcdn.com/pk.svg", region: "Asia", area: 881, population: 22500, capital: "イスラマバード", subregion: "南アジア", lat: 33.6844, lng: 73.0479 },
    { name: "インドネシア", flagImage: "https://flagcdn.com/id.svg", region: "Asia", area: 1910, population: 27300, capital: "ジャカルタ", subregion: "東南アジア", lat: -6.2088, lng: 106.8456 },
    { name: "ネパール", flagImage: "https://flagcdn.com/np.svg", region: "Asia", area: 147, population: 3000, capital: "カトマンズ", subregion: "南アジア", lat: 27.7172, lng: 85.3240 },
    { name: "スリランカ", flagImage: "https://flagcdn.com/lk.svg", region: "Asia", area: 66, population: 2100, capital: "コロンボ", subregion: "南アジア", lat: 6.9271, lng: 79.8612 },
    { name: "カザフスタン", flagImage: "https://flagcdn.com/kz.svg", region: "Asia", area: 2725, population: 1900, capital: "アスタナ", subregion: "中央アジア", lat: 51.1694, lng: 71.4491 },
    { name: "モンゴル", flagImage: "https://flagcdn.com/mn.svg", region: "Asia", area: 1564, population: 300, capital: "ウランバートル", subregion: "東アジア", lat: 47.8864, lng: 106.9057 },
    { name: "サモア", flagImage: "https://flagcdn.com/ws.svg", region: "Oceania", area: 2.8, population: 21, capital: "アピア", subregion: "ポリネシア", lat: -13.8507, lng: -171.7514 },
    { name: "ニュージーランド", flagImage: "https://flagcdn.com/nz.svg", region: "Oceania", area: 268, population: 500, capital: "ウェリントン", subregion: "オーストラリア・ニュージーランド", lat: -41.2865, lng: 174.7762 },
    { name: "パプアニューギニア", flagImage: "https://flagcdn.com/pg.svg", region: "Oceania", area: 463, population: 900, capital: "ポートモレスビー", subregion: "メラネシア", lat: -9.4438, lng: 147.1803 },
    { name: "フィジー", flagImage: "https://flagcdn.com/fj.svg", region: "Oceania", area: 18, population: 90, capital: "スバ", subregion: "メラネシア", lat: -18.1248, lng: 178.4501 },
    { name: "ソロモン諸島", flagImage: "https://flagcdn.com/sb.svg", region: "Oceania", area: 29, population: 70, capital: "ホニアラ", subregion: "メラネシア", lat: -9.4456, lng: 159.9729 },
    { name: "バヌアツ", flagImage: "https://flagcdn.com/vu.svg", region: "Oceania", area: 12, population: 32, capital: "ポートビラ", subregion: "メラネシア", lat: -17.7333, lng: 168.3273 },
    { name: "トンガ", flagImage: "https://flagcdn.com/to.svg", region: "Oceania", area: 0.7, population: 10, capital: "ヌクアロファ", subregion: "ポリネシア", lat: -21.1394, lng: -175.2044 },
    { name: "キプロス", flagImage: "https://flagcdn.com/cy.svg", region: "Europe", area: 9.3, population: 140, capital: "ニコシア", subregion: "南ヨーロッパ", lat: 35.1856, lng: 33.3823 },
    { name: "アイスランド", flagImage: "https://flagcdn.com/is.svg", region: "Europe", area: 103, population: 39, capital: "レイキャビク", subregion: "北ヨーロッパ", lat: 64.1265, lng: -21.8174 },
    { name: "ルクセンブルク", flagImage: "https://flagcdn.com/lu.svg", region: "Europe", area: 2.6, population: 70, capital: "ルクセンブルク", subregion: "西ヨーロッパ", lat: 49.8153, lng: 6.1296 },
    { name: "マルタ", flagImage: "https://flagcdn.com/mt.svg", region: "Europe", area: 0.32, population: 60, capital: "バレッタ", subregion: "南ヨーロッパ", lat: 35.8989, lng: 14.5146 },
    { name: "エストニア", flagImage: "https://flagcdn.com/ee.svg", region: "Europe", area: 45, population: 130, capital: "タリン", subregion: "北ヨーロッパ", lat: 59.437, lng: 24.7536 },
    { name: "ラトビア", flagImage: "https://flagcdn.com/lv.svg", region: "Europe", area: 64, population: 190, capital: "リガ", subregion: "北ヨーロッパ", lat: 56.9496, lng: 24.1052 },
    { name: "リトアニア", flagImage: "https://flagcdn.com/lt.svg", region: "Europe", area: 65, population: 280, capital: "ビリニュス", subregion: "北ヨーロッパ", lat: 54.6872, lng: 25.2797 },
    { name: "スロバキア", flagImage: "https://flagcdn.com/sk.svg", region: "Europe", area: 49, population: 540, capital: "ブラチスラヴァ", subregion: "東ヨーロッパ", lat: 48.1486, lng: 17.1077 },
    { name: "スロベニア", flagImage: "https://flagcdn.com/si.svg", region: "Europe", area: 20, population: 210, capital: "リュブリャナ", subregion: "南ヨーロッパ", lat: 46.0569, lng: 14.5058 },
    { name: "ルーマニア", flagImage: "https://flagcdn.com/ro.svg", region: "Europe", area: 238, population: 1900, capital: "ブカレスト", subregion: "東ヨーロッパ", lat: 44.4268, lng: 26.1025 },
    { name: "ブルガリア", flagImage: "https://flagcdn.com/bg.svg", region: "Europe", area: 111, population: 700, capital: "ソフィア", subregion: "東ヨーロッパ", lat: 42.6977, lng: 23.3219 },
    { name: "セルビア", flagImage: "https://flagcdn.com/rs.svg", region: "Europe", area: 88, population: 700, capital: "ベオグラード", subregion: "南ヨーロッパ", lat: 44.7866, lng: 20.4489 },
    { name: "モンテネグロ", flagImage: "https://flagcdn.com/me.svg", region: "Europe", area: 14, population: 62, capital: "ポドゴリツァ", subregion: "南ヨーロッパ", lat: 42.4304, lng: 19.2594 },
    { name: "北マケドニア", flagImage: "https://flagcdn.com/mk.svg", region: "Europe", area: 26, population: 208, capital: "スコピエ", subregion: "南ヨーロッパ", lat: 41.9973, lng: 21.4280 },
    { name: "アルバニア", flagImage: "https://flagcdn.com/al.svg", region: "Europe", area: 29, population: 287, capital: "ティラナ", subregion: "南ヨーロッパ", lat: 41.3275, lng: 19.8187 },
    { name: "モルドバ", flagImage: "https://flagcdn.com/md.svg", region: "Europe", area: 34, population: 260, capital: "キシナウ", subregion: "東ヨーロッパ", lat: 47.0105, lng: 28.8638 },
    { name: "ベラルーシ", flagImage: "https://flagcdn.com/by.svg", region: "Europe", area: 208, population: 940, capital: "ミンスク", subregion: "東ヨーロッパ", lat: 53.9045, lng: 27.5615 },
    { name: "ハンガリー", flagImage: "https://flagcdn.com/hu.svg", region: "Europe", area: 93, population: 970, capital: "ブダペスト", subregion: "東ヨーロッパ", lat: 47.4979, lng: 19.0402 },
    { name: "ボツワナ", flagImage: "https://flagcdn.com/bw.svg", region: "Africa", area: 582, population: 230, capital: "ハボローネ", subregion: "南部アフリカ", lat: -24.6282, lng: 25.9231 },
    { name: "ナミビア", flagImage: "https://flagcdn.com/na.svg", region: "Africa", area: 825, population: 250, capital: "ウィントフック", subregion: "南部アフリカ", lat: -22.5597, lng: 17.0832 },
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
