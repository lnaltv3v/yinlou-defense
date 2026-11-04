/**
 * 銀樓防衛 — HUD／商店／Toast／設定／圖鑑／成就／陣容／存檔／強化 v3.3.0
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
    recordWallCompare,
    formatWallCompareHistory,
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
    const src = (window.YDSprites && window.YDSprites.urlFor) ? window.YDSprites.urlFor(def.id) : ('assets/sprites/' + def.id + '.png?v=3.3.0');
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

  function showStory(title, body, onContinue, opts) {
    opts = opts || {};
    if (opts.rich) {
      const ov = $('overlay');
      ov.classList.remove('settings-mode');
      ov.classList.add('codex-mode', 'paper-panel');
      $('overlay-title').textContent = title;
      const rec = opts.rec;
      let html = '<div class="paper-body">';
      const ban = opts.banner;
      if (ban) {
        html +=
          '<div class="stage-banner card-thick">' +
          '<div class="stage-banner-top">' +
          '<span class="stage-banner-tag">' +
          (ban.tag || '關卡') +
          '</span>' +
          (ban.threat
            ? '<span class="boss-threat">威脅｜' + ban.threat + '</span>'
            : '') +
          '</div>';
        if (ban.beats && ban.beats.length) {
          html += '<div class="stage-banner-beats">';
          for (let i = 0; i < ban.beats.length; i++) {
            html +=
              '<span class="stage-beat">' +
              (i + 1) +
              '. ' +
              ban.beats[i] +
              '</span>';
          }
          html += '</div>';
        }
        if (ban.tip) {
          html += '<div class="boss-counter">口訣｜' + ban.tip + '</div>';
        }
        html += '</div>';
      }
      html +=
        '<p class="story-body">' +
        String(body || '').replace(/\n/g, '<br/>') +
        '</p>';
      if (rec && rec.lineup) {
        html +=
          '<div class="paper-entry card-thick stage-rec-card">' +
          '<strong style="color:#C9A227">本關推薦｜' +
          rec.lineup.name +
          '</strong><span class="card-meta">' +
          (rec.reason || '') +
          '</span>' +
          (rec.lineup.heroes
            ? '<span class="card-meta">' +
              rec.lineup.heroes
                .map(function (id) {
                  return HEROES[id] ? HEROES[id].name : id;
                })
                .join('＋') +
              '</span>'
            : '') +
          (rec.lineup.blurb ? '<em class="lore">' + rec.lineup.blurb + '</em>' : '');
        if (rec.lanes) {
          html +=
            '<div class="lane-tips">' +
            '<span class="lane-chip left">◀ ' +
            (rec.lanes.left || '左帳') +
            '</span>' +
            '<span class="lane-chip right">' +
            (rec.lanes.right || '右帳') +
            ' ▶</span></div>';
        }
        if (rec.tips && rec.tips.length) {
          html += '<ul class="rec-tips">';
          for (let i = 0; i < rec.tips.length; i++) {
            html += '<li>' + rec.tips[i] + '</li>';
          }
          html += '</ul>';
        }
        html += '</div>';
      }
      html +=
        '<p class="paper-note">' +
        (rec && rec.lanes
          ? '左帳上線／右帳下線分路；鎖倉減抽、合星階梯回補銀兩。'
          : '鎖倉減抽、鐵衛頂前；合 2–3 星再開波。') +
        '</p></div>';
      $('overlay-msg').innerHTML = html;
      const btn = $('btn-overlay');
      btn.textContent = '繼續';
      btn.onclick = () => {
        hideOverlay();
        if (onContinue) onContinue();
      };
      $('overlay-extra').innerHTML = '';
      ov.classList.add('show');
      return;
    }
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
    const hudRoot = $('hud');
    if (hudRoot) {
      hudRoot.classList.toggle('dual-ink', !!(state && state._dualInkActive));
    }
    const hpEl = $('stat-hp');
    if (hpEl && hpEl.parentElement) {
      hpEl.parentElement.classList.toggle('dual-ink-stat', !!(state && state._dualInkActive));
      hpEl.parentElement.title = state && state._dualInkActive ? '雙墨同場｜護銀分路' : '';
    }
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
    // v3.3：鏡稅剩餘秒數 HUD
    let taxEl = $('mirage-tax-hud');
    if (!taxEl) {
      taxEl = document.createElement('div');
      taxEl.id = 'mirage-tax-hud';
      taxEl.className = 'mirage-tax-hud';
      taxEl.setAttribute('role', 'status');
      taxEl.setAttribute('aria-live', 'polite');
      const host = $('hud') || $('wrap') || document.body;
      host.appendChild(taxEl);
    }
    const taxT = state && state._mirageTaxT ? state._mirageTaxT : 0;
    if (taxT > 0.05) {
      const secs = Math.ceil(taxT);
      const mul = state._mirageTaxMul || 0.55;
      const pct = Math.round(mul * 100);
      taxEl.textContent = '鏡稅 ' + secs + 's｜擊破銀 ×' + pct + '%';
      taxEl.title = '帳鏡蜃鏡稅剩餘 ' + secs + ' 秒；期間擊破銀兩打折';
      taxEl.classList.add('show');
      taxEl.setAttribute('aria-hidden', 'false');
    } else {
      taxEl.textContent = '';
      taxEl.classList.remove('show');
      taxEl.setAttribute('aria-hidden', 'true');
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

  function fillWallCompareHist(save) {
    const histEl = $('wall-compare-hist');
    if (!histEl) return;
    const rows =
      typeof formatWallCompareHistory === 'function' ? formatWallCompareHistory(save) : [];
    if (!rows.length) {
      histEl.innerHTML = '<span class="card-meta">對照歷史：尚無本機留底</span>';
      return;
    }
    histEl.innerHTML =
      '<strong style="color:#C9A227">對照歷史（本機）</strong><ul class="wall-hist-list">' +
      rows
        .slice(0, 6)
        .map(function (r) {
          return (
            '<li><span class="mono">' +
            (r.localAt || '') +
            '</span> ' +
            (r.summary || '') +
            (r.otherCode ? ' <span class="mono dim">← ' + r.otherCode + '</span>' : '') +
            '</li>'
          );
        })
        .join('') +
      '</ul>';
  }

  function updateTutorialHud(step) {
    let el = $('tutorial-hud');
    if (!el) {
      el = document.createElement('div');
      el.id = 'tutorial-hud';
      el.className = 'tutorial-hud';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      const host = $('wrap') || $('hud') || document.body;
      host.appendChild(el);
    }
    const n = step == null ? 99 : step;
    if (n >= 99) {
      el.classList.remove('show');
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '';
      return;
    }
    const cur = Math.min(5, Math.max(1, (n | 0) + 1));
    let dots = '';
    for (let i = 1; i <= 5; i++) {
      dots +=
        '<button type="button" class="tut-dot' +
        (i < cur ? ' done' : i === cur ? ' cur' : '') +
        '" data-tut-step="' +
        i +
        '" title="跳到第' +
        i +
        '步／復位" aria-label="教學第' +
        i +
        '步"></button>';
    }
    el.innerHTML =
      '<strong>教學 ' +
      cur +
      '/5</strong>' +
      '<div class="tut-dots">' +
      dots +
      '</div>' +
      '<button type="button" class="tut-skip" id="tut-skip-step">跳過本步</button>';
    el.classList.add('show');
    el.setAttribute('aria-hidden', 'false');
    const btn = $('tut-skip-step');
    if (btn) {
      btn.onclick = () => {
        if (window.__yinlouSkipTutorialStep) window.__yinlouSkipTutorialStep();
      };
    }
    el.querySelectorAll('.tut-dot[data-tut-step]').forEach((dot) => {
      dot.onclick = () => {
        const step1 = parseInt(dot.getAttribute('data-tut-step'), 10) || 1;
        if (window.__yinlouSetTutorialStep) window.__yinlouSetTutorialStep(step1 - 1);
      };
    });
  }

  function showFailPanel(opts) {
    opts = opts || {};
    const ov = $('overlay');
    ov.classList.remove('settings-mode');
    ov.classList.add('codex-mode', 'paper-panel', 'fail-panel');
    $('overlay-title').textContent = opts.title || '銀樓失守';
    const rec = opts.rec;
    let html = '<div class="paper-body fail-body"><p class="story-body">' + String(opts.body || '').replace(/\n/g, '<br/>') + '</p>';
    if (rec && rec.lineup) {
      html +=
        '<div class="paper-entry card-thick stage-rec-card fail-rec">' +
        '<strong style="color:#C9A227">重整推薦｜' +
        rec.lineup.name +
        '</strong><span class="card-meta">' +
        (rec.reason || '') +
        '</span>';
      if (rec.tips && rec.tips.length) {
        html += '<ul class="rec-tips">';
        for (let i = 0; i < Math.min(3, rec.tips.length); i++) html += '<li>' + rec.tips[i] + '</li>';
        html += '</ul>';
      }
      html += '</div>';
    }
    html += '<p class="paper-note">重開保留關卡進度帳；跟推薦芯片可快速重整旗鼓。</p></div>';
    $('overlay-msg').innerHTML = html;
    const btn = $('btn-overlay');
    btn.textContent = '重開本關';
    btn.onclick = () => {
      hideOverlay();
      if (opts.onRetry) opts.onRetry();
    };
    const extra = $('overlay-extra');
    extra.innerHTML = '';
    const mk = (label, fn, secondary) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'action-btn' + (secondary ? ' secondary' : '');
      b.textContent = label;
      b.onclick = fn;
      extra.appendChild(b);
    };
    if (opts.onRetryLineup && rec && rec.lineup) {
      mk('用「' + rec.lineup.name + '」再開', () => {
        hideOverlay();
        opts.onRetryLineup();
      }, true);
    }
    if (opts.onMenu) {
      mk('回選關（第 1 關）', () => {
        hideOverlay();
        opts.onMenu();
      }, true);
    }
    ov.classList.add('show');
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
      '<div class="paper-row"><span>版本</span><strong>v3.3.0｜存檔 v' +
      (save.version || 33) +
      '</strong></div>' +
      '<p class="paper-note">v3.3：帳鏡正式圖、鏡稅秒數 HUD、無盡160／五潮同場、教學點步復位、牆對照歷史本機留底。點場上俠客可強化；本地牆本機｜唔做線上排行。</p>' +
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
    if (opts.onReplayTutorial) {
      mk(
        '重播新手五步導引',
        () => {
          opts.onReplayTutorial();
          hideOverlay();
        },
        false,
        true
      );
    }
    if (opts.onSkipTutorialStep) {
      mk(
        '教學：跳過本步',
        () => {
          opts.onSkipTutorialStep();
          showSettings(opts);
        },
        false,
        true
      );
    }
    if (opts.onResetTutorialStep) {
      mk(
        '教學：復位到第①步',
        () => {
          opts.onResetTutorialStep();
          hideOverlay();
        },
        false,
        true
      );
    }
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
        ? 'assets/sprites/' + id + '.png?v=3.3.0'
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
            ' · 入場</strong>' +
            (b.threat
              ? '<span class="boss-threat">威脅｜' + b.threat + '</span>'
              : '') +
            '<span class="card-meta">' +
            (b.entrance || '') +
            '</span>' +
            (b.skill ? '<div class="card-skill">' + b.skill + '</div>' : '') +
            (b.counter
              ? '<div class="boss-counter">對策｜' + b.counter + '</div>'
              : '') +
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
        const bossDef = step.bossId && ENEMIES[step.bossId] ? ENEMIES[step.bossId] : null;
        const thumb = bossDef ? codexThumbHtml(bossDef, 'enemy') : '';
        parts.push(
          '<div class="paper-entry card-thick card-row lesson-step">' +
            thumb +
            '<div class="card-body"><strong style="color:#C9A227">' +
            (step.name || '') +
            '</strong><span>' +
            (step.text || '') +
            '</span></div></div>'
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
      const bossDef = step.bossId && ENEMIES[step.bossId] ? ENEMIES[step.bossId] : null;
      const thumb = bossDef ? codexThumbHtml(bossDef, 'enemy') : '';
      parts.push(
        '<div class="paper-entry card-thick card-row lesson-step">' +
          thumb +
          '<div class="card-body"><strong style="color:#C9A227">' +
          (step.name || '') +
          '</strong><span>' +
          (step.text || '') +
          '</span></div></div>'
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


  function showModifierSheet(mods, tier, onClose) {
    const ov = $('overlay');
    ov.classList.remove('settings-mode');
    ov.classList.add('codex-mode', 'paper-panel');
    const t = tier >= 150 ? '150+' : tier >= 140 ? '140+' : tier >= 100 ? '100+' : tier >= 90 ? '90+' : '本局';
    $('overlay-title').textContent = '修飾說明｜' + t;
    const parts = [
      '<div class="paper-body">',
      '<p class="paper-note">點頂欄修飾條可重開｜晚盤專屬會標 late（90／100／140／150）</p>',
    ];
    for (const m of mods || []) {
      const tag = m.late150 ? '【150+】' : m.late140 ? '【140+】' : m.late100 ? '【100+】' : m.late90 ? '【90+】' : '';
      const icon = m.late150 ? '◈ ' : m.late140 ? '▣ ' : m.late100 ? '⬡ ' : m.late90 ? '◇ ' : '◆ ';
      const col = m.late150 ? '#E8F0FF' : m.late140 ? '#F0E6C8' : m.late100 ? '#E8DCC8' : m.late90 ? '#8A9BB0' : '#C9A227';
      parts.push(
        '<div class="paper-entry card-thick mod-row">' +
          '<strong style="color:' +
          col +
          '"><span class="mod-icon" aria-hidden="true">' +
          icon +
          '</span>' +
          tag +
          (m.name || '') +
          '</strong><span>' +
          (m.blurb || '') +
          '</span></div>'
      );
    }
    if (!(mods || []).length) {
      parts.push('<div class="paper-entry dim card-thick"><strong>無修飾</strong><span>本局平盤</span></div>');
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
        '<div class="paper-entry card-thick wall-spark" id="wall-spark-box">' +
          '<strong style="color:#C9A227">差值走勢</strong>' +
          '<div class="wall-spark-modes" role="tablist">' +
          '<button type="button" class="wall-mode-btn selected" data-mode="endless">本局·無盡</button>' +
          '<button type="button" class="wall-mode-btn" data-mode="week">本週·連週</button>' +
          '<button type="button" class="wall-mode-btn" data-mode="stages">主線</button>' +
          '</div>' +
          '<span class="wall-spark-bars mono" id="wall-spark-bars">' +
          (spark.bars || '') +
          '</span>' +
          '<canvas id="wall-spark-canvas" class="wall-spark-canvas" width="320" height="56" aria-label="牆走勢"></canvas>' +
          '<div class="wall-spark-actions wall-spark-actions-v31">' +
          '<button type="button" class="wall-mode-btn" id="wall-export-png">匯出圖</button>' +
          '<button type="button" class="wall-mode-btn" id="wall-copy-code">複製短碼</button>' +
          '<span class="mono wall-spark-code" id="wall-spark-code">' +
          (typeof encodeWallShort === 'function' ? encodeWallShort(save) : '') +
          '</span></div>' +
          '<div class="wall-compare-box">' +
          '<label class="wall-compare-label" for="wall-compare-input">對照短碼</label>' +
          '<input type="text" id="wall-compare-input" class="wall-compare-input" placeholder="貼上 YL-E…-S…-M…-H…" autocomplete="off" spellcheck="false" />' +
          '<button type="button" class="wall-mode-btn" id="wall-compare-btn">對照</button>' +
          '<button type="button" class="wall-mode-btn" id="wall-compare-copy" disabled>複製摘要</button>' +
          '<div class="wall-compare-result card-meta" id="wall-compare-result">本機對照｜唔上線</div>' +
          '<div class="wall-compare-hist" id="wall-compare-hist"></div>' +
          '</div>' +
          '<span class="card-meta" id="wall-spark-meta">' +
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
    const sparkCv = $('wall-spark-canvas');
    let sparkMode = 'endless';
    const applySparkMode = (mode) => {
      sparkMode = mode || 'endless';
      const box = $('wall-spark-box');
      if (box) {
        box.querySelectorAll('.wall-mode-btn').forEach((b) => {
          b.classList.toggle('selected', b.getAttribute('data-mode') === sparkMode);
        });
      }
      if (sparkCv && spark) drawWallSparkCanvas(sparkCv, spark, sparkMode);
      const barsEl = $('wall-spark-bars');
      const metaEl = $('wall-spark-meta');
      const vals =
        sparkMode === 'week' ? spark.week || [] : sparkMode === 'stages' ? spark.stages || [] : spark.endless || [];
      const chars = '▁▂▃▄▅▆▇█';
      const max = Math.max.apply(null, vals.concat([1]));
      const bars = vals.map((v) => chars[Math.min(7, Math.floor((v / max) * 7))]).join('');
      if (barsEl) barsEl.textContent = bars;
      if (metaEl) {
        const title =
          sparkMode === 'week' ? '連週最佳' : sparkMode === 'stages' ? '主線進度' : '無盡波次';
        metaEl.textContent = title + '（舊→新）｜' + (vals.join('→') || '—');
      }
    };
    if (sparkCv && spark && spark.endless && spark.endless.length) {
      applySparkMode('endless');
      const box = $('wall-spark-box');
      if (box) {
        box.querySelectorAll('.wall-mode-btn[data-mode]').forEach((b) => {
          b.onclick = () => {
            applySparkMode(b.getAttribute('data-mode'));
            if (window.__yinlouMarkWallMode) window.__yinlouMarkWallMode();
          };
        });
      }
      const pngBtn = $('wall-export-png');
      if (pngBtn) {
        pngBtn.onclick = () => {
          try {
            const exportCv = document.createElement('canvas');
            exportCv.width = 640;
            exportCv.height = 160;
            drawWallSparkCanvas(exportCv, spark, sparkMode);
            const ctx2 = exportCv.getContext('2d');
            if (ctx2) {
              ctx2.fillStyle = '#E8DCC8';
              ctx2.font = '12px sans-serif';
              ctx2.textAlign = 'left';
              const code = typeof encodeWallShort === 'function' ? encodeWallShort(save) : '';
              ctx2.fillText('銀樓防衛｜牆走勢（本機） ' + code, 12, 152);
            }
            const a = document.createElement('a');
            a.href = exportCv.toDataURL('image/png');
            a.download = 'yinlou-wall-' + (sparkMode || 'endless') + '.png';
            a.click();
            if (window.__yinlouMarkWallPng) window.__yinlouMarkWallPng();
            toast('已匯出走勢圖（本機）', 2000);
          } catch (err) {
            toast('匯出失敗');
          }
        };
      }
      const codeBtn = $('wall-copy-code');
      if (codeBtn) {
        codeBtn.onclick = () => {
          const code = typeof encodeWallShort === 'function' ? encodeWallShort(save) : '';
          if (!code) {
            toast('無短碼');
            return;
          }
          const done = () => toast('已複製短碼 ' + code, 2200);
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(done).catch(() => {
              prompt('複製短碼', code);
              done();
            });
          } else {
            prompt('複製短碼', code);
            done();
          }
          if (window.__yinlouMarkWallPng) window.__yinlouMarkWallPng();
        };
      }
    }
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

  function drawWallSparkCanvas(canvas, spark, mode) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const m = mode || 'endless';
    const vals =
      m === 'week' ? spark.week || [] : m === 'stages' ? spark.stages || [] : spark.endless || [];
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1A1510';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#5A4030';
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    if (vals.length < 1) return;
    const max = Math.max.apply(null, vals.concat([1]));
    const pad = 8;
    const n = vals.length;
    const gap = (w - pad * 2) / Math.max(1, n);
    const accent = m === 'week' ? '#8A9BB0' : m === 'stages' ? '#3A7A6A' : '#C9A227';
    for (let i = 0; i < n; i++) {
      const bh = Math.max(2, Math.round(((vals[i] || 0) / max) * (h - pad * 2 - 4)));
      const x = pad + i * gap + 2;
      const bw = Math.max(4, gap - 6);
      ctx.fillStyle = i === n - 1 ? accent : m === 'week' ? '#5A6A80' : '#3A7A6A';
      ctx.fillRect(x, h - pad - bh, bw, bh);
    }
    ctx.fillStyle = '#A09070';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    const title = m === 'week' ? '連週最佳（舊→新）' : m === 'stages' ? '主線進度（舊→新）' : '無盡波次（舊→新）';
    ctx.fillText(title, pad, 12);
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
    const cats = [{ id: 'all', name: '全部' }].concat(ACHIEVEMENT_CATS || []);
    const totalDone = ACHIEVEMENTS.filter((a) => save.unlockedAch && save.unlockedAch[a.id]).length;
    const totalAll = ACHIEVEMENTS.length;
    const pctAll = totalAll ? Math.round((totalDone / totalAll) * 100) : 0;
    parts.push(
      '<div class="ach-overview card-thick">' +
        '<div class="ach-overview-row"><strong>成就進度</strong><span>' +
        totalDone +
        '/' +
        totalAll +
        '（' +
        pctAll +
        '%）</span></div>' +
        '<div class="ach-overview-bar" role="progressbar" aria-valuenow="' +
        pctAll +
        '" aria-valuemin="0" aria-valuemax="100"><i style="width:' +
        pctAll +
        '%"></i></div>' +
        '<div class="ach-cat-bars">'
    );
    for (const cat of ACHIEVEMENT_CATS || []) {
      const list = ACHIEVEMENTS.filter((a) => (a.cat || 'all') === cat.id);
      const done = list.filter((a) => save.unlockedAch && save.unlockedAch[a.id]).length;
      const pct = list.length ? Math.round((done / list.length) * 100) : 0;
      parts.push(
        '<button type="button" class="ach-cat-bar" data-ach-jump="' +
          cat.id +
          '" title="直達 ' +
          cat.name +
          '">' +
          '<span>' +
          cat.name +
          ' ' +
          done +
          '/' +
          list.length +
          '</span><div class="ach-overview-bar thin"><i style="width:' +
          pct +
          '%"></i></div></button>'
      );
    }
    parts.push('</div></div>');
    parts.push('<div class="ach-tabs" role="tablist" aria-label="成就分類">');
    for (const cat of cats) {
      parts.push(
        '<button type="button" class="ach-tab' +
          (cat.id === 'all' ? ' selected' : '') +
          '" data-ach-cat="' +
          cat.id +
          '" role="tab">' +
          cat.name +
          '</button>'
      );
    }
    parts.push('</div><div id="ach-list-mount"></div>');
    const meta = dailyStageMeta();
    parts.push(
      '<div class="paper-note">今日：' +
        meta.name +
        (meta.blurb ? '（' + meta.blurb + '）' : '') +
        '｜撳分類標籤篩選</div></div>'
    );
    $('overlay-msg').innerHTML = parts.join('');
    const mount = $('ach-list-mount');
    const renderCat = (catId) => {
      const list =
        catId === 'all'
          ? ACHIEVEMENTS.slice()
          : ACHIEVEMENTS.filter((a) => (a.cat || 'all') === catId);
      const done = list.filter((a) => save.unlockedAch && save.unlockedAch[a.id]).length;
      let html =
        '<div class="paper-sec">' +
        (catId === 'all' ? '全部' : (ACHIEVEMENT_CATS.find((c) => c.id === catId) || {}).name || catId) +
        ' ' +
        done +
        '/' +
        list.length +
        '</div>';
      for (const a of list) {
        const ok = save.unlockedAch && save.unlockedAch[a.id];
        html +=
          '<div class="paper-entry' +
          (ok ? ' done' : ' dim') +
          '"><strong>' +
          (ok ? '✓ ' : '○ ') +
          a.name +
          '</strong><span>' +
          a.blurb +
          '</span></div>';
      }
      if (mount) mount.innerHTML = html;
      document.querySelectorAll('.ach-tab').forEach((b) => {
        b.classList.toggle('selected', b.getAttribute('data-ach-cat') === catId);
        b.setAttribute('aria-selected', b.getAttribute('data-ach-cat') === catId ? 'true' : 'false');
      });
    };
    renderCat('all');
    document.querySelectorAll('.ach-tab').forEach((b) => {
      b.onclick = () => renderCat(b.getAttribute('data-ach-cat'));
    });
    document.querySelectorAll('.ach-cat-bar[data-ach-jump]').forEach((b) => {
      b.onclick = () => {
        const id = b.getAttribute('data-ach-jump');
        renderCat(id);
        const mount = $('ach-list-mount');
        if (mount) mount.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      };
    });

    const cmpBtn = $('wall-compare-btn');
    const cmpIn = $('wall-compare-input');
    const cmpOut = $('wall-compare-result');
    fillWallCompareHist(save);
    if (cmpBtn && cmpIn) {
      const runCmp = () => {
        const other = String(cmpIn.value || '').trim();
        if (!other) {
          if (cmpOut) cmpOut.textContent = '請貼上對方短碼';
          toast('請貼上短碼');
          return;
        }
        const cmp =
          typeof compareWallShort === 'function' ? compareWallShort(save, other) : null;
        if (!cmp || !cmp.ok) {
          const err = (cmp && cmp.error) || '短碼格式唔啱';
          if (cmpOut) cmpOut.textContent = err;
          toast(err);
          return;
        }
        if (typeof recordWallCompare === 'function') {
          recordWallCompare(save, cmp);
          if (window.__yinlouPersistWallCompare) window.__yinlouPersistWallCompare();
        }
        fillWallCompareHist(save);
        if (cmpOut) {
          cmpOut.innerHTML =
            '<strong style="color:#C9A227">' +
            cmp.summary +
            '</strong><br/>' +
            (cmp.note || '本機對照');
        }
        const copyBtn = $('wall-compare-copy');
        if (copyBtn) {
          copyBtn.disabled = false;
          copyBtn.onclick = () => {
            const text =
              '銀樓防衛牆對照｜' +
              cmp.summary +
              '｜' +
              (cmp.note || '本機對照｜唔上線');
            const done = () => {
              if (window.__yinlouMarkWallCompareCopy) window.__yinlouMarkWallCompareCopy();
              toast('已複製對照摘要', 2000);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(done).catch(() => {
                prompt('複製對照摘要', text);
                done();
              });
            } else {
              prompt('複製對照摘要', text);
              done();
            }
          };
        }
        if (window.__yinlouMarkWallCompare) window.__yinlouMarkWallCompare();
        toast(cmp.summary, 2800);
      };
      cmpBtn.onclick = runCmp;
      cmpIn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          runCmp();
        }
      });
    }
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
    showFailPanel,
    updateTutorialHud,
    showStory,
    showCodex,
    showWallTimeline,
    showQuadTideLesson,
    showModifierSheet,
    showAchievements,
    setHint,
    refreshWeekProgress,
    renderLineupChips,
    failTipText,
    avatarHtml,
    LINEUPS,
  };
})(window);
