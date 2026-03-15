(function () {
  const indicatorSelect = document.getElementById('indicatorSelect');
  const countryDetail = document.getElementById('countryDetail');
  const metricStatus = document.getElementById('metricStatus');

  const MISSING_COLOR = '#9ca3af';
  const GRADIENT_STOPS = ['#eff6ff', '#bfdbfe', '#60a5fa', '#2563eb', '#1e3a8a'];

  const INDICATOR_DEFS = [
    { key: 'life_expectancy', label: '平均寿命', unit: '年', headers: ['life_expectancy', '平均寿命'], minValue: 0, maxValue: 130 },
    { key: 'population', label: '人口', unit: '百万人', headers: ['population', '人口'], minValue: 0, maxValue: 2000 },
    { key: 'area', label: '面積', unit: '千km²', headers: ['area', '面積'], minValue: 0, maxValue: 20000 },
    { key: 'gdp', label: 'GDP', unit: '百万US$', headers: ['gdp', 'GDP'], minValue: 0, maxValue: 40000000 },
    { key: 'internet_penetration', label: 'インターネット普及率', unit: '%', headers: ['internet_penetration', 'インターネット普及率'], minValue: 0, maxValue: 100 },
    { key: 'medals', label: 'メダル数', unit: '', headers: ['medals', 'メダル数'], minValue: 0, maxValue: 10000 },
    { key: 'passport', label: 'パスポート指数', unit: '', headers: ['passport', 'パスポート'], minValue: 0, maxValue: 250 },
    { key: 'tourists', label: '観光客数', unit: '千人', headers: ['tourists', '観光客数'], minValue: 0, maxValue: 200000 },
    { key: 'precipitation', label: '降水量', unit: 'mm', headers: ['precipitation', '降水量'], minValue: 0, maxValue: 15000 },
    { key: 'average_elevation', label: '平均標高', unit: 'm', headers: ['average_elevation', '平均標高'], minValue: -500, maxValue: 9000 },
    { key: 'rice_consumption', label: '米の消費量', unit: 't', headers: ['rice_consumption', '米の消費量'], minValue: 0, maxValue: 300000000 },
    { key: 'wheat_consumption', label: '小麦の消費量', unit: 't', headers: ['wheat_consumption', '小麦の消費量'] },
    { key: 'wheat_consumption', label: '小麦の消費量', unit: 't', headers: ['wheat_consumption', '小麦の消費量'], minValue: 0, maxValue: 200000000 },
    { key: 'average_temperature', label: '平均気温', unit: '℃', headers: ['average_temperature', '平均気温'], minValue: -50, maxValue: 60 },
    { key: 'bigmac_index', label: 'ビッグマック指数', unit: 'US$', headers: ['bigmac_index', 'ビッグマック指数'], minValue: 0, maxValue: 20 },
    { key: 'sleep_time', label: '睡眠時間', unit: '分', headers: ['sleep_time', '睡眠時間'], minValue: 0, maxValue: 1440 },
    { key: 'world_heritage', label: '世界遺産数', unit: '', headers: ['world_heritage', '世界遺産数'], minValue: 0, maxValue: 200 },
    { key: 'happiness', label: '幸福度', unit: '', headers: ['happiness', '幸福度'], minValue: 0, maxValue: 10 },
    { key: 'borders', label: '国境数', unit: '', headers: ['borders', '国境数'], minValue: 0, maxValue: 30 },
    { key: 'languages', label: '言語数', unit: '', headers: ['languages', '言語数'], minValue: 0, maxValue: 30 },
    { key: 'timezones', label: 'タイムゾーン数', unit: '', headers: ['timezones', 'タイムゾーン数'], minValue: 0, maxValue: 24 },
    { key: 'fertility_rate', label: '合計特殊出生率', unit: '', headers: ['fertility_rate', '合計特殊出生率', '出生率'], minValue: 0, maxValue: 10 },
    { key: 'median_age', label: '年齢中央値', unit: '歳', headers: ['median_age', '年齢中央値'], minValue: 0, maxValue: 70 },
    { key: 'literacy_rate', label: '識字率', unit: '%', headers: ['literacy_rate', '識字率'], minValue: 0, maxValue: 100 }
  ];

  const coreDetailKeys = ['life_expectancy', 'population', 'area', 'gdp', 'internet_penetration'];

  const state = {
    metricKey: 'life_expectancy',
    indicators: [],
    map: null,
    geoLayer: null,
    legendControl: null,
    legendEl: null,
    domain: { min: null, max: null },
    countryByA2: new Map(),
    countryByA3: new Map(),
    selectedCountry: null
  };

  function getIndicatorDefByKey(key) {
    return INDICATOR_DEFS.find((i) => i.key === key) || null;
  }

  function getActiveIndicatorByKey(key) {
    return state.indicators.find((i) => i.key === key) || getIndicatorDefByKey(key);
  }

  function splitCsvLine(line) {
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

    if (normalized.length < expectedLength) {
      while (normalized.length < expectedLength) {
        normalized.push('');
      }
    }

    return normalized.slice(0, expectedLength);
  }

  function sanitizeMetricValue(indicator, value) {
    if (value === null) return null;
    if (typeof indicator.minValue === 'number' && value < indicator.minValue) return null;
    if (typeof indicator.maxValue === 'number' && value > indicator.maxValue) return null;
    return value;
  }

  function addEquatorLine(map) {
    const equator = [[0, -180], [0, 180]];
    L.polyline(equator, {
      color: '#ef4444',
      weight: 1,
      opacity: 0.22,
      interactive: false
    }).addTo(map);
  }

  function findHeaderIndex(header, candidates) {
    for (const c of candidates) {
      const idx = header.indexOf(c);
      if (idx !== -1) return idx;
    }
    return -1;
  }

  function getFeatureProp(props, keys) {
    if (!props) return '';
    for (const k of keys) {
      const v = props[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
    return '';
  }

  function getCountryForFeature(feature) {
    const props = feature.properties || {};
    const a2 = getFeatureProp(props, ['ISO3166-1-Alpha-2', 'ISO_A2', 'iso_a2', 'iso2', 'ISO2']).toUpperCase();
    const a3 = getFeatureProp(props, ['ISO3166-1-Alpha-3', 'ISO_A3', 'iso_a3', 'iso3', 'ISO3']).toUpperCase();

    if (a2 && state.countryByA2.has(a2)) return state.countryByA2.get(a2);
    if (a3 && state.countryByA3.has(a3)) return state.countryByA3.get(a3);
    return null;
  }

  function colorMix(t) {
    const clamped = Math.max(0, Math.min(1, t));
    const n = GRADIENT_STOPS.length - 1;
    const scaled = clamped * n;
    const leftIdx = Math.floor(scaled);
    const rightIdx = Math.min(n, leftIdx + 1);
    const localT = scaled - leftIdx;

    const left = GRADIENT_STOPS[leftIdx].replace('#', '');
    const right = GRADIENT_STOPS[rightIdx].replace('#', '');

    const lr = parseInt(left.slice(0, 2), 16);
    const lg = parseInt(left.slice(2, 4), 16);
    const lb = parseInt(left.slice(4, 6), 16);
    const rr = parseInt(right.slice(0, 2), 16);
    const rg = parseInt(right.slice(2, 4), 16);
    const rb = parseInt(right.slice(4, 6), 16);

    const r = Math.round(lr + (rr - lr) * localT);
    const g = Math.round(lg + (rg - lg) * localT);
    const b = Math.round(lb + (rb - lb) * localT);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function percentile(sortedValues, p) {
    if (!sortedValues.length) return null;
    if (sortedValues.length === 1) return sortedValues[0];
    const idx = (sortedValues.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return sortedValues[lo];
    const t = idx - lo;
    return sortedValues[lo] * (1 - t) + sortedValues[hi] * t;
  }

  function formatValue(value, indicatorKey) {
    if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';
    const ind = getActiveIndicatorByKey(indicatorKey);
    const unit = ind?.unit || '';
    const formatted = value.toLocaleString('ja-JP', { maximumFractionDigits: 2 });
    return unit ? `${formatted} ${unit}` : formatted;
  }

  function setMetricStatus(text, isWarning) {
    metricStatus.textContent = text;
    metricStatus.className = isWarning
      ? 'text-sm text-amber-700'
      : 'text-sm text-slate-600';
  }

  function computeDomain() {
    const values = [];
    for (const c of state.countryByA2.values()) {
      const v = c.metrics[state.metricKey];
      if (typeof v === 'number' && Number.isFinite(v)) {
        values.push(v);
      }
    }

    if (!values.length) {
      state.domain = { min: null, max: null };
      setMetricStatus('この指標はCSV内に列が見つからないか、値がありません。', true);
      return;
    }

    const sorted = values.slice().sort((a, b) => a - b);
    const rawMin = sorted[0];
    const rawMax = sorted[sorted.length - 1];
    let min = percentile(sorted, 0.05);
    let max = percentile(sorted, 0.95);

    if (min === null || max === null || min === max) {
      min = rawMin;
      max = rawMax;
    }

    state.domain = { min, max, rawMin, rawMax };
    setMetricStatus(`有効データ: ${values.length.toLocaleString('ja-JP')} カ国（色分けは下位5%〜上位95%で調整）`, false);
  }

  function getFillColor(country) {
    if (!country) return MISSING_COLOR;
    const v = country.metrics[state.metricKey];
    if (v === null || v === undefined || Number.isNaN(v)) return MISSING_COLOR;

    const { min, max } = state.domain;
    if (min === null || max === null) return MISSING_COLOR;
    if (max === min) return colorMix(1);

    const tRaw = (v - min) / (max - min);
    const t = Math.pow(Math.max(0, Math.min(1, tRaw)), 0.85);
    return colorMix(t);
  }

  function countryNameFromFeature(feature) {
    const props = feature.properties || {};
    return getFeatureProp(props, ['ADMIN', 'name', 'NAME', 'NAME_LONG']) || '不明な国';
  }

  function buildTooltipHtml(feature, country) {
    const ind = getActiveIndicatorByKey(state.metricKey);
    const countryName = country?.country || countryNameFromFeature(feature);
    const flag = country?.flag || '🏳️';
    const valueText = country ? formatValue(country.metrics[state.metricKey], state.metricKey) : 'N/A';
    return `<div style="font-weight:700;">${flag} ${countryName}</div><div>${ind?.label || state.metricKey}: ${valueText}</div>`;
  }

  function updateDetailPanel(country) {
    if (!country) {
      countryDetail.innerHTML = '地図上の国をホバーまたはクリックしてください。';
      return;
    }

    const ind = getActiveIndicatorByKey(state.metricKey);
    const selectedValue = formatValue(country.metrics[state.metricKey], state.metricKey);

    const rows = coreDetailKeys.map((k) => {
      const m = getActiveIndicatorByKey(k);
      if (!m) return '';
      return `<li class="flex items-center justify-between gap-3 py-1 border-b border-slate-100"><span class="text-slate-500">${m.label}</span><span class="font-semibold text-slate-800">${formatValue(country.metrics[k], k)}</span></li>`;
    }).filter(Boolean).join('');

    countryDetail.innerHTML = `
      <div class="mb-3">
        <div class="text-2xl font-bold">${country.flag || '🏳️'} ${country.country || '不明'}</div>
        <div class="mt-2 text-sm text-slate-500">選択中の指標</div>
        <div class="text-xl font-extrabold text-sky-700">${ind?.label || state.metricKey}: ${selectedValue}</div>
      </div>
      <ul class="text-sm">${rows}</ul>
    `;
  }

  function updateLegend() {
    if (!state.legendEl) return;
    const ind = getActiveIndicatorByKey(state.metricKey);
    const { min, max, rawMin, rawMax } = state.domain;

    state.legendEl.innerHTML = `
      <div><strong>${ind?.label || state.metricKey}</strong></div>
      <div class="legend-gradient"></div>
      <div style="display:flex; justify-content:space-between; gap:8px;">
        <span>低: ${formatValue(min, state.metricKey)}</span>
        <span>高: ${formatValue(max, state.metricKey)}</span>
      </div>
      <div style="margin-top:4px; color:#6b7280;">全体範囲: ${formatValue(rawMin, state.metricKey)} 〜 ${formatValue(rawMax, state.metricKey)}</div>
      <div style="margin-top:6px; color:#6b7280;">欠損値: グレー</div>
    `;
  }

  function styleFeature(feature) {
    const country = getCountryForFeature(feature);
    return {
      color: '#64748b',
      weight: 0.7,
      fillColor: getFillColor(country),
      fillOpacity: 0.9
    };
  }

  function refreshMapStyles() {
    if (!state.geoLayer) return;

    state.geoLayer.eachLayer((layer) => {
      const feature = layer.feature;
      const country = getCountryForFeature(feature);
      layer.setStyle(styleFeature(feature));
      if (layer.getTooltip()) {
        layer.setTooltipContent(buildTooltipHtml(feature, country));
      }
    });

    if (state.selectedCountry) {
      updateDetailPanel(state.selectedCountry);
    }

    updateLegend();
  }

  function initLegend() {
    state.legendControl = L.control({ position: 'bottomleft' });
    state.legendControl.onAdd = function () {
      const div = L.DomUtil.create('div', 'legend-box');
      state.legendEl = div;
      updateLegend();
      return div;
    };
    state.legendControl.addTo(state.map);
  }

  function buildMap(geojson) {
    state.map = L.map('geoStatsMap', {
      worldCopyJump: true,
      minZoom: 1,
      maxZoom: 6,
      zoomSnap: 0.5
    }).setView([20, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(state.map);

    addEquatorLine(state.map);

    state.geoLayer = L.geoJSON(geojson, {
      style: styleFeature,
      onEachFeature: (feature, layer) => {
        const country = getCountryForFeature(feature);
        layer.bindTooltip(buildTooltipHtml(feature, country), { sticky: true, direction: 'auto' });

        layer.on('mouseover', () => {
          layer.setStyle({ weight: 1.6, color: '#0f172a' });
          const hoveredCountry = getCountryForFeature(feature);
          if (hoveredCountry) {
            updateDetailPanel(hoveredCountry);
          }
        });

        layer.on('mouseout', () => {
          layer.setStyle(styleFeature(feature));
          if (state.selectedCountry) {
            updateDetailPanel(state.selectedCountry);
          } else {
            updateDetailPanel(null);
          }
        });

        layer.on('click', () => {
          const clicked = getCountryForFeature(feature);
          state.selectedCountry = clicked;
          updateDetailPanel(clicked);
        });
      }
    }).addTo(state.map);

    state.map.fitBounds(state.geoLayer.getBounds(), { padding: [10, 10] });
    initLegend();
  }

  async function fetchGeoJson() {
    const urls = [
      'https://cdn.jsdelivr.net/gh/datasets/geo-countries@master/data/countries.geojson',
      'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
    ];

    let lastError = null;
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error('GeoJSONの取得に失敗しました。');
  }

  async function parseCountriesFromCsv() {
    const res = await fetch('geodata.csv');
    if (!res.ok) {
      throw new Error('geodata.csv の読み込みに失敗しました。');
    }

    const text = await res.text();
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) return;

    const header = splitCsvLine(lines[0]);
    const expectedLength = header.length;

    const col = {
      country: findHeaderIndex(header, ['country', '国名']),
      flag: findHeaderIndex(header, ['flag', '国旗']),
      iso_a2: findHeaderIndex(header, ['iso_a2', '国コード(CCA2)', '国コード', 'cca2']),
      iso_a3: findHeaderIndex(header, ['iso_a3', '国コード(CCA3)', 'cca3'])
    };

    const indicatorCols = {};
    const valueCountByKey = new Map();
    for (const ind of INDICATOR_DEFS) {
      indicatorCols[ind.key] = findHeaderIndex(header, ind.headers);
      valueCountByKey.set(ind.key, 0);
    }

    for (let i = 1; i < lines.length; i++) {
      const cells = normalizeCsvCells(splitCsvLine(lines[i]), expectedLength);
      const country = col.country >= 0 ? (cells[col.country] || '').trim() : '';
      const flag = col.flag >= 0 ? (cells[col.flag] || '').trim() : '';
      const isoA2 = col.iso_a2 >= 0 ? (cells[col.iso_a2] || '').trim().toUpperCase() : '';
      const isoA3 = col.iso_a3 >= 0 ? (cells[col.iso_a3] || '').trim().toUpperCase() : '';

      if (!country || !isoA2) continue;

      const metrics = {};
      for (const ind of INDICATOR_DEFS) {
        const idx = indicatorCols[ind.key];
        const rawValue = idx >= 0 ? toNumber(cells[idx]) : null;
        const v = sanitizeMetricValue(ind, rawValue);
        metrics[ind.key] = v;
        if (v !== null) {
          valueCountByKey.set(ind.key, (valueCountByKey.get(ind.key) || 0) + 1);
        }
      }

      const record = {
        country,
        flag,
        iso_a2: isoA2,
        iso_a3: isoA3,
        metrics
      };

      state.countryByA2.set(isoA2, record);
      if (isoA3) state.countryByA3.set(isoA3, record);
    }

    state.indicators = INDICATOR_DEFS.filter((ind) => {
      const hasColumn = indicatorCols[ind.key] >= 0;
      const hasValue = (valueCountByKey.get(ind.key) || 0) > 0;
      return hasColumn && hasValue;
    });

    if (!state.indicators.length) {
      throw new Error('geodata.csv から利用可能な統計指標を検出できませんでした。');
    }

    if (!state.indicators.some((ind) => ind.key === state.metricKey)) {
      state.metricKey = state.indicators[0].key;
    }
  }

  function setupIndicatorSelect() {
    indicatorSelect.innerHTML = state.indicators.map((ind) => {
      const selected = ind.key === state.metricKey ? 'selected' : '';
      return `<option value="${ind.key}" ${selected}>${ind.label} (${ind.key})</option>`;
    }).join('');

    indicatorSelect.addEventListener('change', (e) => {
      state.metricKey = e.target.value;
      computeDomain();
      refreshMapStyles();
    });
  }

  async function init() {
    try {
      await parseCountriesFromCsv();
      setupIndicatorSelect();
      computeDomain();
      const geojson = await fetchGeoJson();
      buildMap(geojson);
    } catch (err) {
      console.error(err);
      setMetricStatus('読み込み中にエラーが発生しました。ページを再読み込みしてください。', true);
      countryDetail.innerHTML = '<span class="text-rose-700">データの読み込みに失敗しました。</span>';
    }
  }

  init();
})();
