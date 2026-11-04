/**
 * 銀樓防衛 — HUD／商店／Toast
 */
(function (global) {
  const { HEROES } = global.YD;

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

  function buildShop(onSelect, getSelectedId, getSilver) {
    const shop = $('shop');
    shop.innerHTML = '';
    const ids = Object.keys(HEROES);
    for (const id of ids) {
      const def = HEROES[id];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hero-btn';
      btn.dataset.id = id;
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

  function updateHud(state) {
    $('stat-silver').textContent = Math.floor(state.silver);
    $('stat-hp').textContent = Math.max(0, Math.ceil(state.coreHp));
    $('stat-wave').textContent = state.waveIndex + '/' + state.stage.waves.length;
    $('stat-stage').textContent = state.stage.id;
  }

  function showOverlay(title, msg, btnLabel, onClick) {
    const ov = $('overlay');
    $('overlay-title').textContent = title;
    $('overlay-msg').textContent = msg;
    const btn = $('btn-overlay');
    btn.textContent = btnLabel || '確定';
    btn.onclick = onClick;
    ov.classList.add('show');
  }

  function hideOverlay() {
    $('overlay').classList.remove('show');
  }

  global.YDUI = {
    $,
    toast,
    buildShop,
    updateHud,
    showOverlay,
    hideOverlay,
  };
})(window);
