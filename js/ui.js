/**
 * 銀樓防衛 — HUD／商店／Toast／設定／圖鑑／成就 v0.4.0
 */
(function (global) {
  const {
    HEROES,
    ENEMIES,
    STAGES,
    SPEED_OPTIONS,
    BONDS,
    ACHIEVEMENTS,
    summonCost,
    hkDateString,
    dailyStageMeta,
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
        '<div><strong style="color:' +
        def.color +
        '">' +
        def.name +
        '</strong></div>' +
        '<div style="font-size:10px;opacity:.85">' +
        def.blurb +
        (sk ? ' · ' + sk : '') +
        '</div>' +
        '<div class="cost">銀兩 <span class="cost-num">' +
        def.cost +
        '</span></div>';
      btn.title = def.skill ? def.skill.name + '：' + def.skill.blurb : def.blurb;
      btn.addEventListener('click', () => onSelect(id));
      btn.addEventListener('dragstart', (ev) => {
        if (handlers && handlers.onShopDragStart) handlers.onShopDragStart(id, ev);
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
          const cost = summonCost(id, counts);
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

  function buildStageBar(getSave, onPickStage, onEndless, onDaily) {
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
      btn.className = 'stage-btn';
      btn.dataset.stage = String(st.id);
      btn.textContent = st.id + '. ' + st.name;
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

    return {
      refresh(activeStageId, endless, daily) {
        const save = getSave();
        const today = hkDateString();
        bar.querySelectorAll('.stage-btn').forEach((b) => {
          if (b.classList.contains('endless')) {
            b.classList.toggle('selected', !!endless && !daily);
            b.disabled = save.maxStageCleared < 1;
            return;
          }
          if (b.classList.contains('daily')) {
            b.classList.toggle('selected', !!daily);
            b.disabled = save.maxStageCleared < 1;
            const done = save.dailyDate === today && save.dailyCleared;
            b.textContent = done ? '每日✓' : '每日';
            b.title = done ? '今日已清（可重打無額外獎）' : '今日挑戰';
            return;
          }
          const id = Number(b.dataset.stage);
          const unlocked = id === 1 || save.maxStageCleared >= id - 1;
          b.disabled = !unlocked;
          b.classList.toggle('selected', !endless && !daily && activeStageId === id);
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
    $('stat-stage').textContent = state.endless
      ? '無盡'
      : state.daily
        ? '每日'
        : String(state.stage.id);
    const kills = $('stat-kills');
    if (kills) kills.textContent = String(state.kills || 0);
    const bondEl = $('stat-bonds');
    if (bondEl) {
      const bonds = state._bonds || [];
      bondEl.textContent = bonds.length ? bonds.map((b) => b.name).join('、') : '—';
      bondEl.title = bonds.map((b) => b.name + '：' + b.blurb).join('\n');
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
    $('overlay-title').textContent = title;
    $('overlay-msg').textContent = msg;
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
  }

  function showSettings(opts) {
    const {
      getSave,
      onToggleHints,
      onSkipTutorial,
      onClearSave,
      onClose,
      onRestart,
      onOpenCodex,
      onOpenAch,
    } = opts;
    const save = getSave();
    const ov = $('overlay');
    ov.classList.add('settings-mode');
    ov.classList.remove('codex-mode');
    $('overlay-title').textContent = '設定';
    const achN = Object.keys(save.unlockedAch || {}).length;
    $('overlay-msg').textContent =
      '欄位高亮：' +
      (save.showCellHints !== false ? '開' : '關') +
      '｜教學：' +
      (save.skipTutorial ? '已略過' : '會顯示') +
      '\n羈絆 ' +
      BONDS.length +
      ' 種｜成就 ' +
      achN +
      '/' +
      ACHIEVEMENTS.length;
    const btn = $('btn-overlay');
    btn.textContent = '關閉';
    btn.onclick = () => {
      hideOverlay();
      if (onClose) onClose();
    };
    const extra = $('overlay-extra');
    extra.innerHTML = '';
    const mk = (label, fn, danger, secondary) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'action-btn' + (danger ? ' danger' : secondary ? ' secondary' : '');
      b.textContent = label;
      b.onclick = fn;
      extra.appendChild(b);
    };
    mk(
      save.showCellHints !== false ? '關閉欄位高亮' : '開啟欄位高亮',
      () => {
        onToggleHints();
        showSettings(opts);
      },
      false,
      true
    );
    mk(
      save.skipTutorial ? '重開教學' : '略過教學',
      () => {
        onSkipTutorial();
        showSettings(opts);
      },
      false,
      true
    );
    if (onOpenCodex) mk('打開圖鑑', () => onOpenCodex(), false, true);
    if (onOpenAch) mk('成就一覽', () => onOpenAch(), false, true);
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

  function showCodex(getSave, onClose) {
    const save = getSave();
    const ov = $('overlay');
    ov.classList.remove('settings-mode');
    ov.classList.add('codex-mode');
    $('overlay-title').textContent = '圖鑑';
    const lines = ['【俠客】'];
    for (const id of Object.keys(HEROES)) {
      const def = HEROES[id];
      const seen = save.seenHeroes && save.seenHeroes[id];
      if (seen) {
        lines.push(
          '· ' +
            def.name +
            ' — ' +
            def.blurb +
            (def.skill ? '｜技：' + def.skill.name + '（' + def.skill.blurb + '）' : '')
        );
      } else {
        lines.push('· ？？？ — 尚未召喚');
      }
    }
    lines.push('', '【敵人】');
    for (const id of Object.keys(ENEMIES)) {
      const def = ENEMIES[id];
      const seen = save.seenEnemies && save.seenEnemies[id];
      if (seen) {
        lines.push(
          '· ' +
            def.name +
            ' — HP' +
            def.hp +
            '／攻' +
            def.atk +
            (def.boss ? '（Boss）' : '') +
            '／賞' +
            def.reward
        );
      } else {
        lines.push('· ？？？ — 尚未遭遇');
      }
    }
    $('overlay-msg').textContent = lines.join('\n');
    const btn = $('btn-overlay');
    btn.textContent = '關閉';
    btn.onclick = () => {
      hideOverlay();
      if (onClose) onClose();
    };
    $('overlay-extra').innerHTML = '';
    ov.classList.add('show');
  }

  function showAchievements(getSave, onClose) {
    const save = getSave();
    const ov = $('overlay');
    ov.classList.remove('settings-mode');
    ov.classList.add('codex-mode');
    $('overlay-title').textContent = '成就';
    const lines = [];
    for (const a of ACHIEVEMENTS) {
      const ok = save.unlockedAch && save.unlockedAch[a.id];
      lines.push((ok ? '✓ ' : '○ ') + a.name + ' — ' + a.blurb);
    }
    const meta = dailyStageMeta();
    lines.push('', '今日關卡：' + meta.name + '（' + meta.blurb + '）');
    $('overlay-msg').textContent = lines.join('\n');
    const btn = $('btn-overlay');
    btn.textContent = '關閉';
    btn.onclick = () => {
      hideOverlay();
      if (onClose) onClose();
    };
    $('overlay-extra').innerHTML = '';
    ov.classList.add('show');
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
    updateHud,
    showOverlay,
    hideOverlay,
    showSettings,
    showCodex,
    showAchievements,
    setHint,
  };
})(window);
