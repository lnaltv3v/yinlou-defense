/**
 * 銀樓防衛 — 靜態資料 v3.0.0
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
      atk: 15,
      hp: 92,
      range: 78,
      cooldown: 0.5,
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
    lock_hermit: {
      id: 'lock_hermit',
      name: '鎖倉居士',
      blurb: '鎖倉減攻 · 鐵筆點穴',
      lore: '鎖倉唔等於認輸——鐵筆一點，敵刀收三分。居士話市崩先至鎖倉，人笑佢慢，佢笑人忙：刀慢一寸，銀樓多一息。',
      role: 'locker',
      cost: 33,
      color: '#406858',
      silhouette: 'brush',
      atk: 10,
      hp: 72,
      range: 160,
      cooldown: 0.70,
      speed: 0,
      slow: 0.18,
      slowDur: 0.9,
      skill: {
        id: 'lock_seal',
        name: '鎖倉印',
        type: 'active',
        blurb: '每第 4 擊鎖倉：敵攻擊 −38%（約 3.6 秒）',
        every: 4,
        lockMul: 0.62,
        lockDur: 3.6,
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
    {
      id: 'lock_vault',
      name: '鎖倉鐵壁',
      need: ['lock_hermit', 'market_guard'],
      blurb: '鐵衛減傷；鎖倉減攻再 −8%',
      tankDmgMul: 0.88,
      lockBonus: 0.08,
      applyTo: ['lock_hermit', 'market_guard'],
    },
    {
      id: 'lock_div',
      name: '細水鎖倉',
      need: ['lock_hermit', 'dividend_hermit'],
      blurb: '光環加強；鎖倉持續 +0.8 秒',
      auraMul: 1.12,
      lockDurBonus: 0.8,
      applyTo: ['lock_hermit', 'dividend_hermit'],
    },
    {
      id: 'squeeze_lock',
      name: '軋空鎖倉',
      need: ['squeeze_blade', 'lock_hermit'],
      blurb: '逼空加成＋12%；鎖倉減攻再 −6%',
      highHpExtra: 0.12,
      lockBonus: 0.06,
      applyTo: ['squeeze_blade', 'lock_hermit'],
    },
    {
      id: 'ipo_lock',
      name: '招股鎖倉',
      need: ['ipo_herald', 'lock_hermit'],
      blurb: '鼓手加攻更強；鎖倉持續 +0.5 秒',
      buffBonus: 0.06,
      lockDurBonus: 0.5,
      applyTo: ['ipo_herald', 'lock_hermit'],
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
      entrance: '黑羽驚惶入場 — 全體短暫減速＋核心震盪｜對策：鐵衛頂前、逼空收割、合星後再開逼',
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
    circuit_swan: {
      id: 'circuit_swan',
      name: '熔斷天鵝',
      lore: '開年第一聲熔斷鐘——黑羽披金邊，專停俠客刀口。唔係普通黑天鵝：佢一鳴，櫃檯燈光齊閃，內息一滯。正式像素後金邊更易辨——鐘響先鎖倉。',
      entrance: '熔斷鐘入場 — 全場停刀＋核心震盪；鄰近敵短暫加速｜對策：甲厚／內息撐窗、鎖倉減攻、唔好硬拼鐘響',
      hp: 430,
      atk: 25,
      speed: 18,
      reward: 100,
      color: '#2A1828',
      radius: 21,
      boss: true,
      attackRange: 76,
      attackCd: 1.32,
      preferHero: 0.42,
      skill: {
        id: 'circuit_break',
        name: '熔斷鐘',
        every: 3,
        blurb: '每第 3 擊：全場停刀＋核心震盪；鄰近敵短暫加速',
        type: 'circuit',
        stunDur: 0.95,
        coreDmg: 16,
        heroCdPad: 0.75,
        allyRush: 0.55,
        allyRushMul: 1.12,
      },
    },

    halt_tide: {
      id: 'halt_tide',
      name: '停牌潮',
      lore: '第三變體——唔係黑羽、唔係金邊，係整街臨停告示 simultaneous 貼上。刀客未出鞘已收手；潮頭過處，符紙飛舞。原創綽號，影射臨停潮，唔抄 IP。',
      entrance: '停牌潮湧入 — 範圍臨停＋核心震盪；鄰近停牌符短暫加速｜對策：先清符再軋潮心、鎖倉鐵壁',
      hp: 470,
      atk: 24,
      speed: 17,
      reward: 110,
      color: '#4A3A28',
      radius: 21,
      boss: true,
      attackRange: 74,
      attackCd: 1.36,
      preferHero: 0.48,
      skill: {
        id: 'halt_wave',
        name: '停牌潮',
        every: 3,
        blurb: '每第 3 擊：範圍臨停＋核心震盪；鄰近停牌符短暫加速',
        type: 'halt_tide',
        stunDur: 1.15,
        stunRad: 160,
        coreDmg: 14,
        heroCdPad: 0.85,
        sealRush: 0.7,
        sealRushMul: 1.18,
      },
    },

    ink_specter: {
      id: 'ink_specter',
      name: '墨影帳',
      lore: '第四潮——帳本裂縫滲出墨影，唔係黑羽、金邊、臨停符，係假帳同時翻開。原創綽號，影射對帳幽靈，唔抄 IP、唔用真人名。',
      entrance: '墨影翻帳入場 — 範圍降攻＋抽銀＋核心震盪；鄰近暗盤短暫加速｜對策：護銀分路、鎖倉減抽、先清暗盤影',
      hp: 520,
      atk: 26,
      speed: 16,
      reward: 125,
      color: '#2A3040',
      radius: 22,
      boss: true,
      attackRange: 78,
      attackCd: 1.3,
      preferHero: 0.5,
      skill: {
        id: 'ink_blot',
        name: '墨影翻帳',
        every: 3,
        blurb: '每第 3 擊：範圍降攻＋抽銀＋核心震盪；鄰近暗盤影短暫加速',
        type: 'ink_specter',
        atkDebuff: 0.22,
        atkDebuffDur: 3.2,
        silverDrain: 7,
        coreDmg: 15,
        blotRad: 170,
        tapeRush: 0.65,
        tapeRushMul: 1.16,
      },
    },

    ledger_mirage: {
      id: 'ledger_mirage',
      name: '帳鏡蜃',
      lore: '第五潮——帳本對摺成鏡，蜃氣把銀樓倒映成假帳。唔係墨影抽銀，係鏡稅封庫：擊殺銀兩縮水、合星回報短暫凍結。原創綽號，影射對帳蜃景，唔抄 IP、唔用真人／金庸名。',
      entrance: '帳鏡蜃入場 — 範圍降攻＋鏡稅封庫＋核心震盪｜對策：鐵衛頂前、鎖倉減抽、合星趁鏡稅空檔',
      hp: 560,
      atk: 27,
      speed: 15,
      reward: 140,
      color: '#3A4858',
      radius: 23,
      boss: true,
      attackRange: 80,
      attackCd: 1.28,
      preferHero: 0.52,
      skill: {
        id: 'mirage_tax',
        name: '帳鏡封庫',
        every: 3,
        blurb: '每第 3 擊：範圍降攻＋鏡稅（擊殺銀縮／合星凍結）＋核心震盪',
        type: 'ledger_mirage',
        atkDebuff: 0.2,
        atkDebuffDur: 3.0,
        mirageTax: 4.0,
        mirageTaxMul: 0.58,
        mirageTaxStackMul: 0.88,
        mirageTaxFloor: 0.38,
        mirageTaxStackExtend: 0.55,
        silverDrain: 5,
        coreDmg: 16,
        blotRad: 175,
        heroCdPad: 0.55,
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
      lore: '巷口風聲成群，細而快，專拖慢你節奏。正式像素後更易辨識——唔好放佢哋咬穿前排。',
      hp: 24,
      atk: 4,
      speed: 56,
      reward: 5,
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
      lore: '盤後暗影，半透明高速；影遁時更難捉。正式精靈帶提燈影，隱身時仍有輪廓。',
      hp: 40,
      atk: 9,
      speed: 50,
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

    halt_seal: {
      id: 'halt_seal',
      name: '停牌符',
      lore: '一紙臨停貼上城門——刀客亦要收手三息。專咬前排，命中短暫停牌（無法出手）。',
      hp: 34,
      atk: 6,
      speed: 46,
      reward: 7,
      color: '#6A5040',
      radius: 9,
      attackRange: 38,
      attackCd: 0.82,
      preferHero: 0.88,
      stunSec: 1.05,
      skill: {
        id: 'trading_halt',
        name: '臨停',
        every: 1,
        blurb: '普攻附帶短暫停牌（俠客無法出手）',
        type: 'stun',
        dur: 1.05,
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
      startSilver: 210,
      coreHp: 220,
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
      startSilver: 190,
      coreHp: 205,
      unlockHeroes: Object.keys(HEROES),
      waves: [
        wavePack([
          { enemy: 'retail_tide', count: 7, lane: 'cycle', interval: 0.7 },
          { enemy: 'margin_call', count: 2, lane: 'random', interval: 1.25, delay: 1.5 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 8, lane: 'cycle', interval: 0.58 },
          { enemy: 'chase_zombie', count: 3, lane: 'cycle', interval: 1.05, delay: 0.8 },
          { enemy: 'margin_call', count: 2, lane: 'random', interval: 1.15, delay: 2 },
          { enemy: 'halt_seal', count: 2, lane: 'cycle', interval: 1.3, delay: 2.4 },
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
      startSilver: 218,
      coreHp: 248,
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
      startSilver: 248,
      coreHp: 272,
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
      startSilver: 262,
      coreHp: 288,
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
          { enemy: 'retail_tide', count: 15, lane: 'cycle', interval: 0.28 },
          { enemy: 'panic_board', count: 5, lane: 'random', interval: 0.78, delay: 0.4 },
          { enemy: 'margin_call', count: 7, lane: 'cycle', interval: 0.52, delay: 0.5 },
          { enemy: 'leverage_fiend', count: 4, lane: 'random', interval: 0.95, delay: 1 },
          { enemy: 'black_swan', count: 2, lane: 'cycle', interval: 3.6, delay: 2.8 },
          { enemy: 'rumor_swarm', count: 10, lane: 'random', interval: 0.26, delay: 0.3 },
        ]),
      ],
    },

    {
      id: 6,
      name: '盤後暗盤',
      story: '收市鐘已響，暗盤卻未歇。夜盤掮客提燈入巷，影在磚縫遊走，像未簽完嘅契。呢一晚唔係開市，係清算未完嘅債——標記、收割、護盤，一氣呵成，否則債入骨髓。',
      challenge: true,
      startSilver: 272,
      coreHp: 302,
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
          { enemy: 'dark_tape', count: 13, lane: 'cycle', interval: 0.32 },
          { enemy: 'panic_board', count: 5, lane: 'random', interval: 0.78, delay: 0.4 },
          { enemy: 'margin_call', count: 7, lane: 'cycle', interval: 0.5, delay: 0.5 },
          { enemy: 'leverage_fiend', count: 4, lane: 'random', interval: 0.95, delay: 1 },
          { enemy: 'black_swan', count: 2, lane: 'cycle', interval: 3.4, delay: 2.5 },
          { enemy: 'chase_zombie', count: 5, lane: 'random', interval: 0.58, delay: 0.6 },
        ]),
      ],
    },
    {
      id: 7,
      name: '斷索開市',
      story: '開市鑼未響，槓桿索已斷。停牌符貼滿城門，暗盤影同恐慌盤一齊湧向櫃檯——掌櫃拍桌：今夜唔係開市，係斷索之後第一盤棋。鎖倉、護盤、軋空，一氣呵成，否則只剩空倉同空城。',
      challenge: true,
      startSilver: 295,
      coreHp: 318,
      unlockHeroes: Object.keys(HEROES),
      firstClearBonus: 200,
      waves: [
        wavePack([
          { enemy: 'halt_seal', count: 5, lane: 'cycle', interval: 0.7 },
          { enemy: 'retail_tide', count: 10, lane: 'random', interval: 0.42, delay: 0.6 },
          { enemy: 'rumor_swarm', count: 6, lane: 'cycle', interval: 0.4, delay: 0.5 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 7, lane: 'cycle', interval: 0.5 },
          { enemy: 'margin_call', count: 5, lane: 'random', interval: 0.75, delay: 0.8 },
          { enemy: 'halt_seal', count: 4, lane: 'cycle', interval: 0.85, delay: 1.2 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 4, lane: 'cycle', interval: 1.05, delay: 0.5, elite: true },
          { enemy: 'chase_zombie', count: 6, lane: 'random', interval: 0.7, delay: 0.8 },
          { enemy: 'leverage_fiend', count: 2, lane: 'cycle', interval: 1.4, delay: 2 },
          { enemy: 'halt_seal', count: 4, lane: 'random', interval: 0.9, delay: 1.5 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 10, lane: 'cycle', interval: 0.4 },
          { enemy: 'rumor_swarm', count: 12, lane: 'random', interval: 0.3, delay: 0.3 },
          { enemy: 'margin_call', count: 6, lane: 'cycle', interval: 0.6, delay: 0.8 },
          { enemy: 'black_swan', count: 1, lane: 1, interval: 0, delay: 4.0 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.9 },
          { enemy: 'halt_seal', count: 6, lane: 'random', interval: 0.7, delay: 0.5 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 1.1, delay: 1.2, elite: true },
          { enemy: 'dark_tape', count: 8, lane: 'random', interval: 0.4, delay: 0.6 },
        ]),
        wavePack([
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.5 },
          { enemy: 'panic_board', count: 5, lane: 'random', interval: 0.85, delay: 0.5 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 3.2 },
          { enemy: 'halt_seal', count: 5, lane: 'cycle', interval: 0.75, delay: 1.5 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 14, lane: 'cycle', interval: 0.28 },
          { enemy: 'dark_tape', count: 12, lane: 'random', interval: 0.34, delay: 0.25 },
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.85, delay: 0.8 },
          { enemy: 'leverage_fiend', count: 4, lane: 'random', interval: 0.95, delay: 1 },
          { enemy: 'rumor_swarm', count: 12, lane: 'cycle', interval: 0.26, delay: 0.2 },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 8, lane: 'cycle', interval: 0.55 },
          { enemy: 'dark_tape', count: 12, lane: 'random', interval: 0.32, delay: 0.3 },
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.8, delay: 0.6 },
          { enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 3.5 },
          { enemy: 'black_swan', count: 1, lane: 3, interval: 0, delay: 6.0 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 14, lane: 'cycle', interval: 0.28 },
          { enemy: 'panic_board', count: 6, lane: 'random', interval: 0.72, delay: 0.35 },
          { enemy: 'halt_seal', count: 8, lane: 'cycle', interval: 0.5, delay: 0.4 },
          { enemy: 'leverage_fiend', count: 5, lane: 'random', interval: 0.88, delay: 0.9, elite: true },
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.48, delay: 0.5 },
          { enemy: 'black_swan', count: 2, lane: 'cycle', interval: 3.0, delay: 2.0 },
          { enemy: 'chase_zombie', count: 6, lane: 'random', interval: 0.55, delay: 0.6 },
        ]),
      ],
    },

    {
      id: 8,
      name: '銀樓守歲',
      story: '除夕子時，銀樓門神換墨。停牌符同暗盤影趁辭歲鼓聲湧入——掌櫃點燈：今夜唔睇盤口，只守歲。鎖倉居士鐵筆一點，鐵衛擋門，隱士分紅；守過子時，來年開張先有底氣。',
      challenge: true,
      startSilver: 315,
      coreHp: 342,
      unlockHeroes: Object.keys(HEROES),
      firstClearBonus: 220,
      waves: [
        wavePack([
          { enemy: 'halt_seal', count: 6, lane: 'cycle', interval: 0.65 },
          { enemy: 'retail_tide', count: 12, lane: 'random', interval: 0.36, delay: 0.5 },
          { enemy: 'rumor_swarm', count: 8, lane: 'cycle', interval: 0.34, delay: 0.4 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 9, lane: 'cycle', interval: 0.42 },
          { enemy: 'margin_call', count: 6, lane: 'random', interval: 0.7, delay: 0.7 },
          { enemy: 'halt_seal', count: 5, lane: 'cycle', interval: 0.8, delay: 1.0 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.95, delay: 0.4, elite: true },
          { enemy: 'chase_zombie', count: 7, lane: 'random', interval: 0.65, delay: 0.7 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 1.2, delay: 1.8 },
          { enemy: 'dark_tape', count: 8, lane: 'random', interval: 0.4, delay: 1.2 },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 8, lane: 'cycle', interval: 0.55 },
          { enemy: 'rumor_swarm', count: 14, lane: 'random', interval: 0.26, delay: 0.25 },
          { enemy: 'margin_call', count: 7, lane: 'cycle', interval: 0.55, delay: 0.7 },
          { enemy: 'black_swan', count: 1, lane: 1, interval: 0, delay: 3.8 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.85 },
          { enemy: 'dark_tape', count: 10, lane: 'random', interval: 0.36, delay: 0.4 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 1.0, delay: 1.0, elite: true },
          { enemy: 'halt_seal', count: 6, lane: 'random', interval: 0.7, delay: 0.8 },
        ]),
        wavePack([
          { enemy: 'margin_call', count: 9, lane: 'cycle', interval: 0.48 },
          { enemy: 'panic_board', count: 6, lane: 'random', interval: 0.78, delay: 0.45 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 3.0 },
          { enemy: 'dark_tape', count: 10, lane: 'cycle', interval: 0.34, delay: 1.2 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 16, lane: 'cycle', interval: 0.26 },
          { enemy: 'halt_seal', count: 8, lane: 'random', interval: 0.5, delay: 0.3 },
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.8, delay: 0.7 },
          { enemy: 'leverage_fiend', count: 4, lane: 'random', interval: 0.9, delay: 1.0 },
          { enemy: 'rumor_swarm', count: 14, lane: 'cycle', interval: 0.24, delay: 0.2 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 14, lane: 'cycle', interval: 0.3 },
          { enemy: 'halt_seal', count: 9, lane: 'random', interval: 0.48, delay: 0.3 },
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.75, delay: 0.5 },
          { enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 3.2 },
          { enemy: 'black_swan', count: 1, lane: 3, interval: 0, delay: 5.5 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 16, lane: 'cycle', interval: 0.26 },
          { enemy: 'panic_board', count: 7, lane: 'random', interval: 0.68, delay: 0.3 },
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.45, delay: 0.35 },
          { enemy: 'leverage_fiend', count: 5, lane: 'random', interval: 0.82, delay: 0.8, elite: true },
          { enemy: 'margin_call', count: 9, lane: 'cycle', interval: 0.45, delay: 0.45 },
          { enemy: 'black_swan', count: 2, lane: 'cycle', interval: 2.8, delay: 1.8 },
          { enemy: 'chase_zombie', count: 7, lane: 'random', interval: 0.5, delay: 0.55 },
        ]),
      ],
    },

    {
      id: 9,
      name: '開年軋空',
      story: '正月開市第一鑼，軋空客同熔斷天鵝一齊殺入銀樓巷——掌櫃拍門環：今夜唔睇紅盤，只守開年第一倉。鎖倉減攻、鐵衛擋門、逼空收割，軋得過先有來年。',
      challenge: true,
      startSilver: 335,
      coreHp: 358,
      unlockHeroes: Object.keys(HEROES),
      firstClearBonus: 260,
      waves: [
        wavePack([
          { enemy: 'retail_tide', count: 12, lane: 'cycle', interval: 0.34 },
          { enemy: 'halt_seal', count: 5, lane: 'random', interval: 0.75, delay: 0.5 },
          { enemy: 'rumor_swarm', count: 8, lane: 'cycle', interval: 0.32, delay: 0.4 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 10, lane: 'cycle', interval: 0.4 },
          { enemy: 'margin_call', count: 6, lane: 'random', interval: 0.68, delay: 0.6 },
          { enemy: 'chase_zombie', count: 6, lane: 'cycle', interval: 0.7, delay: 1.0 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.9, delay: 0.4, elite: true },
          { enemy: 'leverage_fiend', count: 3, lane: 'random', interval: 1.15, delay: 1.5 },
          { enemy: 'halt_seal', count: 6, lane: 'cycle', interval: 0.7, delay: 1.0 },
          { enemy: 'dark_tape', count: 8, lane: 'random', interval: 0.38, delay: 0.8 },
        ]),
        wavePack([
          { enemy: 'rumor_swarm', count: 14, lane: 'cycle', interval: 0.26 },
          { enemy: 'margin_call', count: 7, lane: 'random', interval: 0.55, delay: 0.5 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 3.5 },
          { enemy: 'halt_seal', count: 5, lane: 'cycle', interval: 0.72, delay: 1.2 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.82 },
          { enemy: 'dark_tape', count: 11, lane: 'random', interval: 0.34, delay: 0.35 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 0.95, delay: 1.0, elite: true },
          { enemy: 'chase_zombie', count: 7, lane: 'random', interval: 0.58, delay: 0.7 },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 8, lane: 'cycle', interval: 0.52 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.5, delay: 0.4 },
          { enemy: 'black_swan', count: 1, lane: 1, interval: 0, delay: 3.0 },
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.85, delay: 1.2 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 16, lane: 'cycle', interval: 0.26 },
          { enemy: 'dark_tape', count: 12, lane: 'random', interval: 0.3, delay: 0.25 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 0.9, delay: 0.9 },
          { enemy: 'rumor_swarm', count: 12, lane: 'random', interval: 0.24, delay: 0.3 },
          { enemy: 'halt_seal', count: 6, lane: 'cycle', interval: 0.6, delay: 0.8 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.75 },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.28, delay: 0.3 },
          { enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 2.8 },
          { enemy: 'black_swan', count: 1, lane: 3, interval: 0, delay: 5.0 },
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.48, delay: 0.5 },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.45 },
          { enemy: 'panic_board', count: 7, lane: 'random', interval: 0.68, delay: 0.3 },
          { enemy: 'leverage_fiend', count: 5, lane: 'cycle', interval: 0.85, delay: 0.7, elite: true },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.28, delay: 0.4 },
          { enemy: 'circuit_swan', count: 1, lane: 2, interval: 0, delay: 2.2 },
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.45, delay: 0.6 },
          { enemy: 'chase_zombie', count: 6, lane: 'random', interval: 0.52, delay: 0.8 },
        ]),
      ],
    },

    {
      id: 10,
      name: '雙天鵝夜',
      story: '子夜兩聲鐘——黑羽同金邊一齊落。掌櫃熄一半燈：今夜唔係單 Boss，係雙天鵝夾擊。先軋黑羽，再擋熔斷；鎖倉、逼空、鐵衛，一個都唔能少，否則銀樓只剩空帳同空城。',
      challenge: true,
      startSilver: 348,
      coreHp: 378,
      unlockHeroes: Object.keys(HEROES),
      firstClearBonus: 300,
      waves: [
        wavePack([
          { enemy: 'halt_seal', count: 6, lane: 'cycle', interval: 0.62 },
          { enemy: 'retail_tide', count: 12, lane: 'random', interval: 0.32, delay: 0.4 },
          { enemy: 'rumor_swarm', count: 10, lane: 'cycle', interval: 0.3, delay: 0.35 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 11, lane: 'cycle', interval: 0.36 },
          { enemy: 'margin_call', count: 7, lane: 'random', interval: 0.62, delay: 0.55 },
          { enemy: 'chase_zombie', count: 7, lane: 'cycle', interval: 0.65, delay: 0.9 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.88, delay: 0.35, elite: true },
          { enemy: 'leverage_fiend', count: 3, lane: 'random', interval: 1.1, delay: 1.4 },
          { enemy: 'halt_seal', count: 6, lane: 'cycle', interval: 0.68, delay: 0.9 },
          { enemy: 'dark_tape', count: 9, lane: 'random', interval: 0.36, delay: 0.7 },
        ]),
        wavePack([
          { enemy: 'rumor_swarm', count: 14, lane: 'cycle', interval: 0.25 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.52, delay: 0.45 },
          { enemy: 'black_swan', count: 1, lane: 1, interval: 0, delay: 3.2 },
          { enemy: 'halt_seal', count: 5, lane: 'cycle', interval: 0.7, delay: 1.0 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.8 },
          { enemy: 'dark_tape', count: 12, lane: 'random', interval: 0.32, delay: 0.3 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 0.92, delay: 0.9, elite: true },
          { enemy: 'chase_zombie', count: 7, lane: 'random', interval: 0.55, delay: 0.65 },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 8, lane: 'cycle', interval: 0.5 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.48, delay: 0.4 },
          { enemy: 'circuit_swan', count: 1, lane: 2, interval: 0, delay: 2.8 },
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.82, delay: 1.1 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 16, lane: 'cycle', interval: 0.25 },
          { enemy: 'dark_tape', count: 13, lane: 'random', interval: 0.28, delay: 0.2 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 0.88, delay: 0.85 },
          { enemy: 'rumor_swarm', count: 12, lane: 'random', interval: 0.24, delay: 0.25 },
          { enemy: 'halt_seal', count: 7, lane: 'cycle', interval: 0.55, delay: 0.7 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.72 },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.27, delay: 0.25 },
          { enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 2.5 },
          { enemy: 'black_swan', count: 1, lane: 3, interval: 0, delay: 4.8 },
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.46, delay: 0.45 },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.42 },
          { enemy: 'panic_board', count: 7, lane: 'random', interval: 0.65, delay: 0.25 },
          { enemy: 'leverage_fiend', count: 5, lane: 'cycle', interval: 0.82, delay: 0.65, elite: true },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.26, delay: 0.35 },
          { enemy: 'black_swan', count: 1, lane: 1, interval: 0, delay: 1.8 },
          { enemy: 'circuit_swan', count: 1, lane: 2, interval: 0, delay: 3.6 },
          { enemy: 'margin_call', count: 9, lane: 'cycle', interval: 0.42, delay: 0.5 },
          { enemy: 'chase_zombie', count: 6, lane: 'random', interval: 0.5, delay: 0.7 },
        ]),
      ],
    },

    {
      id: 11,
      name: '停牌潮夜',
      story: '子夜過後，告示欄一夜貼滿臨停——唔再係雙天鵝夾擊，而係停牌潮 simultaneous 湧入。掌櫃熄燈再半盞：先擋符紙潮頭，再軋潮心；鎖倉、鐵衛、逼空齊人，否則銀樓只剩空倉同空城。',
      challenge: true,
      startSilver: 360,
      coreHp: 390,
      unlockHeroes: Object.keys(HEROES),
      firstClearBonus: 340,
      waves: [
        wavePack([
          { enemy: 'halt_seal', count: 8, lane: 'cycle', interval: 0.55 },
          { enemy: 'retail_tide', count: 14, lane: 'random', interval: 0.3, delay: 0.35 },
          { enemy: 'rumor_swarm', count: 10, lane: 'cycle', interval: 0.28, delay: 0.4 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 12, lane: 'cycle', interval: 0.34 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.58, delay: 0.5 },
          { enemy: 'halt_seal', count: 7, lane: 'cycle', interval: 0.6, delay: 0.8 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.85, delay: 0.3, elite: true },
          { enemy: 'leverage_fiend', count: 3, lane: 'random', interval: 1.05, delay: 1.2 },
          { enemy: 'halt_seal', count: 8, lane: 'cycle', interval: 0.55, delay: 0.7 },
          { enemy: 'dark_tape', count: 10, lane: 'random', interval: 0.34, delay: 0.6 },
        ]),
        wavePack([
          { enemy: 'rumor_swarm', count: 14, lane: 'cycle', interval: 0.24 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.5, delay: 0.4 },
          { enemy: 'black_swan', count: 1, lane: 2, interval: 0, delay: 3.0 },
          { enemy: 'halt_seal', count: 6, lane: 'cycle', interval: 0.65, delay: 0.9 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.78 },
          { enemy: 'dark_tape', count: 12, lane: 'random', interval: 0.3, delay: 0.25 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 0.9, delay: 0.85, elite: true },
          { enemy: 'halt_seal', count: 9, lane: 'random', interval: 0.48, delay: 0.5 },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.42 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.46, delay: 0.35 },
          { enemy: 'circuit_swan', count: 1, lane: 1, interval: 0, delay: 2.6 },
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.8, delay: 1.0 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 16, lane: 'cycle', interval: 0.24 },
          { enemy: 'dark_tape', count: 13, lane: 'random', interval: 0.27, delay: 0.2 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 0.86, delay: 0.8 },
          { enemy: 'halt_seal', count: 10, lane: 'random', interval: 0.4, delay: 0.35 },
          { enemy: 'rumor_swarm', count: 12, lane: 'cycle', interval: 0.22, delay: 0.25 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.7 },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.26, delay: 0.2 },
          { enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 2.4 },
          { enemy: 'halt_seal', count: 8, lane: 'cycle', interval: 0.5, delay: 0.55 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.44, delay: 0.4 },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 12, lane: 'cycle', interval: 0.38 },
          { enemy: 'panic_board', count: 7, lane: 'random', interval: 0.62, delay: 0.22 },
          { enemy: 'leverage_fiend', count: 5, lane: 'cycle', interval: 0.8, delay: 0.6, elite: true },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.25, delay: 0.3 },
          { enemy: 'halt_tide', count: 1, lane: 2, interval: 0, delay: 2.0 },
          { enemy: 'margin_call', count: 9, lane: 'cycle', interval: 0.4, delay: 0.45 },
          { enemy: 'chase_zombie', count: 6, lane: 'random', interval: 0.48, delay: 0.65 },
        ]),
      ],
    },



    {
      id: 12,
      name: '三潮同場',
      story: '開市鐘三響——黑羽、金邊、臨停潮同時壓境。掌櫃只留一盞燈：今夜唔係單 Boss，係三潮同場。先鎖倉減攻，再分路收割；齊人羈絆開波，否則銀樓只剩空帳。',
      challenge: true,
      startSilver: 372,
      coreHp: 402,
      unlockHeroes: Object.keys(HEROES),
      firstClearBonus: 380,
      waves: [
        wavePack([
          { enemy: 'halt_seal', count: 8, lane: 'cycle', interval: 0.52 },
          { enemy: 'retail_tide', count: 14, lane: 'random', interval: 0.28, delay: 0.3 },
          { enemy: 'rumor_swarm', count: 11, lane: 'cycle', interval: 0.26, delay: 0.35 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 12, lane: 'cycle', interval: 0.32 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.55, delay: 0.45 },
          { enemy: 'halt_seal', count: 8, lane: 'cycle', interval: 0.55, delay: 0.7 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.82, delay: 0.28, elite: true },
          { enemy: 'leverage_fiend', count: 3, lane: 'random', interval: 1.0, delay: 1.1 },
          { enemy: 'black_swan', count: 1, lane: 1, interval: 0, delay: 2.8 },
          { enemy: 'dark_tape', count: 10, lane: 'random', interval: 0.32, delay: 0.55 },
        ]),
        wavePack([
          { enemy: 'rumor_swarm', count: 14, lane: 'cycle', interval: 0.22 },
          { enemy: 'margin_call', count: 9, lane: 'random', interval: 0.48, delay: 0.35 },
          { enemy: 'circuit_swan', count: 1, lane: 2, interval: 0, delay: 2.5 },
          { enemy: 'halt_seal', count: 7, lane: 'cycle', interval: 0.58, delay: 0.8 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.75 },
          { enemy: 'dark_tape', count: 13, lane: 'random', interval: 0.28, delay: 0.22 },
          { enemy: 'halt_tide', count: 1, lane: 0, interval: 0, delay: 2.4 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 0.88, delay: 0.8, elite: true },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.4 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.44, delay: 0.3 },
          { enemy: 'black_swan', count: 1, lane: 3, interval: 0, delay: 2.2 },
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.78, delay: 0.9 },
        ]),
        wavePack([
          { enemy: 'retail_tide', count: 16, lane: 'cycle', interval: 0.22 },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.25, delay: 0.18 },
          { enemy: 'circuit_swan', count: 1, lane: 1, interval: 0, delay: 2.0 },
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.38, delay: 0.3 },
          { enemy: 'rumor_swarm', count: 12, lane: 'random', interval: 0.22, delay: 0.2 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.68 },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.24, delay: 0.18 },
          { enemy: 'halt_tide', count: 1, lane: 2, interval: 0, delay: 2.0 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 0.84, delay: 0.7 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.42, delay: 0.35 },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 12, lane: 'cycle', interval: 0.36 },
          { enemy: 'panic_board', count: 7, lane: 'random', interval: 0.6, delay: 0.2 },
          { enemy: 'leverage_fiend', count: 5, lane: 'cycle', interval: 0.78, delay: 0.55, elite: true },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.24, delay: 0.25 },
          { enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 1.5 },
          { enemy: 'circuit_swan', count: 1, lane: 2, interval: 0, delay: 3.0 },
          { enemy: 'halt_tide', count: 1, lane: 3, interval: 0, delay: 4.5 },
          { enemy: 'margin_call', count: 9, lane: 'cycle', interval: 0.38, delay: 0.4 },
          { enemy: 'chase_zombie', count: 6, lane: 'random', interval: 0.46, delay: 0.6 },
        ]),
      ],
    },

    {
      id: 13,
      name: '墨影翻帳',
      story:
        '三潮之後帳本未合——墨影從裂縫滲出，暗盤影成群護帳。\n\n' +
        '今夜只打一潮：護住銀袋，先清影再軋帳心。鎖倉居士減抽、鐵衛頂前；合到 2–3 星再開波。\n\n' +
        '中段會見弱化墨影試探，末波正式翻帳——銀兩唔好堆住等人抽。',
      banner: {
        tag: '墨影潮',
        threat: '抽銀／降攻',
        beats: ['暗盤護帳', '弱化墨影試探', '正式翻帳壓軸'],
        tip: '鎖倉減抽 · 鐵衛頂前 · 合星回補',
      },
      challenge: true,
      startSilver: 420,
      coreHp: 445,
      unlockHeroes: Object.keys(HEROES),
      firstClearBonus: 440,
      waves: [
        wavePack([
          { enemy: 'dark_tape', count: 10, lane: 'cycle', interval: 0.36 },
          { enemy: 'retail_tide', count: 12, lane: 'random', interval: 0.3, delay: 0.25 },
          { enemy: 'rumor_swarm', count: 9, lane: 'cycle', interval: 0.28, delay: 0.4 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 12, lane: 'cycle', interval: 0.3 },
          { enemy: 'halt_seal', count: 7, lane: 'random', interval: 0.55, delay: 0.5 },
          { enemy: 'margin_call', count: 7, lane: 'cycle', interval: 0.55, delay: 0.7 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.85, delay: 0.3, elite: true },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.26, delay: 0.2 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 1.0, delay: 1.0 },
        ]),
        wavePack([
          { enemy: 'rumor_swarm', count: 12, lane: 'cycle', interval: 0.24 },
          { enemy: 'dark_tape', count: 13, lane: 'random', interval: 0.28, delay: 0.2 },
          { enemy: 'halt_seal', count: 8, lane: 'cycle', interval: 0.5, delay: 0.6 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.48, delay: 0.4 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.78 },
          { enemy: 'dark_tape', count: 15, lane: 'random', interval: 0.24, delay: 0.18 },
          { enemy: 'ink_specter', count: 1, lane: 2, interval: 0, delay: 3.2, hpMul: 0.82 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 0.9, delay: 0.8, elite: true },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 9, lane: 'cycle', interval: 0.42 },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.26, delay: 0.2 },
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.8, delay: 0.5 },
          { enemy: 'chase_zombie', count: 8, lane: 'random', interval: 0.4, delay: 0.35 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 16, lane: 'cycle', interval: 0.22 },
          { enemy: 'rumor_swarm', count: 12, lane: 'random', interval: 0.24, delay: 0.18 },
          { enemy: 'margin_call', count: 9, lane: 'cycle', interval: 0.42, delay: 0.3 },
          { enemy: 'ink_specter', count: 1, lane: 1, interval: 0, delay: 2.8, hpMul: 0.92 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.7 },
          { enemy: 'dark_tape', count: 15, lane: 'random', interval: 0.22, delay: 0.15 },
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.38, delay: 0.35 },
          { enemy: 'leverage_fiend', count: 4, lane: 'random', interval: 0.85, delay: 0.6, elite: true },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 16, lane: 'cycle', interval: 0.2 },
          { enemy: 'panic_board', count: 7, lane: 'random', interval: 0.62, delay: 0.2 },
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.36, delay: 0.3 },
          { enemy: 'margin_call', count: 9, lane: 'random', interval: 0.4, delay: 0.35 },
          { enemy: 'ink_specter', count: 1, lane: 2, interval: 0, delay: 2.0, hpMul: 1.08 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 0.8, delay: 0.55, elite: true },
          { enemy: 'chase_zombie', count: 8, lane: 'random', interval: 0.42, delay: 0.5 },
        ]),
      ],
    },

    {
      id: 14,
      name: '雙墨夜帳',
      story:
        '翻帳未盡，第二帳從裂縫並肩翻開——雙墨同場，銀袋兩頭抽。\n\n' +
        '分路口訣：左帳（上線）鐵衛＋鎖倉減抽；右帳（下線）第二鐵衛／刀客清影。\n\n' +
        '護銀分路，先清暗盤再開合星階梯回補。末波兩帳分先後入場——唔好兩邊都空。',
      banner: {
        tag: '雙墨夜',
        threat: '雙路抽銀',
        beats: ['左帳上線', '右帳下線', '末波分先後入場'],
        tip: '兩邊唔好都空 · 合星階梯回補',
      },
      challenge: true,
      startSilver: 435,
      coreHp: 462,
      unlockHeroes: Object.keys(HEROES),
      firstClearBonus: 480,
      waves: [
        wavePack([
          { enemy: 'dark_tape', count: 11, lane: 'cycle', interval: 0.34 },
          { enemy: 'retail_tide', count: 12, lane: 'random', interval: 0.28, delay: 0.2 },
          { enemy: 'rumor_swarm', count: 10, lane: 'cycle', interval: 0.26, delay: 0.35 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 13, lane: 'cycle', interval: 0.28 },
          { enemy: 'halt_seal', count: 8, lane: 'random', interval: 0.5, delay: 0.45 },
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.5, delay: 0.6 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.8, delay: 0.25, elite: true },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.24, delay: 0.18 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 0.95, delay: 0.9 },
        ]),
        wavePack([
          { enemy: 'rumor_swarm', count: 12, lane: 'cycle', interval: 0.22 },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.26, delay: 0.18 },
          { enemy: 'halt_seal', count: 9, lane: 'cycle', interval: 0.46, delay: 0.5 },
          { enemy: 'margin_call', count: 8, lane: 'random', interval: 0.46, delay: 0.35 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.72 },
          { enemy: 'dark_tape', count: 15, lane: 'random', interval: 0.22, delay: 0.15 },
          { enemy: 'ink_specter', count: 1, lane: 1, interval: 0, delay: 3.0, hpMul: 0.78 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 0.88, delay: 0.75, elite: true },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.4 },
          { enemy: 'dark_tape', count: 15, lane: 'random', interval: 0.24, delay: 0.18 },
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.75, delay: 0.45 },
          { enemy: 'chase_zombie', count: 9, lane: 'random', interval: 0.38, delay: 0.3 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 16, lane: 'cycle', interval: 0.2 },
          { enemy: 'rumor_swarm', count: 13, lane: 'random', interval: 0.22, delay: 0.15 },
          { enemy: 'margin_call', count: 10, lane: 'cycle', interval: 0.4, delay: 0.28 },
          { enemy: 'ink_specter', count: 1, lane: 2, interval: 0, delay: 2.6, hpMul: 0.88 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.68 },
          { enemy: 'dark_tape', count: 16, lane: 'random', interval: 0.2, delay: 0.12 },
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.36, delay: 0.3 },
          { enemy: 'leverage_fiend', count: 4, lane: 'random', interval: 0.8, delay: 0.55, elite: true },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 17, lane: 'cycle', interval: 0.18 },
          { enemy: 'panic_board', count: 7, lane: 'random', interval: 0.58, delay: 0.18 },
          { enemy: 'halt_seal', count: 11, lane: 'cycle', interval: 0.34, delay: 0.28 },
          { enemy: 'margin_call', count: 10, lane: 'random', interval: 0.38, delay: 0.3 },
          { enemy: 'ink_specter', count: 1, lane: 1, interval: 0, delay: 1.8, hpMul: 1.0, inkTag: '左帳' },
          { enemy: 'ink_specter', count: 1, lane: 3, interval: 0, delay: 4.6, hpMul: 1.05, inkTag: '右帳' },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 0.75, delay: 0.5, elite: true },
          { enemy: 'chase_zombie', count: 8, lane: 'random', interval: 0.4, delay: 0.45 },
        ]),
      ],
    },

    {
      id: 15,
      name: '帳鏡夜市',
      story:
        '雙墨未散，帳本對摺成鏡——帳鏡蜃倒映銀樓，假帳同真庫一齊晃。\n\n' +
        '鏡稅封庫時，擊殺銀兩縮水、合星回報短暫凍結；趁空檔合星，鎖倉減抽、鐵衛頂前。\n\n' +
        '中段墨影試探，末波帳鏡蜃壓軸；銀兩唔好堆住等人抽，亦唔好喺鏡稅窗硬合。',
      banner: {
        tag: '帳鏡潮',
        threat: '鏡稅封庫',
        beats: ['暗盤／墨影試探', '鏡稅空檔合星', '帳鏡蜃壓軸'],
        tip: '鐵衛頂前 · 鎖倉減抽 · 鏡稅空檔合星',
      },
      challenge: true,
      startSilver: 448,
      coreHp: 478,
      unlockHeroes: Object.keys(HEROES),
      firstClearBonus: 520,
      waves: [
        wavePack([
          { enemy: 'dark_tape', count: 12, lane: 'cycle', interval: 0.32 },
          { enemy: 'retail_tide', count: 12, lane: 'random', interval: 0.28, delay: 0.2 },
          { enemy: 'rumor_swarm', count: 10, lane: 'cycle', interval: 0.26, delay: 0.35 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 13, lane: 'cycle', interval: 0.28 },
          { enemy: 'halt_seal', count: 8, lane: 'random', interval: 0.48, delay: 0.4 },
          { enemy: 'margin_call', count: 8, lane: 'cycle', interval: 0.48, delay: 0.55 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.78, delay: 0.25, elite: true },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.24, delay: 0.16 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 0.92, delay: 0.85 },
        ]),
        wavePack([
          { enemy: 'rumor_swarm', count: 13, lane: 'cycle', interval: 0.22 },
          { enemy: 'dark_tape', count: 14, lane: 'random', interval: 0.24, delay: 0.16 },
          { enemy: 'halt_seal', count: 9, lane: 'cycle', interval: 0.44, delay: 0.45 },
          { enemy: 'margin_call', count: 9, lane: 'random', interval: 0.44, delay: 0.32 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.7 },
          { enemy: 'dark_tape', count: 15, lane: 'random', interval: 0.22, delay: 0.14 },
          { enemy: 'ink_specter', count: 1, lane: 2, interval: 0, delay: 3.0, hpMul: 0.8 },
          { enemy: 'leverage_fiend', count: 3, lane: 'cycle', interval: 0.86, delay: 0.7, elite: true },
        ]),
        wavePack([
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.4 },
          { enemy: 'dark_tape', count: 15, lane: 'random', interval: 0.22, delay: 0.16 },
          { enemy: 'panic_board', count: 5, lane: 'cycle', interval: 0.72, delay: 0.4 },
          { enemy: 'chase_zombie', count: 9, lane: 'random', interval: 0.38, delay: 0.28 },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 16, lane: 'cycle', interval: 0.2 },
          { enemy: 'rumor_swarm', count: 13, lane: 'random', interval: 0.22, delay: 0.14 },
          { enemy: 'margin_call', count: 10, lane: 'cycle', interval: 0.4, delay: 0.26 },
          { enemy: 'ink_specter', count: 1, lane: 1, interval: 0, delay: 2.5, hpMul: 0.9 },
        ]),
        wavePack([
          { enemy: 'panic_board', count: 6, lane: 'cycle', interval: 0.66 },
          { enemy: 'dark_tape', count: 16, lane: 'random', interval: 0.2, delay: 0.12 },
          { enemy: 'halt_seal', count: 10, lane: 'cycle', interval: 0.36, delay: 0.28 },
          { enemy: 'leverage_fiend', count: 4, lane: 'random', interval: 0.8, delay: 0.5, elite: true },
        ]),
        wavePack([
          { enemy: 'dark_tape', count: 17, lane: 'cycle', interval: 0.18 },
          { enemy: 'panic_board', count: 7, lane: 'random', interval: 0.56, delay: 0.16 },
          { enemy: 'halt_seal', count: 11, lane: 'cycle', interval: 0.34, delay: 0.26 },
          { enemy: 'margin_call', count: 10, lane: 'random', interval: 0.36, delay: 0.28 },
          { enemy: 'ink_specter', count: 1, lane: 0, interval: 0, delay: 1.6, hpMul: 0.95, inkTag: '左帳' },
          { enemy: 'ledger_mirage', count: 1, lane: 2, interval: 0, delay: 3.8, hpMul: 1.05 },
          { enemy: 'leverage_fiend', count: 4, lane: 'cycle', interval: 0.74, delay: 0.48, elite: true },
          { enemy: 'chase_zombie', count: 8, lane: 'random', interval: 0.4, delay: 0.42 },
        ]),
      ],
    },

  ];

  const ENDLESS = {
    id: 'endless',
    name: '無盡殺跌',
    story: '殺跌無盡，浪高過浪。里程碑銀兩係你唯一嘅喘息；修飾詞會改寫盤口——守得愈久，江湖傳聞愈響，亦愈難轉身離場。\n\nv3.6：300＋第八池；雙五潮橫幅；鏡稅叠層 HUD；牆史匯入；教學箭嘴。',
    startSilver: 215,
    coreHp: 235,
    unlockHeroes: Object.keys(HEROES),
  };

  /** 波次結束補銀（關卡／無盡分開） */
  function waveClearBonus(waveIndex, endless) {
    if (endless) {
      // v3.0：前期略甜；100+ 補銀略增以對沖雙墨抽銀
      let b = 18 + waveIndex * 6.5 + Math.min(40, waveIndex * 1.2);
      if (waveIndex >= 100) b += 8 + Math.min(18, (waveIndex - 100) * 0.35);
      if (waveIndex >= 130) b += 6;
      if (waveIndex >= 140) b += 8;
      if (waveIndex >= 150) b += 10;
      if (waveIndex >= 160) b += 12;
      if (waveIndex >= 180) b += 14;
      if (waveIndex >= 200) b += 16;
      if (waveIndex >= 220) b += 18;
      if (waveIndex >= 250) b += 20;
      if (waveIndex >= 300) b += 24;
      return Math.round(b);
    }
    return 26 + waveIndex * 8;
  }

  /** 無盡里程碑獎勵（銀兩）；同一局只領一次 */
  const ENDLESS_MILESTONES = [
    { wave: 5, silver: 40, label: '五浪過關' },
    { wave: 10, silver: 80, label: '十浪長牛' },
    { wave: 15, silver: 120, label: '十五浪硬頂' },
    { wave: 20, silver: 180, label: '廿浪封神' },
    { wave: 30, silver: 260, label: '三十浪傳說' },
    { wave: 40, silver: 340, label: '四十浪三潮' },
    { wave: 50, silver: 420, label: '五十浪潮守' },
    { wave: 60, silver: 520, label: '六十浪四潮' },
    { wave: 75, silver: 700, label: '七十五浪硬頂' },
    { wave: 90, silver: 820, label: '九十浪長城' },
    { wave: 100, silver: 1000, label: '百浪墨城' },
    { wave: 110, silver: 1150, label: '百十浪帳守' },
    { wave: 120, silver: 1350, label: '百廿浪雙墨' },
    { wave: 130, silver: 1550, label: '百卅浪長帳' },
    { wave: 140, silver: 1800, label: '百四十浪長城' },
    { wave: 150, silver: 2100, label: '百五十浪鏡城' },
    { wave: 160, silver: 2400, label: '百六十浪五潮城' },
    { wave: 180, silver: 2800, label: '百八十浪長城' },
    { wave: 200, silver: 3200, label: '二百浪封城' },
    { wave: 220, silver: 3600, label: '二百二十浪潮城' },
    { wave: 250, silver: 4200, label: '二百五十浪封神' },
    { wave: 300, silver: 5000, label: '三百浪不朽城' },
    { wave: 350, silver: 5800, label: '三百五十浪九池城' },
    { wave: 400, silver: 6600, label: '四百浪十池城' },
    { wave: 450, silver: 7400, label: '四百五十浪十一池' },
    { wave: 500, silver: 8200, label: '五百浪封池城' },
    { wave: 550, silver: 9000, label: '五百五十浪十二池' },
    { wave: 600, silver: 9800, label: '六百浪不朽池' },
    { wave: 650, silver: 10600, label: '六百五十浪十三池' },
    { wave: 700, silver: 11400, label: '七百浪長池' },
    { wave: 750, silver: 12200, label: '七百五十浪十四池' },
    { wave: 800, silver: 13000, label: '八百浪終池' },
    { wave: 850, silver: 13800, label: '八百五十浪十五池' },
    { wave: 900, silver: 14600, label: '九百浪長池城' },
    { wave: 950, silver: 15400, label: '九百五十浪十六池' },
    { wave: 1000, silver: 16200, label: '千浪不朽城' },
    { wave: 1050, silver: 17000, label: '千五十浪十七池' },
    { wave: 1100, silver: 17800, label: '千百浪長城' },
    { wave: 1150, silver: 18600, label: '千百五十浪十八池' },
    { wave: 1200, silver: 19400, label: '千二百浪不朽池' },
    { wave: 1250, silver: 20200, label: '千二百五十浪十九池' },
    { wave: 1300, silver: 21000, label: '千三百浪穹頂池' },
    { wave: 1350, silver: 21800, label: '千三百五十浪二十池' },
    { wave: 1400, silver: 22600, label: '千四百浪永恒池' },
  ];

  function endlessMilestone(waveIndex) {
    return ENDLESS_MILESTONES.find((m) => m.wave === waveIndex) || null;
  }

  /** 開波市況事件（小概率；v1.3） */
  const WAVE_EVENTS = [
    {
      id: 'silver_rain',
      name: '銀雨忽至',
      blurb: '天上掉銅錢 — 銀兩 +28',
      color: '#C9A227',
      weight: 3,
      apply: (state) => {
        state.silver += 30;
      },
    },
    {
      id: 'inner_breath',
      name: '內息回湧',
      blurb: '全體俠客回血 20%',
      color: '#3A7A6A',
      weight: 3,
      apply: (state) => {
        for (const h of state.heroes) {
          if (h.hp <= 0) continue;
          h.hp = Math.min(h.maxHp, h.hp + Math.round(h.maxHp * 0.2));
        }
      },
    },
    {
      id: 'bull_cheer',
      name: '多頭鼓噪',
      blurb: '場上短暫加攻（8 秒）',
      color: '#C45C4A',
      weight: 2,
      apply: (state) => {
        for (const h of state.heroes) {
          if (h.hp <= 0) continue;
          h.atkBuff = Math.max(h.atkBuff || 0, 0.18);
          h.atkBuffT = Math.max(h.atkBuffT || 0, 8);
        }
      },
    },
    {
      id: 'rumor_burst',
      name: '巷口風聲',
      blurb: '額外湧出傳聞蚊 ×4',
      color: '#7A6A50',
      weight: 2,
      apply: (state, Battle) => {
        if (!Battle || !state.spawner) return;
        state.spawner.jobs.push({
          enemy: 'rumor_swarm',
          left: 4,
          interval: 0.45,
          delay: 0.8,
          timer: 0,
          started: false,
          laneMode: 'cycle',
          fixedLane: null,
          hpMul: 1,
          elite: false,
        });
      },
    },
    {
      id: 'halt_notice',
      name: '臨停通告',
      blurb: '停牌符混入本波 ×2',
      color: '#6A5040',
      weight: 2,
      apply: (state) => {
        if (!state.spawner) return;
        state.spawner.jobs.push({
          enemy: 'halt_seal',
          left: 2,
          interval: 0.9,
          delay: 1.6,
          timer: 0,
          started: false,
          laneMode: 'random',
          fixedLane: null,
          hpMul: 1,
          elite: false,
        });
      },
    },
    {
      id: 'dark_seep',
      name: '暗盤滲入',
      blurb: '暗盤影潛入本波 ×3',
      color: '#2A2840',
      weight: 2,
      apply: (state) => {
        if (!state.spawner) return;
        state.spawner.jobs.push({
          enemy: 'dark_tape',
          left: 3,
          interval: 0.7,
          delay: 1.2,
          timer: 0,
          started: false,
          laneMode: 'cycle',
          fixedLane: null,
          hpMul: 1,
          elite: false,
        });
      },
    },
    {
      id: 'blade_oil',
      name: '刀口抹油',
      blurb: '全體俠客攻擊間隔短暫加快（6 秒）',
      color: '#C45C4A',
      weight: 2,
      apply: (state) => {
        for (const h of state.heroes) {
          if (h.hp <= 0) continue;
          h.cd = Math.min(h.cd, 0.05);
          h.upHasteGhost = 6; // 視覺標記用；實際用 atkBuffT 加速感：縮短當下 cd
          h.cd = Math.max(0, h.cd - 0.25);
          // 臨時：降低 cooldown 6 秒
          if (!h._bladeOilLeft) {
            h._bladeOilBaseCd = h.cooldown;
            h.cooldown = Math.max(0.18, h.cooldown * 0.82);
            h._bladeOilLeft = 6;
          } else {
            h._bladeOilLeft = Math.max(h._bladeOilLeft, 6);
          }
        }
      },
    },
    {
      id: 'triple_tide',
      name: '三潮同場',
      blurb: '黑羽＋金邊＋臨停潮短時壓境',
      color: '#C45C4A',
      weight: 1,
      apply: (state) => {
        if (!state.spawner) return;
        const jobs = [
          { enemy: 'black_swan', left: 1, interval: 0, delay: 1.2, laneMode: 'fixed', fixedLane: 0 },
          { enemy: 'circuit_swan', left: 1, interval: 0, delay: 2.6, laneMode: 'fixed', fixedLane: 2 },
          { enemy: 'halt_tide', left: 1, interval: 0, delay: 4.0, laneMode: 'fixed', fixedLane: 3 },
        ];
        for (const j of jobs) {
          state.spawner.jobs.push({
            enemy: j.enemy,
            left: j.left,
            interval: j.interval,
            delay: j.delay,
            timer: 0,
            started: false,
            laneMode: j.laneMode,
            fixedLane: j.fixedLane,
            hpMul: 0.92,
            elite: false,
          });
        }
        state._tripleTideEvent = (state._tripleTideEvent || 0) + 1;
      },
    },
    {
      id: 'halt_drizzle',
      name: '臨停細雨',
      blurb: '停牌符零星飄落 ×3',
      color: '#C4A070',
      weight: 2,
      apply: (state) => {
        if (!state.spawner) return;
        state.spawner.jobs.push({
          enemy: 'halt_seal',
          left: 3,
          interval: 0.55,
          delay: 0.9,
          timer: 0,
          started: false,
          laneMode: 'cycle',
          fixedLane: null,
          hpMul: 1,
          elite: false,
        });
        state._haltDrizzle = (state._haltDrizzle || 0) + 1;
      },
    },
    {
      id: 'ink_seep',
      name: '墨影滲帳',
      blurb: '墨影帳短時壓境（弱化）＋暗盤 ×2',
      color: '#2A3040',
      weight: 1,
      apply: (state) => {
        if (!state.spawner) return;
        state.spawner.jobs.push({
          enemy: 'ink_specter',
          left: 1,
          interval: 0,
          delay: 2.0,
          timer: 0,
          started: false,
          laneMode: 'fixed',
          fixedLane: 2,
          hpMul: 0.72,
          elite: false,
        });
        state.spawner.jobs.push({
          enemy: 'dark_tape',
          left: 2,
          interval: 0.55,
          delay: 0.8,
          timer: 0,
          started: false,
          laneMode: 'cycle',
          fixedLane: null,
          hpMul: 1,
          elite: false,
        });
        state._inkSeep = (state._inkSeep || 0) + 1;
      },
    },
    {
      id: 'feather_warn',
      name: '雙羽預警',
      blurb: '黑羽與金邊短時壓境（弱化）',
      color: '#C9A227',
      weight: 1,
      apply: (state) => {
        if (!state.spawner) return;
        state.spawner.jobs.push({
          enemy: 'black_swan',
          left: 1,
          interval: 0,
          delay: 1.4,
          timer: 0,
          started: false,
          laneMode: 'fixed',
          fixedLane: 0,
          hpMul: 0.78,
          elite: false,
        });
        state.spawner.jobs.push({
          enemy: 'circuit_swan',
          left: 1,
          interval: 0,
          delay: 3.0,
          timer: 0,
          started: false,
          laneMode: 'fixed',
          fixedLane: 2,
          hpMul: 0.78,
          elite: false,
        });
        state._featherWarn = (state._featherWarn || 0) + 1;
      },
    },
  ];

  function pickWaveEvent(rng) {
    const r = typeof rng === 'function' ? rng : Math.random;
    // 約 32% 觸發（第 1 波唔出，由呼叫方控制）
    if (r() > 0.32) return null;
    let total = 0;
    for (const e of WAVE_EVENTS) total += e.weight || 1;
    let roll = r() * total;
    for (const e of WAVE_EVENTS) {
      roll -= e.weight || 1;
      if (roll <= 0) return e;
    }
    return WAVE_EVENTS[0];
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
    {
      id: 'vault_echo',
      name: '銀庫回聲',
      blurb: '敵賞金 +10%；核心 HP −4%',
      apply: (ctx) => {
        ctx.rewardMul = (ctx.rewardMul || 1) * 1.1;
        ctx.coreMul = (ctx.coreMul || 1) * 0.96;
      },
    },
    {
      id: 'calm_tape',
      name: '靜盤緩行',
      blurb: '敵人移速 −8%',
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.92;
      },
    },
    {
      id: 'star_packet',
      name: '升星紅包',
      blurb: '合併回報 ×1.28；開局銀 +6%',
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.28;
        ctx.silverMul = (ctx.silverMul || 1) * 1.06;
      },
    },
    {
      id: 'seal_tide',
      name: '鎖潮加印',
      blurb: '鎖倉持續 ×1.22；俠客冷卻 −5%',
      apply: (ctx) => {
        ctx.lockDurMul = (ctx.lockDurMul || 1) * 1.22;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.95;
      },
    },
    {
      id: 'ink_reserve',
      name: '墨庫備用',
      blurb: '開局銀 +12%；召喚費 −4%',
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.12;
        ctx.summonCostMul = (ctx.summonCostMul || 1) * 0.96;
      },
    },
    {
      id: 'soft_landing',
      name: '軟著陸',
      blurb: '核心 HP +10%；敵賞金 −6%',
      apply: (ctx) => {
        ctx.coreMul = (ctx.coreMul || 1) * 1.1;
        ctx.rewardMul = (ctx.rewardMul || 1) * 0.94;
      },
    },
    {
      id: 'open_auction',
      name: '開年競價',
      blurb: '合併回報 ×1.22；敵速 +5%',
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.22;
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 1.05;
      },
    },
    {
      id: 'tide_watch',
      name: '潮守加厚',
      blurb: '核心 HP +7%；鎖倉持續 ×1.12',
      apply: (ctx) => {
        ctx.coreMul = (ctx.coreMul || 1) * 1.07;
        ctx.lockDurMul = (ctx.lockDurMul || 1) * 1.12;
      },
    },
    {
      id: 'merge_spark',
      name: '合星火花',
      blurb: '合併回報 ×1.18；俠客冷卻 −4%',
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.18;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.96;
      },
    },
  ];

  /** 無盡 90+ 專屬修飾（曾達 90 浪後開無盡必帶其一） */
  const RUN_MODIFIERS_90 = [
    {
      id: 'ink_ward',
      name: '墨衛護銀',
      blurb: '核心 HP +9%；墨影抽銀 ×0.55',
      late90: true,
      apply: (ctx) => {
        ctx.coreMul = (ctx.coreMul || 1) * 1.09;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.55;
      },
    },
    {
      id: 'ledger_seal',
      name: '帳印鎖倉',
      blurb: '鎖倉持續 ×1.18；合併回報 ×1.14',
      late90: true,
      apply: (ctx) => {
        ctx.lockDurMul = (ctx.lockDurMul || 1) * 1.18;
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.14;
      },
    },
    {
      id: 'ninety_bastion',
      name: '九十堡壘',
      blurb: '核心 HP +12%；敵人移速 −5%',
      late90: true,
      apply: (ctx) => {
        ctx.coreMul = (ctx.coreMul || 1) * 1.12;
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.95;
      },
    },
    {
      id: 'blot_tax',
      name: '墨稅緩徵',
      blurb: '墨影抽銀 ×0.7；波次補銀 +8%',
      late90: true,
      apply: (ctx) => {
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.7;
        ctx.waveBonusMul = (ctx.waveBonusMul || 1) * 1.08;
      },
    },
  ];

  /** 無盡 100+ 專屬修飾第二池 */
  const RUN_MODIFIERS_100 = [
    {
      id: 'century_vault',
      name: '百浪銀庫',
      blurb: '開局銀 +14%；核心 HP +8%',
      late100: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.14;
        ctx.coreMul = (ctx.coreMul || 1) * 1.08;
      },
    },
    {
      id: 'ink_mirror',
      name: '墨鏡反照',
      blurb: '墨影抽銀 ×0.4；俠客冷卻 −5%',
      late100: true,
      apply: (ctx) => {
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.4;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.95;
      },
    },
    {
      id: 'star_cascade',
      name: '合星連瀑',
      blurb: '合併回報 ×1.26；召喚費 −5%',
      late100: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.26;
        ctx.summonCostMul = (ctx.summonCostMul || 1) * 0.95;
      },
    },
    {
      id: 'ledger_fortress',
      name: '帳堡鐵壁',
      blurb: '核心 HP +15%；鎖倉持續 ×1.1',
      late100: true,
      apply: (ctx) => {
        ctx.coreMul = (ctx.coreMul || 1) * 1.15;
        ctx.lockDurMul = (ctx.lockDurMul || 1) * 1.1;
      },
    },
  ];

  /** v3.1：曾達 140 再開無盡必帶其一（第三池） */
  const RUN_MODIFIERS_140 = [
    {
      id: 'great_wall_vault',
      name: '長城銀庫',
      blurb: '開局銀 +16%；波次補銀 +10%',
      late140: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.16;
        ctx.waveBonusMul = (ctx.waveBonusMul || 1) * 1.1;
      },
    },
    {
      id: 'ink_tax_shield',
      name: '墨稅鐵盾',
      blurb: '墨影抽銀 ×0.35；核心 HP +6%',
      late140: true,
      apply: (ctx) => {
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.35;
        ctx.coreMul = (ctx.coreMul || 1) * 1.06;
      },
    },
    {
      id: 'star_fortress',
      name: '合星堡壘',
      blurb: '合併回報 ×1.3；俠客冷卻 −4%',
      late140: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.3;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.96;
      },
    },
    {
      id: 'tide_anchor',
      name: '潮錨定盤',
      blurb: '敵速 −6%；鎖倉持續 ×1.12',
      late140: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.94;
        ctx.lockDurMul = (ctx.lockDurMul || 1) * 1.12;
      },
    },
  ];

  /** v3.2：曾達 150 再開無盡必帶其一（第四池） */
  const RUN_MODIFIERS_150 = [
    {
      id: 'mirror_vault',
      name: '鏡城銀庫',
      blurb: '開局銀 +18%；波次補銀 +12%',
      late150: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.18;
        ctx.waveBonusMul = (ctx.waveBonusMul || 1) * 1.12;
      },
    },
    {
      id: 'anti_mirage',
      name: '破鏡護銀',
      blurb: '墨影／鏡稅抽銀 ×0.32；核心 +5%',
      late150: true,
      apply: (ctx) => {
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.32;
        ctx.coreMul = (ctx.coreMul || 1) * 1.05;
      },
    },
    {
      id: 'star_mirror',
      name: '合星破蜃',
      blurb: '合併回報 ×1.32；俠客冷卻 −5%',
      late150: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.32;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.95;
      },
    },
    {
      id: 'ledger_anchor',
      name: '帳錨定鏡',
      blurb: '敵速 −7%；鎖倉持續 ×1.14',
      late150: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.93;
        ctx.lockDurMul = (ctx.lockDurMul || 1) * 1.14;
      },
    },
  ];

  /** v3.3：曾達 160 再開無盡必帶其一（第五池／五潮城） */
  const RUN_MODIFIERS_160 = [
    {
      id: 'penta_vault',
      name: '五潮銀庫',
      blurb: '開局銀 +20%；核心 HP +8%',
      late160: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.2;
        ctx.coreMul = (ctx.coreMul || 1) * 1.08;
      },
    },
    {
      id: 'tide_mirror_guard',
      name: '潮鏡鐵衛',
      blurb: '墨影／鏡稅抽銀 ×0.3；敵速 −5%',
      late160: true,
      apply: (ctx) => {
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.3;
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.95;
      },
    },
    {
      id: 'star_penta',
      name: '合星五潮',
      blurb: '合併回報 ×1.34；波次補銀 +8%',
      late160: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.34;
        ctx.waveBonusMul = (ctx.waveBonusMul || 1) * 1.08;
      },
    },
    {
      id: 'lock_penta',
      name: '五印鎖潮',
      blurb: '鎖倉持續 ×1.16；俠客冷卻 −4%',
      late160: true,
      apply: (ctx) => {
        ctx.lockDurMul = (ctx.lockDurMul || 1) * 1.16;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.96;
      },
    },
  ];

  /** v3.4：曾達 180 再開無盡必帶其一（第六池／長城） */
  const RUN_MODIFIERS_180 = [
    {
      id: 'long_wall_vault',
      name: '長城銀庫',
      blurb: '開局銀 +22%；核心 HP +10%',
      late180: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.22;
        ctx.coreMul = (ctx.coreMul || 1) * 1.1;
      },
    },
    {
      id: 'mirror_long_guard',
      name: '長城鏡衛',
      blurb: '鏡稅／墨影抽銀 ×0.25；鎖倉持續 ×1.12',
      late180: true,
      apply: (ctx) => {
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.25;
        ctx.lockDurMul = (ctx.lockDurMul || 1) * 1.12;
      },
    },
    {
      id: 'star_long_wall',
      name: '合星長城',
      blurb: '合併回報 ×1.38；波次補銀 +10%',
      late180: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.38;
        ctx.waveBonusMul = (ctx.waveBonusMul || 1) * 1.1;
      },
    },
    {
      id: 'seal_long_wall',
      name: '長城印陣',
      blurb: '敵速 −6%；俠客冷卻 −5%',
      late180: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.94;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.95;
      },
    },
  ];

  /** v3.5：曾達 220 再開無盡必帶其一（第七池／潮城） */
  const RUN_MODIFIERS_220 = [
    {
      id: 'tide_city_vault',
      name: '潮城銀庫',
      blurb: '開局銀 +24%；核心 HP +11%',
      late220: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.24;
        ctx.coreMul = (ctx.coreMul || 1) * 1.11;
      },
    },
    {
      id: 'dual_mirror_guard',
      name: '雙鏡鐵衛',
      blurb: '鏡稅叠層地板 +0.06；抽銀 ×0.22',
      late220: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.06;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.22;
      },
    },
    {
      id: 'star_tide_city',
      name: '合星潮城',
      blurb: '合併回報 ×1.4；波次補銀 +11%',
      late220: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.4;
        ctx.waveBonusMul = (ctx.waveBonusMul || 1) * 1.11;
      },
    },
    {
      id: 'seal_tide_city',
      name: '潮城印陣',
      blurb: '敵速 −7%；鎖倉持續 ×1.14',
      late220: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.93;
        ctx.lockDurMul = (ctx.lockDurMul || 1) * 1.14;
      },
    },
  ];

  /** v3.6：曾達 300 再開無盡必帶其一（第八池／不朽城） */
  const RUN_MODIFIERS_300 = [
    {
      id: 'immortal_vault',
      name: '不朽銀庫',
      blurb: '開局銀 +26%；核心 HP +12%',
      late300: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.26;
        ctx.coreMul = (ctx.coreMul || 1) * 1.12;
      },
    },
    {
      id: 'immortal_mirror',
      name: '不朽鏡衛',
      blurb: '鏡稅地板 +0.08；抽銀 ×0.2',
      late300: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.08;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.2;
      },
    },
    {
      id: 'star_immortal',
      name: '合星不朽',
      blurb: '合併回報 ×1.42；波次補銀 +12%',
      late300: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.42;
        ctx.waveBonusMul = (ctx.waveBonusMul || 1) * 1.12;
      },
    },
    {
      id: 'seal_immortal',
      name: '不朽印陣',
      blurb: '敵速 −8%；俠客冷卻 −6%',
      late300: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.92;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.94;
      },
    },
  ];

  const RUN_MODIFIERS_350 = [
    {
      id: 'nine_vault',
      name: '九池銀庫',
      blurb: '開局銀 +28%；核心 HP +14%',
      late350: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.28;
        ctx.coreMul = (ctx.coreMul || 1) * 1.14;
      },
    },
    {
      id: 'nine_mirror_seal',
      name: '九池鏡印',
      blurb: '鏡稅地板 +0.1；抽銀 ×0.18',
      late350: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.1;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.18;
      },
    },
    {
      id: 'dual_penta_relic',
      name: '雙五潮飾',
      blurb: '雙五潮時敵速 −10%；合星回報 ×1.2',
      late350: true,
      dualPentaRelic: true,
      apply: (ctx) => {
        ctx.dualPentaEnemySpeedMul = (ctx.dualPentaEnemySpeedMul || 1) * 0.9;
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.2;
      },
    },
    {
      id: 'nine_seal_array',
      name: '九池印陣',
      blurb: '敵速 −9%；俠客冷卻 −7%',
      late350: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.91;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.93;
      },
    },
  ];

  /** 雙五潮專屬符咒／飾品（入場抽 1；遊戲內修飾或 debuff） */
  const DUAL_PENTA_CHARMS = [
    {
      id: 'charm_twin_mirror',
      name: '雙鏡符咒',
      blurb: '鏡稅地板 −0.05（更兇）｜叠層延長',
      kind: 'debuff',
      set: 'mirror',
      apply: (state) => {
        state._dualCharmTaxFloor = (state._dualCharmTaxFloor || 0) - 0.05;
        state._dualCharmTaxExtend = Math.max(state._dualCharmTaxExtend || 1, 1.18);
      },
    },
    {
      id: 'charm_stack_ornament',
      name: '叠帳飾品',
      blurb: '雙五期間敵速 +7%（壓力）',
      kind: 'debuff',
      set: 'mirror',
      apply: (state) => {
        state._dualCharmEnemySpeed = (state._dualCharmEnemySpeed || 1) * 1.07;
      },
    },
    {
      id: 'charm_silver_ward',
      name: '護銀符',
      blurb: '抽銀 ×0.72｜短暫護庫',
      kind: 'buff',
      set: 'ward',
      apply: (state) => {
        state._dualCharmDrainMul = (state._dualCharmDrainMul || 1) * 0.72;
      },
    },
    {
      id: 'charm_merge_seal',
      name: '合星印飾',
      blurb: '合星回報 ×1.25（本潮）',
      kind: 'buff',
      set: 'ward',
      apply: (state) => {
        state._dualCharmMergeMul = (state._dualCharmMergeMul || 1) * 1.25;
      },
    },
    {
      id: 'charm_prism_echo',
      name: '棱鏡回聲',
      blurb: '鏡叠第三件：鏡稅地板 −0.03；叠層延長',
      kind: 'debuff',
      set: 'mirror',
      apply: (state) => {
        state._dualCharmTaxFloor = (state._dualCharmTaxFloor || 0) - 0.03;
        state._dualCharmTaxExtend = Math.max(state._dualCharmTaxExtend || 1, 1.1);
      },
    },
    {
      id: 'charm_vault_knot',
      name: '銀庫結印',
      blurb: '護合第三件：抽銀 ×0.85；核心護盾感',
      kind: 'buff',
      set: 'ward',
      apply: (state) => {
        state._dualCharmDrainMul = (state._dualCharmDrainMul || 1) * 0.85;
      },
    },
  ];

  function pickDualPentaCharm(seed) {
    const pool = DUAL_PENTA_CHARMS;
    if (!pool.length) return null;
    let h = (seed >>> 0) || 1;
    h = (h * 1664525 + 1013904223) >>> 0;
    return pool[h % pool.length];
  }

  const RUN_MODIFIERS_400 = [
    {
      id: 'ten_vault',
      name: '十池銀庫',
      blurb: '開局銀 +30%；核心 HP +15%',
      late400: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.3;
        ctx.coreMul = (ctx.coreMul || 1) * 1.15;
      },
    },
    {
      id: 'ten_mirror_crown',
      name: '十池鏡冠',
      blurb: '鏡稅地板 +0.12；抽銀 ×0.16',
      late400: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.12;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.16;
      },
    },
    {
      id: 'ten_dual_relic',
      name: '十池雙五冠',
      blurb: '雙五敵速 −12%；合星 ×1.28',
      late400: true,
      dualPentaRelic: true,
      apply: (ctx) => {
        ctx.dualPentaEnemySpeedMul = (ctx.dualPentaEnemySpeedMul || 1) * 0.88;
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.28;
      },
    },
    {
      id: 'ten_seal_array',
      name: '十池印陣',
      blurb: '敵速 −10%；俠客冷卻 −8%',
      late400: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.9;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.92;
      },
    },
  ];

  const RUN_MODIFIERS_450 = [
    {
      id: 'eleven_vault',
      name: '十一池銀庫',
      blurb: '開局銀 +32%；核心 HP +16%',
      late450: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.32;
        ctx.coreMul = (ctx.coreMul || 1) * 1.16;
      },
    },
    {
      id: 'eleven_mirror',
      name: '十一池鏡陣',
      blurb: '鏡稅地板 +0.14；抽銀 ×0.14',
      late450: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.14;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.14;
      },
    },
    {
      id: 'eleven_charm_aura',
      name: '十一池符輝',
      blurb: '已裝備符咒效果 ×1.15；合星 ×1.1',
      late450: true,
      apply: (ctx) => {
        ctx.charmPowerMul = (ctx.charmPowerMul || 1) * 1.15;
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.1;
      },
    },
    {
      id: 'eleven_seal',
      name: '十一池印陣',
      blurb: '敵速 −11%；俠客冷卻 −9%',
      late450: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.89;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.91;
      },
    },
  ];

  const RUN_MODIFIERS_550 = [
    {
      id: 'twelve_vault',
      name: '十二池銀庫',
      blurb: '開局銀 +34%；核心 HP +18%',
      late550: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.34;
        ctx.coreMul = (ctx.coreMul || 1) * 1.18;
      },
    },
    {
      id: 'twelve_mirror',
      name: '十二池鏡冕',
      blurb: '鏡稅地板 +0.16；抽銀 ×0.12',
      late550: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.16;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.12;
      },
    },
    {
      id: 'twelve_set_echo',
      name: '十二池套鳴',
      blurb: '符咒套裝共鳴 ×1.2；合星 ×1.12',
      late550: true,
      apply: (ctx) => {
        ctx.charmSetMul = (ctx.charmSetMul || 1) * 1.2;
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.12;
      },
    },
    {
      id: 'twelve_seal',
      name: '十二池印陣',
      blurb: '敵速 −12%；俠客冷卻 −10%',
      late550: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.88;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.9;
      },
    },
  ];

  const RUN_MODIFIERS_650 = [
    {
      id: 'thirteen_vault',
      name: '十三池銀庫',
      blurb: '開局銀 +36%；核心 HP +20%',
      late650: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.36;
        ctx.coreMul = (ctx.coreMul || 1) * 1.2;
      },
    },
    {
      id: 'thirteen_mirror',
      name: '十三池鏡淵',
      blurb: '鏡稅地板 +0.18；抽銀 ×0.1',
      late650: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.18;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.1;
      },
    },
    {
      id: 'thirteen_adv_set',
      name: '十三池進階套',
      blurb: '套裝共鳴 ×1.25；進階共鳴再 ×1.1',
      late650: true,
      apply: (ctx) => {
        ctx.charmSetMul = (ctx.charmSetMul || 1) * 1.25;
        ctx.charmSetAdvMul = (ctx.charmSetAdvMul || 1) * 1.1;
      },
    },
    {
      id: 'thirteen_seal',
      name: '十三池印陣',
      blurb: '敵速 −13%；俠客冷卻 −11%',
      late650: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.87;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.89;
      },
    },
  ];

  const RUN_MODIFIERS_750 = [
    {
      id: 'fourteen_vault',
      name: '十四池銀庫',
      blurb: '開局銀 +38%；核心 HP +22%',
      late750: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.38;
        ctx.coreMul = (ctx.coreMul || 1) * 1.22;
      },
    },
    {
      id: 'fourteen_mirror',
      name: '十四池鏡穹',
      blurb: '鏡稅地板 +0.2；抽銀 ×0.09',
      late750: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.2;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.09;
      },
    },
    {
      id: 'fourteen_badge',
      name: '十四池徽輝',
      blurb: '進階共鳴 ×1.15；合星 ×1.1',
      late750: true,
      apply: (ctx) => {
        ctx.charmSetAdvMul = (ctx.charmSetAdvMul || 1) * 1.15;
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.1;
      },
    },
    {
      id: 'fourteen_seal',
      name: '十四池印陣',
      blurb: '敵速 −14%；俠客冷卻 −12%',
      late750: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.86;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.88;
      },
    },
  ];

  const RUN_MODIFIERS_850 = [
    {
      id: 'fifteen_vault',
      name: '十五池銀庫',
      blurb: '開局銀 +40%；核心 HP +24%',
      late850: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.4;
        ctx.coreMul = (ctx.coreMul || 1) * 1.24;
      },
    },
    {
      id: 'fifteen_mirror',
      name: '十五池鏡穹',
      blurb: '鏡稅地板 +0.22；抽銀 ×0.08',
      late850: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.22;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.08;
      },
    },
    {
      id: 'fifteen_path',
      name: '十五池合脈',
      blurb: '合星 ×1.14；進階共鳴 ×1.12',
      late850: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.14;
        ctx.charmSetAdvMul = (ctx.charmSetAdvMul || 1) * 1.12;
      },
    },
    {
      id: 'fifteen_seal',
      name: '十五池印陣',
      blurb: '敵速 −15%；俠客冷卻 −13%',
      late850: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.85;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.87;
      },
    },
  ];

  const RUN_MODIFIERS_950 = [
    {
      id: 'sixteen_vault',
      name: '十六池銀庫',
      blurb: '開局銀 +42%；核心 HP +26%',
      late950: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.42;
        ctx.coreMul = (ctx.coreMul || 1) * 1.26;
      },
    },
    {
      id: 'sixteen_mirror',
      name: '十六池鏡穹',
      blurb: '鏡稅地板 +0.24；抽銀 ×0.07',
      late950: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.24;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.07;
      },
    },
    {
      id: 'sixteen_snap',
      name: '十六池合吸',
      blurb: '合星 ×1.16；進階共鳴 ×1.14',
      late950: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.16;
        ctx.charmSetAdvMul = (ctx.charmSetAdvMul || 1) * 1.14;
      },
    },
    {
      id: 'sixteen_seal',
      name: '十六池印陣',
      blurb: '敵速 −16%；俠客冷卻 −14%',
      late950: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.84;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.86;
      },
    },
  ];

  const RUN_MODIFIERS_1050 = [
    {
      id: 'seventeen_vault',
      name: '十七池銀庫',
      blurb: '開局銀 +44%；核心 HP +28%',
      late1050: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.44;
        ctx.coreMul = (ctx.coreMul || 1) * 1.28;
      },
    },
    {
      id: 'seventeen_mirror',
      name: '十七池鏡穹',
      blurb: '鏡稅地板 +0.26；抽銀 ×0.06',
      late1050: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.26;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.06;
      },
    },
    {
      id: 'seventeen_slot',
      name: '十七池換欄',
      blurb: '合星 ×1.18；進階共鳴 ×1.16',
      late1050: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.18;
        ctx.charmSetAdvMul = (ctx.charmSetAdvMul || 1) * 1.16;
      },
    },
    {
      id: 'seventeen_seal',
      name: '十七池印陣',
      blurb: '敵速 −17%；俠客冷卻 −15%',
      late1050: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.83;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.85;
      },
    },
  ];

  const RUN_MODIFIERS_1150 = [
    {
      id: 'eighteen_vault',
      name: '十八池銀庫',
      blurb: '開局銀 +46%；核心 HP +30%',
      late1150: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.46;
        ctx.coreMul = (ctx.coreMul || 1) * 1.3;
      },
    },
    {
      id: 'eighteen_mirror',
      name: '十八池鏡穹',
      blurb: '鏡稅地板 +0.28；抽銀 ×0.055',
      late1150: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.28;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.055;
      },
    },
    {
      id: 'eighteen_rot',
      name: '十八池輪換',
      blurb: '合星 ×1.2；進階共鳴 ×1.18',
      late1150: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.2;
        ctx.charmSetAdvMul = (ctx.charmSetAdvMul || 1) * 1.18;
      },
    },
    {
      id: 'eighteen_seal',
      name: '十八池印陣',
      blurb: '敵速 −18%；俠客冷卻 −16%',
      late1150: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.82;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.84;
      },
    },
  ];

  const RUN_MODIFIERS_1250 = [
    {
      id: 'nineteen_vault',
      name: '十九池銀庫',
      blurb: '開局銀 +50%；核心 HP +32%',
      late1250: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.5;
        ctx.coreMul = (ctx.coreMul || 1) * 1.32;
      },
    },
    {
      id: 'nineteen_mirror',
      name: '十九池鏡穹',
      blurb: '鏡稅地板 +0.3；抽銀 ×0.05',
      late1250: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.3;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.05;
      },
    },
    {
      id: 'nineteen_duo',
      name: '十九池雙帥',
      blurb: '合星 ×1.22；進階共鳴 ×1.2',
      late1250: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.22;
        ctx.charmSetAdvMul = (ctx.charmSetAdvMul || 1) * 1.2;
      },
    },
    {
      id: 'nineteen_seal',
      name: '十九池印陣',
      blurb: '敵速 −19%；俠客冷卻 −17%',
      late1250: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.81;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.83;
      },
    },
  ];

  /** 超千浪 Boss 輪換表（每 5 浪單 Boss） */
  const ENDLESS_BOSS_ROT = ['black_swan', 'circuit_swan', 'halt_tide', 'ink_specter', 'ledger_mirage'];
  const ENDLESS_ULTRA_BOSS_ROT = [
    'ledger_mirage',
    'ink_specter',
    'halt_tide',
    'circuit_swan',
    'black_swan',
    'ledger_mirage',
    'ink_specter',
    'halt_tide',
  ];
  /** 超千二多 Boss 同場表（每 10 浪雙帥；每 20 浪三帥） */
  const ENDLESS_DUO_BOSS_PACKS = [
    ['ledger_mirage', 'ink_specter'],
    ['halt_tide', 'circuit_swan'],
    ['black_swan', 'ledger_mirage'],
    ['ink_specter', 'halt_tide'],
    ['circuit_swan', 'black_swan'],
    ['ledger_mirage', 'halt_tide'],
  ];
  const ENDLESS_TRIO_BOSS_PACKS = [
    ['ledger_mirage', 'ink_specter', 'halt_tide'],
    ['circuit_swan', 'black_swan', 'ledger_mirage'],
    ['ink_specter', 'halt_tide', 'circuit_swan'],
    ['black_swan', 'ledger_mirage', 'ink_specter'],
  ];

  const RUN_MODIFIERS_1350 = [
    {
      id: 'twenty_vault',
      name: '二十池銀庫',
      blurb: '開局銀 +54%；核心 HP +34%',
      late1350: true,
      apply: (ctx) => {
        ctx.silverMul = (ctx.silverMul || 1) * 1.54;
        ctx.coreMul = (ctx.coreMul || 1) * 1.34;
      },
    },
    {
      id: 'twenty_mirror',
      name: '二十池鏡穹',
      blurb: '鏡稅地板 +0.32；抽銀 ×0.045',
      late1350: true,
      apply: (ctx) => {
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) + 0.32;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * 0.045;
      },
    },
    {
      id: 'twenty_cadence',
      name: '二十池節拍',
      blurb: '合星 ×1.24；進階共鳴 ×1.22',
      late1350: true,
      apply: (ctx) => {
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * 1.24;
        ctx.charmSetAdvMul = (ctx.charmSetAdvMul || 1) * 1.22;
      },
    },
    {
      id: 'twenty_seal',
      name: '二十池印陣',
      blurb: '敵速 −20%；俠客冷卻 −18%',
      late1350: true,
      apply: (ctx) => {
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * 0.8;
        ctx.heroCdMul = (ctx.heroCdMul || 1) * 0.82;
      },
    },
  ];

  /** 超千三節奏表：按浪輪換 Boss 間距／雜兵密度 */
  const ENDLESS_ULTRA1300_RHYTHM = [
    { id: 'urgent', label: '急鼓', bossGap: 1.15, trashMul: 1.08, intervalAdd: 0.35 },
    { id: 'steady', label: '穩陣', bossGap: 1.45, trashMul: 1.0, intervalAdd: 0.5 },
    { id: 'heavy', label: '重槌', bossGap: 1.85, trashMul: 0.92, intervalAdd: 0.7 },
    { id: 'stagger', label: '錯拍', bossGap: 1.35, trashMul: 1.05, intervalAdd: 0.55 },
    { id: 'flood', label: '洪潮', bossGap: 1.05, trashMul: 1.12, intervalAdd: 0.28 },
    { id: 'silence', label: '靜隙', bossGap: 2.05, trashMul: 0.88, intervalAdd: 0.85 },
  ];

  function ultra1300Rhythm(n) {
    if (n < 1300) return null;
    return ENDLESS_ULTRA1300_RHYTHM[Math.floor(n / 5) % ENDLESS_ULTRA1300_RHYTHM.length];
  }

  /** 符咒 → 本局修飾欄項目（可裝備） */
  const CHARM_MAX_STAR = 3;
  const CHARM_EQUIP_SLOTS = 3;

  function charmStarOf(save, charmId) {
    const o = (save && save.ownedCharms) || {};
    const v = o[charmId];
    if (v === true) return 1;
    const n = Number(v) || 0;
    return Math.max(0, Math.min(CHARM_MAX_STAR, n));
  }

  function charmAsModifier(charm, star, powerMul) {
    if (!charm) return null;
    const s = Math.max(1, Math.min(CHARM_MAX_STAR, star || 1));
    const scale = (0.7 + s * 0.3) * (powerMul || 1); // ★1=1.0 ★2=1.3 ★3=1.6
    const starMark = '★'.repeat(s);
    return {
      id: 'equip_' + charm.id + '_s' + s,
      name: '符·' + charm.name + starMark,
      blurb: (charm.blurb || '') + '｜' + starMark,
      charmEquip: true,
      charmId: charm.id,
      charmStar: s,
      charmKind: charm.kind || 'buff',
      apply: function (ctx) {
        const pm = ctx.charmPowerMul || 1;
        const sc = scale * pm;
        if (charm.id === 'charm_twin_mirror') {
          ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) - 0.05 * sc;
        } else if (charm.id === 'charm_stack_ornament') {
          ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * (1 + 0.07 * sc);
        } else if (charm.id === 'charm_silver_ward') {
          ctx.silverDrainMul = (ctx.silverDrainMul || 1) * Math.max(0.4, 1 - 0.28 * sc);
        } else if (charm.id === 'charm_merge_seal') {
          ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * (1 + 0.25 * sc);
        } else if (charm.id === 'charm_prism_echo') {
          ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) - 0.03 * sc;
          ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * (1 + 0.03 * sc);
        } else if (charm.id === 'charm_vault_knot') {
          ctx.silverDrainMul = (ctx.silverDrainMul || 1) * Math.max(0.45, 1 - 0.15 * sc);
          ctx.coreMul = (ctx.coreMul || 1) * (1 + 0.06 * sc);
        }
      },
    };
  }

  function findCharmById(id) {
    return DUAL_PENTA_CHARMS.find(function (c) { return c.id === id; }) || null;
  }

  function normalizeOwnedCharms(save) {
    if (!save) return {};
    if (!save.ownedCharms || typeof save.ownedCharms !== 'object') save.ownedCharms = {};
    const out = {};
    Object.keys(save.ownedCharms).forEach(function (k) {
      const v = save.ownedCharms[k];
      out[k] = v === true ? 1 : Math.max(1, Math.min(CHARM_MAX_STAR, Number(v) || 1));
    });
    save.ownedCharms = out;
    if (!Array.isArray(save.equippedCharmIds)) {
      save.equippedCharmIds = save.equippedCharmId ? [save.equippedCharmId] : [];
    }
    save.equippedCharmIds = save.equippedCharmIds.filter(Boolean).slice(0, CHARM_EQUIP_SLOTS);
    save.equippedCharmId = save.equippedCharmIds[0] || '';
    return out;
  }

  function unlockCharm(save, charmId) {
    if (!save || !charmId) return false;
    normalizeOwnedCharms(save);
    const was = charmStarOf(save, charmId) > 0;
    if (!was) save.ownedCharms[charmId] = 1;
    return !was;
  }

  /** 同符再抽／手動升星（最多 ★3） */
  function upgradeCharmStar(save, charmId) {
    if (!save || !charmId) return { ok: false, error: '無存檔' };
    normalizeOwnedCharms(save);
    const cur = charmStarOf(save, charmId);
    if (cur <= 0) return { ok: false, error: '尚未解鎖' };
    if (cur >= CHARM_MAX_STAR) return { ok: false, error: '已滿星', star: cur };
    save.ownedCharms[charmId] = cur + 1;
    return { ok: true, star: cur + 1 };
  }

  function normalizeCharmSlotLocks(save) {
    if (!save) return [];
    if (!Array.isArray(save.charmSlotLocks)) save.charmSlotLocks = [false, false, false];
    while (save.charmSlotLocks.length < CHARM_EQUIP_SLOTS) save.charmSlotLocks.push(false);
    save.charmSlotLocks = save.charmSlotLocks.slice(0, CHARM_EQUIP_SLOTS).map(function (v) { return !!v; });
    return save.charmSlotLocks;
  }
  function isCharmSlotLocked(save, slot) {
    const locks = normalizeCharmSlotLocks(save);
    const i = slot | 0;
    return i >= 0 && i < locks.length && !!locks[i];
  }
  function toggleCharmSlotLock(save, slot) {
    if (!save) return { ok: false, error: '無存檔' };
    const locks = normalizeCharmSlotLocks(save);
    const i = Math.max(0, Math.min(CHARM_EQUIP_SLOTS - 1, slot | 0));
    locks[i] = !locks[i];
    save.charmSlotLocks = locks;
    return { ok: true, locked: locks[i], locks: locks.slice() };
  }
  function equipCharm(save, charmId, slot) {
    if (!save) return { ok: false, error: '無存檔' };
    normalizeOwnedCharms(save);
    normalizeCharmSlotLocks(save);
    if (!charmId) {
      if (slot != null && slot >= 0) {
        if (isCharmSlotLocked(save, slot)) return { ok: false, error: '欄位已鎖定' };
        const arr = (save.equippedCharmIds || []).slice();
        if (slot < arr.length) arr.splice(slot, 1);
        save.equippedCharmIds = arr.filter(Boolean);
      } else {
        const locks = normalizeCharmSlotLocks(save);
        const cur = save.equippedCharmIds || [];
        save.equippedCharmIds = cur.filter(function (id, i) { return locks[i] && id; });
      }
      save.equippedCharmId = save.equippedCharmIds[0] || '';
      return { ok: true, equipped: save.equippedCharmIds.slice() };
    }
    if (charmStarOf(save, charmId) <= 0) return { ok: false, error: '尚未解鎖此符咒' };
    if (!findCharmById(charmId)) return { ok: false, error: '無此符咒' };
    const ids = save.equippedCharmIds.filter(function (id) { return id && id !== charmId; });
    const idx = slot != null ? Math.max(0, Math.min(CHARM_EQUIP_SLOTS - 1, slot | 0)) : ids.length;
    if (idx < ids.length) {
      if (isCharmSlotLocked(save, idx) && ids[idx] && ids[idx] !== charmId) return { ok: false, error: '欄位已鎖定' };
      ids[idx] = charmId;
    } else ids.push(charmId);
    save.equippedCharmIds = ids.slice(0, CHARM_EQUIP_SLOTS);
    save.equippedCharmId = save.equippedCharmIds[0] || '';
    return { ok: true, equipped: save.equippedCharmIds.slice() };
  }
  function swapCharmSlots(save, i, j) {
    if (!save) return { ok: false, error: '無存檔' };
    normalizeOwnedCharms(save);
    normalizeCharmSlotLocks(save);
    const ids = (save.equippedCharmIds || []).slice();
    const a = i | 0;
    const b = j | 0;
    if (a < 0 || b < 0 || a >= ids.length || b >= ids.length) return { ok: false, error: '欄位無效' };
    if (isCharmSlotLocked(save, a) || isCharmSlotLocked(save, b)) return { ok: false, error: '鎖定欄不可換' };
    if (a === b) return { ok: true, equipped: ids.slice(), swapped: false };
    const tmp = ids[a];
    ids[a] = ids[b];
    ids[b] = tmp;
    save.equippedCharmIds = ids;
    save.equippedCharmId = ids[0] || '';
    return { ok: true, equipped: ids.slice(), swapped: true };
  }
  function recommendCharmSetEquip(save, preferSet) {
    if (!save) return { ok: false, error: '無存檔' };
    normalizeOwnedCharms(save);
    normalizeCharmSlotLocks(save);
    const rows = charmSetProgress(save);
    let best = null;
    rows.forEach(function (r) {
      if (preferSet && r.set !== preferSet) return;
      const ownedCount = r.members.filter(function (m) { return m.owned; }).length;
      const score = (r.advanced ? 100 : r.active ? 50 : 0) + ownedCount * 10 + r.count;
      if (!best || score > best.score) best = { row: r, score: score };
    });
    if (!best || !best.row) return { ok: false, error: '無可用套裝' };
    const r = best.row;
    const pick = r.members.filter(function (m) { return m.owned; }).slice(0, CHARM_EQUIP_SLOTS);
    if (!pick.length) return { ok: false, error: '尚未擁有此套件' };
    const locks = normalizeCharmSlotLocks(save);
    const cur = (save.equippedCharmIds || []).slice();
    const out = [];
    for (let i = 0; i < CHARM_EQUIP_SLOTS; i++) {
      if (locks[i] && cur[i]) out.push(cur[i]);
    }
    pick.forEach(function (m) {
      if (out.indexOf(m.id) < 0 && out.length < CHARM_EQUIP_SLOTS) out.push(m.id);
    });
    save.equippedCharmIds = out.slice(0, CHARM_EQUIP_SLOTS);
    save.equippedCharmId = save.equippedCharmIds[0] || '';
    return { ok: true, set: r.set, name: r.name, equipped: save.equippedCharmIds.slice() };
  }


  function getEquippedCharm(save) {
    const ids = getEquippedCharmIds(save);
    if (!ids.length) return null;
    return findCharmById(ids[0]);
  }

  function getEquippedCharmIds(save) {
    normalizeOwnedCharms(save);
    return (save.equippedCharmIds || []).filter(Boolean);
  }

  function getEquippedCharms(save) {
    return getEquippedCharmIds(save).map(function (id) {
      const c = findCharmById(id);
      if (!c) return null;
      return { charm: c, star: charmStarOf(save, id) };
    }).filter(Boolean);
  }

  /** 套裝共鳴：同 set ≥2 觸發 */
  const CHARM_SET_DEFS = {
    mirror: {
      id: 'set_mirror',
      name: '鏡叠共鳴',
      blurb: '雙鏡＋叠帳：鏡稅地板 −0.04；敵速壓力 +4%',
      need: 2,
      needAdv: 3,
      nameAdv: '鏡叠·進階',
      blurbAdv: '三件鏡叠：鏡稅地板 −0.08；敵速壓力 +7%；抽銀 ×0.95',
      apply: function (ctx, mul) {
        const m = mul || 1;
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) - 0.04 * m;
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * (1 + 0.04 * m);
      },
      applyAdv: function (ctx, mul) {
        const m = mul || 1;
        ctx.mirageTaxFloorBonus = (ctx.mirageTaxFloorBonus || 0) - 0.08 * m;
        ctx.enemySpeedMul = (ctx.enemySpeedMul || 1) * (1 + 0.07 * m);
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * Math.max(0.5, 1 - 0.05 * m);
      },
    },
    ward: {
      id: 'set_ward',
      name: '護合共鳴',
      blurb: '護銀＋合星：抽銀 ×0.9；合星 ×1.12',
      need: 2,
      needAdv: 3,
      nameAdv: '護合·進階',
      blurbAdv: '三件護合：抽銀 ×0.82；合星 ×1.2；核心 HP +8%',
      apply: function (ctx, mul) {
        const m = mul || 1;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * Math.max(0.5, 1 - 0.1 * m);
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * (1 + 0.12 * m);
      },
      applyAdv: function (ctx, mul) {
        const m = mul || 1;
        ctx.silverDrainMul = (ctx.silverDrainMul || 1) * Math.max(0.45, 1 - 0.18 * m);
        ctx.mergeRebateMul = (ctx.mergeRebateMul || 1) * (1 + 0.2 * m);
        ctx.coreMul = (ctx.coreMul || 1) * (1 + 0.08 * m);
      },
    },
  };

  function charmSetResonance(save) {
    const pairs = getEquippedCharms(save);
    const counts = {};
    pairs.forEach(function (p) {
      const set = (p.charm && p.charm.set) || '';
      if (!set) return;
      counts[set] = (counts[set] || 0) + 1;
    });
    const active = [];
    Object.keys(counts).forEach(function (set) {
      const def = CHARM_SET_DEFS[set];
      if (!def || counts[set] < (def.need || 2)) return;
      const adv = !!(def.needAdv && counts[set] >= def.needAdv && def.applyAdv);
      active.push({
        set: set,
        count: counts[set],
        advanced: adv,
        name: adv ? def.nameAdv || def.name + '·進階' : def.name,
        blurb: adv ? def.blurbAdv || def.blurb : def.blurb,
        id: adv ? def.id + '_adv' : def.id,
        apply: adv ? def.applyAdv : def.apply,
      });
    });
    return active;
  }

  function charmSetAsModifiers(save) {
    return charmSetResonance(save).map(function (r) {
      return {
        id: 'equip_' + r.id,
        name: '套·' + r.name,
        blurb: r.blurb,
        charmSet: true,
        charmSetAdv: !!r.advanced,
        setId: r.set,
        apply: function (ctx) {
          let mul = ctx.charmSetMul || 1;
          if (r.advanced) mul *= ctx.charmSetAdvMul || 1;
          r.apply(ctx, mul);
        },
      };
    });
  }

  /** 套裝進度／下一件提示（徽記明細） */
  function charmSetProgress(save) {
    const equipped = getEquippedCharms(save);
    const eqIds = {};
    equipped.forEach(function (p) {
      if (p.charm) eqIds[p.charm.id] = true;
    });
    const owned = (save && save.ownedCharms) || {};
    return Object.keys(CHARM_SET_DEFS).map(function (set) {
      const def = CHARM_SET_DEFS[set];
      const members = DUAL_PENTA_CHARMS.filter(function (c) {
        return c.set === set;
      });
      const equippedMembers = members.filter(function (c) {
        return eqIds[c.id];
      });
      const missing = members.filter(function (c) {
        return !eqIds[c.id];
      });
      const ownedMissing = missing.filter(function (c) {
        return (Number(owned[c.id]) || 0) > 0 || owned[c.id] === true;
      });
      const next =
        ownedMissing[0] ||
        missing[0] ||
        null;
      const count = equippedMembers.length;
      const need = def.need || 2;
      const needAdv = def.needAdv || 3;
      const active = count >= need;
      const advanced = !!(def.needAdv && count >= needAdv);
      let nextHint = '已滿套';
      let nextOwned = false;
      if (next) {
        nextOwned = (Number(owned[next.id]) || 0) > 0 || owned[next.id] === true;
        if (advanced) nextHint = '進階已齊｜可換裝微調';
        else if (active && needAdv)
          nextHint =
            '下一件進階：' +
            next.name +
            (nextOwned ? '（已擁有・可裝）' : '（未擁有・等潮掉）');
        else
          nextHint =
            '下一件共鳴：' +
            next.name +
            (nextOwned ? '（已擁有・可裝）' : '（未擁有・等潮掉）');
      }
      return {
        set: set,
        id: def.id,
        name: advanced ? def.nameAdv || def.name + '·進階' : def.name,
        blurb: advanced ? def.blurbAdv || def.blurb : def.blurb,
        count: count,
        need: need,
        needAdv: needAdv,
        active: active,
        advanced: advanced,
        members: members.map(function (c) {
          return {
            id: c.id,
            name: c.name,
            equipped: !!eqIds[c.id],
            owned: (Number(owned[c.id]) || 0) > 0 || owned[c.id] === true,
          };
        }),
        nextId: next ? next.id : '',
        nextName: next ? next.name : '',
        nextOwned: nextOwned,
        nextHint: nextHint,
      };
    });
  }

  function formatCharmSetDetailHtml(save, focusSet) {
    const rows = charmSetProgress(save);
    const eqIds = getEquippedCharmIds(save);
    const focus = focusSet
      ? rows.filter(function (r) {
          return r.set === focusSet;
        })
      : rows;
    const bits = focus.map(function (r) {
      const mem = r.members
        .map(function (m) {
          const mark = m.equipped ? '◆' : m.owned ? '◇' : '·';
          const slot = eqIds.indexOf(m.id);
          let actions = '';
          if (m.equipped && slot >= 0) {
            const locked = isCharmSlotLocked(save, slot);
            actions =
              ' <button type="button" class="wall-mode-btn set-lock-slot" data-lock-slot="' +
              slot +
              '" data-set="' +
              r.set +
              '">' +
              (locked ? '解鎖' : '鎖') +
              '</button>';
            if (!locked) {
              actions +=
                '<button type="button" class="wall-mode-btn set-unequip" data-unequip-slot="' +
                slot +
                '" data-set="' +
                r.set +
                '">卸</button>';
              if (eqIds.length >= 2) {
                const other = (slot + 1) % eqIds.length;
                actions +=
                  '<button type="button" class="wall-mode-btn set-swap-slot" data-swap-a="' +
                  slot +
                  '" data-swap-b="' +
                  other +
                  '" data-set="' +
                  r.set +
                  '">換欄</button>';
              }
            }
          }
          const dragAttrs =
            m.equipped && slot >= 0
              ? ' draggable="true" data-drag-slot="' +
                slot +
                '" data-set="' +
                r.set +
                '" title="拖曳換欄｜長按卸下"'
              : '';
          return (
            '<span class="set-member-row' +
            (m.equipped && slot >= 0 ? ' equipped' : '') +
            '"' +
            dragAttrs +
            '>' +
            mark +
            m.name +
            (slot >= 0 ? '·欄' + (slot + 1) : '') +
            actions +
            '</span>'
          );
        })
        .join('');
      const equipBtn =
        r.nextId && r.nextOwned && !r.advanced
          ? '<button type="button" class="wall-mode-btn set-equip-next" data-equip-next="' +
            r.nextId +
            '" data-set="' +
            r.set +
            '">裝上下一件・' +
            (r.nextName || '') +
            '</button>'
          : r.nextId && !r.nextOwned
            ? '<span class="card-meta">下一件未擁有｜等潮掉或商店</span>'
            : '';
      const recBtn =
        r.members.some(function (mm) { return mm.owned; })
          ? '<button type="button" class="wall-mode-btn set-recommend" data-set-recommend="' +
            r.set +
            '">一鍵推薦套</button>'
          : '';
      return (
        '<div class="set-detail-card card-thick' +
        (r.advanced ? ' adv' : r.active ? ' on' : '') +
        '"><strong>' +
        (r.advanced ? '◆' : r.active ? '◇' : '○') +
        (r.name || '') +
        '｜' +
        r.count +
        '/' +
        r.needAdv +
        '</strong><div class="card-meta">' +
        (r.blurb || '') +
        '</div><div class="set-detail-members">' +
        mem +
        '</div><div class="set-detail-next">' +
        (r.nextHint || '') +
        '</div><div class="set-detail-actions">' +
        equipBtn + recBtn +
        '</div></div>'
      );
    });
    return (
      '<div class="paper-body set-detail-page">' +
      bits.join('') +
      '<p class="paper-note">點徽記睇明細｜鎖欄短碼｜一鍵推薦｜拖曳／長按｜v4.8</p></div>'
    );
  }

  function listOwnedCharms(save) {
    normalizeOwnedCharms(save);
    const equipped = save.equippedCharmIds || [];
    return DUAL_PENTA_CHARMS.map(function (c) {
      const star = charmStarOf(save, c.id);
      const slot = equipped.indexOf(c.id);
      return {
        id: c.id,
        name: c.name,
        blurb: c.blurb,
        kind: c.kind,
        set: c.set || '',
        owned: star > 0,
        star: star,
        equipped: slot >= 0,
        slot: slot,
      };
    });
  }



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
      silverDrainMul: 1,
      enemySpeedMul: 1,
      rewardMul: 1,
      mergeRebateMul: 1,
      waveBonusMul: 1,
      heroCdMul: 1,
      lockDurMul: 1,
      heroAtkMul: 1,
      dualPentaEnemySpeedMul: 1,
      charmPowerMul: 1,
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


  /** 上一 ISO 週鍵（港時） */
  function hkPrevWeekKey(weekKey) {
    const key = weekKey || hkWeekKey();
    const m = /^(\d{4})-W(\d{2})$/.exec(key);
    if (!m) return '';
    let y = Number(m[1]);
    let w = Number(m[2]) - 1;
    if (w < 1) {
      y -= 1;
      w = 52;
    }
    return y + '-W' + String(w).padStart(2, '0');
  }

  /** 週挑戰首清：更新連續週／歷史／本地最佳 */
  function recordWeeklyStreak(save, weekKey) {
    const wk = weekKey || hkWeekKey();
    if (!save) return 0;
    if (save.lastWeeklyClearKey === wk) {
      return save.weekStreak || 0;
    }
    const prev = hkPrevWeekKey(wk);
    if (save.lastWeeklyClearKey && save.lastWeeklyClearKey === prev) {
      save.weekStreak = (save.weekStreak || 0) + 1;
    } else {
      save.weekStreak = 1;
    }
    save.weekStreakBest = Math.max(save.weekStreakBest || 0, save.weekStreak || 0);
    save.lastWeeklyClearKey = wk;
    if (!Array.isArray(save.weekClearHistory)) save.weekClearHistory = [];
    if (!save.weekClearHistory.includes(wk)) save.weekClearHistory.push(wk);
    while (save.weekClearHistory.length > 16) save.weekClearHistory.shift();
    if (!save.localBest || typeof save.localBest !== 'object') save.localBest = { endless: 0, weeklyStreak: 0, stageClears: 0 };
    save.localBest.weeklyStreak = Math.max(save.localBest.weeklyStreak || 0, save.weekStreakBest || 0);
    save.localBest.endless = Math.max(save.localBest.endless || 0, save.bestEndlessWave || 0);
    save.localBest.stageClears = Math.max(save.localBest.stageClears || 0, save.maxStageCleared || 0);
    return save.weekStreak || 0;
  }

  function formatLocalBestWall(save) {
    const s = save || {};
    const lb = s.localBest || {};
    const endless = Math.max(lb.endless || 0, s.bestEndlessWave || 0);
    const streak = Math.max(lb.weeklyStreak || 0, s.weekStreakBest || 0, s.weekStreak || 0);
    const stages = Math.max(lb.stageClears || 0, s.maxStageCleared || 0);
    const hist = Array.isArray(s.weekClearHistory) ? s.weekClearHistory.slice(-8) : [];
    const snaps = Array.isArray(s.wallSnapshots) ? s.wallSnapshots.slice(-8) : [];
    const curStreak = s.weekStreak || 0;
    return {
      endless: endless,
      weekStreak: curStreak,
      weekStreakBest: streak,
      stages: stages,
      stagesTotal: STAGES.length,
      history: hist,
      snapshots: snaps,
      label:
        '本地最佳牆（本機）｜無盡 ' +
        endless +
        ' 波｜連週 ' +
        curStreak +
        '（最佳 ' +
        streak +
        '）｜主線 ' +
        stages +
        '/' +
        STAGES.length +
        '｜唔做線上排行',
      short: '無盡' + endless + '·連週' + curStreak + '/' + streak + '·主線' + stages + '/' + STAGES.length,
      lines: [
        { key: 'endless', name: '無盡最佳', value: endless + ' 波', pct: Math.min(100, Math.round((endless / 50) * 100)) },
        { key: 'streak', name: '連週／最佳', value: curStreak + ' / ' + streak, pct: Math.min(100, Math.round((curStreak / Math.max(3, streak || 3)) * 100)) },
        { key: 'stages', name: '主線進度', value: stages + ' / ' + STAGES.length, pct: Math.min(100, Math.round((stages / Math.max(1, STAGES.length)) * 100)) },
      ],
    };
  }

  function formatWeekProgress(save) {
    const wk = hkWeekKey();
    const dailyN = weekDailyCount(save, wk);
    const weeklyDone = save && save.weeklyKey === wk && save.weeklyCleared;
    const dailyDoneToday = save && save.dailyDate === hkDateString() && save.dailyCleared;
    const streak = (save && save.weekStreak) || 0;
    const streakBest = Math.max((save && save.weekStreakBest) || 0, streak);
    const wall = formatLocalBestWall(save);
    return {
      weekKey: wk,
      dailyN: dailyN,
      dailyGoal: 7,
      weeklyDone: !!weeklyDone,
      dailyDoneToday: !!dailyDoneToday,
      weekStreak: streak,
      weekStreakBest: streakBest,
      localBest: wall,
      label:
        '本週 ' +
        wk +
        '｜每日 ' +
        dailyN +
        '/7' +
        (dailyDoneToday ? '（今日✓）' : '') +
        '｜週挑戰' +
        (weeklyDone ? '✓' : '未清') +
        '｜連週 ' +
        streak +
        (streakBest > streak ? '（最佳' + streakBest + '）' : ''),
      short: '日' + dailyN + '/7·週' + (weeklyDone ? '✓' : '—') + '·連' + streak,
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

  /** 無盡：每次開局抽 1–3 個修飾詞（v1.7 加厚；跟香港日＋開局次數） */
  function endlessModifiers(extraSeed, opts) {
    const day = hashStr(hkDateString());
    const seed = (day ^ ((extraSeed || 0) * 2654435761)) >>> 0;
    const count = 1 + (seed % 3); // 1、2 或 3
    const mods = pickModifiers(seed, count);
    const best = (opts && opts.bestWave) || 0;
    if (best >= 90 && RUN_MODIFIERS_90.length) {
      const h2 = (seed ^ 0x90abcdef) >>> 0;
      const late = RUN_MODIFIERS_90[h2 % RUN_MODIFIERS_90.length];
      if (!mods.some((m) => m.id === late.id)) {
        if (mods.length >= 3) mods[mods.length - 1] = late;
        else mods.push(late);
      }
    }
    if (best >= 100 && RUN_MODIFIERS_100.length) {
      const h3 = (seed ^ 0x100cafe) >>> 0;
      const late2 = RUN_MODIFIERS_100[h3 % RUN_MODIFIERS_100.length];
      if (!mods.some((m) => m.id === late2.id)) {
        if (mods.length >= 3) mods[0] = late2;
        else mods.push(late2);
      }
    }
    if (best >= 140 && RUN_MODIFIERS_140.length) {
      const h4 = (seed ^ 0x140f00d) >>> 0;
      const late3 = RUN_MODIFIERS_140[h4 % RUN_MODIFIERS_140.length];
      if (!mods.some((m) => m.id === late3.id)) {
        if (mods.length >= 3) mods[mods.length - 1] = late3;
        else mods.push(late3);
      }
    }
    if (best >= 150 && RUN_MODIFIERS_150.length) {
      const h5 = (seed ^ 0x150ace) >>> 0;
      const late4 = RUN_MODIFIERS_150[h5 % RUN_MODIFIERS_150.length];
      if (!mods.some((m) => m.id === late4.id)) {
        if (mods.length >= 3) mods[0] = late4;
        else mods.push(late4);
      }
    }
    if (best >= 160 && RUN_MODIFIERS_160.length) {
      const h6 = (seed ^ 0x160beef) >>> 0;
      const late5 = RUN_MODIFIERS_160[h6 % RUN_MODIFIERS_160.length];
      if (!mods.some((m) => m.id === late5.id)) {
        if (mods.length >= 3) mods[mods.length - 1] = late5;
        else mods.push(late5);
      }
    }
    if (best >= 180 && RUN_MODIFIERS_180.length) {
      const h7 = (seed ^ 0x180cafe) >>> 0;
      const late6 = RUN_MODIFIERS_180[h7 % RUN_MODIFIERS_180.length];
      if (!mods.some((m) => m.id === late6.id)) {
        if (mods.length >= 3) mods[0] = late6;
        else mods.push(late6);
      }
    }
    if (best >= 220 && RUN_MODIFIERS_220.length) {
      const h8 = (seed ^ 0x220fade) >>> 0;
      const late7 = RUN_MODIFIERS_220[h8 % RUN_MODIFIERS_220.length];
      if (!mods.some((m) => m.id === late7.id)) {
        if (mods.length >= 3) mods[mods.length - 1] = late7;
        else mods.push(late7);
      }
    }
    if (best >= 300 && RUN_MODIFIERS_300.length) {
      const h9 = (seed ^ 0x300dead) >>> 0;
      const late8 = RUN_MODIFIERS_300[h9 % RUN_MODIFIERS_300.length];
      if (!mods.some((m) => m.id === late8.id)) {
        if (mods.length >= 3) mods[0] = late8;
        else mods.push(late8);
      }
    }
    if (best >= 350 && RUN_MODIFIERS_350.length) {
      const h10 = (seed ^ 0x350beef) >>> 0;
      const late9 = RUN_MODIFIERS_350[h10 % RUN_MODIFIERS_350.length];
      if (!mods.some((m) => m.id === late9.id)) {
        if (mods.length >= 3) mods[mods.length - 1] = late9;
        else mods.push(late9);
      }
    }
    if (best >= 400 && RUN_MODIFIERS_400.length) {
      const h11 = (seed ^ 0x400cafe) >>> 0;
      const late10 = RUN_MODIFIERS_400[h11 % RUN_MODIFIERS_400.length];
      if (!mods.some((m) => m.id === late10.id)) {
        if (mods.length >= 3) mods[0] = late10;
        else mods.push(late10);
      }
    }
    if (best >= 450 && RUN_MODIFIERS_450.length) {
      const h12 = (seed ^ 0x450fade) >>> 0;
      const late11 = RUN_MODIFIERS_450[h12 % RUN_MODIFIERS_450.length];
      if (!mods.some((m) => m.id === late11.id)) {
        if (mods.length >= 3) mods[mods.length - 1] = late11;
        else mods.push(late11);
      }
    }
    if (best >= 550 && RUN_MODIFIERS_550.length) {
      const h13 = (seed ^ 0x550beef) >>> 0;
      const late12 = RUN_MODIFIERS_550[h13 % RUN_MODIFIERS_550.length];
      if (!mods.some((m) => m.id === late12.id)) {
        if (mods.length >= 3) mods[0] = late12;
        else mods.push(late12);
      }
    }
    if (best >= 650 && RUN_MODIFIERS_650.length) {
      const h14 = (seed ^ 0x650cafe) >>> 0;
      const late13 = RUN_MODIFIERS_650[h14 % RUN_MODIFIERS_650.length];
      if (!mods.some((m) => m.id === late13.id)) {
        if (mods.length >= 3) mods[mods.length - 1] = late13;
        else mods.push(late13);
      }
    }
    if (best >= 750 && RUN_MODIFIERS_750.length) {
      const h15 = (seed ^ 0x750beef) >>> 0;
      const late14 = RUN_MODIFIERS_750[h15 % RUN_MODIFIERS_750.length];
      if (!mods.some((m) => m.id === late14.id)) {
        if (mods.length >= 3) mods[0] = late14;
        else mods.push(late14);
      }
    }
    if (best >= 850 && RUN_MODIFIERS_850.length) {
      const h16 = (seed ^ 0x850cafe) >>> 0;
      const late15 = RUN_MODIFIERS_850[h16 % RUN_MODIFIERS_850.length];
      if (!mods.some((m) => m.id === late15.id)) {
        if (mods.length >= 3) mods[mods.length - 1] = late15;
        else mods.push(late15);
      }
    }
    if (best >= 950 && RUN_MODIFIERS_950.length) {
      const h17 = (seed ^ 0x950beef) >>> 0;
      const late16 = RUN_MODIFIERS_950[h17 % RUN_MODIFIERS_950.length];
      if (!mods.some((m) => m.id === late16.id)) {
        if (mods.length >= 3) mods[0] = late16;
        else mods.push(late16);
      }
    }
    if (best >= 1050 && RUN_MODIFIERS_1050.length) {
      const h18 = (seed ^ 0x1050cafe) >>> 0;
      const late17 = RUN_MODIFIERS_1050[h18 % RUN_MODIFIERS_1050.length];
      if (!mods.some((m) => m.id === late17.id)) {
        if (mods.length >= 3) mods[mods.length - 1] = late17;
        else mods.push(late17);
      }
    }
    if (best >= 1150 && RUN_MODIFIERS_1150.length) {
      const h19 = (seed ^ 0x1150beef) >>> 0;
      const late18 = RUN_MODIFIERS_1150[h19 % RUN_MODIFIERS_1150.length];
      if (!mods.some((m) => m.id === late18.id)) {
        if (mods.length >= 3) mods[0] = late18;
        else mods.push(late18);
      }
    }
    if (best >= 1250 && RUN_MODIFIERS_1250.length) {
      const h20 = (seed ^ 0x1250cafe) >>> 0;
      const late19 = RUN_MODIFIERS_1250[h20 % RUN_MODIFIERS_1250.length];
      if (!mods.some((m) => m.id === late19.id)) {
        if (mods.length >= 3) mods[mods.length - 1] = late19;
        else mods.push(late19);
      }
    }
    if (best >= 1350 && RUN_MODIFIERS_1350.length) {
      const h21 = (seed ^ 0x1350beef) >>> 0;
      const late20 = RUN_MODIFIERS_1350[h21 % RUN_MODIFIERS_1350.length];
      if (!mods.some((m) => m.id === late20.id)) {
        if (mods.length >= 3) mods[0] = late20;
        else mods.push(late20);
      }
    }
    return mods;
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
      { name: '斷索週結', focus: 'halt_seal', blurb: '停牌符偏多｜斷索週' },
      { name: '金羽熔斷週', focus: 'circuit_swan', blurb: '熔斷天鵝壓軸｜金羽鐘' },
      { name: '雙天鵝週', focus: 'dual_swan', blurb: '黑羽＋金邊夾擊｜本地牆' },
      { name: '鎖倉週練', focus: 'halt_seal', blurb: '停牌偏多｜鎖倉加練', tip: 'lock' },
      { name: '軋空開年週', focus: 'panic_board', blurb: '恐慌＋逼空節奏｜開年盤' },
      { name: '巷口風聲週', focus: 'rumor_swarm', blurb: '傳聞蚊潮｜清風再硬頂' },
      { name: '停牌潮週', focus: 'halt_tide', blurb: '停牌潮壓軸｜臨停潮' },
      { name: '十一關試煉週', focus: 'halt_seal', blurb: '停牌符潮｜鎖倉加練', tip: 'lock' },
      { name: '三潮同場週', focus: 'triple_tide', blurb: '黑羽＋金邊＋臨停｜三潮壓境' },
      { name: '墨影帳週', focus: 'ink_specter', blurb: '墨影翻帳壓軸｜第四潮' },
      { name: '帳鏡蜃週', focus: 'ledger_mirage', blurb: '帳鏡蜃壓軸｜第五潮鏡稅' },
      { name: '四潮同場週', focus: 'quad_tide', blurb: '黑羽＋金邊＋臨停＋墨影｜四潮壓境' },
      { name: '五潮同場週', focus: 'penta_tide', blurb: '五潮壓境｜含帳鏡蜃' },
      { name: '墨霧翻帳週', focus: 'ink_specter', blurb: '墨影＋暗盤霧｜護銀抗抽' },
      { name: '帳幔裂縫週', focus: 'ink_specter', blurb: '墨影壓軸｜裂縫抽銀' },
      { name: '暗墨抽銀週', focus: 'dark_tape', blurb: '暗盤影潮＋墨影預警｜清影護銀' },
      { name: '墨影四潮週', focus: 'quad_tide', blurb: '四潮同場偏墨｜先鎖倉再護銀' },
    ];
    const theme = themes[h % themes.length];
    const base = STAGES[2 + (h % Math.max(1, STAGES.length - 2))]; // 3–末關難度帶
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
      startSilver: 188 + (h % 6) * 7,
      coreHp: 212 + (h % 5) * 9,
      seed: h,
      unlockHeroes: Object.keys(HEROES),
      waveCount: 6 + (h % 3) + (theme.focus === 'dual_swan' || theme.focus === 'circuit_swan' || theme.focus === 'halt_tide' || theme.focus === 'triple_tide' || theme.focus === 'ink_specter' || theme.focus === 'ledger_mirage' || theme.focus === 'quad_tide' || theme.focus === 'penta_tide' ? 1 : 0), // 6–9
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
    // 末波再加一隻槓桿精英壓迫；雙天鵝週再加金羽壓軸（若未有）
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
      if (meta.focus === 'dual_swan') {
        const hasCircuit = last.spawns.some((s) => s.enemy === 'circuit_swan');
        if (!hasCircuit) {
          last.spawns.push({
            enemy: 'circuit_swan',
            count: 1,
            lane: 2,
            interval: 0,
            delay: 5.5,
            hpMul: 1.12 * scale,
          });
        }
      }
      if (meta.focus === 'halt_tide') {
        const hasTide = last.spawns.some((s) => s.enemy === 'halt_tide');
        if (!hasTide) {
          last.spawns.push({
            enemy: 'halt_tide',
            count: 1,
            lane: 2,
            interval: 0,
            delay: 4.8,
            hpMul: 1.1 * scale,
          });
        }
      }
      if (meta.focus === 'triple_tide') {
        last.spawns.push({ enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 2.5, hpMul: 1.08 * scale });
        last.spawns.push({ enemy: 'circuit_swan', count: 1, lane: 2, interval: 0, delay: 4.2, hpMul: 1.1 * scale });
        last.spawns.push({ enemy: 'halt_tide', count: 1, lane: 3, interval: 0, delay: 5.8, hpMul: 1.1 * scale });
      }
      if (meta.focus === 'ink_specter') {
        // v2.6：墨影週波編加厚——中段暗盤霧、倒數第二波弱化墨影、末波抽銀壓境
        for (let wi = 2; wi < waves.length - 1; wi++) {
          const w = waves[wi];
          w.spawns = w.spawns || [];
          w.spawns.push({
            enemy: 'dark_tape',
            count: 5 + wi,
            lane: 'cycle',
            interval: 0.34,
            delay: 0.4,
            hpMul: 1.05 * scale,
          });
        }
        if (waves.length >= 2) {
          const pen = waves[waves.length - 2];
          pen.spawns = pen.spawns || [];
          if (!pen.spawns.some((s) => s.enemy === 'ink_specter')) {
            pen.spawns.push({
              enemy: 'ink_specter',
              count: 1,
              lane: 1,
              interval: 0,
              delay: 3.2,
              hpMul: 0.78 * scale,
            });
          }
        }
        const hasInk = last.spawns.some((s) => s.enemy === 'ink_specter');
        if (!hasInk) {
          last.spawns.push({
            enemy: 'ink_specter',
            count: 1,
            lane: 2,
            interval: 0,
            delay: 4.6,
            hpMul: 1.14 * scale,
          });
        }
        last.spawns.push({
          enemy: 'dark_tape',
          count: 10,
          lane: 'random',
          interval: 0.28,
          delay: 0.5,
          hpMul: 1.08 * scale,
        });
        last.spawns.push({
          enemy: 'panic_board',
          count: 4,
          lane: 'cycle',
          interval: 0.85,
          delay: 1.2,
          elite: true,
          hpMul: 1.1 * scale,
        });
        // v2.7：墨影週末波雙墨影（第二帳較遲入場）
        const inkCount = last.spawns.filter((s) => s.enemy === 'ink_specter').length;
        if (inkCount < 2) {
          last.spawns.push({
            enemy: 'ink_specter',
            count: 1,
            lane: 0,
            interval: 0,
            delay: 7.2,
            hpMul: 1.05 * scale,
          });
        }
        last.blurb = (last.blurb || '') + '｜雙墨同場';
      }

      if (meta.focus === 'ledger_mirage') {
        const last = waves[waves.length - 1];
        const scale = 1 + (meta.waveCount || 7) * 0.02;
        if (!last.spawns.some((s) => s.enemy === 'ledger_mirage')) {
          last.spawns.push({
            enemy: 'ledger_mirage',
            count: 1,
            lane: 2,
            interval: 0,
            delay: 3.2,
            hpMul: 1.08 * scale,
          });
        }
        if (!last.spawns.some((s) => s.enemy === 'ink_specter')) {
          last.spawns.push({
            enemy: 'ink_specter',
            count: 1,
            lane: 1,
            interval: 0,
            delay: 5.5,
            hpMul: 0.92 * scale,
          });
        }
        last.blurb = (last.blurb || '') + '｜帳鏡蜃壓軸';
      }
      if (meta.focus === 'quad_tide') {
        last.spawns.push({ enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 2.2, hpMul: 1.08 * scale });
        last.spawns.push({ enemy: 'circuit_swan', count: 1, lane: 1, interval: 0, delay: 3.6, hpMul: 1.1 * scale });
        last.spawns.push({ enemy: 'halt_tide', count: 1, lane: 2, interval: 0, delay: 5.0, hpMul: 1.1 * scale });
        last.spawns.push({ enemy: 'ink_specter', count: 1, lane: 3, interval: 0, delay: 6.4, hpMul: 1.12 * scale });
      }
    }
    return waves;
  }

  function buildDailyWaves(meta) {
    const n = meta.waveCount;
    const focus = meta.focus;
    const waves = [];

      if (meta.focus === 'penta_tide') {
        const last = waves[waves.length - 1];
        const scale = 1 + (meta.waveCount || 8) * 0.02;
        const need = [
          ['black_swan', 0, 1.6],
          ['circuit_swan', 1, 2.8],
          ['halt_tide', 2, 4.0],
          ['ink_specter', 3, 5.2],
          ['ledger_mirage', 2, 6.6],
        ];
        for (const [id, lane, delay] of need) {
          if (!last.spawns.some((s) => s.enemy === id)) {
            last.spawns.push({
              enemy: id,
              count: 1,
              lane: lane,
              interval: 0,
              delay: delay,
              hpMul: (id === 'ledger_mirage' ? 1.1 : id === 'ink_specter' ? 1.08 : 1.05) * scale,
            });
          }
        }
        last.blurb = (last.blurb || '') + '｜五潮同場';
      }

    const bossish = focus === 'black_swan' || focus === 'circuit_swan' || focus === 'dual_swan' || focus === 'halt_tide' || focus === 'triple_tide' || focus === 'ink_specter' || focus === 'ledger_mirage' || focus === 'quad_tide' || focus === 'penta_tide';
    const swarmish = focus === 'rumor_swarm' || focus === 'dark_tape';
    const focusEnemy = focus === 'dual_swan' ? 'black_swan' : focus === 'circuit_swan' ? 'circuit_swan' : focus;
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
      if (i >= 2 && !bossish) {
        const focusCount = 2 + Math.floor(i / 2);
        spawns.push({
          enemy: focusEnemy,
          count: focusCount,
          lane: 'cycle',
          interval: focus === 'panic_board' ? 1.15 : focus === 'dark_tape' ? 0.55 : 1.0,
          delay: 1.2,
          hpMul: focus === 'panic_board' ? 1.05 : 1,
        });
      }
      if (i === n || (bossish && i >= n - 1)) {
        if (focus === 'dual_swan') {
          spawns.push({
            enemy: 'black_swan',
            count: 1,
            lane: 1,
            interval: 0,
            delay: 3.2,
            hpMul: 1 + i * 0.04,
          });
          spawns.push({
            enemy: 'circuit_swan',
            count: 1,
            lane: 2,
            interval: 0,
            delay: 5.0,
            hpMul: 1 + i * 0.045,
          });
        } else if (focus === 'circuit_swan') {
          spawns.push({
            enemy: 'circuit_swan',
            count: 1,
            lane: 2,
            interval: 0,
            delay: 3.8,
            hpMul: 1 + i * 0.045,
          });
        } else if (focus === 'halt_tide') {
          spawns.push({
            enemy: 'halt_tide',
            count: 1,
            lane: 2,
            interval: 0,
            delay: 3.6,
            hpMul: 1 + i * 0.045,
          });
          spawns.push({
            enemy: 'halt_seal',
            count: 4 + Math.floor(i / 2),
            lane: 'cycle',
            interval: 0.55,
            delay: 1.2,
          });
        } else {
          spawns.push({
            enemy: 'black_swan',
            count: 1,
            lane: 2,
            interval: 0,
            delay: 4,
            hpMul: 1 + i * 0.04,
          });
        }
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
    {
      id: 'lock_wall',
      name: '鎖倉鐵壁',
      heroes: ['lock_hermit', 'market_guard', 'dividend_hermit'],
      blurb: '鎖倉＋坦＋奶｜觸發鎖倉鐵壁／細水鎖倉',
      tip: '鐵筆鎖敵攻、鐵衛頂、隱士回血',
    },
    {
      id: 'squeeze_lock',
      name: '軋空鎖倉',
      heroes: ['squeeze_blade', 'lock_hermit', 'market_guard'],
      blurb: '逼空＋鎖倉＋坦｜觸發軋空鎖倉',
      tip: '高血逼空收割；鐵筆減攻；鐵衛頂雙天鵝',
    },
    {
      id: 'halt_lock',
      name: '臨停鎖倉',
      heroes: ['lock_hermit', 'market_guard', 'short_blade'],
      blurb: '鎖倉＋坦＋劍｜擋停牌潮',
      tip: '第 11 關／停牌潮：鐵筆減攻、鐵衛頂、劍減速收割',
    },
    {
      id: 'ink_guard',
      name: '護銀抗墨',
      heroes: ['market_guard', 'lock_hermit', 'dividend_hermit', 'night_broker'],
      blurb: '鐵衛＋鎖倉＋隱士＋掮客——抗抽銀、清暗盤',
    }
  ];

  /** 四潮教學（靜態短頁；v2.4） */
  const QUAD_TIDE_LESSON = {
    id: 'quad_tide',
    title: '四潮教學',
    blurb: '黑羽＋金邊＋臨停＋墨影——無盡每 60 波同場',
    steps: [
      { name: '① 鎖倉清符', text: '停牌潮帶停牌符；鎖倉居士減攻，先清符再硬頂潮心。', bossId: 'halt_tide' },
      { name: '② 守鐘護核', text: '熔斷天鵝停刀鐘響——鐵衛扛前排，內息／甲厚撐過停刀窗。', bossId: 'circuit_swan' },
      { name: '③ 收羽軋空', text: '黑天鵝減速震核；逼空客＋標記收割，合星後再開逼。', bossId: 'black_swan' },
      { name: '④ 護銀抗墨', text: '墨影帳降攻抽銀；暗盤影優先清，銀兩唔好堆住等人抽。', bossId: 'ink_specter' },
      { name: '⑤ 無盡節奏', text: '30 波三潮、60 波四潮；75+／90+／100+ 修飾池遞進，合 3–4 星優先。', bossId: null },
    ],
  };

  /** 失敗後隨機提示 */
  const FAIL_TIPS = [
    '十二池在望：符咒三欄＋套裝共鳴可穩核心。',
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
    '傳聞蚊／暗盤影已有正式像素——認形快啲，優先清風聲再硬頂。',
    '第 7 關「斷索開市」停牌符＋暗盤影混編——鎖倉居士減攻＋鐵衛更穩。',
    '鎖倉居士＋莊家鐵衛 →「鎖倉鐵壁」；配股息隱士再觸「細水鎖倉」。',
    '週挑戰睇連續週同本地最佳牆（設定／成就）；唔做線上排行。',
    '第 8 關「銀樓守歲」停牌＋暗盤＋雙天鵝——鎖倉減攻先，再合星硬頂。',
    '無盡而家可抽到 3 個修飾；見「升星紅包／靜盤緩行／鎖潮加印」優先合星。',
    '第 9 關「開年軋空」末波有熔斷天鵝——停刀鐘響前先鎖倉減攻。',
    '熔斷天鵝唔係普通黑天鵝：全場短暫停刀，鐵衛＋鎖倉更穩。',
    '第 10 關「雙天鵝夜」末波黑羽＋金邊夾擊——先鎖倉再逼空收割。',
    '逼空客＋鎖倉居士 →「軋空鎖倉」；週挑戰見「雙天鵝週／金羽熔斷週」優先合星。',
    '第 11 關「停牌潮夜」末波有停牌潮——範圍臨停，鎖倉＋鐵衛優先。',
    '停牌潮唔係熔斷天鵝：專範圍臨停＋帶動停牌符；先清符再軋潮心。',
    '本地最佳牆可喺設定匯出 JSON／文字（本機｜唔做線上排行）。',
    '主線十一關：雙天鵝後試停牌潮；推薦「臨停鎖倉／軋空鎖倉」。',
    '第 12 關「三潮同場」後無盡每 60 波「四潮同場」、每 80 波「五潮同場」（含帳鏡）——先鎖倉清符，再收羽墨鏡。',
    '墨影帳抽銀降攻：護住銀袋，暗盤影優先清，再軋帳心。',
    '無盡 90+ 會抽專屬修飾（墨衛護銀／九十堡壘等）；百浪有里程碑。',
    '牆時間軸有差值走勢條——本機對盤，唔做線上排行。',
    '第 13 關「墨影翻帳」專打墨影：暗盤影先清，銀兩唔好堆。',
    '無盡 100+ 再開有第二池修飾（百浪銀庫／墨鏡反照等）。',
    '墨影週末波或會雙墨同場——護銀優先，分路清影。',
    '短時間連續合星有連擊提示；點頂欄修飾條可睇說明。',
    '無盡 75+：潮變密但血量增速略收；合 3–4 星＋鎖倉鐵壁優先於亂召。',
    '牆快照時間軸可對照上一筆差值（本機｜唔做線上排行）。',
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
    '第十關以後推薦跟「軋空鎖倉／臨停鎖倉」芯片。',
    '失敗後睇推薦陣容同失敗提示——對齊而家關卡敵組成。',
    '四潮先鎖倉清符，再收黑羽／金邊／墨影；銀兩唔好俾墨影抽乾。',
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
    { id: 'stage7', cat: 'stage', name: '斷索開市', blurb: '通關第 7 關「斷索開市」', check: (s) => (s.maxStageCleared || 0) >= 7 },
    { id: 'stage8', cat: 'stage', name: '銀樓守歲', blurb: '通關第 8 關「銀樓守歲」', check: (s) => (s.maxStageCleared || 0) >= 8 },
    { id: 'stage9', cat: 'stage', name: '開年軋空', blurb: '通關第 9 關「開年軋空」', check: (s) => (s.maxStageCleared || 0) >= 9 },
    { id: 'stage10', cat: 'stage', name: '雙天鵝夜', blurb: '通關第 10 關「雙天鵝夜」', check: (s) => (s.maxStageCleared || 0) >= 10 },
    { id: 'stage11', cat: 'stage', name: '停牌潮夜', blurb: '通關第 11 關「停牌潮夜」', check: (s) => (s.maxStageCleared || 0) >= 11 },
    { id: 'stage12', cat: 'stage', name: '三潮同場', blurb: '通關第 12 關「三潮同場」', check: (s) => (s.maxStageCleared || 0) >= 12 },
    { id: 'all_stages', cat: 'stage', name: '主線全破', blurb: '通關全部主線關卡', check: (s) => (s.maxStageCleared || 0) >= STAGES.length },
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
    { id: 'market_event', cat: 'combat', name: '市況警報', blurb: '首次觸發開波市況事件', check: (s) => !!s.ach && s.ach.market_event },
    { id: 'halt_seen', cat: 'combat', name: '臨停過招', blurb: '圖鑑見過停牌符', check: (s) => !!(s.seenEnemies && s.seenEnemies.halt_seal) },
    { id: 'dark_seen', cat: 'combat', name: '暗盤入眼', blurb: '圖鑑見過暗盤影', check: (s) => !!(s.seenEnemies && s.seenEnemies.dark_tape) },
    { id: 'rumor_sweep', cat: 'combat', name: '風聲收割', blurb: '單局擊殺傳聞蚊 ≥ 20', check: (s) => !!s.ach && !!s.ach.rumor_sweep },
    { id: 'streak5', cat: 'combat', name: '連斬開市', blurb: '單局達成一次連斬 ×5', check: (s) => !!s.ach && !!s.ach.streak5 },
    { id: 'week_streak3', cat: 'meta', name: '三週連莊', blurb: '週挑戰連續週 ≥ 3', check: (s) => (s.weekStreakBest || 0) >= 3 || (s.weekStreak || 0) >= 3 },
    { id: 'lock_bond', cat: 'combat', name: '鎖倉開倉', blurb: '觸發鎖倉鐵壁或細水鎖倉', check: (s) => !!s.ach && !!s.ach.lock_bond },
    { id: 'lock_procs30', cat: 'combat', name: '鐵筆連環', blurb: '單局施放鎖倉印 ≥ 30 次', check: (s) => !!s.ach && !!s.ach.lock_procs30 },
    { id: 'endless_triple', cat: 'combat', name: '三修飾殺跌', blurb: '無盡單局抽中 3 個修飾詞', check: (s) => !!s.ach && !!s.ach.endless_triple },
    { id: 'circuit_seen', cat: 'combat', name: '熔斷過招', blurb: '圖鑑見過熔斷天鵝', check: (s) => !!(s.seenEnemies && s.seenEnemies.circuit_swan) },
    { id: 'circuit_kill', cat: 'combat', name: '軋斷金羽', blurb: '擊敗一次熔斷天鵝', check: (s) => !!s.ach && !!s.ach.circuit_kill },
    { id: 'dual_swan_kill', cat: 'combat', name: '雙羽同軋', blurb: '單局擊破黑天鵝＋熔斷天鵝各 ≥1', check: (s) => !!s.ach && !!s.ach.dual_swan_kill },
    { id: 'squeeze_lock_bond', cat: 'combat', name: '軋空開鎖', blurb: '觸發軋空鎖倉或招股鎖倉', check: (s) => !!s.ach && !!s.ach.squeeze_lock_bond },
    { id: 'halt_tide_seen', cat: 'combat', name: '臨停過潮', blurb: '圖鑑見過停牌潮', check: (s) => !!(s.seenEnemies && s.seenEnemies.halt_tide) },
    { id: 'halt_tide_kill', cat: 'combat', name: '軋斷臨停', blurb: '擊敗一次停牌潮', check: (s) => !!s.ach && !!s.ach.halt_tide_kill },
    { id: 'endless30', cat: 'combat', name: '卅浪長城', blurb: '無盡最佳 ≥ 30 波', check: (s) => (s.bestEndlessWave || 0) >= 30 },
    { id: 'wall_export', cat: 'meta', name: '牆文出庫', blurb: '匯出一次本地最佳牆', check: (s) => !!s.ach && !!s.ach.wall_export },
    { id: 'triple_tide_clear', cat: 'combat', name: '三潮過招', blurb: '單局擊破黑天鵝＋熔斷天鵝＋停牌潮各 ≥1', check: (s) => !!s.ach && !!s.ach.triple_tide_clear },
    { id: 'triple_event', cat: 'combat', name: '三潮警報', blurb: '觸發一次三潮同場市況事件', check: (s) => !!s.ach && !!s.ach.triple_event },
    { id: 'wall_share', cat: 'meta', name: '牆碼相傳', blurb: '複製一次本地牆短碼', check: (s) => !!s.ach && !!s.ach.wall_share },
    { id: 'wall_compare', cat: 'meta', name: '牆碼對盤', blurb: '本機對照一次牆短碼', check: (s) => !!s.ach && !!s.ach.wall_compare },
    { id: 'wall_snap', cat: 'meta', name: '牆影存檔', blurb: '留下一次本地牆快照', check: (s) => !!s.ach && !!s.ach.wall_snap },
    { id: 'endless40', cat: 'combat', name: '四十浪潮城', blurb: '無盡最佳 ≥ 40 波', check: (s) => (s.bestEndlessWave || 0) >= 40 },
    { id: 'halt_drizzle', cat: 'combat', name: '臨停細雨', blurb: '觸發一次臨停細雨市況', check: (s) => !!s.ach && !!s.ach.halt_drizzle },
    { id: 'post12_endless', cat: 'meta', name: '全破入無盡', blurb: '十二關皆破後首次挑戰無盡', check: (s) => !!s.ach && !!s.ach.post12_endless },
    { id: 'ink_seen', cat: 'combat', name: '墨影過招', blurb: '圖鑑見過墨影帳', check: (s) => !!(s.seenEnemies && s.seenEnemies.ink_specter) },
    { id: 'ink_kill', cat: 'combat', name: '軋斷墨影', blurb: '擊敗一次墨影帳', check: (s) => !!s.ach && !!s.ach.ink_kill },
    { id: 'endless50', cat: 'combat', name: '五十浪潮守', blurb: '無盡最佳 ≥ 50 波', check: (s) => (s.bestEndlessWave || 0) >= 50 },
    { id: 'endless60', cat: 'combat', name: '六十浪四潮', blurb: '無盡最佳 ≥ 60 波', check: (s) => (s.bestEndlessWave || 0) >= 60 },
    { id: 'quad_tide_clear', cat: 'combat', name: '四潮過招', blurb: '單局擊破四潮 Boss 各 ≥1', check: (s) => !!s.ach && !!s.ach.quad_tide_clear },
    { id: 'wall_timeline', cat: 'meta', name: '牆影時間軸', blurb: '打開一次牆快照時間軸', check: (s) => !!s.ach && !!s.ach.wall_timeline },
    { id: 'endless75', cat: 'combat', name: '七十五浪硬頂', blurb: '無盡最佳 ≥ 75 波', check: (s) => (s.bestEndlessWave || 0) >= 75 },
    { id: 'wall_delta', cat: 'meta', name: '牆影對盤', blurb: '喺時間軸睇過快照差值', check: (s) => !!s.ach && !!s.ach.wall_delta },
    { id: 'quad_lesson', cat: 'meta', name: '四潮入門', blurb: '讀完一次四潮教學', check: (s) => !!s.ach && !!s.ach.quad_lesson },
    { id: 'endless90', cat: 'combat', name: '九十浪長城', blurb: '無盡最佳 ≥ 90 波', check: (s) => (s.bestEndlessWave || 0) >= 90 },
    { id: 'endless100', cat: 'combat', name: '百浪墨城', blurb: '無盡最佳 ≥ 100 波', check: (s) => (s.bestEndlessWave || 0) >= 100 },
    { id: 'ink_curtain', cat: 'combat', name: '帳幔裂縫', blurb: '見過墨影帳幔／裂縫特效', check: (s) => !!s.ach && !!s.ach.ink_curtain },
    { id: 'wall_spark', cat: 'meta', name: '牆影走勢', blurb: '喺時間軸睇過差值走勢', check: (s) => !!s.ach && !!s.ach.wall_spark },
    { id: 'stage13', cat: 'stage', name: '墨影翻帳', blurb: '通關第 13 關「墨影翻帳」', check: (s) => (s.maxStageCleared || 0) >= 13 },
    { id: 'all13', cat: 'stage', name: '十三關皆破', blurb: '通關全部主線關卡（含墨影）', check: (s) => (s.maxStageCleared || 0) >= STAGES.length },
    { id: 'late100_run', cat: 'meta', name: '百浪開盤', blurb: '曾達 100 浪後再開無盡（抽第二池修飾）', check: (s) => !!s.ach && !!s.ach.late100_run },
    { id: 'endless110', cat: 'combat', name: '百十浪帳守', blurb: '無盡最佳 ≥ 110 波', check: (s) => (s.bestEndlessWave || 0) >= 110 },
    { id: 'dual_ink', cat: 'combat', name: '雙墨同場', blurb: '單局同時面對兩隻墨影帳', check: (s) => !!s.ach && !!s.ach.dual_ink },
    { id: 'merge_combo3', cat: 'merge', name: '合星三連', blurb: '短時間內連續合星 ≥ 3 次', check: (s) => !!s.ach && !!s.ach.merge_combo3 },
    { id: 'stage14', cat: 'stage', name: '雙墨夜帳', blurb: '通關第 14 關「雙墨夜帳」', check: (s) => (s.maxStageCleared || 0) >= 14 },
    { id: 'all14', cat: 'stage', name: '十四關皆破', blurb: '通關全部主線關卡（含雙墨）', check: (s) => (s.maxStageCleared || 0) >= STAGES.length },
    { id: 'endless120', cat: 'combat', name: '百廿浪雙墨', blurb: '無盡最佳 ≥ 120 波', check: (s) => (s.bestEndlessWave || 0) >= 120 },
    { id: 'merge_combo5', cat: 'merge', name: '合星五連', blurb: '短時間內連續合星 ≥ 5 次', check: (s) => !!s.ach && !!s.ach.merge_combo5 },
    { id: 'wall_mode', cat: 'meta', name: '牆影切換', blurb: '喺時間軸切換無盡／連週走勢', check: (s) => !!s.ach && !!s.ach.wall_mode },
    { id: 'endless130', cat: 'combat', name: '百卅浪長帳', blurb: '無盡最佳 ≥ 130 波', check: (s) => (s.bestEndlessWave || 0) >= 130 },
    { id: 'dual_ink_cycle', cat: 'combat', name: '雙墨週期', blurb: '無盡 100+ 遇上雙墨常駐週期', check: (s) => !!s.ach && !!s.ach.dual_ink_cycle },
    { id: 'wall_png', cat: 'meta', name: '牆影出圖', blurb: '匯出一次牆走勢圖（本機）', check: (s) => !!s.ach && !!s.ach.wall_png },
    { id: 'ink_lanes', cat: 'combat', name: '左右分帳', blurb: '雙墨同場時睇過左／右帳提示', check: (s) => !!s.ach && !!s.ach.ink_lanes },
    { id: 'v3_migrated', cat: 'meta', name: '銀樓三開', blurb: '升級到 v3.0 存檔（version 30）', check: (s) => (s.version || 0) >= 30 || !!(s.ach && s.ach.v3_migrated) },
    { id: 'fail_retry', cat: 'meta', name: '重整旗鼓', blurb: '失敗後用推薦陣容重開一次', check: (s) => !!s.ach && !!s.ach.fail_retry },
    { id: 'tutorial_v3', cat: 'meta', name: '五步入門', blurb: '完成 v3 新手五步導引', check: (s) => !!s.ach && !!s.ach.tutorial_v3 },
    { id: 'endless140', cat: 'combat', name: '百四十浪長城', blurb: '無盡最佳 ≥ 140 波', check: (s) => (s.bestEndlessWave || 0) >= 140 },
    { id: 'late140_run', cat: 'meta', name: '長城開盤', blurb: '曾達 140 浪後再開無盡（抽第三池修飾）', check: (s) => !!s.ach && !!s.ach.late140_run },
    { id: 'tutorial_skip_step', cat: 'meta', name: '跳步入門', blurb: '教學中跳過一步', check: (s) => !!s.ach && !!s.ach.tutorial_skip_step },
    { id: 'wall_compare_ui', cat: 'meta', name: '牆影對盤簡', blurb: '用牆面板內嵌對照一次短碼', check: (s) => !!s.ach && !!s.ach.wall_compare_ui },
    { id: 'stage15', cat: 'stage', name: '帳鏡夜破', blurb: '通關第 15 關「帳鏡夜市」', check: (s) => (s.maxStageCleared || 0) >= 15 },
    { id: 'all15', cat: 'stage', name: '十五關皆破', blurb: '通關全部主線關卡（含帳鏡）', check: (s) => (s.maxStageCleared || 0) >= STAGES.length },
    { id: 'mirage_seen', cat: 'combat', name: '帳鏡過招', blurb: '圖鑑見過帳鏡蜃', check: (s) => !!(s.seenEnemies && s.seenEnemies.ledger_mirage) },
    { id: 'endless150', cat: 'combat', name: '百五十浪鏡城', blurb: '無盡最佳 ≥ 150 波', check: (s) => (s.bestEndlessWave || 0) >= 150 },
    { id: 'late150_run', cat: 'meta', name: '鏡城開盤', blurb: '曾達 150 浪後再開無盡（抽第四池修飾）', check: (s) => !!s.ach && !!s.ach.late150_run },
    { id: 'wall_compare_copy', cat: 'meta', name: '牆影抄盤', blurb: '複製一次牆對照摘要', check: (s) => !!s.ach && !!s.ach.wall_compare_copy },
    { id: 'endless160', cat: 'combat', name: '百六十浪五潮城', blurb: '無盡最佳 ≥ 160 波', check: (s) => (s.bestEndlessWave || 0) >= 160 },
    { id: 'late160_run', cat: 'meta', name: '五潮開盤', blurb: '曾達 160 浪後再開無盡（抽第五池修飾）', check: (s) => !!s.ach && !!s.ach.late160_run },
    { id: 'penta_tide_clear', cat: 'combat', name: '五潮過招', blurb: '單局擊破五潮 Boss 各 ≥1', check: (s) => !!s.ach && !!s.ach.penta_tide_clear },
    { id: 'wall_compare_hist', cat: 'meta', name: '牆影留底', blurb: '本機留下至少 1 筆牆對照歷史', check: (s) => !!(s.wallCompareHistory && s.wallCompareHistory.length) },
    { id: 'tutorial_step_jump', cat: 'meta', name: '教學跳步點', blurb: '用教學 HUD 點步復位一次', check: (s) => !!s.ach && !!s.ach.tutorial_step_jump },
    { id: 'endless180', cat: 'combat', name: '百八十浪長城', blurb: '無盡最佳 ≥ 180 波', check: (s) => (s.bestEndlessWave || 0) >= 180 },
    { id: 'endless200', cat: 'combat', name: '二百浪封城', blurb: '無盡最佳 ≥ 200 波', check: (s) => (s.bestEndlessWave || 0) >= 200 },
    { id: 'late180_run', cat: 'meta', name: '長城開盤', blurb: '曾達 180 浪後再開無盡（抽第六池修飾）', check: (s) => !!s.ach && !!s.ach.late180_run },
    { id: 'wall_compare_export', cat: 'meta', name: '牆史出冊', blurb: '匯出一次牆對照歷史', check: (s) => !!s.ach && !!s.ach.wall_compare_export },
    { id: 'wall_compare_clear', cat: 'meta', name: '牆史清冊', blurb: '清除一次牆對照歷史', check: (s) => !!s.ach && !!s.ach.wall_compare_clear },
    { id: 'penta_fx_seen', cat: 'combat', name: '五潮警訊', blurb: '見過五潮同場專屬橫幅／FX', check: (s) => !!s.ach && !!s.ach.penta_fx_seen },
    { id: 'endless220', cat: 'combat', name: '二百二十浪潮城', blurb: '無盡最佳 ≥ 220 波', check: (s) => (s.bestEndlessWave || 0) >= 220 },
    { id: 'endless250', cat: 'combat', name: '二百五十浪封神', blurb: '無盡最佳 ≥ 250 波', check: (s) => (s.bestEndlessWave || 0) >= 250 },
    { id: 'late220_run', cat: 'meta', name: '潮城開盤', blurb: '曾達 220 浪後再開無盡（抽第七池修飾）', check: (s) => !!s.ach && !!s.ach.late220_run },
    { id: 'dual_penta_seen', cat: 'combat', name: '雙五潮過招', blurb: '經歷過雙五潮週期（含第二帳鏡）', check: (s) => !!s.ach && !!s.ach.dual_penta_seen },
    { id: 'mirage_tax_stack', cat: 'combat', name: '鏡稅叠層', blurb: '鏡稅叠層觸發一次', check: (s) => !!s.ach && !!s.ach.mirage_tax_stack },
    { id: 'wall_compare_json', cat: 'meta', name: '牆史 JSON', blurb: '匯出一次牆對照歷史 JSON', check: (s) => !!s.ach && !!s.ach.wall_compare_json },
    { id: 'tut_cell_highlight', cat: 'meta', name: '教學空格亮', blurb: '教學時見過空格高亮', check: (s) => !!s.ach && !!s.ach.tut_cell_highlight },
    { id: 'endless300', cat: 'combat', name: '三百浪不朽城', blurb: '無盡最佳 ≥ 300 波', check: (s) => (s.bestEndlessWave || 0) >= 300 },
    { id: 'late300_run', cat: 'meta', name: '不朽開盤', blurb: '曾達 300 浪後再開無盡（抽第八池修飾）', check: (s) => !!s.ach && !!s.ach.late300_run },
    { id: 'dual_penta_banner', cat: 'combat', name: '雙五潮揭幕', blurb: '見過雙五潮專屬橫幅', check: (s) => !!s.ach && !!s.ach.dual_penta_banner },
    { id: 'wall_compare_import', cat: 'meta', name: '牆史匯入', blurb: '匯入一次牆對照歷史', check: (s) => !!s.ach && !!s.ach.wall_compare_import },
    { id: 'tut_shop_arrow', cat: 'meta', name: '教學箭嘴', blurb: '教學時見過指向底欄箭嘴', check: (s) => !!s.ach && !!s.ach.tut_shop_arrow },
    { id: 'endless350', cat: 'combat', name: '三百五十浪九池城', blurb: '無盡最佳 ≥ 350 波', check: (s) => (s.bestEndlessWave || 0) >= 350 },
    { id: 'late350_run', cat: 'meta', name: '九池開盤', blurb: '曾達 350 浪後再開無盡（抽第九池修飾）', check: (s) => !!s.ach && !!s.ach.late350_run },
    { id: 'dual_penta_charm', cat: 'combat', name: '雙五符咒', blurb: '雙五潮抽中專屬符咒／飾品一次', check: (s) => !!s.ach && !!s.ach.dual_penta_charm },
    { id: 'wall_compare_chart', cat: 'meta', name: '牆史圖表', blurb: '打開過牆對照圖表', check: (s) => !!s.ach && !!s.ach.wall_compare_chart },
    { id: 'ach_badge_wall', cat: 'meta', name: '徽章牆', blurb: '打開過成就徽章牆', check: (s) => !!s.ach && !!s.ach.ach_badge_wall },
    { id: 'endless_replay', cat: 'meta', name: '無盡回放', blurb: '看過一次無盡結算回放摘要', check: (s) => !!s.ach && !!s.ach.endless_replay },
    { id: 'tut_upgrade_arrow', cat: 'meta', name: '強化箭嘴', blurb: '教學時見過指向強化箭嘴', check: (s) => !!s.ach && !!s.ach.tut_upgrade_arrow },
    { id: 'tut_settle_arrow', cat: 'meta', name: '結算箭嘴', blurb: '教學時見過指向結算／開波箭嘴', check: (s) => !!s.ach && !!s.ach.tut_settle_arrow },
    { id: 'wall_short_thick', cat: 'meta', name: '短碼加厚', blurb: '複製過加厚牆短碼', check: (s) => !!s.ach && !!s.ach.wall_short_thick },
    { id: 'endless400', cat: 'combat', name: '四百浪十池城', blurb: '無盡最佳 ≥ 400 波', check: (s) => (s.bestEndlessWave || 0) >= 400 },
    { id: 'late400_run', cat: 'meta', name: '十池開盤', blurb: '曾達 400 浪後再開無盡（抽第十池修飾）', check: (s) => !!s.ach && !!s.ach.late400_run },
    { id: 'charm_equip', cat: 'meta', name: '符咒入欄', blurb: '將雙五符咒裝備進本局修飾欄', check: (s) => !!s.ach && !!s.ach.charm_equip },
    { id: 'charm_owned', cat: 'combat', name: '符咒入庫', blurb: '解鎖至少 1 枚雙五符咒／飾品', check: (s) => !!(s.ownedCharms && Object.keys(s.ownedCharms).length) },
    { id: 'wall_chart_export', cat: 'meta', name: '牆圖匯出', blurb: '匯出牆對照圖 SVG／PNG', check: (s) => !!s.ach && !!s.ach.wall_chart_export },
    { id: 'wall_chart_hover', cat: 'meta', name: '牆圖細睇', blurb: 'hover／點選牆圖柱睇詳情', check: (s) => !!s.ach && !!s.ach.wall_chart_hover },
    { id: 'endless_replay_list', cat: 'meta', name: '回放列表', blurb: '打開無盡回放列表頁', check: (s) => !!s.ach && !!s.ach.endless_replay_list },
    { id: 'endless_replay_cmp', cat: 'meta', name: '回放對盤', blurb: '對照上一局無盡回放', check: (s) => !!s.ach && !!s.ach.endless_replay_cmp },
    { id: 'tut_settle_fail', cat: 'meta', name: '結算聯動', blurb: '教學結算步與失敗面板聯動一次', check: (s) => !!s.ach && !!s.ach.tut_settle_fail },
    { id: 'endless450', cat: 'combat', name: '四百五十浪十一池', blurb: '無盡最佳 ≥ 450 波', check: (s) => (s.bestEndlessWave || 0) >= 450 },
    { id: 'endless500', cat: 'combat', name: '五百浪封池城', blurb: '無盡最佳 ≥ 500 波', check: (s) => (s.bestEndlessWave || 0) >= 500 },
    { id: 'late450_run', cat: 'meta', name: '十一池開盤', blurb: '曾達 450 浪後再開無盡（抽第十一池修飾）', check: (s) => !!s.ach && !!s.ach.late450_run },
    { id: 'late550_run', cat: 'meta', name: '十二池開盤', blurb: '曾達 550 浪後再開無盡（抽第十二池修飾）', check: (s) => !!s.ach && !!s.ach.late550_run },
    { id: 'late650_run', cat: 'meta', name: '十三池開盤', blurb: '曾達 650 浪後再開無盡（抽第十三池修飾）', check: (s) => !!s.ach && !!s.ach.late650_run },
    { id: 'late750_run', cat: 'meta', name: '十四池開盤', blurb: '曾達 750 浪後再開無盡（抽第十四池修飾）', check: (s) => !!s.ach && !!s.ach.late750_run },
    { id: 'late850_run', cat: 'meta', name: '十五池開盤', blurb: '曾達 850 浪後再開無盡（抽第十五池修飾）', check: (s) => !!s.ach && !!s.ach.late850_run },
    { id: 'late950_run', cat: 'meta', name: '十六池開盤', blurb: '曾達 950 浪後再開無盡（抽第十六池修飾）', check: (s) => !!s.ach && !!s.ach.late950_run },
    { id: 'late1050_run', cat: 'meta', name: '十七池開盤', blurb: '曾達 1050 浪後再開無盡（抽第十七池修飾）', check: (s) => !!s.ach && !!s.ach.late1050_run },
    { id: 'late1150_run', cat: 'meta', name: '十八池開盤', blurb: '曾達 1150 浪後再開無盡（抽第十八池修飾）', check: (s) => !!s.ach && !!s.ach.late1150_run },
    { id: 'set_drag_swap', cat: 'meta', name: '拖曳換欄', blurb: '徽記明細拖曳換欄或長按卸下', check: (s) => !!s.ach && !!s.ach.set_drag_swap },
    { id: 'dual_preset_fav', cat: 'meta', name: '區間方案', blurb: '收藏過自訂雙區間預設', check: (s) => !!s.ach && !!s.ach.dual_preset_fav },
    { id: 'merge_snap_slider', cat: 'meta', name: '吸附滑桿', blurb: '用過吸附靈敏度滑桿', check: (s) => !!s.ach && !!s.ach.merge_snap_slider },
    { id: 'late1250_run', cat: 'meta', name: '十九池開盤', blurb: '曾達 1250 浪後再開無盡（抽第十九池修飾）', check: (s) => !!s.ach && !!s.ach.late1250_run },
    { id: 'charm_slot_lock', cat: 'meta', name: '欄位鎖定', blurb: '鎖定過徽記裝備欄', check: (s) => !!s.ach && !!s.ach.charm_slot_lock },
    { id: 'set_recommend_one', cat: 'meta', name: '推薦套裝', blurb: '一鍵裝過推薦套裝', check: (s) => !!s.ach && !!s.ach.set_recommend_one },
    { id: 'dual_preset_short', cat: 'meta', name: '區間短碼', blurb: '匯出／匯入過雙區間方案短碼', check: (s) => !!s.ach && !!s.ach.dual_preset_short },
    { id: 'dual_card_png', cat: 'meta', name: '對照卡 PNG', blurb: '匯出過雙區間對照卡 PNG', check: (s) => !!s.ach && !!s.ach.dual_card_png },
    { id: 'merge_snap_ring', cat: 'meta', name: '吸附環', blurb: '開過吸附可視化環或僅合法合濾鏡', check: (s) => !!s.ach && !!s.ach.merge_snap_ring },
    { id: 'late1350_run', cat: 'meta', name: '二十池開盤', blurb: '曾達 1350 浪後再開無盡（抽第二十池修飾）', check: (s) => !!s.ach && !!s.ach.late1350_run },
    { id: 'charm_lock_short', cat: 'meta', name: '鎖欄短碼', blurb: '匯出／匯入過鎖欄同步短碼', check: (s) => !!s.ach && !!s.ach.charm_lock_short },
    { id: 'dual_share_card', cat: 'meta', name: '分享對照卡', blurb: '匯出過帶折線的對照／分享卡', check: (s) => !!s.ach && !!s.ach.dual_share_card },
    { id: 'merge_fail_buzz', cat: 'meta', name: '合失敗 buzz', blurb: '聽過合失敗輕 buzz', check: (s) => !!s.ach && !!s.ach.merge_fail_buzz },
    { id: 'set_badge_hud', cat: 'meta', name: '共鳴徽記', blurb: '見過進階共鳴 HUD 徽記', check: (s) => !!s.ach && !!s.ach.set_badge_hud },
    { id: 'set_badge_detail', cat: 'meta', name: '徽記明細', blurb: '點開共鳴徽記睇過套裝明細／下一件', check: (s) => !!s.ach && !!s.ach.set_badge_detail },
    { id: 'set_equip_next', cat: 'meta', name: '一鍵裝下件', blurb: '由徽記明細一鍵裝上下一件符咒', check: (s) => !!s.ach && !!s.ach.set_equip_next },
    { id: 'set_unequip_swap', cat: 'meta', name: '卸換欄位', blurb: '徽記明細一鍵卸下或換欄位', check: (s) => !!s.ach && !!s.ach.set_unequip_swap },
    { id: 'replay_dual_custom', cat: 'meta', name: '自訂雙區間', blurb: '回放用過自填 min–max 雙區間', check: (s) => !!s.ach && !!s.ach.replay_dual_custom },
    { id: 'merge_snap_tune', cat: 'meta', name: '吸附調校', blurb: '調過合併吸附靈敏度或 buzz', check: (s) => !!s.ach && !!s.ach.merge_snap_tune },
    { id: 'replay_multi_metric', cat: 'meta', name: '多指標折線', blurb: '用過多指標疊加回放折線', check: (s) => !!s.ach && !!s.ach.replay_multi_metric },
    { id: 'replay_silver_metric', cat: 'meta', name: '銀兩折線', blurb: '回放疊加／篩選用過銀兩指標或區間', check: (s) => !!s.ach && !!s.ach.replay_silver_metric },
    { id: 'replay_damage_metric', cat: 'meta', name: '傷量折線', blurb: '回放用過傷量指標或雙區間對照', check: (s) => !!s.ach && !!s.ach.replay_damage_metric },
    { id: 'tut_all_gesture', cat: 'meta', name: '全步跟手', blurb: '教學多步見過跟手／高亮格', check: (s) => !!s.ach && !!s.ach.tut_all_gesture },
    { id: 'tut_merge_path', cat: 'meta', name: '合路徑預覽', blurb: '教學見過合併合法格路徑預覽', check: (s) => !!s.ach && !!s.ach.tut_merge_path },
    { id: 'tut_merge_snap', cat: 'meta', name: '合吸附提示', blurb: '拖拽合併見過吸附提示', check: (s) => !!s.ach && !!s.ach.tut_merge_snap },
    { id: 'charm_set_adv', cat: 'meta', name: '進階共鳴', blurb: '觸發套裝第三件進階共鳴', check: (s) => !!s.ach && !!s.ach.charm_set_adv },
    { id: 'replay_line_png', cat: 'meta', name: '折線 PNG', blurb: '匯出回放折線 PNG', check: (s) => !!s.ach && !!s.ach.replay_line_png },
    { id: 'fail_share', cat: 'meta', name: '結算分享', blurb: '從失敗／結算面板一鍵分享短碼或文字', check: (s) => !!s.ach && !!s.ach.fail_share },
    { id: 'tut_gesture_live', cat: 'meta', name: '跟手軌跡', blurb: '教學合併步跟住真實拖拽軌跡', check: (s) => !!s.ach && !!s.ach.tut_gesture_live },
    { id: 'charm_triple', cat: 'meta', name: '三欄符咒', blurb: '同時裝備 3 枚符咒', check: (s) => !!(s.equippedCharmIds && s.equippedCharmIds.filter(Boolean).length >= 3) },
    { id: 'charm_set', cat: 'meta', name: '套裝共鳴', blurb: '觸發一次符咒套裝共鳴', check: (s) => !!s.ach && !!s.ach.charm_set },
    { id: 'wall_code_copy', cat: 'meta', name: '短碼一鍵', blurb: '從分享卡一鍵複製牆短碼', check: (s) => !!s.ach && !!s.ach.wall_code_copy },
    { id: 'replay_timeline', cat: 'meta', name: '回放時間線', blurb: '用過回放時間線 scrub 或折線對照', check: (s) => !!s.ach && !!s.ach.replay_timeline },
    { id: 'tut_gesture', cat: 'meta', name: '手勢軌跡', blurb: '見過行動端教學合併手勢軌跡', check: (s) => !!s.ach && !!s.ach.tut_gesture },
    { id: 'charm_star', cat: 'meta', name: '符咒升星', blurb: '任一符咒升至 ★2 或以上', check: (s) => { const o=s.ownedCharms||{}; return Object.keys(o).some(k => (o[k]===true?1:Number(o[k])||0) >= 2); } },
    { id: 'charm_multi', cat: 'meta', name: '雙欄符咒', blurb: '同時裝備 2 枚符咒', check: (s) => !!(s.equippedCharmIds && s.equippedCharmIds.filter(Boolean).length >= 2) },
    { id: 'wall_chart_png', cat: 'meta', name: '牆圖 PNG', blurb: '匯出牆對照圖／分享卡 PNG', check: (s) => !!s.ach && !!s.ach.wall_chart_png },
    { id: 'replay_fav', cat: 'meta', name: '回放收藏', blurb: '收藏一筆無盡回放', check: (s) => !!s.ach && !!s.ach.replay_fav },
    { id: 'replay_chart', cat: 'meta', name: '回放對照圖', blurb: '見過回放對照圖表', check: (s) => !!s.ach && !!s.ach.replay_chart },
    { id: 'tut_merge_arrow', cat: 'meta', name: '合併箭嘴', blurb: '教學時見過合併升星箭嘴', check: (s) => !!s.ach && !!s.ach.tut_merge_arrow },
    { id: 'tut_wave_arrow', cat: 'meta', name: '開波箭嘴', blurb: '教學時見過開波箭嘴', check: (s) => !!s.ach && !!s.ach.tut_wave_arrow },
  ];

  /** 首通銀兩獎勵（入累計帳） */
  const STAGE_FIRST_CLEAR = {
    1: 30,
    2: 45,
    3: 60,
    4: 80,
    5: 100,
    6: 150,
    7: 200,
    8: 220,
    9: 260,
    10: 300,
    11: 340,
    12: 380,
    13: 440,
    14: 480,
    all: 600,
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
      localBest: formatLocalBestWall(s).label,
      weekStreak: s.weekStreak || 0,
      weekStreakBest: s.weekStreakBest || 0,
    };
  }

  function buildEndlessWave(n) {
    // v1.8：前期略軟、後期仍升；熔斷天鵝週期入場
    // v2.4：50–74 加厚；75+ 密度續升但血量增速略收，避免軟鎖
    const late50 = n >= 50 ? Math.min(n - 50, 25) * 0.018 : 0;
    const late75 = n >= 75 ? (n - 75) * 0.011 : 0;
    const late90 = n >= 90 ? (n - 90) * 0.008 : 0;
    const late120 = n >= 120 ? (n - 120) * 0.006 : 0;
    const late130 = n >= 130 ? Math.min(0.12, (n - 130) * 0.004) : 0;
    const late140 = n >= 140 ? Math.min(0.1, (n - 140) * 0.0035) : 0;
    const late150 = n >= 150 ? Math.min(0.1, (n - 150) * 0.003) : 0;
    const late160 = n >= 160 ? Math.min(0.1, (n - 160) * 0.0028) : 0;
    const late180 = n >= 180 ? Math.min(0.1, (n - 180) * 0.0026) : 0;
    const late200 = n >= 200 ? Math.min(0.08, (n - 200) * 0.0024) : 0;
    const late220 = n >= 220 ? Math.min(0.08, (n - 220) * 0.0022) : 0;
    const late250 = n >= 250 ? Math.min(0.08, (n - 250) * 0.002) : 0;
    const late300 = n >= 300 ? Math.min(0.08, (n - 300) * 0.0018) : 0;
    const late350 = n >= 350 ? Math.min(0.08, (n - 350) * 0.0016) : 0;
    const late400 = n >= 400 ? Math.min(0.08, (n - 400) * 0.0015) : 0;
    const late450 = n >= 450 ? Math.min(0.08, (n - 450) * 0.0014) : 0;
    const late500 = n >= 500 ? Math.min(0.06, (n - 500) * 0.0012) : 0;
    const late550 = n >= 550 ? Math.min(0.06, (n - 550) * 0.0011) : 0;
    const late600 = n >= 600 ? Math.min(0.05, (n - 600) * 0.001) : 0;
    const late650 = n >= 650 ? Math.min(0.05, (n - 650) * 0.0009) : 0;
    const late700 = n >= 700 ? Math.min(0.04, (n - 700) * 0.0008) : 0;
    const late750 = n >= 750 ? Math.min(0.04, (n - 750) * 0.0007) : 0;
    const late800 = n >= 800 ? Math.min(0.035, (n - 800) * 0.0006) : 0;
    const late850 = n >= 850 ? Math.min(0.03, (n - 850) * 0.00055) : 0;
    const late900 = n >= 900 ? Math.min(0.028, (n - 900) * 0.0005) : 0;
    const late950 = n >= 950 ? Math.min(0.026, (n - 950) * 0.00045) : 0;
    const late1000 = n >= 1000 ? Math.min(0.024, (n - 1000) * 0.0004) : 0;
    const late1050 = n >= 1050 ? Math.min(0.022, (n - 1050) * 0.00038) : 0;
    const late1100 = n >= 1100 ? Math.min(0.02, (n - 1100) * 0.00035) : 0;
    const late1150 = n >= 1150 ? Math.min(0.018, (n - 1150) * 0.00032) : 0;
    const late1200 = n >= 1200 ? Math.min(0.016, (n - 1200) * 0.0003) : 0;
    const late1250 = n >= 1250 ? Math.min(0.015, (n - 1250) * 0.00028) : 0;
    const late1300 = n >= 1300 ? Math.min(0.014, (n - 1300) * 0.00026) : 0;
    const late1350 = n >= 1350 ? Math.min(0.013, (n - 1350) * 0.00025) : 0;
    const late1400 = n >= 1400 ? Math.min(0.012, (n - 1400) * 0.00024) : 0;
    const mul = 1 + (n - 1) * 0.105 + late50 + late75 + late90 + late120 + late130 + late140 + late150 + late160 + late180 + late200 + late220 + late250 + late300 + late350 + late400 + late450 + late500 + late550 + late600 + late650 + late700 + late750 + late800 + late850 + late900 + late950 + late1000 + late1050 + late1100 + late1150 + late1200 + late1250 + late1300 + late1350 + late1400;
    const countLate = n >= 50 ? Math.min(n - 50, 25) * 0.01 + (n >= 75 ? (n - 75) * 0.006 : 0) : 0;
    const count = (base) => {
      let raw = Math.max(1, Math.round(base * (1 + (n - 1) * 0.072 + countLate)));
      // v2.4：絕對軟頂——75+ 壓力改由 Boss／精英／間隔承担，避免符紙／暗盤洪峰
      if (n >= 1350) raw = Math.min(raw, 14 + Math.min(4, Math.floor((n - 1350) / 45)));
      else if (n >= 1250) raw = Math.min(raw, 15 + Math.min(4, Math.floor((n - 1250) / 40)));
      else if (n >= 1150) raw = Math.min(raw, 16 + Math.min(4, Math.floor((n - 1150) / 35)));
      else if (n >= 1050) raw = Math.min(raw, 18 + Math.min(4, Math.floor((n - 1050) / 30)));
      else if (n >= 950) raw = Math.min(raw, 20 + Math.min(5, Math.floor((n - 950) / 25)));
      else if (n >= 850) raw = Math.min(raw, 22 + Math.min(6, Math.floor((n - 850) / 20)));
      else if (n >= 75) raw = Math.min(raw, 20 + Math.min(8, Math.floor((n - 75) / 5)));
      else if (n >= 50) raw = Math.min(raw, 26);
      else if (n >= 30) raw = Math.min(raw, 34);
      return raw;
    };
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
      spawns.push({
        enemy: 'halt_seal',
        count: count(1 + Math.floor(n / 4)),
        lane: 'random',
        interval: Math.max(0.5, 1.0 - n * 0.02),
        delay: 1.8,
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
    // v2.3：50+ 加厚；每 5 波四 Boss 輪換；每 30 三潮；每 60 四潮同場
    if (n >= 50) {
      spawns.push({
        enemy: 'dark_tape',
        count: count(2 + Math.floor((n - 50) / 3)),
        lane: 'cycle',
        interval: Math.max(0.28, 0.48 - Math.min(n - 50, 25) * 0.008),
        delay: 0.5,
        hpMul: mul * 0.95,
      });
      // 75+ 略減符紙洪峰，改以恐慌／槓桿壓節奏
      const sealN = n >= 75 ? count(1 + Math.floor((n - 50) / 5)) : count(2 + Math.floor((n - 50) / 4));
      spawns.push({
        enemy: 'halt_seal',
        count: sealN,
        lane: 'random',
        interval: n >= 75 ? 0.55 : 0.48,
        delay: 1.0,
        hpMul: mul * 0.98,
      });
    }
    if (n >= 75) {
      spawns.push({
        enemy: 'panic_board',
        count: count(1 + Math.floor((n - 75) / 4)),
        lane: 'cycle',
        interval: Math.max(0.55, 0.85 - (n - 75) * 0.01),
        delay: 1.4,
        hpMul: mul * 0.97,
      });
      if (n % 10 === 0) {
        spawns.push({
          enemy: 'leverage_fiend',
          count: 1,
          lane: 'random',
          interval: 0,
          delay: 2.8,
          elite: true,
          hpMul: mul * 1.05,
        });
      }
    }
    // v3.3／v3.5：每 80 浪五潮；雙週期（%160）雙五潮壓力微調（第二帳鏡＋HP 軟化）
    if (n >= 80 && n % 80 === 0) {
      const dualPenta = n >= 160 && n % 160 === 0;
      const soft = dualPenta ? 0.94 : 1;
      spawns.push({ enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 1.4, hpMul: mul * soft });
      spawns.push({ enemy: 'circuit_swan', count: 1, lane: 1, interval: 0, delay: 2.6, hpMul: mul * 1.05 * soft });
      spawns.push({ enemy: 'halt_tide', count: 1, lane: 2, interval: 0, delay: 3.8, hpMul: mul * 1.08 * soft });
      spawns.push({ enemy: 'ink_specter', count: 1, lane: 3, interval: 0, delay: 5.0, hpMul: mul * 1.1 * soft, inkTag: '左帳' });
      spawns.push({ enemy: 'ledger_mirage', count: 1, lane: 2, interval: 0, delay: 6.4, hpMul: mul * 1.12 * soft });
      if (dualPenta) {
        // 雙五潮：第二帳鏡稍遲入場、HP 再軟一檔
        spawns.push({
          enemy: 'ledger_mirage',
          count: 1,
          lane: 1,
          interval: 0,
          delay: 8.2,
          hpMul: mul * 1.05 * soft,
        });
      }
      spawns.push({
        enemy: 'dark_tape',
        count: count(5 + Math.floor(n / 12)),
        lane: 'cycle',
        interval: 0.36,
        delay: 0.9,
        hpMul: mul * 0.95,
      });
    } else if (n >= 60 && n % 60 === 0) {
      spawns.push({ enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 1.8, hpMul: mul });
      spawns.push({ enemy: 'circuit_swan', count: 1, lane: 1, interval: 0, delay: 3.0, hpMul: mul * 1.05 });
      spawns.push({ enemy: 'halt_tide', count: 1, lane: 2, interval: 0, delay: 4.2, hpMul: mul * 1.08 });
      spawns.push({ enemy: 'ink_specter', count: 1, lane: 3, interval: 0, delay: 5.5, hpMul: mul * 1.1 });
      spawns.push({
        enemy: 'dark_tape',
        count: count(4 + Math.floor(n / 12)),
        lane: 'cycle',
        interval: 0.4,
        delay: 1.0,
        hpMul: mul * 0.95,
      });
    } else if (n >= 30 && n % 30 === 0) {
      spawns.push({ enemy: 'black_swan', count: 1, lane: 0, interval: 0, delay: 2.0, hpMul: mul });
      spawns.push({ enemy: 'circuit_swan', count: 1, lane: 2, interval: 0, delay: 3.5, hpMul: mul * 1.05 });
      spawns.push({ enemy: 'halt_tide', count: 1, lane: 3, interval: 0, delay: 5.0, hpMul: mul * 1.08 });
      spawns.push({
        enemy: 'halt_seal',
        count: count(3 + Math.floor(n / 10)),
        lane: 'cycle',
        interval: 0.45,
        delay: 1.2,
        hpMul: mul * 0.95,
      });
    } else if (n >= 1200 && n % 20 === 0) {
      // v4.7：超千二三帥同場
      const pack = ENDLESS_TRIO_BOSS_PACKS[(Math.floor(n / 20) - 1) % ENDLESS_TRIO_BOSS_PACKS.length];
      pack.forEach(function (bossId, bi) {
        const hpBoss =
          bossId === 'circuit_swan' ? 1.08 : bossId === 'halt_tide' ? 1.1 : bossId === 'ink_specter' ? 1.12 : bossId === 'ledger_mirage' ? 1.14 : 1.05;
        spawns.push({
          enemy: bossId,
          count: 1,
          lane: (n + bi) % 4,
          interval: 0,
          delay: 2.8 + bi * 1.6,
          hpMul: mul * hpBoss,
        });
      });
      spawns.push({
        enemy: 'dark_tape',
        count: count(3 + Math.floor(n / 20)),
        lane: 'cycle',
        interval: 0.4,
        delay: 1.0,
        hpMul: mul * 0.9,
      });
    } else if (n >= 1200 && n % 10 === 0) {
      // v4.7：超千二雙帥同場
      const pack = ENDLESS_DUO_BOSS_PACKS[(Math.floor(n / 10) - 1) % ENDLESS_DUO_BOSS_PACKS.length];
      pack.forEach(function (bossId, bi) {
        const hpBoss =
          bossId === 'circuit_swan' ? 1.06 : bossId === 'halt_tide' ? 1.09 : bossId === 'ink_specter' ? 1.11 : bossId === 'ledger_mirage' ? 1.13 : 1.04;
        spawns.push({
          enemy: bossId,
          count: 1,
          lane: (n + bi * 2) % 4,
          interval: 0,
          delay: 3.0 + bi * 1.8,
          hpMul: mul * hpBoss,
        });
      });
    } else if (n >= 5 && n % 5 === 0) {
      const rot = n >= 1000 ? ENDLESS_ULTRA_BOSS_ROT : ENDLESS_BOSS_ROT;
      const bossId = rot[(Math.floor(n / 5) - 1) % rot.length];
      const bossCount = bossId === 'black_swan' ? Math.max(1, Math.floor(n / 15) || 1) : 1;
      const hpBoss =
        bossId === 'circuit_swan' ? 1.05 : bossId === 'halt_tide' ? 1.08 : bossId === 'ink_specter' ? 1.1 : bossId === 'ledger_mirage' ? 1.12 : 1;
      spawns.push({
        enemy: bossId,
        count: bossCount,
        lane: n % 4,
        interval: bossId === 'black_swan' ? 2 : 0,
        delay: bossId === 'ink_specter' ? 3.0 : bossId === 'halt_tide' ? 3.2 : 3.5,
        hpMul: mul * hpBoss,
      });
      if (bossId === 'halt_tide') {
        spawns.push({
          enemy: 'halt_seal',
          count: count(2 + Math.floor(n / 8)),
          lane: 'cycle',
          interval: 0.5,
          delay: 1.5,
          hpMul: mul * 0.95,
        });
      }
      if (bossId === 'ink_specter') {
        spawns.push({
          enemy: 'dark_tape',
          count: count(2 + Math.floor(n / 8)),
          lane: 'cycle',
          interval: 0.42,
          delay: 1.2,
          hpMul: mul * 0.92,
        });
      }
    }

    // v4.4／v4.5：超晚期 Boss 間隔＋千浪後節奏再收
    if (n >= 950) {
      const bossIds = {
        black_swan: 1,
        circuit_swan: 1,
        halt_tide: 1,
        ink_specter: 1,
        ledger_mirage: 1,
      };
      const rhythm = ultra1300Rhythm(n);
      let bossExtra =
        n >= 1400
          ? 2.0
          : n >= 1350
            ? 1.9
            : n >= 1300
              ? 1.85
              : n >= 1250
                ? 1.75
                : n >= 1200
                  ? 1.65
                  : n >= 1150
                    ? 1.55
                    : n >= 1100
                      ? 1.45
                      : n >= 1050
                        ? 1.25
                        : n >= 1000
                          ? 1.1
                          : 0.75;
      let trashMul =
        n >= 1400
          ? 1.26
          : n >= 1350
            ? 1.25
            : n >= 1300
              ? 1.24
              : n >= 1250
                ? 1.22
                : n >= 1200
                  ? 1.2
                  : n >= 1150
                    ? 1.18
                    : n >= 1100
                      ? 1.16
                      : n >= 1050
                        ? 1.12
                        : n >= 1000
                          ? 1.1
                          : 1.08;
      let intervalAdd = n >= 1050 ? 0.55 : 0.45;
      if (rhythm) {
        bossExtra = rhythm.bossGap;
        trashMul *= rhythm.trashMul;
        intervalAdd = rhythm.intervalAdd;
      }
      for (let i = 0; i < spawns.length; i++) {
        const s = spawns[i];
        if (bossIds[s.enemy]) {
          s.delay = (s.delay || 0) + bossExtra;
          if (s.interval && s.interval > 0) s.interval = s.interval + intervalAdd;
        } else if (s.interval && s.interval > 0.2) {
          s.interval = Math.min(s.interval * trashMul, s.interval + (n >= 1000 ? 0.18 : 0.12));
        }
      }
    }

    // v2.9：100+ 每 20 浪雙墨常駐週期（避開四潮整除浪）；補足至 2 帳
    if (n >= 100 && n % 20 === 0 && n % 60 !== 0 && n % 80 !== 0) {
      let haveInk = spawns.filter((s) => s.enemy === 'ink_specter').reduce((a, s) => a + (s.count || 1), 0);
      if (haveInk < 1) {
        spawns.push({ enemy: 'ink_specter', count: 1, lane: 1, interval: 0, delay: 2.4, hpMul: mul * 1.06, inkTag: '左帳' });
        haveInk += 1;
      }
      if (haveInk < 2) {
        spawns.push({ enemy: 'ink_specter', count: 1, lane: 3, interval: 0, delay: 5.2, hpMul: mul * 1.1, inkTag: '右帳' });
      }
      // 為已有墨影補 tag
      for (const s of spawns) {
        if (s.enemy === 'ink_specter' && !s.inkTag) {
          s.inkTag = (typeof s.lane === 'number' && s.lane <= 1) ? '左帳' : '右帳';
        }
      }
      spawns.push({
        enemy: 'dark_tape',
        count: count(4),
        lane: 'cycle',
        interval: 0.38,
        delay: 0.9,
        hpMul: mul * 0.94,
      });
    }
    if (n === 120 || n === 130 || n === 140 || n === 150 || n === 160 || n === 180 || n === 200 || n === 220 || n === 250 || n === 300) {
      let haveInk = spawns.filter((s) => s.enemy === 'ink_specter').reduce((a, s) => a + (s.count || 1), 0);
      if (haveInk < 1) {
        spawns.push({
          enemy: 'ink_specter',
          count: 1,
          lane: n === 130 ? 0 : 1,
          interval: 0,
          delay: 2.0,
          hpMul: mul * (n === 130 ? 1.1 : 1.08),
          inkTag: '左帳',
        });
        haveInk += 1;
      }
      if (haveInk < 2) {
        const existing = spawns.find((s) => s.enemy === 'ink_specter');
        const needLeft = !existing || existing.inkTag === '右帳' || (typeof existing.lane === 'number' && existing.lane > 1);
        spawns.push({
          enemy: 'ink_specter',
          count: 1,
          lane: needLeft ? 1 : 3,
          interval: 0,
          delay: n === 130 ? 4.8 : 5.0,
          hpMul: mul * (n === 130 ? 1.14 : 1.12),
          inkTag: needLeft ? '左帳' : '右帳',
        });
      }
      for (const s of spawns) {
        if (s.enemy === 'ink_specter' && !s.inkTag) {
          s.inkTag = typeof s.lane === 'number' && s.lane <= 1 ? '左帳' : '右帳';
        }
      }
      if (n === 120) {
        spawns.push({
          enemy: 'dark_tape',
          count: count(5),
          lane: 'cycle',
          interval: 0.36,
          delay: 0.8,
          hpMul: mul * 0.95,
        });
      }
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

  /** 召喚費曲線：同種每多召一次 +5（封頂 +45） */
  function summonCost(heroId, summonCounts) {
    const def = HEROES[heroId];
    if (!def) return 999;
    const n = (summonCounts && summonCounts[heroId]) || 0;
    return def.cost + Math.min(45, n * 5);
  }

  /** 合併回報銀兩（按目標新星級） */
  function mergeRebate(heroId, newStar) {
    const def = HEROES[heroId];
    if (!def) return 0;
    return Math.round(def.cost * 0.19 * newStar);
  }

  function activeBonds(heroes) {
    const ids = new Set(heroes.filter((h) => h.hp > 0).map((h) => h.id));
    return BONDS.filter((b) => b.need.every((id) => ids.has(id)));
  }

  function bondModsFor(heroId, bonds) {
    const mods = { atkMul: 1, cdMul: 1, tankDmgMul: 1, auraMul: 1, buffBonus: 0, highHpExtra: 0, rangeBonus: 0, markBonus: 0, markDurBonus: 0, healLowBonus: 0, lockBonus: 0, lockDurBonus: 0 };
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
      if (b.lockBonus) mods.lockBonus += b.lockBonus;
      if (b.lockDurBonus) mods.lockDurBonus += b.lockDurBonus;
    }
    return mods;
  }

  function migrateSave(raw) {
    const base = defaultSave();
    const s = Object.assign({}, base, raw || {});
    const from = Number(s.version) || 0;
    // v3.0 遷移：補齊缺欄、抬版本、標記大版本
    if (!s.ach) s.ach = {};
    if (!s.unlockedAch) s.unlockedAch = {};
    if (!s.firstClears) s.firstClears = {};
    if (!s.seenHeroes) s.seenHeroes = {};
    if (!s.seenEnemies) s.seenEnemies = {};
    if (!Array.isArray(s.wallSnapshots)) s.wallSnapshots = [];
    if (!Array.isArray(s.weekClearHistory)) s.weekClearHistory = [];
    if (!s.localBest || typeof s.localBest !== 'object') {
      s.localBest = { endless: 0, weeklyStreak: 0, stageClears: 0 };
    }
    if (s.orientDismissed == null) s.orientDismissed = false;
    if (s.a11yAnnounce == null) s.a11yAnnounce = true;
    if (s.prefersReducedMotion == null) s.prefersReducedMotion = !!s.reduceFlash;
    if (from < 30) {
      s.ach.v3_migrated = true;
      if (s.reduceFlash) s.prefersReducedMotion = true;
    }
    if (from < 31) {
      s.ach.v31_migrated = true;
    }
    if (from < 32) {
      s.ach.v32_migrated = true;
    }
    if (!Array.isArray(s.wallCompareHistory)) s.wallCompareHistory = [];
    if (from < 33) {
      s.ach.v33_migrated = true;
    }
    if (from < 34) {
      s.ach.v34_migrated = true;
    }
    if (from < 35) {
      s.ach.v35_migrated = true;
    }
    if (from < 36) {
      s.ach.v36_migrated = true;
    }
    if (from < 37) {
      s.ach.v37_migrated = true;
    }
    if (from < 38) {
      s.ach.v38_migrated = true;
    }
    if (from < 39) {
      s.ach.v39_migrated = true;
    }
    if (!Array.isArray(s.endlessReplay)) s.endlessReplay = [];
    if (!s.ownedCharms || typeof s.ownedCharms !== 'object') s.ownedCharms = {};
    // bool → star
    Object.keys(s.ownedCharms).forEach(function (k) {
      if (s.ownedCharms[k] === true) s.ownedCharms[k] = 1;
    });
    if (s.equippedCharmId == null) s.equippedCharmId = '';
    if (!Array.isArray(s.equippedCharmIds)) {
      s.equippedCharmIds = s.equippedCharmId ? [s.equippedCharmId] : [];
    }
    if (!s.endlessReplayFav || typeof s.endlessReplayFav !== 'object') s.endlessReplayFav = {};
    if (!s.mergeSnapSens) s.mergeSnapSens = 'mid';
    if (s.mergeSnapBuzz == null) s.mergeSnapBuzz = true;
    if (s.mergeSnapPx == null) {
      const map = { off: 0, low: 40, mid: 70, high: 100 };
      s.mergeSnapPx = map[s.mergeSnapSens] != null ? map[s.mergeSnapSens] : 70;
    }
    if (!Array.isArray(s.dualRangePresets)) s.dualRangePresets = [];
    if (!Array.isArray(s.charmSlotLocks)) s.charmSlotLocks = [false, false, false];
    if (s.mergeSnapRing == null) s.mergeSnapRing = true;
    if (s.mergeLegalOnly == null) s.mergeLegalOnly = true;
    if (s.mergeFailBuzz == null) s.mergeFailBuzz = true;
    s.version = Math.max(48, from, base.version || 48);
    return s;
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultSave();
      return migrateSave(JSON.parse(raw));
    } catch (_) {
      return defaultSave();
    }
  }

  function defaultSave() {
    return {
      version: 48,
      totalSilver: 0,
      totalKills: 0,
      maxStageCleared: 0,
      bestEndlessWave: 0,
      firstClears: {},
      unlocked: Object.keys(HEROES),
      lastSpeed: 1,
      skipTutorial: false,
      showCellHints: true,
      mergeSnapSens: 'mid',
      mergeSnapBuzz: true,
      mergeSnapPx: 70,
      dualRangePresets: [],
      charmSlotLocks: [false, false, false],
      mergeSnapRing: true,
      mergeLegalOnly: true,
      mergeFailBuzz: true,
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
      weekStreak: 0,
      weekStreakBest: 0,
      lastWeeklyClearKey: '',
      weekClearHistory: [],
      wallSnapshots: [],
      wallCompareHistory: [],
      endlessReplay: [],
      ownedCharms: {},
      equippedCharmId: '',
      equippedCharmIds: [],
      endlessReplayFav: {},
      localBest: { endless: 0, weeklyStreak: 0, stageClears: 0 },
      post12EndlessBonus: false,
      quadTideTutorialDone: false,
      firstBootDone: false,
      tutorialDone: false,
      orientDismissed: false,
      a11yAnnounce: true,
      prefersReducedMotion: false,
    };
  }




  function parseWallShort(code) {
    if (!code || typeof code !== 'string') return null;
    // v3.7：可選 -A{ach}-T{killsBucket}；舊短碼仍可解析
    const m = /^YL-E(\d+)-S(\d+)-M(\d+)(?:-A(\d+))?(?:-T(\d+))?-H([0-9a-fA-F]{1,8})$/.exec(code.trim());
    if (!m) return null;
    const ach = m[4] != null ? Number(m[4]) || 0 : null;
    const killsB = m[5] != null ? Number(m[5]) || 0 : null;
    let codeNorm = 'YL-E' + m[1] + '-S' + m[2] + '-M' + m[3];
    if (ach != null) codeNorm += '-A' + ach;
    if (killsB != null) codeNorm += '-T' + killsB;
    codeNorm += '-H' + String(m[6] || '').toLowerCase();
    return {
      endless: Number(m[1]) || 0,
      weekStreakBest: Number(m[2]) || 0,
      stages: Number(m[3]) || 0,
      ach: ach,
      killsBucket: killsB,
      histHash: String(m[6] || '').toLowerCase(),
      code: codeNorm,
    };
  }

  function compareWallShort(save, otherCode) {
    const mine = parseWallShort(encodeWallShort(save));
    const theirs = parseWallShort(otherCode);
    if (!mine || !theirs) {
      return { ok: false, error: '短碼格式唔啱（YL-E…-S…-M…-H…）', mine: mine, theirs: theirs };
    }
    const dE = mine.endless - theirs.endless;
    const dS = mine.weekStreakBest - theirs.weekStreakBest;
    const dM = mine.stages - theirs.stages;
    const sameHash = mine.histHash === theirs.histHash;
    const parts = [];
    parts.push(dE === 0 ? '無盡持平' : dE > 0 ? '無盡領先 +' + dE : '無盡落後 ' + dE);
    parts.push(dS === 0 ? '連週持平' : dS > 0 ? '連週領先 +' + dS : '連週落後 ' + dS);
    parts.push(dM === 0 ? '主線持平' : dM > 0 ? '主線領先 +' + dM : '主線落後 ' + dM);
    parts.push(sameHash ? '週史指紋同' : '週史指紋異');
    let dA = null;
    let dT = null;
    if (mine.ach != null && theirs.ach != null) {
      dA = mine.ach - theirs.ach;
      parts.push(dA === 0 ? '成就持平' : dA > 0 ? '成就領先 +' + dA : '成就落後 ' + dA);
    }
    if (mine.killsBucket != null && theirs.killsBucket != null) {
      dT = mine.killsBucket - theirs.killsBucket;
      parts.push(dT === 0 ? '擊殺檔持平' : dT > 0 ? '擊殺檔領先 +' + dT : '擊殺檔落後 ' + dT);
    }
    return {
      ok: true,
      mine: mine,
      theirs: theirs,
      delta: { endless: dE, weekStreakBest: dS, stages: dM, ach: dA, killsBucket: dT, sameHash: sameHash },
      summary: parts.join('｜'),
      note: '本機對照｜唔做線上排行｜短碼 v3.7',
      otherCode: theirs.code,
    };
  }

  /** 本機留底牆對照歷史（最多 12 筆） */
  function recordWallCompare(save, cmp) {
    if (!save || !cmp || !cmp.ok) return null;
    if (!Array.isArray(save.wallCompareHistory)) save.wallCompareHistory = [];
    const entry = {
      at: new Date().toISOString(),
      summary: cmp.summary,
      otherCode: cmp.otherCode || (cmp.theirs && cmp.theirs.code) || '',
      mineCode: cmp.mine && cmp.mine.code ? cmp.mine.code : '',
      delta: cmp.delta || null,
    };
    save.wallCompareHistory.push(entry);
    while (save.wallCompareHistory.length > 12) save.wallCompareHistory.shift();
    return entry;
  }

  function formatWallCompareHistory(save) {
    const arr = Array.isArray(save && save.wallCompareHistory) ? save.wallCompareHistory.slice() : [];
    arr.reverse();
    return arr.map(function (e, i) {
      let local = e.at || '';
      try {
        const d = new Date(e.at);
        if (!isNaN(d.getTime())) {
          local = new Intl.DateTimeFormat('zh-HK', {
            timeZone: 'Asia/Hong_Kong',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(d);
        }
      } catch (_) {}
      let day = '';
      try {
        const d0 = new Date(e.at);
        if (!isNaN(d0.getTime())) {
          day = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Hong_Kong',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).format(d0);
        }
      } catch (_) {}
      return {
        index: i,
        localAt: local,
        at: e.at || '',
        rawAt: e.at || '',
        day: day,
        summary: e.summary || '',
        otherCode: e.otherCode || '',
        mineCode: e.mineCode || '',
        delta: e.delta || null,
      };
    });
  }


  /** 牆對照歷史圖表（本機｜無盡／連週／主線 delta 柱） */
  function formatWallCompareChart(save, opts) {
    opts = opts || {};
    const day = opts.day || null;
    let rows = formatWallCompareHistory(save);
    if (day) {
      rows = rows.filter(function (r) {
        return wallCompareDayKey(r.at || r.rawAt) === day;
      });
    }
    const recent = rows.slice(0, 8).reverse();
    const bars = recent.map(function (r, i) {
      const d = r.delta || {};
      const e = Number(d.endless) || 0;
      const s = Number(d.weekStreakBest) || 0;
      const m = Number(d.stages) || 0;
      return {
        i: i,
        label: (r.localAt || '').slice(5, 16) || '#' + (i + 1),
        endless: e,
        week: s,
        stages: m,
        summary: r.summary || '',
      };
    });
    const maxAbs = Math.max(
      1,
      ...bars.map(function (b) {
        return Math.max(Math.abs(b.endless), Math.abs(b.week), Math.abs(b.stages));
      })
    );
    return { bars: bars, maxAbs: maxAbs, count: bars.length };
  }

  function recordEndlessReplay(save, summary) {
    if (!save) return null;
    if (!Array.isArray(save.endlessReplay)) save.endlessReplay = [];
    const entry = Object.assign(
      { at: new Date().toISOString() },
      summary || {}
    );
    save.endlessReplay.push(entry);
    while (save.endlessReplay.length > 8) save.endlessReplay.shift();
    return entry;
  }

  function formatEndlessReplayChart(curr, prev) {
    const a = curr || {};
    const b = prev || {};
    const keys = [
      { k: 'wave', name: '浪次', c: '#C9A227' },
      { k: 'kills', name: '擊殺', c: '#C45C4A' },
      { k: 'dualPenta', name: '雙五', c: '#8A9BB0' },
      { k: 'taxStacks', name: '鏡稅叠', c: '#3A7A6A' },
    ];
    const bars = keys.map(function (row) {
      return {
        key: row.k,
        name: row.name,
        color: row.c,
        curr: Number(a[row.k]) || 0,
        prev: Number(b[row.k]) || 0,
      };
    });
    const maxV = Math.max(1, ...bars.map(function (x) { return Math.max(x.curr, x.prev); }));
    return { bars: bars, max: maxV };
  }

  /** 多局折線對照（浪次／擊殺） */
  function formatFailShareText(save, opts) {
    opts = opts || {};
    const code = typeof encodeWallShort === 'function' ? encodeWallShort(save) : '';
    const wall = typeof formatLocalBestWall === 'function' ? formatLocalBestWall(save) : null;
    const lines = [
      '銀樓防衛｜結算分享 v4.2',
      opts.title || '銀樓失守',
      opts.summary || '',
      wall && wall.label ? '牆：' + wall.label : '',
      code ? '短碼：' + code : '',
      '本機｜唔做線上排行｜https://lnaltv3v.github.io/yinlou-defense/',
    ].filter(Boolean);
    return lines.join('\n');
  }

  function formatEndlessReplayMultiChart(save, opts) {
    opts = opts || {};
    const metric = opts.metric || 'wave';
    const metrics = Array.isArray(opts.metrics) && opts.metrics.length
      ? opts.metrics
      : metric === 'multi'
        ? ['wave', 'kills', 'silver']
        : [metric];
    const meta = {
      wave: { name: '浪次', color: '#C9A227' },
      kills: { name: '擊殺', color: '#C45C4A' },
      silverRain: { name: '銀雨', color: '#5A9A7A' },
      silver: { name: '銀兩', color: '#D4B45A' },
      damage: { name: '傷量', color: '#C45C4A' },
      dualPenta: { name: '雙五', color: '#8A9BB0' },
      taxStacks: { name: '鏡稅叠', color: '#3A7A6A' },
    };
    const rows = formatEndlessReplay(save, {
      favOnly: !!opts.favOnly,
      minWave: opts.minWave || null,
      maxWave: opts.maxWave || null,
    });
    const series = rows.slice(0, 8).reverse();
    const lines = metrics.map(function (key) {
      const m = meta[key] || { name: key, color: '#A89070' };
      const values = series.map(function (r) { return Number(r[key]) || 0; });
      const maxV = Math.max(1, ...values, 1);
      return {
        key: key,
        name: m.name,
        color: m.color,
        max: maxV,
        points: series.map(function (r, i) {
          return { i: i, at: r.at, fav: r.fav, v: Number(r[key]) || 0 };
        }),
      };
    });
    const maxAll = Math.max(1, ...lines.map(function (l) { return l.max; }));
    // legacy single-line fields
    const primary = lines[0] || { key: metric, max: 1, points: [] };
    return {
      metric: metrics.length > 1 ? 'multi' : primary.key,
      metrics: metrics,
      max: primary.max,
      maxAll: maxAll,
      lines: lines,
      points: series.map(function (r, i) {
        return {
          i: i,
          at: r.at,
          label: r.label,
          wave: r.wave,
          kills: r.kills,
          silverRain: r.silverRain || 0,
          silver: r.silver || 0,
          damage: r.damage || 0,
          dualPenta: r.dualPenta,
          taxStacks: r.taxStacks,
          fav: r.fav,
          v: Number(r[metrics[0]]) || 0,
        };
      }),
    };
  }

  /** 雙區間對照：兩段浪次區間平均浪／殺／銀／傷 */
  function formatReplayDualRange(save, opts) {
    opts = opts || {};
    const aMin = opts.aMin || 50;
    const aMax = opts.aMax || 99;
    const bMin = opts.bMin || 100;
    const bMax = opts.bMax || 199;
    function pack(minW, maxW, label) {
      const rows = formatEndlessReplay(save, { minWave: minW, maxWave: maxW, favOnly: !!opts.favOnly });
      const n = rows.length || 0;
      const avg = function (key) {
        if (!n) return 0;
        let s = 0;
        rows.forEach(function (r) {
          s += Number(r[key]) || 0;
        });
        return Math.round(s / n);
      };
      return {
        label: label || minW + '–' + maxW,
        min: minW,
        max: maxW,
        count: n,
        wave: avg('wave'),
        kills: avg('kills'),
        silver: avg('silver'),
        damage: avg('damage'),
        silverRain: avg('silverRain'),
      };
    }
    const a = pack(aMin, aMax, opts.aLabel || aMin + '–' + aMax);
    const b = pack(bMin, bMax, opts.bLabel || bMin + '–' + bMax);
    return {
      a: a,
      b: b,
      delta: {
        wave: b.wave - a.wave,
        kills: b.kills - a.kills,
        silver: b.silver - a.silver,
        damage: b.damage - a.damage,
      },
    };
  }


  function listDualRangePresets(save) {
    const arr = Array.isArray(save && save.dualRangePresets) ? save.dualRangePresets.slice() : [];
    return arr.filter(function (p) { return p && p.key; }).slice(0, 8);
  }

  function saveDualRangePreset(save, key, label) {
    if (!save || !key) return { ok: false, error: '無效方案' };
    if (!Array.isArray(save.dualRangePresets)) save.dualRangePresets = [];
    const lab = (label || key).slice(0, 24);
    save.dualRangePresets = save.dualRangePresets.filter(function (p) { return p && p.key !== key; });
    save.dualRangePresets.unshift({ key: key, label: lab, at: new Date().toISOString() });
    while (save.dualRangePresets.length > 8) save.dualRangePresets.pop();
    return { ok: true, presets: listDualRangePresets(save) };
  }

  function removeDualRangePreset(save, key) {
    if (!save) return { ok: false };
    if (!Array.isArray(save.dualRangePresets)) save.dualRangePresets = [];
    save.dualRangePresets = save.dualRangePresets.filter(function (p) { return p && p.key !== key; });
    return { ok: true, presets: listDualRangePresets(save) };
  }

  function encodeDualPresetShort(presets) {
    const arr = (presets || []).filter(function (p) { return p && p.key; }).slice(0, 8);
    if (!arr.length) return '';
    const body = arr
      .map(function (p) {
        return (p.key || '') + '~' + encodeURIComponent((p.label || p.key || '').slice(0, 24));
      })
      .join(';');
    return 'YD47.' + body;
  }

  function decodeDualPresetShort(code) {
    if (!code || typeof code !== 'string') return { ok: false, error: '空短碼' };
    const raw = code.trim();
    if (raw.indexOf('YD47.') !== 0) return { ok: false, error: '短碼前綴須 YD47.' };
    const body = raw.slice(5);
    if (!body) return { ok: false, error: '短碼無內容' };
    const presets = [];
    body.split(';').forEach(function (part) {
      if (!part) return;
      const til = part.indexOf('~');
      const key = til >= 0 ? part.slice(0, til) : part;
      let label = til >= 0 ? part.slice(til + 1) : key;
      try {
        label = decodeURIComponent(label);
      } catch (_) {}
      if (/^\d+-\d+\|\d+-\d+$/.test(key)) {
        presets.push({ key: key, label: (label || key).slice(0, 24) });
      }
    });
    if (!presets.length) return { ok: false, error: '短碼無有效方案' };
    return { ok: true, presets: presets.slice(0, 8) };
  }

  function importDualPresetShort(save, code) {
    const decoded = decodeDualPresetShort(code);
    if (!decoded.ok) return decoded;
    if (!save) return { ok: false, error: '無存檔' };
    if (!Array.isArray(save.dualRangePresets)) save.dualRangePresets = [];
    decoded.presets.reverse().forEach(function (p) {
      saveDualRangePreset(save, p.key, p.label);
    });
    return { ok: true, presets: listDualRangePresets(save) };
  }

  function exportDualPresetsShort(save) {
    return encodeDualPresetShort(listDualRangePresets(save));
  }

  /** 鎖欄＋裝備跨裝置短碼 YD48L.id+0/1,... */
  function encodeCharmLockShort(save) {
    if (!save) return '';
    normalizeOwnedCharms(save);
    const locks = normalizeCharmSlotLocks(save);
    const ids = getEquippedCharmIds(save);
    if (!ids.length && !locks.some(Boolean)) return '';
    const parts = [];
    for (let i = 0; i < CHARM_EQUIP_SLOTS; i++) {
      const id = ids[i] || '';
      if (!id && !locks[i]) continue;
      parts.push((id || '_') + '+' + (locks[i] ? '1' : '0'));
    }
    return parts.length ? 'YD48L.' + parts.join(',') : '';
  }

  function decodeCharmLockShort(code) {
    if (!code || typeof code !== 'string') return { ok: false, error: '空短碼' };
    const raw = code.trim();
    if (raw.indexOf('YD48L.') !== 0) return { ok: false, error: '短碼前綴須 YD48L.' };
    const body = raw.slice(6);
    if (!body) return { ok: false, error: '短碼無內容' };
    const slots = [];
    const locks = [false, false, false];
    body.split(',').forEach(function (part, i) {
      if (!part || i >= CHARM_EQUIP_SLOTS) return;
      const plus = part.lastIndexOf('+');
      const id = plus >= 0 ? part.slice(0, plus) : part;
      const lk = plus >= 0 ? part.slice(plus + 1) : '0';
      slots.push(id === '_' ? '' : id);
      locks[i] = lk === '1';
    });
    return { ok: true, ids: slots.filter(Boolean), locks: locks, rawSlots: slots };
  }

  function importCharmLockShort(save, code) {
    const decoded = decodeCharmLockShort(code);
    if (!decoded.ok) return decoded;
    if (!save) return { ok: false, error: '無存檔' };
    normalizeOwnedCharms(save);
    const out = [];
    (decoded.rawSlots || decoded.ids || []).forEach(function (id) {
      if (!id) return;
      if (charmStarOf(save, id) <= 0) return; // skip unowned
      if (out.indexOf(id) < 0 && out.length < CHARM_EQUIP_SLOTS) out.push(id);
    });
    save.equippedCharmIds = out;
    save.equippedCharmId = out[0] || '';
    save.charmSlotLocks = (decoded.locks || [false, false, false]).slice(0, CHARM_EQUIP_SLOTS);
    while (save.charmSlotLocks.length < CHARM_EQUIP_SLOTS) save.charmSlotLocks.push(false);
    return { ok: true, equipped: out.slice(), locks: save.charmSlotLocks.slice() };
  }

  function exportCharmLockShort(save) {
    return encodeCharmLockShort(save);
  }

  function mergeSnapStarColor(star) {
    const colors = ['#8a9aaa', '#5a9a7a', '#3a8aba', '#C9A227', '#d4784a', '#e8dcc8'];
    const s = Math.max(1, Math.min(5, Number(star) || 1));
    return colors[s - 1] || colors[0];
  }


  function mergeSnapRadius(save, isTouch) {
    let px = save && save.mergeSnapPx;
    if (px == null) {
      const map = { off: 0, low: 40, mid: 70, high: 100 };
      px = map[(save && save.mergeSnapSens) || 'mid'] || 70;
    }
    px = Math.max(0, Math.min(120, Number(px) || 0));
    if (px <= 0) return 0;
    return isTouch ? Math.round(px * 1.15) : px;
  }

  function syncMergeSnapDevice(save) {
    try {
      if (typeof localStorage === 'undefined' || !save) return;
      localStorage.setItem('yd_merge_snap_px', String(save.mergeSnapPx != null ? save.mergeSnapPx : 70));
      localStorage.setItem('yd_merge_snap_buzz', save.mergeSnapBuzz === false ? '0' : '1');
    } catch (_) {}
  }

  function loadMergeSnapDevice(save) {
    try {
      if (typeof localStorage === 'undefined' || !save) return save;
      const px = localStorage.getItem('yd_merge_snap_px');
      if (px != null && px !== '') {
        save.mergeSnapPx = Math.max(0, Math.min(120, Number(px) || 0));
        if (save.mergeSnapPx <= 0) save.mergeSnapSens = 'off';
        else if (save.mergeSnapPx < 50) save.mergeSnapSens = 'low';
        else if (save.mergeSnapPx < 85) save.mergeSnapSens = 'mid';
        else save.mergeSnapSens = 'high';
      }
      const bz = localStorage.getItem('yd_merge_snap_buzz');
      if (bz === '0') save.mergeSnapBuzz = false;
      if (bz === '1') save.mergeSnapBuzz = true;
    } catch (_) {}
    return save;
  }

  function formatEndlessReplayTimeline(save) {
    const rows = formatEndlessReplay(save, {});
    return {
      count: rows.length,
      entries: rows.map(function (r, i) {
        return {
          index: i,
          at: r.at,
          label: r.label,
          wave: r.wave,
          kills: r.kills,
          dualPenta: r.dualPenta,
          taxStacks: r.taxStacks,
          fav: r.fav,
          mods: r.mods,
          bosses: r.bosses,
          charm: r.charm,
        };
      }),
    };
  }

  function toggleEndlessReplayFav(save, at) {
    if (!save || !at) return false;
    if (!save.endlessReplayFav || typeof save.endlessReplayFav !== 'object') save.endlessReplayFav = {};
    if (save.endlessReplayFav[at]) {
      delete save.endlessReplayFav[at];
      return false;
    }
    save.endlessReplayFav[at] = true;
    return true;
  }

  function compareEndlessReplay(curr, prev) {
    if (!curr) return null;
    if (!prev) {
      return {
        ok: true,
        first: true,
        summary: '首局回放｜尚無上一局可對',
        delta: null,
      };
    }
    const dW = (curr.wave || 0) - (prev.wave || 0);
    const dK = (curr.kills || 0) - (prev.kills || 0);
    const dD = (curr.dualPenta || 0) - (prev.dualPenta || 0);
    const dT = (curr.taxStacks || 0) - (prev.taxStacks || 0);
    const parts = [];
    parts.push(dW === 0 ? '浪次持平' : dW > 0 ? '浪次 +' + dW : '浪次 ' + dW);
    parts.push(dK === 0 ? '擊殺持平' : dK > 0 ? '擊殺 +' + dK : '擊殺 ' + dK);
    parts.push(dD === 0 ? '雙五持平' : dD > 0 ? '雙五 +' + dD : '雙五 ' + dD);
    parts.push(dT === 0 ? '鏡稅叠持平' : dT > 0 ? '叠 +' + dT : '叠 ' + dT);
    if ((curr.charm || '') !== (prev.charm || '')) {
      parts.push('符咒 ' + (prev.charm || '無') + '→' + (curr.charm || '無'));
    }
    return {
      ok: true,
      first: false,
      summary: parts.join('｜'),
      delta: { wave: dW, kills: dK, dualPenta: dD, taxStacks: dT },
      prevLabel:
        '第' + (prev.wave || 0) + '浪｜殺' + (prev.kills || 0) + (prev.charm ? '｜' + prev.charm : ''),
      currLabel:
        '第' + (curr.wave || 0) + '浪｜殺' + (curr.kills || 0) + (curr.charm ? '｜' + curr.charm : ''),
    };
  }

  function formatEndlessReplay(save, opts) {
    opts = opts || {};
    const fav = (save && save.endlessReplayFav) || {};
    let arr = Array.isArray(save && save.endlessReplay) ? save.endlessReplay.slice() : [];
    arr = arr
      .slice()
      .reverse()
      .map(function (e) {
        return {
          at: e.at || '',
          wave: e.wave || 0,
          kills: e.kills || 0,
          dualPenta: e.dualPenta || 0,
          silverRain: e.silverRain || 0,
          silver: e.silver || 0,
          damage: e.damage || 0,
          charm: e.charm || '',
          taxStacks: e.taxStacks || 0,
          mods: e.mods || '',
          bosses: e.bosses || '',
          fav: !!(e.at && fav[e.at]),
          label:
            '第' +
            (e.wave || 0) +
            '浪｜殺' +
            (e.kills || 0) +
            (e.silver ? '｜銀' + e.silver : '') +
            (e.charm ? '｜' + e.charm : '') +
            (e.dualPenta ? '｜雙五×' + e.dualPenta : ''),
        };
      });
    if (opts.favOnly) arr = arr.filter(function (r) { return r.fav; });
    if (opts.minWave) arr = arr.filter(function (r) { return (r.wave || 0) >= opts.minWave; });
    if (opts.maxWave) arr = arr.filter(function (r) { return (r.wave || 0) <= opts.maxWave; });
    return arr;
  }

  function exportWallCompareHistory(save, opts) {
    opts = opts || {};
    const day = opts.day || null; // 'YYYY-MM-DD' Asia/Hong_Kong or null=all
    let rows = formatWallCompareHistory(save);
    if (day) {
      rows = rows.filter(function (r) {
        return wallCompareDayKey(r.at || r.rawAt) === day;
      });
    }
    const lines = [
      '銀樓防衛｜牆對照歷史（本機）｜v3.9' + (day ? '｜日=' + day : '｜全日'),
    ];
    if (!rows.length) lines.push('（尚無留底）');
    for (const r of rows) {
      lines.push(
        (r.localAt || '') +
          '｜' +
          (r.summary || '') +
          (r.otherCode ? '｜← ' + r.otherCode : '') +
          (r.mineCode ? '｜我方 ' + r.mineCode : '')
      );
    }
    return lines.join('\n');
  }

  function wallCompareDayKey(isoOrLocal) {
    if (!isoOrLocal) return '';
    try {
      const d = new Date(isoOrLocal);
      if (isNaN(d.getTime())) return String(isoOrLocal).slice(0, 10);
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Hong_Kong',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d);
    } catch (_) {
      return String(isoOrLocal).slice(0, 10);
    }
  }

  function listWallCompareDays(save) {
    const arr = Array.isArray(save && save.wallCompareHistory) ? save.wallCompareHistory : [];
    const set = {};
    for (const e of arr) {
      const k = wallCompareDayKey(e.at);
      if (k) set[k] = (set[k] || 0) + 1;
    }
    return Object.keys(set)
      .sort()
      .reverse()
      .map(function (k) {
        return { day: k, count: set[k] };
      });
  }

  function exportWallCompareHistoryJson(save, opts) {
    opts = opts || {};
    const day = opts.day || null;
    let rows = formatWallCompareHistory(save);
    if (day) {
      rows = rows.filter(function (r) {
        return wallCompareDayKey(r.at || r.rawAt) === day;
      });
    }
    return JSON.stringify(
      {
        app: 'yinlou-defense',
        ver: '3.9.0',
        exportedAt: new Date().toISOString(),
        day: day,
        count: rows.length,
        rows: rows,
      },
      null,
      2
    );
  }

  function clearWallCompareHistory(save) {
    if (!save) return false;
    save.wallCompareHistory = [];
    return true;
  }

  /**
   * 匯入牆對照歷史 JSON（v3.5+ export 或 {rows:[...]}／陣列）。
   * 合併進本機留底；可抽出 short／otherCode 供對照。
   */
  function importWallCompareHistory(save, raw) {
    if (!save) return { ok: false, error: '無存檔' };
    let data = raw;
    if (typeof raw === 'string') {
      const s = raw.trim();
      if (!s) return { ok: false, error: '空白內容' };
      try {
        data = JSON.parse(s);
      } catch (_) {
        // 純文字：每行含 YL-E… 短碼則當 otherCode 列
        const lines = s.split(/\r?\n/).map(function (l) {
          return l.trim();
        }).filter(Boolean);
        const rows = [];
        for (const line of lines) {
          const m = /YL-E\d+-S\d+-M\d+-H[0-9a-fA-F]+/.exec(line);
          if (m) {
            rows.push({
              at: new Date().toISOString(),
              summary: '匯入短碼',
              otherCode: m[0],
              mineCode: '',
              imported: true,
            });
          }
        }
        if (!rows.length) return { ok: false, error: '認唔到 JSON 或短碼' };
        data = { rows: rows };
      }
    }
    let rows = [];
    if (Array.isArray(data)) rows = data;
    else if (data && Array.isArray(data.rows)) rows = data.rows;
    else if (data && data.otherCode) rows = [data];
    else return { ok: false, error: '格式唔啱（要 rows 或短碼）' };

    if (!Array.isArray(save.wallCompareHistory)) save.wallCompareHistory = [];
    let added = 0;
    const codes = [];
    for (const r of rows) {
      if (!r || typeof r !== 'object') continue;
      const entry = {
        at: r.at || new Date().toISOString(),
        summary: r.summary || '匯入對照',
        otherCode: r.otherCode || r.code || '',
        mineCode: r.mineCode || '',
        delta: r.delta || null,
        imported: true,
      };
      if (!entry.otherCode && r.theirs && r.theirs.code) entry.otherCode = r.theirs.code;
      save.wallCompareHistory.push(entry);
      added += 1;
      if (entry.otherCode) codes.push(entry.otherCode);
    }
    while (save.wallCompareHistory.length > 24) save.wallCompareHistory.shift();
    return { ok: true, added: added, codes: codes, lastCode: codes.length ? codes[codes.length - 1] : '' };
  }

  function listBossPreviews() {
    const tips = {
      black_swan: { threat: '減速震核', counter: '鐵衛頂前 · 逼空收割 · 合星再開' },
      circuit_swan: { threat: '停刀鐘響', counter: '甲厚內息撐窗 · 鎖倉減攻' },
      halt_tide: { threat: '臨停潮湧', counter: '先清符 · 鎖倉鐵壁 · 再軋潮心' },
      ink_specter: { threat: '抽銀降攻', counter: '護銀分路 · 鎖倉減抽 · 清暗盤' },
      ledger_mirage: { threat: '鏡稅封庫', counter: '鐵衛頂前 · 鎖倉減抽 · 鏡稅空檔合星' },
    };
    return Object.keys(ENEMIES)
      .map(function (id) {
        return ENEMIES[id];
      })
      .filter(function (d) {
        return d && d.boss;
      })
      .map(function (d) {
        const tip = tips[d.id] || { threat: 'Boss', counter: '合星穩陣 · 鐵衛頂前' };
        return {
          id: d.id,
          name: d.name,
          color: d.color || '#C9A227',
          entrance: d.entrance || (d.skill && d.skill.blurb) || d.lore || '',
          skill: d.skill ? d.skill.name + ' — ' + (d.skill.blurb || '') : '',
          threat: tip.threat,
          counter: tip.counter,
          hp: d.hp,
          atk: d.atk,
          reward: d.reward,
        };
      });
  }

  function formatWallTimeline(save) {
    const snaps = Array.isArray(save && save.wallSnapshots) ? save.wallSnapshots.slice() : [];
    // 新→舊
    snaps.reverse();
    function fmtDelta(n, label) {
      if (!n) return label + '持平';
      return label + (n > 0 ? '+' + n : String(n));
    }
    return snaps.map(function (s, i) {
      const at = s.at || '';
      let local = at;
      try {
        const d = new Date(at);
        if (!isNaN(d.getTime())) {
          local = new Intl.DateTimeFormat('zh-HK', {
            timeZone: 'Asia/Hong_Kong',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(d);
        }
      } catch (_) {}
      const reasonMap = {
        endless: '無盡刷新',
        weekly: '週挑戰',
        manual: '手動',
        post12: '全破入無盡',
        auto: '自動',
        test: '測試',
      };
      const older = snaps[i + 1] || null;
      let delta = null;
      let deltaLabel = '';
      if (older) {
        const dE = (s.endless || 0) - (older.endless || 0);
        const dS = (s.weekStreakBest || 0) - (older.weekStreakBest || 0);
        const dM = (s.stages || 0) - (older.stages || 0);
        delta = { endless: dE, weekStreakBest: dS, stages: dM };
        deltaLabel = [fmtDelta(dE, '無盡'), fmtDelta(dS, '連週'), fmtDelta(dM, '主線')].join('｜');
      } else {
        deltaLabel = '基準快照';
      }
      return {
        index: i,
        at: at,
        localAt: local,
        reason: s.reason || 'auto',
        reasonLabel: reasonMap[s.reason] || s.reason || '自動',
        code: s.code || '',
        short: s.short || s.code || '',
        endless: s.endless || 0,
        weekStreakBest: s.weekStreakBest || 0,
        stages: s.stages || 0,
        delta: delta,
        deltaLabel: deltaLabel,
      };
    });
  }


  function formatWallSparkline(save) {
    const snaps = Array.isArray(save && save.wallSnapshots) ? save.wallSnapshots.slice() : [];
    if (!snaps.length) {
      return { bars: '', label: '尚無快照', endless: [], week: [], stages: [] };
    }
    // 舊→新
    const chron = snaps.slice();
    const chars = '▁▂▃▄▅▆▇█';
    function barsFor(key) {
      const vals = chron.map((s) => Number(s[key]) || 0);
      const max = Math.max.apply(null, vals.concat([1]));
      const bars = vals
        .map((v) => chars[Math.min(7, Math.floor((v / max) * 7))])
        .join('');
      return { bars: bars, vals: vals };
    }
    const e = barsFor('endless');
    const w = barsFor('weekStreakBest');
    const m = barsFor('stages');
    const last = chron[chron.length - 1] || {};
    const first = chron[0] || {};
    const dE = (last.endless || 0) - (first.endless || 0);
    const label =
      '無盡 ' +
      e.bars +
      '（' +
      e.vals.join('→') +
      '）｜連週 ' +
      w.bars +
      '｜主線 ' +
      m.bars +
      (dE ? '｜全程無盡' + (dE > 0 ? '+' : '') + dE : '');
    return {
      bars: e.bars,
      label: label,
      endless: e.vals,
      week: w.vals,
      stages: m.vals,
    };
  }

  function recordWallSnapshot(save, reason) {
    if (!save) return null;
    if (!Array.isArray(save.wallSnapshots)) save.wallSnapshots = [];
    const w = formatLocalBestWall(save);
    const code = encodeWallShort(save);
    const last = save.wallSnapshots[save.wallSnapshots.length - 1];
    if (last && last.code === code && last.reason === (reason || 'auto')) return last;
    const snap = {
      at: new Date().toISOString(),
      reason: reason || 'auto',
      code: code,
      endless: w.endless,
      weekStreakBest: w.weekStreakBest,
      stages: w.stages,
      short: w.short,
    };
    save.wallSnapshots.push(snap);
    while (save.wallSnapshots.length > 12) save.wallSnapshots.shift();
    return snap;
  }

  function encodeWallShort(save) {
    const w = formatLocalBestWall(save);
    // v3.7 短碼：YL-E{endless}-S{streakBest}-M{stages}-A{ach}-T{killsBucket}-H{histHash}
    const hist = (w.history || []).join(',');
    let h = 0;
    for (let i = 0; i < hist.length; i++) h = ((h << 5) - h + hist.charCodeAt(i)) | 0;
    const hex = (h >>> 0).toString(16).slice(0, 4);
    const achN = Object.keys((save && save.unlockedAch) || {}).length;
    const killsB = Math.floor(((save && save.totalKills) || 0) / 100);
    return (
      'YL-E' +
      w.endless +
      '-S' +
      w.weekStreakBest +
      '-M' +
      w.stages +
      '-A' +
      achN +
      '-T' +
      killsB +
      '-H' +
      hex
    );
  }

  function exportLocalWallShare(save) {
    const w = formatLocalBestWall(save);
    const code = encodeWallShort(save);
    return {
      code: code,
      text: '銀樓防衛本地牆短碼 v3.7（本機｜加厚 A/T｜唔做線上排行）\n' + code + '\n' + w.short + '\n' + w.label,
      wall: w,
    };
  }

  function exportLocalWallJson(save) {
    const wall = formatLocalBestWall(save);
    const wp = formatWeekProgress(save);
    const payload = {
      meta: {
        game: 'yinlou-defense',
        kind: 'local-best-wall',
        exportedAt: new Date().toISOString(),
        version: (save && save.version) || 27,
        note: '本機進度牆｜唔做線上排行',
      },
      wall: wall,
      week: {
        weekKey: wp.weekKey,
        dailyN: wp.dailyN,
        weeklyDone: wp.weeklyDone,
        weekStreak: wp.weekStreak,
        weekStreakBest: wp.weekStreakBest,
        label: wp.label,
      },
      history: wall.history || [],
      snapshots: wall.snapshots || [],
      shortCode: encodeWallShort(save),
    };
    return JSON.stringify(payload, null, 2);
  }

  function exportLocalWallText(save) {
    const wall = formatLocalBestWall(save);
    const wp = formatWeekProgress(save);
    const lines = [
      '銀樓防衛｜本地最佳牆（本機｜唔做線上排行）',
      '匯出時間：' + new Date().toISOString(),
      wall.label,
      '本週：' + wp.label,
      '——',
    ];
    (wall.lines || []).forEach(function (ln) {
      lines.push(ln.name + '：' + ln.value + '（' + (ln.pct || 0) + '%）');
    });
    if (wall.history && wall.history.length) {
      lines.push('近週通關：' + wall.history.join('、'));
    }
    if (wall.snapshots && wall.snapshots.length) {
      lines.push('近牆快照：' + wall.snapshots.slice(-4).map(function (s) { return (s.short || s.code) + '(' + (s.reason || '') + ')'; }).join('、'));
    }
    lines.push('短碼：' + encodeWallShort(save));
    return lines.join('\n');
  }

  function exportSaveJson(save) {
    const payload = {
      meta: { game: 'yinlou-defense', exportedAt: new Date().toISOString(), version: save.version || 22 },
      save: { ...defaultSave(), ...save },
    };
    return JSON.stringify(payload, null, 2);
  }

  function importSaveJson(raw) {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const body = data && data.save ? data.save : data;
    if (!body || typeof body !== 'object') throw new Error('無效存檔');
    return migrateSave(body);
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
    if (stage && stage.id === 13) {
      const lu = LINEUPS.find((x) => x && x.id === 'ink_guard') || LINEUPS[0];
      return {
        lineup: lu,
        reason: '墨影翻帳——護銀抗墨：鐵衛＋鎖倉清影',
        tips: ['鐵衛頂前減抽', '鎖倉壓墨影弱化窗', '合星階梯回補被抽銀兩'],
      };
    }
    if (stage && stage.id === 14) {
      const lu = LINEUPS.find((x) => x && x.id === 'ink_guard') || LINEUPS[0];
      return {
        lineup: lu,
        reason: '雙墨夜帳——分路護銀：鐵衛雙線＋鎖倉減抽＋合星階梯',
        tips: [
          '左帳（lane 0–1／上線）：鐵衛＋鎖倉頂前，優先減抽',
          '右帳（lane 2–3／下線）：第二鐵衛或刀客清影，唔好兩邊都空',
          '末波兩帳分先後入場——先清早到嗰邊，合星階梯回補銀兩',
        ],
        lanes: { left: '左帳｜上線 lane0–1', right: '右帳｜下線 lane2–3' },
      };
    }
    if (stage && stage.id === 15) {
      const lu = LINEUPS.find((x) => x && x.id === 'ink_guard') || LINEUPS[0];
      return {
        lineup: lu,
        reason: '帳鏡夜市——護銀抗鏡：鐵衛＋鎖倉，鏡稅空檔合星',
        tips: [
          '鏡稅封庫時唔好硬合星——等空檔再合',
          '鐵衛頂前、鎖倉減抽；墨影試探先清暗盤',
          '末波帳鏡蜃壓軸——合星階梯回補被縮銀兩',
        ],
      };
    }
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
      const lu = LINEUPS.find((x) => x && x.id === id);
      if (lu && sc >= score) {
        score = sc;
        best = lu;
      }
    };
    if (endless) {
      pick('arb_hedge', 5);
      pick('dark_night', 4);
      return {
        lineup: best,
        reason: '無盡浪種雜——跨 lane／標記收割較穩',
        tips: ['跨 lane 標記收割', '100+ 留意雙墨週期', '合星階梯撐銀流'],
      };
    }
    const focusMeta = (weekly && stage && stage.weeklyMeta) || (daily && stage && stage.dailyMeta);
    if (focusMeta) {
      const f = focusMeta.focus;
      if (f === 'dark_tape') pick('dark_night', 8);
      else if (f === 'panic_board') pick('arb_hedge', 7);
      else if (f === 'black_swan' || f === 'leverage_fiend') pick('squeeze', 8);
      else if (f === 'circuit_swan' || f === 'dual_swan') pick('squeeze_lock', 9);
      else if (f === 'halt_tide' || f === 'halt_seal') pick('halt_lock', 9);
      else if (f === 'triple_tide') pick('halt_lock', 10);
      else if (f === 'margin_call') {
        pick('iron_wall', 7);
        pick('dip_div', 6);
      } else if (f === 'rumor_swarm') pick('leverage', 6);
      else pick('bull_bear', 5);
      const kind = weekly ? '週挑戰' : '每日';
      const metaTips = {
        dark_night: ['標記暗盤', '劍減速', '鐵衛頂前'],
        arb_hedge: ['行者跨 lane', '點殺恐慌', '合星補銀'],
        squeeze: ['軋空高血', '鼓手開倉', 'Boss 合星'],
        squeeze_lock: ['軋空＋鎖倉', '鐵衛頂雙羽', '合 3 星'],
        halt_lock: ['先清符', '鎖倉減攻', '劍收割'],
        iron_wall: ['鐵衛頂', '隱士回血', '刀客後排'],
        dip_div: ['雙奶穩核', '鐵衛頂', '殘血急救'],
        leverage: ['範圍清潮', '刺客打後', '鐵衛頂'],
        bull_bear: ['近遠互補', '鼓手加攻', '合星再開'],
        ink_guard: ['護銀分路', '鎖倉減抽', '合星回補'],
      };
      return {
        lineup: best,
        reason: kind + '焦點「' + (focusMeta.blurb || f) + '」',
        tips: metaTips[best.id] || ['跟芯片召齊', '合 2–3 星', '前坦後輸出'],
      };
    }
    // 第 1 關固定偏新手鐵壁
    if (stage && stage.id === 1) {
      return {
        lineup: LINEUPS[0],
        reason: '教學關——鐵衛＋隱士＋刀客最穩',
        tips: ['鐵衛放前排', '隱士中排回血', '刀客後排輸出；合 2 星再開波'],
      };
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
    const halt = counts.halt_seal || 0;
    pick('lock_wall', 2 + (halt > 5 ? 6 : 0) + (stage && stage.id === 7 ? 5 : 0));
    let reason = '均衡起步';
    if (best.id === 'lock_wall') reason = '停牌／斷索——鎖倉減攻＋鐵壁';
    else if (best.id === 'dark_night') reason = '暗盤影偏多——標記＋劍減速';
    else if (best.id === 'arb_hedge') reason = '恐慌／雜浪——跨 lane 點殺';
    else if (best.id === 'squeeze') reason = 'Boss／高血多——軋空收割';
    else if (best.id === 'leverage') reason = '傳聞蚊／槓桿潮——範圍清場';
    else if (best.id === 'iron_wall') reason = '追保／前壓——鐵壁更穩';
    else if (best.id === 'bull_bear') reason = '多空齊開——近遠互補';
    else if (best.id === 'squeeze_lock') reason = '雙天鵝／熔斷——軋空鎖倉';
    else if (best.id === 'halt_lock') reason = '停牌潮——臨停鎖倉';
    const tipMap = {
      iron_wall: ['鐵衛前排頂', '隱士中排', '刀客後排；合星優先'],
      bull_bear: ['刀劍同場', '鼓手加攻', '對潮怪先減速'],
      leverage: ['狂僧清潮', '刺客打後', '鐵衛頂前'],
      squeeze: ['逼空打高血', '鼓手開倉', 'Boss 波合星'],
      arb_hedge: ['行者跨 lane', '劍減速', '鐵衛頂恐慌'],
      dark_night: ['掮客標記', '劍收割', '先清暗盤影'],
      dip_div: ['雙奶穩核', '鐵衛頂', '殘血急救'],
      lock_wall: ['鎖倉減攻', '鐵衛頂', '隱士回血'],
      squeeze_lock: ['逼空＋鎖倉', '鐵衛頂雙羽', '合 3 星再開'],
      halt_lock: ['鐵筆減攻', '先清符', '劍減速收割'],
      ink_guard: ['護銀分路', '鎖倉減抽', '合星階梯回補'],
    };
    const tips = tipMap[best.id] || ['跟芯片召齊', '合 2–3 星再開波', '前坦後輸出'];
    return { lineup: best, reason: reason, tips: tips };
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
    QUAD_TIDE_LESSON,
    STUCK_TIPS,
    RUN_MODIFIERS,
    MAX_STAR,
    UPGRADE_PATHS,
    upgradeCost,
    upgradeLabel,
    ENDLESS_MILESTONES,
    RUN_MODIFIERS_90,
    RUN_MODIFIERS_100,
    RUN_MODIFIERS_140,
    RUN_MODIFIERS_150,
    RUN_MODIFIERS_160,
    RUN_MODIFIERS_180,
    RUN_MODIFIERS_220,
    RUN_MODIFIERS_300,
    RUN_MODIFIERS_350,
    RUN_MODIFIERS_400,
    RUN_MODIFIERS_450,
    RUN_MODIFIERS_550,
    RUN_MODIFIERS_650,
    RUN_MODIFIERS_750,
    RUN_MODIFIERS_850,
    RUN_MODIFIERS_950,
    RUN_MODIFIERS_1050,
    RUN_MODIFIERS_1150,
    RUN_MODIFIERS_1250,
    RUN_MODIFIERS_1350,
    ENDLESS_BOSS_ROT,
    ENDLESS_ULTRA_BOSS_ROT,
    ENDLESS_DUO_BOSS_PACKS,
    ENDLESS_TRIO_BOSS_PACKS,
    ENDLESS_ULTRA1300_RHYTHM,
    ultra1300Rhythm,
    DUAL_PENTA_CHARMS,
    pickDualPentaCharm,
    charmAsModifier,
    findCharmById,
    unlockCharm,
    equipCharm,
    swapCharmSlots,
    recommendCharmSetEquip,
    normalizeCharmSlotLocks,
    isCharmSlotLocked,
    toggleCharmSlotLock,
    getEquippedCharm,
    getEquippedCharms,
    getEquippedCharmIds,
    listOwnedCharms,
    upgradeCharmStar,
    charmStarOf,
    normalizeOwnedCharms,
    CHARM_MAX_STAR,
    CHARM_EQUIP_SLOTS,
    CHARM_SET_DEFS,
    charmSetResonance,
    charmSetAsModifiers,
    charmSetProgress,
    formatCharmSetDetailHtml,
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
    formatLocalBestWall,
    hkPrevWeekKey,
    recordWeeklyStreak,
    endlessModifiers,
    pickModifiers,
    buildModContext,
    modifierLabel,
    hkDateString,
    waveClearBonus,
    endlessMilestone,
    WAVE_EVENTS,
    pickWaveEvent,
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
    migrateSave,
    exportSaveJson,
    exportLocalWallJson,
    exportLocalWallText,
    encodeWallShort,
    parseWallShort,
    compareWallShort,
    recordWallCompare,
    formatWallCompareHistory,
    exportWallCompareHistory,
    exportWallCompareHistoryJson,
    listWallCompareDays,
    wallCompareDayKey,
    clearWallCompareHistory,
    importWallCompareHistory,
    formatWallCompareChart,
    recordEndlessReplay,
    formatEndlessReplay,
    compareEndlessReplay,
    formatEndlessReplayChart,
    formatEndlessReplayMultiChart,
    formatReplayDualRange,
    listDualRangePresets,
    saveDualRangePreset,
    removeDualRangePreset,
    exportDualPresetsShort,
    mergeSnapStarColor,
    exportCharmLockShort,
    importCharmLockShort,
    decodeCharmLockShort,
    encodeCharmLockShort,
    importDualPresetShort,
    decodeDualPresetShort,
    encodeDualPresetShort,
    mergeSnapRadius,
    syncMergeSnapDevice,
    loadMergeSnapDevice,
    formatFailShareText,
    formatEndlessReplayTimeline,
    toggleEndlessReplayFav,
    recordWallSnapshot,
    formatWallTimeline,
    formatWallSparkline,
    listBossPreviews,
    exportLocalWallShare,
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
