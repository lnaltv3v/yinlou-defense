/**
 * 銀樓防衛 — HUD／商店／Toast／設定／圖鑑／成就／陣容／存檔／強化 v2.5.0
 */
(function (global) {
  const {
    HEROES,
    ENEMIES,
    STAGES,
    SPEED_OPTIONS,
    BONDS,
    ACHIEVEMENTS,
    ACHIEVEMENT_CATS,
    saveStats,
    LINEUPS,
    summonCost,
    hkDateString,
    dailyStageMeta,
    weeklyStageMeta,
    hkWeekKey,
    formatWeekProgress,
    formatLocalBestWall,
    exportLocalWallJson,
    exportLocalWallText,
    encodeWallShort,
    parseWallShort,
    compareWallShort,
    recordWallSnapshot,
    formatWallTimeline,
    formatWallSparkline,
    listBossPreviews,
    QUAD_TIDE_LESSON,
    exportLocalWallShare,
    pickFailTip,
    UPGRADE_PATHS,
    upgradeCost,
    upgradeLabel,
  } = global.YD;

  function $(id) {
    return document.getElementById(id);
  }

  function toast(msg, ms) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), ms || 1600);
  }

  /** 商店頭像：有正式 PNG idle 就用；否則幾何色塊 */
  function avatarHtml(def) {
    const c = def.color;
    const ink = '#1A1510';
    const paper = '#E8DCC8';
    const sil = def.silhouette || def.role;
    let gear = '';
    if (sil === 'blade' || sil === 'melee') {
      gear = '<i class="av-gear" style="background:#E8DCC8;left:22px;top:8px;width:6px;height:14px"></i>';
    } else if (sil === 'sword' || sil === 'ranged') {
      gear = '<i class="av-gear" style="background:#C9A227;left:20px;top:6px;width:4px;height:16px"></i>';
    } else if (sil === 'shield' || sil === 'tank') {
      gear = '<i class="av-gear" style="background:#8A8070;left:2px;top:10px;width:8px;height:12px"></i>';
    } else if (sil === 'hat' || sil === 'support') {
      gear = '<i class="av-gear" style="background:#3A7A6A;left:6px;top:2px;width:16px;height:5px"></i>';
    } else if (sil === 'staff' || sil === 'aoe') {
      gear = '<i class="av-gear" style="background:#5A4060;left:2px;top:4px;width:6px;height:18px"></i>';
    } else if (sil === 'dagger' || sil === 'assassin') {
      gear = '<i class="av-gear" style="background:#A04040;left:20px;top:10px;width:8px;height:4px"></i>';
    } else if (sil === 'drum' || sil === 'buffer') {
      gear = '<i class="av-gear" style="background:#C9A227;left:6px;top:18px;width:16px;height:8px"></i>';
    } else if (sil === 'hook' || sil === 'hunter') {
      gear = '<i class="av-gear" style="background:#8A5040;left:20px;top:8px;width:8px;height:4px"></i>';
    } else if (sil === 'coin' || sil === 'arb') {
      gear = '<i class="av-gear" style="background:#C9A227;left:18px;top:10px;width:10px;height:10px;border-radius:0"></i>';
    } else if (sil === 'scroll' || sil === 'marker') {
      gear =
        '<i class="av-gear" style="background:#E8DCC8;left:18px;top:6px;width:6px;height:14px"></i>' +
        '<i class="av-gear" style="background:#C45C4A;left:2px;top:10px;width:8px;height:8px"></i>';
    } else if (sil === 'gourd' || sil === 'medic') {
      gear =
        '<i class="av-gear" style="background:#508070;left:18px;top:8px;width:10px;height:12px"></i>' +
        '<i class="av-gear" style="background:#C9A227;left:20px;top:4px;width:6px;height:5px"></i>';
    }
    const fallback =
      '<i class="av-body" style="background:' +
      c +
      '"></i>' +
      '<i class="av-head" style="background:' +
      paper +
      '"></i>' +
      '<i class="av-eye" style="left:8px;background:' +
      ink +
      '"></i>' +
      '<i class="av-eye" style="left:16px;background:' +
      ink +
      '"></i>' +
      gear;
    const src = (window.YDSprites && window.YDSprites.urlFor) ? window.YDSprites.urlFor(def.id) : ('assets/sprites/' + def.id + '.png?v=2.3.0');
    return (
      '<span class="hero-avatar" aria-hidden="true" data-hero="' +
      def.id +
      '" style="--av:' +
      c +
      '">' +
      '<img class="av-png" src="' +
      src +
      '" width="28" height="28" alt="" decoding="async" ' +
      "onload=\"this.parentNode.classList.add('has-png')\" " +
      'onerror="this.remove()" />' +
      '<span class="av-fallback">' +
      fallback +
      '</span>' +
      '</span>'
    );
  }

  function buildShop(onSelect, getSelectedId, getSilver, handlers) {
    const shop = $('shop');
    shop.innerHTML = '';
    const ids = Object.keys(HEROES);
    for (const id of ids) {
      const def = HEROES[id];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hero-btn';
      btn.dataset.id = id;
      btn.draggable = true;
      const sk = def.skill ? def.skill.name : '';
      btn.innerHTML =
        '<div class="hero-btn-row">' +
        avatarHtml(def) +
        '<div class="hero-btn-meta">' +
        '<div><strong style="color:' +
        def.color +
        '">' +
        def.name +
        '</strong></div>' +
        '<div class="hero-blurb">' +
        def.blurb +
        (sk ? ' · ' + sk : '') +
        '</div>' +
        '<div class="cost">銀兩 <span class="cost-num">' +
        def.cost +
        '</span></div>' +
        '</div></div>';
      btn.title = def.skill ? def.skill.name + '：' + def.skill.blurb : def.blurb;
      btn.addEventListener('click', () => onSelect(id));
      btn.addEventListener('dragstart', (ev) => {
        if (handlers && handlers.onShopDragStart) handlers.onShopDragStart(id, ev);
      });
      // 手機：由商店按鈕 pointer 拖入場（HTML5 DnD 喺 iOS 幾乎唔得）
      btn.addEventListener('pointerdown', (ev) => {
        if (ev.pointerType === 'mouse' && ev.button !== 0) return;
        if (handlers && handlers.onShopPointerDown) {
          handlers.onShopPointerDown(id, ev, btn);
        }
      });
      shop.appendChild(btn);
    }

    const mkAction = (id, label, cls) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'action-btn' + (cls ? ' ' + cls : '');
      b.id = id;
      b.textContent = label;
      shop.appendChild(b);
      return b;
    };
    mkAction('btn-wave', '開波');
    mkAction('btn-pause', '暫停', 'secondary');
    mkAction('btn-codex', '圖鑑', 'secondary');
    mkAction('btn-reset', '重開本關', 'danger');
    mkAction('btn-settings', '設定', 'secondary');

    return {
      refresh() {
        const sel = getSelectedId();
        const silver = getSilver();
        const counts =
          handlers && handlers.getSummonCounts ? handlers.getSummonCounts() : {};
        shop.querySelectorAll('.hero-btn').forEach((btn) => {
          const id = btn.dataset.id;
          const cost =
            handlers && handlers.getCost ? handlers.getCost(id) : summonCost(id, counts);
          const num = btn.querySelector('.cost-num');
          if (num) {
            num.textContent = String(cost);
            if (cost > HEROES[id].cost) num.classList.add('inflated');
            else num.classList.remove('inflated');
          }
          btn.classList.toggle('selected', sel === id);
          btn.disabled = silver < cost && sel !== id;
        });
      },
    };
  }

  function buildSpeedBar(getSpeed, setSpeed) {
    const bar = $('speed-bar');
    if (!bar) return;
    bar.innerHTML = '';
    const label = document.createElement('span');
    label.className = 'speed-label';
    label.textContent = '速度';
    bar.appendChild(label);
    for (const sp of SPEED_OPTIONS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'speed-btn';
      btn.dataset.speed = String(sp);
      btn.textContent = sp + '×';
      btn.addEventListener('click', () => setSpeed(sp));
      bar.appendChild(btn);
    }
    return {
      refresh() {
        const cur = getSpeed();
        bar.querySelectorAll('.speed-btn').forEach((b) => {
          b.classList.toggle('selected', Number(b.dataset.speed) === cur);
        });
      },
    };
  }


  function buildUpgradeBar(getHero, getSilver, onUpgrade) {
    let bar = $('upgrade-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'upgrade-bar';
      bar.className = 'tool-bar upgrade-bar';
      bar.setAttribute('aria-label', '強化');
      const hud = $('hud');
      if (hud && hud.parentNode) hud.parentNode.insertBefore(bar, hud.nextSibling);
      else document.getElementById('app').appendChild(bar);
    }
    bar.innerHTML = '';
    const label = document.createElement('span');
    label.className = 'speed-label';
    label.id = 'upgrade-label';
    label.textContent = '強化';
    bar.appendChild(label);
    const paths = ['atk', 'def', 'haste'];
    for (const pid of paths) {
      const p = UPGRADE_PATHS[pid];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'upgrade-btn';
      btn.dataset.path = pid;
      btn.innerHTML = '<strong>' + p.name + '</strong><span class="up-cost">—</span>';
      btn.title = p.blurb;
      btn.addEventListener('click', () => onUpgrade(pid));
      bar.appendChild(btn);
    }
    return {
      refresh() {
        const hero = getHero();
        const silver = getSilver();
        if (!hero) {
          bar.classList.remove('show');
          return;
        }
        bar.classList.add('show');
        const name = HEROES[hero.id] ? HEROES[hero.id].name : hero.id;
        const ul = upgradeLabel(hero);
        label.textContent = '強化・' + name + (ul ? '（' + ul + '）' : '');
        bar.querySelectorAll('.upgrade-btn').forEach((btn) => {
          const pid = btn.dataset.path;
          const p = UPGRADE_PATHS[pid];
          const key = pid === 'atk' ? 'upAtk' : pid === 'def' ? 'upDef' : 'upHaste';
          const lv = hero[key] || 0;
          const cost = upgradeCost(pid, lv);
          const full = lv >= p.maxLv;
          const costEl = btn.querySelector('.up-cost');
          if (costEl) costEl.textContent = full ? '滿' : cost + '兩・' + lv + '/' + p.maxLv;
          btn.disabled = full || silver < cost;
          btn.classList.toggle('maxed', full);
        });
      },
    };
  }

  function showStory(title, body, onContinue) {
    showOverlay(title, body, '繼續', () => {
      hideOverlay();
      if (onContinue) onContinue();
    });
  }

  function buildStageBar(getSave, onPickStage, onEndless, onDaily, onWeekly) {
    const bar = $('stage-bar');
    if (!bar) return;
    bar.innerHTML = '';
    const label = document.createElement('span');
    label.className = 'speed-label';
    label.textContent = '關卡';
    bar.appendChild(label);
    for (const st of STAGES) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'stage-btn' + (st.challenge ? ' challenge' : '');
      btn.dataset.stage = String(st.id);
      btn.textContent = st.id + '. ' + st.name;
      if (st.challenge) btn.title = st.id === 7 ? '挑戰關：斷索開市' : '挑戰關：盤後暗盤';
      btn.addEventListener('click', () => onPickStage(st.id - 1));
      bar.appendChild(btn);
    }
    const endBtn = document.createElement('button');
    endBtn.type = 'button';
    endBtn.className = 'stage-btn endless';
    endBtn.textContent = '無盡';
    endBtn.addEventListener('click', onEndless);
    bar.appendChild(endBtn);

    const dailyBtn = document.createElement('button');
    dailyBtn.type = 'button';
    dailyBtn.className = 'stage-btn daily';
    dailyBtn.id = 'btn-daily';
    dailyBtn.textContent = '每日';
    dailyBtn.addEventListener('click', onDaily);
    bar.appendChild(dailyBtn);

    const weeklyBtn = document.createElement('button');
    weeklyBtn.type = 'button';
    weeklyBtn.className = 'stage-btn weekly';
    weeklyBtn.id = 'btn-weekly';
    weeklyBtn.textContent = '週挑戰';
    weeklyBtn.addEventListener('click', onWeekly);
    bar.appendChild(weeklyBtn);

    return {
      refresh(activeStageId, endless, daily, weekly) {
        const save = getSave();
        const today = hkDateString();
        const weekKey = typeof hkWeekKey === 'function' ? hkWeekKey() : '';
        bar.querySelectorAll('.stage-btn').forEach((b) => {
          if (b.classList.contains('endless')) {
            b.classList.toggle('selected', !!endless && !daily && !weekly);
            b.disabled = save.maxStageCleared < 1;
            const allClear = (save.maxStageCleared || 0) >= STAGES.length;
            const best = save.bestEndlessWave || 0;
            b.textContent = allClear ? (best ? '無盡★' + best : '無盡★') : '無盡';
            b.title = allClear
              ? '十二關皆破｜無盡最佳 ' + best + ' 波｜每 30 波三潮'
              : save.maxStageCleared < 1
                ? '先通關第 1 關解鎖無盡'
                : '無盡殺跌｜最佳 ' + best + ' 波';
            b.classList.toggle('finale', allClear);
            return;
          }
          if (b.classList.contains('daily')) {
            b.classList.toggle('selected', !!daily && !weekly);
            b.disabled = save.maxStageCleared < 1;
            const done = save.dailyDate === today && save.dailyCleared;
            const wp = typeof formatWeekProgress === 'function' ? formatWeekProgress(save) : null;
            b.textContent = done ? '每日✓' : '每日';
            const meta = dailyStageMeta(today);
            b.title =
              (done ? '今日已清（可重打無額外獎）｜' : '今日未清｜首清 +80 兩｜') +
              meta.name +
              (meta.blurb ? '｜' + meta.blurb : '') +
              (wp ? '｜' + wp.label : '');
            return;
          }
          if (b.classList.contains('weekly')) {
            b.classList.toggle('selected', !!weekly);
            b.disabled = save.maxStageCleared < 2;
            const done = save.weeklyKey === weekKey && save.weeklyCleared;
            const wp = typeof formatWeekProgress === 'function' ? formatWeekProgress(save) : null;
            b.textContent = done ? '週挑戰✓' : wp ? '週挑戰·' + wp.short : '週挑戰';
            const meta = typeof weeklyStageMeta === 'function' ? weeklyStageMeta(weekKey) : { name: '週挑戰', blurb: '' };
            b.title =
              (save.maxStageCleared < 2 ? '通關第 2 關解鎖｜' : '') +
              (done ? '本週已清（可重打無額外獎）｜' : '本週未清｜首清 +160 兩｜') +
              meta.name +
              (meta.blurb ? '｜' + meta.blurb : '') +
              (wp ? '｜重置 ' + wp.resetHint : '');
            return;
          }
          const id = Number(b.dataset.stage);
          const unlocked = id === 1 || save.maxStageCleared >= id - 1;
          b.disabled = !unlocked;
          b.classList.toggle('selected', !endless && !daily && !weekly && activeStageId === id);
          if (!unlocked) b.title = '先通關上一關';
          else b.title = '';
        });
      },
    };
  }

  function updateHud(state) {
    $('stat-silver').textContent = Math.floor(state.silver);
    $('stat-hp').textContent = Math.max(0, Math.ceil(state.coreHp));
    if (state.endless) {
      $('stat-wave').textContent = state.waveIndex + '/∞';
    } else {
      $('stat-wave').textContent = state.waveIndex + '/' + state.stage.waves.length;
    }
    const modShort =
      state.modifiers && state.modifiers.length
        ? '·' + state.modifiers.map((m) => m.name.slice(0, 2)).join('')
        : '';
    $('stat-stage').textContent = state.endless
      ? '無盡' + modShort
      : state.weekly
        ? '週挑戰' + modShort
        : state.daily
          ? '每日' + modShort
          : String(state.stage.id);
    const kills = $('stat-kills');
    if (kills) kills.textContent = String(state.kills || 0);
    const bondEl = $('stat-bonds');
    if (bondEl) {
      const bonds = state._bonds || [];
      bondEl.textContent = bonds.length
        ? '(' + bonds.length + ') ' + bonds.map((b) => b.name).join('、')
        : '—';
      bondEl.title = bonds.map((b) => b.name + '：' + b.blurb).join('\n');
    }
    const lockEl = $('stat-locks');
    if (lockEl) {
      let locked = 0;
      for (const e of state.enemies || []) {
        if (e.hp > 0 && e.lockT > 0) locked += 1;
      }
      const procs = state.lockProcs || 0;
      lockEl.textContent = locked || procs ? locked + (procs ? '/' + procs : '') : '—';
      lockEl.title = '場上鎖倉數／本局鎖倉印次數';
    }
    const pauseBtn = $('btn-pause');
    if (pauseBtn) {
      pauseBtn.textContent = state.paused ? '繼續' : '暫停';
      pauseBtn.classList.toggle('selected', !!state.paused);
    }
  }

  function showOverlay(title, msg, btnLabel, onClick, extraBtns) {
    const ov = $('overlay');
    ov.classList.remove('settings-mode');
    ov.classList.remove('codex-mode');
    ov.classList.remove('paper-panel');
    $('overlay-title').textContent = title;
    const msgEl = $('overlay-msg');
    msgEl.textContent = msg;
    msgEl.classList.remove('paper-body');
    const btn = $('btn-overlay');
    btn.textContent = btnLabel || '確定';
    btn.onclick = onClick;
    btn.style.display = '';
    const extra = $('overlay-extra');
    if (extra) {
      extra.innerHTML = '';
      if (extraBtns && extraBtns.length) {
        for (const eb of extraBtns) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'action-btn' + (eb.danger ? ' danger' : eb.secondary ? ' secondary' : '');
          b.textContent = eb.label;
          b.onclick = eb.onClick;
          extra.appendChild(b);
        }
      }
    }
    ov.classList.add('show');
  }

  function hideOverlay() {
    const ov = $('overlay');
    ov.classList.remove('show');
    ov.classList.remove('settings-mode');
    ov.classList.remove('codex-mode');
    ov.classList.remove('paper-panel');
  }

  function showSettings(opts) {
    const {
      getSave,
      onToggleHints,
      onSkipTutorial,
      onToggleSkillCd,
      onToggleShake,
      onToggleFlash,
      onToggleStuckTips,
      onToggleSfx,
      onClearSave,
      onClose,
      onRestart,
      onOpenCodex,
      onOpenAch,
      onExportSave,
      onImportSave,
      onExportWallJson,
      onExportWallText,
      onCopyWallShare,
      onCompareWallShare,
      onSnapWall,
      onWallTimeline,
      onQuadLesson,
    } = opts;
    const save = getSave();
    const ov = $('overlay');
    ov.classList.add('settings-mode', 'paper-panel');
    ov.classList.remove('codex-mode');
    $('overlay-title').textContent = '設定';
    const achN = Object.keys(save.unlockedAch || {}).length;
    const msg = $('overlay-msg');
    msg.innerHTML =
      '<div class="paper-summary">' +
      '<div class="paper-row"><span>顯示</span><strong>高亮 ' +
      (save.showCellHints !== false ? '開' : '關') +
      ' · 技能條 ' +
      (save.showSkillCd !== false ? '開' : '關') +
      '</strong></div>' +
      '<div class="paper-row"><span>手感</span><strong>震屏 ' +
      (save.reduceShake ? '減弱' : '正常') +
      ' · 閃光 ' +
      (save.reduceFlash ? '減弱' : '正常') +
      ' · 音效 ' +
      (save.sfxEnabled !== false ? '開' : '關') +
      '</strong></div>' +
      '<div class="paper-row"><span>提示</span><strong>卡關 ' +
      (save.stuckTips !== false ? '開' : '關') +
      ' · 教學 ' +
      (save.skipTutorial ? '略過' : '開') +
      '</strong></div>' +
      '<div class="paper-row"><span>進度</span><strong>羈絆 ' +
      BONDS.length +
      ' · 成就 ' +
      achN +
      '/' +
      ACHIEVEMENTS.length +
      '</strong></div>' +
      '<div class="paper-row"><span>本週</span><strong>' +
      (typeof formatWeekProgress === 'function' ? formatWeekProgress(save).label : '—') +
      '</strong></div>' +
      '<div class="paper-row"><span>本地牆</span><strong>' +
      (typeof formatLocalBestWall === 'function' ? formatLocalBestWall(save).short : '—') +
      '</strong></div>' +
      '<div class="paper-row"><span>牆短碼</span><strong class="mono">' +
      (typeof encodeWallShort === 'function' ? encodeWallShort(save) : '—') +
      '</strong></div>' +
      '<div class="paper-row"><span>近牆快照</span><strong>' +
      (typeof formatLocalBestWall === 'function'
        ? (function () {
            const w = formatLocalBestWall(save);
            const snaps = w.snapshots || [];
            if (!snaps.length) return '尚無';
            return snaps
              .slice(-3)
              .map(function (s) {
                return (s.short || s.code || '') + (s.reason ? '·' + s.reason : '');
              })
              .join('｜');
          })()
        : '—') +
      '</strong></div>' +
      '<p class="paper-note">點場上俠客可強化（刀利／甲厚／內息）。圖鑑卡片已加厚；本地牆可匯出／短碼對照／快照（本機｜唔做線上排行）。</p>' +
      '</div>';
    const btn = $('btn-overlay');
    btn.textContent = '關閉';
    btn.onclick = () => {
      hideOverlay();
      if (onClose) onClose();
    };
    const extra = $('overlay-extra');
    extra.innerHTML = '';
    const section = (title) => {
      const d = document.createElement('div');
      d.className = 'paper-section-label';
      d.textContent = title;
      extra.appendChild(d);
    };
    const mk = (label, fn, danger, secondary) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'action-btn paper-btn' + (danger ? ' danger' : secondary ? ' secondary' : '');
      b.textContent = label;
      b.onclick = fn;
      extra.appendChild(b);
    };
    section('顯示／手感');
    mk(
      save.showCellHints !== false ? '欄位高亮：開' : '欄位高亮：關',
      () => {
        onToggleHints();
        showSettings(opts);
      },
      false,
      true
    );
    if (onToggleSkillCd) {
      mk(
        save.showSkillCd !== false ? '技能條：開' : '技能條：關',
        () => {
          onToggleSkillCd();
          showSettings(opts);
        },
        false,
        true
      );
    }
    if (onToggleShake) {
      mk(
        save.reduceShake ? '震屏：減弱' : '震屏：正常',
        () => {
          onToggleShake();
          showSettings(opts);
        },
        false,
        true
      );
    }
    if (onToggleFlash) {
      mk(
        save.reduceFlash ? '閃光／強反饋：減弱' : '閃光／強反饋：正常',
        () => {
          onToggleFlash();
          showSettings(opts);
        },
        false,
        true
      );
    }
    if (onToggleStuckTips) {
      mk(
        save.stuckTips !== false ? '卡關提示：開' : '卡關提示：關',
        () => {
          onToggleStuckTips();
          showSettings(opts);
        },
        false,
        true
      );
    }
    if (onToggleSfx) {
      mk(
        save.sfxEnabled !== false ? '音效：開' : '音效：關',
        () => {
          onToggleSfx();
          showSettings(opts);
        },
        false,
        true
      );
    }
    mk(
      save.skipTutorial ? '教學：略過' : '教學：顯示',
      () => {
        onSkipTutorial();
        showSettings(opts);
      },
      false,
      true
    );
    section('圖鑑／存檔');
    if (onOpenCodex) mk('圖鑑', () => onOpenCodex(), false, true);
    if (onOpenAch) mk('成就', () => onOpenAch(), false, true);
    if (onExportSave) mk('匯出存檔', () => onExportSave(), false, true);
    if (onImportSave) mk('匯入存檔', () => onImportSave(), false, true);
    section('本地最佳牆');
    if (onExportWallJson) mk('匯出牆 JSON', () => onExportWallJson(), false, true);
    if (onExportWallText) mk('匯出牆文字', () => onExportWallText(), false, true);
    if (onCopyWallShare) mk('複製牆短碼', () => onCopyWallShare(), false, true);
    if (onCompareWallShare) mk('對照牆短碼', () => onCompareWallShare(), false, true);
    if (onSnapWall) mk('留下牆快照', () => onSnapWall(), false, true);
    if (onWallTimeline) mk('牆快照時間軸', () => onWallTimeline(), false, true);
    if (onQuadLesson) mk('四潮教學', () => onQuadLesson(), false, true);
    section('本關');
    mk(
      '重開本關',
      () => {
        hideOverlay();
        onRestart();
      },
      false,
      true
    );
    mk(
      '清除存檔',
      () => {
        if (confirm('確定清除本地存檔？（關卡進度／圖鑑／成就會冇）')) {
          onClearSave();
          hideOverlay();
        }
      },
      true
    );
    ov.classList.add('show');
  }

  function renderLineupChips(container, onPick) {
    if (!container) return;
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'lineup-chips';
    const lab = document.createElement('div');
    lab.className = 'lineup-label';
    lab.textContent = '推薦陣容（點一下選商店俠客提示）';
    wrap.appendChild(lab);
    for (const lu of LINEUPS) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'lineup-chip';
      chip.title = lu.tip || lu.blurb;
      const names = lu.heroes.map((id) => (HEROES[id] ? HEROES[id].name : id)).join('＋');
      chip.innerHTML =
        '<strong>' + lu.name + '</strong><span>' + lu.blurb + '</span><em>' + names + '</em>';
      chip.addEventListener('click', () => onPick(lu));
      wrap.appendChild(chip);
    }
    container.appendChild(wrap);
  }

  function codexThumbHtml(def, kind) {
    const c = (def && def.color) || '#E8DCC8';
    const id = def && def.id;
    const src = id && window.YDSprites && window.YDSprites.urlFor
      ? window.YDSprites.urlFor(id)
      : id
        ? 'assets/sprites/' + id + '.png?v=2.3.0'
        : '';
    const fallback =
      '<span class="codex-thumb-fallback" style="background:' + c + '"></span>';
    if (!src) return '<span class="codex-thumb">' + fallback + '</span>';
    return (
      '<span class="codex-thumb" aria-hidden="true">' +
      '<img src="' +
      src +
      '" width="40" height="40" alt="" decoding="async" ' +
      "onload=\"this.parentNode.classList.add('has-png')\" " +
      'onerror="this.remove()" />' +
      fallback +
      '</span>'
    );
  }

    function failTipText(seed) {
    return pickFailTip ? pickFailTip(seed) : '';
  }

  function showCodex(getSave, onClose) {
    const save = getSave();
    const ov = $('overlay');
    ov.classList.remove('settings-mode');
    ov.classList.add('codex-mode', 'paper-panel');
    $('overlay-title').textContent = '圖鑑';
    const parts = ['<div class="paper-body">', '<div class="paper-sec">俠客</div>'];
    for (const id of Object.keys(HEROES)) {
      const def = HEROES[id];
      const seen = save.seenHeroes && save.seenHeroes[id];
      if (seen) {
        const sk = def.skill
          ? '<div class="card-skill"><b>' +
            def.skill.name +
            '</b> ' +
            (def.skill.blurb || '') +
            '</div>'
          : '';
        parts.push(
          '<div class="paper-entry card-thick card-row">' +
            codexThumbHtml(def, 'hero') +
            '<div class="card-body"><strong style="color:' +
            def.color +
            '">' +
            def.name +
            '</strong><span class="card-meta">' +
            def.blurb +
            ' · 召 ' +
            def.cost +
            '兩 · 攻' +
            def.atk +
            '／血' +
            def.hp +
            '</span>' +
            sk +
            (def.lore ? '<em class="lore">' + def.lore + '</em>' : '') +
            '</div></div>'
        );
      } else {
        parts.push('<div class="paper-entry dim card-thick"><strong>？？？</strong><span>尚未召喚</span></div>');
      }
    }
    parts.push('<div class="paper-sec">敵人</div>');
    for (const id of Object.keys(ENEMIES)) {
      const def = ENEMIES[id];
      const seen = save.seenEnemies && save.seenEnemies[id];
      if (seen) {
        const sk = def.skill
          ? '<div class="card-skill"><b>' +
            def.skill.name +
            '</b> ' +
            (def.skill.blurb || '') +
            '</div>'
          : '';
        parts.push(
          '<div class="paper-entry card-thick card-row">' +
            codexThumbHtml(def, 'enemy') +
            '<div class="card-body"><strong style="color:' +
            (def.color || '#E8DCC8') +
            '">' +
            def.name +
            (def.boss ? ' · Boss' : '') +
            '</strong><span class="card-meta">HP' +
            def.hp +
            '／攻' +
            def.atk +
            '／速' +
            def.speed +
            ' · 賞' +
            def.reward +
            '</span>' +
            sk +
            (def.lore ? '<em class="lore">' + def.lore + '</em>' : '') +
            '</div></div>'
        );
      } else {
        parts.push('<div class="paper-entry dim card-thick"><strong>？？？</strong><span>尚未遭遇</span></div>');
      }
    }
    parts.push('<div class="paper-sec">Boss 入場預覽</div>');
    const bosses =
      typeof listBossPreviews === 'function'
        ? listBossPreviews()
        : Object.keys(ENEMIES)
            .map(function (id) {
              return ENEMIES[id];
            })
            .filter(function (d) {
              return d && d.boss;
            });
    for (const b of bosses) {
      const seen = save.seenEnemies && save.seenEnemies[b.id];
      if (seen) {
        parts.push(
          '<div class="paper-entry card-thick card-row boss-preview">' +
            codexThumbHtml(b.id ? ENEMIES[b.id] || b : b, 'enemy') +
            '<div class="card-body"><strong style="color:' +
            (b.color || '#C9A227') +
            '">' +
            b.name +
            ' · 入場</strong><span class="card-meta">' +
            (b.entrance || '') +
            '</span>' +
            (b.skill ? '<div class="card-skill">' + b.skill + '</div>' : '') +
            '<span class="card-meta">HP' +
            (b.hp || '') +
            '／攻' +
            (b.atk || '') +
            ' · 賞' +
            (b.reward || '') +
            '</span></div></div>'
        );
      } else {
        parts.push(
          '<div class="paper-entry dim card-thick"><strong>？？？ · Boss</strong><span>尚未遭遇 — 入場預覽未解鎖</span></div>'
        );
      }
    }
    parts.push('<div class="paper-sec">四潮教學（常駐）</div>');
    {
      const lesson = QUAD_TIDE_LESSON || { blurb: '', steps: [] };
      parts.push(
        '<p class="paper-note">' +
          (lesson.blurb || '黑羽＋金邊＋臨停＋墨影') +
          '｜靜態短頁｜可喺設定重讀</p>'
      );
      for (const step of lesson.steps || []) {
        parts.push(
          '<div class="paper-entry card-thick">' +
            '<strong style="color:#C9A227">' +
            (step.name || '') +
            '</strong><span>' +
            (step.text || '') +
            '</span></div>'
        );
      }
    }
    parts.push('<div class="paper-sec">羈絆（' + BONDS.length + '）</div>');
    for (const b of BONDS) {
      const names = b.need.map((id) => (HEROES[id] ? HEROES[id].name : id)).join('＋');
      parts.push(
        '<div class="paper-entry card-thick bond-card"><strong style="color:#C9A227">' +
          b.name +
          '</strong><span class="card-meta">' +
          names +
          '</span><em class="lore">' +
          (b.blurb || '') +
          '</em></div>'
      );
    }
    parts.push('</div>');
    $('overlay-msg').innerHTML = parts.join('');
    const btn = $('btn-overlay');
    btn.textContent = '關閉';
    btn.onclick = () => {
      hideOverlay();
      if (onClose) onClose();
    };
    $('overlay-extra').innerHTML = '';
    ov.classList.add('show');
  }


  function showQuadTideLesson(getSave, onClose, onDone) {
    const lesson = QUAD_TIDE_LESSON || {
      title: '四潮教學',
      blurb: '黑羽＋金邊＋臨停＋墨影',
      steps: [],
    };
    const ov = $('overlay');
    ov.classList.remove('settings-mode');
    ov.classList.add('codex-mode', 'paper-panel');
    $('overlay-title').textContent = lesson.title || '四潮教學';
    const parts = [
      '<div class="paper-body">',
      '<p class="paper-note">' + (lesson.blurb || '') + '｜靜態短頁｜唔做影片</p>',
    ];
    for (const step of lesson.steps || []) {
      parts.push(
        '<div class="paper-entry card-thick">' +
          '<strong style="color:#C9A227">' +
          (step.name || '') +
          '</strong><span>' +
          (step.text || '') +
          '</span></div>'
      );
    }
    parts.push(
      '<p class="paper-note">圖鑑「Boss 入場預覽」可重溫各潮入場。墨影帳已接正式 PNG（ink_specter）；缺檔先借暗盤影，再幾何。</p></div>'
    );
    $('overlay-msg').innerHTML = parts.join('');
    const btn = $('btn-overlay');
    btn.textContent = '明白';
    btn.onclick = () => {
      hideOverlay();
      if (onDone) onDone();
      if (onClose) onClose();
    };
    $('overlay-extra').innerHTML = '';
    ov.classList.add('show');
  }

  function showWallTimeline(getSave, onClose, onMark) {
    const save = getSave();
    const ov = $('overlay');
    ov.classList.remove('settings-mode');
    ov.classList.add('codex-mode', 'paper-panel');
    $('overlay-title').textContent = '牆快照時間軸';
    const rows = typeof formatWallTimeline === 'function' ? formatWallTimeline(save) : [];
    const spark =
      typeof formatWallSparkline === 'function' ? formatWallSparkline(save) : null;
    const parts = [
      '<div class="paper-body">',
      '<p class="paper-note">本機牆影（新→舊）｜對照上一快照差值｜唔做線上排行</p>',
    ];
    let sawSpark = false;
    if (spark && spark.bars) {
      sawSpark = true;
      parts.push(
        '<div class="paper-entry card-thick wall-spark">' +
          '<strong style="color:#C9A227">差值走勢</strong>' +
          '<span class="wall-spark-bars mono">' +
          (spark.bars || '') +
          '</span>' +
          '<span class="card-meta">' +
          (spark.label || '') +
          '</span></div>'
      );
    }
    let sawDelta = false;
    if (!rows.length) {
      parts.push('<div class="paper-entry dim card-thick"><strong>尚無快照</strong><span>通關週挑戰／刷新無盡最佳／或設定「留下牆快照」</span></div>');
    } else {
      parts.push('<div class="wall-timeline">');
      for (const r of rows) {
        if (r.delta) sawDelta = true;
        const up =
          r.delta && (r.delta.endless > 0 || r.delta.weekStreakBest > 0 || r.delta.stages > 0);
        const down =
          r.delta && (r.delta.endless < 0 || r.delta.weekStreakBest < 0 || r.delta.stages < 0);
        const deltaHtml = r.deltaLabel
          ? '<span class="wall-snap-delta' +
            (up ? ' up' : down ? ' down' : '') +
            '">較上一筆：' +
            r.deltaLabel +
            '</span>'
          : '';
        parts.push(
          '<div class="paper-entry card-thick wall-snap-row">' +
            '<div class="card-body">' +
            '<strong>' +
            (r.localAt || r.at || '—') +
            ' · ' +
            (r.reasonLabel || r.reason) +
            '</strong>' +
            '<span class="card-meta">' +
            (r.short || '') +
            '</span>' +
            deltaHtml +
            '<span class="mono wall-snap-code">' +
            (r.code || '') +
            '</span>' +
            '</div></div>'
        );
      }
      parts.push('</div>');
    }
    parts.push('</div>');
    $('overlay-msg').innerHTML = parts.join('');
    const btn = $('btn-overlay');
    btn.textContent = '關閉';
    btn.onclick = () => {
      hideOverlay();
      if (onClose) onClose();
    };
    $('overlay-extra').innerHTML = '';
    ov.classList.add('show');
    if (onMark) onMark(sawDelta, sawSpark);
  }

  function showAchievements(getSave, onClose) {
    const save = getSave();
    const ov = $('overlay');
    ov.classList.remove('settings-mode');
    ov.classList.add('codex-mode', 'paper-panel');
    $('overlay-title').textContent = '成就／統計';
    const st = saveStats ? saveStats(save) : {};
    const parts = ['<div class="paper-body">'];
    parts.push(
      '<div class="paper-summary tight">' +
        '<div class="paper-row"><span>擊殺</span><strong>' +
        (st.totalKills || 0) +
        '</strong></div>' +
        '<div class="paper-row"><span>無盡</span><strong>' +
        (st.bestEndlessWave || 0) +
        ' 波</strong></div>' +
        '<div class="paper-row"><span>銀帳</span><strong>' +
        (st.totalSilver || 0) +
        '</strong></div>' +
        '<div class="paper-row"><span>主線</span><strong>' +
        (st.maxStageCleared || 0) +
        '/' +
        (st.stagesTotal || 6) +
        '</strong></div>' +
        '<div class="paper-row"><span>本週</span><strong>' +
        (st.weekProgress || (typeof formatWeekProgress === 'function' ? formatWeekProgress(save).label : '—')) +
        '</strong></div>' +
        '<div class="paper-row"><span>連週</span><strong>' +
        (st.weekStreak || 0) +
        '（最佳 ' +
        (st.weekStreakBest || 0) +
        '）</strong></div>' +
        '<div class="paper-row"><span>本地牆</span><strong>' +
        (st.localBest || (typeof formatLocalBestWall === 'function' ? formatLocalBestWall(save).label : '—')) +
        '</strong></div>' +
        '<div class="paper-row"><span>牆短碼</span><strong class="mono">' +
        (typeof encodeWallShort === 'function' ? encodeWallShort(save) : '—') +
        '</strong></div>' +
        '<div class="paper-row"><span>近週通關</span><strong>' +
        (typeof formatLocalBestWall === 'function'
          ? ((formatLocalBestWall(save).history || []).join('、') || '—')
          : '—') +
        '</strong></div>' +
        '<div class="paper-row"><span>近牆快照</span><strong>' +
        (typeof formatLocalBestWall === 'function'
          ? (function () {
              const snaps = formatLocalBestWall(save).snapshots || [];
              return snaps.length
                ? snaps
                    .slice(-4)
                    .map(function (s) {
                      return s.short || s.code;
                    })
                    .join('｜')
                : '—';
            })()
          : '—') +
        '</strong></div>' +
        (typeof formatLocalBestWall === 'function'
          ? (function () {
              const w = formatLocalBestWall(save);
              if (!w.lines) return '';
              return (
                '<div class="wall-grid">' +
                w.lines
                  .map(function (ln) {
                    return (
                      '<div class="wall-cell"><span>' +
                      ln.name +
                      '</span><strong>' +
                      ln.value +
                      '</strong><div class="wp-bar"><i class="wp-fill wall" style="width:' +
                      (ln.pct || 0) +
                      '%"></i></div></div>'
                    );
                  })
                  .join('') +
                '</div>'
              );
            })()
          : '') +
        '</div>'
    );
    const cats = ACHIEVEMENT_CATS || [{ id: 'all', name: '全部' }];
    for (const cat of cats) {
      const list = ACHIEVEMENTS.filter((a) => (a.cat || 'all') === cat.id);
      if (!list.length) continue;
      const done = list.filter((a) => save.unlockedAch && save.unlockedAch[a.id]).length;
      parts.push('<div class="paper-sec">' + cat.name + ' ' + done + '/' + list.length + '</div>');
      for (const a of list) {
        const ok = save.unlockedAch && save.unlockedAch[a.id];
        parts.push(
          '<div class="paper-entry' +
            (ok ? ' done' : ' dim') +
            '"><strong>' +
            (ok ? '✓ ' : '○ ') +
            a.name +
            '</strong><span>' +
            a.blurb +
            '</span></div>'
        );
      }
    }
    const meta = dailyStageMeta();
    parts.push(
      '<div class="paper-note">今日：' +
        meta.name +
        (meta.blurb ? '（' + meta.blurb + '）' : '') +
        '</div></div>'
    );
    $('overlay-msg').innerHTML = parts.join('');
    const btn = $('btn-overlay');
    btn.textContent = '關閉';
    btn.onclick = () => {
      hideOverlay();
      if (onClose) onClose();
    };
    $('overlay-extra').innerHTML = '';
    ov.classList.add('show');
  }


  function ensureWeekProgressEl() {
    let el = $('week-progress');
    if (el) return el;
    const bar = $('stage-bar');
    if (!bar || !bar.parentNode) return null;
    el = document.createElement('div');
    el.id = 'week-progress';
    el.className = 'week-progress';
    el.setAttribute('aria-label', '本週進度');
    bar.parentNode.insertBefore(el, bar.nextSibling);
    return el;
  }

  function refreshWeekProgress(save) {
    const el = ensureWeekProgressEl();
    if (!el || typeof formatWeekProgress !== 'function') return;
    const wp = formatWeekProgress(save || {});
    const dailyPct = Math.min(100, Math.round((wp.dailyN / wp.dailyGoal) * 100));
    const wall = wp.localBest || (typeof formatLocalBestWall === 'function' ? formatLocalBestWall(save || {}) : null);
    const streakPct = Math.min(100, Math.round(((wp.weekStreak || 0) / Math.max(3, wp.weekStreakBest || 3)) * 100));
    el.innerHTML =
      '<div class="wp-row">' +
      '<span class="wp-label">本週進度</span>' +
      '<strong class="wp-text">' +
      wp.short +
      '</strong>' +
      '<span class="wp-meta">' +
      wp.weekKey +
      (wp.dailyDoneToday ? ' · 今日✓' : '') +
      (wp.weeklyDone ? ' · 週✓' : ' · 週未清') +
      ' · 連週' +
      (wp.weekStreak || 0) +
      '</span>' +
      '</div>' +
      '<div class="wp-bar" title="' +
      wp.label.replace(/"/g, '') +
      '">' +
      '<i class="wp-fill" style="width:' +
      dailyPct +
      '%"></i>' +
      '</div>' +
      '<div class="wp-bar wp-bar-streak" title="連續週挑戰">' +
      '<i class="wp-fill streak" style="width:' +
      streakPct +
      '%"></i>' +
      '</div>' +
      '<div class="wp-hint">每日 ' +
      wp.dailyN +
      '/7｜週挑戰' +
      (wp.weeklyDone ? '✓' : '未清') +
      '｜連週 ' +
      (wp.weekStreak || 0) +
      '（最佳 ' +
      (wp.weekStreakBest || 0) +
      '）｜' +
      wp.resetHint +
      '</div>' +
      (wall
        ? '<div class="wp-wall" title="' +
          (wall.label || '').replace(/"/g, '') +
          '"><div class="wp-wall-head"><span class="wp-wall-label">本地最佳牆</span><span class="wp-wall-note">本機｜唔做線上排行</span></div>' +
          '<div class="wp-wall-short">' +
          wall.short +
          '</div>' +
          (wall.lines
            ? '<div class="wp-wall-lines">' +
              wall.lines
                .map(function (ln) {
                  return (
                    '<div class="wp-wall-line"><span>' +
                    ln.name +
                    '</span><strong>' +
                    ln.value +
                    '</strong>' +
                    '<div class="wp-bar wp-bar-wall"><i class="wp-fill wall" style="width:' +
                    (ln.pct || 0) +
                    '%"></i></div></div>'
                  );
                })
                .join('') +
              '</div>'
            : '') +
          '</div>'
        : '');
  }

  function setHint(text) {
    const el = $('hint');
    if (el) el.textContent = text;
  }

  global.YDUI = {
    $,
    toast,
    buildShop,
    buildSpeedBar,
    buildStageBar,
    buildUpgradeBar,
    updateHud,
    showOverlay,
    hideOverlay,
    showSettings,
    showStory,
    showCodex,
    showWallTimeline,
    showQuadTideLesson,
    showAchievements,
    setHint,
    refreshWeekProgress,
    renderLineupChips,
    failTipText,
    avatarHtml,
    LINEUPS,
  };
})(window);
