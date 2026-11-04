/**
 * 銀樓防衛 — 靜態資料 v1.2.0
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
      lore: '江湖傳佢刀下只認升市，唔認人情；銀樓夜戰，總係第一個上前。櫃檯算盤未響，刀已出鞘——多頭唔等人情。',
      role: 'melee',
      cost: 22,
      color: '#C45C4A',
      silhouette: 'blade',
      atk: 14,
      hp: 90,
      range: 78,
      cooldown: 0.52,
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
      lore: '看淡唔等於認輸——劍尖專挑過熱嘅浪頭，一刺即退。茶館裡頭人人喊買，佢只喝一口涼茶再出劍。',
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
      lore: '狂僧借十倍力一掌拍落，勝則爆倉敵陣，敗則自身亦損。',
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
      lore: '隱士唔追熱市，只守細水長流；光環所及，銀兩同氣血齊生。有人笑佢慢，佢笑人忙——分紅日一到，誰慢誰知。',
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
      lore: '鐵衛守門如護盤，寧損己身，唔讓核心裂一寸。',
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
      lore: '細價股裡藏刀——專殺後排，得手即隱入人潮。',
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
      lore: '鑼響開市，鄰格士氣齊升；鼓手唔出手，亦能改寫盤口。',
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
      lore: '逼空客專剋高血巨獸，血愈厚，軋空愈狠。',
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
      lore: '跨巷收割價差，左右開弓，專打唔對稱嘅浪。',
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
    night_broker: {
      id: 'night_broker',
      name: '夜盤掮客',
      blurb: '暗盤標記 · 隊友收割',
      lore: '暗盤未歇，掮客提燈標記——標記所在，隊友跟進收割。燈火唔亮全街，只照你要殺嗰一格。',
      role: 'marker',
      cost: 33,
      color: '#3A4060',
      silhouette: 'scroll',
      atk: 10,
      hp: 62,
      range: 175,
      cooldown: 0.68,
      slow: 0.25,
      slowDur: 1.0,
      skill: {
        id: 'dark_mark',
        name: '暗盤標記',
        type: 'active',
        blurb: '每第 4 擊標記目標 4 秒，隊友打標記 +35% 傷',
        every: 4,
        markDur: 4.0,
        markAllyBonus: 0.35,
      },
    },
    dip_buyer: {
      id: 'dip_buyer',
      name: '抄底居士',
      blurb: '殘血急救 · 越殘越補',
      lore: '市崩人走，居士反而蹲低撿刀——專補殘血同門。人笑佢抄底抄到斷手，佢只問：斷手之前，銀樓仲在唔在？',
      role: 'medic',
      cost: 31,
      color: '#508070',
      silhouette: 'gourd',
      atk: 5,
      hp: 72,
      range: 105,
      cooldown: 0.95,
      auraHeal: 6,
      auraSilver: 0.2,
      lowHpHealMul: 1.75,
      skill: {
        id: 'dip_reload',
        name: '抄底補倉',
        type: 'active',
        blurb: '每第 5 跳對最低血友軍爆發治療',
        every: 5,
        healMul: 1.25,
        lowestBurst: 28,
        silverBurst: 1,
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
    {
      id: 'dark_session',
      name: '暗盤通宵',
      need: ['night_broker', 'short_blade'],
      blurb: '雙方冷卻 −8%；標記加傷再 +10%',
      cdMul: 0.92,
      markBonus: 0.10,
      applyTo: ['night_broker', 'short_blade'],
    },
    {
      id: 'night_arb',
      name: '夜盤套利',
      need: ['night_broker', 'arb_walker'],
      blurb: '雙方射程 +12；標記持續 +1 秒',
      rangeBonus: 12,
      markDurBonus: 1,
      applyTo: ['night_broker', 'arb_walker'],
    },
    {
      id: 'dip_div',
      name: '細水抄底',
      need: ['dip_buyer', 'dividend_hermit'],
      blurb: '雙方光環／急救加強；殘血加成再 +20%',
      auraMul: 1.18,
      healLowBonus: 0.2,
      applyTo: ['dip_buyer', 'dividend_hermit'],
    },
  ];

  const ENEMIES = {
    retail_tide: {
      id: 'retail_tide',
      name: '散戶潮',
      lore: '聞風而至嘅散戶潮，人多勢眾，但挨打唔耐。巷口一聲「有得升」，人牆就湧到銀樓門前。',
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
      lore: 'FOMO 驅使，追高唔知停；精英時會撕咬回血。',
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
      lore: '槓桿化形，傷高速快；一喊「加槓」周圍亦狂。',
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
      lore: '黑羽掠過街燈——Boss 級災變，專震核心同陣腳。帳本寫得再靚，羽一落，盤口照樣裂。',
      hp: 325,
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
      lore: '限期追保，專咬前排；標記之後下一刀更狠。',
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
      lore: '巷口風聲成群，細而快，專拖慢你節奏。',
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
      lore: '熔斷前嘅恐慌盤，急殺加速，一陣即散。',
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
    dark_tape: {
      id: 'dark_tape',
      name: '暗盤影',
      lore: '盤後暗影，半透明高速；影遁時更難捉。',
      hp: 38,
      atk: 9,
      speed: 52,
      reward: 9,
      color: '#2A2840',
      radius: 10,
      attackRange: 40,
      attackCd: 0.7,
      preferHero: 0.75,
      stealth: true,
      skill: {
        id: 'shadow_slip',
        name: '影遁',
        every: 3,
        blurb: '精英技：短暫加速並隱身感',
        type: 'rush',
        speedMul: 1.7,
        dmgMul: 1.35,
        dur: 1.6,
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
      story: '夜雨初歇，錢莊門楣掛起「銀樓」燈籠。櫃檯後頭算盤未停，門外已有腳步聲——散戶潮聞風而至。掌櫃話：開市前唔擺好第一盤棋，天亮只剩空倉同空城。',
      startSilver: 190,
      coreHp: 200,
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
      story: '午市鐘響，追保令滿天飛，茶館裡頭嘈到拆天。多頭刀客同空頭劍客隔檯對望——多空對決開倉。掌櫃拍門：誰守得住盤口，誰就係今日莊家；守唔住，銀樓燈籠今晚熄。',
      startSilver: 175,
      coreHp: 195,
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
      story: '夜盤無聲，只聽見傳聞蚊喺巷口起舞。瓦簷上一道黑羽掠過，街燈抖了一下——黑天鵝唔敲門，只破門。你要喺謠言同槓桿之間，留一盞銀樓燈。',
      startSilver: 210,
      coreHp: 240,
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
      story: '清算之夜，帳本翻紅。槓桿反噬如刀，追保令連環砸落。銀樓鐵壁若齊人，尚有一息可守；否則只剩空倉、空城，同天亮後無人認領嘅門牌。',
      startSilver: 240,
      coreHp: 265,
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
          { enemy: 'retail_tide', count: 14, lane: 'cycle', interval: 0.3 },
          { enemy: 'rumor_swarm', count: 10, lane: 'random', interval: 0.28, delay: 0.2 },
          { enemy: 'chase_zombie', count: 7, lane: 'cycle', interval: 0.55, delay: 0.5 },
          { enemy: 'leverage_fiend', count: 4, lane: 'random', interval: 0.95, delay: 1 },
          { enemy: 'black_swan', count: 2, lane: 0, interval: 2.8, delay: 2.2 },
          { enemy: 'black_swan', count: 1, lane: 3, interval: 0, delay: 7.5 },
          { enemy: 'margin_call', count: 6, lane: 'random', interval: 0.6, delay: 3 },
        ]),
      ],
    },

    {
      id: 5,
      name: '熔斷黎明',
      story: '熔斷黎明前最後一炷香。恐慌盤如潮湧向櫃檯，門環震得作響。套利行者已跨巷收割，鼓聲遠近——撐過呢一浪，江湖記得你名；撐唔過，只剩熔斷後嘅沉寂。',
      startSilver: 255,
      coreHp: 280,
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

    {
      id: 6,
      name: '盤後暗盤',
      story: '收市鐘已響，暗盤卻未歇。夜盤掮客提燈入巷，影在磚縫遊走，像未簽完嘅契。呢一晚唔係開市，係清算未完嘅債——標記、收割、護盤，一氣呵成，否則債入骨髓。',
      challenge: true,
      startSilver: 265,
      coreHp: 295,
      unlockHeroes: Object.keys(HEROES),
      firstClearBonus: 150,
      waves: [
        wavePack([
          { enemy: 'dark_tape', count: 6, lane: 'cycle', interval: 0.55 },
          { enemy: 'retail_tide', count: 8, lane: 'random', interval: 0.45, delay: 0.8 },
          { enemy: 'rumor_swarm', count: 6, lane: 'cycle', interval: 0.4, delay: 0.5 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 8, lane: 'cycle', interval: 0.48 },
          { enemy: 'margin_call', count: 5, lane: 'random', interval: 0.75, delay: 0.8 },
          { enemy: 'chase_zombie', count: 4, lane: 'cycle', interval: 0.85, delay: 1.2 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 12, lane: 'cycle', interval: 0.34 },
          { enemy: 'dark_tape', count: 8, lane: 'random', interval: 0.42, delay: 0.4 },
          { enemy: 'panic_board', count: 3, lane: 'cycle', interval: 1.1, delay: 1.5, elite: true },
          { enemy: 'leverage_fiend', count: 2, lane: 'random', interval: 1.3, delay: 2 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 10, lane: 'cycle', interval: 0.4 },
          { enemy: 'rumor_swarm', count: 12, lane: 'random', interval: 0.28, delay: 0.3 },
          { enemy: 'margin_call', count: 6, lane: 'cycle', interval: 0.6, delay: 0.8 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 4.2 },
        ]),
        wavePack([
          { enemy: 'chase_zombie', count: 7, lane: 'cycle', interval: 0.6 },
          { enemy: 'dark_tape', count: 10, lane: 'random', interval: 0.38, delay: 0.4 },
          { enemy: 'panic_board', count: 4, lane: 'cycle', interval: 0.95, delay: 1 },
          { enemy: 'leverage_fiend', count: 3, lane: 'random', interval: 1.05, delay: 1.5 },
        ]),
        wavePack([
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.5 },
          { enemy: 'dark_tape', count: 12, lane: 'random', interval: 0.35, delay: 0.3 },
          { enemy: 'black_swan', count: 1, lane: 1, interval: 0, delay: 3 },
          { enemy: 'black_swan', count: 1, lane: 3, interval: 0, delay: 5.5 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 14, lane: 'cycle', interval: 0.28 },
          { enemy: 'dark_tape', count: 12, lane: 'random', interval: 0.32, delay: 0.25 },
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.85, delay: 0.8 },
          { enemy: 'leverage_fiend', count: 4, lane: 'random', interval: 0.95, delay: 1 },
          { enemy: 'rumor_swarm', count: 14, lane: 'cycle', interval: 0.24, delay: 0.2 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 14, lane: 'cycle', interval: 0.3 },
          { enemy: 'panic_board', count: 6, lane: 'random', interval: 0.75, delay: 0.4 },
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.48, delay: 0.5 },
          { enemy: 'leverage_fiend', count: 5, lane: 'random', interval: 0.9, delay: 1 },
          { enemy: 'black_swan', count: 2, lane: 'cycle', interval: 3.2, delay: 2.2 },
          { enemy: 'chase_zombie', count: 6, lane: 'random', interval: 0.55, delay: 0.6 },
        ]),
      ],
    },
  ];

  const ENDLESS = {
    id: 'endless',
    name: '無盡殺跌',
    story: '殺跌無盡，浪高過浪。里程碑銀兩係你唯一嘅喘息；修飾詞會改寫盤口——守得愈久，江湖傳聞愈響，亦愈難轉身離場。',
    startSilver: 200,
    coreHp: 220,
    unlockHeroes: Object.keys(HEROES),
  };

  /** 波次結束補銀（關卡／無盡分開） */
  function waveClearBonus(waveIndex, endless) {
    if (endless) {
      // 無盡：前期略甜、後期仍升但唔失控
      return Math.round(18 + waveIndex * 6.5 + Math.min(40, waveIndex * 1.2));
    }
    return 24 + waveIndex * 8;
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

  /** 每日／無盡修飾詞（v0.9） */
  const RUN_MODIFIERS = [
    {
      id: 'cheap_ink',
      name: '墨價從廉',
      blurb: '召喚費 −12%',
      apply: (ctx) => {
        ctx.summonCostMul = (ctx.summonCostMul || 1) * 0.88;
      },
    },
    {
      id: 'fat_wallet',
      name: '銀袋豐盈',
      blurb: '開局銀兩 +18%',
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.18;
      },
    },
    {
      id: 'thick_walls',
      name: '鐵門加厚',
      blurb: '核心 HP +14%',
      apply: (ctx) => {
        ctx.coreMul = (ctx.coreMul || 1) * 1.14;
      },
    },
    {
      id: 'swift_tide',
      name: '殺跌加速',
      blurb: '敵人移速 +10%、賞金 +8%',
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 1.1;
        ctx.rewardMul = (ctx.rewardMul || 1) * 1.08;
      },
    },
    {
      id: 'merge_rebate',
      name: '合併分紅',
      blurb: '合併回報 ×1.35',
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.35;
      },
    },
    {
      id: 'lean_market',
      name: '淡市惜銀',
      blurb: '開局 −10% 銀；波次補銀 +20%',
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 0.9;
        ctx.waveBonusMul = (ctx.waveBonusMul || 1) * 1.2;
      },
    },
    {
      id: 'iron_aura',
      name: '護盤加持',
      blurb: '核心 HP +8%；敵人移速 −6%',
      apply: (ctx) => {
        ctx.coreMul = (ctx.coreMul || 1) * 1.08;
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.94;
      },
    },
    {
      id: 'bull_run',
      name: '多頭狂歡',
      blurb: '合併回報 ×1.2；召喚費 −6%',
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.2;
        ctx.summonCostMul = (ctx.summonCostMul || 1) * 0.94;
      },
    },
    {
      id: 'bear_trap',
      name: '空頭陷阱',
      blurb: '敵賞金 +15%；敵速 +6%',
      apply: (ctx) => {
        ctx.rewardMul = (ctx.rewardMul || 1) * 1.15;
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 1.06;
      },
    },
    {
      id: 'double_ink',
      name: '雙墨開市',
      blurb: '開局銀 +10%；波次補銀 +10%',
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.1;
        ctx.waveBonusMul = (ctx.waveBonusMul || 1) * 1.1;
      },
    },
    {
      id: 'inner_haste',
      name: '內息周流',
      blurb: '俠客冷卻 −7%',
      apply: (ctx) => {
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.93;
      },
    },
    {
      id: 'blood_silver',
      name: '血銀交易',
      blurb: '敵賞金 +12%；核心 HP −5%',
      apply: (ctx) => {
        ctx.rewardMul = (ctx.rewardMul || 1) * 1.12;
        ctx.coreMul = (ctx.coreMul || 1) * 0.95;
      },
    },
  ];

  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }

  function pickModifiers(seed, count) {
    const pool = RUN_MODIFIERS.slice();
    const out = [];
    let h = seed >>> 0;
    const n = Math.max(1, Math.min(count || 1, pool.length));
    for (let i = 0; i < n; i++) {
      h = (h * 1664525 + 1013904223) >>> 0;
      const idx = h % pool.length;
      out.push(pool.splice(idx, 1)[0]);
    }
    return out;
  }

  function buildModContext(mods) {
    const ctx = {
      summonCostMul: 1,
      silverMul: 1,
      coreMul: 1,
      enemySpeedMul: 1,
      rewardMul: 1,
      mergeRebateMul: 1,
      waveBonusMul: 1,
      heroCdMul: 1,
      mods: mods || [],
    };
    for (const m of ctx.mods) {
      if (m && m.apply) m.apply(ctx);
    }
    return ctx;
  }

  function modifierLabel(mods) {
    if (!mods || !mods.length) return '';
    return mods.map((m) => m.name + '（' + m.blurb + '）').join('｜');
  }


  /** 記錄本週每日首清日期（港曆） */
  function recordWeekDailyClear(save, dateStr, weekKey) {
    const day = dateStr || hkDateString();
    const wk = weekKey || hkWeekKey();
    if (!save.weekDailyMap || typeof save.weekDailyMap !== 'object') save.weekDailyMap = {};
    const arr = Array.isArray(save.weekDailyMap[wk]) ? save.weekDailyMap[wk].slice() : [];
    if (!arr.includes(day)) arr.push(day);
    save.weekDailyMap[wk] = arr;
    // 只留最近 3 週，避免存檔膨脹
    const keys = Object.keys(save.weekDailyMap).sort();
    while (keys.length > 3) {
      delete save.weekDailyMap[keys.shift()];
    }
    return arr.length;
  }

  function weekDailyCount(save, weekKey) {
    const wk = weekKey || hkWeekKey();
    const map = (save && save.weekDailyMap) || {};
    const arr = map[wk];
    return Array.isArray(arr) ? arr.length : 0;
  }

  /** 下一個週一 00:00 港時間提示（簡） */
  function hkNextMondayHint(dt) {
    const d = dt ? new Date(dt) : new Date();
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Hong_Kong',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    }).formatToParts(d);
    const get = (t) => parts.find((p) => p.type === t).value;
    const y = Number(get('year'));
    const m = Number(get('month'));
    const day = Number(get('day'));
    const wd = get('weekday'); // Mon/Tue/...
    const map = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
    const n = map[wd] || 1;
    const add = n === 1 ? 7 : 8 - n; // 距下週一
    const utc = new Date(Date.UTC(y, m - 1, day));
    utc.setUTCDate(utc.getUTCDate() + add);
    const yy = utc.getUTCFullYear();
    const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(utc.getUTCDate()).padStart(2, '0');
    return yy + '-' + mm + '-' + dd + '（下週一 00:00 港時間重置）';
  }

  function formatWeekProgress(save) {
    const wk = hkWeekKey();
    const dailyN = weekDailyCount(save, wk);
    const weeklyDone = save && save.weeklyKey === wk && save.weeklyCleared;
    const dailyDoneToday = save && save.dailyDate === hkDateString() && save.dailyCleared;
    return {
      weekKey: wk,
      dailyN: dailyN,
      dailyGoal: 7,
      weeklyDone: !!weeklyDone,
      dailyDoneToday: !!dailyDoneToday,
      label: '本週 ' + wk + '｜每日 ' + dailyN + '/7' + (dailyDoneToday ? '（今日✓）' : '') + '｜週挑戰' + (weeklyDone ? '✓' : '未清'),
      short: '日' + dailyN + '/7·週' + (weeklyDone ? '✓' : '—'),
      resetHint: hkNextMondayHint(),
    };
  }

  /** 每日關：用日期 seed 選挑戰組合＋1 修飾詞 */
  function dailyStageMeta(dateStr) {
    const s = dateStr || hkDateString();
    const h = hashStr(s);
    const themes = [
      { name: '早市抽水', focus: 'margin_call', blurb: '追保令偏多' },
      { name: '午后軋空', focus: 'leverage_fiend', blurb: '槓桿妖偏多' },
      { name: '夜傳風聲', focus: 'rumor_swarm', blurb: '傳聞蚊偏多' },
      { name: '黑羽預警', focus: 'black_swan', blurb: '黑天鵝更早' },
      { name: '暗盤餘波', focus: 'dark_tape', blurb: '暗盤影偏多' },
      { name: '恐慌回潮', focus: 'panic_board', blurb: '恐慌盤偏多' },
    ];
    const theme = themes[h % themes.length];
    const base = STAGES[1 + (h % 3)]; // 2–4 關難度帶
    const mods = pickModifiers(h ^ 0x9e3779b9, 1);
    const modLine = modifierLabel(mods);
    return {
      id: 'daily',
      date: s,
      name: '每日·' + theme.name,
      blurb: theme.blurb + (modLine ? '｜' + mods[0].name : ''),
      story:
        '今日盤口：' +
        theme.blurb +
        '。修飾：「' +
        (mods[0] ? mods[0].name + '—' + mods[0].blurb : '平盤') +
        '」。江湖唔等人——佈陣、合併、強化，守住銀樓。',
      focus: theme.focus,
      startSilver: 168 + (h % 5) * 8,
      coreHp: 190 + (h % 4) * 10,
      seed: h,
      unlockHeroes: Object.keys(HEROES),
      waveCount: 5 + (h % 3),
      baseStageId: base.id,
      modifiers: mods,
    };
  }

  /** 無盡：每次開局抽 1–2 個修飾詞（跟香港日＋開局次數） */
  function endlessModifiers(extraSeed) {
    const day = hashStr(hkDateString());
    const seed = (day ^ ((extraSeed || 0) * 2654435761)) >>> 0;
    const count = 1 + (seed % 2); // 1 或 2
    return pickModifiers(seed, count);
  }

  /** ISO 週鍵（香港時區）例：2026-W45 */
  function hkWeekKey(dt) {
    const d = dt ? new Date(dt) : new Date();
    // 用港曆年月日再算 ISO week
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Hong_Kong',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(d);
    const get = (t) => Number(parts.find((p) => p.type === t).value);
    const y = get('year');
    const m = get('month');
    const day = get('day');
    const utc = new Date(Date.UTC(y, m - 1, day));
    const dayNum = utc.getUTCDay() || 7;
    utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((utc - yearStart) / 86400000 + 1) / 7);
    const wy = utc.getUTCFullYear();
    return wy + '-W' + String(weekNo).padStart(2, '0');
  }

  /** 週挑戰雛形：每週固定 seed、抽 2 修飾、波次較每日硬 */
  function weeklyStageMeta(weekKey) {
    const key = weekKey || hkWeekKey();
    const h = hashStr(key + '|weekly');
    const themes = [
      { name: '結算週殺跌', focus: 'margin_call', blurb: '追保令偏多｜結算盤' },
      { name: '財報夜襲', focus: 'panic_board', blurb: '恐慌盤偏多｜財報前夕' },
      { name: '加息風聲', focus: 'leverage_fiend', blurb: '槓桿妖偏多｜息口傳' },
      { name: 'IPO 過熱', focus: 'rumor_swarm', blurb: '傳聞蚊偏多｜招股熱' },
      { name: '熔斷演練', focus: 'black_swan', blurb: '黑天鵝更早｜演練盤' },
      { name: '暗盤加時', focus: 'dark_tape', blurb: '暗盤影偏多｜盤後加時' },
    ];
    const theme = themes[h % themes.length];
    const base = STAGES[2 + (h % 4)]; // 3–6 關難度帶
    const mods = pickModifiers(h ^ 0x51ed270b, 2);
    const modLine = modifierLabel(mods);
    return {
      id: 'weekly',
      weekKey: key,
      name: '週挑戰·' + theme.name,
      blurb: theme.blurb + (modLine ? '｜' + mods.map((m) => m.name).join('＋') : ''),
      story:
        '本週盤口（' +
        key +
        '）：' +
        theme.blurb +
        '。雙修飾：「' +
        (mods.map((m) => m.name + '—' + m.blurb).join('；') || '平盤') +
        '」。週挑戰比每日更密——合星、強化、羈絆齊人再開倉。結算頁會顯示本週每日進度同下週重置。',
      focus: theme.focus,
      startSilver: 175 + (h % 6) * 6,
      coreHp: 200 + (h % 5) * 8,
      seed: h,
      unlockHeroes: Object.keys(HEROES),
      waveCount: 6 + (h % 3), // 6–8
      baseStageId: base.id,
      modifiers: mods,
      hpScale: 1.08 + (h % 3) * 0.02,
    };
  }

  function buildWeeklyWaves(meta) {
    const waves = buildDailyWaves(meta);
    const scale = meta.hpScale || 1.1;
    for (const w of waves) {
      for (const sp of w.spawns || []) {
        sp.hpMul = (sp.hpMul || 1) * scale;
        if (sp.enemy === 'retail_tide') sp.count = Math.max(1, Math.round((sp.count || 1) * 1.15));
      }
    }
    // 末波再加一隻槓桿精英壓迫
    if (waves.length) {
      const last = waves[waves.length - 1];
      last.spawns = last.spawns || [];
      last.spawns.push({
        enemy: 'leverage_fiend',
        count: 1,
        lane: 'random',
        interval: 0,
        delay: 2.8,
        elite: true,
        hpMul: 1.15 * scale,
      });
    }
    return waves;
  }

  function buildDailyWaves(meta) {
    const n = meta.waveCount;
    const focus = meta.focus;
    const waves = [];
    const bossish = focus === 'black_swan';
    const swarmish = focus === 'rumor_swarm' || focus === 'dark_tape';
    for (let i = 1; i <= n; i++) {
      const spawns = [
        { enemy: 'retail_tide', count: 6 + i, lane: 'cycle', interval: Math.max(0.32, 0.7 - i * 0.04) },
      ];
      if (i >= 2) {
        spawns.push({
          enemy: swarmish ? focus : 'chase_zombie',
          count: 3 + Math.floor(i / 2),
          lane: 'random',
          interval: swarmish ? 0.55 : 0.75,
          delay: 0.8,
        });
      }
      if (i >= 2) {
        const focusCount = bossish ? (i >= n - 1 ? 1 : 0) : 2 + Math.floor(i / 2);
        spawns.push({
          enemy: focus,
          count: focusCount,
          lane: bossish ? (i % 4) : 'cycle',
          interval: bossish ? 0 : focus === 'panic_board' ? 1.15 : focus === 'dark_tape' ? 0.55 : 1.0,
          delay: bossish ? 3.5 : 1.2,
          hpMul: focus === 'panic_board' ? 1.05 : 1,
        });
      }
      if (i === n || (bossish && i >= n - 1)) {
        spawns.push({
          enemy: 'black_swan',
          count: 1,
          lane: 2,
          interval: 0,
          delay: 4,
          hpMul: 1 + i * 0.04,
        });
      }
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
    {
      id: 'dark_night',
      name: '暗盤通宵',
      heroes: ['night_broker', 'short_blade', 'market_guard'],
      blurb: '掮客＋劍＋坦｜觸發暗盤通宵',
      tip: '標記後隊友收割；鐵衛頂前',
    },
    {
      id: 'dip_div',
      name: '細水抄底',
      heroes: ['dip_buyer', 'dividend_hermit', 'market_guard'],
      blurb: '雙奶＋坦｜觸發細水抄底',
      tip: '殘血急救＋分紅光環；鐵衛頂前',
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
    '夜盤掮客標記目標後，隊友打標記怪傷害更高；配空頭劍客觸發「暗盤通宵」。',
    '第 6 關「盤後暗盤」暗盤影又快又陰；前排坦克＋標記收割更穩。',
    '週挑戰雙修飾＋血量加厚——優先合到 2–3 星再硬頂；齊人羈絆先開波。',
    '抄底居士＋股息隱士 →「細水抄底」：殘血急救更強；坦＋雙奶好捱。',
    '睇關卡列下方「本週進度」：每日 n/7＋週挑戰首清獎。',
  ];


  /** 新手卡關提示（整備過久／銀兩積壓） */
  const STUCK_TIPS = [
    '銀兩夠就召人上陣；空格唔好留太多。',
    '有兩隻同種同星就合併——升星通常比多召 1 星更強。',
    '點場上俠客 → 下方刀利／甲厚／內息，銀兩唔使慳到一毛唔用。',
    '前排放莊家鐵衛，後排放劍客／刺客；敵人由右入。',
    '齊人先開波：睇 HUD 羈絆列，有「銀樓鐵壁／多空對決」更穩。',
    '第 1 關可撳推薦陣容芯片跟住召；唔識就跟「新手鐵壁」。',
    '波次間先合併再強化；唔好銀兩堆住等死。',
  ];

  function pickStuckTip(seed) {
    const i = Math.abs((seed || Date.now()) | 0) % STUCK_TIPS.length;
    return STUCK_TIPS[i];
  }

  const ACHIEVEMENT_CATS = [
    { id: 'stage', name: '關卡' },
    { id: 'merge', name: '合成' },
    { id: 'combat', name: '戰鬥' },
    { id: 'meta', name: '收集／日常' },
  ];

  const ACHIEVEMENTS = [
    { id: 'first_clear', cat: 'stage', name: '開張大吉', blurb: '通關第 1 關', check: (s) => (s.maxStageCleared || 0) >= 1 },
    { id: 'stage4', cat: 'stage', name: '清算達人', blurb: '通關第 4 關', check: (s) => (s.maxStageCleared || 0) >= 4 },
    { id: 'stage5', cat: 'stage', name: '熔斷倖存', blurb: '通關第 5 關', check: (s) => (s.maxStageCleared || 0) >= 5 },
    { id: 'stage6', cat: 'stage', name: '暗盤破曉', blurb: '通關第 6 關「盤後暗盤」', check: (s) => (s.maxStageCleared || 0) >= 6 },
    { id: 'all_stages', cat: 'stage', name: '六關皆破', blurb: '通關全部主線關卡', check: (s) => (s.maxStageCleared || 0) >= 6 },
    { id: 'star3', cat: 'merge', name: '三星掛牌', blurb: '首次合成 3 星', check: (s) => !!s.ach && s.ach.star3 },
    { id: 'maxstar', cat: 'merge', name: '滿星開盤', blurb: '首次合成 4 星', check: (s) => !!s.ach && s.ach.maxstar },
    { id: 'upgrade', cat: 'merge', name: '鍛打開倉', blurb: '首次強化場上俠客', check: (s) => !!s.ach && s.ach.upgrade },
    { id: 'bond', cat: 'combat', name: '齊人有行情', blurb: '首次觸發羈絆', check: (s) => !!s.ach && s.ach.bond },
    { id: 'elite', cat: 'combat', name: '精英過招', blurb: '擊敗一次精英敵', check: (s) => !!s.ach && s.ach.elite },
    { id: 'kills100', cat: 'combat', name: '百人斬', blurb: '累計擊殺 100', check: (s) => (s.totalKills || 0) >= 100 },
    { id: 'kills500', cat: 'combat', name: '殺跌機器', blurb: '累計擊殺 500', check: (s) => (s.totalKills || 0) >= 500 },
    { id: 'kills1000', cat: 'combat', name: '千浪收割', blurb: '累計擊殺 1000', check: (s) => (s.totalKills || 0) >= 1000 },
    { id: 'endless10', cat: 'combat', name: '撐過十浪', blurb: '無盡最佳 ≥ 10 波', check: (s) => (s.bestEndlessWave || 0) >= 10 },
    { id: 'endless20', cat: 'combat', name: '廿浪長牛', blurb: '無盡最佳 ≥ 20 波', check: (s) => (s.bestEndlessWave || 0) >= 20 },
    { id: 'codex_heroes', cat: 'meta', name: '門派圖齊', blurb: '圖鑑見齊全部俠客', check: (s) => Object.keys(HEROES).every((id) => (s.seenHeroes || {})[id]) },
    { id: 'codex_enemies', cat: 'meta', name: '敵情盡知', blurb: '圖鑑見齊全部敵人', check: (s) => Object.keys(ENEMIES).every((id) => (s.seenEnemies || {})[id]) },
    { id: 'daily', cat: 'meta', name: '日日開盤', blurb: '完成一次每日關', check: (s) => !!s.ach && s.ach.daily },
    { id: 'lineup', cat: 'meta', name: '跟單上陣', blurb: '使用一次推薦陣容芯片', check: (s) => !!s.ach && s.ach.lineup },
    { id: 'stage2', cat: 'stage', name: '午市守得住', blurb: '通關第 2 關', check: (s) => (s.maxStageCleared || 0) >= 2 },
    { id: 'stage3', cat: 'stage', name: '夜盤留燈', blurb: '通關第 3 關', check: (s) => (s.maxStageCleared || 0) >= 3 },
    { id: 'endless5', cat: 'combat', name: '五浪初嚐', blurb: '無盡最佳 ≥ 5 波', check: (s) => (s.bestEndlessWave || 0) >= 5 },
    { id: 'silver500', cat: 'meta', name: '銀樓小財', blurb: '累計銀兩帳 ≥ 500', check: (s) => (s.totalSilver || 0) >= 500 },
    { id: 'weekly', cat: 'meta', name: '週結過關', blurb: '完成一次週挑戰', check: (s) => !!s.ach && s.ach.weekly },
    { id: 'bonds3', cat: 'combat', name: '三絆齊鳴', blurb: '單局同時激活 3 個羈絆', check: (s) => !!s.ach && s.ach.bonds3 },
    {
      id: 'week_grind',
      cat: 'meta',
      name: '本週勤力盤',
      blurb: '同一週內每日≥3 日＋完成週挑戰',
      check: (s) => {
        const wk = typeof hkWeekKey === 'function' ? hkWeekKey() : '';
        const n = weekDailyCount(s, wk);
        return n >= 3 && !!s.weeklyCleared && s.weeklyKey === wk;
      },
    },
  ];

  /** 首通銀兩獎勵（入累計帳） */
  const STAGE_FIRST_CLEAR = {
    1: 30,
    2: 45,
    3: 60,
    4: 80,
    5: 100,
    6: 150,
    all: 200,
  };

  function stageFirstClearBonus(stageId) {
    return STAGE_FIRST_CLEAR[stageId] || 0;
  }

  function saveStats(save) {
    const s = save || {};
    return {
      totalKills: s.totalKills || 0,
      bestEndlessWave: s.bestEndlessWave || 0,
      totalSilver: s.totalSilver || 0,
      maxStageCleared: s.maxStageCleared || 0,
      stagesTotal: STAGES.length,
      achUnlocked: Object.keys(s.unlockedAch || {}).length,
      achTotal: ACHIEVEMENTS.length,
      weekProgress: formatWeekProgress(s).label,
    };
  }

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
    if (n >= 6) {
      spawns.push({
        enemy: 'dark_tape',
        count: count(2 + Math.floor(n / 4)),
        lane: 'random',
        interval: Math.max(0.32, 0.55 - n * 0.012),
        delay: 0.6,
        hpMul: mul * 0.9,
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

  /** 召喚費曲線：同種每多召一次 +6（封頂 +48） */
  function summonCost(heroId, summonCounts) {
    const def = HEROES[heroId];
    if (!def) return 999;
    const n = (summonCounts && summonCounts[heroId]) || 0;
    return def.cost + Math.min(48, n * 6);
  }

  /** 合併回報銀兩（按目標新星級） */
  function mergeRebate(heroId, newStar) {
    const def = HEROES[heroId];
    if (!def) return 0;
    return Math.round(def.cost * 0.14 * newStar);
  }

  function activeBonds(heroes) {
    const ids = new Set(heroes.filter((h) => h.hp > 0).map((h) => h.id));
    return BONDS.filter((b) => b.need.every((id) => ids.has(id)));
  }

  function bondModsFor(heroId, bonds) {
    const mods = { atkMul: 1, cdMul: 1, tankDmgMul: 1, auraMul: 1, buffBonus: 0, highHpExtra: 0, rangeBonus: 0, markBonus: 0, markDurBonus: 0, healLowBonus: 0 };
    for (const b of bonds) {
      if (!b.applyTo.includes(heroId)) continue;
      if (b.atkMul) mods.atkMul *= b.atkMul;
      if (b.cdMul) mods.cdMul *= b.cdMul;
      if (b.tankDmgMul) mods.tankDmgMul *= b.tankDmgMul;
      if (b.auraMul) mods.auraMul *= b.auraMul;
      if (b.buffBonus) mods.buffBonus += b.buffBonus;
      if (b.highHpExtra) mods.highHpExtra += b.highHpExtra;
      if (b.rangeBonus) mods.rangeBonus += b.rangeBonus;
      if (b.markBonus) mods.markBonus += b.markBonus;
      if (b.markDurBonus) mods.markDurBonus += b.markDurBonus;
      if (b.healLowBonus) mods.healLowBonus += b.healLowBonus;
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
      version: 12,
      totalSilver: 0,
      totalKills: 0,
      maxStageCleared: 0,
      bestEndlessWave: 0,
      firstClears: {},
      unlocked: Object.keys(HEROES),
      lastSpeed: 1,
      skipTutorial: false,
      showCellHints: true,
      showSkillCd: true,
      reduceShake: false,
      reduceFlash: false,
      stuckTips: true,
      sfxEnabled: true,
      autoPauseOnBond: false,
      seenHeroes: {},
      seenEnemies: {},
      ach: {},
      unlockedAch: {},
      dailyDate: '',
      dailyCleared: false,
      weeklyKey: '',
      weeklyCleared: false,
      weekDailyMap: {},
      firstBootDone: false,
      tutorialDone: false,
    };
  }

  function exportSaveJson(save) {
    const payload = {
      meta: { game: 'yinlou-defense', exportedAt: new Date().toISOString(), version: save.version || 12 },
      save: { ...defaultSave(), ...save },
    };
    return JSON.stringify(payload, null, 2);
  }

  function importSaveJson(raw) {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const body = data && data.save ? data.save : data;
    if (!body || typeof body !== 'object') throw new Error('無效存檔');
    const merged = { ...defaultSave(), ...body };
    merged.version = Math.max(12, merged.version || 12);
    if (!merged.weekDailyMap) merged.weekDailyMap = {};
    if (!merged.firstClears) merged.firstClears = {};
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
    return 40;
  }



  /** 根據關卡敵組成動態推薦陣容（簡版） */
  function recommendForStage(stage, endless, daily, weekly) {
    const counts = {};
    const waves = (stage && stage.waves) || [];
    for (const w of waves) {
      for (const sp of w.spawns || []) {
        counts[sp.enemy] = (counts[sp.enemy] || 0) + (sp.count || 0);
      }
    }
    let best = LINEUPS[0];
    let score = -1;
    const pick = (id, sc) => {
      const lu = LINEUPS.find((x) => x.id === id);
      if (lu && sc >= score) {
        score = sc;
        best = lu;
      }
    };
    if (endless) {
      pick('arb_hedge', 5);
      pick('dark_night', 4);
      return { lineup: best, reason: '無盡浪種雜——跨 lane／標記收割較穩' };
    }
    const focusMeta = (weekly && stage && stage.weeklyMeta) || (daily && stage && stage.dailyMeta);
    if (focusMeta) {
      const f = focusMeta.focus;
      if (f === 'dark_tape') pick('dark_night', 8);
      else if (f === 'panic_board') pick('arb_hedge', 7);
      else if (f === 'black_swan' || f === 'leverage_fiend') pick('squeeze', 8);
      else if (f === 'margin_call') {
        pick('iron_wall', 7);
        pick('dip_div', 6);
      } else if (f === 'rumor_swarm') pick('leverage', 6);
      else pick('bull_bear', 5);
      const kind = weekly ? '週挑戰' : '每日';
      return { lineup: best, reason: kind + '焦點「' + (focusMeta.blurb || f) + '」' };
    }
    // 第 1 關固定偏新手鐵壁
    if (stage && stage.id === 1) {
      return { lineup: LINEUPS[0], reason: '教學關——鐵衛＋隱士＋刀客最穩' };
    }
    const dark = counts.dark_tape || 0;
    const panic = counts.panic_board || 0;
    const swan = counts.black_swan || 0;
    const margin = counts.margin_call || 0;
    const rumor = counts.rumor_swarm || 0;
    const fiend = counts.leverage_fiend || 0;
    pick('iron_wall', 2 + (margin > 8 ? 3 : 0));
    pick('bull_bear', 3 + (stage && stage.id === 2 ? 3 : 0));
    pick('leverage', 2 + (rumor > 10 ? 3 : 0) + (fiend > 4 ? 2 : 0));
    pick('squeeze', 2 + (swan >= 3 ? 5 : swan >= 2 ? 3 : 0));
    pick('arb_hedge', 2 + (panic > 4 ? 5 : 0) + (stage && stage.id === 5 ? 2 : 0));
    pick('dark_night', 2 + (dark > 6 ? 7 : dark > 0 ? 4 : 0) + (stage && stage.id === 6 ? 3 : 0));
    let reason = '均衡起步';
    if (best.id === 'dark_night') reason = '暗盤影偏多——標記＋劍減速';
    else if (best.id === 'arb_hedge') reason = '恐慌／雜浪——跨 lane 點殺';
    else if (best.id === 'squeeze') reason = 'Boss／高血多——軋空收割';
    else if (best.id === 'leverage') reason = '傳聞蚊／槓桿潮——範圍清場';
    else if (best.id === 'iron_wall') reason = '追保／前壓——鐵壁更穩';
    else if (best.id === 'bull_bear') reason = '多空齊開——近遠互補';
    return { lineup: best, reason };
  }

  function formatRunModifiers(mods) {
    if (!mods || !mods.length) return '';
    return mods.map((m) => m.name + '（' + m.blurb + '）').join('\n');
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
    ACHIEVEMENT_CATS,
    STAGE_FIRST_CLEAR,
    stageFirstClearBonus,
    saveStats,
    LINEUPS,
    FAIL_TIPS,
    STUCK_TIPS,
    RUN_MODIFIERS,
    MAX_STAR,
    UPGRADE_PATHS,
    upgradeCost,
    upgradeLabel,
    ENDLESS_MILESTONES,
    buildEndlessWave,
    buildDailyWaves,
    buildWeeklyWaves,
    dailyStageMeta,
    weeklyStageMeta,
    hkWeekKey,
    recordWeekDailyClear,
    weekDailyCount,
    hkNextMondayHint,
    formatWeekProgress,
    endlessModifiers,
    pickModifiers,
    buildModContext,
    modifierLabel,
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
    pickStuckTip,
    recommendForStage,
    formatRunModifiers,
    firstRunBonus,
    markSeenHero,
    markSeenEnemy,
    refreshAchievements,
  };
})(window);
