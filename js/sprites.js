/**
 * 銀樓防衛 — 正式 PNG 精靈載入（有就用、無就幾何 fallback）v3.5.0
 * sheet 96×48：frame0 idle／frame1 attack；亦可 *_attack.png
 * v1.5：場景 mid／props；halt_seal PNG；cache-bust／尺寸校驗／missing 重試／動態 id
 */
(function (global) {
  const BASE = 'assets/sprites/';
  const SCENE_BASE = 'assets/scenes/';
  const FRAME = 48;
  const CACHE_VER = '3.5.0';
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
    'lock_hermit',
    'retail_tide',
    'chase_zombie',
    'leverage_fiend',
    'black_swan',
    'margin_call',
    'rumor_swarm',
    'panic_board',
    'dark_tape',
    'halt_seal',
    'circuit_swan',
    'halt_tide',
    'ink_specter',
    'ledger_mirage',
  ];

  /** @type {Record<string, {idle: CanvasImageSource|null, attack: CanvasImageSource|null, status: string, tried: boolean, promise: Promise|null, retries: number}>} */
  const cache = Object.create(null);
  /** @type {Record<string, {img: CanvasImageSource|null, status: string, promise: Promise|null}>} */
  const scenes = Object.create(null);

  function entry(id) {
    if (!cache[id]) {
      cache[id] = {
        idle: null,
        attack: null,
        status: 'pending',
        tried: false,
        promise: null,
        retries: 0,
      };
    }
    return cache[id];
  }

  function bust(src) {
    const sep = src.indexOf('?') >= 0 ? '&' : '?';
    return src + sep + 'v=' + CACHE_VER;
  }

  function validImage(img) {
    return !!(img && img.naturalWidth > 0 && img.naturalHeight > 0);
  }

  function loadImage(src) {
    return new Promise(function (resolve) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        resolve(validImage(img) ? img : null);
      };
      img.onerror = function () {
        resolve(null);
      };
      try {
        img.src = bust(src);
      } catch (_) {
        resolve(null);
      }
    });
  }

  function sliceFrame(sheet, frameIndex) {
    if (!validImage(sheet) && !(sheet && sheet.width)) return null;
    const sw = sheet.naturalWidth || sheet.width || 0;
    const sh = sheet.naturalHeight || sheet.height || 0;
    if (sw < FRAME || sh < FRAME) return null;
    const maxFrames = Math.max(1, Math.floor(sw / FRAME));
    const idx = Math.min(Math.max(0, frameIndex), maxFrames - 1);
    const c = document.createElement('canvas');
    c.width = FRAME;
    c.height = FRAME;
    const g = c.getContext('2d');
    if (!g) return null;
    g.imageSmoothingEnabled = false;
    try {
      g.drawImage(sheet, idx * FRAME, 0, FRAME, FRAME, 0, 0, FRAME, FRAME);
    } catch (_) {
      return null;
    }
    return c;
  }

  function collectIds(extra) {
    const set = {};
    for (let i = 0; i < KNOWN_IDS.length; i++) set[KNOWN_IDS[i]] = true;
    const YD = global.YD;
    if (YD) {
      if (YD.HEROES) Object.keys(YD.HEROES).forEach(function (id) { set[id] = true; });
      if (YD.ENEMIES) Object.keys(YD.ENEMIES).forEach(function (id) { set[id] = true; });
    }
    if (extra && extra.length) {
      for (let i = 0; i < extra.length; i++) if (extra[i]) set[extra[i]] = true;
    }
    return Object.keys(set);
  }

  function ensure(id, opts) {
    if (!id) return Promise.resolve(null);
    const e = entry(id);
    const force = !!(opts && opts.force);
    if (force) {
      e.tried = false;
      e.promise = null;
      e.status = 'pending';
      e.idle = null;
      e.attack = null;
    }
    if (e.status === 'ready') return Promise.resolve(e);
    if (e.promise) return e.promise;
    // missing 可再試（最多 2 次；force 重置）
    if (e.status === 'missing' && !force && (e.retries || 0) >= 2) return Promise.resolve(e);

    e.status = 'loading';
    e.tried = true;

    e.promise = Promise.all([
      loadImage(BASE + id + '.png'),
      loadImage(BASE + id + '_attack.png'),
      loadImage(BASE + id + '_sheet.png'),
    ])
      .then(function (pair) {
        const idle = pair[0];
        const attack = pair[1];
        const sheet = pair[2];
        e.idle = null;
        e.attack = null;
        if (idle) e.idle = idle;
        else if (sheet) e.idle = sliceFrame(sheet, 0);
        if (attack) e.attack = attack;
        else if (sheet) e.attack = sliceFrame(sheet, 1);
        if (!e.attack) e.attack = e.idle;
        if (e.idle && e.idle.tagName === 'CANVAS' && (!e.idle.width || !e.idle.height)) {
          e.idle = null;
          e.attack = null;
        }
        e.status = e.idle ? 'ready' : 'missing';
        if (e.status === 'missing') e.retries = (e.retries || 0) + 1;
        e.promise = null;
        return e;
      })
      .catch(function () {
        e.status = 'missing';
        e.retries = (e.retries || 0) + 1;
        e.promise = null;
        return e;
      });
    return e.promise;
  }

  function preloadAll(ids) {
    const list = ids && ids.length ? ids : collectIds();
    return Promise.all(list.map(function (id) { return ensure(id); }));
  }

  function ready(id) {
    const e = cache[id];
    return !!(e && e.status === 'ready' && e.idle);
  }

  function getFrame(id, attacking) {
    if (!id) return null;
    let e = cache[id];
    if (!e) {
      ensure(id);
      e = cache[id];
    }
    if (!e) return null;
    if (e.status === 'pending' || e.status === 'loading') {
      ensure(id);
      return null;
    }
    // 正式 PNG 優先（含 halt_tide／circuit_swan／ink_specter／ledger_mirage）；缺檔先借同類幀，再幾何
    if (e.status === 'ready' && e.idle) {
      if (attacking && e.attack) return e.attack;
      return e.idle;
    }
    if (id === 'circuit_swan') {
      const alt = cache['black_swan'];
      if (!alt || alt.status !== 'ready') ensure('black_swan');
      if (alt && alt.status === 'ready' && alt.idle) {
        return attacking && alt.attack ? alt.attack : alt.idle;
      }
    }
    if (id === 'halt_tide') {
      const alt = cache['halt_seal'];
      if (!alt || alt.status !== 'ready') ensure('halt_seal');
      if (alt && alt.status === 'ready' && alt.idle) {
        return attacking && alt.attack ? alt.attack : alt.idle;
      }
    }
    // ledger_mirage：正式 PNG（idle／attack／sheet）已由 ensure() 載入；此處僅缺檔 fallback
    if (id === 'ledger_mirage') {
      let alt = cache['ink_specter'];
      if (!alt || alt.status !== 'ready') ensure('ink_specter');
      if (alt && alt.status === 'ready' && alt.idle) {
        return attacking && alt.attack ? alt.attack : alt.idle;
      }
      alt = cache['dark_tape'];
      if (!alt || alt.status !== 'ready') ensure('dark_tape');
      if (alt && alt.status === 'ready' && alt.idle) {
        return attacking && alt.attack ? alt.attack : alt.idle;
      }
    }
    // ink_specter：正式 PNG（idle／attack／sheet）已由 ensure() 載入；此處僅缺檔 fallback
    if (id === 'ink_specter') {
      const alt = cache['dark_tape'];
      if (!alt || alt.status !== 'ready') ensure('dark_tape');
      if (alt && alt.status === 'ready' && alt.idle) {
        return attacking && alt.attack ? alt.attack : alt.idle;
      }
    }
    return null;
  }

  function urlFor(id) {
    return bust(BASE + id + '.png');
  }

  function statusMap() {
    const out = {};
    for (const id of Object.keys(cache)) out[id] = cache[id].status;
    return out;
  }

  function retryMissing() {
    const ids = Object.keys(cache).filter(function (id) {
      return cache[id].status === 'missing' && cache[id].retries < 3;
    });
    return Promise.all(ids.map(function (id) { return ensure(id, { force: true }); }));
  }

  function ensureScene(name) {
    const key = name || 'battlefield';
    if (!scenes[key]) scenes[key] = { img: null, status: 'pending', promise: null };
    const s = scenes[key];
    if (s.status === 'ready') return Promise.resolve(s);
    if (s.promise) return s.promise;
    s.status = 'loading';
    s.promise = loadImage(SCENE_BASE + key + '.png').then(function (img) {
      s.img = img;
      s.status = img ? 'ready' : 'missing';
      s.promise = null;
      return s;
    });
    return s.promise;
  }

  function getScene(name) {
    const s = scenes[name || 'battlefield'];
    return s && s.status === 'ready' ? s.img : null;
  }

  function boot() {
    preloadAll().then(function () {
      // 缺檔稍後再試一次（CDN／Pages 偶發）
      setTimeout(function () {
        retryMissing().catch(function () {});
      }, 2500);
    }).catch(function () {});
    // 場景分層可選；缺檔唔嘈（ground／mid／wall／props）
    ensureScene('battle_ground').catch(function () {});
    ensureScene('battle_mid').catch(function () {});
    ensureScene('core_wall').catch(function () {});
    ensureScene('battle_props').catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  global.YDSprites = {
    BASE: BASE,
    SCENE_BASE: SCENE_BASE,
    FRAME: FRAME,
    CACHE_VER: CACHE_VER,
    KNOWN_IDS: KNOWN_IDS,
    ensure: ensure,
    preloadAll: preloadAll,
    ready: ready,
    getFrame: getFrame,
    urlFor: urlFor,
    statusMap: statusMap,
    retryMissing: retryMissing,
    collectIds: collectIds,
    ensureScene: ensureScene,
    getScene: getScene,
  };
})(window);
