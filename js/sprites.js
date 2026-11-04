/**
 * 銀樓防衛 — 正式 PNG 精靈載入（有就用、無就幾何 fallback）v1.3.0
 * sheet 96×48：frame0 idle／frame1 attack；亦可 *_attack.png
 */
(function (global) {
  const BASE = 'assets/sprites/';
  const FRAME = 48;
  const KNOWN_IDS = [
    'long_bull',
    'short_blade',
    'leverage_monk',
    'dividend_hermit',
    'market_guard',
    'penny_assassin',
    'ipo_herald',
    'squeeze_blade',
    'arb_walker',
    'night_broker',
    'dip_buyer',
    'retail_tide',
    'chase_zombie',
    'leverage_fiend',
    'black_swan',
    'margin_call',
    'rumor_swarm',
    'panic_board',
    'dark_tape',
    'halt_seal',
  ];

  /** @type {Record<string, {idle: CanvasImageSource|null, attack: CanvasImageSource|null, status: string, tried: boolean}>} */
  const cache = Object.create(null);

  function entry(id) {
    if (!cache[id]) {
      cache[id] = { idle: null, attack: null, status: 'pending', tried: false };
    }
    return cache[id];
  }

  function loadImage(src) {
    return new Promise(function (resolve) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        resolve(img);
      };
      img.onerror = function () {
        resolve(null);
      };
      img.src = src;
    });
  }

  function sliceFrame(sheet, frameIndex) {
    const c = document.createElement('canvas');
    c.width = FRAME;
    c.height = FRAME;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    try {
      g.drawImage(sheet, frameIndex * FRAME, 0, FRAME, FRAME, 0, 0, FRAME, FRAME);
    } catch (_) {
      return null;
    }
    return c;
  }

  function ensure(id) {
    const e = entry(id);
    if (e.tried) return Promise.resolve(e);
    e.tried = true;
    return Promise.all([
      loadImage(BASE + id + '.png'),
      loadImage(BASE + id + '_attack.png'),
      loadImage(BASE + id + '_sheet.png'),
    ]).then(function (pair) {
      const idle = pair[0];
      const attack = pair[1];
      const sheet = pair[2];
      if (idle) e.idle = idle;
      else if (sheet) e.idle = sliceFrame(sheet, 0);
      if (attack) e.attack = attack;
      else if (sheet) e.attack = sliceFrame(sheet, 1);
      if (!e.attack) e.attack = e.idle;
      e.status = e.idle ? 'ready' : 'missing';
      return e;
    });
  }

  function preloadAll(ids) {
    const list = ids && ids.length ? ids : KNOWN_IDS;
    return Promise.all(list.map(ensure));
  }

  function ready(id) {
    const e = cache[id];
    return !!(e && e.status === 'ready' && e.idle);
  }

  function getFrame(id, attacking) {
    const e = cache[id];
    if (!e || e.status !== 'ready' || !e.idle) return null;
    if (attacking && e.attack) return e.attack;
    return e.idle;
  }

  function urlFor(id) {
    return BASE + id + '.png';
  }

  function statusMap() {
    const out = {};
    for (const id of Object.keys(cache)) out[id] = cache[id].status;
    return out;
  }

  // 盡早預載（唔阻塞；缺檔 → missing，繪製走幾何）
  function boot() {
    preloadAll().catch(function () {});
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  global.YDSprites = {
    BASE: BASE,
    FRAME: FRAME,
    KNOWN_IDS: KNOWN_IDS,
    ensure: ensure,
    preloadAll: preloadAll,
    ready: ready,
    getFrame: getFrame,
    urlFor: urlFor,
    statusMap: statusMap,
  };
})(window);
