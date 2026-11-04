/**
 * 銀樓防衛 — 靜態資料 v2.3.0
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
      entrance: '黑羽驚惶入場 — 全體短暫減速＋核心震盪',
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
      entrance: '熔斷鐘入場 — 全場停刀＋核心震盪；鄰近敵短暫加速',
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
      entrance: '停牌潮湧入 — 範圍臨停＋核心震盪；鄰近停牌符短暫加速',
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
      entrance: '墨影翻帳入場 — 範圍降攻＋抽銀＋核心震盪；鄰近暗盤短暫加速',
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
        silverDrain: 9,
        coreDmg: 15,
        blotRad: 170,
        tapeRush: 0.65,
        tapeRushMul: 1.16,
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
      startSilver: 200,
      coreHp: 210,
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
      startSilver: 182,
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
      startSilver: 288,
      coreHp: 312,
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
      startSilver: 308,
      coreHp: 336,
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
      startSilver: 328,
      coreHp: 352,
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
      startSilver: 342,
      coreHp: 372,
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
      startSilver: 355,
      coreHp: 385,
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
      startSilver: 365,
      coreHp: 395,
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
      challenge: true,
      startSilver: 412,
      coreHp: 438,
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
    { wave: 40, silver: 340, label: '四十浪三潮' },
    { wave: 50, silver: 420, label: '五十浪潮守' },
    { wave: 60, silver: 520, label: '六十浪四潮' },
    { wave: 75, silver: 700, label: '七十五浪硬頂' },
    { wave: 90, silver: 820, label: '九十浪長城' },
    { wave: 100, silver: 1000, label: '百浪墨城' },
    { wave: 110, silver: 1150, label: '百十浪帳守' },
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
        state.silver += 28;
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
      { name: '四潮同場週', focus: 'quad_tide', blurb: '黑羽＋金邊＋臨停＋墨影｜四潮壓境' },
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
      waveCount: 6 + (h % 3) + (theme.focus === 'dual_swan' || theme.focus === 'circuit_swan' || theme.focus === 'halt_tide' || theme.focus === 'triple_tide' || theme.focus === 'ink_specter' || theme.focus === 'quad_tide' ? 1 : 0), // 6–9
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
    const bossish = focus === 'black_swan' || focus === 'circuit_swan' || focus === 'dual_swan' || focus === 'halt_tide' || focus === 'triple_tide' || focus === 'ink_specter' || focus === 'quad_tide';
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
    },,
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
    '第 12 關「三潮同場」後無盡每 60 波「四潮同場」——先鎖倉清符，再收雙羽同墨影。',
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
    all: 540,
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
    const mul = 1 + (n - 1) * 0.105 + late50 + late75 + late90;
    const countLate = n >= 50 ? Math.min(n - 50, 25) * 0.01 + (n >= 75 ? (n - 75) * 0.006 : 0) : 0;
    const count = (base) => {
      let raw = Math.max(1, Math.round(base * (1 + (n - 1) * 0.072 + countLate)));
      // v2.4：絕對軟頂——75+ 壓力改由 Boss／精英／間隔承担，避免符紙／暗盤洪峰
      if (n >= 75) raw = Math.min(raw, 20 + Math.min(8, Math.floor((n - 75) / 5)));
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
    if (n >= 60 && n % 60 === 0) {
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
    } else if (n >= 5 && n % 5 === 0) {
      const rot = ['black_swan', 'circuit_swan', 'halt_tide', 'ink_specter'];
      const bossId = rot[(Math.floor(n / 5) - 1) % 4];
      const bossCount = bossId === 'black_swan' ? Math.max(1, Math.floor(n / 15) || 1) : 1;
      const hpBoss =
        bossId === 'circuit_swan' ? 1.05 : bossId === 'halt_tide' ? 1.08 : bossId === 'ink_specter' ? 1.1 : 1;
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
    return Math.round(def.cost * 0.184 * newStar);
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
      version: 27,
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
      weekStreak: 0,
      weekStreakBest: 0,
      lastWeeklyClearKey: '',
      weekClearHistory: [],
      wallSnapshots: [],
      localBest: { endless: 0, weeklyStreak: 0, stageClears: 0 },
      post12EndlessBonus: false,
      quadTideTutorialDone: false,
      firstBootDone: false,
      tutorialDone: false,
    };
  }




  function parseWallShort(code) {
    if (!code || typeof code !== 'string') return null;
    const m = /^YL-E(\d+)-S(\d+)-M(\d+)-H([0-9a-fA-F]{1,8})$/.exec(code.trim());
    if (!m) return null;
    return {
      endless: Number(m[1]) || 0,
      weekStreakBest: Number(m[2]) || 0,
      stages: Number(m[3]) || 0,
      histHash: String(m[4] || '').toLowerCase(),
      code: 'YL-E' + m[1] + '-S' + m[2] + '-M' + m[3] + '-H' + String(m[4] || '').toLowerCase(),
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
    return {
      ok: true,
      mine: mine,
      theirs: theirs,
      delta: { endless: dE, weekStreakBest: dS, stages: dM, sameHash: sameHash },
      summary: parts.join('｜'),
      note: '本機對照｜唔做線上排行',
    };
  }

  function listBossPreviews() {
    return Object.keys(ENEMIES)
      .map(function (id) {
        return ENEMIES[id];
      })
      .filter(function (d) {
        return d && d.boss;
      })
      .map(function (d) {
        return {
          id: d.id,
          name: d.name,
          color: d.color || '#C9A227',
          entrance: d.entrance || (d.skill && d.skill.blurb) || d.lore || '',
          skill: d.skill ? d.skill.name + ' — ' + (d.skill.blurb || '') : '',
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
    // 短碼：YL-E{endless}-S{streakBest}-M{stages}-H{histHash}（本機分享用，唔做線上驗證）
    const hist = (w.history || []).join(',');
    let h = 0;
    for (let i = 0; i < hist.length; i++) h = ((h << 5) - h + hist.charCodeAt(i)) | 0;
    const hex = (h >>> 0).toString(16).slice(0, 4);
    return 'YL-E' + w.endless + '-S' + w.weekStreakBest + '-M' + w.stages + '-H' + hex;
  }

  function exportLocalWallShare(save) {
    const w = formatLocalBestWall(save);
    const code = encodeWallShort(save);
    return {
      code: code,
      text: '銀樓防衛本地牆短碼（本機｜唔做線上排行）\n' + code + '\n' + w.short + '\n' + w.label,
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
    const merged = { ...defaultSave(), ...body };
    merged.version = Math.max(24, merged.version || 24);
    if (merged.weekStreak == null) merged.weekStreak = 0;
    if (merged.weekStreakBest == null) merged.weekStreakBest = 0;
    if (!merged.lastWeeklyClearKey) merged.lastWeeklyClearKey = '';
    if (!Array.isArray(merged.weekClearHistory)) merged.weekClearHistory = [];
    if (!Array.isArray(merged.wallSnapshots)) merged.wallSnapshots = [];
    if (!merged.localBest || typeof merged.localBest !== 'object') merged.localBest = { endless: 0, weeklyStreak: 0, stageClears: 0 };
    if (merged.post12EndlessBonus == null) merged.post12EndlessBonus = false;
    if (merged.quadTideTutorialDone == null) merged.quadTideTutorialDone = false;
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
    if (stage && stage.id === 13) {
      const lu = LINEUPS.find((x) => x.id === 'ink_guard') || LINEUPS[0];
      return { lineup: lu, reason: '墨影翻帳——護銀抗墨：鐵衛＋鎖倉清影' };
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
      else if (f === 'circuit_swan' || f === 'dual_swan') pick('squeeze_lock', 9);
      else if (f === 'halt_tide' || f === 'halt_seal') pick('halt_lock', 9);
      else if (f === 'triple_tide') pick('halt_lock', 10);
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
    exportSaveJson,
    exportLocalWallJson,
    exportLocalWallText,
    encodeWallShort,
    parseWallShort,
    compareWallShort,
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
