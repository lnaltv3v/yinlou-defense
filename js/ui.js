/**
 * 銀樓防衛 — HUD／商店／Toast v0.2.0
 */
(function (global) {
  const { HEROES, STAGES, SPEED_OPTIONS } = global.YD;

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
        '<div class="cost">銀兩 ' +
        def.cost +
        '</div>';
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

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'action-btn danger';
    resetBtn.id = 'btn-reset';
    resetBtn.textContent = '重來';
    shop.appendChild(resetBtn);

    return {
      refresh() {
        const sel = getSelectedId();
        const silver = getSilver();
        shop.querySelectorAll('.hero-btn').forEach((btn) => {
          const id = btn.dataset.id;
          const cost = HEROES[id].cost;
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
  }

  function showOverlay(title, msg, btnLabel, onClick, extraBtns) {
    const ov = $('overlay');
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
          b.className = 'action-btn' + (eb.danger ? ' danger' : '');
          b.textContent = eb.label;
          b.onclick = eb.onClick;
          extra.appendChild(b);
        }
      }
    }
    ov.classList.add('show');
  }

  function hideOverlay() {
    $('overlay').classList.remove('show');
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
    setHint,
  };
})(window);
