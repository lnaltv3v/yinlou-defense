/**
 * 銀樓防衛 — HUD／商店／Toast／設定 v0.3.0
 */
(function (global) {
  const { HEROES, STAGES, SPEED_OPTIONS, BONDS, summonCost } = global.YD;

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
      btn.innerHTML =
        '<div><strong style="color:' +
        def.color +
        '">' +
        def.name +
        '</strong></div>' +
        '<div style="font-size:10px;opacity:.85">' +
        def.blurb +
        '</div>' +
        '<div class="cost">銀兩 <span class="cost-num">' +
        def.cost +
        '</span></div>';
      btn.addEventListener('click', () => onSelect(id));
      btn.addEventListener('dragstart', (ev) => {
        if (handlers && handlers.onShopDragStart) handlers.onShopDragStart(id, ev);
      });
      shop.appendChild(btn);
    }

    const waveBtn = document.createElement('button');
    waveBtn.type = 'button';
    waveBtn.className = 'action-btn';
    waveBtn.id = 'btn-wave';
    waveBtn.textContent = '開波';
    shop.appendChild(waveBtn);

    const pauseBtn = document.createElement('button');
    pauseBtn.type = 'button';
    pauseBtn.className = 'action-btn secondary';
    pauseBtn.id = 'btn-pause';
    pauseBtn.textContent = '暫停';
    shop.appendChild(pauseBtn);

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'action-btn danger';
    resetBtn.id = 'btn-reset';
    resetBtn.textContent = '重開本關';
    shop.appendChild(resetBtn);

    const setBtn = document.createElement('button');
    setBtn.type = 'button';
    setBtn.className = 'action-btn secondary';
    setBtn.id = 'btn-settings';
    setBtn.textContent = '設定';
    shop.appendChild(setBtn);

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

  function buildStageBar(getSave, onPickStage, onEndless) {
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

    return {
      refresh(activeStageId, endless) {
        const save = getSave();
        bar.querySelectorAll('.stage-btn').forEach((b) => {
          if (b.classList.contains('endless')) {
            b.classList.toggle('selected', !!endless);
            b.disabled = save.maxStageCleared < 1;
            return;
          }
          const id = Number(b.dataset.stage);
          const unlocked = id === 1 || save.maxStageCleared >= id - 1;
          b.disabled = !unlocked;
          b.classList.toggle('selected', !endless && activeStageId === id);
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
    $('stat-stage').textContent = state.endless ? '無盡' : String(state.stage.id);
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
  }

  function showSettings(opts) {
    const {
      getSave,
      onToggleHints,
      onSkipTutorial,
      onClearSave,
      onClose,
      onRestart,
    } = opts;
    const save = getSave();
    const ov = $('overlay');
    ov.classList.add('settings-mode');
    $('overlay-title').textContent = '設定';
    $('overlay-msg').textContent =
      '簡版設定面板\n' +
      '欄位高亮：' +
      (save.showCellHints !== false ? '開' : '關') +
      '｜教學：' +
      (save.skipTutorial ? '已略過' : '會顯示') +
      '\n羈絆共 ' +
      BONDS.length +
      ' 種（場上齊人自動生效）';
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
    mk('重開本關', () => {
      hideOverlay();
      onRestart();
    }, false, true);
    mk(
      '清除存檔',
      () => {
        if (confirm('確定清除本地存檔？（關卡進度／累計銀兩會冇）')) {
          onClearSave();
          hideOverlay();
        }
      },
      true
    );
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
    setHint,
  };
})(window);
