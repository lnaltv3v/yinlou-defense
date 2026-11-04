/**
 * 銀樓防衛 — 主循環 v0.1.0
 */
(function () {
  const { STAGES, HEROES, loadSave, writeSave } = YD;
  const Battle = YDBattle;
  const UI = YDUI;

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  let save = loadSave();
  let shopApi = null;

  function freshState(stageIndex) {
    const stage = STAGES[Math.min(stageIndex, STAGES.length - 1)];
    return {
      stage,
      stageIndex,
      phase: 'prep', // prep | wave | won | lost
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
    };
  }

  let state = freshState(0);

  function syncShop() {
    if (shopApi) shopApi.refresh();
    UI.updateHud(state);
  }

  shopApi = UI.buildShop(
    (id) => {
      if (state.phase === 'won' || state.phase === 'lost') return;
      state.selectedShopId = state.selectedShopId === id ? null : id;
      state.selectedHeroUid = null;
      state.mergeFromUid = null;
      syncShop();
      UI.toast('已選 ' + HEROES[id].name + ' — 點空格放置');
    },
    () => state.selectedShopId,
    () => state.silver
  );

  function startWave() {
    if (state.phase !== 'prep') return;
    if (state.waveIndex >= state.stage.waves.length) return;
    state.waveIndex += 1;
    const waveDef = state.stage.waves[state.waveIndex - 1];
    state.spawner = Battle.createSpawner(waveDef);
    // 修正 spawner：每 job 獨立計時
    for (const job of state.spawner.jobs) {
      job.timer = job.interval;
      job.started = false;
      job.waited = false;
    }
    state.phase = 'wave';
    // 交戰中仍可召喚／合併（對齊 Merge TD）
    UI.toast('第 ' + state.waveIndex + ' 波來襲！可邊打邊合');
    syncShop();
    const btn = document.getElementById('btn-wave');
    if (btn) btn.disabled = true;
  }

  function onWaveCleared() {
    state.spawner = null;
    if (state.waveIndex >= state.stage.waves.length) {
      state.phase = 'won';
      save.totalSilver += Math.floor(state.silver);
      save.maxStageCleared = Math.max(save.maxStageCleared, state.stage.id);
      writeSave(save);
      UI.showOverlay(
        '銀樓倖存',
        '打退 ' + state.waveIndex + ' 波！擊殺 ' + state.kills + '。累計銀兩帳 ' + save.totalSilver + '。',
        '再來一局',
        () => {
          UI.hideOverlay();
          resetRun();
        }
      );
      return;
    }
    state.phase = 'prep';
    state.silver += 18 + state.waveIndex * 6;
    UI.toast('波次結束，整備中（補銀 +' + (18 + state.waveIndex * 6) + '）');
    const btn = document.getElementById('btn-wave');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '下一波';
    }
    syncShop();
  }

  function lose() {
    state.phase = 'lost';
    UI.showOverlay(
      '銀樓失守',
      '核心被攻破。擊殺 ' + state.kills + '。調整陣容再試。',
      '重來',
      () => {
        UI.hideOverlay();
        resetRun();
      }
    );
  }

  function resetRun() {
    state = freshState(0);
    const btn = document.getElementById('btn-wave');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '開波';
    }
    syncShop();
    UI.toast('新一局 — 放置俠客後開波');
  }

  document.getElementById('btn-wave').addEventListener('click', startWave);
  document.getElementById('btn-reset').addEventListener('click', () => {
    UI.hideOverlay();
    resetRun();
  });

  function canvasPos(ev) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (ev.clientX - rect.left) * scaleX,
      y: (ev.clientY - rect.top) * scaleY,
    };
  }

  canvas.addEventListener('click', (ev) => {
    if (state.phase === 'won' || state.phase === 'lost') return;
    const { x, y } = canvasPos(ev);
    const cell = Battle.hitTestCell(x, y);
    if (!cell) return;

    const occupied = Battle.findHeroAt(state.heroes, cell.lane, cell.slot);

    // 合併流程：已選場上俠客
    if (state.mergeFromUid) {
      const from = state.heroes.find((h) => h.uid === state.mergeFromUid);
      if (occupied && from && Battle.canMerge(from, occupied)) {
        const now = Battle.mergeHeroes(state.heroes, from, occupied);
        if (now) UI.toast(HEROES[now.id].name + ' 升至 ' + now.star + ' 星');
        state.mergeFromUid = null;
        state.selectedHeroUid = null;
        state.selectedShopId = null;
        syncShop();
        return;
      }
      // 點空地取消
      if (!occupied) {
        state.mergeFromUid = null;
        state.selectedHeroUid = null;
        return;
      }
      // 點其他單位改選
      state.mergeFromUid = occupied.uid;
      state.selectedHeroUid = occupied.uid;
      UI.toast('再點同種同星合併（而家 ' + occupied.star + ' 星）');
      return;
    }

    // 商店放置
    if (state.selectedShopId) {
      if (occupied) {
        UI.toast('此格已有人');
        return;
      }
      const def = HEROES[state.selectedShopId];
      if (state.silver < def.cost) {
        UI.toast('銀兩不足');
        return;
      }
      state.silver -= def.cost;
      state.heroes.push(Battle.makeHero(def.id, cell.lane, cell.slot, 1));
      UI.toast('上陣：' + def.name);
      // 連續放置：若銀兩唔夠就清選擇
      if (state.silver < def.cost) state.selectedShopId = null;
      syncShop();
      return;
    }

    // 選場上俠客準備合併
    if (occupied) {
      state.selectedHeroUid = occupied.uid;
      state.mergeFromUid = occupied.uid;
      UI.toast('已選 ' + HEROES[occupied.id].name + ' — 再點同種同星合併');
    }
  });

  // —— Spawner tick（清晰版）——
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
      state.enemies.push(Battle.makeEnemy(job.enemy, lane));
      job.left -= 1;
    }
    if (!remaining && state.enemies.length === 0) {
      sp.done = true;
    }
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

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
        // 檢查是否生成完畢且場清
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
  UI.showOverlay(
    '銀樓防衛',
    '金融江湖合併塔防 v0.1.0\n底欄選俠客 → 點格放置；點兩名同種同星合併；開波守銀樓。',
    '開始',
    () => {
      UI.hideOverlay();
      UI.toast('累計銀兩帳：' + save.totalSilver + '｜最高過關：' + save.maxStageCleared);
      syncShop();
    }
  );

  syncShop();
  requestAnimationFrame(frame);
})();
