/**
 * 銀樓防衛 — 戰鬥／生成／合併邏輯 v0.2.0
 */
(function (global) {
  const { HEROES, ENEMIES, GRID, CORE, heroStats } = global.YD;

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
      hitFlash: 0,
      def,
    };
  }

  function makeEnemy(typeId, lane, extra) {
    const def = ENEMIES[typeId];
    const hpMul = (extra && extra.hpMul) || 1;
    const y = laneY(lane) + (Math.random() * 10 - 5);
    return {
      uid: 'e' + Math.random().toString(36).slice(2, 9),
      id: typeId,
      lane,
      x: 980 + ((extra && extra.xOff) || 0),
      y,
      hp: def.hp * hpMul,
      maxHp: def.hp * hpMul,
      speed: def.speed,
      baseSpeed: def.speed,
      atk: Math.round(def.atk * (0.9 + hpMul * 0.1)),
      reward: Math.round(def.reward * (1 + (hpMul - 1) * 0.5)),
      radius: def.radius,
      slowT: 0,
      def,
      boss: !!def.boss,
      attackRange: def.attackRange || 45,
      attackCd: def.attackCd || 1,
      cd: Math.random() * 0.4,
      preferHero: def.preferHero != null ? def.preferHero : 0.5,
      mode: 'march', // march | fight
      hitFlash: 0,
    };
  }

  function findHeroAt(heroes, lane, slot) {
    return heroes.find((h) => h.lane === lane && h.slot === slot);
  }

  function canMerge(a, b) {
    return a && b && a.uid !== b.uid && a.id === b.id && a.star === b.star && a.star < 3;
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
    next.hp = Math.max(1, Math.round(next.maxHp * Math.min(1, ratio + 0.25)));

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

  function pickTarget(hero, enemies) {
    const inRange = enemies.filter((e) => {
      if (e.hp <= 0) return false;
      const sameLane = e.lane === hero.lane;
      if (hero.def.role === 'support') {
        if (Math.abs(e.lane - hero.lane) > 1) return false;
      } else if (!sameLane) {
        return false;
      }
      const d = Math.hypot(e.x - hero.x, e.y - hero.y);
      return d <= hero.range + e.radius;
    });
    if (!inRange.length) return null;
    if (hero.def.preferBack) {
      return inRange.reduce((a, b) => (a.x > b.x ? a : b));
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

  function applyHeroDamage(hero, amount, floats) {
    hero.hp -= amount;
    hero.hitFlash = 0.15;
    pushFloat(floats, {
      x: hero.x,
      y: hero.y - 28,
      text: '-' + Math.round(amount),
      color: '#C45C4A',
      size: 13,
      vy: -30,
      life: 0.7,
    });
  }

  function heroAttack(hero, enemies, floats, state) {
    const target = pickTarget(hero, enemies);
    if (!target) return;

    let dmg = hero.atk;
    let kind = 'hit';
    if (hero.def.role === 'assassin' && target.x > 700) {
      dmg = Math.round(dmg * 1.35);
      kind = 'crit';
    }

    applyDamage(target, dmg, floats, kind);

    if (hero.def.slow && target.hp > 0) {
      target.slowT = Math.max(target.slowT, hero.def.slowDur);
      target.speed = target.baseSpeed * (1 - hero.def.slow);
    }

    if (hero.def.splash) {
      for (const e of enemies) {
        if (e.uid === target.uid || e.hp <= 0) continue;
        if (Math.hypot(e.x - target.x, e.y - target.y) <= hero.def.splash) {
          applyDamage(e, Math.round(dmg * 0.55), floats, 'splash');
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
    hero.auraT += dt;
    if (hero.auraT < 1) return;
    hero.auraT = 0;
    for (const h of heroes) {
      if (Math.abs(h.lane - hero.lane) <= 1) {
        h.hp = Math.min(h.maxHp, h.hp + (hero.def.auraHeal || 0) * hero.star);
      }
    }
    state.silver += (hero.def.auraSilver || 0) * hero.star;
    pushFloat(state.floats, {
      x: hero.x,
      y: hero.y - 24,
      text: '+' + ((hero.def.auraSilver || 0) * hero.star).toFixed(1) + '兩',
      color: '#D4AF37',
      size: 12,
      vy: -18,
      life: 0.6,
    });
  }

  function tickHeroes(state, dt) {
    for (const h of state.heroes) {
      if (h.hp <= 0) continue;
      if (h.hitFlash > 0) h.hitFlash -= dt;
      tickSupport(h, state.heroes, state, dt);
      h.cd -= dt;
      if (h.cd > 0) continue;
      if (!pickTarget(h, state.enemies)) continue;
      h.cd = h.cooldown;
      heroAttack(h, state.enemies, state.floats, state);
    }
  }

  function nearestHeroOnLane(enemy, heroes) {
    let best = null;
    let bestD = Infinity;
    for (const h of heroes) {
      if (h.hp <= 0) continue;
      if (h.lane !== enemy.lane) continue;
      // 俠客要喺敵人左邊（銀樓方向）或貼近
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

      // 混用：有機率／距離內就打塔，否則衝核心
      if (inHeroRange && (e.mode === 'fight' || Math.random() < e.preferHero * 0.02 + (inHeroRange ? 0.5 : 0))) {
        e.mode = 'fight';
      } else if (!inHeroRange) {
        e.mode = 'march';
      }

      if (e.mode === 'fight' && hero && hero.hp > 0) {
        // 停下攻擊最近俠客
        if (e.cd <= 0) {
          e.cd = e.attackCd;
          applyHeroDamage(hero, e.atk, state.floats);
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
      state.fx.push({
        type: 'coreHit',
        life: 0.35,
      });
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
        state.fx.push({ type: 'hit', x: e.x, y: e.y, color: '#C9A227', life: 0.2, r: 14 });
      }
    }
    state.enemies = state.enemies.filter((e) => e.hp > 0);
    // 俠客陣亡
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
      });
    }
    return { jobs, laneCycle: 0, done: false, elapsed: 0 };
  }

  function hitTestCell(mx, my) {
    for (let lane = 0; lane < GRID.lanes; lane++) {
      for (let slot = 0; slot < GRID.slots; slot++) {
        const x = GRID.originX + slot * (GRID.cellW + GRID.gapX);
        const y = GRID.originY + lane * (GRID.cellH + GRID.gapY);
        if (mx >= x && mx <= x + GRID.cellW && my >= y && my <= y + GRID.cellH) {
          return { lane, slot, x, y };
        }
      }
    }
    return null;
  }

  function hitTestHero(heroes, mx, my) {
    for (let i = heroes.length - 1; i >= 0; i--) {
      const h = heroes[i];
      if (Math.abs(mx - h.x) < 28 && Math.abs(my - h.y) < 36) return h;
    }
    return null;
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
  };
})(window);
