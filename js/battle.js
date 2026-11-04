/**
 * 銀樓防衛 — 戰鬥／生成／合併邏輯
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
      def,
    };
  }

  function makeEnemy(typeId, lane, extra) {
    const def = ENEMIES[typeId];
    const y = laneY(lane) + (Math.random() * 10 - 5);
    return {
      uid: 'e' + Math.random().toString(36).slice(2, 9),
      id: typeId,
      lane,
      x: 980 + ((extra && extra.xOff) || 0),
      y,
      hp: def.hp * ((extra && extra.hpMul) || 1),
      maxHp: def.hp * ((extra && extra.hpMul) || 1),
      speed: def.speed,
      baseSpeed: def.speed,
      atk: def.atk,
      reward: def.reward,
      radius: def.radius,
      slowT: 0,
      def,
      boss: !!def.boss,
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

  function applyDamage(enemy, amount, floats, kind) {
    enemy.hp -= amount;
    floats.push({
      x: enemy.x,
      y: enemy.y - 16,
      text: '-' + Math.round(amount),
      life: 0.7,
      color: kind === 'crit' ? '#C9A227' : '#E8DCC8',
      vy: -28,
    });
  }

  function heroAttack(hero, enemies, floats, state) {
    const target = pickTarget(hero, enemies);
    if (!target) return;

    let dmg = hero.atk;
    if (hero.def.role === 'assassin' && target.x > 700) dmg = Math.round(dmg * 1.35);

    applyDamage(target, dmg, floats, 'hit');

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
        floats.push({
          x: hero.x,
          y: hero.y - 20,
          text: '槓桿反噬',
          life: 0.8,
          color: '#5A4060',
          vy: -20,
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
      life: 0.12,
    });
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
    state.floats.push({
      x: hero.x,
      y: hero.y - 24,
      text: '+' + ((hero.def.auraSilver || 0) * hero.star).toFixed(1) + '兩',
      life: 0.6,
      color: '#D4AF37',
      vy: -18,
    });
  }

  function tickHeroes(state, dt) {
    for (const h of state.heroes) {
      if (h.hp <= 0) continue;
      tickSupport(h, state.heroes, state, dt);
      h.cd -= dt;
      if (h.cd > 0) continue;
      if (!pickTarget(h, state.enemies)) continue;
      h.cd = h.cooldown;
      heroAttack(h, state.enemies, state.floats, state);
    }
  }

  function tickEnemies(state, dt) {
    const arrived = [];
    for (const e of state.enemies) {
      if (e.slowT > 0) {
        e.slowT -= dt;
        if (e.slowT <= 0) e.speed = e.baseSpeed;
      }
      e.x -= e.speed * dt;
      if (e.x - e.radius <= CORE.x + 20) arrived.push(e);
    }
    for (const e of arrived) {
      state.coreHp -= e.atk;
      state.floats.push({
        x: CORE.x,
        y: CORE.y - 40,
        text: '破門 -' + e.atk,
        life: 0.9,
        color: '#C45C4A',
        vy: -30,
      });
      e.hp = 0;
    }
  }

  function collectDead(state) {
    const dead = state.enemies.filter((e) => e.hp <= 0);
    for (const e of dead) {
      if (e.x > CORE.x + 20) {
        state.silver += e.reward;
        state.floats.push({
          x: e.x,
          y: e.y,
          text: '+' + e.reward,
          life: 0.7,
          color: '#D4AF37',
          vy: -24,
        });
        state.kills += 1;
      }
    }
    state.enemies = state.enemies.filter((e) => e.hp > 0);
    state.heroes = state.heroes.filter((h) => h.hp > 0);
  }

  function tickFloats(state, dt) {
    for (const f of state.floats) {
      f.life -= dt;
      f.y += (f.vy || -20) * dt;
    }
    state.floats = state.floats.filter((f) => f.life > 0);
    for (const fx of state.fx) fx.life -= dt;
    state.fx = state.fx.filter((fx) => fx.life > 0);
  }

  function createSpawner(waveDef) {
    const jobs = [];
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
  };
})(window);
