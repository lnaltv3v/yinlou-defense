/**
 * 銀樓防衛 — 戰鬥／生成／合併邏輯 v1.7.0
 * v1.4：擊退／超殺／擊破爆點／陣亡墨塵
 */
(function (global) {
  const { HEROES, ENEMIES, GRID, CORE, heroStats, activeBonds, bondModsFor, MAX_STAR, UPGRADE_PATHS, upgradeCost } = global.YD;

  function cellCenter(lane, slot) {
    const x = GRID.originX + slot * (GRID.cellW + GRID.gapX) + GRID.cellW / 2;
    const y = GRID.originY + lane * (GRID.cellH + GRID.gapY) + GRID.cellH / 2;
    return { x, y };
  }

  function laneY(lane) {
    return GRID.originY + lane * (GRID.cellH + GRID.gapY) + GRID.cellH / 2;
  }

  function makeHero(id, lane, slot, star, upgrades) {
    const def = HEROES[id];
    const st = heroStats(def, star);
    const c = cellCenter(lane, slot);
    const up = upgrades || {};
    const hero = {
      uid: 'h' + Math.random().toString(36).slice(2, 9),
      id,
      lane,
      slot,
      star,
      x: c.x,
      y: c.y,
      hp: st.hp,
      maxHp: st.maxHp,
      atk: st.atk,
      range: st.range,
      cooldown: st.cooldown,
      baseAtk: st.atk,
      baseMaxHp: st.maxHp,
      baseCooldown: st.cooldown,
      cd: Math.random() * 0.3,
      auraT: 0,
      auraTicks: 0,
      hitFlash: 0,
      atkBuff: 0,
      atkBuffT: 0,
      atkCount: 0,
      swingT: 0,
      stunT: 0,
      idlePhase: Math.random() * Math.PI * 2,
      guardProcT: 0,
      upAtk: up.upAtk || 0,
      upDef: up.upDef || 0,
      upHaste: up.upHaste || 0,
      def,
    };
    applyHeroUpgrades(hero, true);
    return hero;
  }

  /** 依強化等級重算 atk／hp／cooldown；fillHp=true 時補滿相對血量 */
  function applyHeroUpgrades(hero, fillHp) {
    const def = hero.def || HEROES[hero.id];
    const st = heroStats(def, hero.star);
    const atkMul = 1 + (hero.upAtk || 0) * (UPGRADE_PATHS.atk.atkMulPer || 0.12);
    const hpMul = 1 + (hero.upDef || 0) * (UPGRADE_PATHS.def.hpMulPer || 0.15);
    const cdMul = 1 - (hero.upHaste || 0) * (UPGRADE_PATHS.haste.cdMulPer || 0.08);
    const ratio = hero.maxHp > 0 ? hero.hp / hero.maxHp : 1;
    hero.baseAtk = st.atk;
    hero.baseMaxHp = st.maxHp;
    hero.baseCooldown = st.cooldown;
    hero.atk = Math.round(st.atk * atkMul);
    hero.maxHp = Math.round(st.maxHp * hpMul);
    hero.cooldown = Math.max(0.18, st.cooldown * cdMul);
    hero.range = st.range;
    if (fillHp) hero.hp = hero.maxHp;
    else hero.hp = Math.max(1, Math.round(hero.maxHp * Math.min(1, ratio)));
    return hero;
  }

  function upgradeHero(hero, pathId) {
    if (!hero || !UPGRADE_PATHS[pathId]) return { ok: false, reason: '無效' };
    const key = pathId === 'atk' ? 'upAtk' : pathId === 'def' ? 'upDef' : 'upHaste';
    const path = UPGRADE_PATHS[pathId];
    const cur = hero[key] || 0;
    if (cur >= path.maxLv) return { ok: false, reason: '已滿級' };
    const cost = upgradeCost(pathId, cur);
    hero[key] = cur + 1;
    applyHeroUpgrades(hero, false);
    if (pathId === 'def') {
      // 升甲即刻回一小截血
      hero.hp = Math.min(hero.maxHp, hero.hp + Math.round(hero.maxHp * 0.12));
    }
    return { ok: true, cost, level: hero[key], path };
  }

  function makeEnemy(typeId, lane, extra) {
    const def = ENEMIES[typeId];
    const elite = !!(extra && extra.elite) && !def.boss;
    let hpMul = (extra && extra.hpMul) || 1;
    if (elite) hpMul *= 1.85;
    const y = laneY(lane) + (Math.random() * 10 - 5);
    return {
      uid: 'e' + Math.random().toString(36).slice(2, 9),
      id: typeId,
      lane,
      x: 980 + ((extra && extra.xOff) || 0),
      y,
      hp: def.hp * hpMul,
      maxHp: def.hp * hpMul,
      speed: elite ? def.speed * 0.92 : def.speed,
      baseSpeed: elite ? def.speed * 0.92 : def.speed,
      atk: Math.round(def.atk * (0.9 + hpMul * 0.1) * (elite ? 1.25 : 1)),
      reward: Math.round(def.reward * (1 + (hpMul - 1) * 0.5) * (elite ? 2.2 : 1)),
      radius: def.radius + (elite ? 3 : 0),
      slowT: 0,
      darkMarkT: 0,
      darkMarkBonus: 0,
      def,
      boss: !!def.boss,
      elite: elite,
      attackRange: def.attackRange || 45,
      attackCd: (def.attackCd || 1) * (elite ? 0.9 : 1),
      cd: Math.random() * 0.4,
      preferHero: def.preferHero != null ? def.preferHero : 0.5,
      mode: 'march',
      hitFlash: 0,
      atkCount: 0,
      skillFlash: 0,
      rushT: 0,
      rushDmgMul: 1,
      atkBuffMul: 1,
      atkBuffT: 0,
    };
  }

  function findHeroAt(heroes, lane, slot) {
    return heroes.find((h) => h.lane === lane && h.slot === slot);
  }

  function canMerge(a, b) {
    return a && b && a.uid !== b.uid && a.id === b.id && a.star === b.star && a.star < MAX_STAR;
  }

  function mergeHeroes(heroes, source, target) {
    if (!canMerge(source, target)) return null;
    const nextStar = target.star + 1;
    const lane = target.lane;
    const slot = target.slot;
    const ratio = target.hp / target.maxHp;
    const keepUid = target.uid;

    const ups = {
      upAtk: Math.max(source.upAtk || 0, target.upAtk || 0),
      upDef: Math.max(source.upDef || 0, target.upDef || 0),
      upHaste: Math.max(source.upHaste || 0, target.upHaste || 0),
    };
    const next = makeHero(target.id, lane, slot, nextStar, ups);
    next.uid = keepUid;
    next.hp = Math.max(1, Math.round(next.maxHp * Math.min(1, ratio + 0.28)));

    const sid = source.uid;
    const tid = target.uid;
    for (let i = heroes.length - 1; i >= 0; i--) {
      if (heroes[i].uid === sid) heroes.splice(i, 1);
    }
    const tIdx = heroes.findIndex((h) => h.uid === tid);
    if (tIdx < 0) {
      heroes.push(next);
    } else {
      heroes[tIdx] = next;
    }
    return next;
  }

  function pickTarget(hero, enemies, rangeBonus) {
    const cross = hero.def.crossLane != null ? hero.def.crossLane : (hero.def.role === 'arb' ? 1 : 0);
    const extraR = rangeBonus || 0;
    const inRange = enemies.filter((e) => {
      if (e.hp <= 0) return false;
      const sameLane = e.lane === hero.lane;
      if (hero.def.role === 'support' || hero.def.role === 'buffer') {
        if (Math.abs(e.lane - hero.lane) > 1) return false;
      } else if (cross > 0) {
        if (Math.abs(e.lane - hero.lane) > cross) return false;
      } else if (!sameLane) {
        return false;
      }
      const d = Math.hypot(e.x - hero.x, e.y - hero.y);
      return d <= hero.range + extraR + e.radius;
    });
    if (!inRange.length) return null;
    if (hero.def.preferBack) {
      return inRange.reduce((a, b) => (a.x > b.x ? a : b));
    }
    if (hero.def.role === 'hunter') {
      return inRange.reduce((a, b) => (a.hp / a.maxHp > b.hp / b.maxHp ? a : b));
    }
    if (hero.def.role === 'arb') {
      // 優先打血厚／跨 lane 價差目標
      return inRange.reduce((a, b) => {
        const sa = a.hp + (a.lane !== hero.lane ? 20 : 0);
        const sb = b.hp + (b.lane !== hero.lane ? 20 : 0);
        return sa > sb ? a : b;
      });
    }
    return inRange.reduce((a, b) => (a.x < b.x ? a : b));
  }

  function pushFloat(floats, opts) {
    if (floats.length > 48) floats.splice(0, floats.length - 40);
    floats.push({
      x: opts.x + (Math.random() * 10 - 5),
      y: opts.y,
      text: opts.text,
      life: opts.life != null ? opts.life : 0.75,
      maxLife: opts.life != null ? opts.life : 0.75,
      color: opts.color || '#E8DCC8',
      vy: opts.vy != null ? opts.vy : -36,
      size: opts.size || 14,
      bounce: opts.bounce != null ? opts.bounce : 1,
    });
  }

  function pushFx(state, fx) {
    if (!state.fx) state.fx = [];
    if (state.fx.length > 36) state.fx.splice(0, state.fx.length - 28);
    state.fx.push(fx);
  }

  function applyDamage(enemy, amount, floats, kind, state) {
    const before = enemy.hp;
    const dealt = Math.min(before, amount);
    const over = Math.max(0, amount - before);
    enemy.hp -= amount;
    enemy.hitFlash = kind === 'crit' ? 0.18 : 0.12;
    // 輕量擊退（唔推過遠；Boss 減半）
    const kb = (kind === 'crit' ? 7 : 4) * (enemy.boss ? 0.45 : enemy.elite ? 0.7 : 1);
    enemy.x = Math.min(980, (enemy.x || 0) + kb);
    if (global.YDAudio) global.YDAudio.play(kind === 'crit' ? 'crit' : 'hit');
    const crit = kind === 'crit' || amount >= 28;
    pushFloat(floats, {
      x: enemy.x,
      y: enemy.y - 16,
      text: '-' + Math.round(amount),
      color: crit ? '#C9A227' : kind === 'splash' ? '#A080C0' : '#E8DCC8',
      size: crit ? 19 : 15,
      vy: crit ? -48 : -42,
      life: crit ? 0.95 : 0.85,
      bounce: crit ? 1.25 : 1,
    });
    if (over >= 8 && before > 0) {
      pushFloat(floats, {
        x: enemy.x + 10,
        y: enemy.y - 28,
        text: '超殺',
        color: '#C9A227',
        size: 11,
        vy: -26,
        life: 0.55,
      });
    }
    if (state && kind === 'crit') {
      pushFx(state, {
        type: 'slash',
        x: enemy.x,
        y: enemy.y,
        color: enemy.def && enemy.def.color ? enemy.def.color : '#C9A227',
        life: 0.22,
        r: 16,
      });
    }
    return { dealt: dealt, over: over, killed: enemy.hp <= 0 && before > 0 };
  }

  function applyHeroDamage(hero, amount, floats, state) {
    const bonds = state._bonds || activeBonds(state.heroes);
    const mods = bondModsFor(hero.id, bonds);
    let dmg = amount;
    if (hero.def.role === 'tank') dmg = Math.round(dmg * mods.tankDmgMul);
    const sk = hero.def.skill;
    if (sk && sk.id === 'guard_wall') {
      if (hero.guardProcT > 0) {
        dmg = Math.round(dmg * (sk.dmgMul || 0.45));
        pushFloat(floats, {
          x: hero.x,
          y: hero.y - 36,
          text: '護盤',
          color: '#C9A227',
          size: 12,
          vy: -22,
          life: 0.55,
        });
      } else if (Math.random() < (sk.proc || 0.18)) {
        hero.guardProcT = 0.85;
        dmg = Math.round(dmg * (sk.dmgMul || 0.45));
        pushFloat(floats, {
          x: hero.x,
          y: hero.y - 36,
          text: '護盤！',
          color: '#C9A227',
          size: 13,
          vy: -24,
          life: 0.7,
        });
        state.fx.push({ type: 'hit', x: hero.x, y: hero.y, color: '#C9A227', life: 0.28, r: 22 });
      }
    }
    hero.hp -= dmg;
    hero.hitFlash = 0.15;
    pushFloat(floats, {
      x: hero.x,
      y: hero.y - 28,
      text: '-' + Math.round(dmg),
      color: '#C45C4A',
      size: 13,
      vy: -30,
      life: 0.7,
    });
  }

  function heroAttack(hero, enemies, floats, state) {
    const bonds = state._bonds || activeBonds(state.heroes);
    const mods = bondModsFor(hero.id, bonds);
    const sk = hero.def.skill;
    hero.atkCount = (hero.atkCount || 0) + 1;
    hero.swingT = 0.22;
    let skillProc = false;
    if (sk && sk.every && hero.atkCount % sk.every === 0) skillProc = true;

    // buffer：優先 buff 鄰格俠客
    if (hero.def.role === 'buffer') {
      let buffed = false;
      const bonus = (hero.def.buffAtk || 0.15) + mods.buffBonus;
      for (const h of state.heroes) {
        if (h.uid === hero.uid || h.hp <= 0) continue;
        if (Math.abs(h.lane - hero.lane) > 1) continue;
        if (Math.abs(h.slot - hero.slot) > 1) continue;
        h.atkBuff = Math.max(h.atkBuff || 0, bonus);
        h.atkBuffT = Math.max(h.atkBuffT || 0, hero.def.buffDur || 2);
        buffed = true;
      }
      if (buffed) {
        pushFloat(floats, {
          x: hero.x,
          y: hero.y - 22,
          text: skillProc ? '開市鑼！' : '開市！',
          color: '#C9A227',
          size: skillProc ? 13 : 12,
          vy: -22,
          life: 0.7,
        });
        state.fx.push({ type: 'hit', x: hero.x, y: hero.y, color: '#C9A227', life: 0.25, r: 18 });
      }
      if (skillProc && sk && sk.laneBuff) {
        for (const h of state.heroes) {
          if (h.hp <= 0 || h.lane !== hero.lane) continue;
          h.atkBuff = Math.max(h.atkBuff || 0, (h.atkBuff || 0) + sk.laneBuff);
          h.atkBuffT = Math.max(h.atkBuffT || 0, sk.laneBuffDur || 1.8);
        }
        state.fx.push({ type: 'skill', x: hero.x, y: hero.y, color: '#C9A227', life: 0.45, text: sk.name });
      }
    }

    const target = pickTarget(hero, enemies, mods.rangeBonus);
    if (!target) return;

    let dmg = hero.atk * mods.atkMul;
    if (hero.atkBuffT > 0 && hero.atkBuff) dmg *= 1 + hero.atkBuff;
    if (state.modCtx && state.modCtx.heroAtkMul && state.modCtx.heroAtkMul !== 1) {
      dmg *= state.modCtx.heroAtkMul;
    }
    dmg = Math.round(dmg);
    let kind = 'hit';
    let splashMul = 1;

    if (hero.def.role === 'assassin' && target.x > 700) {
      dmg = Math.round(dmg * 1.4);
      kind = 'crit';
    }
    if (hero.def.role === 'hunter' || hero.def.highHpBonus) {
      const ratio = target.hp / target.maxHp;
      if (ratio >= 0.5) {
        const bonus = (hero.def.highHpBonus || 0.35) + mods.highHpExtra;
        dmg = Math.round(dmg * (1 + bonus));
        kind = 'crit';
      }
    }

    if (skillProc && sk) {
      if (sk.dmgMul) {
        const ok =
          sk.id !== 'short_squeeze' ||
          target.boss ||
          target.hp / target.maxHp >= (sk.hpGate || 0.7);
        if (ok) {
          dmg = Math.round(dmg * sk.dmgMul);
          kind = 'crit';
          pushFloat(floats, {
            x: hero.x,
            y: hero.y - 44,
            text: '「' + sk.name + '」',
            color: hero.def.color,
            size: 15,
            vy: -32,
            life: 0.95,
            bounce: 1.2,
          });
          state.fx.push({
            type: 'skill',
            x: hero.x,
            y: hero.y,
            color: hero.def.color,
            life: 0.55,
            text: sk.name,
            r: 22,
          });
        }
      }
      if (sk.splashMul) splashMul = sk.splashMul;
      if (sk.deepSlow) {
        target.slowT = Math.max(target.slowT, sk.deepSlowDur || 2);
        target.speed = target.baseSpeed * (1 - sk.deepSlow);
        pushFloat(floats, {
          x: target.x,
          y: target.y - 22,
          text: '看淡！',
          color: '#2A6A6A',
          size: 12,
          vy: -20,
          life: 0.7,
        });
      }
      if (sk.id === 'arb_spread' && sk.slow) {
        target.slowT = Math.max(target.slowT, sk.slowDur || 1.1);
        target.speed = target.baseSpeed * (1 - sk.slow);
      }
      if (sk.id === 'dark_mark') {
        const dur = (sk.markDur || 4) + (mods.markDurBonus || 0);
        target.darkMarkT = Math.max(target.darkMarkT || 0, dur);
        target.darkMarkBonus = Math.max(target.darkMarkBonus || 0, (sk.markAllyBonus || 0.35) + (mods.markBonus || 0));
        pushFloat(floats, {
          x: target.x,
          y: target.y - 26,
          text: '暗盤！',
          color: '#3A4060',
          size: 13,
          vy: -22,
          life: 0.75,
        });
        state.fx.push({ type: 'skill', x: target.x, y: target.y, color: '#3A4060', life: 0.4, text: sk.name });
      }
      if (sk.id === 'lock_seal') {
        let dur = (sk.lockDur || 3.6) + (mods.lockDurBonus || 0);
        if (state.modCtx && state.modCtx.lockDurMul) dur *= state.modCtx.lockDurMul;
        let mul = sk.lockMul != null ? sk.lockMul : 0.62;
        if (mods.lockBonus) mul = Math.max(0.35, mul - mods.lockBonus);
        target.lockT = Math.max(target.lockT || 0, dur);
        target.lockAtkMul = Math.min(target.lockAtkMul != null ? target.lockAtkMul : 1, mul);
        state.lockProcs = (state.lockProcs || 0) + 1;
        const cutPct = Math.round((1 - mul) * 100);
        pushFloat(floats, {
          x: target.x,
          y: target.y - 28,
          text: '鎖倉−' + cutPct + '%',
          color: '#406858',
          size: 14,
          vy: -28,
          life: 0.9,
          bounce: 1.15,
        });
        state.fx.push({ type: 'skill', x: target.x, y: target.y, color: '#406858', life: 0.5, text: sk.name, r: 20 });
      }
    }

    // 標記加傷（掮客以外隊友／自己後續普攻）
    if (target.darkMarkT > 0 && target.darkMarkBonus && !(skillProc && sk && sk.id === 'dark_mark')) {
      dmg = Math.round(dmg * (1 + target.darkMarkBonus));
      kind = kind === 'hit' ? 'crit' : kind;
    } else if (target.darkMarkT > 0 && target.darkMarkBonus && skillProc && sk && sk.id === 'dark_mark') {
      // 標記當下唔叠加標記加傷，避免雙乘
    }

    applyDamage(target, dmg, floats, kind, state);

    if (hero.def.slow && target.hp > 0 && !(skillProc && sk && sk.deepSlow)) {
      target.slowT = Math.max(target.slowT, hero.def.slowDur);
      target.speed = target.baseSpeed * (1 - hero.def.slow);
    }

    if (hero.def.splash) {
      const rad = hero.def.splash * splashMul;
      for (const e of enemies) {
        if (e.uid === target.uid || e.hp <= 0) continue;
        if (Math.hypot(e.x - target.x, e.y - target.y) <= rad) {
          applyDamage(e, Math.round(dmg * 0.55 * (splashMul > 1 ? 1.1 : 1)), floats, 'splash', state);
        }
      }
      if (hero.def.selfRisk && Math.random() < hero.def.selfRisk) {
        hero.hp = Math.max(1, hero.hp - Math.round(hero.maxHp * 0.04));
        pushFloat(floats, {
          x: hero.x,
          y: hero.y - 20,
          text: '槓桿反噬',
          color: '#5A4060',
          size: 12,
          vy: -20,
          life: 0.8,
        });
      }
    }

    state.fx.push({
      type: 'bolt',
      x0: hero.x,
      y0: hero.y,
      x1: target.x,
      y1: target.y,
      color: hero.def.color,
      life: 0.14,
    });
    state.fx.push({
      type: 'hit',
      x: target.x,
      y: target.y,
      color: hero.def.color,
      life: 0.18,
      r: 10 + (kind === 'crit' ? 6 : 0),
    });
    if (!state.shake || state.shake < 0.08) state.shake = kind === 'crit' ? 0.15 : 0.07;
  }

  function tickSupport(hero, heroes, state, dt) {
    const role = hero.def.role;
    if (role !== 'support' && role !== 'medic') return;
    const bonds = state._bonds || activeBonds(heroes);
    const mods = bondModsFor(hero.id, bonds);
    hero.auraT += dt;
    if (hero.auraT < 1) return;
    hero.auraT = 0;
    hero.auraTicks = (hero.auraTicks || 0) + 1;
    const sk = hero.def.skill;
    let healMul = 1;
    let silExtra = 0;
    let burst = false;
    if (sk && sk.every) {
      hero.skillProgress = ((hero.auraTicks || 0) % sk.every) / sk.every;
      hero.skillReadyIn = sk.every - ((hero.auraTicks || 0) % sk.every);
    }
    if (sk && sk.every && hero.auraTicks % sk.every === 0) {
      healMul = sk.healMul || 1.35;
      silExtra = sk.silverBurst != null ? sk.silverBurst : role === 'medic' ? 1 : 3;
      burst = true;
      hero.skillProgress = 1;
      const col = role === 'medic' ? '#508070' : '#3A7A6A';
      pushFloat(state.floats, {
        x: hero.x,
        y: hero.y - 38,
        text: (sk.name || (role === 'medic' ? '抄底' : '分紅')) + '！',
        color: col,
        size: 12,
        vy: -22,
        life: 0.75,
      });
      state.fx.push({ type: 'skill', x: hero.x, y: hero.y, color: col, life: 0.42, text: sk.name });
    }
    const heal = (hero.def.auraHeal || 0) * hero.star * mods.auraMul * healMul;
    const sil = (hero.def.auraSilver || 0) * hero.star * mods.auraMul + silExtra;
    let lowest = null;
    for (const h of heroes) {
      if (h.hp <= 0) continue;
      if (Math.abs(h.lane - hero.lane) > 1) continue;
      let mul = 1;
      const pct = h.maxHp > 0 ? h.hp / h.maxHp : 1;
      if (role === 'medic' || hero.def.lowHpHealMul) {
        if (pct < 0.5) {
          mul = (hero.def.lowHpHealMul || 1.6) + (mods.healLowBonus || 0);
        } else if (pct < 0.75 && role === 'medic') {
          mul = 1.15 + (mods.healLowBonus || 0) * 0.5;
        }
      } else if (mods.healLowBonus && pct < 0.5) {
        mul = 1 + mods.healLowBonus;
      }
      h.hp = Math.min(h.maxHp, h.hp + heal * mul);
      if (!lowest || h.hp / h.maxHp < lowest.hp / lowest.maxHp) lowest = h;
    }
    if (burst && sk && sk.lowestBurst && lowest) {
      const bonus = (sk.lowestBurst || 0) * hero.star * mods.auraMul;
      lowest.hp = Math.min(lowest.maxHp, lowest.hp + bonus);
      pushFloat(state.floats, {
        x: lowest.x,
        y: lowest.y - 30,
        text: '+' + Math.round(bonus) + '補',
        color: '#508070',
        size: 13,
        vy: -26,
        life: 0.8,
      });
      state.fx.push({ type: 'hit', x: lowest.x, y: lowest.y, color: '#508070', life: 0.28, r: 14 });
    }
    state.silver += sil;
    if (sil > 0.05) {
      pushFloat(state.floats, {
        x: hero.x,
        y: hero.y - 24,
        text: '+' + sil.toFixed(1) + '兩',
        color: '#D4AF37',
        size: 12,
        vy: -18,
        life: 0.6,
      });
    }
  }

  function tickHeroes(state, dt) {
    state._bonds = activeBonds(state.heroes);
    for (const h of state.heroes) {
      if (h.hp <= 0) continue;
      if (h.hitFlash > 0) h.hitFlash -= dt;
      if (h.swingT > 0) h.swingT = Math.max(0, h.swingT - dt);
      if (h.stunT > 0) h.stunT = Math.max(0, h.stunT - dt);
      if (h.guardProcT > 0) h.guardProcT = Math.max(0, h.guardProcT - dt);
      if (h._bladeOilLeft > 0) {
        h._bladeOilLeft -= dt;
        if (h._bladeOilLeft <= 0) {
          h._bladeOilLeft = 0;
          h._bladeOilBaseCd = null;
          applyHeroUpgrades(h, false);
        }
      }
      if (h.atkBuffT > 0) {
        h.atkBuffT -= dt;
        if (h.atkBuffT <= 0) {
          h.atkBuffT = 0;
          h.atkBuff = 0;
        }
      }
      tickSupport(h, state.heroes, state, dt);
      const mods = bondModsFor(h.id, state._bonds);
      h.cd -= dt;
      if (h.stunT > 0) continue;
      if (h.cd > 0) continue;
      if (h.def.role === 'buffer') {
        const allies = state.heroes.some(
          (o) => o.uid !== h.uid && o.hp > 0 && Math.abs(o.lane - h.lane) <= 1 && Math.abs(o.slot - h.slot) <= 1
        );
        if (!allies && !pickTarget(h, state.enemies, mods.rangeBonus)) continue;
      } else if (!pickTarget(h, state.enemies, mods.rangeBonus)) {
        continue;
      }
      let cd = h.cooldown * mods.cdMul;
      if (state.modCtx && state.modCtx.heroCdMul) cd *= state.modCtx.heroCdMul;
      h.cd = Math.max(0.16, cd);
      heroAttack(h, state.enemies, state.floats, state);
      // 技能進度：距離下次 every 觸發
      const sk = h.def.skill;
      if (sk && sk.every) {
        const rem = sk.every - ((h.atkCount || 0) % sk.every);
        h.skillProgress = 1 - (rem === sk.every ? 0 : rem) / sk.every;
        h.skillReadyIn = rem === sk.every ? sk.every : rem;
      } else if (sk && sk.proc) {
        h.skillProgress = sk.proc;
        h.skillReadyIn = 0;
      }
    }
  }

  /** 0..1 技能冷卻／蓄力顯示 */
  function skillMeter(hero) {
    const sk = hero.def && hero.def.skill;
    if (!sk) return null;
    if (sk.every) {
      const every = sk.every;
      const mod = (hero.atkCount || 0) % every;
      return { kind: 'every', progress: mod / every, label: sk.name, every, mod };
    }
    if (sk.id === 'guard_wall') {
      return { kind: 'proc', progress: hero.guardProcT > 0 ? 1 : sk.proc || 0.18, label: sk.name };
    }
    if (sk.every == null && hero.def.role === 'support') {
      const every = sk.every || 4;
      const mod = (hero.auraTicks || 0) % every;
      return { kind: 'aura', progress: mod / every, label: sk.name };
    }
    return { kind: 'passive', progress: 1, label: sk.name };
  }


  function nearestHeroOnLane(enemy, heroes) {
    let best = null;
    let bestD = Infinity;
    for (const h of heroes) {
      if (h.hp <= 0) continue;
      if (h.lane !== enemy.lane) continue;
      if (h.x > enemy.x + 8) continue;
      const d = enemy.x - h.x;
      if (d < bestD) {
        bestD = d;
        best = h;
      }
    }
    return best;
  }


  function enemySkillProc(enemy, hero, state, sk) {
    pushFloat(state.floats, {
      x: enemy.x,
      y: enemy.y - 28,
      text: (sk.name || '技') + '！',
      color: enemy.elite ? '#C45C4A' : '#C9A227',
      size: 13,
      vy: -24,
      life: 0.8,
    });
    pushFx(state, {
      type: 'skill',
      x: enemy.x,
      y: enemy.y,
      color: enemy.def.color,
      life: 0.45,
      text: sk.name,
    });
    if (sk.type === 'scream') {
      for (const h of state.heroes) {
        if (h.hp <= 0) continue;
        // 視覺：短暫 hitFlash；實際減速敵我透過 core＋敵方加速感
        h.hitFlash = Math.max(h.hitFlash || 0, 0.2);
      }
      for (const o of state.enemies) {
        if (o.hp <= 0 || o.uid === enemy.uid) continue;
        o.slowT = 0;
        o.speed = o.baseSpeed * (1 + 0.15);
        o.rushT = Math.max(o.rushT || 0, 0.8);
      }
      // 英雄側：用 atkBuff 負向唔啱；改 core 震盪
      if (sk.coreDmg) {
        state.coreHp -= sk.coreDmg;
        state.coreHitFlash = 0.4;
        state.shake = Math.max(state.shake || 0, 0.25);
        pushFloat(state.floats, {
          x: CORE.x,
          y: CORE.y - 48,
          text: '驚惶 -' + sk.coreDmg,
          color: '#5A4060',
          size: 15,
          vy: -28,
          life: 1.0,
        });
      }
      // 同 lane 俠客短暫減速輸出：加長 cd
      for (const h of state.heroes) {
        if (h.hp <= 0) continue;
        if (Math.abs(h.lane - enemy.lane) <= 1) {
          h.cd = Math.max(h.cd, 0.55);
        }
      }
    } else if (sk.type === 'rally') {
      const rad = sk.radius || 90;
      for (const o of state.enemies) {
        if (o.hp <= 0) continue;
        if (Math.hypot(o.x - enemy.x, o.y - enemy.y) > rad) continue;
        o.atkBuffMul = sk.atkMul || 1.25;
        o.atkBuffT = sk.dur || 2.5;
        o.speed = o.baseSpeed * (sk.speedMul || 1.3);
        o.rushT = sk.dur || 2.5;
      }
    } else if (sk.type === 'rush') {
      enemy.speed = enemy.baseSpeed * (sk.speedMul || 1.5);
      enemy.rushT = sk.dur || 1.8;
      enemy.rushDmgMul = sk.dmgMul || 1.5;
      enemy.mode = 'march';
    } else if (sk.type === 'mark') {
      // 傷害加成喺呼叫處處理
    } else if (sk.type === 'lifesteal') {
      // 回血喺呼叫處處理
    } else if (sk.type === 'stun') {
      if (hero) hero.stunT = Math.max(hero.stunT || 0, sk.dur || 1);
    }
  }

  function tickEnemies(state, dt) {
    const arrived = [];
    for (const e of state.enemies) {
      if (e.hitFlash > 0) e.hitFlash -= dt;
      if (e.slowT > 0) {
        e.slowT -= dt;
        if (e.slowT <= 0) e.speed = e.baseSpeed;
      }
      if (e.darkMarkT > 0) {
        e.darkMarkT -= dt;
        if (e.darkMarkT <= 0) {
          e.darkMarkT = 0;
          e.darkMarkBonus = 0;
        }
      }
      if (e.lockT > 0) {
        e.lockT -= dt;
        if (e.lockT <= 0) {
          e.lockT = 0;
          e.lockAtkMul = 1;
        }
      }

      e.cd -= dt;
      const hero = nearestHeroOnLane(e, state.heroes);
      const distHero = hero ? Math.abs(e.x - hero.x) : Infinity;
      const inHeroRange = hero && distHero <= e.attackRange + 18;

      if (inHeroRange && (e.mode === 'fight' || Math.random() < e.preferHero * 0.02 + (inHeroRange ? 0.5 : 0))) {
        e.mode = 'fight';
      } else if (!inHeroRange) {
        e.mode = 'march';
      }

      if (e.atkBuffT > 0) {
        e.atkBuffT -= dt;
        if (e.atkBuffT <= 0) {
          e.atkBuffT = 0;
          e.atkBuffMul = 1;
        }
      }
      if (e.rushT > 0) {
        e.rushT -= dt;
        if (e.rushT <= 0) {
          e.rushT = 0;
          e.rushDmgMul = 1;
          if (!e.slowT || e.slowT <= 0) e.speed = e.baseSpeed;
        }
      }
      if (e.skillFlash > 0) e.skillFlash -= dt;

      if (e.mode === 'fight' && hero && hero.hp > 0) {
        if (e.cd <= 0) {
          e.cd = e.attackCd;
          e.atkCount = (e.atkCount || 0) + 1;
          let dmg = Math.round(e.atk * (e.atkBuffMul || 1) * (e.rushDmgMul || 1) * (e.lockAtkMul != null ? e.lockAtkMul : 1));
          const sk = e.def.skill;
          const canSkill = sk && (e.boss || e.elite) && sk.every && e.atkCount % sk.every === 0;
          if (canSkill) {
            enemySkillProc(e, hero, state, sk);
            if (sk.type === 'mark' || sk.type === 'rush') {
              dmg = Math.round(dmg * (sk.dmgMul || 1.5));
            }
            e.skillFlash = 0.45;
            if (global.YDAudio) global.YDAudio.play('skill');
          }
          applyHeroDamage(hero, dmg, state.floats, state);
          const stunSec = (e.def && e.def.stunSec) || (canSkill && sk && sk.type === 'stun' ? sk.dur : 0);
          if (stunSec) {
            hero.stunT = Math.max(hero.stunT || 0, stunSec);
            pushFloat(state.floats, {
              x: hero.x,
              y: hero.y - 26,
              text: '停牌',
              color: '#C9A227',
              size: 12,
              vy: -22,
              life: 0.7,
            });
          }
          if (canSkill && sk.type === 'lifesteal') {
            const heal = Math.round(dmg * (sk.healRatio || 0.4));
            e.hp = Math.min(e.maxHp, e.hp + heal);
            pushFloat(state.floats, {
              x: e.x,
              y: e.y - 20,
              text: '+' + heal,
              color: '#A04040',
              size: 12,
              vy: -20,
              life: 0.6,
            });
          }
          pushFx(state, {
            type: 'hit',
            x: hero.x,
            y: hero.y,
            color: e.def.color,
            life: 0.16,
            r: 12 + (canSkill ? 6 : 0),
          });
          if (!state.shake || state.shake < 0.1) state.shake = canSkill ? 0.16 : 0.1;
          // 用完衝鋒傷害加成
          if (e.rushDmgMul && e.rushDmgMul > 1 && (!sk || sk.type !== 'rush' || !canSkill)) {
            e.rushDmgMul = 1;
          }
        }
      } else {
        const spd = e.speed * (e.rushT > 0 && e.def.skill && e.def.skill.speedMul ? 1 : 1);
        e.x -= spd * dt;
      }

      if (e.x - e.radius <= CORE.x + 20) arrived.push(e);
    }

    for (const e of arrived) {
      const gateDmg = Math.max(1, Math.round(e.atk * (e.lockAtkMul != null ? e.lockAtkMul : 1)));
      state.coreHp -= gateDmg;
      state.coreHitFlash = 0.35;
      state.shake = 0.22;
      pushFloat(state.floats, {
        x: CORE.x,
        y: CORE.y - 40,
        text: '破門 -' + gateDmg,
        color: '#C45C4A',
        size: 18,
        vy: -34,
        life: 1.0,
      });
      pushFx(state, { type: 'coreHit', life: 0.35 });
      if (global.YDAudio) global.YDAudio.play('core');
      e.hp = 0;
    }
  }

  function collectDead(state) {
    const dead = state.enemies.filter((e) => e.hp <= 0);
    for (const e of dead) {
      if (e.x > CORE.x + 20) {
        let reward = e.reward;
        if (e.lockT > 0 || (e.lockAtkMul != null && e.lockAtkMul < 0.99)) {
          const bonus = Math.max(1, Math.round(e.reward * 0.18));
          reward += bonus;
          state.lockKills = (state.lockKills || 0) + 1;
          pushFloat(state.floats, {
            x: e.x + 12,
            y: e.y - 14,
            text: '鎖倉+' + bonus,
            color: '#406858',
            size: 12,
            vy: -28,
            life: 0.8,
            bounce: 1.1,
          });
        }
        state.silver += reward;
        pushFloat(state.floats, {
          x: e.x,
          y: e.y,
          text: '+' + reward,
          color: '#D4AF37',
          size: 14,
          vy: -28,
          life: 0.75,
        });
        state.kills += 1;
        state._killStreak = (state._killStreak || 0) + 1;
        state._killStreakT = 1.4;
        if (e.id === 'rumor_swarm') state._rumorKills = (state._rumorKills || 0) + 1;
        if (e.id === 'dark_tape') state._darkKills = (state._darkKills || 0) + 1;
        if (e.elite) {
          state._eliteKills = (state._eliteKills || 0) + 1;
          pushFloat(state.floats, {
            x: e.x,
            y: e.y - 24,
            text: '精英擊破',
            color: '#C45C4A',
            size: 14,
            vy: -30,
            life: 1.0,
          });
        }
        if (e.boss) {
          pushFloat(state.floats, {
            x: e.x,
            y: e.y - 36,
            text: 'Boss 擊破！',
            color: '#C9A227',
            size: 16,
            vy: -34,
            life: 1.2,
          });
          state.shake = Math.max(state.shake || 0, 0.28);
        }
        const streak = state._killStreak || 0;
        if (streak >= 5 && streak % 5 === 0) {
          pushFloat(state.floats, {
            x: e.x,
            y: e.y - 40,
            text: '連斬 ×' + streak,
            color: '#C45C4A',
            size: 13,
            vy: -30,
            life: 0.85,
          });
        }
        state.fx.push({
          type: 'death',
          x: e.x,
          y: e.y,
          color: (e.def && e.def.color) || '#C9A227',
          life: 0.42,
          r: 12 + (e.elite ? 6 : 0) + (e.boss ? 10 : 0),
          boss: !!e.boss,
        });
        state.fx.push({ type: 'hit', x: e.x, y: e.y, color: '#C9A227', life: 0.22, r: 14 });
      }
    }
    state.enemies = state.enemies.filter((e) => e.hp > 0);
    const deadH = state.heroes.filter((h) => h.hp <= 0);
    for (const h of deadH) {
      pushFloat(state.floats, {
        x: h.x,
        y: h.y,
        text: '陣亡',
        color: '#8A7E6E',
        size: 12,
        vy: -16,
        life: 0.9,
      });
      state.fx.push({
        type: 'death',
        x: h.x,
        y: h.y,
        color: (h.def && h.def.color) || '#8A7E6E',
        life: 0.5,
        r: 16,
        hero: true,
      });
    }
    state.heroes = state.heroes.filter((h) => h.hp > 0);
  }

  function compactAlive(arr, maxLen) {
    let w = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].life > 0) {
        if (w !== i) arr[w] = arr[i];
        w++;
      }
    }
    arr.length = maxLen != null && w > maxLen ? maxLen : w;
  }

  function tickFloats(state, dt) {
    for (const f of state.floats) {
      f.life -= dt;
      const t = 1 - f.life / (f.maxLife || 0.75);
      const bounce = f.bounce ? Math.sin(Math.min(1, t * 8) * Math.PI) * 4 * (1 - t) : 0;
      f.y += (f.vy || -20) * dt;
      f._bounceY = bounce;
      // v1.7：前段略放大再回落
      const pulse = f.bounce ? 1 + 0.18 * Math.sin(Math.min(1, t * 6) * Math.PI) * (1 - t * 0.5) : 1;
      f._scale = pulse;
    }
    compactAlive(state.floats, 48);
    for (const fx of state.fx) fx.life -= dt;
    compactAlive(state.fx, 36);
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt);
    if (state.coreHitFlash > 0) state.coreHitFlash = Math.max(0, state.coreHitFlash - dt);
    if (state._killStreakT > 0) {
      state._killStreakT -= dt;
      if (state._killStreakT <= 0) {
        state._killStreakT = 0;
        state._killStreak = 0;
      }
    }
    if (state.bossBanner && state.bossBanner.life > 0) {
      state.bossBanner.life -= dt;
      if (state.bossBanner.life <= 0) state.bossBanner = null;
    }
    if (state.bondBanner && state.bondBanner.life > 0) {
      state.bondBanner.life -= dt;
      if (state.bondBanner.life <= 0) state.bondBanner = null;
    }
  }

  function announceBoss(state, enemy) {
    state.bossBanner = {
      name: enemy.def.name,
      life: 2.6,
      maxLife: 2.6,
      kind: 'boss',
    };
    state.shake = Math.max(state.shake || 0, 0.28);
    state.fx.push({ type: 'bossWarn', life: 2.4 });
    pushFloat(state.floats, {
      x: 480,
      y: 200,
      text: '⚠ ' + enemy.def.name + ' 入場',
      color: '#C9A227',
      size: 22,
      vy: -12,
      life: 2.2,
      bounce: 0,
    });
  }

  function announceElite(state, enemy) {
    state.bossBanner = {
      name: '精英·' + enemy.def.name,
      life: 2.2,
      maxLife: 2.2,
      kind: 'elite',
    };
    state.shake = Math.max(state.shake || 0, 0.18);
    state.fx.push({ type: 'eliteWarn', life: 1.8 });
    pushFloat(state.floats, {
      x: 480,
      y: 210,
      text: '精英波 — ' + enemy.def.name,
      color: '#C45C4A',
      size: 18,
      vy: -14,
      life: 1.8,
      bounce: 0,
    });
  }

  function announceBond(state, bond) {
    state.bondBanner = {
      name: bond.name,
      blurb: bond.blurb,
      life: 2.0,
      maxLife: 2.0,
    };
    state.fx.push({
      type: 'bond',
      x: 480,
      y: 120,
      color: '#C9A227',
      life: 1.6,
      text: bond.name,
    });
    pushFloat(state.floats, {
      x: 480,
      y: 160,
      text: '羈絆發動：' + bond.name,
      color: '#C9A227',
      size: 16,
      vy: -18,
      life: 1.6,
      bounce: 0,
    });
  }


  function createSpawner(waveDef) {
    const jobs = [];
    const hpMul = waveDef.hpMul || 1;
    for (const s of waveDef.spawns) {
      jobs.push({
        enemy: s.enemy,
        left: s.count,
        interval: s.interval || 0.8,
        delay: s.delay || 0,
        timer: 0,
        started: false,
        laneMode: s.lane,
        fixedLane: typeof s.lane === 'number' ? s.lane : null,
        hpMul: s.hpMul || hpMul,
        elite: !!s.elite,
      });
    }
    return { jobs, laneCycle: 0, done: false, elapsed: 0 };
  }

  function hitTestCell(mx, my, pad) {
    const p = pad || 0;
    let best = null;
    let bestD = Infinity;
    for (let lane = 0; lane < GRID.lanes; lane++) {
      for (let slot = 0; slot < GRID.slots; slot++) {
        const x = GRID.originX + slot * (GRID.cellW + GRID.gapX);
        const y = GRID.originY + lane * (GRID.cellH + GRID.gapY);
        if (mx >= x - p && mx <= x + GRID.cellW + p && my >= y - p && my <= y + GRID.cellH + p) {
          if (!p) return { lane, slot, x, y };
          const cx = x + GRID.cellW * 0.5;
          const cy = y + GRID.cellH * 0.5;
          const d = (mx - cx) * (mx - cx) + (my - cy) * (my - cy);
          if (d < bestD) {
            bestD = d;
            best = { lane, slot, x, y };
          }
        }
      }
    }
    return best;
  }

  function hitTestHero(heroes, mx, my, pad) {
    const px = pad != null ? pad : 0;
    let best = null;
    let bestD = Infinity;
    for (let i = heroes.length - 1; i >= 0; i--) {
      const h = heroes[i];
      const dx = Math.abs(mx - h.x);
      const dy = Math.abs(my - h.y);
      if (dx < 28 + px && dy < 36 + px) {
        if (!px) return h;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = h;
        }
      }
    }
    return best;
  }

  /** 合併成功特效包 */
  function spawnMergeFx(state, hero) {
    const prev = Math.max(1, (hero.star || 1) - 1);
    state.fx.push({ type: 'merge', x: hero.x, y: hero.y, star: hero.star, fromStar: prev, life: 0.7 });
    state.fx.push({ type: 'hit', x: hero.x, y: hero.y, color: '#C9A227', life: 0.48, r: 32 });
    pushFloat(state.floats, {
      x: hero.x,
      y: hero.y - 52,
      text: '升星 ★' + prev + '→★' + hero.star,
      color: '#C9A227',
      size: 17,
      vy: -34,
      life: 1.05,
      bounce: 1.15,
    });
    if (hero.star >= MAX_STAR) {
      state.fx.push({ type: 'maxstar', x: hero.x, y: hero.y, life: 1.15 });
      state.fx.push({ type: 'hit', x: hero.x, y: hero.y - 10, color: '#E8DCC8', life: 0.55, r: 40 });
    } else if (hero.star >= 3) {
      state.fx.push({ type: 'merge', x: hero.x, y: hero.y - 8, star: hero.star, life: 0.5 });
    }
    if (!state.shake || state.shake < 0.16) state.shake = 0.16;
  }

  /** 強化成功特效 */
  function spawnUpgradeFx(state, hero, pathName, level) {
    state.fx.push({
      type: 'upgrade',
      x: hero.x,
      y: hero.y,
      text: pathName + ' +' + level,
      life: 0.65,
      color: '#C9A227',
    });
    state.fx.push({ type: 'hit', x: hero.x, y: hero.y, color: '#D4AF37', life: 0.4, r: 24 });
    pushFloat(state.floats, {
      x: hero.x,
      y: hero.y - 48,
      text: pathName + ' → ' + level,
      color: '#D4AF37',
      size: 15,
      vy: -30,
      life: 1.0,
      bounce: 1.1,
    });
    if (!state.shake || state.shake < 0.1) state.shake = 0.1;
  }

  global.YDBattle = {
    cellCenter,
    laneY,
    makeHero,
    makeEnemy,
    findHeroAt,
    canMerge,
    mergeHeroes,
    applyHeroUpgrades,
    upgradeHero,
    tickHeroes,
    tickEnemies,
    collectDead,
    tickFloats,
    createSpawner,
    hitTestCell,
    hitTestHero,
    spawnMergeFx,
    spawnUpgradeFx,
    pushFloat,
    pushFx,
    announceBoss,
    announceElite,
    announceBond,
    skillMeter,
    activeBonds,
    enemySkillProc,
  };
})(window);
