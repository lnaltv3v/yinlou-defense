/**
 * 銀樓防衛 — 戰鬥／生成／合併邏輯 v0.6.0
 */
(function (global) {
  const { HEROES, ENEMIES, GRID, CORE, heroStats, activeBonds, bondModsFor, MAX_STAR } = global.YD;

  function cellCenter(lane, slot) {
    const x = GRID.originX + slot * (GRID.cellW + GRID.gapX) + GRID.cellW / 2;
    const y = GRID.originY + lane * (GRID.cellH + GRID.gapY) + GRID.cellH / 2;
    return { x, y };
  }

  function laneY(lane) {
    return GRID.originY + lane * (GRID.cellH + GRID.gapY) + GRID.cellH / 2;
  }

  function makeHero(id, lane, slot, star) {
    const def = HEROES[id];
    const st = heroStats(def, star);
    const c = cellCenter(lane, slot);
    return {
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
      cd: Math.random() * 0.3,
      auraT: 0,
      auraTicks: 0,
      hitFlash: 0,
      atkBuff: 0,
      atkBuffT: 0,
      atkCount: 0,
      swingT: 0,
      idlePhase: Math.random() * Math.PI * 2,
      guardProcT: 0,
      def,
    };
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
      def,
      boss: !!def.boss,
      elite: elite,
      attackRange: def.attackRange || 45,
      attackCd: (def.attackCd || 1) * (elite ? 0.9 : 1),
      cd: Math.random() * 0.4,
      preferHero: def.preferHero != null ? def.preferHero : 0.5,
      mode: 'march',
      hitFlash: 0,
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

    const next = makeHero(target.id, lane, slot, nextStar);
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

  function applyDamage(enemy, amount, floats, kind) {
    enemy.hp -= amount;
    enemy.hitFlash = 0.12;
    const crit = kind === 'crit' || amount >= 28;
    pushFloat(floats, {
      x: enemy.x,
      y: enemy.y - 16,
      text: '-' + Math.round(amount),
      color: crit ? '#C9A227' : kind === 'splash' ? '#A080C0' : '#E8DCC8',
      size: crit ? 18 : 15,
      vy: -42,
      life: 0.85,
    });
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
            y: hero.y - 40,
            text: sk.name + '！',
            color: hero.def.color,
            size: 13,
            vy: -26,
            life: 0.75,
          });
          state.fx.push({
            type: 'skill',
            x: hero.x,
            y: hero.y,
            color: hero.def.color,
            life: 0.4,
            text: sk.name,
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
    }

    applyDamage(target, dmg, floats, kind);

    if (hero.def.slow && target.hp > 0 && !(skillProc && sk && sk.deepSlow)) {
      target.slowT = Math.max(target.slowT, hero.def.slowDur);
      target.speed = target.baseSpeed * (1 - hero.def.slow);
    }

    if (hero.def.splash) {
      const rad = hero.def.splash * splashMul;
      for (const e of enemies) {
        if (e.uid === target.uid || e.hp <= 0) continue;
        if (Math.hypot(e.x - target.x, e.y - target.y) <= rad) {
          applyDamage(e, Math.round(dmg * 0.55 * (splashMul > 1 ? 1.1 : 1)), floats, 'splash');
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
    if (!state.shake || state.shake < 0.08) state.shake = kind === 'crit' ? 0.12 : 0.06;
  }

  function tickSupport(hero, heroes, state, dt) {
    if (hero.def.role !== 'support') return;
    const bonds = state._bonds || activeBonds(heroes);
    const mods = bondModsFor(hero.id, bonds);
    hero.auraT += dt;
    if (hero.auraT < 1) return;
    hero.auraT = 0;
    hero.auraTicks = (hero.auraTicks || 0) + 1;
    const sk = hero.def.skill;
    let healMul = 1;
    let silExtra = 0;
    if (sk && sk.every) {
      hero.skillProgress = ((hero.auraTicks || 0) % sk.every) / sk.every;
      hero.skillReadyIn = sk.every - ((hero.auraTicks || 0) % sk.every);
    }
    if (sk && sk.every && hero.auraTicks % sk.every === 0) {
      healMul = sk.healMul || 1.35;
      silExtra = sk.silverBurst || 3;
      hero.skillProgress = 1;
      pushFloat(state.floats, {
        x: hero.x,
        y: hero.y - 38,
        text: (sk.name || '分紅') + '！',
        color: '#3A7A6A',
        size: 12,
        vy: -22,
        life: 0.7,
      });
      state.fx.push({ type: 'skill', x: hero.x, y: hero.y, color: '#3A7A6A', life: 0.4, text: sk.name });
    }
    const heal = (hero.def.auraHeal || 0) * hero.star * mods.auraMul * healMul;
    const sil = (hero.def.auraSilver || 0) * hero.star * mods.auraMul + silExtra;
    for (const h of heroes) {
      if (Math.abs(h.lane - hero.lane) <= 1) {
        h.hp = Math.min(h.maxHp, h.hp + heal);
      }
    }
    state.silver += sil;
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

  function tickHeroes(state, dt) {
    state._bonds = activeBonds(state.heroes);
    for (const h of state.heroes) {
      if (h.hp <= 0) continue;
      if (h.hitFlash > 0) h.hitFlash -= dt;
      if (h.swingT > 0) h.swingT = Math.max(0, h.swingT - dt);
      if (h.guardProcT > 0) h.guardProcT = Math.max(0, h.guardProcT - dt);
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
      if (h.cd > 0) continue;
      if (h.def.role === 'buffer') {
        const allies = state.heroes.some(
          (o) => o.uid !== h.uid && o.hp > 0 && Math.abs(o.lane - h.lane) <= 1 && Math.abs(o.slot - h.slot) <= 1
        );
        if (!allies && !pickTarget(h, state.enemies, mods.rangeBonus)) continue;
      } else if (!pickTarget(h, state.enemies, mods.rangeBonus)) {
        continue;
      }
      h.cd = h.cooldown * mods.cdMul;
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

  function tickEnemies(state, dt) {
    const arrived = [];
    for (const e of state.enemies) {
      if (e.hitFlash > 0) e.hitFlash -= dt;
      if (e.slowT > 0) {
        e.slowT -= dt;
        if (e.slowT <= 0) e.speed = e.baseSpeed;
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

      if (e.mode === 'fight' && hero && hero.hp > 0) {
        if (e.cd <= 0) {
          e.cd = e.attackCd;
          applyHeroDamage(hero, e.atk, state.floats, state);
          state.fx.push({
            type: 'hit',
            x: hero.x,
            y: hero.y,
            color: e.def.color,
            life: 0.16,
            r: 12,
          });
          if (!state.shake || state.shake < 0.1) state.shake = 0.1;
        }
      } else {
        e.x -= e.speed * dt;
      }

      if (e.x - e.radius <= CORE.x + 20) arrived.push(e);
    }

    for (const e of arrived) {
      state.coreHp -= e.atk;
      state.coreHitFlash = 0.35;
      state.shake = 0.22;
      pushFloat(state.floats, {
        x: CORE.x,
        y: CORE.y - 40,
        text: '破門 -' + e.atk,
        color: '#C45C4A',
        size: 18,
        vy: -34,
        life: 1.0,
      });
      state.fx.push({ type: 'coreHit', life: 0.35 });
      e.hp = 0;
    }
  }

  function collectDead(state) {
    const dead = state.enemies.filter((e) => e.hp <= 0);
    for (const e of dead) {
      if (e.x > CORE.x + 20) {
        state.silver += e.reward;
        pushFloat(state.floats, {
          x: e.x,
          y: e.y,
          text: '+' + e.reward,
          color: '#D4AF37',
          size: 14,
          vy: -28,
          life: 0.75,
        });
        state.kills += 1;
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
        state.fx.push({ type: 'hit', x: e.x, y: e.y, color: '#C9A227', life: 0.2, r: 14 });
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
    }
    state.heroes = state.heroes.filter((h) => h.hp > 0);
  }

  function tickFloats(state, dt) {
    for (const f of state.floats) {
      f.life -= dt;
      const t = 1 - f.life / (f.maxLife || 0.75);
      const bounce = f.bounce ? Math.sin(Math.min(1, t * 8) * Math.PI) * 4 * (1 - t) : 0;
      f.y += (f.vy || -20) * dt;
      f._bounceY = bounce;
    }
    state.floats = state.floats.filter((f) => f.life > 0);
    for (const fx of state.fx) fx.life -= dt;
    state.fx = state.fx.filter((fx) => fx.life > 0);
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt);
    if (state.coreHitFlash > 0) state.coreHitFlash = Math.max(0, state.coreHitFlash - dt);
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
    for (let lane = 0; lane < GRID.lanes; lane++) {
      for (let slot = 0; slot < GRID.slots; slot++) {
        const x = GRID.originX + slot * (GRID.cellW + GRID.gapX);
        const y = GRID.originY + lane * (GRID.cellH + GRID.gapY);
        if (mx >= x - p && mx <= x + GRID.cellW + p && my >= y - p && my <= y + GRID.cellH + p) {
          return { lane, slot, x, y };
        }
      }
    }
    return null;
  }

  function hitTestHero(heroes, mx, my, pad) {
    const px = pad != null ? pad : 0;
    for (let i = heroes.length - 1; i >= 0; i--) {
      const h = heroes[i];
      if (Math.abs(mx - h.x) < 28 + px && Math.abs(my - h.y) < 36 + px) return h;
    }
    return null;
  }

  /** 合併成功特效包 */
  function spawnMergeFx(state, hero) {
    state.fx.push({ type: 'merge', x: hero.x, y: hero.y, star: hero.star, life: 0.55 });
    state.fx.push({ type: 'hit', x: hero.x, y: hero.y, color: '#C9A227', life: 0.4, r: 28 });
    if (hero.star >= MAX_STAR) {
      state.fx.push({ type: 'maxstar', x: hero.x, y: hero.y, life: 1.05 });
      state.fx.push({ type: 'hit', x: hero.x, y: hero.y - 10, color: '#E8DCC8', life: 0.5, r: 36 });
    } else if (hero.star >= 3) {
      state.fx.push({ type: 'merge', x: hero.x, y: hero.y - 8, star: hero.star, life: 0.45 });
    }
    if (!state.shake || state.shake < 0.14) state.shake = 0.14;
  }

  global.YDBattle = {
    cellCenter,
    laneY,
    makeHero,
    makeEnemy,
    findHeroAt,
    canMerge,
    mergeHeroes,
    tickHeroes,
    tickEnemies,
    collectDead,
    tickFloats,
    createSpawner,
    hitTestCell,
    hitTestHero,
    spawnMergeFx,
    pushFloat,
    announceBoss,
    announceElite,
    announceBond,
    skillMeter,
    activeBonds,
  };
})(window);
