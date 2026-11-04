/**
 * 銀樓防衛 — 主循環 v0.3.0
 * 經濟曲線、合併回報、羈絆、暫停／設定、短教學、欄位高亮
 */
(function () {
  const {
    STAGES,
    ENDLESS,
    HEROES,
    SPEED_OPTIONS,
    loadSave,
    writeSave,
    defaultSave,
    buildEndlessWave,
    summonCost,
    mergeRebate,
    activeBonds,
  } = YD;
  const Battle = YDBattle;
  const UI = YDUI;

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  let save = loadSave();
  let shopApi = null;
  let speedApi = null;
  let stageApi = null;

  function freshState(stageIndex, endless) {
    let stage;
    if (endless) {
      stage = {
        id: ENDLESS.id,
        name: ENDLESS.name,
        startSilver: ENDLESS.startSilver,
        coreHp: ENDLESS.coreHp,
        unlockHeroes: ENDLESS.unlockHeroes,
        waves: [],
      };
    } else {
      stage = STAGES[Math.min(Math.max(0, stageIndex), STAGES.length - 1)];
      stageIndex = STAGES.indexOf(stage);
    }
    return {
      stage,
      stageIndex: endless ? -1 : stageIndex,
      endless: !!endless,
      phase: 'prep',
      silver: stage.startSilver,
      coreHp: stage.coreHp,
      coreMax: stage.coreHp,
      heroes: [],
      enemies: [],
      floats: [],
      fx: [],
      waveIndex: 0,
      spawner: null,
      selectedShopId: null,
      selectedHeroUid: null,
      mergeFromUid: null,
      kills: 0,
      paused: false,
      speed: save.lastSpeed && SPEED_OPTIONS.includes(save.lastSpeed) ? save.lastSpeed : 1,
      shake: 0,
      coreHitFlash: 0,
      drag: null,
      tutorialStep: save.skipTutorial || save.maxStageCleared > 0 ? 99 : 0,
      summonCounts: {},
      showCellHints: save.showCellHints !== false,
      _bonds: [],
    };
  }

  let state = freshState(Math.min(save.maxStageCleared, STAGES.length - 1), false);

  function syncAll() {
    state._bonds = activeBonds(state.heroes);
    if (shopApi) shopApi.refresh();
    if (speedApi) speedApi.refresh();
    if (stageApi) stageApi.refresh(state.endless ? null : state.stage.id, state.endless);
    UI.updateHud(state);
    updateHint();
  }

  function advanceTutorial(to) {
    if (state.tutorialStep >= 99) return;
    if (to != null) state.tutorialStep = Math.max(state.tutorialStep, to);
    else state.tutorialStep += 1;
    if (state.tutorialStep >= 3) state.tutorialStep = 99;
  }

  function updateHint() {
    if (state.phase === 'won' || state.phase === 'lost') return;
    if (state.paused) {
      UI.setHint('已暫停 — 再按「暫停」或 Esc 繼續｜設定可開關欄位高亮');
      return;
    }
    if (state.tutorialStep === 0) {
      UI.setHint('① 拖底欄俠客到綠色空格放置（同種愈召愈貴）');
      return;
    }
    if (state.tutorialStep === 1) {
      UI.setHint('② 拖兩名同種同星疊埋 → 合併升星（有銀兩回報）');
      return;
    }
    if (state.tutorialStep === 2) {
      UI.setHint('③ 按「開波」守銀樓；齊人觸發羈絆');
      return;
    }
    if (state.drag && state.drag.active) {
      UI.setHint('拖到空格放置／調位；拖到同種同星可合併');
      return;
    }
    if (state.selectedShopId) {
      const cost = summonCost(state.selectedShopId, state.summonCounts);
      UI.setHint(
        '已選「' + HEROES[state.selectedShopId].name + '」（' + cost + ' 兩）— 點／拖到空格'
      );
      return;
    }
    if (state.mergeFromUid) {
      UI.setHint('已選場上俠客 — 拖到同種同星合併，或拖到空格調位');
      return;
    }
    const bondTxt =
      state._bonds && state._bonds.length
        ? '｜羈絆：' + state._bonds.map((b) => b.name).join('、')
        : '';
    UI.setHint('拖放放置／合併｜開波｜暫停／設定' + bondTxt);
  }

  shopApi = UI.buildShop(
    (id) => {
      if (state.phase === 'won' || state.phase === 'lost') return;
      state.selectedShopId = state.selectedShopId === id ? null : id;
      state.selectedHeroUid = null;
      state.mergeFromUid = null;
      syncAll();
      if (state.selectedShopId) {
        UI.toast('已選 ' + HEROES[id].name + ' — 放到空格');
        if (state.tutorialStep === 0) advanceTutorial(0);
      }
    },
    () => state.selectedShopId,
    () => state.silver,
    {
      getSummonCounts: () => state.summonCounts,
      onShopDragStart(id, ev) {
        if (state.phase === 'won' || state.phase === 'lost') {
          ev.preventDefault();
          return;
        }
        const cost = summonCost(id, state.summonCounts);
        if (state.silver < cost) {
          ev.preventDefault();
          UI.toast('銀兩不足（而家要 ' + cost + '）');
          return;
        }
        state.selectedShopId = id;
        state.mergeFromUid = null;
        state.selectedHeroUid = null;
        try {
          ev.dataTransfer.setData('text/plain', 'shop:' + id);
          ev.dataTransfer.effectAllowed = 'copy';
        } catch (_) {}
      },
    }
  );

  speedApi = UI.buildSpeedBar(
    () => state.speed,
    (sp) => {
      state.speed = sp;
      save.lastSpeed = sp;
      writeSave(save);
      syncAll();
      UI.toast('速度 ' + sp + '×');
    }
  );

  stageApi = UI.buildStageBar(
    () => save,
    (idx) => {
      if (state.phase === 'wave' && !state.paused) {
        UI.toast('交戰中請先暫停或打完再換關');
        return;
      }
      UI.hideOverlay();
      state = freshState(idx, false);
      resetWaveBtn();
      syncAll();
      UI.toast('進入：' + state.stage.name);
    },
    () => {
      if (state.phase === 'wave' && !state.paused) {
        UI.toast('交戰中請先暫停或打完再換關');
        return;
      }
      if (save.maxStageCleared < 1) {
        UI.toast('先通關第 1 關解鎖無盡');
        return;
      }
      UI.hideOverlay();
      state = freshState(0, true);
      resetWaveBtn();
      syncAll();
      UI.toast('無盡殺跌 — 愈打愈密');
    }
  );

  function resetWaveBtn() {
    const btn = document.getElementById('btn-wave');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '開波';
    }
  }

  function currentWaveDef() {
    if (state.endless) return buildEndlessWave(state.waveIndex);
    return state.stage.waves[state.waveIndex - 1];
  }

  function startWave() {
    if (state.paused) {
      UI.toast('暫停中 — 先繼續再開波');
      return;
    }
    if (state.phase !== 'prep') return;
    if (!state.endless && state.waveIndex >= state.stage.waves.length) return;
    state.waveIndex += 1;
    const waveDef = currentWaveDef();
    state.spawner = Battle.createSpawner(waveDef);
    for (const job of state.spawner.jobs) {
      job.timer = job.interval;
      job.started = false;
    }
    state.phase = 'wave';
    advanceTutorial(3);
    UI.toast((state.endless ? '無盡第 ' : '第 ') + state.waveIndex + ' 波來襲！');
    syncAll();
    const btn = document.getElementById('btn-wave');
    if (btn) btn.disabled = true;
  }

  function onWaveCleared() {
    state.spawner = null;
    if (!state.endless && state.waveIndex >= state.stage.waves.length) {
      state.phase = 'won';
      save.totalSilver += Math.floor(state.silver);
      save.maxStageCleared = Math.max(save.maxStageCleared, state.stage.id);
      writeSave(save);
      const nextIdx = state.stageIndex + 1;
      const hasNext = nextIdx < STAGES.length;
      const extras = [];
      if (hasNext) {
        extras.push({
          label: '下一關：' + STAGES[nextIdx].name,
          onClick: () => {
            UI.hideOverlay();
            state = freshState(nextIdx, false);
            resetWaveBtn();
            syncAll();
          },
        });
      }
      extras.push({
        label: '再打本關',
        onClick: () => {
          UI.hideOverlay();
          resetRun(false);
        },
      });
      UI.showOverlay(
        '銀樓倖存',
        '打退 ' +
          state.waveIndex +
          ' 波！擊殺 ' +
          state.kills +
          '。累計銀兩帳 ' +
          save.totalSilver +
          '。' +
          (hasNext
            ? '\n已解鎖下一關。'
            : '\n四關皆破！可挑戰無盡。'),
        hasNext ? '下一關' : '回第 1 關',
        () => {
          UI.hideOverlay();
          if (hasNext) {
            state = freshState(nextIdx, false);
          } else {
            state = freshState(0, false);
          }
          resetWaveBtn();
          syncAll();
        },
        extras
      );
      syncAll();
      return;
    }

    if (state.endless) {
      save.bestEndlessWave = Math.max(save.bestEndlessWave || 0, state.waveIndex);
      writeSave(save);
    }

    state.phase = 'prep';
    const bonus = 20 + state.waveIndex * 7;
    state.silver += bonus;
    UI.toast('波次結束，整備中（補銀 +' + bonus + '）');
    const btn = document.getElementById('btn-wave');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '下一波';
    }
    syncAll();
  }

  function lose() {
    state.phase = 'lost';
    state.paused = false;
    if (state.endless) {
      save.bestEndlessWave = Math.max(save.bestEndlessWave || 0, state.waveIndex);
      writeSave(save);
    }
    UI.showOverlay(
      '銀樓失守',
      '核心被攻破。擊殺 ' +
        state.kills +
        (state.endless
          ? '｜無盡撐到第 ' + state.waveIndex + ' 波（最佳 ' + (save.bestEndlessWave || 0) + '）'
          : '') +
        '。調整陣容／羈絆再試。',
      '重開本關',
      () => {
        UI.hideOverlay();
        resetRun(state.endless);
      }
    );
  }

  function resetRun(keepEndless) {
    const endless = keepEndless && state.endless;
    const idx = endless ? 0 : state.stageIndex >= 0 ? state.stageIndex : 0;
    state = freshState(idx, endless);
    resetWaveBtn();
    syncAll();
    UI.toast('新一局 — 放置俠客後開波');
  }

  function togglePause() {
    if (state.phase === 'won' || state.phase === 'lost') return;
    state.paused = !state.paused;
    UI.toast(state.paused ? '已暫停' : '繼續');
    syncAll();
  }

  function openSettings() {
    state.paused = true;
    UI.showSettings({
      getSave: () => save,
      onToggleHints: () => {
        save.showCellHints = save.showCellHints === false;
        writeSave(save);
        state.showCellHints = save.showCellHints !== false;
        syncAll();
      },
      onSkipTutorial: () => {
        save.skipTutorial = !save.skipTutorial;
        writeSave(save);
        state.tutorialStep = save.skipTutorial ? 99 : 0;
        syncAll();
      },
      onClearSave: () => {
        save = defaultSave();
        writeSave(save);
        state = freshState(0, false);
        resetWaveBtn();
        syncAll();
        UI.toast('存檔已清除');
      },
      onClose: () => {
        syncAll();
      },
      onRestart: () => {
        resetRun(state.endless);
      },
    });
  }

  document.getElementById('btn-wave').addEventListener('click', startWave);
  document.getElementById('btn-reset').addEventListener('click', () => {
    UI.hideOverlay();
    resetRun(state.endless);
  });
  document.getElementById('btn-pause').addEventListener('click', togglePause);
  document.getElementById('btn-settings').addEventListener('click', openSettings);

  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      const ov = document.getElementById('overlay');
      if (ov && ov.classList.contains('show') && ov.classList.contains('settings-mode')) {
        UI.hideOverlay();
        syncAll();
        return;
      }
      togglePause();
    }
    if (ev.key === 'p' || ev.key === 'P') togglePause();
  });

  function canvasPos(ev) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src =
      ev.touches && ev.touches[0]
        ? ev.touches[0]
        : ev.changedTouches && ev.changedTouches[0]
          ? ev.changedTouches[0]
          : ev;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    };
  }

  function tryPlaceFromShop(shopId, cell) {
    if (!cell) return false;
    const occupied = Battle.findHeroAt(state.heroes, cell.lane, cell.slot);
    if (occupied) {
      UI.toast('此格已有人');
      return false;
    }
    const cost = summonCost(shopId, state.summonCounts);
    const def = HEROES[shopId];
    if (state.silver < cost) {
      UI.toast('銀兩不足（要 ' + cost + '）');
      return false;
    }
    state.silver -= cost;
    state.summonCounts[shopId] = (state.summonCounts[shopId] || 0) + 1;
    state.heroes.push(Battle.makeHero(def.id, cell.lane, cell.slot, 1));
    UI.toast('上陣：' + def.name + '（−' + cost + '）');
    advanceTutorial(1);
    const nextCost = summonCost(shopId, state.summonCounts);
    if (state.silver < nextCost) state.selectedShopId = null;
    syncAll();
    return true;
  }

  function doMerge(fromHero, occupied) {
    const now = Battle.mergeHeroes(state.heroes, fromHero, occupied);
    if (!now) return false;
    const rebate = mergeRebate(now.id, now.star);
    if (rebate > 0) {
      state.silver += rebate;
      Battle.pushFloat(state.floats, {
        x: now.x,
        y: now.y - 36,
        text: '合併 +' + rebate,
        color: '#D4AF37',
        size: 14,
        vy: -28,
        life: 0.9,
      });
    }
    Battle.spawnMergeFx(state, now);
    UI.toast(HEROES[now.id].name + ' → ' + now.star + ' 星' + (rebate ? '（+' + rebate + '兩）' : ''));
    advanceTutorial(2);
    state.mergeFromUid = null;
    state.selectedHeroUid = null;
    state.selectedShopId = null;
    syncAll();
    return true;
  }

  function tryMergeOrSelect(fromHero, cell) {
    if (!cell) return false;
    const occupied = Battle.findHeroAt(state.heroes, cell.lane, cell.slot);
    if (occupied && Battle.canMerge(fromHero, occupied)) {
      return doMerge(fromHero, occupied);
    }
    if (!occupied && fromHero) {
      fromHero.lane = cell.lane;
      fromHero.slot = cell.slot;
      const c = Battle.cellCenter(cell.lane, cell.slot);
      fromHero.x = c.x;
      fromHero.y = c.y;
      UI.toast('調位');
      state.mergeFromUid = null;
      state.selectedHeroUid = null;
      syncAll();
      return true;
    }
    return false;
  }

  canvas.addEventListener('click', (ev) => {
    if (state._suppressClick) {
      state._suppressClick = false;
      return;
    }
    if (state.phase === 'won' || state.phase === 'lost') return;
    if (state.paused) {
      togglePause();
      return;
    }
    const { x, y } = canvasPos(ev);
    const cell = Battle.hitTestCell(x, y);
    if (!cell) return;

    const occupied = Battle.findHeroAt(state.heroes, cell.lane, cell.slot);

    if (state.mergeFromUid) {
      const from = state.heroes.find((h) => h.uid === state.mergeFromUid);
      if (occupied && from && Battle.canMerge(from, occupied)) {
        doMerge(from, occupied);
        return;
      }
      if (!occupied) {
        state.mergeFromUid = null;
        state.selectedHeroUid = null;
        syncAll();
        return;
      }
      state.mergeFromUid = occupied.uid;
      state.selectedHeroUid = occupied.uid;
      UI.toast('再點同種同星合併（而家 ' + occupied.star + ' 星）');
      syncAll();
      return;
    }

    if (state.selectedShopId) {
      tryPlaceFromShop(state.selectedShopId, cell);
      return;
    }

    if (occupied) {
      state.selectedHeroUid = occupied.uid;
      state.mergeFromUid = occupied.uid;
      UI.toast('已選 ' + HEROES[occupied.id].name + ' — 合併或調位');
      syncAll();
    }
  });

  let ptr = null;

  function clearDrag() {
    state.drag = null;
    ptr = null;
    canvas.classList.remove('dragging');
    syncAll();
  }

  canvas.addEventListener('pointerdown', (ev) => {
    if (state.phase === 'won' || state.phase === 'lost' || state.paused) return;
    if (ev.button != null && ev.button !== 0) return;
    const { x, y } = canvasPos(ev);
    const hero = Battle.hitTestHero(state.heroes, x, y);
    if (hero) {
      ptr = {
        kind: 'hero',
        heroUid: hero.uid,
        startX: x,
        startY: y,
        moved: false,
        pointerId: ev.pointerId,
      };
      try {
        canvas.setPointerCapture(ev.pointerId);
      } catch (_) {}
      state.selectedShopId = null;
      state.selectedHeroUid = hero.uid;
      state.mergeFromUid = hero.uid;
      state.drag = {
        active: false,
        kind: 'hero',
        heroUid: hero.uid,
        hero,
        x,
        y,
        hoverLane: hero.lane,
        hoverSlot: hero.slot,
        validHover: true,
      };
      return;
    }
    if (state.selectedShopId) {
      ptr = {
        kind: 'shop',
        shopId: state.selectedShopId,
        startX: x,
        startY: y,
        moved: false,
        pointerId: ev.pointerId,
      };
      try {
        canvas.setPointerCapture(ev.pointerId);
      } catch (_) {}
      state.drag = {
        active: true,
        kind: 'shop',
        shopId: state.selectedShopId,
        x,
        y,
        hoverLane: null,
        hoverSlot: null,
        validHover: false,
      };
    }
  });

  canvas.addEventListener('pointermove', (ev) => {
    if (!ptr) return;
    const { x, y } = canvasPos(ev);
    const dx = x - ptr.startX;
    const dy = y - ptr.startY;
    if (!ptr.moved && Math.hypot(dx, dy) > 8) {
      ptr.moved = true;
      if (state.drag) state.drag.active = true;
      canvas.classList.add('dragging');
    }
    if (!state.drag) return;
    state.drag.x = x;
    state.drag.y = y;
    const cell = Battle.hitTestCell(x, y);
    if (cell) {
      state.drag.hoverLane = cell.lane;
      state.drag.hoverSlot = cell.slot;
      const occ = Battle.findHeroAt(state.heroes, cell.lane, cell.slot);
      if (ptr.kind === 'shop') {
        state.drag.validHover = !occ;
      } else if (ptr.kind === 'hero') {
        const from = state.heroes.find((h) => h.uid === ptr.heroUid);
        if (!occ) state.drag.validHover = true;
        else if (from && Battle.canMerge(from, occ)) state.drag.validHover = true;
        else state.drag.validHover = false;
      }
    } else {
      state.drag.hoverLane = null;
      state.drag.hoverSlot = null;
      state.drag.validHover = false;
    }
  });

  function endPointer(ev) {
    if (!ptr) return;
    const { x, y } = canvasPos(ev);
    const cell = Battle.hitTestCell(x, y);
    const wasDrag = ptr.moved;

    if (wasDrag) {
      state._suppressClick = true;
      if (ptr.kind === 'shop') {
        if (cell) tryPlaceFromShop(ptr.shopId, cell);
      } else if (ptr.kind === 'hero') {
        const from = state.heroes.find((h) => h.uid === ptr.heroUid);
        if (from && cell) {
          if (!tryMergeOrSelect(from, cell)) {
            state.mergeFromUid = from.uid;
            state.selectedHeroUid = from.uid;
          }
        }
      }
    }
    clearDrag();
  }

  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', () => clearDrag());

  canvas.addEventListener('dragover', (ev) => {
    ev.preventDefault();
    const { x, y } = canvasPos(ev);
    const cell = Battle.hitTestCell(x, y);
    if (!state.drag) {
      state.drag = {
        active: true,
        kind: 'shop',
        shopId: state.selectedShopId,
        x,
        y,
        hoverLane: cell && cell.lane,
        hoverSlot: cell && cell.slot,
        validHover: !!(cell && !Battle.findHeroAt(state.heroes, cell.lane, cell.slot)),
      };
    } else {
      state.drag.x = x;
      state.drag.y = y;
      if (cell) {
        state.drag.hoverLane = cell.lane;
        state.drag.hoverSlot = cell.slot;
        state.drag.validHover = !Battle.findHeroAt(state.heroes, cell.lane, cell.slot);
      }
    }
  });
  canvas.addEventListener('drop', (ev) => {
    ev.preventDefault();
    let shopId = state.selectedShopId;
    try {
      const raw = ev.dataTransfer.getData('text/plain');
      if (raw && raw.startsWith('shop:')) shopId = raw.slice(5);
    } catch (_) {}
    const { x, y } = canvasPos(ev);
    const cell = Battle.hitTestCell(x, y);
    if (shopId && cell) tryPlaceFromShop(shopId, cell);
    clearDrag();
    state._suppressClick = true;
  });

  function tickSpawnerFixed(dt) {
    const sp = state.spawner;
    if (!sp) return;
    sp.elapsed += dt;
    let remaining = false;
    for (const job of sp.jobs) {
      if (job.left <= 0) continue;
      remaining = true;
      if (sp.elapsed < job.delay) continue;
      job.timer += dt;
      const need = job.started ? job.interval : 0;
      if (job.timer < need) continue;
      job.timer = 0;
      job.started = true;
      let lane;
      if (job.fixedLane != null) lane = job.fixedLane;
      else if (job.laneMode === 'random') lane = (Math.random() * YD.GRID.lanes) | 0;
      else {
        lane = sp.laneCycle % YD.GRID.lanes;
        sp.laneCycle += 1;
      }
      state.enemies.push(Battle.makeEnemy(job.enemy, lane, { hpMul: job.hpMul || 1 }));
      job.left -= 1;
    }
    if (!remaining && state.enemies.length === 0) {
      sp.done = true;
    }
  }

  let last = performance.now();
  function frame(now) {
    const rawDt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const dt = rawDt * (state.speed || 1);

    if (state.phase === 'wave' && !state.paused) {
      tickSpawnerFixed(dt);
      Battle.tickHeroes(state, dt);
      Battle.tickEnemies(state, dt);
      Battle.collectDead(state);
      Battle.tickFloats(state, dt);

      if (state.coreHp <= 0) {
        state.coreHp = 0;
        lose();
      } else if (state.spawner && state.spawner.done) {
        onWaveCleared();
      } else if (state.spawner) {
        const left = state.spawner.jobs.some((j) => j.left > 0);
        if (!left && state.enemies.length === 0) {
          state.spawner.done = true;
          onWaveCleared();
        }
      }
    } else if (!state.paused) {
      Battle.tickFloats(state, dt);
    } else {
      // 暫停：特效緩慢淡出
      Battle.tickFloats(state, rawDt * 0.3);
    }

    state._bonds = activeBonds(state.heroes);
    YDRender.render(ctx, state);
    UI.updateHud(state);
    requestAnimationFrame(frame);
  }

  const unlocked = save.maxStageCleared || 0;
  UI.showOverlay(
    '銀樓防衛',
    '合併塔防 v0.3.0\n' +
      '拖放放置 → 同種合併升星 → 開波守銀樓。\n' +
      '新：羈絆、招股鼓手／逼空客、第 4 關、暫停／設定。\n' +
      '累計銀兩帳：' +
      save.totalSilver +
      '｜最高關：' +
      unlocked +
      (save.bestEndlessWave ? '｜無盡最佳：' + save.bestEndlessWave : ''),
    '開始',
    () => {
      UI.hideOverlay();
      UI.toast(state.tutorialStep < 99 ? '跟提示三步就識' : '準備就緒');
      syncAll();
    }
  );

  syncAll();
  requestAnimationFrame(frame);
})();
