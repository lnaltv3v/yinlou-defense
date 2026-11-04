/**
 * 銀樓防衛 — 靜態資料 v0.7.0
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
      cost: 22,
      color: '#C45C4A',
      silhouette: 'blade',
      atk: 14,
      hp: 90,
      range: 78,
      cooldown: 0.55,
      speed: 0,
      skill: {
        id: 'bull_charge',
        name: '牛市衝鋒',
        type: 'active',
        blurb: '每第 4 刀爆發 1.85× 傷',
        every: 4,
        dmgMul: 1.85,
      },
    },
    short_blade: {
      id: 'short_blade',
      name: '空頭劍客',
      blurb: '遠程點殺 · 看淡減速',
      role: 'ranged',
      cost: 28,
      color: '#2A6A6A',
      silhouette: 'sword',
      atk: 11,
      hp: 55,
      range: 210,
      cooldown: 0.7,
      speed: 0,
      slow: 0.4,
      slowDur: 1.35,
      skill: {
        id: 'bear_mark',
        name: '看淡印',
        type: 'active',
        blurb: '每第 5 劍加深減速至 60%',
        every: 5,
        deepSlow: 0.6,
        deepSlowDur: 2.0,
      },
    },
    leverage_monk: {
      id: 'leverage_monk',
      name: '槓桿狂僧',
      blurb: '範圍爆炸 · 冷卻長',
      role: 'aoe',
      cost: 38,
      color: '#5A4060',
      silhouette: 'staff',
      atk: 22,
      hp: 70,
      range: 120,
      cooldown: 1.45,
      splash: 55,
      selfRisk: 0.07,
      skill: {
        id: 'margin_blast',
        name: '爆倉',
        type: 'active',
        blurb: '每第 3 擊濺射 ×1.55、傷 ×1.3',
        every: 3,
        splashMul: 1.55,
        dmgMul: 1.3,
      },
    },
    dividend_hermit: {
      id: 'dividend_hermit',
      name: '股息隱士',
      blurb: '治療／回銀光環',
      role: 'support',
      cost: 32,
      color: '#3A7A6A',
      silhouette: 'hat',
      atk: 4,
      hp: 60,
      range: 100,
      cooldown: 0.9,
      auraHeal: 7,
      auraSilver: 0.45,
      skill: {
        id: 'div_payout',
        name: '分紅日',
        type: 'passive',
        blurb: '光環每 4 跳額外 +3 兩並強化治療',
        every: 4,
        silverBurst: 3,
        healMul: 1.35,
      },
    },
    market_guard: {
      id: 'market_guard',
      name: '莊家鐵衛',
      blurb: '坦克擋路 · 高血',
      role: 'tank',
      cost: 26,
      color: '#6A6055',
      silhouette: 'shield',
      atk: 7,
      hp: 165,
      range: 70,
      cooldown: 0.8,
      skill: {
        id: 'guard_wall',
        name: '護盤',
        type: 'passive',
        blurb: '受擊 18% 觸發護盤，該下減傷 55%',
        proc: 0.18,
        dmgMul: 0.45,
      },
    },
    penny_assassin: {
      id: 'penny_assassin',
      name: '細價股刺客',
      blurb: '高速低血 · 打後排',
      role: 'assassin',
      cost: 30,
      color: '#A04040',
      silhouette: 'dagger',
      atk: 16,
      hp: 42,
      range: 160,
      cooldown: 0.4,
      preferBack: true,
      skill: {
        id: 'penny_strike',
        name: '偷襲',
        type: 'active',
        blurb: '每第 5 刀後排額外 1.7×',
        every: 5,
        dmgMul: 1.7,
      },
    },
    ipo_herald: {
      id: 'ipo_herald',
      name: '招股鼓手',
      blurb: '鄰格加攻 · 開市喊單',
      role: 'buffer',
      cost: 34,
      color: '#C9A227',
      silhouette: 'drum',
      atk: 5,
      hp: 65,
      range: 90,
      cooldown: 1.1,
      buffAtk: 0.2,
      buffDur: 2.4,
      skill: {
        id: 'ipo_call',
        name: '開市鑼',
        type: 'active',
        blurb: '每第 3 次喊單，同 lane 全員短暫 +12% 攻',
        every: 3,
        laneBuff: 0.12,
        laneBuffDur: 1.8,
      },
    },
    squeeze_blade: {
      id: 'squeeze_blade',
      name: '逼空客',
      blurb: '打高血加成 · 軋空',
      role: 'hunter',
      cost: 36,
      color: '#8A5040',
      silhouette: 'hook',
      atk: 13,
      hp: 75,
      range: 100,
      cooldown: 0.65,
      highHpBonus: 0.45,
      skill: {
        id: 'short_squeeze',
        name: '軋空',
        type: 'active',
        blurb: '打 Boss／血量>70% 時每第 4 擊 2.1×',
        every: 4,
        dmgMul: 2.1,
        hpGate: 0.7,
      },
    },
    arb_walker: {
      id: 'arb_walker',
      name: '套利行者',
      blurb: '跨 lane 點殺 · 價差收割',
      role: 'arb',
      cost: 35,
      color: '#4A7080',
      silhouette: 'coin',
      atk: 12,
      hp: 68,
      range: 145,
      cooldown: 0.72,
      crossLane: 1,
      skill: {
        id: 'arb_spread',
        name: '價差',
        type: 'active',
        blurb: '每第 4 擊跨 lane 額外 1.6×，並短暫減速',
        every: 4,
        dmgMul: 1.6,
        slow: 0.35,
        slowDur: 1.1,
      },
    },
  };

  /** 場上羈絆：同時存在列出嘅 id → 被動 */
  const BONDS = [
    {
      id: 'bull_bear',
      name: '多空對決',
      need: ['long_bull', 'short_blade'],
      blurb: '雙方攻擊 +12%',
      atkMul: 1.12,
      applyTo: ['long_bull', 'short_blade'],
    },
    {
      id: 'leverage_pair',
      name: '槓桿雙煞',
      need: ['leverage_monk', 'penny_assassin'],
      blurb: '雙方冷卻 −10%',
      cdMul: 0.9,
      applyTo: ['leverage_monk', 'penny_assassin'],
    },
    {
      id: 'vault_wall',
      name: '銀樓鐵壁',
      need: ['market_guard', 'dividend_hermit'],
      blurb: '鐵衛減傷／隱士光環加強',
      tankDmgMul: 0.82,
      auraMul: 1.25,
      applyTo: ['market_guard', 'dividend_hermit'],
    },
    {
      id: 'ipo_squeeze',
      name: '招股軋空',
      need: ['ipo_herald', 'squeeze_blade'],
      blurb: '鼓手加攻更強、逼空加成提升',
      buffBonus: 0.08,
      highHpExtra: 0.15,
      applyTo: ['ipo_herald', 'squeeze_blade'],
    },
    {
      id: 'spread_pair',
      name: '套利對沖',
      need: ['arb_walker', 'short_blade'],
      blurb: '雙方射程 +18、冷卻 −6%',
      rangeBonus: 18,
      cdMul: 0.94,
      applyTo: ['arb_walker', 'short_blade'],
    },
  ];

  const ENEMIES = {
    retail_tide: {
      id: 'retail_tide',
      name: '散戶潮',
      hp: 30,
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
      hp: 68,
      atk: 10,
      speed: 28,
      reward: 8,
      color: '#A04040',
      radius: 12,
      attackRange: 48,
      attackCd: 1.05,
      preferHero: 0.7,
      skill: {
        id: 'fomo_bite',
        name: 'FOMO 撕咬',
        every: 4,
        blurb: '精英技：吸血回血',
        type: 'lifesteal',
        healRatio: 0.45,
      },
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
      skill: {
        id: 'margin_shout',
        name: '槓上加槓',
        every: 5,
        blurb: '精英／Boss 技：附近敵人短暫加速＋加攻',
        type: 'rally',
        radius: 90,
        speedMul: 1.35,
        atkMul: 1.25,
        dur: 2.5,
      },
    },
    black_swan: {
      id: 'black_swan',
      name: '黑天鵝',
      hp: 340,
      atk: 22,
      speed: 20,
      reward: 70,
      color: '#1A1510',
      radius: 20,
      boss: true,
      attackRange: 70,
      attackCd: 1.4,
      preferHero: 0.35,
      skill: {
        id: 'swan_scream',
        name: '黑羽驚惶',
        every: 4,
        blurb: '每第 4 擊：全體短暫減速＋核心震盪',
        type: 'scream',
        slow: 0.4,
        slowDur: 2.2,
        coreDmg: 10,
      },
    },
    margin_call: {
      id: 'margin_call',
      name: '追保令',
      hp: 52,
      atk: 8,
      speed: 48,
      reward: 10,
      color: '#C45C4A',
      radius: 11,
      attackRange: 40,
      attackCd: 0.75,
      preferHero: 0.8,
      skill: {
        id: 'call_mark',
        name: '限期追保',
        every: 3,
        blurb: '精英技：標記目標，該下額外受傷',
        type: 'mark',
        dmgMul: 1.75,
      },
    },
    rumor_swarm: {
      id: 'rumor_swarm',
      name: '傳聞蚊',
      hp: 22,
      atk: 4,
      speed: 58,
      reward: 4,
      color: '#7A6A50',
      radius: 8,
      attackRange: 36,
      attackCd: 0.7,
      preferHero: 0.4,
    },
    panic_board: {
      id: 'panic_board',
      name: '恐慌盤',
      hp: 78,
      atk: 12,
      speed: 36,
      reward: 16,
      color: '#B05040',
      radius: 13,
      attackRange: 50,
      attackCd: 0.95,
      preferHero: 0.65,
      skill: {
        id: 'panic_rush',
        name: '踏空急殺',
        every: 4,
        blurb: '精英技：自身加速衝鋒並下一下傷害提高',
        type: 'rush',
        speedMul: 1.55,
        dmgMul: 1.6,
        dur: 1.8,
      },
    },
  };

  function wavePack(list) {
    return { spawns: list };
  }

  const STAGES = [
    {
      id: 1,
      name: '錢莊初夜',
      story: '夜雨初歇，錢莊門楣掛起「銀樓」燈籠。散戶潮聞風而至——你要喺開市前擺好第一盤棋。',
      startSilver: 165,
      coreHp: 185,
      unlockHeroes: Object.keys(HEROES),
      waves: [
        wavePack([{ enemy: 'retail_tide', count: 3, lane: 'cycle', interval: 1.2 }]),
        wavePack([
          { enemy: 'retail_tide', count: 5, lane: 'cycle', interval: 0.95 },
          { enemy: 'chase_zombie', count: 1, lane: 'random', interval: 1.8, delay: 3.0 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 5, lane: 'cycle', interval: 0.8 },
          { enemy: 'chase_zombie', count: 2, lane: 'cycle', interval: 1.25, delay: 1.2 },
          { enemy: 'leverage_fiend', count: 1, lane: 1, interval: 0, delay: 5.0, elite: true },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 9, lane: 'cycle', interval: 0.58 },
          { enemy: 'chase_zombie', count: 4, lane: 'random', interval: 0.95, delay: 1.5 },
          { enemy: 'leverage_fiend', count: 2, lane: 'cycle', interval: 2.3, delay: 3 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 6, lane: 'cycle', interval: 0.58 },
          { enemy: 'chase_zombie', count: 3, lane: 'random', interval: 1.0, delay: 1 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 4.5 },
        ]),
      ],
    },
    {
      id: 2,
      name: '午市殺跌',
      story: '午市鐘響，追保令滿天飛。多空對決開倉，誰守得住盤口，誰就係今日莊家。',
      startSilver: 155,
      coreHp: 180,
      unlockHeroes: Object.keys(HEROES),
      waves: [
        wavePack([
          { enemy: 'retail_tide', count: 7, lane: 'cycle', interval: 0.7 },
          { enemy: 'margin_call', count: 2, lane: 'random', interval: 1.25, delay: 1.5 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 8, lane: 'cycle', interval: 0.58 },
          { enemy: 'chase_zombie', count: 3, lane: 'cycle', interval: 1.05, delay: 0.8 },
          { enemy: 'margin_call', count: 3, lane: 'random', interval: 1.15, delay: 2 },
        ]),
        wavePack([
          { enemy: 'chase_zombie', count: 5, lane: 'cycle', interval: 0.9 },
          { enemy: 'leverage_fiend', count: 2, lane: 'random', interval: 1.85, delay: 2 },
          { enemy: 'margin_call', count: 3, lane: 'cycle', interval: 0.95, delay: 1 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 11, lane: 'cycle', interval: 0.48 },
          { enemy: 'chase_zombie', count: 5, lane: 'random', interval: 0.85, delay: 1 },
          { enemy: 'leverage_fiend', count: 2, lane: 'cycle', interval: 1.7, delay: 2.5 },
        ]),
        wavePack([
          { enemy: 'margin_call', count: 5, lane: 'cycle', interval: 0.75 },
          { enemy: 'leverage_fiend', count: 2, lane: 'random', interval: 1.55, delay: 1 },
          { enemy: 'black_swan', count: 1, lane: 1, interval: 0, delay: 5 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 10, lane: 'cycle', interval: 0.42 },
          { enemy: 'chase_zombie', count: 4, lane: 'cycle', interval: 0.8, delay: 0.5 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 3.2 },
          { enemy: 'margin_call', count: 4, lane: 'random', interval: 0.9, delay: 4 },
        ]),
      ],
    },
    {
      id: 3,
      name: '夜盤黑潮',
      story: '夜盤無聲，傳聞蚊起舞。黑羽掠過屋脊——黑天鵝唔敲門，只破門。',
      startSilver: 175,
      coreHp: 205,
      unlockHeroes: Object.keys(HEROES),
      waves: [
        wavePack([
          { enemy: 'retail_tide', count: 9, lane: 'cycle', interval: 0.52 },
          { enemy: 'margin_call', count: 3, lane: 'random', interval: 0.95, delay: 1 },
          { enemy: 'rumor_swarm', count: 4, lane: 'cycle', interval: 0.55, delay: 0.5 },
        ]),
        wavePack([
          { enemy: 'chase_zombie', count: 6, lane: 'cycle', interval: 0.78 },
          { enemy: 'leverage_fiend', count: 2, lane: 'random', interval: 1.45, delay: 1.5 },
          { enemy: 'margin_call', count: 4, lane: 'cycle', interval: 0.88, delay: 0.5 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 12, lane: 'cycle', interval: 0.42 },
          { enemy: 'rumor_swarm', count: 8, lane: 'random', interval: 0.4, delay: 0.6 },
          { enemy: 'chase_zombie', count: 5, lane: 'random', interval: 0.75, delay: 1 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 1.35, delay: 2 },
        ]),
        wavePack([
          { enemy: 'margin_call', count: 7, lane: 'cycle', interval: 0.58 },
          { enemy: 'leverage_fiend', count: 3, lane: 'random', interval: 1.25, delay: 1 },
          { enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 4 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 12, lane: 'cycle', interval: 0.38 },
          { enemy: 'chase_zombie', count: 5, lane: 'cycle', interval: 0.7, delay: 0.5 },
          { enemy: 'margin_call', count: 5, lane: 'random', interval: 0.75, delay: 1 },
          { enemy: 'black_swan', count: 1, lane: 3, interval: 0, delay: 5 },
        ]),
        wavePack([
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 1.05 },
          { enemy: 'margin_call', count: 7, lane: 'random', interval: 0.65, delay: 0.5 },
          { enemy: 'black_swan', count: 2, lane: 'cycle', interval: 3.8, delay: 2 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 14, lane: 'cycle', interval: 0.34 },
          { enemy: 'rumor_swarm', count: 10, lane: 'random', interval: 0.35, delay: 0.3 },
          { enemy: 'chase_zombie', count: 7, lane: 'random', interval: 0.58, delay: 0.4 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 1.15, delay: 1 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 6 },
          { enemy: 'margin_call', count: 5, lane: 'random', interval: 0.7, delay: 3 },
        ]),
      ],
    },
    {
      id: 4,
      name: '清算之夜',
      story: '清算之夜，槓桿反噬。銀樓鐵壁若齊人，尚有一息；否則只剩空倉同空城。',
      startSilver: 200,
      coreHp: 235,
      unlockHeroes: Object.keys(HEROES),
      waves: [
        wavePack([
          { enemy: 'rumor_swarm', count: 10, lane: 'cycle', interval: 0.4 },
          { enemy: 'margin_call', count: 4, lane: 'random', interval: 0.85, delay: 1 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 12, lane: 'cycle', interval: 0.4 },
          { enemy: 'chase_zombie', count: 5, lane: 'cycle', interval: 0.75, delay: 0.8 },
          { enemy: 'leverage_fiend', count: 2, lane: 'random', interval: 1.4, delay: 2 },
        ]),
        wavePack([
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.55 },
          { enemy: 'rumor_swarm', count: 12, lane: 'random', interval: 0.32, delay: 0.4 },
          { enemy: 'chase_zombie', count: 6, lane: 'cycle', interval: 0.7, delay: 1 },
        ]),
        wavePack([
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 1.1 },
          { enemy: 'margin_call', count: 6, lane: 'random', interval: 0.7, delay: 0.8 },
          { enemy: 'black_swan', count: 1, lane: 1, interval: 0, delay: 3.5 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 14, lane: 'cycle', interval: 0.32 },
          { enemy: 'chase_zombie', count: 6, lane: 'random', interval: 0.65, delay: 0.5 },
          { enemy: 'rumor_swarm', count: 10, lane: 'cycle', interval: 0.3, delay: 0.2 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 4 },
        ]),
        wavePack([
          { enemy: 'leverage_fiend', count: 5, lane: 'cycle', interval: 0.95 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.55, delay: 0.5 },
          { enemy: 'black_swan', count: 2, lane: 'cycle', interval: 3.2, delay: 2 },
        ]),
        wavePack([
          { enemy: 'rumor_swarm', count: 14, lane: 'random', interval: 0.28 },
          { enemy: 'chase_zombie', count: 8, lane: 'cycle', interval: 0.55, delay: 0.4 },
          { enemy: 'leverage_fiend', count: 4, lane: 'random', interval: 1.0, delay: 1 },
          { enemy: 'margin_call', count: 6, lane: 'cycle', interval: 0.6, delay: 1.5 },
          { enemy: 'black_swan', count: 2, lane: 'cycle', interval: 4, delay: 3 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 16, lane: 'cycle', interval: 0.28 },
          { enemy: 'rumor_swarm', count: 12, lane: 'random', interval: 0.26, delay: 0.2 },
          { enemy: 'chase_zombie', count: 8, lane: 'cycle', interval: 0.5, delay: 0.5 },
          { enemy: 'leverage_fiend', count: 5, lane: 'random', interval: 0.9, delay: 1 },
          { enemy: 'black_swan', count: 2, lane: 0, interval: 2.5, delay: 2 },
          { enemy: 'black_swan', count: 1, lane: 3, interval: 0, delay: 7 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.55, delay: 3 },
        ]),
      ],
    },

    {
      id: 5,
      name: '熔斷黎明',
      story: '熔斷黎明前最後一炷香。恐慌盤如潮，套利行者跨 lane 收割——撐過呢一浪，江湖記得你名。',
      startSilver: 210,
      coreHp: 250,
      unlockHeroes: Object.keys(HEROES),
      waves: [
        wavePack([
          { enemy: 'retail_tide', count: 10, lane: 'cycle', interval: 0.42 },
          { enemy: 'panic_board', count: 2, lane: 'random', interval: 1.4, delay: 1.2 },
          { enemy: 'rumor_swarm', count: 6, lane: 'cycle', interval: 0.4, delay: 0.5 },
        ]),
        wavePack([
          { enemy: 'chase_zombie', count: 6, lane: 'cycle', interval: 0.72 },
          { enemy: 'margin_call', count: 5, lane: 'random', interval: 0.8, delay: 0.8 },
          { enemy: 'panic_board', count: 3, lane: 'cycle', interval: 1.2, delay: 1.5 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 12, lane: 'cycle', interval: 0.36 },
          { enemy: 'rumor_swarm', count: 10, lane: 'random', interval: 0.3, delay: 0.4 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 1.15, delay: 1.5, elite: true },
          { enemy: 'panic_board', count: 2, lane: 'random', interval: 1.3, delay: 2 },
        ]),
        wavePack([
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.55 },
          { enemy: 'chase_zombie', count: 7, lane: 'random', interval: 0.65, delay: 0.6 },
          { enemy: 'panic_board', count: 4, lane: 'cycle', interval: 1.0, delay: 1 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 4 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 14, lane: 'cycle', interval: 0.3 },
          { enemy: 'panic_board', count: 4, lane: 'random', interval: 0.95, delay: 0.5 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 1.0, delay: 1 },
          { enemy: 'rumor_swarm', count: 12, lane: 'random', interval: 0.28, delay: 0.3 },
        ]),
        wavePack([
          { enemy: 'margin_call', count: 9, lane: 'cycle', interval: 0.5 },
          { enemy: 'panic_board', count: 5, lane: 'random', interval: 0.85, delay: 0.6 },
          { enemy: 'black_swan', count: 1, lane: 1, interval: 0, delay: 3 },
          { enemy: 'black_swan', count: 1, lane: 3, interval: 0, delay: 5.5 },
        ]),
        wavePack([
          { enemy: 'chase_zombie', count: 8, lane: 'cycle', interval: 0.55 },
          { enemy: 'leverage_fiend', count: 5, lane: 'random', interval: 0.95, delay: 0.8 },
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.9, delay: 1 },
          { enemy: 'rumor_swarm', count: 14, lane: 'random', interval: 0.26, delay: 0.2 },
          { enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 4 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 16, lane: 'cycle', interval: 0.26 },
          { enemy: 'panic_board', count: 6, lane: 'random', interval: 0.75, delay: 0.4 },
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.5, delay: 0.5 },
          { enemy: 'leverage_fiend', count: 5, lane: 'random', interval: 0.9, delay: 1 },
          { enemy: 'black_swan', count: 2, lane: 'cycle', interval: 3.5, delay: 2.5 },
          { enemy: 'rumor_swarm', count: 12, lane: 'random', interval: 0.24, delay: 0.3 },
        ]),
      ],
    },
  ];

  const ENDLESS = {
    id: 'endless',
    name: '無盡殺跌',
    story: '殺跌無盡，浪高過浪。里程碑銀兩係你唯一嘅喘息——守得愈久，江湖傳聞愈響。',
    startSilver: 170,
    coreHp: 190,
    unlockHeroes: Object.keys(HEROES),
  };

  /** 波次結束補銀（關卡／無盡分開） */
  function waveClearBonus(waveIndex, endless) {
    if (endless) {
      // 無盡：前期略甜、後期仍升但唔失控
      return Math.round(18 + waveIndex * 6.5 + Math.min(40, waveIndex * 1.2));
    }
    return 22 + waveIndex * 8;
  }

  /** 無盡里程碑獎勵（銀兩）；同一局只領一次 */
  const ENDLESS_MILESTONES = [
    { wave: 5, silver: 40, label: '五浪過關' },
    { wave: 10, silver: 80, label: '十浪長牛' },
    { wave: 15, silver: 120, label: '十五浪硬頂' },
    { wave: 20, silver: 180, label: '廿浪封神' },
    { wave: 30, silver: 260, label: '三十浪傳說' },
  ];

  function endlessMilestone(waveIndex) {
    return ENDLESS_MILESTONES.find((m) => m.wave === waveIndex) || null;
  }

  /** 香港日曆日字串 YYYY-MM-DD */
  function hkDateString(d) {
    const dt = d || new Date();
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Hong_Kong',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(dt);
    const get = (t) => parts.find((p) => p.type === t).value;
    return get('year') + '-' + get('month') + '-' + get('day');
  }

  /** 每日關：用日期 seed 選挑戰組合（輕量） */
  function dailyStageMeta(dateStr) {
    const s = dateStr || hkDateString();
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const themes = [
      { name: '早市抽水', focus: 'margin_call', blurb: '追保令偏多' },
      { name: '午后軋空', focus: 'leverage_fiend', blurb: '槓桿妖偏多' },
      { name: '夜傳風聲', focus: 'rumor_swarm', blurb: '傳聞蚊偏多' },
      { name: '黑羽預警', focus: 'black_swan', blurb: '黑天鵝更早' },
    ];
    const theme = themes[h % themes.length];
    const base = STAGES[1 + (h % 3)]; // 2–4 關難度帶
    return {
      id: 'daily',
      date: s,
      name: '每日·' + theme.name,
      blurb: theme.blurb,
      story: '今日盤口：' + theme.blurb + '。江湖唔等人——佈陣、合併、強化，守住銀樓。',
      focus: theme.focus,
      startSilver: 160 + (h % 5) * 8,
      coreHp: 185 + (h % 4) * 10,
      seed: h,
      unlockHeroes: Object.keys(HEROES),
      waveCount: 5 + (h % 3),
      baseStageId: base.id,
    };
  }

  function buildDailyWaves(meta) {
    const n = meta.waveCount;
    const focus = meta.focus;
    const waves = [];
    for (let i = 1; i <= n; i++) {
      const spawns = [
        { enemy: 'retail_tide', count: 6 + i, lane: 'cycle', interval: Math.max(0.32, 0.7 - i * 0.04) },
      ];
      if (i >= 2) {
        spawns.push({
          enemy: focus === 'rumor_swarm' ? 'rumor_swarm' : 'chase_zombie',
          count: 3 + Math.floor(i / 2),
          lane: 'random',
          interval: 0.75,
          delay: 0.8,
        });
      }
      if (i >= 2) {
        spawns.push({
          enemy: focus,
          count: focus === 'black_swan' ? (i >= n - 1 ? 1 : 0) : 2 + Math.floor(i / 2),
          lane: focus === 'black_swan' ? (i % 4) : 'cycle',
          interval: focus === 'black_swan' ? 0 : 1.0,
          delay: focus === 'black_swan' ? 3.5 : 1.2,
        });
      }
      if (i === n || (focus === 'black_swan' && i >= n - 1)) {
        spawns.push({
          enemy: 'black_swan',
          count: 1,
          lane: 2,
          interval: 0,
          delay: 4,
          hpMul: 1 + i * 0.04,
        });
      }
      // filter zero counts
      waves.push({ spawns: spawns.filter((s) => s.count > 0) });
    }
    return waves;
  }


  /** 推薦陣容芯片（上手／羈絆導向） */
  const LINEUPS = [
    {
      id: 'iron_wall',
      name: '新手鐵壁',
      heroes: ['market_guard', 'dividend_hermit', 'long_bull'],
      blurb: '坦＋奶＋刀｜優先觸發銀樓鐵壁',
      tip: '鐵衛前排、隱士中、刀客輸出',
    },
    {
      id: 'bull_bear',
      name: '多空開倉',
      heroes: ['long_bull', 'short_blade', 'ipo_herald'],
      blurb: '近遠＋鼓手｜觸發多空對決',
      tip: '刀劍同場再加鼓手加攻',
    },
    {
      id: 'leverage',
      name: '槓桿雙煞',
      heroes: ['leverage_monk', 'penny_assassin', 'market_guard'],
      blurb: '範圍＋刺客＋坦',
      tip: '狂僧清潮、刺客打後、鐵衛頂',
    },
    {
      id: 'squeeze',
      name: '招股軋空',
      heroes: ['ipo_herald', 'squeeze_blade', 'short_blade'],
      blurb: '鼓手＋逼空＋劍',
      tip: '對 Boss／高血怪特別強',
    },
    {
      id: 'arb_hedge',
      name: '套利對沖',
      heroes: ['arb_walker', 'short_blade', 'market_guard'],
      blurb: '行者＋劍＋坦｜觸發套利對沖',
      tip: '跨 lane 點殺＋遠程減速',
    },
  ];

  /** 失敗後隨機提示 */
  const FAIL_TIPS = [
    '前排放莊家鐵衛擋路，後排放空頭劍客／細價股刺客。',
    '同種合併升星通常比亂召一堆 1 星更強；最高可合到 4 星，合併有銀兩回報。',
    '股息隱士＋莊家鐵衛 → 羈絆「銀樓鐵壁」（減傷＋光環）。',
    '多頭刀客＋空頭劍客 →「多空對決」雙方攻擊 +12%。',
    '波次間用補銀繼續合併；唔好銀兩放住唔用。',
    '精英波／Boss 前先合成到 2 星以上再硬頂。',
    '拖放可調位：坦克靠左、輸出靠右（敵人由右入）。',
    '開波前睇羈絆列：齊人先開波，收益更大。',
    '點場上俠客可強化：刀利／甲厚／內息（花銀兩，合併會保留較高強化）。',
  ];

  const ACHIEVEMENTS = [
    { id: 'first_clear', name: '開張大吉', blurb: '通關第 1 關', check: (s) => (s.maxStageCleared || 0) >= 1 },
    { id: 'stage4', name: '清算達人', blurb: '通關第 4 關', check: (s) => (s.maxStageCleared || 0) >= 4 },
    { id: 'maxstar', name: '滿星開盤', blurb: '首次合成 4 星', check: (s) => !!s.ach && s.ach.maxstar },
    { id: 'star3', name: '三星掛牌', blurb: '首次合成 3 星', check: (s) => !!s.ach && s.ach.star3 },
    { id: 'stage5', name: '熔斷倖存', blurb: '通關第 5 關', check: (s) => (s.maxStageCleared || 0) >= 5 },
    { id: 'endless20', name: '廿浪長牛', blurb: '無盡最佳 ≥ 20 波', check: (s) => (s.bestEndlessWave || 0) >= 20 },
    { id: 'bond', name: '齊人有行情', blurb: '首次觸發羈絆', check: (s) => !!s.ach && s.ach.bond },
    { id: 'kills100', name: '百人斬', blurb: '累計擊殺 100', check: (s) => (s.totalKills || 0) >= 100 },
    { id: 'kills500', name: '殺跌機器', blurb: '累計擊殺 500', check: (s) => (s.totalKills || 0) >= 500 },
    { id: 'endless10', name: '撐過十浪', blurb: '無盡最佳 ≥ 10 波', check: (s) => (s.bestEndlessWave || 0) >= 10 },
    { id: 'codex_heroes', name: '門派圖齊', blurb: '圖鑑見齊全部俠客', check: (s) => Object.keys(HEROES).every((id) => (s.seenHeroes || {})[id]) },
    { id: 'codex_enemies', name: '敵情盡知', blurb: '圖鑑見齊全部敵人', check: (s) => Object.keys(ENEMIES).every((id) => (s.seenEnemies || {})[id]) },
    { id: 'daily', name: '日日開盤', blurb: '完成一次每日關', check: (s) => !!s.ach && s.ach.daily },
    { id: 'elite', name: '精英過招', blurb: '擊敗一次精英敵', check: (s) => !!s.ach && s.ach.elite },
    { id: 'lineup', name: '跟單上陣', blurb: '使用一次推薦陣容芯片', check: (s) => !!s.ach && s.ach.lineup },
    { id: 'upgrade', name: '鍛打開倉', blurb: '首次強化場上俠客', check: (s) => !!s.ach && s.ach.upgrade },
  ];

  function buildEndlessWave(n) {
    const mul = 1 + (n - 1) * 0.11;
    const count = (base) => Math.max(1, Math.round(base * (1 + (n - 1) * 0.075)));
    const spawns = [
      { enemy: 'retail_tide', count: count(6 + n), lane: 'cycle', interval: Math.max(0.26, 0.68 - n * 0.018) },
    ];
    if (n >= 2) {
      spawns.push({
        enemy: 'chase_zombie',
        count: count(2 + Math.floor(n / 2)),
        lane: 'random',
        interval: Math.max(0.48, 1.05 - n * 0.028),
        delay: 1,
      });
    }
    if (n >= 2) {
      spawns.push({
        enemy: 'rumor_swarm',
        count: count(3 + Math.floor(n / 2)),
        lane: 'cycle',
        interval: Math.max(0.28, 0.55 - n * 0.015),
        delay: 0.4,
      });
    }
    if (n >= 3) {
      spawns.push({
        enemy: 'margin_call',
        count: count(2 + Math.floor(n / 3)),
        lane: 'cycle',
        interval: Math.max(0.42, 0.92 - n * 0.022),
        delay: 1.5,
      });
    }
    if (n >= 4) {
      spawns.push({
        enemy: 'leverage_fiend',
        count: count(1 + Math.floor(n / 4)),
        lane: 'random',
        interval: 1.45,
        delay: 2.5,
        hpMul: mul,
      });
    }
    if (n >= 5) {
      spawns.push({
        enemy: 'panic_board',
        count: count(1 + Math.floor(n / 5)),
        lane: 'cycle',
        interval: Math.max(0.7, 1.2 - n * 0.02),
        delay: 1.8,
        hpMul: mul * 0.95,
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


  /** v0.7 場上強化（銀兩升級，擇攻／防／技能加速） */
  const UPGRADE_PATHS = {
    atk: {
      id: 'atk',
      name: '刀利',
      blurb: '攻擊 +12%／級',
      maxLv: 3,
      costBase: 18,
      costPerLv: 12,
      atkMulPer: 0.12,
    },
    def: {
      id: 'def',
      name: '甲厚',
      blurb: '最大血 +15%／級',
      maxLv: 3,
      costBase: 16,
      costPerLv: 10,
      hpMulPer: 0.15,
    },
    haste: {
      id: 'haste',
      name: '內息',
      blurb: '冷卻 −8%／級（技能更快）',
      maxLv: 3,
      costBase: 20,
      costPerLv: 14,
      cdMulPer: 0.08,
    },
  };

  function upgradeCost(pathId, currentLv) {
    const p = UPGRADE_PATHS[pathId];
    if (!p) return 999;
    const lv = currentLv || 0;
    if (lv >= p.maxLv) return 0;
    return p.costBase + lv * p.costPerLv;
  }

  function upgradeLabel(hero) {
    if (!hero) return '';
    const a = hero.upAtk || 0;
    const d = hero.upDef || 0;
    const h = hero.upHaste || 0;
    if (!a && !d && !h) return '';
    const parts = [];
    if (a) parts.push('刀' + a);
    if (d) parts.push('甲' + d);
    if (h) parts.push('息' + h);
    return parts.join('·');
  }

  const SAVE_KEY = 'yinlou-defense-save-v1';

  /** 最高星級（v0.6：可合成至 4 星） */
  const MAX_STAR = 4;

  /** 合併星級傷害倍率：升星有價值，4 星明顯但唔破關 */
  function starMul(star) {
    // 1→1, 2→1.62, 3→2.24, 4→2.95
    if (star <= 3) return 1 + 0.62 * (star - 1);
    return 1 + 0.62 * 2 + 0.71; // 4 星額外一檔
  }

  function heroStats(def, star) {
    const m = starMul(star);
    const hpScale = star <= 3 ? 0.42 * (star - 1) : 0.42 * 2 + 0.38;
    return {
      atk: Math.round(def.atk * m),
      hp: Math.round(def.hp * (1 + hpScale)),
      maxHp: Math.round(def.hp * (1 + hpScale)),
      range: def.range + (star - 1) * 14 + (star >= 4 ? 8 : 0),
      cooldown: Math.max(0.22, def.cooldown * (1 - 0.07 * (star - 1) - (star >= 4 ? 0.04 : 0))),
    };
  }

  /** 召喚費曲線：同種每多召一次 +8（封頂 +48） */
  function summonCost(heroId, summonCounts) {
    const def = HEROES[heroId];
    if (!def) return 999;
    const n = (summonCounts && summonCounts[heroId]) || 0;
    return def.cost + Math.min(48, n * 8);
  }

  /** 合併回報銀兩（按目標新星級） */
  function mergeRebate(heroId, newStar) {
    const def = HEROES[heroId];
    if (!def) return 0;
    return Math.round(def.cost * 0.12 * newStar);
  }

  function activeBonds(heroes) {
    const ids = new Set(heroes.filter((h) => h.hp > 0).map((h) => h.id));
    return BONDS.filter((b) => b.need.every((id) => ids.has(id)));
  }

  function bondModsFor(heroId, bonds) {
    const mods = { atkMul: 1, cdMul: 1, tankDmgMul: 1, auraMul: 1, buffBonus: 0, highHpExtra: 0, rangeBonus: 0 };
    for (const b of bonds) {
      if (!b.applyTo.includes(heroId)) continue;
      if (b.atkMul) mods.atkMul *= b.atkMul;
      if (b.cdMul) mods.cdMul *= b.cdMul;
      if (b.tankDmgMul) mods.tankDmgMul *= b.tankDmgMul;
      if (b.auraMul) mods.auraMul *= b.auraMul;
      if (b.buffBonus) mods.buffBonus += b.buffBonus;
      if (b.highHpExtra) mods.highHpExtra += b.highHpExtra;
      if (b.rangeBonus) mods.rangeBonus += b.rangeBonus;
    }
    return mods;
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
      version: 7,
      totalSilver: 0,
      totalKills: 0,
      maxStageCleared: 0,
      bestEndlessWave: 0,
      unlocked: Object.keys(HEROES),
      lastSpeed: 1,
      skipTutorial: false,
      showCellHints: true,
      showSkillCd: true,
      reduceShake: false,
      sfxEnabled: true,
      autoPauseOnBond: false,
      seenHeroes: {},
      seenEnemies: {},
      ach: {},
      unlockedAch: {},
      dailyDate: '',
      dailyCleared: false,
      firstBootDone: false,
    };
  }

  function exportSaveJson(save) {
    const payload = {
      meta: { game: 'yinlou-defense', exportedAt: new Date().toISOString(), version: save.version || 7 },
      save: { ...defaultSave(), ...save },
    };
    return JSON.stringify(payload, null, 2);
  }

  function importSaveJson(raw) {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const body = data && data.save ? data.save : data;
    if (!body || typeof body !== 'object') throw new Error('無效存檔');
    const merged = { ...defaultSave(), ...body };
    merged.version = Math.max(7, merged.version || 7);
    if (!merged.seenHeroes) merged.seenHeroes = {};
    if (!merged.seenEnemies) merged.seenEnemies = {};
    if (!merged.ach) merged.ach = {};
    if (!merged.unlockedAch) merged.unlockedAch = {};
    return merged;
  }

  function pickFailTip(seed) {
    const i = Math.abs((seed || Date.now()) | 0) % FAIL_TIPS.length;
    return FAIL_TIPS[i];
  }

  function firstRunBonus(save) {
    if ((save.maxStageCleared || 0) > 0) return 0;
    return 25;
  }


  function markSeenHero(save, id) {
    if (!save.seenHeroes) save.seenHeroes = {};
    save.seenHeroes[id] = true;
  }

  function markSeenEnemy(save, id) {
    if (!save.seenEnemies) save.seenEnemies = {};
    save.seenEnemies[id] = true;
  }

  function refreshAchievements(save) {
    if (!save.ach) save.ach = {};
    if (!save.unlockedAch) save.unlockedAch = {};
    const newly = [];
    for (const a of ACHIEVEMENTS) {
      if (save.unlockedAch[a.id]) continue;
      try {
        if (a.check(save)) {
          save.unlockedAch[a.id] = true;
          newly.push(a);
        }
      } catch (_) {}
    }
    return newly;
  }

  function writeSave(data) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }

  global.YD = {
    COLORS,
    HEROES,
    BONDS,
    ENEMIES,
    STAGES,
    ENDLESS,
    ACHIEVEMENTS,
    LINEUPS,
    FAIL_TIPS,
    MAX_STAR,
    UPGRADE_PATHS,
    upgradeCost,
    upgradeLabel,
    ENDLESS_MILESTONES,
    buildEndlessWave,
    buildDailyWaves,
    dailyStageMeta,
    hkDateString,
    waveClearBonus,
    endlessMilestone,
    GRID,
    CORE,
    SPEED_OPTIONS,
    SAVE_KEY,
    starMul,
    heroStats,
    summonCost,
    mergeRebate,
    activeBonds,
    bondModsFor,
    loadSave,
    writeSave,
    defaultSave,
    exportSaveJson,
    importSaveJson,
    pickFailTip,
    firstRunBonus,
    markSeenHero,
    markSeenEnemy,
    refreshAchievements,
  };
})(window);
