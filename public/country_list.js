// country_list.js
// main.jsのcountries[]を利用して国名と国旗画像を表示

// main.jsのcountries[]を参照するため、data.jsをimportし、同じAPIから取得する

// countries[]の取得（main.jsと同じAPIを使う）

// main.jsのcountries[]（region情報付き）から全ての国（name, flagImage, region）を抽出
const countries = [
  { name: "アメリカ合衆国", flagImage: "https://flagcdn.com/us.svg", region: "Americas" },
  { name: "メキシコ", flagImage: "https://flagcdn.com/mx.svg", region: "Americas" },
  { name: "カナダ", flagImage: "https://flagcdn.com/ca.svg", region: "Americas" },
  { name: "日本", flagImage: "https://flagcdn.com/jp.svg", region: "Asia" },
  { name: "イラン", flagImage: "https://flagcdn.com/ir.svg", region: "Asia" },
  { name: "韓国", flagImage: "https://flagcdn.com/kr.svg", region: "Asia" },
  { name: "オーストラリア", flagImage: "https://flagcdn.com/au.svg", region: "Oceania" },
  { name: "サウジアラビア", flagImage: "https://flagcdn.com/sa.svg", region: "Asia" },
  { name: "カタール", flagImage: "https://flagcdn.com/qa.svg", region: "Asia" },
  { name: "ヨルダン", flagImage: "https://flagcdn.com/jo.svg", region: "Asia" },
  { name: "ウズベキスタン", flagImage: "https://flagcdn.com/uz.svg", region: "Asia" },
  { name: "モロッコ", flagImage: "https://flagcdn.com/ma.svg", region: "Africa" },
  { name: "チュニジア", flagImage: "https://flagcdn.com/tn.svg", region: "Africa" },
  { name: "エジプト", flagImage: "https://flagcdn.com/eg.svg", region: "Africa" },
  { name: "アルジェリア", flagImage: "https://flagcdn.com/dz.svg", region: "Africa" },
  { name: "ガーナ", flagImage: "https://flagcdn.com/gh.svg", region: "Africa" },
  { name: "南アフリカ", flagImage: "https://flagcdn.com/za.svg", region: "Africa" },
  { name: "コートジボワール", flagImage: "https://flagcdn.com/ci.svg", region: "Africa" },
  { name: "セネガル", flagImage: "https://flagcdn.com/sn.svg", region: "Africa" },
  { name: "フランス", flagImage: "https://flagcdn.com/fr.svg", region: "Europe" },
  { name: "クロアチア", flagImage: "https://flagcdn.com/hr.svg", region: "Europe" },
  { name: "スペイン", flagImage: "https://flagcdn.com/es.svg", region: "Europe" },
  { name: "ポルトガル", flagImage: "https://flagcdn.com/pt.svg", region: "Europe" },
  { name: "ベルギー", flagImage: "https://flagcdn.com/be.svg", region: "Europe" },
  { name: "オーストリア", flagImage: "https://flagcdn.com/at.svg", region: "Europe" },
  { name: "ドイツ", flagImage: "https://flagcdn.com/de.svg", region: "Europe" },
  { name: "オランダ", flagImage: "https://flagcdn.com/nl.svg", region: "Europe" },
  { name: "ノルウェー", flagImage: "https://flagcdn.com/no.svg", region: "Europe" },
  { name: "イギリス", flagImage: "https://flagcdn.com/gb.svg", region: "Europe" },
  { name: "スイス", flagImage: "https://flagcdn.com/ch.svg", region: "Europe" },
  { name: "アルゼンチン", flagImage: "https://flagcdn.com/ar.svg", region: "Americas" },
  { name: "ブラジル", flagImage: "https://flagcdn.com/br.svg", region: "Americas" },
  { name: "コロンビア", flagImage: "https://flagcdn.com/co.svg", region: "Americas" },
  { name: "ウルグアイ", flagImage: "https://flagcdn.com/uy.svg", region: "Americas" },
  { name: "キュラソー", flagImage: "https://flagcdn.com/cw.svg", region: "Americas" },
  { name: "パナマ", flagImage: "https://flagcdn.com/pa.svg", region: "Americas" },
  { name: "コスタリカ", flagImage: "https://flagcdn.com/cr.svg", region: "Americas" },
  { name: "ドミニカ共和国", flagImage: "https://flagcdn.com/do.svg", region: "Americas" },
  { name: "ペルー", flagImage: "https://flagcdn.com/pe.svg", region: "Americas" },
  { name: "チリ", flagImage: "https://flagcdn.com/cl.svg", region: "Americas" },
  { name: "ボリビア", flagImage: "https://flagcdn.com/bo.svg", region: "Americas" },
  { name: "イタリア", flagImage: "https://flagcdn.com/it.svg", region: "Europe" },
  { name: "ロシア", flagImage: "https://flagcdn.com/ru.svg", region: "Europe" },
  { name: "スウェーデン", flagImage: "https://flagcdn.com/se.svg", region: "Europe" },
  { name: "ポーランド", flagImage: "https://flagcdn.com/pl.svg", region: "Europe" },
  { name: "ウクライナ", flagImage: "https://flagcdn.com/ua.svg", region: "Europe" },
  { name: "チェコ", flagImage: "https://flagcdn.com/cz.svg", region: "Europe" },
  { name: "アイルランド", flagImage: "https://flagcdn.com/ie.svg", region: "Europe" },
  { name: "フィンランド", flagImage: "https://flagcdn.com/fi.svg", region: "Europe" },
  { name: "デンマーク", flagImage: "https://flagcdn.com/dk.svg", region: "Europe" },
  { name: "ギリシャ", flagImage: "https://flagcdn.com/gr.svg", region: "Europe" },
  { name: "ハンガリー", flagImage: "https://flagcdn.com/hu.svg", region: "Europe" },
  { name: "中国", flagImage: "https://flagcdn.com/cn.svg", region: "Asia" },
  { name: "インド", flagImage: "https://flagcdn.com/in.svg", region: "Asia" },
  { name: "インドネシア", flagImage: "https://flagcdn.com/id.svg", region: "Asia" },
  { name: "トルコ", flagImage: "https://flagcdn.com/tr.svg", region: "Asia" },
  { name: "イスラエル", flagImage: "https://flagcdn.com/il.svg", region: "Asia" },
  { name: "パキスタン", flagImage: "https://flagcdn.com/pk.svg", region: "Asia" },
  { name: "バングラデシュ", flagImage: "https://flagcdn.com/bd.svg", region: "Asia" },
  { name: "ベトナム", flagImage: "https://flagcdn.com/vn.svg", region: "Asia" },
  { name: "タイ", flagImage: "https://flagcdn.com/th.svg", region: "Asia" },
  { name: "フィリピン", flagImage: "https://flagcdn.com/ph.svg", region: "Asia" },
  { name: "マレーシア", flagImage: "https://flagcdn.com/my.svg", region: "Asia" },
  { name: "シンガポール", flagImage: "https://flagcdn.com/sg.svg", region: "Asia" },
  { name: "カザフスタン", flagImage: "https://flagcdn.com/kz.svg", region: "Asia" },
  { name: "スリランカ", flagImage: "https://flagcdn.com/lk.svg", region: "Asia" },
  { name: "ナイジェリア", flagImage: "https://flagcdn.com/ng.svg", region: "Africa" },
  { name: "エチオピア", flagImage: "https://flagcdn.com/et.svg", region: "Africa" },
  { name: "ケニア", flagImage: "https://flagcdn.com/ke.svg", region: "Africa" },
  { name: "ニュージーランド", flagImage: "https://flagcdn.com/nz.svg", region: "Oceania" },
  { name: "パプアニューギニア", flagImage: "https://flagcdn.com/pg.svg", region: "Oceania" },
  { name: "スロバキア", flagImage: "https://flagcdn.com/sk.svg", region: "Europe" },
  { name: "スロベニア", flagImage: "https://flagcdn.com/si.svg", region: "Europe" },
  { name: "ルーマニア", flagImage: "https://flagcdn.com/ro.svg", region: "Europe" },
  { name: "ブルガリア", flagImage: "https://flagcdn.com/bg.svg", region: "Europe" },
  { name: "セルビア", flagImage: "https://flagcdn.com/rs.svg", region: "Europe" },
  { name: "エストニア", flagImage: "https://flagcdn.com/ee.svg", region: "Europe" },
  { name: "ラトビア", flagImage: "https://flagcdn.com/lv.svg", region: "Europe" },
  { name: "リトアニア", flagImage: "https://flagcdn.com/lt.svg", region: "Europe" },
  { name: "アルバニア", flagImage: "https://flagcdn.com/al.svg", region: "Europe" },
  { name: "北マケドニア", flagImage: "https://flagcdn.com/mk.svg", region: "Europe" },
  { name: "モンテネグロ", flagImage: "https://flagcdn.com/me.svg", region: "Europe" },
  { name: "モルドバ", flagImage: "https://flagcdn.com/md.svg", region: "Europe" },
  { name: "アイスランド", flagImage: "https://flagcdn.com/is.svg", region: "Europe" },
  { name: "ルクセンブルク", flagImage: "https://flagcdn.com/lu.svg", region: "Europe" },
  { name: "マルタ", flagImage: "https://flagcdn.com/mt.svg", region: "Europe" },
  { name: "キプロス", flagImage: "https://flagcdn.com/cy.svg", region: "Europe" },
  { name: "タンザニア", flagImage: "https://flagcdn.com/tz.svg", region: "Africa" },
  { name: "ウガンダ", flagImage: "https://flagcdn.com/ug.svg", region: "Africa" },
  { name: "ルワンダ", flagImage: "https://flagcdn.com/rw.svg", region: "Africa" },
  { name: "ザンビア", flagImage: "https://flagcdn.com/zm.svg", region: "Africa" },
  { name: "ジンバブエ", flagImage: "https://flagcdn.com/zw.svg", region: "Africa" },
  { name: "マラウイ", flagImage: "https://flagcdn.com/mw.svg", region: "Africa" },
  { name: "モザンビーク", flagImage: "https://flagcdn.com/mz.svg", region: "Africa" },
  { name: "ボツワナ", flagImage: "https://flagcdn.com/bw.svg", region: "Africa" },
  { name: "ナミビア", flagImage: "https://flagcdn.com/na.svg", region: "Africa" },
  { name: "エルサルバドル", flagImage: "https://flagcdn.com/sv.svg", region: "Americas" },
  { name: "ホンジュラス", flagImage: "https://flagcdn.com/hn.svg", region: "Americas" },
  { name: "ニカラグア", flagImage: "https://flagcdn.com/ni.svg", region: "Americas" },
  { name: "グアテマラ", flagImage: "https://flagcdn.com/gt.svg", region: "Americas" },
  { name: "ネパール", flagImage: "https://flagcdn.com/np.svg", region: "Asia" },
  { name: "ブータン", flagImage: "https://flagcdn.com/bt.svg", region: "Asia" },
  { name: "ミャンマー", flagImage: "https://flagcdn.com/mm.svg", region: "Asia" },
  { name: "カンボジア", flagImage: "https://flagcdn.com/kh.svg", region: "Asia" },
  { name: "ラオス", flagImage: "https://flagcdn.com/la.svg", region: "Asia" },
  { name: "モンゴル", flagImage: "https://flagcdn.com/mn.svg", region: "Asia" },
  { name: "フィジー", flagImage: "https://flagcdn.com/fj.svg", region: "Oceania" },
  { name: "ソロモン諸島", flagImage: "https://flagcdn.com/sb.svg", region: "Oceania" },
  { name: "バヌアツ", flagImage: "https://flagcdn.com/vu.svg", region: "Oceania" },
  { name: "サモア", flagImage: "https://flagcdn.com/ws.svg", region: "Oceania" },
  { name: "トンガ", flagImage: "https://flagcdn.com/to.svg", region: "Oceania" },
  { name: "スリナム", flagImage: "https://flagcdn.com/sr.svg", region: "Americas" },
  { name: "ガイアナ", flagImage: "https://flagcdn.com/gy.svg", region: "Americas" },
  { name: "ベリーズ", flagImage: "https://flagcdn.com/bz.svg", region: "Americas" },
  { name: "ハイチ", flagImage: "https://flagcdn.com/ht.svg", region: "Americas" },
  { name: "エクアドル", flagImage: "https://flagcdn.com/ec.svg", region: "Americas" },
  { name: "パラグアイ", flagImage: "https://flagcdn.com/py.svg", region: "Americas" },
  { name: "ベナン", flagImage: "https://flagcdn.com/bj.svg", region: "Africa" },
  { name: "トーゴ", flagImage: "https://flagcdn.com/tg.svg", region: "Africa" },
  { name: "ガボン", flagImage: "https://flagcdn.com/ga.svg", region: "Africa" },
  { name: "コンゴ共和国", flagImage: "https://flagcdn.com/cg.svg", region: "Africa" },
  { name: "赤道ギニア", flagImage: "https://flagcdn.com/gq.svg", region: "Africa" },
  { name: "カメルーン", flagImage: "https://flagcdn.com/cm.svg", region: "Africa" },
  { name: "セーシェル", flagImage: "https://flagcdn.com/sc.svg", region: "Africa" },
  { name: "モーリシャス", flagImage: "https://flagcdn.com/mu.svg", region: "Africa" },
  { name: "中央アフリカ共和国", flagImage: "https://flagcdn.com/cf.svg", region: "Africa" },
  { name: "南スーダン", flagImage: "https://flagcdn.com/ss.svg", region: "Africa" },
  { name: "チャド", flagImage: "https://flagcdn.com/td.svg", region: "Africa" },
  { name: "ニジェール", flagImage: "https://flagcdn.com/ne.svg", region: "Africa" },
  { name: "マリ", flagImage: "https://flagcdn.com/ml.svg", region: "Africa" },
  { name: "ブルキナファソ", flagImage: "https://flagcdn.com/bf.svg", region: "Africa" },
  { name: "ギニア", flagImage: "https://flagcdn.com/gn.svg", region: "Africa" },
  { name: "ギニアビサウ", flagImage: "https://flagcdn.com/gw.svg", region: "Africa" },
  { name: "シエラレオネ", flagImage: "https://flagcdn.com/sl.svg", region: "Africa" },
  { name: "リベリア", flagImage: "https://flagcdn.com/lr.svg", region: "Africa" },
  { name: "ガンビア", flagImage: "https://flagcdn.com/gm.svg", region: "Africa" },
  { name: "モーリタニア", flagImage: "https://flagcdn.com/mr.svg", region: "Africa" },
  { name: "東ティモール", flagImage: "https://flagcdn.com/tl.svg", region: "Asia" },
  { name: "コソボ", flagImage: "https://flagcdn.com/xk.svg", region: "Europe" },
  { name: "パレスチナ", flagImage: "https://flagcdn.com/ps.svg", region: "Asia" },
  { name: "ソマリア", flagImage: "https://flagcdn.com/so.svg", region: "Africa" },
  { name: "スーダン", flagImage: "https://flagcdn.com/sd.svg", region: "Africa" },
  { name: "イエメン", flagImage: "https://flagcdn.com/ye.svg", region: "Asia" },
  { name: "アフガニスタン", flagImage: "https://flagcdn.com/af.svg", region: "Asia" },
  { name: "タジキスタン", flagImage: "https://flagcdn.com/tj.svg", region: "Asia" },
  { name: "西サハラ", flagImage: "https://flagcdn.com/eh.svg", region: "Africa" },
  { name: "ブルネイ", flagImage: "https://flagcdn.com/bn.svg", region: "Asia" },
  { name: "モルディブ", flagImage: "https://flagcdn.com/mv.svg", region: "Asia" },
  { name: "サンマリノ", flagImage: "https://flagcdn.com/sm.svg", region: "Europe" },
  { name: "アンドラ", flagImage: "https://flagcdn.com/ad.svg", region: "Europe" },
  { name: "モナコ", flagImage: "https://flagcdn.com/mc.svg", region: "Europe" },
  { name: "リヒテンシュタイン", flagImage: "https://flagcdn.com/li.svg", region: "Europe" },
  { name: "バチカン市国", flagImage: "https://flagcdn.com/va.svg", region: "Europe" },
  { name: "キリバス", flagImage: "https://flagcdn.com/ki.svg", region: "Oceania" },
  { name: "ツバル", flagImage: "https://flagcdn.com/tv.svg", region: "Oceania" },
  { name: "ナウル", flagImage: "https://flagcdn.com/nr.svg", region: "Oceania" },
  { name: "ミクロネシア連邦", flagImage: "https://flagcdn.com/fm.svg", region: "Oceania" },
  { name: "マーシャル諸島", flagImage: "https://flagcdn.com/mh.svg", region: "Oceania" },
  { name: "パラオ", flagImage: "https://flagcdn.com/pw.svg", region: "Oceania" },
  { name: "サントメ・プリンシペ", flagImage: "https://flagcdn.com/st.svg", region: "Africa" },
  { name: "カーボベルデ", flagImage: "https://flagcdn.com/cv.svg", region: "Africa" },
  { name: "コモロ", flagImage: "https://flagcdn.com/km.svg", region: "Africa" },
  { name: "ジブチ", flagImage: "https://flagcdn.com/dj.svg", region: "Africa" },
  { name: "エリトリア", flagImage: "https://flagcdn.com/er.svg", region: "Africa" },
  { name: "レソト", flagImage: "https://flagcdn.com/ls.svg", region: "Africa" },
  { name: "エスワティニ", flagImage: "https://flagcdn.com/sz.svg", region: "Africa" },
  { name: "ブルンジ", flagImage: "https://flagcdn.com/bi.svg", region: "Africa" }
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
  allBtn.onclick = () => { currentRegion = 'all'; renderCountryList(); };
  regionDiv.appendChild(allBtn);
  regions.forEach(region => {
    const btn = document.createElement('button');
    btn.textContent = regionNameMap[region] || region;
    btn.className = 'px-3 py-1 m-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-300';
    btn.onclick = () => { currentRegion = region; renderCountryList(); };
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
    div.className = 'flex items-center gap-2 bg-white rounded shadow p-3';
    div.innerHTML = `
      ${c.flagImage ? `<img src="${c.flagImage}" alt="${c.name}" class="w-8 h-8 object-contain rounded border" />` : `<span class='w-8 h-8 flex items-center justify-center bg-gray-200 rounded border'>?</span>`}
      <span class="text-lg">${c.name}</span>
    `;
    listDiv.appendChild(div);
  });
}



window.addEventListener('DOMContentLoaded', () => {
  renderRegionButtons();
  renderCountryList();
});
