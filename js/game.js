/**
 * 銀樓防衛 — 主循環 v0.2.0
 * 拖放放置／合併、多關卡＋無盡、速度檔、敵人打塔
 */
(function () {
  const { STAGES, ENDLESS, HEROES, SPEED_OPTIONS, loadSave, writeSave, buildEndlessWave } = YD;
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
        waves: [], // 動態
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
      tutorialStep: save.maxStageCleared > 0 ? 99 : 0,
    };
  }

  let state = freshState(Math.min(save.maxStageCleared, STAGES.length - 1), false);

  function syncAll() {
    if (shopApi) shopApi.refresh();
    if (speedApi) speedApi.refresh();
    if (stageApi) stageApi.refresh(state.endless ? null : state.stage.id, state.endless);
    UI.updateHud(state);
    updateHint();
  }

  function updateHint() {
    if (state.phase === 'won' || state.phase === 'lost') return;
    if (state.drag && state.drag.active) {
      UI.setHint('拖到空格放置；拖到同種同星俠客上面可合併（亦可點選操作）');
      return;
    }
    if (state.selectedShopId) {
      UI.setHint('已選「' + HEROES[state.selectedShopId].name + '」— 點空格放置，或再點底欄取消');
      return;
    }
    if (state.mergeFromUid) {
      UI.setHint('已選場上俠客 — 再點／拖到同種同星合併；點空地取消');
      return;
    }
    UI.setHint(
      '拖底欄俠客到空格放置｜拖同種同星合併升星｜開波守銀樓｜速度可調｜敵人會打最近俠客'
    );
  }

  shopApi = UI.buildShop(
    (id) => {
      if (state.phase === 'won' || state.phase === 'lost') return;
      state.selectedShopId = state.selectedShopId === id ? null : id;
      state.selectedHeroUid = null;
      state.mergeFromUid = null;
      syncAll();
      if (state.selectedShopId) UI.toast('已選 ' + HEROES[id].name + ' — 點空格或拖到場上');
    },
    () => state.selectedShopId,
    () => state.silver,
    {
      onShopDragStart(id, ev) {
        if (state.phase === 'won' || state.phase === 'lost') {
          ev.preventDefault();
          return;
        }
        if (state.silver < HEROES[id].cost) {
          ev.preventDefault();
          UI.toast('銀兩不足');
          return;
        }
        state.selectedShopId = id;
        state.mergeFromUid = null;
        state.selectedHeroUid = null;
        try {
          ev.dataTransfer.setData('text/plain', 'shop:' + id);
          ev.dataTransfer.effectAllowed = 'copy';
        } catch (_) {}
        // 原生 drag 之外，用 pointer 跟蹤畫 ghost（見 pointer 事件）
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
      if (state.phase === 'wave') {
        UI.toast('交戰中唔好換關，先重來或打完');
        return;
      }
      UI.hideOverlay();
      state = freshState(idx, false);
      resetWaveBtn();
      syncAll();
      UI.toast('進入：' + state.stage.name);
    },
    () => {
      if (state.phase === 'wave') {
        UI.toast('交戰中唔好換關，先重來或打完');
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
    UI.toast(
      (state.endless ? '無盡第 ' : '第 ') + state.waveIndex + ' 波來襲！可邊打邊合'
    );
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
          (hasNext ? '\n已解鎖下一關。' : '\n三關皆破！可挑戰無盡。'),
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

    // 無盡：更新最佳紀錄，繼續整備
    if (state.endless) {
      save.bestEndlessWave = Math.max(save.bestEndlessWave || 0, state.waveIndex);
      writeSave(save);
    }

    state.phase = 'prep';
    const bonus = 18 + state.waveIndex * 6;
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
    if (state.endless) {
      save.bestEndlessWave = Math.max(save.bestEndlessWave || 0, state.waveIndex);
      writeSave(save);
    }
    UI.showOverlay(
      '銀樓失守',
      '核心被攻破。擊殺 ' +
        state.kills +
        (state.endless ? '｜無盡撐到第 ' + state.waveIndex + ' 波（最佳 ' + (save.bestEndlessWave || 0) + '）' : '') +
        '。調整陣容再試。',
      '重來',
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

  document.getElementById('btn-wave').addEventListener('click', startWave);
  document.getElementById('btn-reset').addEventListener('click', () => {
    UI.hideOverlay();
    resetRun(state.endless);
  });

  function canvasPos(ev) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = ev.touches && ev.touches[0] ? ev.touches[0] : ev.changedTouches && ev.changedTouches[0] ? ev.changedTouches[0] : ev;
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
    const def = HEROES[shopId];
    if (state.silver < def.cost) {
      UI.toast('銀兩不足');
      return false;
    }
    state.silver -= def.cost;
    state.heroes.push(Battle.makeHero(def.id, cell.lane, cell.slot, 1));
    UI.toast('上陣：' + def.name);
    if (state.silver < def.cost) state.selectedShopId = null;
    syncAll();
    return true;
  }

  function tryMergeOrSelect(fromHero, cell) {
    if (!cell) return;
    const occupied = Battle.findHeroAt(state.heroes, cell.lane, cell.slot);
    if (occupied && Battle.canMerge(fromHero, occupied)) {
      const now = Battle.mergeHeroes(state.heroes, fromHero, occupied);
      if (now) {
        UI.toast(HEROES[now.id].name + ' 升至 ' + now.star + ' 星');
        state.fx.push({ type: 'hit', x: now.x, y: now.y, color: '#C9A227', life: 0.35, r: 22 });
      }
      state.mergeFromUid = null;
      state.selectedHeroUid = null;
      state.selectedShopId = null;
      syncAll();
      return true;
    }
    // 拖到空格：移動俠客
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

  // —— 點選（後備）——
  canvas.addEventListener('click', (ev) => {
    if (state._suppressClick) {
      state._suppressClick = false;
      return;
    }
    if (state.phase === 'won' || state.phase === 'lost') return;
    const { x, y } = canvasPos(ev);
    const cell = Battle.hitTestCell(x, y);
    if (!cell) return;

    const occupied = Battle.findHeroAt(state.heroes, cell.lane, cell.slot);

    if (state.mergeFromUid) {
      const from = state.heroes.find((h) => h.uid === state.mergeFromUid);
      if (occupied && from && Battle.canMerge(from, occupied)) {
        const now = Battle.mergeHeroes(state.heroes, from, occupied);
        if (now) {
          UI.toast(HEROES[now.id].name + ' 升至 ' + now.star + ' 星');
          state.fx.push({ type: 'hit', x: now.x, y: now.y, color: '#C9A227', life: 0.35, r: 22 });
        }
        state.mergeFromUid = null;
        state.selectedHeroUid = null;
        state.selectedShopId = null;
        syncAll();
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
      UI.toast('已選 ' + HEROES[occupied.id].name + ' — 再點同種同星合併，或拖去合併／調位');
      syncAll();
    }
  });

  // —— Pointer 拖放（場上合併／調位＋商店 ghost）——
  let ptr = null;

  function clearDrag() {
    state.drag = null;
    ptr = null;
    canvas.classList.remove('dragging');
    syncAll();
  }

  canvas.addEventListener('pointerdown', (ev) => {
    if (state.phase === 'won' || state.phase === 'lost') return;
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
    // 若已選商店，pointerdown 空格會喺 click 處理；亦可開始「假拖」提示
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
            // 無效目標：保持選取方便點選合併
            state.mergeFromUid = from.uid;
            state.selectedHeroUid = from.uid;
          }
        }
      }
    }
    // 短按唔當拖：交俾 click 處理選取
    clearDrag();
  }

  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', () => clearDrag());

  // 底欄 hero-btn：支援拖入 canvas（HTML5 DnD 後備）
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
  canvas.addEventListener('dragleave', () => {
    // 唔即清，等 drop
  });

  // —— Spawner ——
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
    } else {
      Battle.tickFloats(state, dt);
    }

    YDRender.render(ctx, state);
    UI.updateHud(state);
    requestAnimationFrame(frame);
  }

  // 開場
  const unlocked = save.maxStageCleared || 0;
  UI.showOverlay(
    '銀樓防衛',
    '金融江湖合併塔防 v0.2.0\n' +
      '拖底欄俠客到空格放置；拖同種同星合併；開波守銀樓。\n' +
      '敵人會攻擊最近俠客，唔止衝核心。\n' +
      '累計銀兩帳：' +
      save.totalSilver +
      '｜最高關：' +
      unlocked +
      (save.bestEndlessWave ? '｜無盡最佳：' + save.bestEndlessWave : ''),
    '開始',
    () => {
      UI.hideOverlay();
      UI.toast('準備就緒 — 放置後開波');
      syncAll();
    }
  );

  syncAll();
  requestAnimationFrame(frame);
})();
