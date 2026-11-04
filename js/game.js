/**
 * 銀樓防衛 — 主循環 v1.8.0
 * v1.8.0：第7關／鎖倉居士／週連續＋本地最佳牆／手感平衡
 */
(function () {
  const {
    STAGES,
    ENDLESS,
    HEROES,
    SPEED_OPTIONS,
    LINEUPS,
    MAX_STAR,
    UPGRADE_PATHS,
    upgradeCost,
    upgradeLabel,
    loadSave,
    writeSave,
    defaultSave,
    exportSaveJson,
    importSaveJson,
    pickFailTip,
    firstRunBonus,
    buildEndlessWave,
    buildDailyWaves,
    buildWeeklyWaves,
    dailyStageMeta,
    weeklyStageMeta,
    hkWeekKey,
    hkDateString,
    recordWeekDailyClear,
    weekDailyCount,
    formatWeekProgress,
    formatLocalBestWall,
    recordWeeklyStreak,
    hkNextMondayHint,
    waveClearBonus,
    endlessMilestone,
    summonCost,
    mergeRebate,
    activeBonds,
    markSeenHero,
    markSeenEnemy,
    refreshAchievements,
    stageFirstClearBonus,
    saveStats,
    endlessModifiers,
    buildModContext,
    modifierLabel,
    pickStuckTip,
    recommendForStage,
    formatRunModifiers,
    ENDLESS_MILESTONES,
    pickWaveEvent,
  } = YD;
  const AudioSfx = window.YDAudio;
  const Battle = YDBattle;
  const UI = YDUI;

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  let save = loadSave();
  // migrate soft fields
  if (!save.seenHeroes) save.seenHeroes = {};
  if (!save.seenEnemies) save.seenEnemies = {};
  if (!save.ach) save.ach = {};
  if (!save.unlockedAch) save.unlockedAch = {};
  if (save.totalKills == null) save.totalKills = 0;
  if (save.showSkillCd == null) save.showSkillCd = true;
  if (save.reduceShake == null) save.reduceShake = false;
  if (save.firstBootDone == null) save.firstBootDone = false;
  if (save.sfxEnabled == null) save.sfxEnabled = true;
  if (save.reduceFlash == null) save.reduceFlash = false;
  if (save.stuckTips == null) save.stuckTips = true;
  if (save.tutorialDone == null) save.tutorialDone = !!(save.maxStageCleared > 0 || save.skipTutorial);
  if (!save.firstClears) save.firstClears = {};
  if (save.version < 11) {
    save.version = 11;
    if (save.weeklyKey == null) save.weeklyKey = '';
    if (save.weeklyCleared == null) save.weeklyCleared = false;
    writeSave(save);
  }
  if (save.version < 12) {
    save.version = 12;
    if (!save.weekDailyMap) save.weekDailyMap = {};
    writeSave(save);
  }
  if (save.version < 13) {
    save.version = 13;
    writeSave(save);
  }
  if (save.version < 14) {
    save.version = 14;
    writeSave(save);
  }
  if (save.version < 15) {
    save.version = 15;
    writeSave(save);
  }
  if (save.version < 16) {
    save.version = 16;
    if (save.weekStreak == null) save.weekStreak = 0;
    if (save.weekStreakBest == null) save.weekStreakBest = 0;
    if (!save.lastWeeklyClearKey) save.lastWeeklyClearKey = '';
    if (!Array.isArray(save.weekClearHistory)) save.weekClearHistory = [];
    if (!save.localBest || typeof save.localBest !== 'object') {
      save.localBest = {
        endless: save.bestEndlessWave || 0,
        weeklyStreak: save.weekStreakBest || 0,
        stageClears: save.maxStageCleared || 0,
      };
    }
    writeSave(save);
  }
  if (save.version < 17) {
    save.version = 17;
    writeSave(save);
  }
  if (save.version < 18) {
    save.version = 18;
    writeSave(save);
  }
  if (!save.weekDailyMap) save.weekDailyMap = {};
  if (save.weekStreak == null) save.weekStreak = 0;
  if (save.weekStreakBest == null) save.weekStreakBest = 0;
  if (!save.localBest || typeof save.localBest !== 'object') {
    save.localBest = { endless: 0, weeklyStreak: 0, stageClears: 0 };
  }
  // 若今日已清每日但未入週圖，補一筆（唔重複加獎）
  try {
    if (save.dailyCleared && save.dailyDate === hkDateString()) {
      recordWeekDailyClear(save, save.dailyDate, hkWeekKey());
      writeSave(save);
    }
  } catch (_) {}
  // 週鍵滾動：唔再本週則清 cleared 旗（保留 key 直至新清）
  try {
    const wkNow = hkWeekKey();
    if (save.weeklyKey && save.weeklyKey !== wkNow && save.weeklyCleared) {
      save.weeklyCleared = false;
      writeSave(save);
    }
    const dayNow = hkDateString();
    if (save.dailyDate && save.dailyDate !== dayNow && save.dailyCleared) {
      save.dailyCleared = false;
      writeSave(save);
    }
  } catch (_) {}
  if (AudioSfx) AudioSfx.setEnabled(save.sfxEnabled !== false);

  // v1.4：跟資料表再預載一次（含後補 id）；缺檔會自動重試
  try {
    if (window.YDSprites && window.YDSprites.preloadAll) {
      window.YDSprites.preloadAll().catch(function () {});
    }
  } catch (_) {}

  let shopApi = null;
  let speedApi = null;
  let stageApi = null;
  let upgradeApi = null;

  function notifyAchievements() {
    const newly = refreshAchievements(save);
    if (newly && newly.length) {
      writeSave(save);
      for (const a of newly) UI.toast('成就：' + a.name, 2200);
    }
  }

  function freshState(stageIndex, endless, daily, weekly) {
    let stage;
    let mods = [];
    if (weekly) {
      const meta = weeklyStageMeta();
      mods = meta.modifiers || [];
      stage = {
        id: 'weekly',
        name: meta.name,
        story: meta.story,
        startSilver: meta.startSilver,
        coreHp: meta.coreHp,
        unlockHeroes: meta.unlockHeroes,
        waves: buildWeeklyWaves(meta),
        weeklyMeta: meta,
      };
    } else if (daily) {
      const meta = dailyStageMeta();
      mods = meta.modifiers || [];
      stage = {
        id: 'daily',
        name: meta.name,
        story: meta.story,
        startSilver: meta.startSilver,
        coreHp: meta.coreHp,
        unlockHeroes: meta.unlockHeroes,
        waves: buildDailyWaves(meta),
        dailyMeta: meta,
      };
    } else if (endless) {
      mods = endlessModifiers((save.bestEndlessWave || 0) + (save.totalKills || 0));
      const modStory =
        ENDLESS.story +
        (mods.length ? '\n今日修飾：' + modifierLabel(mods) + '。' : '');
      stage = {
        id: ENDLESS.id,
        name: ENDLESS.name,
        story: modStory,
        startSilver: ENDLESS.startSilver,
        coreHp: ENDLESS.coreHp,
        unlockHeroes: ENDLESS.unlockHeroes,
        waves: [],
      };
    } else {
      stage = STAGES[Math.min(Math.max(0, stageIndex), STAGES.length - 1)];
      stageIndex = STAGES.indexOf(stage);
    }
    const modCtx = buildModContext(mods);
    const silver = Math.round(stage.startSilver * (modCtx.silverMul || 1));
    const coreHp = Math.round(stage.coreHp * (modCtx.coreMul || 1));
    return {
      stage,
      stageIndex: endless || daily || weekly ? -1 : stageIndex,
      endless: !!endless && !daily && !weekly,
      daily: !!daily && !weekly,
      weekly: !!weekly,
      phase: 'prep',
      silver,
      coreHp,
      coreMax: coreHp,
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
      tutorialStep: save.skipTutorial || save.tutorialDone || save.maxStageCleared > 0 ? 99 : 0,
      summonCounts: {},
      showCellHints: save.showCellHints !== false,
      showSkillCd: save.showSkillCd !== false,
      reduceShake: !!save.reduceShake,
      reduceFlash: !!save.reduceFlash,
      stuckTips: save.stuckTips !== false,
      milestoneBanner: null,
      _bonds: [],
      _bondIds: [],
      bossBanner: null,
      bondBanner: null,
      _eliteKills: 0,
      _rumorKills: 0,
      _darkKills: 0,
      lockProcs: 0,
      lockKills: 0,
      _circuitKills: 0,
      _circuitProcs: 0,
      _killStreak: 0,
      _killStreakT: 0,
      _eliteAnnounced: false,
      eventBanner: null,
      _milestonesClaimed: {},
      _touchPad: 0,
      modifiers: mods,
      modCtx,
      prepIdle: 0,
      _stuckTipAt: 0,
      _lastActionAt: 0,
    };
  }

  function currentSummonCost(heroId) {
    const base = summonCost(heroId, state.summonCounts);
    const mul = (state.modCtx && state.modCtx.summonCostMul) || 1;
    return Math.max(1, Math.round(base * mul));
  }

  function currentMergeRebate(heroId, newStar) {
    const base = mergeRebate(heroId, newStar);
    const mul = (state.modCtx && state.modCtx.mergeRebateMul) || 1;
    return Math.max(0, Math.round(base * mul));
  }

  function noteAction() {
    state._lastActionAt = performance.now();
    state.prepIdle = 0;
  }

  let state = freshState(Math.min(save.maxStageCleared, STAGES.length - 1), false, false, false);

  function syncAll() {
    const bonds = activeBonds(state.heroes);
    const ids = bonds.map((b) => b.id);
    const prev = state._bondIds || [];
    for (const b of bonds) {
      if (!prev.includes(b.id)) {
        Battle.announceBond(state, b);
        UI.toast('羈絆：' + b.name + ' — ' + b.blurb, 2200);
      }
    }
    state._bonds = bonds;
    state._bondIds = ids;
    if (state._bonds.length && !save.ach.bond) {
      save.ach.bond = true;
      writeSave(save);
      notifyAchievements();
    }
    if (state._bonds.length >= 3 && !save.ach.bonds3) {
      save.ach.bonds3 = true;
      writeSave(save);
      notifyAchievements();
    }
    if (
      !save.ach.lock_bond &&
      state._bonds.some((b) => b.id === 'lock_vault' || b.id === 'lock_div')
    ) {
      save.ach.lock_bond = true;
      writeSave(save);
      notifyAchievements();
    }
    if ((state.lockProcs || 0) >= 30 && !save.ach.lock_procs30) {
      save.ach.lock_procs30 = true;
      writeSave(save);
      notifyAchievements();
    }
    if (
      state.endless &&
      state.modifiers &&
      state.modifiers.length >= 3 &&
      !save.ach.endless_triple
    ) {
      save.ach.endless_triple = true;
      writeSave(save);
      notifyAchievements();
    }
    if ((state._circuitKills || 0) >= 1 && !save.ach.circuit_kill) {
      save.ach.circuit_kill = true;
      writeSave(save);
      notifyAchievements();
    }
    if (shopApi) shopApi.refresh();
    if (speedApi) speedApi.refresh();
    if (UI.refreshWeekProgress) UI.refreshWeekProgress(save);
    if (stageApi) {
      stageApi.refresh(
        state.endless || state.daily || state.weekly ? null : state.stage.id,
        state.endless,
        state.daily,
        state.weekly
      );
    }
    if (upgradeApi) upgradeApi.refresh();
    UI.updateHud(state);
    updateHint();
  }

  function advanceTutorial(to) {
    if (state.tutorialStep >= 99) return;
    if (to != null) state.tutorialStep = Math.max(state.tutorialStep, to);
    else state.tutorialStep += 1;
    if (state.tutorialStep >= 3) {
      state.tutorialStep = 99;
      if (!save.tutorialDone) {
        save.tutorialDone = true;
        writeSave(save);
      }
    }
  }

  function updateHint() {
    if (state.phase === 'won' || state.phase === 'lost') return;
    if (state.paused) {
      UI.setHint('已暫停 — 再按「暫停」或 Esc 繼續｜圖鑑／設定可查技能');
      return;
    }
    if (state.tutorialStep === 0) {
      UI.setHint('① 拖底欄俠客到綠色空格放置（同種愈召愈貴）');
      return;
    }
    if (state.tutorialStep === 1) {
      UI.setHint('② 拖兩名同種同星疊埋 → 合併升星（最高 ' + MAX_STAR + ' 星，有銀兩回報）');
      return;
    }
    if (state.tutorialStep === 2) {
      UI.setHint('③ 按「開波」守銀樓；齊人觸發羈絆；每人有簡版技能');
      return;
    }
    if (state.drag && state.drag.active) {
      UI.setHint('拖到空格放置／調位；拖到同種同星可合併');
      return;
    }
    if (state.selectedShopId) {
      const cost = currentSummonCost(state.selectedShopId);
      const def = HEROES[state.selectedShopId];
      UI.setHint(
        '已選「' + def.name + '」（' + cost + ' 兩）' + (def.skill ? '｜' + def.skill.name : '')
      );
      return;
    }
    if (state.mergeFromUid) {
      const h = state.heroes.find((x) => x.uid === state.mergeFromUid);
      const ul = h ? upgradeLabel(h) : '';
      UI.setHint(
        '已選場上俠客' +
          (ul ? '（' + ul + '）' : '') +
          ' — 下方強化｜拖同種同星合併｜拖空格調位'
      );
      return;
    }
    const bondTxt =
      state._bonds && state._bonds.length
        ? '｜羈絆：' + state._bonds.map((b) => b.name).join('、')
        : '';
    UI.setHint('拖放放置／合併｜開波｜圖鑑／每日' + bondTxt);
  }

  shopApi = UI.buildShop(
    (id) => {
      if (state.phase === 'won' || state.phase === 'lost') return;
      if (state._suppressShopClick) return;
      state.selectedShopId = state.selectedShopId === id ? null : id;
      state.selectedHeroUid = null;
      state.mergeFromUid = null;
      syncAll();
      if (state.selectedShopId) {
        const def = HEROES[id];
        UI.toast(
          '已選 ' + def.name + (def.skill ? '（' + def.skill.name + '）' : '') + ' — 放到空格'
        );
        if (state.tutorialStep === 0) advanceTutorial(0);
      }
    },
    () => state.selectedShopId,
    () => state.silver,
    {
      getSummonCounts: () => state.summonCounts,
      getCost: (id) => currentSummonCost(id),
      onShopDragStart(id, ev) {
        if (state.phase === 'won' || state.phase === 'lost') {
          ev.preventDefault();
          return;
        }
        const cost = currentSummonCost(id);
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
      onShopPointerDown(id, ev, btn) {
        if (state.phase === 'won' || state.phase === 'lost' || state.paused) return;
        // 滑鼠交俾 HTML5 DnD；觸控／筆用全域 pointer 拖
        if (ev.pointerType === 'mouse') return;
        const cost = currentSummonCost(id);
        if (state.silver < cost) {
          UI.toast('銀兩不足（而家要 ' + cost + '）');
          return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        state.selectedShopId = id;
        state.mergeFromUid = null;
        state.selectedHeroUid = null;
        const { x, y } = canvasPos(ev);
        ptr = {
          kind: 'shop',
          shopId: id,
          startX: x,
          startY: y,
          moved: false,
          pointerId: ev.pointerId,
          isTouch: true,
          fromShopBtn: true,
        };
        try {
          btn.setPointerCapture(ev.pointerId);
        } catch (_) {}
        state.drag = {
          active: false,
          kind: 'shop',
          shopId: id,
          x,
          y,
          hoverLane: null,
          hoverSlot: null,
          validHover: false,
        };
        syncAll();
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
      if (AudioSfx) AudioSfx.play('click');
    }
  );

  function selectedHero() {
    if (!state.mergeFromUid) return null;
    return state.heroes.find((h) => h.uid === state.mergeFromUid) || null;
  }

  function tryUpgrade(pathId) {
    const hero = selectedHero();
    if (!hero) {
      UI.toast('先點場上俠客再強化');
      return;
    }
    if (state.phase === 'won' || state.phase === 'lost') return;
    const path = UPGRADE_PATHS[pathId];
    if (!path) return;
    const key = pathId === 'atk' ? 'upAtk' : pathId === 'def' ? 'upDef' : 'upHaste';
    const lv = hero[key] || 0;
    if (lv >= path.maxLv) {
      UI.toast(path.name + '已滿級');
      return;
    }
    const cost = upgradeCost(pathId, lv);
    if (state.silver < cost) {
      UI.toast('銀兩不足（要 ' + cost + '）');
      return;
    }
    const res = Battle.upgradeHero(hero, pathId);
    if (!res.ok) {
      UI.toast(res.reason || '無法強化');
      return;
    }
    state.silver -= res.cost;
    if (Battle.spawnUpgradeFx) Battle.spawnUpgradeFx(state, hero, path.name, res.level);
    else {
      Battle.pushFloat(state.floats, {
        x: hero.x,
        y: hero.y - 42,
        text: path.name + ' +' + res.level,
        color: '#C9A227',
        size: 15,
        vy: -28,
        life: 1.0,
      });
      state.fx.push({ type: 'hit', x: hero.x, y: hero.y, color: '#C9A227', life: 0.4, r: 24 });
    }
    if (!save.ach.upgrade) {
      save.ach.upgrade = true;
      writeSave(save);
      notifyAchievements();
    }
    if (AudioSfx) AudioSfx.play('upgrade');
    noteAction();
    UI.toast(
      '強化｜' + HEROES[hero.id].name + '・' + path.name + ' → Lv' + res.level + '（−' + res.cost + '兩）',
      1800
    );
    syncAll();
  }

  upgradeApi = UI.buildUpgradeBar(selectedHero, () => state.silver, tryUpgrade);

  function showStageStory(thenToast) {
    const st = state.stage;
    const story = st && st.story;
    if (!story || save.skipTutorial) {
      if (thenToast) UI.toast(thenToast);
      return;
    }
    const title = state.endless
      ? '無盡殺跌'
      : state.weekly
        ? st.name || '週挑戰'
        : state.daily
          ? st.name || '每日'
          : '第 ' + st.id + ' 關・' + st.name;
    UI.showStory(title, story, () => {
      if (thenToast) UI.toast(thenToast);
      syncAll();
    });
  }

  function stageRecommendToast() {
    if (!recommendForStage) return;
    const rec = recommendForStage(state.stage, state.endless, state.daily, state.weekly);
    if (!rec || !rec.lineup) return;
    state._stageRec = rec;
    UI.toast('本關推薦｜' + rec.lineup.name + ' — ' + rec.reason, 2800);
  }

  function enterStage(idx, endless, daily, weekly) {
    if (state.phase === 'wave' && !state.paused) {
      UI.toast('交戰中請先暫停或打完再換關');
      return false;
    }
    UI.hideOverlay();
    state = freshState(idx, endless, daily, weekly);
    resetWaveBtn();
    syncAll();
    showStageStory(null);
    setTimeout(stageRecommendToast, 400);
    return true;
  }

  stageApi = UI.buildStageBar(
    () => save,
    (idx) => {
      if (enterStage(idx, false, false, false)) UI.toast('進入：' + state.stage.name);
    },
    () => {
      if (save.maxStageCleared < 1) {
        UI.toast('先通關第 1 關解鎖無盡');
        return;
      }
      if (enterStage(0, true, false, false)) {
        const lab = modifierLabel(state.modifiers || []);
        UI.toast('無盡殺跌' + (lab ? '｜' + lab : ' — 愈打愈密'), 2200);
      }
    },
    () => {
      if (save.maxStageCleared < 1) {
        UI.toast('先通關第 1 關解鎖每日');
        return;
      }
      if (enterStage(0, false, true, false)) {
        const meta = state.stage.dailyMeta;
        UI.toast('每日：' + meta.name + '（' + meta.blurb + '）', 2200);
      }
    },
    () => {
      if (save.maxStageCleared < 2) {
        UI.toast('先通關第 2 關解鎖週挑戰');
        return;
      }
      if (enterStage(0, false, false, true)) {
        const meta = state.stage.weeklyMeta;
        UI.toast('週挑戰：' + meta.name + '（' + meta.blurb + '）', 2400);
      }
    }
  );


  function runModBlock() {
    const lab = formatRunModifiers
      ? formatRunModifiers(state.modifiers)
      : modifierLabel(state.modifiers || []);
    return lab ? '\n本局修飾：\n' + lab : '';
  }

  function settleExtraBlock() {
    const bits = [];
    if (state.lockProcs) bits.push('鎖倉印 ×' + state.lockProcs);
    if (state.lockKills) bits.push('鎖倉擊殺 ' + state.lockKills);
    if (state._circuitKills) bits.push('熔斷天鵝擊破 ×' + state._circuitKills);
    if (state._bonds && state._bonds.length) {
      bits.push('羈絆：' + state._bonds.map((b) => b.name).join('、'));
    }
    if (state.weekly && typeof formatLocalBestWall === 'function') {
      bits.push(formatLocalBestWall(save).short);
    }
    return bits.length ? '\n' + bits.join('｜') : '';
  }

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
    state._eliteAnnounced = false;
    // 簡單精英波事件：關卡第 3 波／無盡每 4 波，若波內未標 elite 則加一隻
    const needEliteEvent =
      (!state.endless && !state.daily && !state.weekly && state.waveIndex === 3 && state.stageIndex >= 0) ||
      (state.endless && state.waveIndex > 0 && state.waveIndex % 4 === 0) ||
      (state.daily && state.waveIndex === Math.max(2, (state.stage.waves.length / 2) | 0)) ||
      (state.weekly && state.waveIndex === Math.max(3, (state.stage.waves.length / 2) | 0));
    if (needEliteEvent && state.spawner.jobs.every((j) => !j.elite)) {
      state.spawner.jobs.push({
        enemy: state.endless || state.stageIndex >= 2 ? 'leverage_fiend' : 'chase_zombie',
        left: 1,
        interval: 0,
        delay: 2.2,
        timer: 0,
        started: false,
        laneMode: 'random',
        fixedLane: null,
        hpMul: 1.1,
        elite: true,
      });
    }
    for (const job of state.spawner.jobs) {
      job.timer = job.interval;
      job.started = false;
    }
    state.phase = 'wave';
    noteAction();
    advanceTutorial(3);
    if (AudioSfx) AudioSfx.play('wave');
    UI.toast(
      (state.endless ? '無盡第 ' : state.weekly ? '週挑戰第 ' : state.daily ? '每日第 ' : '第 ') +
        state.waveIndex +
        ' 波來襲！'
    );
    // 市況事件：第 2 波起機率觸發（教學波略過）
    if (state.waveIndex >= 2 && typeof pickWaveEvent === 'function') {
      const ev = pickWaveEvent();
      if (ev) {
        try {
          ev.apply(state, Battle);
        } catch (_) {}
        state.eventBanner = {
          name: ev.name,
          blurb: ev.blurb,
          color: ev.color || '#3A7A6A',
          life: 2.5,
          maxLife: 2.5,
        };
        UI.toast('市況｜' + ev.name + ' — ' + ev.blurb, 2400);
        if (!save.ach.market_event) {
          save.ach.market_event = true;
          writeSave(save);
          notifyAchievements();
        }
      }
    }
    syncAll();
    const btn = document.getElementById('btn-wave');
    if (btn) btn.disabled = true;
  }

  function onWaveCleared() {
    state.spawner = null;
    if (!state.endless && state.waveIndex >= state.stage.waves.length) {
      state.phase = 'won';
      if (AudioSfx) AudioSfx.play('win');
      save.totalSilver += Math.floor(state.silver);
      save.totalKills = (save.totalKills || 0) + state.kills;

      if (state.weekly) {
        const wk = hkWeekKey();
        let weeklyBonus = 0;
        if (save.weeklyKey !== wk || !save.weeklyCleared) {
          weeklyBonus = 160;
          save.weeklyKey = wk;
          save.weeklyCleared = true;
          save.ach.weekly = true;
          save.totalSilver += weeklyBonus;
          if (typeof recordWeeklyStreak === 'function') recordWeeklyStreak(save, wk);
        }
        if (save.localBest) {
          save.localBest.endless = Math.max(save.localBest.endless || 0, save.bestEndlessWave || 0);
          save.localBest.weeklyStreak = Math.max(save.localBest.weeklyStreak || 0, save.weekStreakBest || 0);
          save.localBest.stageClears = Math.max(save.localBest.stageClears || 0, save.maxStageCleared || 0);
        }
        writeSave(save);
        notifyAchievements();
        const wp = formatWeekProgress(save);
        const meta = (state.stage && state.stage.weeklyMeta) || {};
        UI.showOverlay(
          '週挑戰結算',
          '【' +
            (meta.name || '週挑戰') +
            '】\n打退 ' +
            state.waveIndex +
            ' 波｜擊殺 ' +
            state.kills +
            '。\n' +
            (weeklyBonus ? '本週首清獎金 +' + weeklyBonus + ' 兩入帳。' : '本週已領過週挑戰首清獎（重打無額外獎）。') +
            '\n連續週 ' +
            (save.weekStreak || 0) +
            '（最佳 ' +
            (save.weekStreakBest || 0) +
            '）' +
            '\n' +
            wp.label +
            (typeof formatLocalBestWall === 'function' ? '\n' + formatLocalBestWall(save).label : '') +
            '\n重置：' +
            wp.resetHint +
            runModBlock() + settleExtraBlock() +
            '\n累計銀兩帳 ' +
            save.totalSilver +
            '。',
          '再打週挑戰',
          () => {
            UI.hideOverlay();
            resetRun(false, false, true);
          },
          [
            {
              label: '回第 1 關',
              secondary: true,
              onClick: () => {
                UI.hideOverlay();
                state = freshState(0, false, false, false);
                resetWaveBtn();
                syncAll();
              },
            },
          ]
        );
        syncAll();
        return;
      }

      if (state.daily) {
        const today = hkDateString();
        const wk = hkWeekKey();
        let dailyBonus = 0;
        if (save.dailyDate !== today || !save.dailyCleared) {
          dailyBonus = 80;
          save.dailyDate = today;
          save.dailyCleared = true;
          save.ach.daily = true;
          save.totalSilver += dailyBonus;
          recordWeekDailyClear(save, today, wk);
        }
        writeSave(save);
        notifyAchievements();
        const wp = formatWeekProgress(save);
        const meta = (state.stage && state.stage.dailyMeta) || {};
        UI.showOverlay(
          '每日結算',
          '【' +
            (meta.name || '每日') +
            '】\n打退 ' +
            state.waveIndex +
            ' 波｜擊殺 ' +
            state.kills +
            '。\n' +
            (dailyBonus ? '今日首清獎金 +' + dailyBonus + ' 兩入帳。' : '今日已領過每日首清獎（重打無額外獎）。') +
            '\n' +
            wp.label +
            '\n週挑戰：' +
            (wp.weeklyDone ? '本週已清' : '尚未清（通關第 2 關後可打）') +
            '\n週重置：' +
            wp.resetHint +
            runModBlock() + settleExtraBlock() +
            '\n累計銀兩帳 ' +
            save.totalSilver +
            '。',
          '再打每日',
          () => {
            UI.hideOverlay();
            resetRun(false, true, false);
          },
          [
            {
              label: '回第 1 關',
              secondary: true,
              onClick: () => {
                UI.hideOverlay();
                state = freshState(0, false, false, false);
                resetWaveBtn();
                syncAll();
              },
            },
          ]
        );
        syncAll();
        return;
      }

      const stageId = state.stage.id;
      const wasNew = (save.maxStageCleared || 0) < stageId;
      save.maxStageCleared = Math.max(save.maxStageCleared || 0, stageId);
      if (!save.firstClears) save.firstClears = {};
      let rewardLines = [];
      let clearBonus = 0;
      const key = String(stageId);
      if (!save.firstClears[key]) {
        save.firstClears[key] = true;
        clearBonus = (typeof stageFirstClearBonus === 'function' ? stageFirstClearBonus(stageId) : 0) ||
          (state.stage.firstClearBonus || 0);
        if (clearBonus > 0) {
          save.totalSilver += clearBonus;
          rewardLines.push('首通獎勵 +' + clearBonus + ' 兩入帳');
        }
      }
      let finaleBonus = 0;
      if ((save.maxStageCleared || 0) >= STAGES.length && !save.firstClears.all) {
        save.firstClears.all = true;
        finaleBonus = (YD.STAGE_FIRST_CLEAR && YD.STAGE_FIRST_CLEAR.all) || 250;
        save.totalSilver += finaleBonus;
        rewardLines.push('七關皆破！終局獎勵 +' + finaleBonus + ' 兩');
      }
      if (save.localBest) {
        save.localBest.stageClears = Math.max(save.localBest.stageClears || 0, save.maxStageCleared || 0);
        save.localBest.endless = Math.max(save.localBest.endless || 0, save.bestEndlessWave || 0);
      }
      writeSave(save);
      notifyAchievements();
      const nextIdx = state.stageIndex + 1;
      const hasNext = nextIdx < STAGES.length;
      const extras = [];
      if (hasNext) {
        extras.push({
          label: '下一關：' + STAGES[nextIdx].name,
          onClick: () => {
            UI.hideOverlay();
            state = freshState(nextIdx, false, false, false);
            resetWaveBtn();
            syncAll();
          },
        });
      } else {
        extras.push({
          label: '挑戰無盡',
          onClick: () => {
            UI.hideOverlay();
            state = freshState(0, true, false, false);
            resetWaveBtn();
            syncAll();
          },
        });
      }
      extras.push({
        label: '再打本關',
        onClick: () => {
          UI.hideOverlay();
          resetRun(false, false, false);
        },
      });
      const title =
        stageId >= 9
          ? hasNext
            ? '開年軋空'
            : '九關皆破'
          : stageId >= 8
            ? hasNext
              ? '銀樓守歲'
              : '九關皆破'
            : stageId >= 7
              ? hasNext
                ? '斷索開市'
                : '九關皆破'
              : stageId >= 6
                ? '暗盤破曉'
                : hasNext
                  ? '銀樓倖存'
                  : '九關皆破';
      const rewardBlock = rewardLines.length ? '\n' + rewardLines.join('\n') + '。' : '';
      UI.showOverlay(
        title,
        '打退 ' +
          state.waveIndex +
          ' 波！擊殺 ' +
          state.kills +
          '。累計銀兩帳 ' +
          save.totalSilver +
          '。' +
          rewardBlock +
          runModBlock() + settleExtraBlock() +
          (hasNext
            ? '\n已解鎖下一關' + (wasNew ? '「' + STAGES[nextIdx].name + '」' : '') + '。'
            : '\n主線全破！可挑戰無盡／每日／週挑戰，或重溫軋空／守歲。'),
        hasNext ? '下一關' : '回第 1 關',
        () => {
          UI.hideOverlay();
          if (hasNext) state = freshState(nextIdx, false, false, false);
          else state = freshState(0, false, false, false);
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
      if (save.localBest) {
        save.localBest.endless = Math.max(save.localBest.endless || 0, save.bestEndlessWave || 0);
      }
      writeSave(save);
      notifyAchievements();
      const ms = endlessMilestone(state.waveIndex);
      if (ms && !state._milestonesClaimed[ms.wave]) {
        state._milestonesClaimed[ms.wave] = true;
        state.silver += ms.silver;
        UI.toast('★ 里程碑「' + ms.label + '」！＋' + ms.silver + ' 兩', 3000);
        state.milestoneBanner = {
          name: ms.label,
          silver: ms.silver,
          wave: ms.wave,
          life: 2.8,
          maxLife: 2.8,
        };
        Battle.pushFloat(state.floats, {
          x: YD.CORE.x + 40,
          y: YD.CORE.y - 40,
          text: '★里程碑 +' + ms.silver,
          color: '#C9A227',
          size: 18,
          vy: -32,
          life: 1.4,
        });
        state.fx.push({
          type: 'bond',
          x: 480,
          y: 160,
          text: '里程碑 · ' + ms.label,
          life: 1.6,
        });
        if (AudioSfx) AudioSfx.play('win');
      }
    }

    state.phase = 'prep';
    let bonus = waveClearBonus(state.waveIndex, state.endless);
    if (state.modCtx && state.modCtx.waveBonusMul) {
      bonus = Math.round(bonus * state.modCtx.waveBonusMul);
    }
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
    if (AudioSfx) AudioSfx.play('lose');
    save.totalKills = (save.totalKills || 0) + state.kills;
    if (state.endless) {
      save.bestEndlessWave = Math.max(save.bestEndlessWave || 0, state.waveIndex);
    }
    writeSave(save);
    notifyAchievements();
    const tip = pickFailTip(state.kills * 17 + state.waveIndex * 3);
    const rec = recommendForStage
      ? recommendForStage(state.stage, state.endless, state.daily, state.weekly)
      : null;
    const recLu = (rec && rec.lineup) || LINEUPS[0];
    const recLine =
      '\n\n本關推薦：' +
      recLu.name +
      (rec && rec.reason ? '（' + rec.reason + '）' : '') +
      ' — 下方芯片可一鍵跟單。';
    UI.showOverlay(
      '銀樓失守',
      '核心被攻破。擊殺 ' +
        state.kills +
        (state.endless
          ? '｜無盡撐到第 ' + state.waveIndex + ' 波（最佳 ' + (save.bestEndlessWave || 0) + '）'
          : state.weekly
            ? '｜週挑戰未過'
            : state.daily
              ? '｜每日未過'
              : '') +
        '。' +
        runModBlock() + settleExtraBlock() +
        '\n\n提示：' +
        tip +
        recLine,
      '重開本關',
      () => {
        UI.hideOverlay();
        resetRun(state.endless, state.daily, state.weekly);
      },
      [
        {
          label: '用「' + recLu.name + '」再開',
          secondary: true,
          onClick: () => {
            UI.hideOverlay();
            resetRun(state.endless, state.daily, state.weekly);
            applyLineup(recLu);
          },
        },
      ]
    );
    // 失敗畫面必出推薦陣容芯片
    setTimeout(() => {
      const extra = document.getElementById('overlay-extra');
      if (!extra || state.phase !== 'lost') return;
      const holder = document.createElement('div');
      holder.style.cssText = 'width:100%;';
      extra.appendChild(holder);
      UI.renderLineupChips(holder, (lu) => {
        UI.hideOverlay();
        resetRun(state.endless, state.daily, state.weekly);
        applyLineup(lu);
      });
      const lab = holder.querySelector('.lineup-label');
      if (lab) lab.textContent = '失敗必讀｜推薦「' + recLu.name + '」— 點芯片跟單再開';
    }, 0);
  }

  function applyLineup(lu) {
    if (!lu) return;
    state.selectedShopId = lu.heroes[0] || null;
    save.ach.lineup = true;
    writeSave(save);
    notifyAchievements();
    const names = lu.heroes.map((id) => HEROES[id].name).join('、');
    UI.toast('推薦：' + lu.name + ' — 先召 ' + names, 2600);
    UI.setHint('陣容「' + lu.name + '」：' + (lu.tip || lu.blurb) + '｜已選 ' + HEROES[lu.heroes[0]].name);
    syncAll();
  }

  function resetRun(keepEndless, keepDaily, keepWeekly) {
    const weekly = keepWeekly && state.weekly;
    const daily = !weekly && keepDaily && state.daily;
    const endless = !weekly && !daily && keepEndless && state.endless;
    const idx = endless || daily || weekly ? 0 : state.stageIndex >= 0 ? state.stageIndex : 0;
    state = freshState(idx, endless, daily, weekly);
    const b = firstRunBonus(save);
    if (b > 0 && !endless && !daily && !weekly && idx === 0) state.silver += b;
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

  function openCodex() {
    state.paused = true;
    UI.showCodex(() => save, () => syncAll());
  }

  function openAchievements() {
    state.paused = true;
    UI.showAchievements(() => save, () => syncAll());
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
      onToggleSkillCd: () => {
        save.showSkillCd = save.showSkillCd === false;
        writeSave(save);
        state.showSkillCd = save.showSkillCd !== false;
        syncAll();
      },
      onToggleShake: () => {
        save.reduceShake = !save.reduceShake;
        writeSave(save);
        state.reduceShake = !!save.reduceShake;
        syncAll();
      },
      onToggleFlash: () => {
        save.reduceFlash = !save.reduceFlash;
        writeSave(save);
        state.reduceFlash = !!save.reduceFlash;
        syncAll();
      },
      onToggleStuckTips: () => {
        save.stuckTips = save.stuckTips === false;
        writeSave(save);
        state.stuckTips = save.stuckTips !== false;
        syncAll();
      },
      onToggleSfx: () => {
        save.sfxEnabled = save.sfxEnabled === false;
        writeSave(save);
        if (AudioSfx) {
          AudioSfx.setEnabled(save.sfxEnabled !== false);
          if (save.sfxEnabled !== false) AudioSfx.play('click');
        }
        syncAll();
      },
      onSkipTutorial: () => {
        save.skipTutorial = !save.skipTutorial;
        writeSave(save);
        state.tutorialStep = save.skipTutorial ? 99 : 0;
        syncAll();
      },
      onExportSave: () => {
        try {
          const json = exportSaveJson(save);
          const blob = new Blob([json], { type: 'application/json' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'yinlou-defense-save.json';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            URL.revokeObjectURL(a.href);
            a.remove();
          }, 500);
          UI.toast('已匯出存檔 JSON');
        } catch (err) {
          UI.toast('匯出失敗');
        }
      },
      onImportSave: () => {
        const inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'application/json,.json';
        inp.onchange = () => {
          const file = inp.files && inp.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              save = importSaveJson(String(reader.result || ''));
              writeSave(save);
              state = freshState(0, false, false, false);
              resetWaveBtn();
              syncAll();
              notifyAchievements();
              UI.hideOverlay();
              UI.toast('存檔已匯入');
            } catch (err) {
              UI.toast('匯入失敗：檔案無效');
            }
          };
          reader.readAsText(file);
        };
        inp.click();
      },
      onClearSave: () => {
        save = defaultSave();
        writeSave(save);
        state = freshState(0, false, false, false);
        resetWaveBtn();
        syncAll();
        UI.toast('存檔已清除');
      },
      onClose: () => syncAll(),
      onRestart: () => resetRun(state.endless, state.daily, state.weekly),
      onOpenCodex: () => openCodex(),
      onOpenAch: () => openAchievements(),
    });
  }

  document.getElementById('btn-wave').addEventListener('click', startWave);
  document.getElementById('btn-reset').addEventListener('click', () => {
    UI.hideOverlay();
    resetRun(state.endless, state.daily, state.weekly);
  });
  document.getElementById('btn-pause').addEventListener('click', togglePause);
  document.getElementById('btn-settings').addEventListener('click', openSettings);
  document.getElementById('btn-codex').addEventListener('click', openCodex);

  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      const ov = document.getElementById('overlay');
      if (ov && ov.classList.contains('show') && (ov.classList.contains('settings-mode') || ov.classList.contains('codex-mode'))) {
        UI.hideOverlay();
        syncAll();
        return;
      }
      togglePause();
    }
    if (ev.key === 'p' || ev.key === 'P') togglePause();
    if (ev.key === 'c' || ev.key === 'C') openCodex();
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
    const cost = currentSummonCost(shopId);
    const def = HEROES[shopId];
    if (state.silver < cost) {
      UI.toast('銀兩不足（要 ' + cost + '）');
      return false;
    }
    state.silver -= cost;
    state.summonCounts[shopId] = (state.summonCounts[shopId] || 0) + 1;
    state.heroes.push(Battle.makeHero(def.id, cell.lane, cell.slot, 1));
    markSeenHero(save, shopId);
    writeSave(save);
    notifyAchievements();
    if (AudioSfx) AudioSfx.play('summon');
    noteAction();
    UI.toast('上陣：' + def.name + '（−' + cost + '兩）', 1400);
    advanceTutorial(1);
    const nextCost = currentSummonCost(shopId);
    if (state.silver < nextCost) state.selectedShopId = null;
    syncAll();
    return true;
  }

  function doMerge(fromHero, occupied) {
    const prevStar = occupied.star;
    const now = Battle.mergeHeroes(state.heroes, fromHero, occupied);
    if (!now) return false;
    const rebate = currentMergeRebate(now.id, now.star);
    if (rebate > 0) {
      state.silver += rebate;
      Battle.pushFloat(state.floats, {
        x: now.x + 18,
        y: now.y - 28,
        text: '+' + rebate + '兩',
        color: '#D4AF37',
        size: 14,
        vy: -24,
        life: 0.95,
      });
    }
    Battle.spawnMergeFx(state, now);
    if (AudioSfx) AudioSfx.play('merge');
    if (now.star >= 3 && !save.ach.star3) {
      save.ach.star3 = true;
      writeSave(save);
      notifyAchievements();
    }
    if (now.star >= MAX_STAR && !save.ach.maxstar) {
      save.ach.maxstar = true;
      writeSave(save);
      notifyAchievements();
    }
    noteAction();
    const starTxt = '★' + prevStar + '→★' + now.star;
    UI.toast(
      '合併成功｜' + HEROES[now.id].name + ' ' + starTxt + (rebate ? '｜回報 +' + rebate + '兩' : ''),
      2000
    );
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
      UI.toast('再點同種同星合併（而家 ' + occupied.star + '/' + MAX_STAR + ' 星）');
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
      const sk = HEROES[occupied.id].skill;
      const ul = upgradeLabel(occupied);
      if (AudioSfx) AudioSfx.play('click');
      UI.toast(
        '已選 ' +
          HEROES[occupied.id].name +
          (ul ? '（' + ul + '）' : '') +
          (sk ? '｜' + sk.name : '') +
          ' — 下方可強化／合併／調位'
      );
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
    const isTouch = ev.pointerType === 'touch' || ev.pointerType === 'pen';
    state._touchPad = isTouch ? 18 : 0;
    const hero = Battle.hitTestHero(state.heroes, x, y, state._touchPad);
    if (hero) {
      ptr = {
        kind: 'hero',
        heroUid: hero.uid,
        startX: x,
        startY: y,
        moved: false,
        pointerId: ev.pointerId,
        isTouch,
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
        isTouch: ev.pointerType === 'touch' || ev.pointerType === 'pen',
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
    const thresh = ptr.isTouch ? 6 : 8;
    if (!ptr.moved && Math.hypot(dx, dy) > thresh) {
      ptr.moved = true;
      if (state.drag) state.drag.active = true;
      canvas.classList.add('dragging');
    }
    if (!state.drag) return;
    state.drag.x = x;
    state.drag.y = y;
    const pad = ptr.isTouch ? 16 : 0;
    const cell = Battle.hitTestCell(x, y, pad);
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
    const cell = Battle.hitTestCell(x, y, ptr.isTouch ? 16 : 0);
    const wasDrag = ptr.moved;
    const fromShop = !!ptr.fromShopBtn;
    const pid = ptr.pointerId;

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
    // 商店觸控拖完（有移動）才擋按鈕殘餘 click；純點選仍要 click 選俠
    if (fromShop && wasDrag) {
      state._suppressShopClick = true;
      setTimeout(() => {
        state._suppressShopClick = false;
      }, 420);
    }
    try {
      if (pid != null && canvas.hasPointerCapture && canvas.hasPointerCapture(pid)) {
        canvas.releasePointerCapture(pid);
      }
    } catch (_) {}
    clearDrag();
  }

  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', () => {
    if (ptr && ptr.moved) state._suppressClick = true;
    clearDrag();
  });

  // 商店觸控拖：pointer 可能 capt 喺按鈕上，用 window 接力
  window.addEventListener('pointermove', (ev) => {
    if (!ptr || !ptr.fromShopBtn) return;
    if (ptr.moved) {
      try { ev.preventDefault(); } catch (_) {}
    }
    const { x, y } = canvasPos(ev);
    const dx = x - ptr.startX;
    const dy = y - ptr.startY;
    if (!ptr.moved && Math.hypot(dx, dy) > 6) {
      ptr.moved = true;
      if (state.drag) state.drag.active = true;
      canvas.classList.add('dragging');
    }
    if (!state.drag) return;
    state.drag.x = x;
    state.drag.y = y;
    const cell = Battle.hitTestCell(x, y, 16);
    if (cell) {
      state.drag.hoverLane = cell.lane;
      state.drag.hoverSlot = cell.slot;
      state.drag.validHover = !Battle.findHeroAt(state.heroes, cell.lane, cell.slot);
    } else {
      state.drag.hoverLane = null;
      state.drag.hoverSlot = null;
      state.drag.validHover = false;
    }
  }, { passive: false });
  window.addEventListener('pointerup', (ev) => {
    if (!ptr || !ptr.fromShopBtn) return;
    endPointer(ev);
  });
  window.addEventListener('pointercancel', () => {
    if (ptr && ptr.fromShopBtn) {
      if (ptr.moved) {
        state._suppressShopClick = true;
        setTimeout(() => {
          state._suppressShopClick = false;
        }, 420);
      }
      clearDrag();
    }
  });
  // iOS：額外擋 touchmove 捲動（部分機 pointermove preventDefault 唔夠）
  window.addEventListener(
    'touchmove',
    (ev) => {
      if (ptr && ptr.fromShopBtn && ptr.moved && ev.cancelable) ev.preventDefault();
      if (state.drag && state.drag.active && ev.cancelable) ev.preventDefault();
    },
    { passive: false }
  );

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
      const enemy = Battle.makeEnemy(job.enemy, lane, {
        hpMul: job.hpMul || 1,
        elite: !!job.elite,
      });
      if (state.modCtx) {
        if (state.modCtx.enemySpeedMul && state.modCtx.enemySpeedMul !== 1) {
          enemy.baseSpeed *= state.modCtx.enemySpeedMul;
          enemy.speed = enemy.baseSpeed;
        }
        if (state.modCtx.rewardMul && state.modCtx.rewardMul !== 1) {
          enemy.reward = Math.max(1, Math.round(enemy.reward * state.modCtx.rewardMul));
        }
      }
      state.enemies.push(enemy);
      if (!save.seenEnemies || !save.seenEnemies[job.enemy]) {
        markSeenEnemy(save, job.enemy);
        writeSave(save);
        notifyAchievements();
      }
      if (enemy.boss) {
        Battle.announceBoss(state, enemy);
        if (AudioSfx) AudioSfx.play('boss');
      } else if (enemy.elite && !state._eliteAnnounced) {
        state._eliteAnnounced = true;
        Battle.announceElite(state, enemy);
        if (AudioSfx) AudioSfx.play('elite');
        UI.toast('精英波！強化敵人入場', 2000);
      }
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
      const eliteBefore = state._eliteKills || 0;
      const rumorBefore = state._rumorKills || 0;
      const streakBefore = state._killStreak || 0;
      Battle.collectDead(state);
      let achDirty = false;
      if ((state._eliteKills || 0) > eliteBefore && !save.ach.elite) {
        save.ach.elite = true;
        achDirty = true;
      }
      if ((state._rumorKills || 0) >= 20 && !save.ach.rumor_sweep) {
        save.ach.rumor_sweep = true;
        achDirty = true;
      }
      if ((state._killStreak || 0) >= 5 && streakBefore < 5 && !save.ach.streak5) {
        save.ach.streak5 = true;
        achDirty = true;
      }
      if (achDirty) {
        writeSave(save);
        notifyAchievements();
      }
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
      if (state.phase === 'prep' && state.stuckTips !== false && save.stuckTips !== false) {
        state.prepIdle = (state.prepIdle || 0) + rawDt;
        const novice = (save.maxStageCleared || 0) < 2 && state.tutorialStep < 99;
        const rich = state.silver >= 40 && state.heroes.length < 6;
        const canMerge = state.heroes.some((a) =>
          state.heroes.some((b) => a.uid !== b.uid && Battle.canMerge(a, b))
        );
        const stuck =
          state.prepIdle >= (novice ? 11 : 18) &&
          (rich || canMerge || state.heroes.length === 0) &&
          state.prepIdle - (state._stuckTipAt || 0) >= (novice ? 14 : 22);
        if (stuck) {
          state._stuckTipAt = state.prepIdle;
          let tip = pickStuckTip((state.waveIndex * 17 + state.heroes.length) | 0);
          if (canMerge) tip = '場上有可合併組合——拖同種同星疊埋升星更強。';
          else if (state.heroes.length === 0) tip = '先喺商店選俠客放到空格，再開波。';
          else if (rich && state.waveIndex === 0) tip = '銀兩夠用就佈陣／合併，然後撳「開波」。';
          UI.toast('提示｜' + tip, 2600);
          UI.setHint('卡關提示：' + tip + '（設定可關）');
        }
      }
    } else {
      Battle.tickFloats(state, rawDt * 0.3);
    }

    if (state.milestoneBanner && state.milestoneBanner.life > 0) {
      state.milestoneBanner.life -= rawDt;
      if (state.milestoneBanner.life <= 0) state.milestoneBanner = null;
    }
    if (state.eventBanner && state.eventBanner.life > 0) {
      state.eventBanner.life -= rawDt;
      if (state.eventBanner.life <= 0) state.eventBanner = null;
    }
    state._bonds = activeBonds(state.heroes);
    state._animT = (state._animT || 0) + rawDt;
    YDRender.render(ctx, state);
    // HUD 唔使每幀 DOM 寫入（敵人多時穩 60fps）
    if (!frame._hudAcc) frame._hudAcc = 0;
    frame._hudAcc += rawDt;
    if (frame._hudAcc >= 0.12 || state.phase !== 'wave') {
      frame._hudAcc = 0;
      UI.updateHud(state);
    }
    requestAnimationFrame(frame);
  }

  const unlocked = save.maxStageCleared || 0;
  const dailyMeta = dailyStageMeta();
  const weekMeta = weeklyStageMeta();
  const bonus = firstRunBonus(save);
  if (bonus > 0 && state.stageIndex === 0 && !state.endless && !state.daily && !state.weekly) {
    state.silver += bonus;
  }
  const bootRec = recommendForStage
    ? recommendForStage(state.stage, false, false, false)
    : null;
  UI.showOverlay(
    '銀樓防衛',
    '合併塔防 v1.3.0\n' +
      '三步上手：① 拖俠客落場 ② 同種合併升星 ③ 開波守銀樓。\n' +
      '新：首輪正式像素精靈｜開波市況事件｜停牌符。\n' +
      '失敗必出推薦陣容；卡關提示／閃光／震屏可喺設定關。\n' +
      (bonus > 0 ? '新手首局加銀 +' + bonus + ' 兩\n' : '') +
      (bootRec
        ? '本關推薦：' + bootRec.lineup.name + ' — ' + bootRec.reason + '\n'
        : '') +
      '今日：' +
      dailyMeta.name +
      '\n本週：' +
      weekMeta.name +
      '\n累計銀兩帳：' +
      save.totalSilver +
      '｜最高關：' +
      unlocked +
      (save.bestEndlessWave ? '｜無盡最佳：' + save.bestEndlessWave : ''),
    state.tutorialStep < 99 ? '開始教學' : '開始',
    () => {
      UI.hideOverlay();
      if (AudioSfx) AudioSfx.unlock();
      if (!save.firstBootDone) {
        save.firstBootDone = true;
        writeSave(save);
      }
      if (state.tutorialStep < 99) {
        state.tutorialStep = 0;
        UI.toast('① 先拖「莊家鐵衛」或任一俠客到綠色空格', 3200);
      }
      showStageStory(
        state.tutorialStep < 99 ? '跟底欄三步提示；可撳推薦陣容' : '準備就緒'
      );
      setTimeout(stageRecommendToast, 600);
      syncAll();
    }
  );
  setTimeout(() => {
    const extra = document.getElementById('overlay-extra');
    if (!extra) return;
    if (bootRec && bootRec.lineup) {
      const tip = document.createElement('div');
      tip.className = 'lineup-label';
      tip.style.cssText = 'width:100%;text-align:center;color:#C9A227;font-size:12px;margin-bottom:4px;';
      tip.textContent = '本關推薦｜' + bootRec.lineup.name + ' — ' + bootRec.reason;
      extra.appendChild(tip);
    }
    UI.renderLineupChips(extra, (lu) => {
      applyLineup(lu);
      UI.toast('已套用提示：' + lu.name + ' — 開始後跟住召', 2000);
    });
  }, 0);

  (function setupOrientHint() {
    const el = document.getElementById('orient-hint');
    if (!el) return;
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem('yinlou-orient-dismiss') === '1';
    } catch (_) {}
    function update() {
      if (dismissed) {
        el.classList.remove('show');
        return;
      }
      const portrait = window.matchMedia('(orientation: portrait)').matches;
      const narrow = Math.min(window.innerWidth, window.innerHeight) < 720;
      const show = portrait && narrow;
      el.classList.toggle('show', show);
      el.setAttribute('aria-hidden', show ? 'false' : 'true');
    }
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', () => setTimeout(update, 120));
    const btn = document.getElementById('orient-dismiss');
    if (btn) {
      btn.addEventListener('click', () => {
        dismissed = true;
        try {
          sessionStorage.setItem('yinlou-orient-dismiss', '1');
        } catch (_) {}
        el.classList.remove('show');
      });
    }
  })();

  syncAll();
  notifyAchievements();
  requestAnimationFrame(frame);
})();
