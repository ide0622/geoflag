// ===== データ =====
let countries = [];
let allThemes = [];
let loserHighlightTimeout = null; // タイムアウトIDを保存




import { COUNTRY_GROUPS } from "./data.js";


// 30問のテーマリスト
const allThemeDefinitions = [
  { text:"面積が大きい", key:"area" },
  { text:"人口が多い", key:"population" },
  { text:"人口密度が高い", key:"density" },
  { text:"人口密度が低い", key:"densityLow" },
  { text:"面積が小さい", key:"areaSmall" },
  { text:"人口が少ない", key:"populationSmall" },
  { text:"北にある※(首都の位置)", key:"latitude" },
  { text:"南にある※(首都の位置)", key:"latitudeLow" },
  { text:"東にある※首都の位置 <日付変更線の西側が最も強い>", key:"longitude" },
  { text:"西にある※首都の位置 <日付変更線の東側が最も強い", key:"longitudeWest" },
  { text:"隣接国が多い", key:"borders" },
  { text:"隣接国が少ない", key:"bordersLow" },
  { text:"幸福度が高い", key:"happiness" },
  { text:"幸福度が低い", key:"happinessLow" },
  { text:"平均寿命が長い", key:"lifeExpectancy" },
  { text:"平均寿命が短い", key:"lifeExpectancyLow" },
  { text:"GDPが高い", key:"gdp" },
  { text:"GDPが低い", key:"gdpLow" },
  { text:"一人あたりGDPが高い", key:"gdpPerCapita" },
  { text:"一人あたりGDPが低い", key:"gdpPerCapitaLow" },
  { text:"オリンピックメダル数が多い", key:"olympicMedals" },
  { text:"世界遺産数が多い", key:"worldHeritage" },
  { text:"パスポートが強い ※国民がビザフリーで渡航できる国が多い", key:"passportVisaFree" },
  { text:"パスポートが弱い ※国民がビザフリーで渡航できる国が少ない", key:"passportVisaFreeLow" },
  { text:"観光客数が多い ※受入数", key:"tourismArrivals" },
  { text:"観光客数が少ない ※受入数", key:"tourismArrivalsLow" },
  { text:"年間降水量が多い ※2022年", key:"precipitation" },
  { text:"年間降水量が少ない ※2022年", key:"precipitationLow" },
  { text:"平均身長が高い", key:"averageHeight" },
  { text:"平均身長が低い", key:"averageHeightLow" },
  { text:"米の消費量が多い ※年間総量", key:"riceConsumption" },
  { text:"米の消費量が少ない ※年間総量", key:"riceConsumptionLow" },
  { text:"インターネット普及率が高い", key:"internetPenetration" },
  { text:"インターネット普及率が低い", key:"internetPenetrationLow" },
  { text:"小麦消費量が多い ※年間総量", key:"wheatConsumption" },
  { text:"小麦消費量が少ない ※年間総量", key:"wheatConsumptionLow" },
  { text:"平均気温が高い", key:"averageTemperature" },
  { text:"平均気温が低い", key:"averageTemperatureLow" },
  
  { text:"〇〇の位置に近い", key:"distanceFrom", targetCountry: null }, // targetCountryは動的に設定
  { text:"〇〇の面積に近い", key:"areaSimilarTo", targetCountry: null }, // targetCountryは動的に設定
];
// 難易度レベルの追加
const LEVELS = [
  { key: 'beginner', label: 'Level1', group: 'easy' },
  { key: 'intermediate', label: 'Level2', group: 'normal' },
  { key: 'advanced', label: 'Level3', group: 'hard' },
  { key: 'extreme', label: 'Level4', group: 'extreme' }, // 追加: Level4
];

// 2地点間の距離を計算（ハバーサイン公式）
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球の半径（km）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // 距離（km）
}

let themes = [];

// 選択状態
let cpuLevel = null; // beginner, intermediate, advanced
let selectedCountryGroup = null; // worldcup, easy, normal, hard
let selectedRoundCount = null; // 5 or 10


import { lifeExpectancyData } from "./data.js";
import { gdpData } from "./data.js";
import { happinessData } from "./data.js";
import { olympicMedalsData } from "./data.js";
import { worldHeritageData } from "./data.js";
import { passportVisaFreeData } from "./data.js";
import { tourismArrivalsData } from "./data.js";
import { precipitationData } from "./data.js";
import { averageHeightData } from "./data.js";
import { riceConsumptionData } from "./data.js";
import { internetPenetrationData } from "./data.js";
import { wheatConsumptionData } from "./data.js";
import { averageTemperatureData } from "./data.js";


// REST Countries APIからデータ取得
async function loadCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    
    // 国コードから国名へのマッピングを作成
    const codeToName = {};
    data.forEach(c => {
      codeToName[c.cca3] = c.translations?.jpn?.common || c.name.common;
    });
    
    countries = data
      .filter(c => c.population > 100000 && c.area > 0) // 小さすぎる国を除外
      .map(c => ({
        name: c.translations?.jpn?.common || c.name.common,
        flag: c.flag || "🏳️",
        flagImage: c.flags?.svg || `https://flagcdn.com/w640/${(c.cca2 || '').toLowerCase()}.png` || c.flags?.png || "",
        area: c.area || 0,
        population: Math.round(c.population / 10000) || 0, // 万人単位
        capital: (c.capital && c.capital[0]) ? c.capital[0] : "",
        region: c.region || "",
        subregion: c.subregion || "",
        timezones: (c.timezones || []).length,
        languages: Object.keys(c.languages || {}).length,
        borders: (c.borders || []).length,
        borderCountries: (c.borders || []).map(code => codeToName[code] || code).filter(n => n),
        cca2: c.cca2 || "",
        independent: c.independent ? 1 : 0,
        latitude: c.latlng ? c.latlng[0] : 0,
        longitude: c.latlng ? c.latlng[1] : 0,
        continents: (c.continents || []).length,
        currencies: Object.keys(c.currencies || {}).length,
        callingCode: c.idd?.root ? (c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : "")).replace(/\D/g, "") : "0",
        carSide: c.car?.side === "right" ? 1 : 0,
        startOfWeek: c.startOfWeek === "monday" ? 1 : 0,
        happiness: 5.0, // デフォルト幸福度スコア
        lifeExpectancy: lifeExpectancyData[c.translations?.jpn?.common || c.name.common] || 70 // 平均寿命
      }));
    
    console.log(`Loaded ${countries.length} countries from API`);
  } catch (error) {
    console.error('Failed to load countries:', error);
    // フォールバック: 指定41カ国
    countries = [
      // 北米
      { name:"アメリカ合衆国", flag:"🇺🇸", flagImage:"https://flagcdn.com/us.svg", area:9834, population:331, capital:"Washington", region:"Americas", subregion:"Northern America", timezones:11, languages:1, borders:2, borderCountries:["カナダ","メキシコ"], cca2:"US", independent:1, latitude:38, longitude:-97, continents:1, currencies:1, callingCode:"1", carSide:1, startOfWeek:0, lifeExpectancy:79.61 },
      { name:"メキシコ", flag:"🇲🇽", flagImage:"https://flagcdn.com/mx.svg", area:1964, population:129, capital:"Mexico City", region:"Americas", subregion:"Central America", timezones:4, languages:1, borders:3, borderCountries:["アメリカ合衆国","グアテマラ","ベリーズ"], cca2:"MX", independent:1, latitude:23, longitude:-102, continents:1, currencies:1, callingCode:"52", carSide:1, startOfWeek:0, lifeExpectancy:75.45 },
      { name:"カナダ", flag:"🇨🇦", flagImage:"https://flagcdn.com/ca.svg", area:9985, population:38, capital:"Ottawa", region:"Americas", subregion:"Northern America", timezones:6, languages:2, borders:1, borderCountries:["アメリカ合衆国"], cca2:"CA", independent:1, latitude:60, longitude:-95, continents:1, currencies:1, callingCode:"1", carSide:1, startOfWeek:0, lifeExpectancy:82.88 },
      // アジア/中東
      { name:"日本", flag:"🇯🇵", flagImage:"https://flagcdn.com/jp.svg", area:378, population:125, capital:"Tokyo", region:"Asia", subregion:"Eastern Asia", timezones:1, languages:1, borders:0, borderCountries:[], cca2:"JP", independent:1, latitude:36, longitude:138, continents:1, currencies:1, callingCode:"81", carSide:0, startOfWeek:1, lifeExpectancy:85 },
      { name:"イラン", flag:"🇮🇷", flagImage:"https://flagcdn.com/ir.svg", area:1648, population:85, capital:"Tehran", region:"Asia", subregion:"Southern Asia", timezones:1, languages:1, borders:7, borderCountries:["イラク","トルコ","アルメニア","アゼルバイジャン","トルクメニスタン","アフガニスタン","パキスタン"], cca2:"IR", independent:1, latitude:32, longitude:53, continents:1, currencies:1, callingCode:"98", carSide:1, startOfWeek:6, lifeExpectancy:78.05 },
      { name:"韓国", flag:"🇰🇷", flagImage:"https://flagcdn.com/kr.svg", area:100, population:52, capital:"Seoul", region:"Asia", subregion:"Eastern Asia", timezones:1, languages:1, borders:1, borderCountries:["北朝鮮"], cca2:"KR", independent:1, latitude:37, longitude:127, continents:1, currencies:1, callingCode:"82", carSide:1, startOfWeek:0, lifeExpectancy:84.53 },
      { name:"オーストラリア", flag:"🇦🇺", flagImage:"https://flagcdn.com/au.svg", area:7692, population:26, capital:"Canberra", region:"Oceania", subregion:"Australia and New Zealand", timezones:11, languages:1, borders:0, borderCountries:[], cca2:"AU", independent:1, latitude:-27, longitude:133, continents:1, currencies:1, callingCode:"61", carSide:0, startOfWeek:1, lifeExpectancy:84.21 },
      { name:"サウジアラビア", flag:"🇸🇦", flagImage:"https://flagcdn.com/sa.svg", area:2149, population:36, capital:"Riyadh", region:"Asia", subregion:"Western Asia", timezones:1, languages:1, borders:7, borderCountries:["ヨルダン","イラク","クウェート","カタール","アラブ首長国連邦","オマーン","イエメン"], cca2:"SA", independent:1, latitude:24, longitude:45, continents:1, currencies:1, callingCode:"966", carSide:1, startOfWeek:0, lifeExpectancy:79.19 },
      { name:"カタール", flag:"🇶🇦", flagImage:"https://flagcdn.com/qa.svg", area:12, population:3, capital:"Doha", region:"Asia", subregion:"Western Asia", timezones:1, languages:1, borders:1, borderCountries:["サウジアラビア"], cca2:"QA", independent:1, latitude:25, longitude:51, continents:1, currencies:1, callingCode:"974", carSide:1, startOfWeek:0, lifeExpectancy:82.68 },
      { name:"ヨルダン", flag:"🇯🇴", flagImage:"https://flagcdn.com/jo.svg", area:89, population:10, capital:"Amman", region:"Asia", subregion:"Western Asia", timezones:1, languages:1, borders:5, borderCountries:["イラク","サウジアラビア","シリア","イスラエル","パレスチナ"], cca2:"JO", independent:1, latitude:31, longitude:36, continents:1, currencies:1, callingCode:"962", carSide:1, startOfWeek:6 },
      { name:"ウズベキスタン", flag:"🇺🇿", flagImage:"https://flagcdn.com/uz.svg", area:447, population:34, capital:"Tashkent", region:"Asia", subregion:"Central Asia", timezones:1, languages:2, borders:5, borderCountries:["アフガニスタン","カザフスタン","キルギス","タジキスタン","トルクメニスタン"], cca2:"UZ", independent:1, latitude:41, longitude:64, continents:1, currencies:1, callingCode:"998", carSide:1, startOfWeek:1 },
      // アフリカ
      { name:"モロッコ", flag:"🇲🇦", flagImage:"https://flagcdn.com/ma.svg", area:447, population:37, capital:"Rabat", region:"Africa", subregion:"Northern Africa", timezones:1, languages:1, borders:3, borderCountries:["アルジェリア","西サハラ","スペイン"], cca2:"MA", independent:1, latitude:32, longitude:-5, continents:1, currencies:1, callingCode:"212", carSide:1, startOfWeek:1 },
      { name:"チュニジア", flag:"🇹🇳", flagImage:"https://flagcdn.com/tn.svg", area:164, population:12, capital:"Tunis", region:"Africa", subregion:"Northern Africa", timezones:1, languages:1, borders:2, borderCountries:["アルジェリア","リビア"], cca2:"TN", independent:1, latitude:34, longitude:9, continents:1, currencies:1, callingCode:"216", carSide:1, startOfWeek:1 },
      { name:"エジプト", flag:"🇪🇬", flagImage:"https://flagcdn.com/eg.svg", area:1002, population:104, capital:"Cairo", region:"Africa", subregion:"Northern Africa", timezones:1, languages:1, borders:4, borderCountries:["イスラエル","リビア","スーダン","パレスチナ"], cca2:"EG", independent:1, latitude:27, longitude:30, continents:2, currencies:1, callingCode:"20", carSide:1, startOfWeek:0 },
      { name:"アルジェリア", flag:"🇩🇿", flagImage:"https://flagcdn.com/dz.svg", area:2382, population:44, capital:"Algiers", region:"Africa", subregion:"Northern Africa", timezones:1, languages:1, borders:6, borderCountries:["チュニジア","リビア","ニジェール","西サハラ","モーリタニア","マリ","モロッコ"], cca2:"DZ", independent:1, latitude:28, longitude:3, continents:1, currencies:1, callingCode:"213", carSide:1, startOfWeek:6 },
      { name:"ガーナ", flag:"🇬🇭", flagImage:"https://flagcdn.com/gh.svg", area:239, population:32, capital:"Accra", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:3, borderCountries:["コートジボワール","ブルキナファソ","トーゴ"], cca2:"GH", independent:1, latitude:8, longitude:-2, continents:1, currencies:1, callingCode:"233", carSide:1, startOfWeek:1 },
      // { name:"カーボベルデ", ... } 重複のため削除
      { name:"南アフリカ", flag:"🇿🇦", flagImage:"https://flagcdn.com/za.svg", area:1221, population:60, capital:"Pretoria", region:"Africa", subregion:"Southern Africa", timezones:2, languages:11, borders:6, borderCountries:["ナミビア","ボツワナ","ジンバブエ","モザンビーク","エスワティニ","レソト"], cca2:"ZA", independent:1, latitude:-29, longitude:24, continents:1, currencies:1, callingCode:"27", carSide:0, startOfWeek:1 },
      { name:"コートジボワール", flag:"🇨🇮", flagImage:"https://flagcdn.com/ci.svg", area:322, population:27, capital:"Yamoussoukro", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:5, borderCountries:["ガーナ","ブルキナファソ","マリ","ギニア","リベリア"], cca2:"CI", independent:1, latitude:8, longitude:-5, continents:1, currencies:1, callingCode:"225", carSide:1, startOfWeek:1 },
      { name:"セネガル", flag:"🇸🇳", flagImage:"https://flagcdn.com/sn.svg", area:197, population:17, capital:"Dakar", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:5, borderCountries:["ガンビア","ギニア","ギニアビサウ","マリ","モーリタニア"], cca2:"SN", independent:1, latitude:14, longitude:-14, continents:1, currencies:1, callingCode:"221", carSide:1, startOfWeek:1 },
      // ヨーロッパ
      { name:"フランス", flag:"🇫🇷", flagImage:"https://flagcdn.com/fr.svg", area:551, population:67, capital:"Paris", region:"Europe", subregion:"Western Europe", timezones:12, languages:1, borders:8, borderCountries:["アンドラ","ベルギー","ドイツ","イタリア","ルクセンブルク","モナコ","スペイン","スイス"], cca2:"FR", independent:1, latitude:46, longitude:2, continents:1, currencies:1, callingCode:"33", carSide:1, startOfWeek:1, happiness:6.66 },
      { name:"クロアチア", flag:"🇭🇷", flagImage:"https://flagcdn.com/hr.svg", area:57, population:4, capital:"Zagreb", region:"Europe", subregion:"Southern Europe", timezones:1, languages:1, borders:5, borderCountries:["ボスニア・ヘルツェゴビナ","ハンガリー","モンテネグロ","セルビア","スロベニア"], cca2:"HR", independent:1, latitude:45, longitude:16, continents:1, currencies:1, callingCode:"385", carSide:1, startOfWeek:1, happiness:6.13 },
      { name:"スペイン", flag:"🇪🇸", flagImage:"https://flagcdn.com/es.svg", area:505, population:47, capital:"Madrid", region:"Europe", subregion:"Southern Europe", timezones:2, languages:4, borders:5, borderCountries:["アンドラ","フランス","ジブラルタル","ポルトガル","モロッコ"], cca2:"ES", independent:1, latitude:40, longitude:-4, continents:1, currencies:1, callingCode:"34", carSide:1, startOfWeek:1, happiness:6.42 },
      { name:"ポルトガル", flag:"🇵🇹", flagImage:"https://flagcdn.com/pt.svg", area:92, population:10, capital:"Lisbon", region:"Europe", subregion:"Southern Europe", timezones:2, languages:1, borders:1, borderCountries:["スペイン"], cca2:"PT", independent:1, latitude:39, longitude:-8, continents:1, currencies:1, callingCode:"351", carSide:1, startOfWeek:1, happiness:6.01 },
      { name:"ベルギー", flag:"🇧🇪", flagImage:"https://flagcdn.com/be.svg", area:31, population:12, capital:"Brussels", region:"Europe", subregion:"Western Europe", timezones:1, languages:3, borders:4, borderCountries:["フランス","ドイツ","ルクセンブルク","オランダ"], cca2:"BE", independent:1, latitude:51, longitude:4, continents:1, currencies:1, callingCode:"32", carSide:1, startOfWeek:1, happiness:6.89 },
      { name:"オーストリア", flag:"🇦🇹", flagImage:"https://flagcdn.com/at.svg", area:84, population:9, capital:"Vienna", region:"Europe", subregion:"Central Europe", timezones:1, languages:1, borders:8, borderCountries:["チェコ","ドイツ","ハンガリー","イタリア","リヒテンシュタイン","スロバキア","スロベニア","スイス"], cca2:"AT", independent:1, latitude:47, longitude:13, continents:1, currencies:1, callingCode:"43", carSide:1, startOfWeek:1, happiness:7.27 },
      { name:"ドイツ", flag:"🇩🇪", flagImage:"https://flagcdn.com/de.svg", area:357, population:83, capital:"Berlin", region:"Europe", subregion:"Western Europe", timezones:1, languages:1, borders:9, borderCountries:["オーストリア","ベルギー","チェコ","デンマーク","フランス","ルクセンブルク","オランダ","ポーランド","スイス"], cca2:"DE", independent:1, latitude:51, longitude:9, continents:1, currencies:1, callingCode:"49", carSide:1, startOfWeek:1, happiness:6.72 },
      { name:"オランダ", flag:"🇳🇱", flagImage:"https://flagcdn.com/nl.svg", area:42, population:17, capital:"Amsterdam", region:"Europe", subregion:"Western Europe", timezones:2, languages:1, borders:2, borderCountries:["ベルギー","ドイツ"], cca2:"NL", independent:1, latitude:52, longitude:5, continents:1, currencies:1, callingCode:"31", carSide:1, startOfWeek:1, happiness:7.40 },
      { name:"ノルウェー", flag:"🇳🇴", flagImage:"https://flagcdn.com/no.svg", area:385, population:5, capital:"Oslo", region:"Europe", subregion:"Northern Europe", timezones:1, languages:2, borders:3, borderCountries:["フィンランド","スウェーデン","ロシア"], cca2:"NO", independent:1, latitude:62, longitude:10, continents:1, currencies:1, callingCode:"47", carSide:1, startOfWeek:1, happiness:7.32 },
      { name:"イギリス", flag:"🇬🇧", flagImage:"https://flagcdn.com/gb.svg", area:243, population:67, capital:"London", region:"Europe", subregion:"Northern Europe", timezones:9, languages:1, borders:1, borderCountries:["アイルランド"], cca2:"GB", independent:1, latitude:54, longitude:-2, continents:1, currencies:1, callingCode:"44", carSide:0, startOfWeek:1, happiness:6.75 },
      { name:"スイス", flag:"🇨🇭", flagImage:"https://flagcdn.com/ch.svg", area:41, population:9, capital:"Bern", region:"Europe", subregion:"Western Europe", timezones:1, languages:4, borders:5, borderCountries:["オーストリア","フランス","イタリア","リヒテンシュタイン","ドイツ"], cca2:"CH", independent:1, latitude:47, longitude:8, continents:1, currencies:1, callingCode:"41", carSide:1, startOfWeek:1, happiness:7.06 },
      // 南米
      { name:"アルゼンチン", flag:"🇦🇷", flagImage:"https://flagcdn.com/ar.svg", area:2780, population:46, capital:"Buenos Aires", region:"Americas", subregion:"South America", timezones:4, languages:1, borders:5, borderCountries:["ボリビア","ブラジル","チリ","パラグアイ","ウルグアイ"], cca2:"AR", independent:1, latitude:-34, longitude:-64, continents:1, currencies:1, callingCode:"54", carSide:1, startOfWeek:1, happiness:6.21 },
      { name:"ブラジル", flag:"🇧🇷", flagImage:"https://flagcdn.com/br.svg", area:8516, population:214, capital:"Brasilia", region:"Americas", subregion:"South America", timezones:4, languages:1, borders:10, borderCountries:["アルゼンチン","ボリビア","コロンビア","フランス領ギアナ","ガイアナ","パラグアイ","ペルー","スリナム","ウルグアイ","ベネズエラ"], cca2:"BR", independent:1, latitude:-10, longitude:-55, continents:1, currencies:1, callingCode:"55", carSide:1, startOfWeek:0, happiness:6.22 },
      { name:"コロンビア", flag:"🇨🇴", flagImage:"https://flagcdn.com/co.svg", area:1142, population:51, capital:"Bogota", region:"Americas", subregion:"South America", timezones:1, languages:1, borders:5, borderCountries:["ブラジル","エクアドル","パナマ","ペルー","ベネズエラ"], cca2:"CO", independent:1, latitude:4, longitude:-72, continents:1, currencies:1, callingCode:"57", carSide:1, startOfWeek:1, happiness:6.05 },
      { name:"ウルグアイ", flag:"🇺🇾", flagImage:"https://flagcdn.com/uy.svg", area:176, population:3, capital:"Montevideo", region:"Americas", subregion:"South America", timezones:1, languages:1, borders:2, borderCountries:["アルゼンチン","ブラジル"], cca2:"UY", independent:1, latitude:-33, longitude:-56, continents:1, currencies:1, callingCode:"598", carSide:1, startOfWeek:1, happiness:6.42 },
      // カリブ/中米
      { name:"キュラソー", flag:"🇨🇼", flagImage:"https://flagcdn.com/cw.svg", area:0.44, population:0.2, capital:"Willemstad", region:"Americas", subregion:"Caribbean", timezones:1, languages:3, borders:0, borderCountries:[], cca2:"CW", independent:0, latitude:12, longitude:-69, continents:1, currencies:1, callingCode:"599", carSide:1, startOfWeek:1, happiness:6.18 },
      { name:"パナマ", flag:"🇵🇦", flagImage:"https://flagcdn.com/pa.svg", area:75, population:4, capital:"Panama City", region:"Americas", subregion:"Central America", timezones:1, languages:1, borders:2, borderCountries:["コロンビア","コスタリカ"], cca2:"PA", independent:1, latitude:9, longitude:-80, continents:1, currencies:1, callingCode:"507", carSide:1, startOfWeek:0, happiness:6.18 },
      { name:"コスタリカ", flag:"🇨🇷", flagImage:"https://flagcdn.com/cr.svg", area:51, population:5, capital:"San Jose", region:"Americas", subregion:"Central America", timezones:1, languages:1, borders:2, borderCountries:["ニカラグア","パナマ"], cca2:"CR", independent:1, latitude:10, longitude:-84, continents:1, currencies:1, callingCode:"506", carSide:1, startOfWeek:1, happiness:7.07 },
      { name:"ドミニカ共和国", flag:"🇩🇴", flagImage:"https://flagcdn.com/do.svg", area:49, population:11, capital:"Santo Domingo", region:"Americas", subregion:"Caribbean", timezones:1, languages:1, borders:1, borderCountries:["ハイチ"], cca2:"DO", independent:1, latitude:19, longitude:-70, continents:1, currencies:1, callingCode:"1", carSide:1, startOfWeek:1, happiness:5.69 },
      { name:"ペルー", flag:"🇵🇪", flagImage:"https://flagcdn.com/pe.svg", area:1285, population:33, capital:"Lima", region:"Americas", subregion:"South America", timezones:1, languages:3, borders:5, borderCountries:["ボリビア","ブラジル","チリ","コロンビア","エクアドル"], cca2:"PE", independent:1, latitude:-10, longitude:-76, continents:1, currencies:1, callingCode:"51", carSide:1, startOfWeek:0, happiness:5.84 },
      { name:"チリ", flag:"🇨🇱", flagImage:"https://flagcdn.com/cl.svg", area:756, population:19, capital:"Santiago", region:"Americas", subregion:"South America", timezones:2, languages:1, borders:3, borderCountries:["アルゼンチン","ボリビア","ペルー"], cca2:"CL", independent:1, latitude:-30, longitude:-71, continents:1, currencies:1, callingCode:"56", carSide:1, startOfWeek:1, happiness:6.21 },
      { name:"ボリビア", flag:"🇧🇴", flagImage:"https://flagcdn.com/bo.svg", area:1099, population:12, capital:"Sucre", region:"Americas", subregion:"South America", timezones:1, languages:3, borders:5, borderCountries:["アルゼンチン","ブラジル","チリ","パラグアイ","ペルー"], cca2:"BO", independent:1, latitude:-17, longitude:-65, continents:1, currencies:1, callingCode:"591", carSide:1, startOfWeek:1, happiness:5.60 },
      // ヨーロッパ追加
      { name:"イタリア", flag:"🇮🇹", flagImage:"https://flagcdn.com/it.svg", area:301, population:60, capital:"Rome", region:"Europe", subregion:"Southern Europe", timezones:1, languages:1, borders:6, borderCountries:["オーストリア","フランス","サンマリノ","スロベニア","スイス","バチカン市国"], cca2:"IT", independent:1, latitude:43, longitude:12, continents:1, currencies:1, callingCode:"39", carSide:1, startOfWeek:1, happiness:6.41 },
      { name:"ロシア", flag:"🇷🇺", flagImage:"https://flagcdn.com/ru.svg", area:17098, population:146, capital:"Moscow", region:"Europe", subregion:"Eastern Europe", timezones:11, languages:1, borders:14, borderCountries:["アゼルバイジャン","ベラルーシ","中国","エストニア","フィンランド","ジョージア","カザフスタン","北朝鮮","ラトビア","リトアニア","モンゴル","ノルウェー","ポーランド","ウクライナ"], cca2:"RU", independent:1, latitude:60, longitude:100, continents:2, currencies:1, callingCode:"7", carSide:1, startOfWeek:1, happiness:5.66 },
      { name:"スウェーデン", flag:"🇸🇪", flagImage:"https://flagcdn.com/se.svg", area:450, population:10, capital:"Stockholm", region:"Europe", subregion:"Northern Europe", timezones:1, languages:1, borders:2, borderCountries:["フィンランド","ノルウェー"], cca2:"SE", independent:1, latitude:62, longitude:15, continents:1, currencies:1, callingCode:"46", carSide:1, startOfWeek:1, happiness:7.35 },
      { name:"ポーランド", flag:"🇵🇱", flagImage:"https://flagcdn.com/pl.svg", area:313, population:38, capital:"Warsaw", region:"Europe", subregion:"Central Europe", timezones:1, languages:1, borders:7, borderCountries:["ベラルーシ","チェコ","ドイツ","リトアニア","ロシア","スロバキア","ウクライナ"], cca2:"PL", independent:1, latitude:52, longitude:20, continents:1, currencies:1, callingCode:"48", carSide:1, startOfWeek:1, happiness:6.12 },
      { name:"ウクライナ", flag:"🇺🇦", flagImage:"https://flagcdn.com/ua.svg", area:604, population:44, capital:"Kyiv", region:"Europe", subregion:"Eastern Europe", timezones:1, languages:1, borders:7, borderCountries:["ベラルーシ","ハンガリー","モルドバ","ポーランド","ルーマニア","ロシア","スロバキア"], cca2:"UA", independent:1, latitude:49, longitude:32, continents:1, currencies:1, callingCode:"380", carSide:1, startOfWeek:1, happiness:5.08 },
      { name:"チェコ", flag:"🇨🇿", flagImage:"https://flagcdn.com/cz.svg", area:79, population:11, capital:"Prague", region:"Europe", subregion:"Central Europe", timezones:1, languages:2, borders:4, borderCountries:["オーストリア","ドイツ","ポーランド","スロバキア"], cca2:"CZ", independent:1, latitude:50, longitude:15, continents:1, currencies:1, callingCode:"420", carSide:1, startOfWeek:1, happiness:6.85 },
      { name:"アイルランド", flag:"🇮🇪", flagImage:"https://flagcdn.com/ie.svg", area:70, population:5, capital:"Dublin", region:"Europe", subregion:"Northern Europe", timezones:1, languages:2, borders:1, borderCountries:["イギリス"], cca2:"IE", independent:1, latitude:53, longitude:-8, continents:1, currencies:1, callingCode:"353", carSide:0, startOfWeek:1, happiness:6.91 },
      { name:"フィンランド", flag:"🇫🇮", flagImage:"https://flagcdn.com/fi.svg", area:338, population:6, capital:"Helsinki", region:"Europe", subregion:"Northern Europe", timezones:1, languages:2, borders:3, borderCountries:["ノルウェー","ロシア","スウェーデン"], cca2:"FI", independent:1, latitude:64, longitude:26, continents:1, currencies:1, callingCode:"358", carSide:1, startOfWeek:1, happiness:7.74 },
      { name:"デンマーク", flag:"🇩🇰", flagImage:"https://flagcdn.com/dk.svg", area:43, population:6, capital:"Copenhagen", region:"Europe", subregion:"Northern Europe", timezones:3, languages:1, borders:1, borderCountries:["ドイツ"], cca2:"DK", independent:1, latitude:56, longitude:10, continents:1, currencies:1, callingCode:"45", carSide:1, startOfWeek:1, happiness:7.59 },
      { name:"ギリシャ", flag:"🇬🇷", flagImage:"https://flagcdn.com/gr.svg", area:132, population:11, capital:"Athens", region:"Europe", subregion:"Southern Europe", timezones:1, languages:1, borders:4, borderCountries:["アルバニア","ブルガリア","北マケドニア","トルコ"], cca2:"GR", independent:1, latitude:39, longitude:22, continents:1, currencies:1, callingCode:"30", carSide:1, startOfWeek:1, happiness:5.93 },
      { name:"ハンガリー", flag:"🇭🇺", flagImage:"https://flagcdn.com/hu.svg", area:93, population:10, capital:"Budapest", region:"Europe", subregion:"Central Europe", timezones:1, languages:1, borders:7, borderCountries:["オーストリア","クロアチア","ルーマニア","セルビア","スロバキア","スロベニア","ウクライナ"], cca2:"HU", independent:1, latitude:47, longitude:20, continents:1, currencies:1, callingCode:"36", carSide:1, startOfWeek:1, happiness:6.04 },
      // アジア追加
      { name:"中国", flag:"🇨🇳", flagImage:"https://flagcdn.com/cn.svg", area:9597, population:1412, capital:"Beijing", region:"Asia", subregion:"Eastern Asia", timezones:1, languages:1, borders:14, borderCountries:["アフガニスタン","ブータン","ミャンマー","インド","カザフスタン","キルギス","ラオス","モンゴル","ネパール","北朝鮮","パキスタン","ロシア","タジキスタン","ベトナム"], cca2:"CN", independent:1, latitude:35, longitude:105, continents:1, currencies:1, callingCode:"86", carSide:1, startOfWeek:1, happiness:5.58 },
      { name:"インド", flag:"🇮🇳", flagImage:"https://flagcdn.com/in.svg", area:3287, population:1393, capital:"New Delhi", region:"Asia", subregion:"Southern Asia", timezones:1, languages:2, borders:6, borderCountries:["バングラデシュ","ブータン","ミャンマー","中国","ネパール","パキスタン"], cca2:"IN", independent:1, latitude:20, longitude:77, continents:1, currencies:1, callingCode:"91", carSide:0, startOfWeek:0, happiness:3.77 },
      { name:"インドネシア", flag:"🇮🇩", flagImage:"https://flagcdn.com/id.svg", area:1905, population:274, capital:"Jakarta", region:"Asia", subregion:"South-Eastern Asia", timezones:3, languages:1, borders:3, borderCountries:["東ティモール","マレーシア","パプアニューギニア"], cca2:"ID", independent:1, latitude:-5, longitude:120, continents:2, currencies:1, callingCode:"62", carSide:0, startOfWeek:1, happiness:5.24 },
      { name:"トルコ", flag:"🇹🇷", flagImage:"https://flagcdn.com/tr.svg", area:785, population:85, capital:"Ankara", region:"Asia", subregion:"Western Asia", timezones:1, languages:1, borders:8, borderCountries:["アルメニア","アゼルバイジャン","ブルガリア","ジョージア","ギリシャ","イラン","イラク","シリア"], cca2:"TR", independent:1, latitude:39, longitude:35, continents:2, currencies:1, callingCode:"90", carSide:1, startOfWeek:1, happiness:4.74 },
      { name:"イスラエル", flag:"🇮🇱", flagImage:"https://flagcdn.com/il.svg", area:21, population:9, capital:"Jerusalem", region:"Asia", subregion:"Western Asia", timezones:1, languages:2, borders:6, borderCountries:["エジプト","ヨルダン","レバノン","パレスチナ","シリア"], cca2:"IL", independent:1, latitude:31, longitude:35, continents:1, currencies:1, callingCode:"972", carSide:1, startOfWeek:0, happiness:7.34 },
      { name:"パキスタン", flag:"🇵🇰", flagImage:"https://flagcdn.com/pk.svg", area:881, population:225, capital:"Islamabad", region:"Asia", subregion:"Southern Asia", timezones:1, languages:2, borders:4, borderCountries:["アフガニスタン","中国","インド","イラン"], cca2:"PK", independent:1, latitude:30, longitude:70, continents:1, currencies:1, callingCode:"92", carSide:0, startOfWeek:1, happiness:4.52 },
      { name:"バングラデシュ", flag:"🇧🇩", flagImage:"https://flagcdn.com/bd.svg", area:148, population:166, capital:"Dhaka", region:"Asia", subregion:"Southern Asia", timezones:1, languages:1, borders:2, borderCountries:["ミャンマー","インド"], cca2:"BD", independent:1, latitude:24, longitude:90, continents:1, currencies:1, callingCode:"880", carSide:0, startOfWeek:0, happiness:4.28 },
      { name:"ベトナム", flag:"🇻🇳", flagImage:"https://flagcdn.com/vn.svg", area:331, population:98, capital:"Hanoi", region:"Asia", subregion:"South-Eastern Asia", timezones:1, languages:1, borders:3, borderCountries:["カンボジア","中国","ラオス"], cca2:"VN", independent:1, latitude:16, longitude:106, continents:1, currencies:1, callingCode:"84", carSide:1, startOfWeek:1, happiness:5.76 },
      { name:"タイ", flag:"🇹🇭", flagImage:"https://flagcdn.com/th.svg", area:513, population:70, capital:"Bangkok", region:"Asia", subregion:"South-Eastern Asia", timezones:1, languages:1, borders:4, borderCountries:["ミャンマー","カンボジア","ラオス","マレーシア"], cca2:"TH", independent:1, latitude:15, longitude:100, continents:1, currencies:1, callingCode:"66", carSide:0, startOfWeek:1, happiness:5.89 },
      { name:"フィリピン", flag:"🇵🇭", flagImage:"https://flagcdn.com/ph.svg", area:300, population:111, capital:"Manila", region:"Asia", subregion:"South-Eastern Asia", timezones:1, languages:2, borders:0, borderCountries:[], cca2:"PH", independent:1, latitude:13, longitude:122, continents:1, currencies:1, callingCode:"63", carSide:1, startOfWeek:1, happiness:5.90 },
      { name:"マレーシア", flag:"🇲🇾", flagImage:"https://flagcdn.com/my.svg", area:330, population:33, capital:"Kuala Lumpur", region:"Asia", subregion:"South-Eastern Asia", timezones:2, languages:1, borders:3, borderCountries:["ブルネイ","インドネシア","タイ"], cca2:"MY", independent:1, latitude:4, longitude:102, continents:2, currencies:1, callingCode:"60", carSide:0, startOfWeek:1, happiness:5.38 },
      { name:"シンガポール", flag:"🇸🇬", flagImage:"https://flagcdn.com/sg.svg", area:0.72, population:6, capital:"Singapore", region:"Asia", subregion:"South-Eastern Asia", timezones:1, languages:4, borders:0, borderCountries:[], cca2:"SG", independent:1, latitude:1, longitude:104, continents:1, currencies:1, callingCode:"65", carSide:0, startOfWeek:1, happiness:6.58 },
      { name:"カザフスタン", flag:"🇰🇿", flagImage:"https://flagcdn.com/kz.svg", area:2725, population:19, capital:"Astana", region:"Asia", subregion:"Central Asia", timezones:2, languages:2, borders:5, borderCountries:["中国","キルギス","ロシア","トルクメニスタン","ウズベキスタン"], cca2:"KZ", independent:1, latitude:48, longitude:68, continents:1, currencies:1, callingCode:"7", carSide:1, startOfWeek:1, happiness:6.11 },
      { name:"スリランカ", flag:"🇱🇰", flagImage:"https://flagcdn.com/lk.svg", area:66, population:21, capital:"Colombo", region:"Asia", subregion:"Southern Asia", timezones:1, languages:2, borders:0, borderCountries:[], cca2:"LK", independent:1, latitude:7, longitude:81, continents:1, currencies:1, callingCode:"94", carSide:0, startOfWeek:1, happiness:4.37 },
      // アフリカ追加
      { name:"ナイジェリア", flag:"🇳🇬", flagImage:"https://flagcdn.com/ng.svg", area:924, population:211, capital:"Abuja", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:4, borderCountries:["ベナン","カメルーン","チャド","ニジェール"], cca2:"NG", independent:1, latitude:10, longitude:8, continents:1, currencies:1, callingCode:"234", carSide:1, startOfWeek:1, happiness:4.55 },
      { name:"エチオピア", flag:"🇪🇹", flagImage:"https://flagcdn.com/et.svg", area:1104, population:118, capital:"Addis Ababa", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:1, borders:6, borderCountries:["ジブチ","エリトリア","ケニア","ソマリア","南スーダン","スーダン"], cca2:"ET", independent:1, latitude:8, longitude:38, continents:1, currencies:1, callingCode:"251", carSide:1, startOfWeek:0, happiness:4.29 },
      { name:"ケニア", flag:"🇰🇪", flagImage:"https://flagcdn.com/ke.svg", area:580, population:54, capital:"Nairobi", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:2, borders:5, borderCountries:["エチオピア","ソマリア","南スーダン","タンザニア","ウガンダ"], cca2:"KE", independent:1, latitude:1, longitude:38, continents:1, currencies:1, callingCode:"254", carSide:0, startOfWeek:0, happiness:4.58 },
      // オセアニア
      { name:"ニュージーランド", flag:"🇳🇿", flagImage:"https://flagcdn.com/nz.svg", area:268, population:5, capital:"Wellington", region:"Oceania", subregion:"Australia and New Zealand", timezones:2, languages:3, borders:0, borderCountries:[], cca2:"NZ", independent:1, latitude:-41, longitude:174, continents:1, currencies:1, callingCode:"64", carSide:0, startOfWeek:1, happiness:7.11 },
      { name:"パプアニューギニア", flag:"🇵🇬", flagImage:"https://flagcdn.com/pg.svg", area:463, population:9, capital:"Port Moresby", region:"Oceania", subregion:"Melanesia", timezones:2, languages:3, borders:1, borderCountries:["インドネシア"], cca2:"PG", independent:1, latitude:-6, longitude:147, continents:1, currencies:1, callingCode:"675", carSide:0, startOfWeek:1, happiness:5.46 },
      // 追加の国（難しいグループ用）
      { name:"スロバキア", flag:"🇸🇰", flagImage:"https://flagcdn.com/sk.svg", area:49, population:5, capital:"Bratislava", region:"Europe", subregion:"Central Europe", timezones:1, languages:1, borders:5, borderCountries:["オーストリア","チェコ","ハンガリー","ポーランド","ウクライナ"], cca2:"SK", independent:1, latitude:49, longitude:20, continents:1, currencies:1, callingCode:"421", carSide:1, startOfWeek:1, happiness:6.33 },
      { name:"スロベニア", flag:"🇸🇮", flagImage:"https://flagcdn.com/si.svg", area:20, population:2, capital:"Ljubljana", region:"Europe", subregion:"Southern Europe", timezones:1, languages:1, borders:4, borderCountries:["オーストリア","クロアチア","ハンガリー","イタリア"], cca2:"SI", independent:1, latitude:46, longitude:15, continents:1, currencies:1, callingCode:"386", carSide:1, startOfWeek:1, happiness:6.65 },
      { name:"ルーマニア", flag:"🇷🇴", flagImage:"https://flagcdn.com/ro.svg", area:238, population:19, capital:"Bucharest", region:"Europe", subregion:"Eastern Europe", timezones:1, languages:1, borders:5, borderCountries:["ブルガリア","ハンガリー","モルドバ","セルビア","ウクライナ"], cca2:"RO", independent:1, latitude:46, longitude:25, continents:1, currencies:1, callingCode:"40", carSide:1, startOfWeek:1, happiness:6.14 },
      { name:"ブルガリア", flag:"🇧🇬", flagImage:"https://flagcdn.com/bg.svg", area:111, population:7, capital:"Sofia", region:"Europe", subregion:"Eastern Europe", timezones:1, languages:1, borders:5, borderCountries:["ギリシャ","北マケドニア","ルーマニア","セルビア","トルコ"], cca2:"BG", independent:1, latitude:43, longitude:25, continents:1, currencies:1, callingCode:"359", carSide:1, startOfWeek:1, happiness:5.37 },
      { name:"セルビア", flag:"🇷🇸", flagImage:"https://flagcdn.com/rs.svg", area:88, population:7, capital:"Belgrade", region:"Europe", subregion:"Southern Europe", timezones:1, languages:1, borders:8, borderCountries:["ボスニア・ヘルツェゴビナ","ブルガリア","クロアチア","ハンガリー","コソボ","北マケドニア","モンテネグロ","ルーマニア"], cca2:"RS", independent:1, latitude:44, longitude:21, continents:1, currencies:1, callingCode:"381", carSide:1, startOfWeek:1, happiness:5.60 },
      //hard
      { name:"エストニア", flag:"🇪🇪", flagImage:"https://flagcdn.com/ee.svg", area:45, population:1, capital:"Tallinn", region:"Europe", subregion:"Northern Europe", timezones:1, languages:1, borders:2, borderCountries:["ラトビア","ロシア"], cca2:"EE", independent:1, latitude:59, longitude:26, continents:1, currencies:1, callingCode:"372", carSide:1, startOfWeek:1 },
      { name:"ラトビア", flag:"🇱🇻", flagImage:"https://flagcdn.com/lv.svg", area:64, population:2, capital:"Riga", region:"Europe", subregion:"Northern Europe", timezones:1, languages:1, borders:4, borderCountries:["エストニア","リトアニア","ロシア","ベラルーシ"], cca2:"LV", independent:1, latitude:57, longitude:25, continents:1, currencies:1, callingCode:"371", carSide:1, startOfWeek:1 },
      { name:"リトアニア", flag:"🇱🇹", flagImage:"https://flagcdn.com/lt.svg", area:65, population:3, capital:"Vilnius", region:"Europe", subregion:"Northern Europe", timezones:1, languages:1, borders:4, borderCountries:["ラトビア","ポーランド","ベラルーシ","ロシア"], cca2:"LT", independent:1, latitude:55, longitude:24, continents:1, currencies:1, callingCode:"370", carSide:1, startOfWeek:1 },
      { name:"アルバニア", flag:"🇦🇱", flagImage:"https://flagcdn.com/al.svg", area:29, population:3, capital:"Tirana", region:"Europe", subregion:"Southern Europe", timezones:1, languages:1, borders:4, borderCountries:["モンテネグロ","コソボ","北マケドニア","ギリシャ"], cca2:"AL", independent:1, latitude:41, longitude:20, continents:1, currencies:1, callingCode:"355", carSide:1, startOfWeek:1 },
      { name:"北マケドニア", flag:"🇲🇰", flagImage:"https://flagcdn.com/mk.svg", area:26, population:2, capital:"Skopje", region:"Europe", subregion:"Southern Europe", timezones:1, languages:1, borders:5, borderCountries:["コソボ","セルビア","ブルガリア","ギリシャ","アルバニア"], cca2:"MK", independent:1, latitude:41.6, longitude:21.7, continents:1, currencies:1, callingCode:"389", carSide:1, startOfWeek:1 },
      { name:"モンテネグロ", flag:"🇲🇪", flagImage:"https://flagcdn.com/me.svg", area:14, population:1, capital:"Podgorica", region:"Europe", subregion:"Southern Europe", timezones:1, languages:1, borders:5, borderCountries:["クロアチア","ボスニア・ヘルツェゴビナ","セルビア","コソボ","アルバニア"], cca2:"ME", independent:1, latitude:42.7, longitude:19.3, continents:1, currencies:1, callingCode:"382", carSide:1, startOfWeek:1 },
      { name:"モルドバ", flag:"🇲🇩", flagImage:"https://flagcdn.com/md.svg", area:34, population:3, capital:"Chișinău", region:"Europe", subregion:"Eastern Europe", timezones:1, languages:1, borders:2, borderCountries:["ルーマニア","ウクライナ"], cca2:"MD", independent:1, latitude:47, longitude:29, continents:1, currencies:1, callingCode:"373", carSide:1, startOfWeek:1 },
      { name:"アイスランド", flag:"🇮🇸", flagImage:"https://flagcdn.com/is.svg", area:103, population:0.39, capital:"Reykjavík", region:"Europe", subregion:"Northern Europe", timezones:1, languages:1, borders:0, borderCountries:[], cca2:"IS", independent:1, latitude:65, longitude:-18, continents:1, currencies:1, callingCode:"354", carSide:1, startOfWeek:1 },
      { name:"ルクセンブルク", flag:"🇱🇺", flagImage:"https://flagcdn.com/lu.svg", area:2.6, population:0.7, capital:"Luxembourg", region:"Europe", subregion:"Western Europe", timezones:1, languages:3, borders:3, borderCountries:["ベルギー","ドイツ","フランス"], cca2:"LU", independent:1, latitude:49.8, longitude:6.1, continents:1, currencies:1, callingCode:"352", carSide:1, startOfWeek:1 },
      { name:"マルタ", flag:"🇲🇹", flagImage:"https://flagcdn.com/mt.svg", area:0.32, population:0.6, capital:"Valletta", region:"Europe", subregion:"Southern Europe", timezones:1, languages:2, borders:0, borderCountries:[], cca2:"MT", independent:1, latitude:35.9, longitude:14.4, continents:1, currencies:1, callingCode:"356", carSide:1, startOfWeek:1 },
      { name:"キプロス", flag:"🇨🇾", flagImage:"https://flagcdn.com/cy.svg", area:9.3, population:1.4, capital:"Nicosia", region:"Europe", subregion:"Southern Europe", timezones:1, languages:2, borders:0, borderCountries:[], cca2:"CY", independent:1, latitude:35, longitude:33, continents:1, currencies:1, callingCode:"357", carSide:1, startOfWeek:1 },
      { name:"タンザニア", flag:"🇹🇿", flagImage:"https://flagcdn.com/tz.svg", area:945, population:65, capital:"Dodoma", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:2, borders:8, borderCountries:["ケニア","ウガンダ","ルワンダ","ブルンジ","コンゴ民主共和国","ザンビア","マラウイ","モザンビーク"], cca2:"TZ", independent:1, latitude:-6, longitude:35, continents:1, currencies:1, callingCode:"255", carSide:1, startOfWeek:1 },
      { name:"ウガンダ", flag:"🇺🇬", flagImage:"https://flagcdn.com/ug.svg", area:241, population:49, capital:"Kampala", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:2, borders:5, borderCountries:["ケニア","タンザニア","ルワンダ","南スーダン","コンゴ民主共和国"], cca2:"UG", independent:1, latitude:1, longitude:32, continents:1, currencies:1, callingCode:"256", carSide:1, startOfWeek:1 },
      { name:"ルワンダ", flag:"🇷🇼", flagImage:"https://flagcdn.com/rw.svg", area:26, population:14, capital:"Kigali", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:3, borders:4, borderCountries:["ウガンダ","タンザニア","ブルンジ","コンゴ民主共和国"], cca2:"RW", independent:1, latitude:-2, longitude:30, continents:1, currencies:1, callingCode:"250", carSide:1, startOfWeek:1 },
      { name:"ザンビア", flag:"🇿🇲", flagImage:"https://flagcdn.com/zm.svg", area:753, population:20, capital:"Lusaka", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:1, borders:8, borderCountries:["コンゴ民主共和国","タンザニア","マラウイ","モザンビーク","ジンバブエ","ボツワナ","ナミビア","アンゴラ"], cca2:"ZM", independent:1, latitude:-15, longitude:30, continents:1, currencies:1, callingCode:"260", carSide:1, startOfWeek:1 },
      { name:"ジンバブエ", flag:"🇿🇼", flagImage:"https://flagcdn.com/zw.svg", area:391, population:16, capital:"Harare", region:"Africa", subregion:"Southern Africa", timezones:1, languages:3, borders:4, borderCountries:["ザンビア","モザンビーク","南アフリカ","ボツワナ"], cca2:"ZW", independent:1, latitude:-20, longitude:30, continents:1, currencies:1, callingCode:"263", carSide:1, startOfWeek:1 },
      { name:"マラウイ", flag:"🇲🇼", flagImage:"https://flagcdn.com/mw.svg", area:118, population:20, capital:"Lilongwe", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:1, borders:3, borderCountries:["タンザニア","ザンビア","モザンビーク"], cca2:"MW", independent:1, latitude:-13, longitude:34, continents:1, currencies:1, callingCode:"265", carSide:1, startOfWeek:1 },
      { name:"モザンビーク", flag:"🇲🇿", flagImage:"https://flagcdn.com/mz.svg", area:801, population:33, capital:"Maputo", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:1, borders:6, borderCountries:["タンザニア","マラウイ","ザンビア","ジンバブエ","南アフリカ","エスワティニ"], cca2:"MZ", independent:1, latitude:-18, longitude:35, continents:1, currencies:1, callingCode:"258", carSide:1, startOfWeek:1 },
      { name:"ボツワナ", flag:"🇧🇼", flagImage:"https://flagcdn.com/bw.svg", area:582, population:3, capital:"Gaborone", region:"Africa", subregion:"Southern Africa", timezones:1, languages:1, borders:4, borderCountries:["ナミビア","ザンビア","ジンバブエ","南アフリカ"], cca2:"BW", independent:1, latitude:-22, longitude:24, continents:1, currencies:1, callingCode:"267", carSide:1, startOfWeek:1 },
      { name:"ナミビア", flag:"🇳🇦", flagImage:"https://flagcdn.com/na.svg", area:825, population:3, capital:"Windhoek", region:"Africa", subregion:"Southern Africa", timezones:1, languages:1, borders:4, borderCountries:["アンゴラ","ザンビア","ボツワナ","南アフリカ"], cca2:"NA", independent:1, latitude:-22, longitude:17, continents:1, currencies:1, callingCode:"264", carSide:1, startOfWeek:1 },
      { name:"エルサルバドル", flag:"🇸🇻", flagImage:"https://flagcdn.com/sv.svg", area:21, population:6, capital:"San Salvador", region:"Americas", subregion:"Central America", timezones:1, languages:1, borders:2, borderCountries:["グアテマラ","ホンジュラス"], cca2:"SV", independent:1, latitude:13.8, longitude:-88.9, continents:1, currencies:1, callingCode:"503", carSide:1, startOfWeek:1 },
      { name:"ホンジュラス", flag:"🇭🇳", flagImage:"https://flagcdn.com/hn.svg", area:112, population:10, capital:"Tegucigalpa", region:"Americas", subregion:"Central America", timezones:1, languages:1, borders:3, borderCountries:["グアテマラ","エルサルバドル","ニカラグア"], cca2:"HN", independent:1, latitude:15, longitude:-86, continents:1, currencies:1, callingCode:"504", carSide:1, startOfWeek:1 },
      { name:"ニカラグア", flag:"🇳🇮", flagImage:"https://flagcdn.com/ni.svg", area:130, population:7, capital:"Managua", region:"Americas", subregion:"Central America", timezones:1, languages:1, borders:2, borderCountries:["ホンジュラス","コスタリカ"], cca2:"NI", independent:1, latitude:13, longitude:-85, continents:1, currencies:1, callingCode:"505", carSide:1, startOfWeek:1 },
      { name:"グアテマラ", flag:"🇬🇹", flagImage:"https://flagcdn.com/gt.svg", area:109, population:18, capital:"Guatemala City", region:"Americas", subregion:"Central America", timezones:1, languages:1, borders:4, borderCountries:["メキシコ","ベリーズ","ホンジュラス","エルサルバドル"], cca2:"GT", independent:1, latitude:15.5, longitude:-90.3, continents:1, currencies:1, callingCode:"502", carSide:1, startOfWeek:1 },
      { name:"ネパール", flag:"🇳🇵", flagImage:"https://flagcdn.com/np.svg", area:147, population:30, capital:"Kathmandu", region:"Asia", subregion:"Southern Asia", timezones:1, languages:1, borders:2, borderCountries:["インド","中国"], cca2:"NP", independent:1, latitude:28, longitude:84, continents:1, currencies:1, callingCode:"977", carSide:1, startOfWeek:1 },
      { name:"ブータン", flag:"🇧🇹", flagImage:"https://flagcdn.com/bt.svg", area:38, population:1, capital:"Thimphu", region:"Asia", subregion:"Southern Asia", timezones:1, languages:1, borders:2, borderCountries:["インド","中国"], cca2:"BT", independent:1, latitude:27.5, longitude:90.5, continents:1, currencies:1, callingCode:"975", carSide:1, startOfWeek:1 },
      { name:"ミャンマー", flag:"🇲🇲", flagImage:"https://flagcdn.com/mm.svg", area:676, population:55, capital:"Naypyidaw", region:"Asia", subregion:"South-Eastern Asia", timezones:1, languages:1, borders:5, borderCountries:["インド","中国","ラオス","タイ","バングラデシュ"], cca2:"MM", independent:1, latitude:22, longitude:96, continents:1, currencies:1, callingCode:"95", carSide:1, startOfWeek:1 },
      { name:"カンボジア", flag:"🇰🇭", flagImage:"https://flagcdn.com/kh.svg", area:181, population:17, capital:"Phnom Penh", region:"Asia", subregion:"South-Eastern Asia", timezones:1, languages:1, borders:3, borderCountries:["タイ","ラオス","ベトナム"], cca2:"KH", independent:1, latitude:12.5, longitude:104.9, continents:1, currencies:1, callingCode:"855", carSide:1, startOfWeek:1 },
      { name:"ラオス", flag:"🇱🇦", flagImage:"https://flagcdn.com/la.svg", area:237, population:7, capital:"Vientiane", region:"Asia", subregion:"South-Eastern Asia", timezones:1, languages:1, borders:5, borderCountries:["中国","ミャンマー","タイ","カンボジア","ベトナム"], cca2:"LA", independent:1, latitude:18, longitude:105, continents:1, currencies:1, callingCode:"856", carSide:1, startOfWeek:1 },
      { name:"モンゴル", flag:"🇲🇳", flagImage:"https://flagcdn.com/mn.svg", area:1564, population:3, capital:"Ulaanbaatar", region:"Asia", subregion:"Eastern Asia", timezones:2, languages:1, borders:2, borderCountries:["中国","ロシア"], cca2:"MN", independent:1, latitude:46, longitude:105, continents:1, currencies:1, callingCode:"976", carSide:1, startOfWeek:1 },
      { name:"フィジー", flag:"🇫🇯", flagImage:"https://flagcdn.com/fj.svg", area:18, population:1, capital:"Suva", region:"Oceania", subregion:"Melanesia", timezones:1, languages:3, borders:0, borderCountries:[], cca2:"FJ", independent:1, latitude:-18, longitude:175, continents:1, currencies:1, callingCode:"679", carSide:1, startOfWeek:1 },
      { name:"ソロモン諸島", flag:"🇸🇧", flagImage:"https://flagcdn.com/sb.svg", area:29, population:1, capital:"Honiara", region:"Oceania", subregion:"Melanesia", timezones:1, languages:1, borders:0, borderCountries:[], cca2:"SB", independent:1, latitude:-8, longitude:159, continents:1, currencies:1, callingCode:"677", carSide:1, startOfWeek:1 },
      { name:"バヌアツ", flag:"🇻🇺", flagImage:"https://flagcdn.com/vu.svg", area:12, population:0.32, capital:"Port Vila", region:"Oceania", subregion:"Melanesia", timezones:1, languages:3, borders:0, borderCountries:[], cca2:"VU", independent:1, latitude:-16, longitude:168, continents:1, currencies:1, callingCode:"678", carSide:1, startOfWeek:1 },
      { name:"サモア", flag:"🇼🇸", flagImage:"https://flagcdn.com/ws.svg", area:2.8, population:0.21, capital:"Apia", region:"Oceania", subregion:"Polynesia", timezones:1, languages:2, borders:0, borderCountries:[], cca2:"WS", independent:1, latitude:-13.8, longitude:-171.8, continents:1, currencies:1, callingCode:"685", carSide:1, startOfWeek:1 },
      { name:"トンガ", flag:"🇹🇴", flagImage:"https://flagcdn.com/to.svg", area:0.7, population:0.10, capital:"Nukuʻalofa", region:"Oceania", subregion:"Polynesia", timezones:1, languages:1, borders:0, borderCountries:[], cca2:"TO", independent:1, latitude:-21.2, longitude:-175.2, continents:1, currencies:1, callingCode:"676", carSide:1, startOfWeek:1 },
      { name:"スリナム", flag:"🇸🇷", flagImage:"https://flagcdn.com/sr.svg", area:163, population:1, capital:"Paramaribo", region:"Americas", subregion:"South America", timezones:1, languages:1, borders:4, borderCountries:["ガイアナ","フランス領ギアナ","ブラジル"], cca2:"SR", independent:1, latitude:4, longitude:-56, continents:1, currencies:1, callingCode:"597", carSide:1, startOfWeek:1 },
      { name:"ガイアナ", flag:"🇬🇾", flagImage:"https://flagcdn.com/gy.svg", area:215, population:1, capital:"Georgetown", region:"Americas", subregion:"South America", timezones:1, languages:1, borders:3, borderCountries:["スリナム","ブラジル","ベネズエラ"], cca2:"GY", independent:1, latitude:5, longitude:-59, continents:1, currencies:1, callingCode:"592", carSide:1, startOfWeek:1 },
      { name:"ベリーズ", flag:"🇧🇿", flagImage:"https://flagcdn.com/bz.svg", area:23, population:0.42, capital:"Belmopan", region:"Americas", subregion:"Central America", timezones:1, languages:1, borders:2, borderCountries:["メキシコ","グアテマラ"], cca2:"BZ", independent:1, latitude:17, longitude:-88.8, continents:1, currencies:1, callingCode:"501", carSide:1, startOfWeek:1 },
      { name:"ハイチ", flag:"🇭🇹", flagImage:"https://flagcdn.com/ht.svg", area:28, population:11, capital:"Port-au-Prince", region:"Americas", subregion:"Caribbean", timezones:1, languages:2, borders:1, borderCountries:["ドミニカ共和国"], cca2:"HT", independent:1, latitude:19, longitude:-72.7, continents:1, currencies:1, callingCode:"509", carSide:1, startOfWeek:1 },
      { name:"エクアドル", flag:"🇪🇨", flagImage:"https://flagcdn.com/ec.svg", area:284, population:18, capital:"Quito", region:"Americas", subregion:"South America", timezones:2, languages:1, borders:2, borderCountries:["コロンビア","ペルー"], cca2:"EC", independent:1, latitude:-1.4, longitude:-78.4, continents:1, currencies:1, callingCode:"593", carSide:1, startOfWeek:1 },
      { name:"パラグアイ", flag:"🇵🇾", flagImage:"https://flagcdn.com/py.svg", area:407, population:7, capital:"Asunción", region:"Americas", subregion:"South America", timezones:1, languages:2, borders:3, borderCountries:["アルゼンチン","ブラジル","ボリビア"], cca2:"PY", independent:1, latitude:-23.4, longitude:-58.4, continents:1, currencies:1, callingCode:"595", carSide:1, startOfWeek:1 },
      { name:"ベナン", flag:"🇧🇯", flagImage:"https://flagcdn.com/bj.svg", area:115, population:13, capital:"Porto-Novo", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:4, borderCountries:["トーゴ","ブルキナファソ","ニジェール","ナイジェリア"], cca2:"BJ", independent:1, latitude:9.5, longitude:2.2, continents:1, currencies:1, callingCode:"229", carSide:1, startOfWeek:1 },
      { name:"トーゴ", flag:"🇹🇬", flagImage:"https://flagcdn.com/tg.svg", area:57, population:9, capital:"Lomé", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:3, borderCountries:["ガーナ","ブルキナファソ","ベナン"], cca2:"TG", independent:1, latitude:8.6, longitude:0.8, continents:1, currencies:1, callingCode:"228", carSide:1, startOfWeek:1 },
      { name:"ガボン", flag:"🇬🇦", flagImage:"https://flagcdn.com/ga.svg", area:268, population:2, capital:"Libreville", region:"Africa", subregion:"Middle Africa", timezones:1, languages:1, borders:3, borderCountries:["赤道ギニア","カメルーン","コンゴ共和国"], cca2:"GA", independent:1, latitude:-1, longitude:11.7, continents:1, currencies:1, callingCode:"241", carSide:1, startOfWeek:1 },
      { name:"コンゴ共和国", flag:"🇨🇬", flagImage:"https://flagcdn.com/cg.svg", area:342, population:6, capital:"Brazzaville", region:"Africa", subregion:"Middle Africa", timezones:1, languages:1, borders:5, borderCountries:["ガボン","カメルーン","中央アフリカ共和国","コンゴ民主共和国","アンゴラ"], cca2:"CG", independent:1, latitude:-1, longitude:15, continents:1, currencies:1, callingCode:"242", carSide:1, startOfWeek:1 },
      { name:"赤道ギニア", flag:"🇬🇶", flagImage:"https://flagcdn.com/gq.svg", area:28, population:2, capital:"Malabo", region:"Africa", subregion:"Middle Africa", timezones:1, languages:2, borders:2, borderCountries:["カメルーン","ガボン"], cca2:"GQ", independent:1, latitude:1.5, longitude:10.3, continents:1, currencies:1, callingCode:"240", carSide:1, startOfWeek:1 },
      { name:"カメルーン", flag:"🇨🇲", flagImage:"https://flagcdn.com/cm.svg", area:475, population:28, capital:"Yaoundé", region:"Africa", subregion:"Middle Africa", timezones:1, languages:2, borders:6, borderCountries:["ナイジェリア","チャド","中央アフリカ共和国","赤道ギニア","ガボン","コンゴ共和国"], cca2:"CM", independent:1, latitude:6, longitude:12, continents:1, currencies:1, callingCode:"237", carSide:1, startOfWeek:1 },
      { name:"セーシェル", flag:"🇸🇨", flagImage:"https://flagcdn.com/sc.svg", area:0.45, population:0.12, capital:"Victoria", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:3, borders:0, borderCountries:[], cca2:"SC", independent:1, latitude:-4.6, longitude:55.4, continents:1, currencies:1, callingCode:"248", carSide:1, startOfWeek:1 },
      { name:"モーリシャス", flag:"🇲🇺", flagImage:"https://flagcdn.com/mu.svg", area:2.0, population:1.2, capital:"Port Louis", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:1, borders:0, borderCountries:[], cca2:"MU", independent:1, latitude:-20.2, longitude:57.5, continents:1, currencies:1, callingCode:"230", carSide:1, startOfWeek:1 },
      //extreme
      { name:"中央アフリカ共和国", flag:"🇨🇫", flagImage:"https://flagcdn.com/cf.svg", area:623, population:5, capital:"Bangui", region:"Africa", subregion:"Middle Africa", timezones:1, languages:2, borders:6, borderCountries:["カメルーン","チャド","スーダン","南スーダン","コンゴ民主共和国","コンゴ共和国"], cca2:"CF", independent:1, latitude:7, longitude:21, continents:1, currencies:1, callingCode:"236", carSide:1, startOfWeek:1 },
      { name:"南スーダン", flag:"🇸🇸", flagImage:"https://flagcdn.com/ss.svg", area:644, population:11, capital:"Juba", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:1, borders:6, borderCountries:["スーダン","中央アフリカ共和国","コンゴ民主共和国","ウガンダ","ケニア","エチオピア"], cca2:"SS", independent:1, latitude:7, longitude:30, continents:1, currencies:1, callingCode:"211", carSide:1, startOfWeek:1 },
      { name:"チャド", flag:"🇹🇩", flagImage:"https://flagcdn.com/td.svg", area:1284, population:16, capital:"N'Djamena", region:"Africa", subregion:"Middle Africa", timezones:1, languages:2, borders:6, borderCountries:["リビア","スーダン","中央アフリカ共和国","カメルーン","ナイジェリア","ニジェール"], cca2:"TD", independent:1, latitude:15, longitude:19, continents:1, currencies:1, callingCode:"235", carSide:1, startOfWeek:1 },
      { name:"ニジェール", flag:"🇳🇪", flagImage:"https://flagcdn.com/ne.svg", area:1267, population:25, capital:"Niamey", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:7, borderCountries:["アルジェリア","リビア","チャド","ナイジェリア","ベナン","ブルキナファソ","マリ"], cca2:"NE", independent:1, latitude:16, longitude:8, continents:1, currencies:1, callingCode:"227", carSide:1, startOfWeek:1 },
      { name:"マリ", flag:"🇲🇱", flagImage:"https://flagcdn.com/ml.svg", area:1240, population:22, capital:"Bamako", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:7, borderCountries:["アルジェリア","ニジェール","ブルキナファソ","コートジボワール","ギニア","セネガル","モーリタニア"], cca2:"ML", independent:1, latitude:17, longitude:-4, continents:1, currencies:1, callingCode:"223", carSide:1, startOfWeek:1 },
      { name:"ブルキナファソ", flag:"🇧🇫", flagImage:"https://flagcdn.com/bf.svg", area:274, population:22, capital:"Ouagadougou", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:6, borderCountries:["マリ","ニジェール","ベナン","トーゴ","ガーナ","コートジボワール"], cca2:"BF", independent:1, latitude:12, longitude:-1, continents:1, currencies:1, callingCode:"226", carSide:1, startOfWeek:1 },
      { name:"ギニア", flag:"🇬🇳", flagImage:"https://flagcdn.com/gn.svg", area:246, population:13, capital:"Conakry", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:6, borderCountries:["ギニアビサウ","セネガル","マリ","コートジボワール","リベリア","シエラレオネ"], cca2:"GN", independent:1, latitude:10, longitude:-10, continents:1, currencies:1, callingCode:"224", carSide:1, startOfWeek:1 },
      { name:"ギニアビサウ", flag:"🇬🇼", flagImage:"https://flagcdn.com/gw.svg", area:36, population:2, capital:"Bissau", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:1, borderCountries:["セネガル","ギニア"], cca2:"GW", independent:1, latitude:12, longitude:-15, continents:1, currencies:1, callingCode:"245", carSide:1, startOfWeek:1 },
      { name:"シエラレオネ", flag:"🇸🇱", flagImage:"https://flagcdn.com/sl.svg", area:72, population:8, capital:"Freetown", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:2, borderCountries:["ギニア","リベリア"], cca2:"SL", independent:1, latitude:8, longitude:-11, continents:1, currencies:1, callingCode:"232", carSide:1, startOfWeek:1 },
      { name:"リベリア", flag:"🇱🇷", flagImage:"https://flagcdn.com/lr.svg", area:111, population:5, capital:"Monrovia", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:3, borderCountries:["シエラレオネ","ギニア","コートジボワール"], cca2:"LR", independent:1, latitude:6, longitude:-9, continents:1, currencies:1, callingCode:"231", carSide:1, startOfWeek:1 },
      { name:"ガンビア", flag:"🇬🇲", flagImage:"https://flagcdn.com/gm.svg", area:11, population:3, capital:"Banjul", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:1, borderCountries:["セネガル"], cca2:"GM", independent:1, latitude:13, longitude:-16, continents:1, currencies:1, callingCode:"220", carSide:1, startOfWeek:1 },
      { name:"モーリタニア", flag:"🇲🇷", flagImage:"https://flagcdn.com/mr.svg", area:1030, population:5, capital:"Nouakchott", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:4, borderCountries:["西サハラ","アルジェリア","マリ","セネガル"], cca2:"MR", independent:1, latitude:20, longitude:-12, continents:1, currencies:1, callingCode:"222", carSide:1, startOfWeek:1 },
      { name:"東ティモール", flag:"🇹🇱", flagImage:"https://flagcdn.com/tl.svg", area:15, population:1, capital:"Dili", region:"Asia", subregion:"South-Eastern Asia", timezones:1, languages:2, borders:1, borderCountries:["インドネシア"], cca2:"TL", independent:1, latitude:-8.9, longitude:125.7, continents:1, currencies:1, callingCode:"670", carSide:1, startOfWeek:1 },
      { name:"コソボ", flag:"🇽🇰", flagImage:"https://flagcdn.com/xk.svg", area:11, population:2, capital:"Pristina", region:"Europe", subregion:"Southern Europe", timezones:1, languages:2, borders:4, borderCountries:["セルビア","モンテネグロ","アルバニア","北マケドニア"], cca2:"XK", independent:1, latitude:42.6, longitude:20.9, continents:1, currencies:1, callingCode:"383", carSide:1, startOfWeek:1 },
      { name:"パレスチナ", flag:"🇵🇸", flagImage:"https://flagcdn.com/ps.svg", area:6, population:5, capital:"Ramallah", region:"Asia", subregion:"Western Asia", timezones:1, languages:1, borders:2, borderCountries:["イスラエル","エジプト"], cca2:"PS", independent:0, latitude:31.9, longitude:35.2, continents:1, currencies:0, callingCode:"970", carSide:1, startOfWeek:1 },
      { name:"ソマリア", flag:"🇸🇴", flagImage:"https://flagcdn.com/so.svg", area:638, population:17, capital:"Mogadishu", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:2, borders:3, borderCountries:["エチオピア","ジブチ","ケニア"], cca2:"SO", independent:1, latitude:10, longitude:49, continents:1, currencies:1, callingCode:"252", carSide:1, startOfWeek:1 },
      { name:"スーダン", flag:"🇸🇩", flagImage:"https://flagcdn.com/sd.svg", area:1886, population:45, capital:"Khartoum", region:"Africa", subregion:"Northern Africa", timezones:1, languages:2, borders:7, borderCountries:["エジプト","リビア","チャド","中央アフリカ共和国","南スーダン","エチオピア","エリトリア"], cca2:"SD", independent:1, latitude:15, longitude:30, continents:1, currencies:1, callingCode:"249", carSide:1, startOfWeek:1 },
      { name:"イエメン", flag:"🇾🇪", flagImage:"https://flagcdn.com/ye.svg", area:528, population:34, capital:"Sana'a", region:"Asia", subregion:"Western Asia", timezones:1, languages:1, borders:2, borderCountries:["サウジアラビア","オマーン"], cca2:"YE", independent:1, latitude:15, longitude:48, continents:1, currencies:1, callingCode:"967", carSide:1, startOfWeek:1 },
      { name:"アフガニスタン", flag:"🇦🇫", flagImage:"https://flagcdn.com/af.svg", area:653, population:40, capital:"Kabul", region:"Asia", subregion:"Southern Asia", timezones:1, languages:3, borders:6, borderCountries:["パキスタン","イラン","トルクメニスタン","ウズベキスタン","タジキスタン","中国"], cca2:"AF", independent:1, latitude:33, longitude:65, continents:1, currencies:1, callingCode:"93", carSide:1, startOfWeek:1 },
      { name:"タジキスタン", flag:"🇹🇯", flagImage:"https://flagcdn.com/tj.svg", area:143, population:10, capital:"Dushanbe", region:"Asia", subregion:"Central Asia", timezones:1, languages:1, borders:4, borderCountries:["アフガニスタン","ウズベキスタン","キルギス","中国"], cca2:"TJ", independent:1, latitude:39, longitude:71, continents:1, currencies:1, callingCode:"992", carSide:1, startOfWeek:1 },
      { name:"西サハラ", flag:"🇪🇭", flagImage:"https://flagcdn.com/eh.svg", area:272, population:0.6, capital:"El Aaiún", region:"Africa", subregion:"Northern Africa", timezones:1, languages:1, borders:3, borderCountries:["モロッコ","アルジェリア","モーリタニア"], cca2:"EH", independent:0, latitude:24, longitude:-13, continents:1, currencies:0, callingCode:"212", carSide:1, startOfWeek:1 },
      { name:"ブルネイ", flag:"🇧🇳", flagImage:"https://flagcdn.com/bn.svg", area:5.765, population:0.466, capital:"Bandar Seri Begawan", region:"Asia", subregion:"South-Eastern Asia", timezones:1, languages:1, borders:1, borderCountries:["マレーシア"], cca2:"BN", independent:1, latitude:4.5, longitude:114.7, continents:1, currencies:1, callingCode:"673", carSide:1, startOfWeek:1 },
      { name:"モルディブ", flag:"🇲🇻", flagImage:"https://flagcdn.com/mv.svg", area:0.298, population:0.601, capital:"Malé", region:"Asia", subregion:"Southern Asia", timezones:1, languages:1, borders:0, borderCountries:[], cca2:"MV", independent:1, latitude:3.2, longitude:73.2, continents:1, currencies:1, callingCode:"960", carSide:1, startOfWeek:1 },
      { name:"サンマリノ", flag:"🇸🇲", flagImage:"https://flagcdn.com/sm.svg", area:0.061, population:0.034, capital:"San Marino", region:"Europe", subregion:"Southern Europe", timezones:1, languages:1, borders:1, borderCountries:["イタリア"], cca2:"SM", independent:1, latitude:43.9, longitude:12.5, continents:1, currencies:1, callingCode:"378", carSide:1, startOfWeek:1 },
      { name:"アンドラ", flag:"🇦🇩", flagImage:"https://flagcdn.com/ad.svg", area:0.468, population:0.089, capital:"Andorra la Vella", region:"Europe", subregion:"Southern Europe", timezones:1, languages:1, borders:2, borderCountries:["フランス","スペイン"], cca2:"AD", independent:1, latitude:42.5, longitude:1.5, continents:1, currencies:1, callingCode:"376", carSide:1, startOfWeek:1 },
      { name:"モナコ", flag:"🇲🇨", flagImage:"https://flagcdn.com/mc.svg", area:0.00202, population:0.039, capital:"Monaco", region:"Europe", subregion:"Western Europe", timezones:1, languages:1, borders:1, borderCountries:["フランス"], cca2:"MC", independent:1, latitude:43.7, longitude:7.4, continents:1, currencies:1, callingCode:"377", carSide:1, startOfWeek:1 },
      { name:"リヒテンシュタイン", flag:"🇱🇮", flagImage:"https://flagcdn.com/li.svg", area:0.1605, population:0.041, capital:"Vaduz", region:"Europe", subregion:"Western Europe", timezones:1, languages:1, borders:2, borderCountries:["スイス","オーストリア"], cca2:"LI", independent:1, latitude:47.1, longitude:9.5, continents:1, currencies:1, callingCode:"423", carSide:1, startOfWeek:1 },
      { name:"バチカン市国", flag:"🇻🇦", flagImage:"https://flagcdn.com/va.svg", area:0.00049, population:0.000882, capital:"Vatican City", region:"Europe", subregion:"Southern Europe", timezones:1, languages:1, borders:1, borderCountries:["イタリア"], cca2:"VA", independent:1, latitude:41.9, longitude:12.45, continents:1, currencies:1, callingCode:"379", carSide:1, startOfWeek:1 },
      { name:"キリバス", flag:"🇰🇮", flagImage:"https://flagcdn.com/ki.svg", area:0.81, population:0.12, capital:"Tarawa", region:"Oceania", subregion:"Micronesia", timezones:3, languages:1, borders:0, borderCountries:[], cca2:"KI", independent:1, latitude:1, longitude:173, continents:1, currencies:1, callingCode:"686", carSide:1, startOfWeek:1 },
      { name:"ツバル", flag:"🇹🇻", flagImage:"https://flagcdn.com/tv.svg", area:0.03, population:0.01, capital:"Funafuti", region:"Oceania", subregion:"Polynesia", timezones:1, languages:1, borders:0, borderCountries:[], cca2:"TV", independent:1, latitude:-8, longitude:178, continents:1, currencies:1, callingCode:"688", carSide:1, startOfWeek:1 },
      { name:"ナウル", flag:"🇳🇷", flagImage:"https://flagcdn.com/nr.svg", area:0.02, population:0.01, capital:"Yaren", region:"Oceania", subregion:"Micronesia", timezones:1, languages:1, borders:0, borderCountries:[], cca2:"NR", independent:1, latitude:-0.5, longitude:166.9, continents:1, currencies:1, callingCode:"674", carSide:1, startOfWeek:1 },
      { name:"ミクロネシア連邦", flag:"🇫🇲", flagImage:"https://flagcdn.com/fm.svg", area:0.70, population:0.11, capital:"Palikir", region:"Oceania", subregion:"Micronesia", timezones:2, languages:1, borders:0, borderCountries:[], cca2:"FM", independent:1, latitude:6.9, longitude:158.2, continents:1, currencies:1, callingCode:"691", carSide:1, startOfWeek:1 },
      { name:"マーシャル諸島", flag:"🇲🇭", flagImage:"https://flagcdn.com/mh.svg", area:0.18, population:0.06, capital:"Majuro", region:"Oceania", subregion:"Micronesia", timezones:1, languages:1, borders:0, borderCountries:[], cca2:"MH", independent:1, latitude:7.1, longitude:171.2, continents:1, currencies:1, callingCode:"692", carSide:1, startOfWeek:1 },
      { name:"パラオ", flag:"🇵🇼", flagImage:"https://flagcdn.com/pw.svg", area:0.46, population:0.02, capital:"Ngerulmud", region:"Oceania", subregion:"Micronesia", timezones:1, languages:2, borders:0, borderCountries:[], cca2:"PW", independent:1, latitude:7.5, longitude:134.5, continents:1, currencies:1, callingCode:"680", carSide:1, startOfWeek:1 },
      { name:"サントメ・プリンシペ", flag:"🇸🇹", flagImage:"https://flagcdn.com/st.svg", area:1.0, population:0.23, capital:"São Tomé", region:"Africa", subregion:"Middle Africa", timezones:1, languages:1, borders:0, borderCountries:[], cca2:"ST", independent:1, latitude:0.2, longitude:6.6, continents:1, currencies:1, callingCode:"239", carSide:1, startOfWeek:1 },
      { name:"カーボベルデ", flag:"🇨🇻", flagImage:"https://flagcdn.com/cv.svg", area:4.0, population:0.59, capital:"Praia", region:"Africa", subregion:"Western Africa", timezones:1, languages:1, borders:0, borderCountries:[], cca2:"CV", independent:1, latitude:16, longitude:-24, continents:1, currencies:1, callingCode:"238", carSide:1, startOfWeek:1 },
      { name:"コモロ", flag:"🇰🇲", flagImage:"https://flagcdn.com/km.svg", area:2.2, population:0.87, capital:"Moroni", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:3, borders:0, borderCountries:[], cca2:"KM", independent:1, latitude:-12.1, longitude:44.3, continents:1, currencies:1, callingCode:"269", carSide:1, startOfWeek:1 },
      { name:"ジブチ", flag:"🇩🇯", flagImage:"https://flagcdn.com/dj.svg", area:23, population:1.1, capital:"Djibouti", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:2, borders:3, borderCountries:["エリトリア","エチオピア","ソマリア"], cca2:"DJ", independent:1, latitude:11.5, longitude:43, continents:1, currencies:1, callingCode:"253", carSide:1, startOfWeek:1 },
      { name:"エリトリア", flag:"🇪🇷", flagImage:"https://flagcdn.com/er.svg", area:118, population:3.6, capital:"Asmara", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:3, borders:3, borderCountries:["スーダン","エチオピア","ジブチ"], cca2:"ER", independent:1, latitude:15, longitude:39, continents:1, currencies:1, callingCode:"291", carSide:1, startOfWeek:1 },
      { name:"レソト", flag:"🇱🇸", flagImage:"https://flagcdn.com/ls.svg", area:30, population:2.3, capital:"Maseru", region:"Africa", subregion:"Southern Africa", timezones:1, languages:2, borders:1, borderCountries:["南アフリカ"], cca2:"LS", independent:1, latitude:-29.5, longitude:28.2, continents:1, currencies:1, callingCode:"266", carSide:1, startOfWeek:1 },
      { name:"エスワティニ", flag:"🇸🇿", flagImage:"https://flagcdn.com/sz.svg", area:17, population:1.2, capital:"Mbabane", region:"Africa", subregion:"Southern Africa", timezones:1, languages:2, borders:2, borderCountries:["南アフリカ","モザンビーク"], cca2:"SZ", independent:1, latitude:-26.5, longitude:31.5, continents:1, currencies:1, callingCode:"268", carSide:1, startOfWeek:1 },
      { name:"ブルンジ", flag:"🇧🇮", flagImage:"https://flagcdn.com/bi.svg", area:28, population:12, capital:"Gitega", region:"Africa", subregion:"Eastern Africa", timezones:1, languages:3, borders:3, borderCountries:["ルワンダ","タンザニア","コンゴ民主共和国"], cca2:"BI", independent:1, latitude:-3.5, longitude:30, continents:1, currencies:1, callingCode:"257", carSide:1, startOfWeek:1 }

    ];
    // フォールバックの人口は「百万」想定のため「万」に統一（×100）
    countries = countries.map(c => ({ 
      ...c, 
      population: Math.round((c.population || 0) * 100),
      lifeExpectancy: c.lifeExpectancy || lifeExpectancyData[c.name] || 70,
      gdp: c.gdp || gdpData[c.name] || 10000,
      happiness: c.happiness || happinessData[c.name] || 5.0,
      olympicMedals: c.olympicMedals || olympicMedalsData[c.name] || 0,
      worldHeritage: c.worldHeritage || worldHeritageData[c.name] || 0,
      passportVisaFree: c.passportVisaFree || passportVisaFreeData[c.name] || 0,
      tourismArrivals: c.tourismArrivals || tourismArrivalsData[c.name] || 0,
      precipitation: c.precipitation || precipitationData[c.name] || 0,
      averageHeight: c.averageHeight || averageHeightData[c.name] || 170,
      riceConsumption: c.riceConsumption || riceConsumptionData[c.name] || 0,
      internetPenetration: c.internetPenetration || internetPenetrationData[c.name] || 50,
      wheatConsumption: c.wheatConsumption || wheatConsumptionData[c.name] || 0,
      averageTemperature: c.averageTemperature || averageTemperatureData[c.name] || 15
    }));
  }
}

// ===== 状態 =====
let round = 0;
let playerHand = [];
let cpuHand = [];
let results = [];
let cardPlayed = false;
let selectedCardIndex = -1; // 選択中のカードインデックス

// ===== DOM =====
const startScreen = document.getElementById("startScreen");
const levelSelectScreen = document.getElementById("levelSelectScreen");
const gameScreen = document.getElementById("gameScreen");
const summaryScreen = document.getElementById("summaryScreen");

const startBtn = document.getElementById("startGame");
const nextBtn = document.getElementById("nextRound");
const restartBtn = document.getElementById("restartGame");
const resetThemeBtn = document.getElementById("resetThemeBtn");

const levelButtons = document.querySelectorAll(".level-btn");
const countryButtons = document.querySelectorAll(".country-btn");
const startGameBtn = document.getElementById("startGameBtn");
const backToStartBtn = document.getElementById("backToStart");

const themeTitle = document.getElementById("themeTitle");
const playerField = document.getElementById("playerField");
const cpuField = document.getElementById("cpuField");
const playerHandDiv = document.getElementById("playerHand");
const cpuHandDiv = document.getElementById("cpuHand");
const summaryDetails = document.getElementById("summaryDetails");
const roundList = document.getElementById("roundList");
const confirmCardBtn = document.getElementById("confirmCardBtn");

// debug
try { console.debug && console.debug('main.js loaded, startBtn=', startBtn); } catch(e) {}

// ===== 選択状態のUI更新 =====
function updateStartButtonState() {
  if (cpuLevel && selectedCountryGroup && selectedRoundCount) {
    startGameBtn.disabled = false;
    startGameBtn.classList.remove("bg-gray-400", "cursor-not-allowed");
    startGameBtn.classList.add("bg-sky-500", "hover:bg-sky-600", "cursor-pointer");
  } else {
    startGameBtn.disabled = true;
    startGameBtn.classList.add("bg-gray-400", "cursor-not-allowed");
    startGameBtn.classList.remove("bg-sky-500", "hover:bg-sky-600", "cursor-pointer");
  }
}

// ===== 選択した設定を表示 =====
function updateSettingsDisplay() {
  const levelNames = {
    beginner: "弱い",
    intermediate: "普通",
    advanced: "強い",
    extreme: "超難関"
  };
  
  const groupNames = {
    worldcup: "2026W杯出場国",
    easy: "Level1",
    normal: "Level2",
    hard: "Level3",
    extreme: "Level4"
  };
  
  const levelText = levelNames[cpuLevel] || "";
  const groupText = groupNames[selectedCountryGroup] || "";
  
  // CPU手札の見出しにレベルを表示
  const cpuHandTitle = document.getElementById("cpuHandTitle");
  if (cpuHandTitle) {
    const span = cpuHandTitle.querySelector("span");
    if (span) {
      span.textContent = `CPU（${levelText}）の手札`;
    }
  }
  
  // 上部には国グループのみ表示
  const settingsText = `国難易度: ${groupText}`;
  
  // ゲーム画面の設定表示
  const gameSettings = document.querySelector("#gameSettings p");
  if (gameSettings) {
    gameSettings.textContent = settingsText;
  }
  
  // サマリー画面の設定表示
  const summarySettings = document.querySelector("#summarySettings p");
  if (summarySettings) {
    summarySettings.textContent = settingsText;
  }
}

// ===== イベント =====
if (startBtn) {
  startBtn.disabled = false;
  startBtn.addEventListener("click", showLevelSelect);
}

// もう一度プレイボタンのイベントリスナー
const replayBtn = document.getElementById('replayBtn');
if (replayBtn) {
  replayBtn.addEventListener('click', () => {
    summaryScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    round = 0;
    results = [];
    startGame();
    // シャッフルボタンの表示もリセット
    const shuffleBtn = document.getElementById('shuffleThemeBtn');
    if (shuffleBtn) {
      shuffleBtn.style.display = (round === 0) ? '' : 'none';
    }
  });
}

// CPUレベル選択ボタン
levelButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // 他のボタンの選択状態を解除
    levelButtons.forEach(b => {
      b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
      b.classList.add("scale-100");
    });
    // 現在のボタンを選択状態に
    const current = e.currentTarget;
    current.classList.remove("scale-100");
    current.classList.add("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
    cpuLevel = current.dataset.level;
    updateStartButtonState();
  });
});

// 国グループ選択ボタン
countryButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    countryButtons.forEach(b => {
      b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
      b.classList.add("scale-100");
    });
    const current = e.currentTarget;
    current.classList.remove("scale-100");
    current.classList.add("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
    selectedCountryGroup = current.dataset.group;
    updateStartButtonState();
    updateSettingsDisplay();
  });
});

// ラウンド数選択ボタン
const roundButtons = document.querySelectorAll('.round-btn');
roundButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    roundButtons.forEach(b => {
      b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
      b.classList.add("scale-100");
    });
    const current = e.currentTarget;
    current.classList.remove("scale-100");
    current.classList.add("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
    selectedRoundCount = parseInt(current.dataset.round, 10);
    updateStartButtonState();
  });
});

// ゲーム開始ボタン
startGameBtn.addEventListener('click', () => {
  if (cpuLevel && selectedCountryGroup && selectedRoundCount) {
    animateStartThenStart();
  }
});

// 戻るボタン
if (backToStartBtn) {
  backToStartBtn.addEventListener('click', () => {
    levelSelectScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    // 選択状態をリセット
    cpuLevel = null;
    selectedCountryGroup = null;
    levelButtons.forEach(b => {
      b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
      b.classList.add("scale-100");
    });
    countryButtons.forEach(b => {
      b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
      b.classList.add("scale-100");
    });
    updateStartButtonState();
  });
}

nextBtn.addEventListener("click", nextRound);
restartBtn.addEventListener("click", restartGame);
resetThemeBtn.addEventListener("click", resetTheme);

// 決定ボタンのイベントリスナー
if (confirmCardBtn) {
  confirmCardBtn.addEventListener("click", confirmCard);
}

function restartGame() {
  // サマリー画面を非表示
  summaryScreen.classList.add("hidden");
  // 選択状態をリセット
  cpuLevel = null;
  selectedCountryGroup = null;
  levelButtons.forEach(b => {
    b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
    b.classList.add("scale-100");
  });
  countryButtons.forEach(b => {
    b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
    b.classList.add("scale-100");
  });
  updateStartButtonState();
  // レベル選択画面を表示
  showLevelSelect();
}

function resetTheme() {
  // 問題のみをリセット（CPUレベルと国グループはそのまま）
  
  // 選択された国グループで国をフィルタリング
  let filteredCountries = countries;
  if (selectedCountryGroup && COUNTRY_GROUPS[selectedCountryGroup]) {
    const groupNames = COUNTRY_GROUPS[selectedCountryGroup];
    filteredCountries = countries.filter(c => groupNames.includes(c.name));
  }
  
  // 問題をカテゴリー分けして、偏りなく5問選択
  const themeCategories = {
    population: ["population", "populationSmall", "density", "densityLow"],
    area: ["area", "areaSmall"],
    positionAndNaming: ["latitude", "latitudeLow", "longitude", "longitudeWest", "nameLength", "nameLengthShort", "capitalLength", "capitalLengthShort", "cca2", "cca2Late"],
    geography: ["timezones", "continents"],
    culture: ["languages", "currencies", "callingCode", "callingCodeSmall", "carSideRight", "carSideLeft", "startOfWeek"],
    borders: ["borders", "bordersLow"],
    distance: ["distanceFrom", "areaSimilarTo"],
    happiness: ["happiness", "happinessLow"],
    lifeExpectancy: ["lifeExpectancy", "lifeExpectancyLow"],
    economy: ["gdp", "gdpLow", "gdpPerCapita", "gdpPerCapitaLow"],
    olympicMedals: ["olympicMedals"],
    worldHeritage: ["worldHeritage"],
    passportVisaFree: ["passportVisaFree", "passportVisaFreeLow"],
    tourismArrivals: ["tourismArrivals", "tourismArrivalsLow"],
    precipitation: ["precipitation", "precipitationLow"],
    averageHeight: ["averageHeight", "averageHeightLow"],
    riceConsumption: ["riceConsumption", "riceConsumptionLow"],
    internetPenetration: ["internetPenetration", "internetPenetrationLow"],
    wheatConsumption: ["wheatConsumption", "wheatConsumptionLow"],
    averageTemperature: ["averageTemperature", "averageTemperatureLow"]
  };
  
  // 各カテゴリーから最大1問ずつ選択
  const selectedThemes = [];
  const categoryKeys = Object.keys(themeCategories);
  const shuffledCategories = categoryKeys.sort(() => Math.random() - 0.5);
  
  for (const category of shuffledCategories) {
    if (selectedThemes.length >= 5) break;
    
    const categoryThemeKeys = themeCategories[category];
    const availableThemes = allThemeDefinitions.filter(t => categoryThemeKeys.includes(t.key));
    
    if (availableThemes.length > 0) {
      const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
      selectedThemes.push(randomTheme);
    }
  }
  
  themes = selectedThemes;
  
  // フィルタリングされた国から10カ国をランダムに選択（プレイヤー5枚、CPU5枚）
  const shuffled = [...filteredCountries].sort(() => Math.random() - 0.5);
  playerHand = shuffled.slice(0, 5);
  cpuHand = shuffled.slice(5, 10);
  
  // 手札が決まった後、distanceFromまたはareaSimilarToテーマの対象国を手札以外から選択
  const allHandCountries = [...playerHand, ...cpuHand];
  themes = themes.map(theme => {
    if (theme.key === "distanceFrom" || theme.key === "areaSimilarTo") {
      const very_easyCountries = countries.filter(c => 
        COUNTRY_GROUPS.easy.includes(c.name) && 
        !allHandCountries.some(hand => hand.name === c.name)
      );
      if (very_easyCountries.length > 0) {
        const targetCountry = very_easyCountries[Math.floor(Math.random() * very_easyCountries.length)];
        const textTemplate = theme.key === "distanceFrom" ? "から近い国 ※首都間距離" : "と面積が近い国";
        return {
          ...theme,
          text: `${targetCountry.name}${textTemplate}`,
          targetCountry: targetCountry
        };
      }
    }
    return theme;
  });
  round = 0;
  results = [];
  
  // バトルフィールドを初期化して非表示
  playerField.innerHTML = "";
  cpuField.innerHTML = "";
  playerField.parentElement.parentElement.classList.add("hidden");
  
  // UI更新
  renderRounds();
  renderHands();
  showTheme();
  nextBtn.classList.add("hidden");
  
  // カード選択状態をリセット
  cardPlayed = false;
  selectedCardIndex = -1;
  updateConfirmButton();
}

function showLevelSelect() {
  startScreen.classList.add("hidden");
  levelSelectScreen.classList.remove("hidden");

  // デフォルト選択: 国難易度Level1, CPUレベル弱い, 5ラウンド
  cpuLevel = "beginner";
  selectedCountryGroup = "easy";
  selectedRoundCount = 5;

  // ボタンの選択状態をリセット
  levelButtons.forEach(b => {
    if (b.dataset.level === "beginner") {
      b.classList.remove("scale-100");
      b.classList.add("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
    } else {
      b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
      b.classList.add("scale-100");
    }
  });
  countryButtons.forEach(b => {
    if (b.dataset.group === "easy") {
      b.classList.remove("scale-100");
      b.classList.add("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
    } else {
      b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
      b.classList.add("scale-100");
    }
  });
  const roundButtons = document.querySelectorAll('.round-btn');
  roundButtons.forEach(b => {
    if (b.dataset.round === "5") {
      b.classList.remove("scale-100");
      b.classList.add("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
    } else {
      b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
      b.classList.add("scale-100");
    }
  });
  updateStartButtonState();
  updateSettingsDisplay && updateSettingsDisplay();
}

function animateStartThenStart() {
  // スタートボタンに押し込みエフェクトを追加
  const startButton = document.getElementById('startGameBtn');
  
  // ボタンを押し込む
  startButton.style.transform = 'scale(0.95)';
  startButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  startButton.style.transition = 'all 0.1s ease';
  
  // レベル選択画面を非表示
  levelSelectScreen.classList.add("hidden");
  
  // 短い遅延の後にゲーム開始
  setTimeout(() => {
    startGame();
  }, 150);
}

// ===== ゲーム開始 =====
async function startGame() {
  // API読み込み
  if (countries.length === 0) {
    await loadCountries();
  }

  // 選択された国グループで国をフィルタリング
  let filteredCountries = countries;
  if (selectedCountryGroup && COUNTRY_GROUPS[selectedCountryGroup]) {
    const groupNames = COUNTRY_GROUPS[selectedCountryGroup];
    filteredCountries = countries.filter(c => groupNames.includes(c.name));
    // Level4(extreme)でAPIに該当国が1つもない場合はダミー生成
    if (selectedCountryGroup === 'extreme' && filteredCountries.length === 0) {
      filteredCountries = groupNames.map(name => ({
        name,
        flag: "🏳️",
        flagImage: "",
        area: 1,
        population: 1,
        capital: "",
        region: "",
        subregion: "",
        timezones: 1,
        languages: 1,
        borders: 0,
        borderCountries: [],
        cca2: "",
        independent: 1,
        latitude: 0,
        longitude: 0,
        continents: 1,
        currencies: 1,
        callingCode: "",
        carSide: 1,
        startOfWeek: 1,
        happiness: 5.0,
        lifeExpectancy: 70
      }));
    }
  }

  // 最低10カ国を確保
  const minCountries = selectedRoundCount === 9 ? 18 : 10;
  if (filteredCountries.length < minCountries) {
    alert(`選択された国のデータが不足しています（${minCountries}カ国必要）`);
    return;
  }

  // 問題をカテゴリー分けして、偏りなくラウンド数分選択
  const themeCategories = {
    population: ["population", "populationSmall", "density", "densityLow"],
    area: ["area", "areaSmall"],
    positionAndNaming: ["latitude", "latitudeLow", "longitude", "longitudeWest", "nameLength", "nameLengthShort", "capitalLength", "capitalLengthShort", "cca2", "cca2Late"],
    geography: ["timezones", "continents"],
    culture: ["languages", "currencies", "callingCode", "callingCodeSmall", "carSideRight", "carSideLeft", "startOfWeek"],
    borders: ["borders", "bordersLow"],
    similar: ["distanceFrom","areaSimilarTo"],
    happiness: ["happiness", "happinessLow"],
    lifeExpectancy: ["lifeExpectancy", "lifeExpectancyLow"],
    economy: ["gdp", "gdpLow", "gdpPerCapita", "gdpPerCapitaLow"],
    olympicMedals: ["olympicMedals"],
    worldHeritage: ["worldHeritage"],
    passportVisaFree: ["passportVisaFree", "passportVisaFreeLow"],
    tourismArrivals: ["tourismArrivals", "tourismArrivalsLow"],
    precipitation: ["precipitation", "precipitationLow"],
    averageHeight: ["averageHeight", "averageHeightLow"],
    foodConsumption: ["riceConsumption", "riceConsumptionLow","wheatConsumption", "wheatConsumptionLow"],
    internetPenetration: ["internetPenetration", "internetPenetrationLow"],
    averageTemperature: ["averageTemperature", "averageTemperatureLow"]


  };

  // 各カテゴリーから最大1問ずつ選択、足りなければランダム追加
  let selectedThemes = [];
  const categoryKeys = Object.keys(themeCategories);
  const shuffledCategories = categoryKeys.sort(() => Math.random() - 0.5);
  for (const category of shuffledCategories) {
    if (selectedThemes.length >= selectedRoundCount) break;
    const categoryThemeKeys = themeCategories[category];
    const availableThemes = allThemeDefinitions.filter(t => categoryThemeKeys.includes(t.key));
    if (availableThemes.length > 0) {
      const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
      selectedThemes.push(randomTheme);
    }
  }
  // 足りない場合は全テーマからランダム追加
  let infiniteLoopGuard = 0;
  while (selectedThemes.length < selectedRoundCount && infiniteLoopGuard < 100) {
    const randomTheme = allThemeDefinitions[Math.floor(Math.random() * allThemeDefinitions.length)];
    if (!selectedThemes.some(t => t.key === randomTheme.key)) {
      selectedThemes.push(randomTheme);
    }
    infiniteLoopGuard++;
  }
  // それでも足りない場合は重複許可
  while (selectedThemes.length < selectedRoundCount) {
    const randomTheme = allThemeDefinitions[Math.floor(Math.random() * allThemeDefinitions.length)];
    selectedThemes.push(randomTheme);
  }
  themes = selectedThemes;

  // 🔥 重要：startScreen を完全に無効化
  startScreen.classList.add("hidden");

  // 🔥 gameScreen を明示的に操作可能に
  gameScreen.classList.remove("hidden");
  gameScreen.style.pointerEvents = "auto";

  // 選択した設定を表示
  updateSettingsDisplay();

  // フィルタリングされた国から必要枚数をランダムに選択（プレイヤー/CPUに均等配布）
  const shuffled = [...filteredCountries].sort(() => Math.random() - 0.5);
  const handCount = selectedRoundCount;
  playerHand = shuffled.slice(0, handCount);
  cpuHand = shuffled.slice(handCount, handCount * 2);

  // 手札が決まった後、distanceFromまたはareaSimilarToテーマの対象国を手札以外から選択
  const allHandCountries = [...playerHand, ...cpuHand];
  themes = themes.map(theme => {
    if (theme.key === "distanceFrom" || theme.key === "areaSimilarTo") {
      const very_easyCountries = countries.filter(c => 
        COUNTRY_GROUPS.very_easy.includes(c.name) && 
        !allHandCountries.some(hand => hand.name === c.name)
      );
      if (very_easyCountries.length > 0) {
        const targetCountry = very_easyCountries[Math.floor(Math.random() * very_easyCountries.length)];
        const textTemplate = theme.key === "distanceFrom" ? "から近い国 ※首都間距離" : "と面積が近い国";
        return {
          ...theme,
          text: `${targetCountry.name}${textTemplate}`,
          targetCountry: targetCountry
        };
      }
    }
    return theme;
  });
  round = 0;
  results = [];

  // バトルフィールドを初期化して非表示
  playerField.innerHTML = "";
  cpuField.innerHTML = "";
  playerField.parentElement.parentElement.classList.add("hidden");

  renderRounds();
  renderHands();
  showTheme();
}

// ===== UI =====
function renderRounds() {
  roundList.innerHTML = "";
  themes.forEach((theme, i) => {
    const d = document.createElement("div");
    d.id = `r${i}`;
    d.className = "text-center px-2 flex-shrink-0 min-w-[140px] md:min-w-0";
    d.innerHTML = `<div class="text-base md:text-lg font-semibold">第${i+1}問</div><div class="text-xs md:text-sm mt-1"></div>`;
    roundList.appendChild(d);
  });
  updateRoundHighlight();
}

function showTheme() {
  // 各問題番号の下に問題文を表示
  themes.forEach((theme, i) => {
    const roundDiv = document.getElementById(`r${i}`);
    if (roundDiv) {
      const textDiv = roundDiv.querySelector('div:nth-child(2)');
      if (textDiv) {
        // ラウンドリストでは※以降を削除して表示
        let displayText = theme.text.split('※')[0].replace(/（[^）]*）/g, '').trim();
        textDiv.innerHTML = displayText;
        // SP版では1行に制限（whitespace-nowrapで改行を防ぐ）
        if (i === round) {
          // 現在の問題：緑背景・白文字
          textDiv.className = 'text-xs md:text-sm mt-1 font-bold text-white bg-green-600 px-2 py-1 rounded whitespace-nowrap md:whitespace-normal';
        } else if (i < round && results[i]) {
          // 終了した問題：薄いグレー文字（未来の問題と同じ）
          textDiv.className = 'text-xs md:text-sm mt-1 text-gray-400 whitespace-nowrap md:whitespace-normal';
        } else {
          // 未来の問題：薄いグレー
          textDiv.className = 'text-xs md:text-sm mt-1 text-gray-400 whitespace-nowrap md:whitespace-normal';
        }
      }
    }
  });
  
  // SP版：手札の間に現在の問題を表示
  const currentThemeLabel = document.getElementById('currentThemeLabel');
  const currentThemeText = document.getElementById('currentThemeText');
  if (currentThemeLabel && currentThemeText && themes[round]) {
    currentThemeLabel.textContent = `第${round + 1}問`;
    // SP版：（）内のテキストを改行表示
    const isMobile = window.innerWidth < 768;
    let displayText = themes[round].text;
    if (isMobile) {
      // （で始まる括弧部分の前に<br>を追加
      displayText = displayText.replace(/（/g, '<br>（');
    }
    currentThemeText.innerHTML = displayText;
    // 第一問の時のみシャッフルボタン表示
    const shuffleBtn = document.getElementById('shuffleThemeBtn');
    if (shuffleBtn) {
      if (round === 0) {
        shuffleBtn.style.display = '';
      } else {
        shuffleBtn.style.display = 'none';
      }
    }
  }
}
// 問題シャッフルボタンのイベント追加
document.addEventListener('DOMContentLoaded', () => {
  const shuffleBtn = document.getElementById('shuffleThemeBtn');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      // 問題を再シャッフル
      if (typeof resetTheme === 'function') {
        resetTheme();
      }
    });
  }
});

// 決定ボタンの状態を更新
function updateConfirmButton() {
  if (selectedCardIndex >= 0 && !cardPlayed) {
    confirmCardBtn.disabled = false;
    confirmCardBtn.classList.remove("bg-gray-400", "cursor-not-allowed", "opacity-50");
    confirmCardBtn.classList.add("bg-gradient-to-b", "from-green-500", "to-green-700", "hover:shadow-green-500/50", "hover:shadow-xl", "hover:-translate-y-1", "shadow-lg", "cursor-pointer");
  } else {
    confirmCardBtn.disabled = true;
    confirmCardBtn.classList.add("bg-gray-400", "cursor-not-allowed", "opacity-50");
    confirmCardBtn.classList.remove("bg-gradient-to-b", "from-green-500", "to-green-700", "hover:shadow-green-500/50", "hover:shadow-xl", "hover:-translate-y-1", "cursor-pointer");
  }
}

function renderHands() {
  playerHandDiv.innerHTML = "";
  playerHand.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    
    if (c.flagImage) {
      b.innerHTML = `<img src="${c.flagImage}" alt="${c.name}" class="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />`;
      // 画像の長押しメニューを防止
      const img = b.querySelector('img');
      if (img) {
        img.addEventListener('contextmenu', (e) => e.preventDefault());
      }
    } else {
      b.textContent = c.flag;
    }
    b.setAttribute('aria-label', 'player-card');
    b.disabled = cardPlayed;
    
    // 選択状態のスタイル
    if (selectedCardIndex === i && !cardPlayed) {
      b.className = "w-full h-full text-5xl sm:text-7xl bg-white rounded shadow cursor-pointer transition flex items-center justify-center ring-4 ring-green-500 scale-110 relative";
    } else if (cardPlayed) {
      b.className = "w-full h-full text-5xl sm:text-7xl bg-white rounded shadow cursor-not-allowed transition flex items-center justify-center opacity-50 relative";
    } else {
      b.className = "w-full h-full text-5xl sm:text-7xl bg-white rounded shadow cursor-pointer hover:scale-105 transition flex items-center justify-center relative";
    }
    
    // ヒント表示（PC: hover、SP: クリック）
    let pressTimer;
    const showHint = () => {
      if (b.querySelector('.flag-tooltip')) return;
      const hint = document.createElement("div");
      hint.className = "flag-tooltip absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50 pointer-events-none";
      hint.textContent = c.name;
      hint.id = `hint-${i}`;
      b.appendChild(hint);
    };
    const hideHint = () => {
      const hint = b.querySelector('.flag-tooltip');
      if (hint) hint.remove();
    };
    if (window.innerWidth < 768) {
      // SP: 長押し（touchstart）で国名表示、touchendで非表示
      b.addEventListener("touchstart", (e) => {
        pressTimer = setTimeout(showHint, 500);
      });
      b.addEventListener("touchend", () => {
        clearTimeout(pressTimer);
        setTimeout(hideHint, 2000);
      });
      // 通常タップでカード選択と国名表示を同時に実行
      b.addEventListener("click", () => {
        playCard(i);
        showHint();
      });
    } else {
      // PC: hoverで表示
      b.addEventListener("mouseenter", showHint);
      b.addEventListener("mouseleave", hideHint);
      // タッチ: 長押しで表示（タブレット等）
      b.addEventListener("touchstart", (e) => {
        pressTimer = setTimeout(showHint, 500);
      });
      b.addEventListener("touchend", () => {
        clearTimeout(pressTimer);
        setTimeout(hideHint, 2000);
      });
      b.onclick = () => playCard(i);
    }
    playerHandDiv.appendChild(b);
  });

  cpuHandDiv.innerHTML = "";
  cpuHand.forEach((c, i) => {
    const s = document.createElement("div");
    if (c.flagImage) {
      s.innerHTML = `<img src="${c.flagImage}" alt="${c.name}" class="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />`;
      // 画像の長押しメニューを防止
      const img = s.querySelector('img');
      if (img) {
        img.addEventListener('contextmenu', (e) => e.preventDefault());
      }
    } else {
      s.textContent = c.flag;
    }
    s.setAttribute('aria-label', 'cpu-card');
    // CPUカードも結果表示中は選択不可の見た目にする
    if (cardPlayed) {
      s.className = "w-full h-full text-5xl sm:text-7xl bg-white rounded flex items-center justify-center relative opacity-50 cursor-not-allowed";
      s.style.pointerEvents = "none";
    } else {
      s.className = "w-full h-full text-5xl sm:text-7xl bg-white rounded flex items-center justify-center relative";
      s.style.pointerEvents = "auto";
    }
    
    // ヒント表示（hoverで国名表示、タッチは長押し）
    let pressTimer;
    const showHint = () => {
      if (s.querySelector('.flag-tooltip')) return;
      const hint = document.createElement("div");
      hint.className = "flag-tooltip absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50 pointer-events-none";
      hint.textContent = c.name;
      hint.id = `cpu-hint-${i}`;
      s.appendChild(hint);
    };
    const hideHint = () => {
      const hint = s.querySelector('.flag-tooltip');
      if (hint) hint.remove();
    };
    // PC: hoverで表示
    s.addEventListener("mouseenter", showHint);
    s.addEventListener("mouseleave", hideHint);
    // タッチ: 長押しで表示
    s.addEventListener("touchstart", (e) => {
      if (cardPlayed) return;
      pressTimer = setTimeout(showHint, 500);
    });
    s.addEventListener("touchend", () => {
      clearTimeout(pressTimer);
      if (cardPlayed) return;
      setTimeout(hideHint, 2000);
    });
    cpuHandDiv.appendChild(s);
  });
}

// ===== プレイ =====
function playCard(i) {
  if (cardPlayed) return; // すでにカードがプレイされている場合は無視
  
  // カードを選択状態にする（ダブルクリックでの確定は廃止）
  selectedCardIndex = i;
  renderHands(); // 選択状態を反映
  updateConfirmButton(); // 決定ボタンを有効化
}

// カード確定処理（決定ボタン）
function confirmCard() {
  if (cardPlayed || selectedCardIndex === -1) return;
  
  cardPlayed = true;
  // 第一問の結果発表後はシャッフルボタンを非表示にする
  if (round === 0) {
    const shuffleBtn = document.getElementById('shuffleThemeBtn');
    if (shuffleBtn) {
      shuffleBtn.style.display = 'none';
    }
  }
  const i = selectedCardIndex;
  selectedCardIndex = -1; // 選択をリセット
  updateConfirmButton(); // 決定ボタンを無効化
  
  // 🎊 前のタイムアウトをすべてクリア
  if (loserHighlightTimeout) {
    clearTimeout(loserHighlightTimeout);
    loserHighlightTimeout = null;
  }
  
  // 🎊 演出：クラスを確実にリセット
  playerField.classList.remove("winner-highlight", "loser-highlight", "draw-highlight");
  cpuField.classList.remove("winner-highlight", "loser-highlight", "draw-highlight");
  // DROWバッジを消す
  const pb = playerField.querySelector('.draw-badge');
  if(pb) pb.remove();
  const cb = cpuField.querySelector('.draw-badge');
  if(cb) cb.remove();
  
  // 🎊 演出：ボタンパルス
  const confirmBtn = document.getElementById("confirmCardBtn");
  if (confirmBtn) {
    confirmBtn.classList.add("pulse-animation");
    setTimeout(() => confirmBtn.classList.remove("pulse-animation"), 600);
  }
  
  // 🎊 演出：画面フラッシュ
  const flash = document.createElement("div");
  flash.className = "flash-effect";
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 600);
  
  const theme = themes[round];
  const p = playerHand.splice(i, 1)[0];
  
  // CPUカード選択
  let c;
  if (cpuLevel === "beginner") {
    // 初級: 完全ランダム
    const randomIndex = Math.floor(Math.random() * cpuHand.length);
    c = cpuHand.splice(randomIndex, 1)[0];
  } else {
    // 中級・上級: 評価してカードを選択
    const invertedKeys = ["densityLow", "areaSmall", "populationSmall", "nameLengthShort", "capitalLengthShort", "latitudeLow", "longitudeWest", "cca2Late", "callingCodeSmall", "happinessLow", "bordersLow", "lifeExpectancyLow", "gdpLow", "gdpPerCapitaLow", "distanceFrom", "areaSimilarTo"];
    const shouldInvert = invertedKeys.includes(theme.key);
    
    // CPUの手札を評価してスコア化
    const cpuCardsWithScores = cpuHand.map((card, index) => {
      const value = getValue(card, theme.key);
      return { card, index, value };
    });
    
    // スコア順にソート（反転キーの場合は逆順）
    cpuCardsWithScores.sort((a, b) => {
      if (shouldInvert) {
        return a.value - b.value; // 小さい方が強い
      } else {
        return b.value - a.value; // 大きい方が強い
      }
    });
    
    let selectedIndex;
    if (cpuLevel === "intermediate") {
      // 中級: 70%の確率で上位3枚から選択、30%の確率でランダム
      if (Math.random() < 0.7) {
        const topCount = Math.min(3, cpuCardsWithScores.length);
        const randomTop = Math.floor(Math.random() * topCount);
        selectedIndex = cpuCardsWithScores[randomTop].index;
      } else {
        selectedIndex = Math.floor(Math.random() * cpuHand.length);
      }
    } else {
      // 上級: 常に最適解（最も強いカード）
      selectedIndex = cpuCardsWithScores[0].index;
    }
    
    c = cpuHand.splice(selectedIndex, 1)[0];
  }

  const pv = getValue(p, theme.key);
  const cv = getValue(c, theme.key);

  // バトルフィールドを表示
  playerField.parentElement.parentElement.classList.remove("hidden");
  
  // 🎊 演出：フィールドに登場アニメーションを追加
  playerField.classList.add("field-appear");
  cpuField.classList.add("field-appear");
  
  // 🎊 演出：少し待機してから勝敗判定を実施（ワクワク感）
  const delayMs = 800;

  // 逆転するべきキーのリスト（小さい方が勝ち）
  const invertedKeys = ["densityLow", "areaSmall", "populationSmall", "nameLengthShort", "capitalLengthShort", "latitudeLow", "longitudeWest", "cca2Late", "callingCodeSmall", "happinessLow", "bordersLow", "lifeExpectancyLow", "gdpLow", "gdpPerCapitaLow", "distanceFrom", "areaSimilarTo", "passportVisaFreeLow", "tourismArrivalsLow", "precipitationLow", "averageHeightLow", "riceConsumptionLow", "internetPenetrationLow", "wheatConsumptionLow", "averageTemperatureLow"];
  const shouldInvert = invertedKeys.includes(theme.key);

  const showBorders = theme.key === "borders" || theme.key === "bordersLow";
  
  playerField.innerHTML = `
    <div class="flex justify-center items-center country-flag-interactive" data-country='${JSON.stringify(p).replace(/'/g, "&apos;")}'>${p.flagImage ? `<img src="${p.flagImage}" alt="${p.name}" class="w-20 h-20 object-contain" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />` : `<div class="text-6xl text-red-600">${p.flag}</div>`}</div>
    <div class="mt-1 text-base font-medium text-red-700">${p.name}</div>
    <div class="text-xs text-gray-600">${getIndicatorLabel(theme.key)}: ${formatValue(pv, theme.key)}${getUnit(theme.key)}</div>
    ${showBorders ? `<div class="text-xs text-gray-500 mt-1">
      ${p.borderCountries && p.borderCountries.length > 0 ? `隣接国: ${p.borderCountries.join(", ")}` : "隣接国: なし"}
    </div>` : ''}
  `;

  cpuField.innerHTML = `
    <div class="flex justify-center items-center country-flag-interactive" data-country='${JSON.stringify(c).replace(/'/g, "&apos;")}'>${c.flagImage ? `<img src="${c.flagImage}" alt="${c.name}" class="w-20 h-20 object-contain" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />` : `<div class="text-6xl text-blue-600">${c.flag}</div>`}</div>
    <div class="mt-1 text-base font-medium text-blue-700">${c.name}</div>
    <div class="text-xs text-gray-600">${getIndicatorLabel(theme.key)}: ${formatValue(cv, theme.key)}${getUnit(theme.key)}</div>
    ${showBorders ? `<div class="text-xs text-gray-500 mt-1">
      ${c.borderCountries && c.borderCountries.length > 0 ? `隣接国: ${c.borderCountries.join(", ")}` : "隣接国: なし"}
    </div>` : ''}
  `;

  let winner = "draw";
  // 人口密度の特殊判定: 0.00人/km²は2.66人/km²に必ず負ける（0同士は引き分け）
  if (theme.key === "density" || theme.key === "densityLow") {
    if (pv === 0 && cv === 0) {
      winner = "draw";
    } else if (pv === 0 && cv > 0) {
      winner = "cpu";
    } else if (cv === 0 && pv > 0) {
      winner = "player";
    } else if (shouldInvert) {
      if (pv < cv) winner = "player";
      if (pv > cv) winner = "cpu";
    } else {
      if (pv > cv) winner = "player";
      if (pv < cv) winner = "cpu";
    }
  } else {
    if (shouldInvert) {
      if (pv < cv) winner = "player";
      if (pv > cv) winner = "cpu";
    } else {
      if (pv > cv) winner = "player";
      if (pv < cv) winner = "cpu";
    }
  }

  results.push({ theme: theme.text, key: theme.key, p, c, pv, cv, winner });

  // 🎊 演出：少し待機してから勝敗判定を表示（ワクワク感）
  setTimeout(() => {
    // 勝者・敗者のフィールドを強調（同時に表示）
    if (winner === "player") {
      playerField.classList.add("winner-highlight", "player-win");
      cpuField.classList.add("loser-highlight");
    } else if (winner === "cpu") {
      cpuField.classList.add("winner-highlight", "cpu-win");
      playerField.classList.add("loser-highlight");
    } else if (winner === "draw") {
      playerField.classList.add("draw-highlight");
      cpuField.classList.add("draw-highlight");
      // DROWバッジを右上に追加
      const playerBadge = document.createElement("span");
      playerBadge.className = "draw-badge";
      playerBadge.textContent = "DROW";
      playerBadge.style.position = "absolute";
      playerBadge.style.top = "12px";
      playerBadge.style.right = "12px";
      playerField.appendChild(playerBadge);
      const cpuBadge = document.createElement("span");
      cpuBadge.className = "draw-badge";
      cpuBadge.textContent = "DROW";
      cpuBadge.style.position = "absolute";
      cpuBadge.style.top = "12px";
      cpuBadge.style.right = "12px";
      cpuField.appendChild(cpuBadge);
    }
    
    // バトルフィールドの国旗に長押しイベントを追加
    addLongPressToFlags();

    // 最終ラウンドの場合はボタン表示を変更
    if (round === selectedRoundCount - 1) {
      nextBtn.textContent = "総合成績へ";
      nextBtn.className = "px-6 py-3 md:px-8 md:py-4 bg-yellow-500 text-black font-bold text-base md:text-lg rounded-full shadow hover:bg-yellow-600 transition";
    } else {
      nextBtn.textContent = "次のラウンドへ";
      nextBtn.className = "px-4 py-2 bg-blue-600 text-white text-sm rounded-full shadow hover:bg-blue-700 transition";
    }
    
    nextBtn.classList.remove("hidden");
    renderHands();
  }, delayMs);
}

// ===== 次のラウンド =====
function nextRound() {
  cardPlayed = false; // リセット
  selectedCardIndex = -1; // 選択をリセット
  updateConfirmButton(); // 決定ボタンを無効化
  nextBtn.classList.add("hidden");
  
  // フィールドの強調をリセット
  playerField.classList.remove("winner-highlight", "draw-highlight");
  cpuField.classList.remove("winner-highlight", "draw-highlight");
  // DROWバッジを消す
  const pb = playerField.querySelector('.draw-badge');
  if(pb) pb.remove();
  const cb = cpuField.querySelector('.draw-badge');
  if(cb) cb.remove();
  // ===== DROWバッジ用CSSを追加 =====
  const style = document.createElement('style');
  style.innerHTML = `
  .draw-badge {
    display: inline-block;
    background: #aaa;
    color: #fff;
    font-weight: bold;
    border-radius: 8px;
    padding: 2px 12px;
    font-size: 1.2rem;
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
  }
  .draw-highlight {
    border: 2px solid #aaa !important;
    background: #f3f3f3 !important;
  }
  `;
  document.head.appendChild(style);
  
  // バトルフィールドをクリアして非表示
  playerField.innerHTML = ``;
  cpuField.innerHTML = ``;
  playerField.parentElement.parentElement.classList.add("hidden");

  round++;
  if (round === selectedRoundCount) {
    // 🎊 演出：総合成績へ移行する時の演出（タメなしですぐ移行）
    // ボタンにパルス効果
    nextBtn.classList.remove("hidden");
    nextBtn.classList.add("summary-button-pulse");
    
    // 画面フラッシュ
    gameScreen.classList.add("screen-flash");
    
    // 演出とともにすぐに総合成績を表示
    setTimeout(() => {
      nextBtn.classList.add("hidden");
      showSummary();
    }, 100); // 最小限の遅延のみ
    
    return;
  }

  updateRoundHighlight();
  showTheme();
  renderHands(); // カードを再描画してボタンを有効化
}

// ===== サマリー =====
function showSummary() {
  gameScreen.classList.add("hidden");
  summaryScreen.classList.remove("hidden");

  // 選択した設定を表示
  updateSettingsDisplay();

  let pScore = 0, cScore = 0;
  
  // スコア計算
  results.forEach(r => {
    if (r.winner === "player") pScore++;
    if (r.winner === "cpu") cScore++;
  });

  // サマリー画面下部の「10カ国の位置を確認」ボタンにクリックイベントを付与
  const showMapBtn = document.getElementById('showAllCountriesMapBtn');
  if (showMapBtn) {
    showMapBtn.onclick = () => showAllCountriesMapModal();
  }
  
  // 総合勝者の決定
  const levelNames = {
    beginner: "弱い",
    intermediate: "普通",
    advanced: "強い"
  };
  const levelText = levelNames[cpuLevel] || "";
  
  let overallWinnerText = "";
  if (selectedRoundCount === 9) {
    if (pScore > cScore) {
      overallWinnerText = `<div class="text-5xl font-black text-red-700 mb-4 hidden-initially" id="winnerTitle">あなたの勝利！</div>`;
    } else if (cScore > pScore) {
      overallWinnerText = `<div class="text-5xl font-black text-blue-700 mb-4 hidden-initially" id="winnerTitle">CPU（${levelText}）の勝利</div>`;
    } else {
      overallWinnerText = `<div class="text-5xl font-black text-gray-700 mb-4 hidden-initially" id="winnerTitle">引き分け</div>`;
    }
  } else {
    if (pScore >= 3) {
      overallWinnerText = `<div class="text-5xl font-black text-red-700 mb-4 hidden-initially" id="winnerTitle">あなたの勝利！</div>`;
    } else if (cScore >= 3) {
      overallWinnerText = `<div class="text-5xl font-black text-blue-700 mb-4 hidden-initially" id="winnerTitle">CPU（${levelText}）の勝利</div>`;
    } else {
      overallWinnerText = `<div class="text-5xl font-black text-gray-700 mb-4 hidden-initially" id="winnerTitle">引き分け</div>`;
    }
  }

  // 総合成績テキスト（例: 総合成績: あなた 4-1 CPU(普通)）
  // 勝者の色を適用
  let matchResultColor = "text-gray-700";
  if (pScore > cScore) matchResultColor = "text-red-700";
  else if (pScore < cScore) matchResultColor = "text-blue-700";
  const matchResultText = `<div class="text-xl font-bold text-center mb-2 fade-in-up ${matchResultColor}" id="matchResult">総合成績: あなた ${pScore}-${cScore} CPU${levelText ? `（${levelText}）` : ""}</div>`;

  // 🎊 演出：初期状態はすべて非表示
  summaryDetails.innerHTML = `
    ${overallWinnerText}
    ${matchResultText}
    <div class="text-3xl text-center mb-6 hidden-initially" id="finalScore">
      最終スコア：${pScore} - ${cScore}
    </div>
    <div class="text-center mb-4">
      <p class="text-xs text-gray-800">💡 国旗を長押しすると地図が表示されます</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-2" id="resultsGrid">
      ${results.map((r, i) => {
        let bgColor = "bg-gray-200";
        if (r.winner === "player") bgColor = "bg-red-200";
        if (r.winner === "cpu") bgColor = "bg-blue-200";
        const showBorders = r.key === "borders" || r.key === "bordersLow";
        
        return `
          <div class="${bgColor} rounded-lg p-3 text-center hidden-initially result-card" data-index="${i}">
            <div class="text-lg font-bold mb-2">
              ${r.winner === "player" ? '<span class="bg-yellow-400 text-black rounded px-1">WIN</span>' : r.winner === "cpu" ? "LOSE" : "DRAW"}
            </div>
            <div class="text-xs font-semibold mb-1">第${i + 1}問</div>
            <div class="text-xs text-gray-700 mb-2">${r.theme.replace('<br>', ' ')}</div>
            
            <div class="flex justify-center items-center mb-1 country-flag-interactive" data-country='${JSON.stringify(r.p).replace(/'/g, "&apos;")}'>${r.p.flagImage ? `<img src="${r.p.flagImage}" alt="${r.p.name}" class="w-14 h-14 object-contain" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />` : `<div class="text-3xl">${r.p.flag}</div>`}</div>
            <div class="text-xs font-semibold mb-1">${r.p.name}</div>
            <div class="text-xs mb-1">${getIndicatorLabel(r.key)}: <strong>${formatValue(r.pv, r.key)}${getUnit(r.key)}</strong></div>
            
            <div class="text-xs font-bold ${r.winner === "player" ? "text-red-700" : "text-gray-500"} my-1">vs</div>
            
            <div class="flex justify-center items-center mb-1 country-flag-interactive" data-country='${JSON.stringify(r.c).replace(/'/g, "&apos;")}'>${r.c.flagImage ? `<img src="${r.c.flagImage}" alt="${r.c.name}" class="w-14 h-14 object-contain" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />` : `<div class="text-3xl">${r.c.flag}</div>`}</div>
            <div class="text-xs font-semibold mb-1">${r.c.name}</div>
            <div class="text-xs mb-1">${getIndicatorLabel(r.key)}: <strong>${formatValue(r.cv, r.key)}${getUnit(r.key)}</strong></div>
            ${showBorders ? `<div class="text-xs mt-2 text-gray-500">
              ${r.p.borderCountries && r.p.borderCountries.length > 0 ? `${r.p.flag}:${r.p.borderCountries.join(",")}` : `${r.p.flag}:隣接国なし`}<br>
              ${r.c.borderCountries && r.c.borderCountries.length > 0 ? `${r.c.flag}:${r.c.borderCountries.join(",")}` : `${r.c.flag}:隣接国なし`}
            </div>` : ''}
          </div>`;
      }).join("")}
    </div>
  `;
  
  // 長押しイベントを追加
  setTimeout(() => addLongPressToFlags(), 100);
  
  // 勝者の色で背景を塗る
  if (pScore > cScore) {
    summaryScreen.className = "hidden min-h-screen flex flex-col items-center justify-center gap-6 relative bg-red-100";
  } else if (pScore < cScore) {
    summaryScreen.className = "hidden min-h-screen flex flex-col items-center justify-center gap-6 relative bg-blue-100";
  } else {
    summaryScreen.className = "hidden min-h-screen flex flex-col items-center justify-center gap-6 relative bg-gray-100";
  }
  summaryScreen.classList.remove("hidden");
  
  // 🎊 演出：順次表示（合計2秒程度）
  const resultCards = document.querySelectorAll('.result-card');
  const finalScoreEl = document.getElementById('finalScore');
  const winnerTitleEl = document.getElementById('winnerTitle');
  
  // 第1問〜第5問を順次表示（各0.15秒間隔、合計0.75秒）
  resultCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('fade-in-up');
    }, index * 150);
  });
  
  // 最終スコア表示（0.9秒後）
  setTimeout(() => {
    finalScoreEl.classList.add('fade-in-up');
  }, 900);
  
  // 勝利タイトル表示（1.3秒後）
  setTimeout(() => {
    winnerTitleEl.classList.add('fade-in-up');
  }, 1300);
  
  // もう一度プレイボタンを表示（1.7秒後）
  setTimeout(() => {
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
      restartBtn.style.opacity = '0';
      restartBtn.style.display = 'block';
      setTimeout(() => {
        restartBtn.style.transition = 'opacity 0.3s ease-out';
        restartBtn.style.opacity = '1';
      }, 10);
    }
  }, 1700);
}

// ===== 補助 =====
function formatValue(value, key) {
  // 人口は『X億Y万』表記に統一（内部値は万）
  if (key === "population" || key === "populationSmall") {
    const man = Math.round(value || 0); // 万単位
    const oku = Math.floor(man / 10000);
    const rest = man % 10000;
    if (oku > 0) {
      return rest === 0 ? `${oku}億` : `${oku}億${rest}万`;
    }
    return `${man}万`;
  }

  // 面積は『万km²』に変換し整数で表示（四捨五入）
  if (key === "area" || key === "areaSmall") {
    const raw = value || 0;
    // APIはkm²、フォールバックは千km²のため、値が1万未満なら千km²とみなしkm²へ変換
    const km2 = raw < 10000 ? raw * 1000 : raw;
    const manKm2 = Math.round(km2 / 10000);
    return manKm2.toString();
  }

  // 緯度は「北緯〇度」「南緯〇度」形式で表示
  if (key === "latitude" || key === "latitudeLow") {
    const absValue = Math.round(Math.abs(value || 0));
    const prefix = (value >= 0) ? "北緯" : "南緯";
    return `${prefix}${absValue}度`;
  }

  // 経度は「東経〇度」「西経〇度」形式で表示
  if (key === "longitude" || key === "longitudeWest") {
    const absValue = Math.round(Math.abs(value || 0));
    const prefix = (value >= 0) ? "東経" : "西経";
    return `${prefix}${absValue}度`;
  }

  // 幸福度は小数1桁表示
  if (key === "happiness" || key === "happinessLow") {
    return (value || 0).toFixed(1);
  }

  // 平均寿命は小数1桁表示
  if (key === "lifeExpectancy" || key === "lifeExpectancyLow") {
    return (value || 70).toFixed(1);
  }

  // GDPは億ドル単位で表示（百万ドル→億ドル変換）
  // 5桁以上（10000億ドル以上）の場合は兆ドル単位で表示
  if (key === "gdp" || key === "gdpLow") {
    const okuDollar = Math.round((value || 10000) / 100);
    if (okuDollar >= 10000) {
      const chouDollar = (okuDollar / 10000).toFixed(1);
      return `${chouDollar}兆`;
    }
    return okuDollar.toString();
  }

  // 一人当たりGDPは万ドル単位で表示（小数点1桁）
  if (key === "gdpPerCapita" || key === "gdpPerCapitaLow") {
    const manDollar = (value / 10000).toFixed(1);
    return manDollar;
  }

  // パスポートのビザフリー数は整数表示
  if (key === "passportVisaFree" || key === "passportVisaFreeLow") {
    return Math.round(value || 0).toString();
  }

  // 観光客数は整数表示（千人）
  if (key === "tourismArrivals" || key === "tourismArrivalsLow") {
    return Math.round(value || 0).toString();
  }
  // 降水量（mm）は整数表示
  if (key === "precipitation" || key === "precipitationLow") {
    return Math.round(value || 0).toString();
  } 
  // 平均身長は小数点1位まで表示
  if (key === "averageHeight" || key === "averageHeightLow") {
    return (value || 0).toFixed(1);
  }
  // 米の消費量は整数表示
  if (key === "riceConsumption" || key === "riceConsumptionLow") {
    return Math.round(value || 0).toString();
  }
  // インターネット普及率は小数点1位まで表示
  if (key === "internetPenetration" || key === "internetPenetrationLow") {
    return (value || 0).toFixed(1);

  }

  // 平均気温は小数点1位まで表示
  if (key === "averageTemperature" || key === "averageTemperatureLow") {
    return (value || 0).toFixed(1);
  }
  // 小麦消費量は整数表示
  if (key === "wheatConsumption" || key === "wheatConsumptionLow") {
    return Math.round(value || 0).toString();
  }
  // 距離は整数表示（km）
  if (key === "distanceFrom") {
    return Math.round(value).toString();
  }

  // 面積差は整数表示（万km²）
  if (key === "areaSimilarTo") {
    return Math.round(value).toString();
  }

  // オリンピックメダル総数は整数表示
  if (key === "olympicMedals") {
    return Math.round(value || 0).toString();
  }

  // 世界遺産数は整数表示
  if (key === "worldHeritage") {
    return Math.round(value || 0).toString();
  }



  // 人口密度は小数点第2位まで表示
  if (key === "density" || key === "densityLow") {
    return (value || 0).toFixed(2);
  }

  // 隣接国数は整数表示（四捨五入なし）
  if (key === "borders" || key === "bordersLow") {
    return Math.floor(value || 0).toString();
  }

  // 公用語や整数のみの項目は整数表記
  const integerKeys = ["languages", "timezones", "continents", "currencies"];
  if (integerKeys.includes(key)) {
    return Math.round(value).toString();
  }
  // その他は小数点5桁まで表示
  return value.toFixed(5);
}

function getUnit(key) {
  const units = {
    area: "万km\u00b2",
    areaSmall: "万km\u00b2",
    population: "",
    populationSmall: "",
    density: "人/km\u00b2",
    densityLow: "人/km\u00b2",
    timezones: "個",
    languages: "言語",
    borders: "カ国",
    latitude: "",
    latitudeLow: "",
    longitude: "",
    longitudeWest: "",
    continents: "大陸",
    currencies: "通貨",
    happiness: "",
    happinessLow: "",
    lifeExpectancy: "歳",
    lifeExpectancyLow: "歳",
    gdp: "億ドル",
    gdpLow: "億ドル",
    gdpPerCapita: "万ドル",
    gdpPerCapitaLow: "万ドル",
    olympicMedals: "個",
    worldHeritage: "件",
    distanceFrom: "km",
    areaSimilarTo: "万km²",
    passportVisaFree: "カ国",
    passportVisaFreeLow: "カ国",
    tourismArrivals: "千人",
    tourismArrivalsLow: "千人",
    precipitation: "mm",
    precipitationLow: "mm",
    averageHeight: "cm",
    averageHeightLow: "cm",
    riceConsumption: "トン",
    riceConsumptionLow: "トン",
    internetPenetration: "%",
    internetPenetrationLow: "%",
    wheatConsumptionData: "トン",
    wheatConsumptionLow: "トン",
    averageTemperature: "度",
    averageTemperatureLow: "度",
    

  };
  return units[key] || "";
}

// 指標名（日本語ラベル）
function getIndicatorLabel(key) {
  const labels = {
    area: "面積",
    areaSmall: "面積",
    population: "人口",
    populationSmall: "人口",
    density: "人口密度",
    densityLow: "人口密度",
    latitude: "緯度",
    latitudeLow: "緯度",
    longitude: "経度",
    longitudeWest: "経度",
    happiness: "幸福度指数",
    happinessLow: "幸福度指数",
    borders: "隣接国数",
    bordersLow: "隣接国数",
    lifeExpectancy: "平均寿命",
    lifeExpectancyLow: "平均寿命",
    gdp: "GDP",
    gdpLow: "GDP",
    gdpPerCapita: "一人当たりGDP",
    gdpPerCapitaLow: "一人当たりGDP",
    olympicMedals: "オリンピックメダル数",
    distanceFrom: "首都間の距離",
    areaSimilarTo: "面積差",
    worldHeritage: "世界遺産数",
    passportVisaFree: "ビザフリー渡航可能国数",
    passportVisaFreeLow: "ビザフリー渡航可能国数",
    tourismArrivals: "観光客数",
    tourismArrivalsLow: "観光客数",
    precipitation: "年間降水量",
    precipitationLow: "年間降水量",
    averageHeight: "平均身長",
    averageHeightLow: "平均身長",
    riceConsumption: "米の消費量",
    riceConsumptionLow: "米の消費量",
    internetPenetration: "インターネット普及率",
    internetPenetrationLow: "インターネット普及率",
    averageTemperature: "平均気温",
    averageTemperatureLow: "平均気温",
    wheatConsumptionLow: "小麦消費量",
    wheatConsumption: "小麦消費量",

    timezones: "タイムゾーン数",
    languages: "公用語数",
    continents: "大陸数",
    currencies: "通貨数",
    nameLength: "国名の長さ",
    nameLengthShort: "国名の長さ",
    capitalLength: "首都名の長さ",
    capitalLengthShort: "首都名の長さ",
    cca2: "国コード",
    cca2Late: "国コード",
    callingCode: "国際電話番号",
    callingCodeSmall: "国際電話番号",
    carSideRight: "交通",
    carSideLeft: "交通",
    startOfWeek: "週の始まり"
  };
  return labels[key] || key;
}

function getValue(c, key) {
  if (key === "density") return c.population / c.area;
  if (key === "densityLow") return c.population / c.area; // 低い方は比較で逆転するので、表示は正の値
  if (key === "borders" || key === "bordersLow") return c.borders; // 隣接国数
  if (key === "nameLength") return c.name.length;
  if (key === "nameLengthShort") return c.name.length; // 短い方は比較で逆転
  if (key === "capitalLength") return c.capital.length;
  if (key === "capitalLengthShort") return c.capital.length;
  if (key === "areaSmall") return c.area; // 小さい方は比較で逆転
  if (key === "populationSmall") return c.population; // 少ない方は比較で逆転
  if (key === "regionLength") return c.region.length;
  if (key === "happiness") return c.happiness || 5.0; // 高い方が勝ち
  if (key === "happinessLow") return c.happiness || 5.0; // 低い方が勝ち（比較で逆転）
  if (key === "lifeExpectancy") return c.lifeExpectancy || 70; // 平均寿命が高い方が勝ち
  if (key === "lifeExpectancyLow") return c.lifeExpectancy || 70; // 平均寿命が低い方が勝ち（比較で逆転）
  if (key === "gdp") return c.gdp || 10000; // GDPが高い方が勝ち
  if (key === "gdpLow") return c.gdp || 10000; // GDPが低い方が勝ち（比較で逆転）
  if (key === "gdpPerCapita") {
    // 一人当たりGDP = GDP（百万ドル） / 人口（万人） = 万ドル/万人 = ドル/人
    const populationInMillions = c.population / 100; // 万人→百万人
    if (populationInMillions === 0) return 0;
    return (c.gdp || 10000) / populationInMillions; // ドル/人
  }
  if (key === "gdpPerCapitaLow") {
    const populationInMillions = c.population / 100;
    if (populationInMillions === 0) return 0;
    return (c.gdp || 10000) / populationInMillions;
  }
  if (key === "olympicMedals") return c.olympicMedals || 0; // オリンピックメダル総数が多い方が勝ち
  if (key === "worldHeritage") return c.worldHeritage || 0; // 世界遺産数が多い方が勝ち
  if (key === "passportVisaFree") return c.passportVisaFree || 0; // ビザフリー渡航可能国数が多い方が勝ち
  if (key === "passportVisaFreeLow") return c.passportVisaFree || 0; // ビザフリー渡航可能国数が少ない方が勝ち
  if (key === "tourismArrivals") return c.tourismArrivals || 0; // 観光客数が多い方が勝ち
  if (key === "tourismArrivalsLow") return c.tourismArrivals || 0; // 観光客数が少ない方が勝ち
  if (key === "precipitation") return c.precipitation || 0; // 降水量が多い方が勝ち
  if (key === "precipitationLow") return c.precipitation || 0; // 降水量が少ない方が勝ち
  if (key === "averageHeight") return c.averageHeight || 0; // 平均身長が高い方が勝ち
  if (key === "averageHeightLow") return c.averageHeight || 0; // 平均身長が低い方が勝ち
  if (key === "riceConsumption") return c.riceConsumption || 0; // 米の消費量が多い方が勝ち
  if (key === "riceConsumptionLow") return c.riceConsumption || 0; // 米の消費量が少ない方が勝ち
  if (key === "internetPenetration") return c.internetPenetration || 0; // インターネット普及率が高い方が勝ち
  if (key === "internetPenetrationLow") return c.internetPenetration || 0; // インターネット普及率が低い方が勝ち
  if (key === "averageTemperature") return c.averageTemperature || 0; // 平均気温が高い方が勝ち
  if (key === "averageTemperatureLow") return c.averageTemperature || 0; // 平均気温が低い方が勝ち
  if (key === "wheatConsumption") return c.wheatConsumption || 0; // 小麦消費量が多い方が勝ち
  if (key === "wheatConsumptionLow") return c.wheatConsumption || 0; // 小麦消費量が少ない方が勝ち  

  if (key === "distanceFrom") {
    // 現在のテーマから対象国を取得
    const currentTheme = themes[round];
    if (currentTheme && currentTheme.targetCountry) {
      const target = currentTheme.targetCountry;
      return calculateDistance(target.latitude, target.longitude, c.latitude, c.longitude);
    }
    return 0;
  }
  if (key === "areaSimilarTo") {
    // 現在のテーマから対象国を取得
    const currentTheme = themes[round];
    if (currentTheme && currentTheme.targetCountry) {
      const target = currentTheme.targetCountry;
      return Math.abs((target.area || 0) - (c.area || 0)); // 面積の差（絶対値）
    }
    return 0;
  }
  if (key === "latitudeLow") return c.latitude; // 符号付きで返す（南極に近い＝より負の値）
  if (key === "longitudeWest") return c.longitude; // 符号付きで返す（西経＝より負の値）
  if (key === "cca2Late") return c.cca2.charCodeAt(0) * 100 + c.cca2.charCodeAt(1);
  if (key === "callingCodeSmall") return parseInt(c.callingCode || 0);
  if (key === "carSideRight") return c.carSide;
  if (key === "carSideLeft") return 1 - c.carSide;
  if (key === "flagEmoji") return c.flag.codePointAt(0);
  if (key === "callingCode") return parseInt(c.callingCode || 0);
  if (key === "cca2") return c.cca2.charCodeAt(0) * 100 + c.cca2.charCodeAt(1);
  return c[key] || 0;
}

function updateRoundHighlight() {
  themes.forEach((_, i) => {
    const elem = document.getElementById(`r${i}`);
    const titleDiv = elem.querySelector('div:first-child'); // 第○問のdiv
    
    if (i === round) {
      // 現在の問題は緑色背景・白文字・太字
      elem.className = "text-center px-2 flex-shrink-0 min-w-[140px] md:min-w-0 bg-green-600 text-white rounded font-bold";
      if (titleDiv) titleDiv.className = "text-base md:text-lg font-semibold";
    } else if (i < round && results[i]) {
      // 終わった問題は勝者の色背景・薄いグレー文字・通常フォント（透明度を上げて薄く）
      const winner = results[i].winner;
      if (winner === "player") {
        elem.className = "text-center px-2 flex-shrink-0 min-w-[140px] md:min-w-0 bg-red-200/50 text-gray-400 rounded";
      } else if (winner === "cpu") {
        elem.className = "text-center px-2 flex-shrink-0 min-w-[140px] md:min-w-0 bg-blue-200/50 text-gray-400 rounded";
      } else {
        elem.className = "text-center px-2 flex-shrink-0 min-w-[140px] md:min-w-0 bg-gray-200/50 text-gray-400 rounded";
      }
      if (titleDiv) titleDiv.className = "text-base md:text-lg font-normal";
    } else {
      // 未来の問題は薄いグレー・太字
      elem.className = "text-center px-2 flex-shrink-0 min-w-[140px] md:min-w-0 text-gray-400";
      if (titleDiv) titleDiv.className = "text-base md:text-lg font-semibold";
    }
  });
}

// ===== 地図モーダル機能 =====
// 10カ国の位置を確認ボタンの長押しで、全ての国をピン留めした地図を表示
function showAllCountriesMapModal() {
  // 直近のゲームで出題された国リストを取得
  // resultsGridのresult-cardからdata-country属性を抽出
  const cards = document.querySelectorAll('#resultsGrid .country-flag-interactive');
  const countries = [];
  cards.forEach(card => {
    try {
      const country = card.dataset.country ? JSON.parse(card.dataset.country) : null;
      if (country && country.latitude && country.longitude) {
        // 重複除去
        if (!countries.some(c => c.name === country.name)) {
          countries.push(country);
        }
      }
    } catch(e) {}
  });
  if (countries.length === 0) return;
  // 地図の中心・ズームを計算
  const lats = countries.map(c => c.latitude);
  const lngs = countries.map(c => c.longitude);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  const mapModal = document.getElementById("mapModal");
  const mapModalTitle = document.getElementById("mapModalTitle");
  const mapModalContent = document.getElementById("mapModalContent");
  mapModalTitle.textContent = `全ての国の位置`;
  mapModalContent.innerHTML = `
    <div id='leafletMap' class='relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-2'></div>
  `;
  mapModal.classList.remove("hidden");
  // Leaflet.jsで複数ピンを表示
  setTimeout(() => {
    if (window.L) {
      if (window.leafletMapInstance) {
        window.leafletMapInstance.remove();
      }
      window.leafletMapInstance = L.map('leafletMap').setView([centerLat, centerLng], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(window.leafletMapInstance);
      // === 赤道（緯度0°）を描画 ===
      const equator = [
        [-0.0001, -180],
        [-0.0001, 180],
        [0.0001, 180],
        [0.0001, -180],
        [-0.0001, -180]
      ];
      L.polyline(equator, {color: '#ff8888', weight: 3, opacity: 0.3, dashArray: '8,6'}).addTo(window.leafletMapInstance);

      // === 日付変更線（経度180°/−180°）を描画 ===
      const dateline = [
        [-90, 180],
        [90, 180]
      ];
      L.polyline(dateline, {color: '#888', weight: 3, opacity: 0.2, dashArray: '8,6'}).addTo(window.leafletMapInstance);

      const dateline2 = [
        [-90, -180],
        [90, -180]
      ];
      L.polyline(dateline2, {color: '#888', weight: 3, opacity: 0.2, dashArray: '8,6'}).addTo(window.leafletMapInstance);
      // 10カ国のGeoJSONを読み込んで塗り潰し
      fetch('countries.geojson')
        .then(response => response.json())
        .then(data => {
          L.geoJSON(data, {
            style: {
              color: '#3399ff', // 枠線
              weight: 1
              // 塗りつぶし削除
            }
          }).addTo(window.leafletMapInstance);
        });
      countries.forEach(c => {
        // 国旗画像をマーカーアイコンとして表示
        let iconHtml = c.flagImage
          ? `<img src='${c.flagImage}' alt='${c.name}' style='width:32px;height:24px;border-radius:4px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.15);background:#fff;'>`
          : c.flag ? `<span style='font-size:2rem;'>${c.flag}</span>` : "";
        const flagIcon = L.divIcon({
          html: iconHtml,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 32], // ピンの下部が座標に合うように
          popupAnchor: [0, -32]
        });
        L.marker([c.latitude, c.longitude], { icon: flagIcon }).addTo(window.leafletMapInstance)
          .bindPopup(`${c.name}`);
        // 地形（国境ポリゴン）があれば枠線のみ表示（塗りつぶし削除）
        if (c.geojson) {
          L.geoJSON(c.geojson, {
            style: {
              color: '#3399ff', // 枠線
              weight: 1
              // 塗りつぶし削除
            }
          }).addTo(window.leafletMapInstance);
        }
      });
    }
  }, 100);
}
function showCountryOnMap(country) {
  const mapModal = document.getElementById("mapModal");
  const mapModalTitle = document.getElementById("mapModalTitle");
  const mapModalContent = document.getElementById("mapModalContent");
  
  mapModalTitle.textContent = `${country.name} の位置`;
  
  // OpenStreetMapの埋め込み地図を使用
  const lat = country.latitude || 0;
  const lng = country.longitude || 0;
  const zoom = 4;
  
  mapModalContent.innerHTML = `
    <div class="mb-4 text-center">
      <div class="inline-flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg">
        ${country.flagImage ? `<img src="${country.flagImage}" alt="${country.name}" class="w-12 h-12 object-contain" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />` : `<span class="text-4xl">${country.flag}</span>`}
        <div class="text-left">
          <div class="font-bold text-lg">${country.name}</div>
          <div class="text-sm text-gray-600">首都: ${country.capital || '不明'}</div>
          <div class="text-xs text-gray-500">緯度: ${lat.toFixed(2)}° / 経度: ${lng.toFixed(2)}°</div>
        </div>
      </div>
    </div>
    <div class="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        src="https://www.openstreetmap.org/export/embed.html?bbox=${lng-10},${lat-10},${lng+10},${lat+10}&layer=mapnik&marker=${lat},${lng}"
        style="border: 0;">
      </iframe>
    </div>
    <div class="mt-3 text-center">
      <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}" 
         target="_blank" 
         class="text-blue-600 hover:text-blue-800 text-sm underline">
        OpenStreetMapで大きく表示
      </a>
    </div>
  `;
  
  mapModal.classList.remove("hidden");
}

// 地図モーダルを閉じる
// 「10カ国の位置を確認」ボタンに長押しイベントを追加
const allCountriesBtn = document.getElementById('showAllCountriesMapBtn');
if (allCountriesBtn) {
  let pressTimer;
  allCountriesBtn.addEventListener('mousedown', () => {
    pressTimer = setTimeout(() => {
      showAllCountriesMapModal();
    }, 500);
  });
  allCountriesBtn.addEventListener('mouseup', () => {
    clearTimeout(pressTimer);
  });
  allCountriesBtn.addEventListener('mouseleave', () => {
    clearTimeout(pressTimer);
  });
  // タッチ対応
  allCountriesBtn.addEventListener('touchstart', () => {
    pressTimer = setTimeout(() => {
      showAllCountriesMapModal();
    }, 500);
  }, { passive: true });
  allCountriesBtn.addEventListener('touchend', () => {
    clearTimeout(pressTimer);
  }, { passive: true });
  allCountriesBtn.addEventListener('touchmove', () => {
    clearTimeout(pressTimer);
  }, { passive: true });
}
document.getElementById("closeMapModal").addEventListener("click", () => {
  document.getElementById("mapModal").classList.add("hidden");
});

// モーダル背景クリックで閉じる
document.getElementById("mapModal").addEventListener("click", (e) => {
  if (e.target.id === "mapModal") {
    document.getElementById("mapModal").classList.add("hidden");
  }
});

// 作成中ゲーム関連のイベントリスナーを設定
function setupInDevGamesListeners() {
  const inDevGamesBtn = document.getElementById("inDevGamesBtn");
  const startScreen = document.getElementById("startScreen");
  const inDevGamesScreen = document.getElementById("inDevGamesScreen");
  const backToStartFromInDev = document.getElementById("backToStartFromInDev");
  const akineatorBtn = document.getElementById("akineatorBtn");
  const highlowBtn = document.getElementById("highlowBtn");

  // 作成中ゲーム画面に遷移
  if (inDevGamesBtn && startScreen && inDevGamesScreen) {
    inDevGamesBtn.addEventListener("click", () => {
      console.log("作成中ゲームボタンがクリックされました");
      startScreen.classList.add("hidden");
      inDevGamesScreen.classList.remove("hidden");
    });
  }

  // 戻るボタン
  if (backToStartBtn) {
    backToStartBtn.addEventListener('click', () => {
      levelSelectScreen.classList.add('hidden');
      startScreen.classList.remove('hidden');
      // 選択状態をリセット
      cpuLevel = null;
      selectedCountryGroup = null;
      selectedRoundCount = null;
      levelButtons.forEach(b => {
        b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
        b.classList.add("scale-100");
      });
      countryButtons.forEach(b => {
        b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
        b.classList.add("scale-100");
      });
      if (roundButtons) {
        roundButtons.forEach(b => {
          b.classList.remove("ring-8", "ring-yellow-400", "scale-110", "shadow-2xl");
          b.classList.add("scale-100");
        });
      }
      updateStartButtonState();
    });
  }

  if (window.FlagAkinator) {
    if (!window._akinatorInstance) {
      window._akinatorInstance = new window.FlagAkinator();
    }
    window._akinatorInstance.start();
  }

  // High & Lowボタン
  if (highlowBtn) {
    highlowBtn.addEventListener("click", () => {
      // inDevGamesScreenを非表示、highlowScreenを表示し、ゲーム開始
      const inDevGamesScreen = document.getElementById("inDevGamesScreen");
      if (inDevGamesScreen) {
        inDevGamesScreen.classList.add("hidden");
      }
      if (window.startHighLowGame) {
        window.startHighLowGame();
      }
    });
  }
}

// DOMが完全に読み込まれた後に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupInDevGamesListeners);
} else {
  setupInDevGamesListeners();
}


// 国旗に長押しイベントを追加する関数
function addLongPressToFlags() {
  let pressTimer;
  const longPressDuration = 500; // 500ms
  
  document.querySelectorAll('.country-flag-interactive').forEach(element => {
    const country = element.dataset.country ? JSON.parse(element.dataset.country) : null;
    if (!country) return;
    
    let touchMoved = false;
    
    // タッチデバイス用
    element.addEventListener('touchstart', (e) => {
      touchMoved = false;
      pressTimer = setTimeout(() => {
        if (!touchMoved) {
          showCountryOnMap(country);
        }
      }, longPressDuration);
    }, { passive: true });
    
    element.addEventListener('touchend', (e) => {
      clearTimeout(pressTimer);
    }, { passive: true });
    
    element.addEventListener('touchmove', (e) => {
      touchMoved = true;
      clearTimeout(pressTimer);
    }, { passive: true });
    
    // マウス用
    element.addEventListener('mousedown', () => {
      pressTimer = setTimeout(() => {
        showCountryOnMap(country);
      }, longPressDuration);
    });
    
    element.addEventListener('mouseup', () => {
      clearTimeout(pressTimer);
    });
    
    element.addEventListener('mouseleave', () => {
      clearTimeout(pressTimer);
    });
  });
}
