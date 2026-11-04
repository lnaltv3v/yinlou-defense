/**
 * 銀樓防衛 — 靜態資料 v0.2.0
 * 角色為原創綽號，影射金融江湖氣氛；唔用真人真名／金庸名／Fortias IP。
 */
(function (global) {
  const COLORS = {
    ink: '#1A1510',
    paper: '#E8DCC8',
    cinnabar: '#C45C4A',
    teal: '#3A7A6A',
    robe: '#2A6A6A',
    medic: '#A04040',
    violet: '#5A4060',
    gold: '#C9A227',
    silver: '#D4AF37',
    ui: '#2A241C',
    wood: '#5A4030',
    grass: '#3A5A40',
    stone: '#6A6055',
  };

  /** @type {Record<string, object>} */
  const HEROES = {
    long_bull: {
      id: 'long_bull',
      name: '多頭刀客',
      blurb: '近戰高傷 · 牛市衝鋒',
      role: 'melee',
      cost: 25,
      color: '#C45C4A',
      atk: 14,
      hp: 90,
      range: 78,
      cooldown: 0.55,
      speed: 0,
    },
    short_blade: {
      id: 'short_blade',
      name: '空頭劍客',
      blurb: '遠程點殺 · 看淡減速',
      role: 'ranged',
      cost: 30,
      color: '#2A6A6A',
      atk: 11,
      hp: 55,
      range: 210,
      cooldown: 0.7,
      speed: 0,
      slow: 0.35,
      slowDur: 1.2,
    },
    leverage_monk: {
      id: 'leverage_monk',
      name: '槓桿狂僧',
      blurb: '範圍爆炸 · 冷卻長',
      role: 'aoe',
      cost: 40,
      color: '#5A4060',
      atk: 22,
      hp: 70,
      range: 120,
      cooldown: 1.45,
      splash: 55,
      selfRisk: 0.08,
    },
    dividend_hermit: {
      id: 'dividend_hermit',
      name: '股息隱士',
      blurb: '治療／回銀光環',
      role: 'support',
      cost: 35,
      color: '#3A7A6A',
      atk: 4,
      hp: 60,
      range: 100,
      cooldown: 0.9,
      auraHeal: 6,
      auraSilver: 0.35,
    },
    market_guard: {
      id: 'market_guard',
      name: '莊家鐵衛',
      blurb: '坦克擋路 · 高血',
      role: 'tank',
      cost: 28,
      color: '#6A6055',
      atk: 7,
      hp: 160,
      range: 70,
      cooldown: 0.8,
    },
    penny_assassin: {
      id: 'penny_assassin',
      name: '細價股刺客',
      blurb: '高速低血 · 打後排',
      role: 'assassin',
      cost: 32,
      color: '#A04040',
      atk: 16,
      hp: 40,
      range: 160,
      cooldown: 0.4,
      preferBack: true,
    },
  };

  const ENEMIES = {
    retail_tide: {
      id: 'retail_tide',
      name: '散戶潮',
      hp: 32,
      atk: 5,
      speed: 40,
      reward: 5,
      color: '#8A7E6E',
      radius: 10,
      attackRange: 42,
      attackCd: 0.9,
      preferHero: 0.55,
    },
    chase_zombie: {
      id: 'chase_zombie',
      name: '追高殭屍',
      hp: 70,
      atk: 10,
      speed: 28,
      reward: 8,
      color: '#A04040',
      radius: 12,
      attackRange: 48,
      attackCd: 1.05,
      preferHero: 0.7,
    },
    leverage_fiend: {
      id: 'leverage_fiend',
      name: '槓桿妖',
      hp: 100,
      atk: 14,
      speed: 34,
      reward: 18,
      color: '#5A4060',
      radius: 14,
      attackRange: 55,
      attackCd: 1.2,
      preferHero: 0.45,
    },
    black_swan: {
      id: 'black_swan',
      name: '黑天鵝',
      hp: 360,
      atk: 22,
      speed: 20,
      reward: 70,
      color: '#1A1510',
      radius: 20,
      boss: true,
      attackRange: 70,
      attackCd: 1.4,
      preferHero: 0.35,
    },
    margin_call: {
      id: 'margin_call',
      name: '追保令',
      hp: 55,
      atk: 8,
      speed: 48,
      reward: 10,
      color: '#C45C4A',
      radius: 11,
      attackRange: 40,
      attackCd: 0.75,
      preferHero: 0.8,
    },
  };

  function wavePack(list) {
    return { spawns: list };
  }

  /** 關卡 1–3 + 無盡模式入口用 meta */
  const STAGES = [
    {
      id: 1,
      name: '錢莊初夜',
      startSilver: 120,
      coreHp: 150,
      unlockHeroes: Object.keys(HEROES),
      waves: [
        wavePack([{ enemy: 'retail_tide', count: 6, lane: 'cycle', interval: 0.85 }]),
        wavePack([
          { enemy: 'retail_tide', count: 8, lane: 'cycle', interval: 0.7 },
          { enemy: 'chase_zombie', count: 2, lane: 'random', interval: 1.4, delay: 2 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 6, lane: 'cycle', interval: 0.65 },
          { enemy: 'chase_zombie', count: 3, lane: 'cycle', interval: 1.1, delay: 1 },
          { enemy: 'leverage_fiend', count: 1, lane: 1, interval: 0, delay: 4 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 10, lane: 'cycle', interval: 0.55 },
          { enemy: 'chase_zombie', count: 4, lane: 'random', interval: 0.9, delay: 1.5 },
          { enemy: 'leverage_fiend', count: 2, lane: 'cycle', interval: 2.2, delay: 3 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 6, lane: 'cycle', interval: 0.55 },
          { enemy: 'chase_zombie', count: 3, lane: 'random', interval: 0.95, delay: 1 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 4 },
        ]),
      ],
    },
    {
      id: 2,
      name: '午市殺跌',
      startSilver: 140,
      coreHp: 170,
      unlockHeroes: Object.keys(HEROES),
      waves: [
        wavePack([
          { enemy: 'retail_tide', count: 8, lane: 'cycle', interval: 0.65 },
          { enemy: 'margin_call', count: 2, lane: 'random', interval: 1.2, delay: 1.5 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 8, lane: 'cycle', interval: 0.55 },
          { enemy: 'chase_zombie', count: 4, lane: 'cycle', interval: 1.0, delay: 0.8 },
          { enemy: 'margin_call', count: 3, lane: 'random', interval: 1.1, delay: 2 },
        ]),
        wavePack([
          { enemy: 'chase_zombie', count: 5, lane: 'cycle', interval: 0.85 },
          { enemy: 'leverage_fiend', count: 2, lane: 'random', interval: 1.8, delay: 2 },
          { enemy: 'margin_call', count: 4, lane: 'cycle', interval: 0.9, delay: 1 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 12, lane: 'cycle', interval: 0.45 },
          { enemy: 'chase_zombie', count: 5, lane: 'random', interval: 0.8, delay: 1 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 1.6, delay: 2.5 },
        ]),
        wavePack([
          { enemy: 'margin_call', count: 6, lane: 'cycle', interval: 0.7 },
          { enemy: 'leverage_fiend', count: 2, lane: 'random', interval: 1.5, delay: 1 },
          { enemy: 'black_swan', count: 1, lane: 1, interval: 0, delay: 5 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 10, lane: 'cycle', interval: 0.4 },
          { enemy: 'chase_zombie', count: 4, lane: 'cycle', interval: 0.75, delay: 0.5 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 3 },
          { enemy: 'margin_call', count: 4, lane: 'random', interval: 0.85, delay: 4 },
        ]),
      ],
    },
    {
      id: 3,
      name: '夜盤黑潮',
      startSilver: 160,
      coreHp: 200,
      unlockHeroes: Object.keys(HEROES),
      waves: [
        wavePack([
          { enemy: 'retail_tide', count: 10, lane: 'cycle', interval: 0.5 },
          { enemy: 'margin_call', count: 4, lane: 'random', interval: 0.9, delay: 1 },
        ]),
        wavePack([
          { enemy: 'chase_zombie', count: 6, lane: 'cycle', interval: 0.75 },
          { enemy: 'leverage_fiend', count: 3, lane: 'random', interval: 1.4, delay: 1.5 },
          { enemy: 'margin_call', count: 4, lane: 'cycle', interval: 0.85, delay: 0.5 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 14, lane: 'cycle', interval: 0.4 },
          { enemy: 'chase_zombie', count: 6, lane: 'random', interval: 0.7, delay: 1 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 1.3, delay: 2 },
        ]),
        wavePack([
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.55 },
          { enemy: 'leverage_fiend', count: 4, lane: 'random', interval: 1.2, delay: 1 },
          { enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 4 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 12, lane: 'cycle', interval: 0.35 },
          { enemy: 'chase_zombie', count: 6, lane: 'cycle', interval: 0.65, delay: 0.5 },
          { enemy: 'margin_call', count: 6, lane: 'random', interval: 0.7, delay: 1 },
          { enemy: 'black_swan', count: 1, lane: 3, interval: 0, delay: 5 },
        ]),
        wavePack([
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 1.0 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.6, delay: 0.5 },
          { enemy: 'black_swan', count: 2, lane: 'cycle', interval: 3.5, delay: 2 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 16, lane: 'cycle', interval: 0.32 },
          { enemy: 'chase_zombie', count: 8, lane: 'random', interval: 0.55, delay: 0.4 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 1.1, delay: 1 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 6 },
          { enemy: 'margin_call', count: 6, lane: 'random', interval: 0.65, delay: 3 },
        ]),
      ],
    },
  ];

  /** 無盡模式：動態生成波次 */
  const ENDLESS = {
    id: 'endless',
    name: '無盡殺跌',
    startSilver: 150,
    coreHp: 180,
    unlockHeroes: Object.keys(HEROES),
  };

  function buildEndlessWave(n) {
    const mul = 1 + (n - 1) * 0.12;
    const count = (base) => Math.max(1, Math.round(base * (1 + (n - 1) * 0.08)));
    const spawns = [
      { enemy: 'retail_tide', count: count(6 + n), lane: 'cycle', interval: Math.max(0.28, 0.7 - n * 0.02) },
    ];
    if (n >= 2) {
      spawns.push({
        enemy: 'chase_zombie',
        count: count(2 + Math.floor(n / 2)),
        lane: 'random',
        interval: Math.max(0.5, 1.1 - n * 0.03),
        delay: 1,
      });
    }
    if (n >= 3) {
      spawns.push({
        enemy: 'margin_call',
        count: count(2 + Math.floor(n / 3)),
        lane: 'cycle',
        interval: Math.max(0.45, 0.95 - n * 0.025),
        delay: 1.5,
      });
    }
    if (n >= 4) {
      spawns.push({
        enemy: 'leverage_fiend',
        count: count(1 + Math.floor(n / 4)),
        lane: 'random',
        interval: 1.5,
        delay: 2.5,
        hpMul: mul,
      });
    }
    if (n % 5 === 0) {
      spawns.push({
        enemy: 'black_swan',
        count: Math.max(1, Math.floor(n / 10)),
        lane: n % 4,
        interval: 2,
        delay: 4,
        hpMul: mul,
      });
    }
    return { spawns, hpMul: mul };
  }

  const GRID = {
    lanes: 4,
    slots: 5,
    originX: 150,
    originY: 70,
    cellW: 92,
    cellH: 88,
    gapX: 8,
    gapY: 10,
  };

  const CORE = { x: 70, y: 270, r: 36 };

  const SPEED_OPTIONS = [1, 1.5, 2];

  const SAVE_KEY = 'yinlou-defense-save-v1';

  function starMul(star) {
    return 1 + 0.55 * (star - 1);
  }

  function heroStats(def, star) {
    const m = starMul(star);
    return {
      atk: Math.round(def.atk * m),
      hp: Math.round(def.hp * (1 + 0.4 * (star - 1))),
      maxHp: Math.round(def.hp * (1 + 0.4 * (star - 1))),
      range: def.range + (star - 1) * 12,
      cooldown: Math.max(0.28, def.cooldown * (1 - 0.06 * (star - 1))),
    };
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultSave();
      return { ...defaultSave(), ...JSON.parse(raw) };
    } catch (_) {
      return defaultSave();
    }
  }

  function defaultSave() {
    return {
      version: 2,
      totalSilver: 0,
      maxStageCleared: 0,
      bestEndlessWave: 0,
      unlocked: Object.keys(HEROES),
      lastSpeed: 1,
    };
  }

  function writeSave(data) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }

  global.YD = {
    COLORS,
    HEROES,
    ENEMIES,
    STAGES,
    ENDLESS,
    buildEndlessWave,
    GRID,
    CORE,
    SPEED_OPTIONS,
    SAVE_KEY,
    starMul,
    heroStats,
    loadSave,
    writeSave,
    defaultSave,
  };
})(window);
