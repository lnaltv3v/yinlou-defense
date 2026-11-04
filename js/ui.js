/**
 * 銀樓防衛 — HUD／商店／Toast／設定／圖鑑／成就／陣容／存檔／強化 v4.6.0
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
    exportWallCompareHistory,
    exportWallCompareHistoryJson,
    listWallCompareDays,
    clearWallCompareHistory,
    importWallCompareHistory,
    formatWallCompareChart,
    formatEndlessReplay,
    compareEndlessReplay,
    formatEndlessReplayChart,
    formatEndlessReplayMultiChart,
    formatReplayDualRange,
    listDualRangePresets,
    saveDualRangePreset,
    removeDualRangePreset,
    mergeSnapRadius,
    syncMergeSnapDevice,
    loadMergeSnapDevice,
    formatEndlessReplayTimeline,
    formatFailShareText,
    toggleEndlessReplayFav,
    upgradeCharmStar,
    getEquippedCharms,
    charmSetResonance,
    charmSetProgress,
    formatCharmSetDetailHtml,
    listOwnedCharms,
    equipCharm,
    swapCharmSlots,
    getEquippedCharm,
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
    const src = (window.YDSprites && window.YDSprites.urlFor) ? window.YDSprites.urlFor(def.id) : ('assets/sprites/' + def.id + '.png?v=4.2.0');
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
    // v4.3：共鳴 HUD 徽記（可點開明細）
    let badge = $('set-badge-hud');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'set-badge-hud';
      badge.className = 'set-badge-hud';
      badge.setAttribute('role', 'status');
      const host = $('hud') || $('wrap') || document.body;
      host.appendChild(badge);
    }
    const sets = (state && state.activeCharmSets) || [];
    if (sets.length) {
      badge.innerHTML = sets
        .map(function (s) {
          return (
            '<button type="button" class="set-badge' +
            (s.advanced ? ' adv' : '') +
            '" data-set="' +
            (s.set || '') +
            '" title="' +
            (s.blurb || '') +
            '｜點開明細">' +
            (s.advanced ? '◆' : '◇') +
            (s.name || '') +
            '</button>'
          );
        })
        .join('');
      badge.classList.add('show');
      badge.querySelectorAll('[data-set]').forEach(function (btn) {
        btn.onclick = function (ev) {
          ev.stopPropagation();
          showCharmSetDetail(btn.getAttribute('data-set') || '');
        };
      });
      if (sets.some(function (s) { return s.advanced; }) && window.__yinlouMarkSetBadgeHud) {
        window.__yinlouMarkSetBadgeHud();
      }
    } else {
      badge.innerHTML = '';
      badge.classList.remove('show');
    }
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
      const mul = state._mirageTaxMul || 0.58;
      const pct = Math.round(mul * 100);
      const maxT = state._mirageTaxMax || 4.2;
      const frac = Math.max(0, Math.min(1, taxT / maxT));
      const stacks = state._mirageTaxStacks || 1;
      const r = state._mirageTaxR || 150;
      taxEl.innerHTML =
        '<span class="mirage-tax-label">鏡稅圈 ' +
        secs +
        's｜銀×' +
        pct +
        '%' +
        (stacks > 1 ? '｜叠×' + stacks : '') +
        '｜r' +
        r +
        '</span>' +
        '<span class="mirage-tax-bar" aria-hidden="true"><i style="width:' +
        Math.round(frac * 100) +
        '%"></i></span>' +
        (stacks > 1
          ? '<span class="mirage-tax-stacks">叠層見底中</span>'
          : '');
      taxEl.title =
        '鏡稅圈剩餘 ' +
        secs +
        ' 秒；叠層 ×' +
        stacks +
        '；場上橢圓 r≈' +
        r +
        ' 為影響範圍';
      taxEl.classList.toggle('stacked', stacks > 1);
      taxEl.classList.add('show');
      taxEl.setAttribute('aria-hidden', 'false');
    } else {
      taxEl.innerHTML = '';
      taxEl.classList.remove('show', 'stacked');
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


    function renderWallCompareChartHtml(save, dayFilter) {
    const chart =
      typeof formatWallCompareChart === 'function'
        ? formatWallCompareChart(save, { day: dayFilter || null })
        : { bars: [], maxAbs: 1 };
    if (!chart.bars || !chart.bars.length) {
      return '<div class="wall-chart empty"><span class="card-meta">尚無對照 delta 可繪</span></div>';
    }
    const maxAbs = chart.maxAbs || 1;
    const h = 56;
    const barW = 10;
    const gap = 6;
    const n = chart.bars.length;
    const w = Math.max(160, n * (barW * 3 + gap) + 20);
    let svgInner = '';
    svgInner +=
      '<line x1="0" y1="' +
      h / 2 +
      '" x2="' +
      w +
      '" y2="' +
      h / 2 +
      '" stroke="#5A4A38" stroke-width="1"/>';
    chart.bars.forEach(function (b, i) {
      const x0 = 8 + i * (barW * 3 + gap);
      const cols = [
        { v: b.endless, c: '#C9A227', k: '無盡' },
        { v: b.week, c: '#3A7A6A', k: '連週' },
        { v: b.stages, c: '#C45C4A', k: '主線' },
      ];
      const tip =
        (b.label || '') +
        '｜無盡' +
        (b.endless >= 0 ? '+' : '') +
        b.endless +
        ' 連週' +
        (b.week >= 0 ? '+' : '') +
        b.week +
        ' 主線' +
        (b.stages >= 0 ? '+' : '') +
        b.stages +
        (b.summary ? '｜' + b.summary : '');
      cols.forEach(function (col, j) {
        const bh = Math.round((Math.abs(col.v) / maxAbs) * (h / 2 - 2));
        const y = col.v >= 0 ? h / 2 - bh : h / 2;
        svgInner +=
          '<rect class="wall-bar" data-tip="' +
          tip.replace(/"/g, '&quot;') +
          '" data-idx="' +
          i +
          '" x="' +
          (x0 + j * barW) +
          '" y="' +
          y +
          '" width="' +
          (barW - 1) +
          '" height="' +
          Math.max(1, bh) +
          '" fill="' +
          col.c +
          '" opacity="0.85"><title>' +
          tip.replace(/</g, '') +
          '</title></rect>';
      });
    });
    const svg =
      '<svg class="wall-chart-svg" viewBox="0 0 ' +
      w +
      ' ' +
      (h + 18) +
      '" width="100%" height="' +
      (h + 18) +
      '" role="img" aria-label="牆對照圖表">' +
      svgInner +
      '</svg>';
    return (
      '<div class="wall-chart" id="wall-chart-root">' +
      svg +
      '<div class="wall-chart-legend"><span class="c-e">無盡Δ</span><span class="c-w">連週Δ</span><span class="c-m">主線Δ</span>' +
      '<button type="button" class="wall-mode-btn" id="wall-chart-export-svg">匯出 SVG</button>' +
      '<button type="button" class="wall-mode-btn" id="wall-chart-export-png">匯出 PNG</button>' +
      '<button type="button" class="wall-mode-btn" id="wall-chart-share-card">分享卡</button>' +
      '<button type="button" class="wall-mode-btn" id="wall-chart-copy-code">複製短碼</button></div>' +
      '<div class="wall-chart-detail" id="wall-chart-detail">悬停／點柱睇詳情</div></div>'
    );
  }

function fillWallCompareHist(save, dayFilter) {
    const histEl = $('wall-compare-hist');
    if (!histEl) return;
    if (dayFilter === undefined) {
      dayFilter = histEl.getAttribute('data-day') || '';
    } else {
      histEl.setAttribute('data-day', dayFilter || '');
    }
    const days =
      typeof listWallCompareDays === 'function' ? listWallCompareDays(save) : [];
    let rows =
      typeof formatWallCompareHistory === 'function' ? formatWallCompareHistory(save) : [];
    if (dayFilter) {
      rows = rows.filter(function (r) {
        return (r.day || '') === dayFilter;
      });
    }
    const dayChips =
      '<div class="wall-hist-days" role="tablist">' +
      '<button type="button" class="wall-mode-btn' +
      (!dayFilter ? ' selected' : '') +
      '" data-wall-day="">全日</button>' +
      days
        .slice(0, 5)
        .map(function (d) {
          return (
            '<button type="button" class="wall-mode-btn' +
            (dayFilter === d.day ? ' selected' : '') +
            '" data-wall-day="' +
            d.day +
            '">' +
            d.day.slice(5) +
            '(' +
            d.count +
            ')</button>'
          );
        })
        .join('') +
      '</div>';
    const chartHtml = renderWallCompareChartHtml(save, dayFilter);
    const actions =
      '<div class="wall-hist-actions">' +
      '<button type="button" class="wall-mode-btn" id="wall-hist-export">匯出文字</button>' +
      '<button type="button" class="wall-mode-btn" id="wall-hist-json">匯出 JSON</button>' +
      '<button type="button" class="wall-mode-btn" id="wall-hist-thick">加厚短碼</button>' +
      '<button type="button" class="wall-mode-btn" id="wall-hist-import">匯入對照</button>' +
      '<button type="button" class="wall-mode-btn" id="wall-hist-clear"' +
      (rows.length || (save.wallCompareHistory && save.wallCompareHistory.length) ? '' : ' disabled') +
      '>清除歷史</button></div>';
    if (!rows.length) {
      histEl.innerHTML =
        '<strong style="color:#C9A227">對照歷史（本機）</strong>' +
        dayChips +
        chartHtml +
        '<span class="card-meta">此篩選尚無留底</span>' +
        actions;
    } else {
      histEl.innerHTML =
        '<strong style="color:#C9A227">對照歷史（本機）</strong>' +
        dayChips +
        chartHtml +
        '<ul class="wall-hist-list">' +
        rows
          .slice(0, 8)
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
        '</ul>' +
        actions;
    }
    if (window.__yinlouMarkWallChart) window.__yinlouMarkWallChart();
    histEl.querySelectorAll('[data-wall-day]').forEach(function (btn) {
      btn.onclick = function () {
        fillWallCompareHist(save, btn.getAttribute('data-wall-day') || '');
      };
    });
    const copyOut = function (text, mark) {
      const done = function () {
        if (mark && window[mark]) window[mark]();
        toast('已複製', 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          prompt('牆對照歷史', text);
          done();
        });
      } else {
        prompt('牆對照歷史', text);
        done();
      }
    };
    const expBtn = $('wall-hist-export');
    if (expBtn) {
      expBtn.onclick = function () {
        const text =
          typeof exportWallCompareHistory === 'function'
            ? exportWallCompareHistory(save, { day: dayFilter || null })
            : '';
        copyOut(text, '__yinlouMarkWallHistExport');
      };
    }
    const jsonBtn = $('wall-hist-json');
    if (jsonBtn) {
      jsonBtn.onclick = function () {
        const text =
          typeof exportWallCompareHistoryJson === 'function'
            ? exportWallCompareHistoryJson(save, { day: dayFilter || null })
            : '{}';
        copyOut(text, '__yinlouMarkWallHistJson');
      };
    }

    const thickBtn = $('wall-hist-thick');
    if (thickBtn) {
      thickBtn.onclick = function () {
        const code = typeof encodeWallShort === 'function' ? encodeWallShort(save) : '';
        const pack =
          '銀樓防衛牆短碼 v3.7（加厚 A=成就 T=擊殺檔）\n' +
          code +
          '\n' +
          (typeof formatLocalBestWall === 'function' ? formatLocalBestWall(save).label : '');
        copyOut(pack, '__yinlouMarkWallShortThick');
        if (window.__yinlouMarkWallShortThick) window.__yinlouMarkWallShortThick();
      };
    }
    const impBtn = $('wall-hist-import');
    if (impBtn) {
      impBtn.onclick = function () {
        const raw = prompt('貼上牆史 JSON 或含 YL-E… 短碼嘅文字', '');
        if (raw == null || !String(raw).trim()) return;
        const res =
          typeof importWallCompareHistory === 'function'
            ? importWallCompareHistory(save, raw)
            : { ok: false, error: '無匯入函式' };
        if (!res || !res.ok) {
          toast((res && res.error) || '匯入失敗', 2200);
          return;
        }
        if (window.__yinlouMarkWallHistImport) window.__yinlouMarkWallHistImport();
        fillWallCompareHist(save, dayFilter || '');
        if (res.lastCode) {
          const cmpIn = $('wall-compare-input');
          if (cmpIn) cmpIn.value = res.lastCode;
          toast('已匯入 ' + res.added + ' 筆｜已填入對照短碼', 2600);
        } else {
          toast('已匯入 ' + res.added + ' 筆', 2200);
        }
      };
    }
    const clrBtn = $('wall-hist-clear');
    if (clrBtn) {
      clrBtn.onclick = function () {
        if (!(save.wallCompareHistory && save.wallCompareHistory.length)) return;
        if (!confirm('清除本機牆對照歷史？（唔可復原）')) return;
        if (typeof clearWallCompareHistory === 'function') clearWallCompareHistory(save);
        if (window.__yinlouMarkWallHistClear) window.__yinlouMarkWallHistClear();
        fillWallCompareHist(save, '');
        toast('已清除牆對照歷史', 1800);
      };
    }
    // v3.8：牆圖 hover／匯出
    const chartRoot = $('wall-chart-root');
    if (chartRoot) {
      const detail = $('wall-chart-detail');
      chartRoot.querySelectorAll('.wall-bar').forEach(function (bar) {
        const show = function () {
          if (detail) detail.textContent = bar.getAttribute('data-tip') || '';
          if (window.__yinlouMarkWallChartHover) window.__yinlouMarkWallChartHover();
        };
        bar.addEventListener('mouseenter', show);
        bar.addEventListener('click', show);
        bar.addEventListener('focus', show);
      });
      const exp = $('wall-chart-export-svg');
      if (exp) {
        exp.onclick = function () {
          const svgEl = chartRoot.querySelector('svg.wall-chart-svg');
          if (!svgEl) return;
          const clone = svgEl.cloneNode(true);
          clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          const blob = new Blob(
            ['<?xml version="1.0" encoding="UTF-8"?>\\n', clone.outerHTML],
            { type: 'image/svg+xml;charset=utf-8' }
          );
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'yinlou-wall-chart.svg';
          a.click();
          setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
          if (window.__yinlouMarkWallChartExport) window.__yinlouMarkWallChartExport();
          toast('已匯出牆圖 SVG', 1800);
        };
      }
      const expPng = $('wall-chart-export-png');
      const expCard = $('wall-chart-share-card');
      function rasterWallCard(kind) {
        const chart =
          typeof formatWallCompareChart === 'function'
            ? formatWallCompareChart(save, { day: dayFilter || null })
            : { bars: [], maxAbs: 1 };
        const W = kind === 'card' ? 640 : 480;
        const H = kind === 'card' ? 360 : 220;
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1A1510';
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = '#C9A227';
        ctx.lineWidth = 2;
        ctx.strokeRect(8, 8, W - 16, H - 16);
        ctx.fillStyle = '#C9A227';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(kind === 'card' ? '銀樓防衛｜牆影分享卡' : '銀樓防衛｜牆對照圖', 24, 36);
        ctx.fillStyle = '#E8DCC8';
        ctx.font = '12px sans-serif';
        const code = typeof encodeWallShort === 'function' ? encodeWallShort(save) : '';
        ctx.fillText(code || 'YL—', 24, 56);
        if (kind === 'card' && typeof formatLocalBestWall === 'function') {
          const w = formatLocalBestWall(save);
          ctx.fillText((w && (w.short || w.label)) || '', 24, 74);
        }
        const bars = chart.bars || [];
        const maxAbs = chart.maxAbs || 1;
        const mid = H - 100;
        ctx.strokeStyle = '#5A4A38';
        ctx.beginPath();
        ctx.moveTo(24, mid);
        ctx.lineTo(W - 24, mid);
        ctx.stroke();
        const groupW = Math.max(28, (W - 60) / Math.max(1, bars.length));
        bars.forEach(function (b, i) {
          const x0 = 30 + i * groupW;
          const cols = [
            { v: b.endless || 0, c: '#C9A227' },
            { v: b.week || 0, c: '#3A7A6A' },
            { v: b.stages || 0, c: '#C45C4A' },
          ];
          cols.forEach(function (col, j) {
            const bh = Math.round((Math.abs(col.v) / maxAbs) * 50);
            const y = col.v >= 0 ? mid - bh : mid;
            ctx.fillStyle = col.c;
            ctx.fillRect(x0 + j * 8, y, 7, Math.max(2, bh));
          });
        });
        ctx.fillStyle = '#A89070';
        ctx.font = '10px sans-serif';
        ctx.fillText('本機｜唔做線上排行｜v4.2｜短碼見卡面', 24, H - 16);
        canvas.toBlob(function (blob) {
          if (!blob) {
            toast('PNG 匯出失敗', 1800);
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = kind === 'card' ? 'yinlou-wall-card.png' : 'yinlou-wall-chart.png';
          a.click();
          setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
          if (window.__yinlouMarkWallChartPng) window.__yinlouMarkWallChartPng();
          if (window.__yinlouMarkWallChartExport) window.__yinlouMarkWallChartExport();
          toast(kind === 'card' ? '已匯出分享卡 PNG' : '已匯出牆圖 PNG', 1800);
        }, 'image/png');
      }
      if (expPng) expPng.onclick = function () { rasterWallCard('chart'); };
      if (expCard) expCard.onclick = function () { rasterWallCard('card'); };
      const copyCode = $('wall-chart-copy-code');
      if (copyCode) {
        copyCode.onclick = function () {
          const code = typeof encodeWallShort === 'function' ? encodeWallShort(save) : '';
          if (!code) {
            toast('無短碼', 1600);
            return;
          }
          const done = function () {
            if (window.__yinlouMarkWallCodeCopy) window.__yinlouMarkWallCodeCopy();
            toast('已複製牆短碼', 1800);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(done).catch(function () {
              prompt('牆短碼', code);
              done();
            });
          } else {
            prompt('牆短碼', code);
            done();
          }
        };
      }
    }

  }

  function updateTutGestureLive(canvasX, canvasY, active, tutStep) {
    let trail = $('tut-gesture-trail');
    if (!trail) return;
    if (!active) {
      trail.classList.remove('live');
      return;
    }
    trail.classList.add('show', 'live');
    const wrap = $('wrap') || document.body;
    const canvas = $('game');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect ? wrap.getBoundingClientRect() : { left: 0, top: 0 };
    const sx = rect.width / 960;
    const sy = rect.height / 540;
    const left = rect.left - wrapRect.left + canvasX * sx;
    const top = rect.top - wrapRect.top + canvasY * sy;
    trail.style.left = left + 'px';
    trail.style.top = top + 'px';
    trail.style.bottom = 'auto';
    trail.style.transform = 'translate(-50%, -50%)';
    const finger = trail.querySelector('.tut-finger');
    if (finger) {
      finger.style.left = '50%';
      finger.style.top = '50%';
      finger.style.marginLeft = '-9px';
      finger.style.marginTop = '-9px';
      finger.style.animation = 'none';
    }
    const labs = ['放到空格', '拖同種合併', '點選強化', '再開波', '可重開'];
    const lab = trail.querySelector('.tut-gesture-label');
    if (lab) lab.textContent = labs[tutStep | 0] || '跟住手勢';
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
      ['tut-shop-arrow', 'tut-merge-arrow', 'tut-upgrade-arrow', 'tut-wave-arrow', 'tut-settle-arrow', 'tut-gesture-trail'].forEach(function (id) {
        const arrowHide = $(id);
        if (arrowHide) arrowHide.classList.remove('show');
      });
      return;
    }
    const cur = Math.min(5, Math.max(1, (n | 0) + 1));
    const blurbs = [
      '拖底欄俠客到空格',
      '同種同星合併升星',
      '點場上俠客強化',
      '開波守銀樓',
      '失敗可重開／推薦',
    ];
    let dots = '';
    for (let i = 1; i <= 5; i++) {
      dots +=
        '<button type="button" class="tut-dot' +
        (i < cur ? ' done' : i === cur ? ' cur' : '') +
        '" data-tut-step="' +
        i +
        '" title="' +
        blurbs[i - 1] +
        '" aria-label="教學第' +
        i +
        '步：' +
        blurbs[i - 1] +
        '"></button>';
    }
    el.innerHTML =
      '<strong>教學 ' +
      cur +
      '/5</strong>' +
      '<span class="tut-blurb">' +
      blurbs[cur - 1] +
      '</span>' +
      '<div class="tut-dots">' +
      dots +
      '</div>' +
      '<button type="button" class="tut-skip" id="tut-prev-step" title="上一步">←</button>' +
      '<button type="button" class="tut-skip" id="tut-skip-step">跳過本步</button>';
    el.classList.add('show');
    el.setAttribute('aria-hidden', 'false');
    const btn = $('tut-skip-step');
    if (btn) {
      btn.onclick = () => {
        if (window.__yinlouSkipTutorialStep) window.__yinlouSkipTutorialStep();
      };
    }
    const prev = $('tut-prev-step');
    if (prev) {
      prev.disabled = cur <= 1;
      prev.onclick = () => {
        if (window.__yinlouSetTutorialStep) window.__yinlouSetTutorialStep(Math.max(0, cur - 2));
      };
    }
    el.querySelectorAll('.tut-dot[data-tut-step]').forEach((dot) => {
      dot.onclick = () => {
        const step1 = parseInt(dot.getAttribute('data-tut-step'), 10) || 1;
        if (window.__yinlouSetTutorialStep) window.__yinlouSetTutorialStep(step1 - 1);
      };
    });
    // v4.2：教學全五步箭嘴 — ①底欄／②合併／③強化／④開波／⑤結算
    function ensureTutArrow(id, cls, label) {
      let el = $(id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        el.className = cls;
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML =
          '<span class="tut-arrow-stem"></span><span class="tut-arrow-label">' + label + '</span>';
        const host = $('wrap') || document.body;
        host.appendChild(el);
      } else {
        const lab = el.querySelector('.tut-arrow-label');
        if (lab) lab.textContent = label;
      }
      return el;
    }
    const shopArrow = ensureTutArrow('tut-shop-arrow', 'tut-shop-arrow', '① 底欄召俠');
    const mergeArrow = ensureTutArrow('tut-merge-arrow', 'tut-shop-arrow tut-merge-arrow', '② 同種合併升星');
    const upArrow = ensureTutArrow('tut-upgrade-arrow', 'tut-shop-arrow tut-upgrade-arrow', '③ 點場上強化');
    const waveArrow = ensureTutArrow('tut-wave-arrow', 'tut-shop-arrow tut-wave-arrow', '④ 開波守銀樓');
    const settleArrow = ensureTutArrow('tut-settle-arrow', 'tut-shop-arrow tut-settle-arrow', '⑤ 失敗可重開');
    shopArrow.classList.toggle('show', cur === 1);
    mergeArrow.classList.toggle('show', cur === 2);
    upArrow.classList.toggle('show', cur === 3);
    waveArrow.classList.toggle('show', cur === 4);
    settleArrow.classList.toggle('show', cur === 5);
    if (cur === 1 && window.__yinlouMarkTutShopArrow) window.__yinlouMarkTutShopArrow();
    if (cur === 2 && window.__yinlouMarkTutMergeArrow) window.__yinlouMarkTutMergeArrow();
    if (cur === 3 && window.__yinlouMarkTutUpgradeArrow) window.__yinlouMarkTutUpgradeArrow();
    if (cur === 4 && window.__yinlouMarkTutWaveArrow) window.__yinlouMarkTutWaveArrow();
    if (cur === 5 && window.__yinlouMarkTutSettleArrow) window.__yinlouMarkTutSettleArrow();
    // v4.2：合併步手勢軌跡（行動端／觸控示意）
    let trail = $('tut-gesture-trail');
    if (!trail) {
      trail = document.createElement('div');
      trail.id = 'tut-gesture-trail';
      trail.className = 'tut-gesture-trail';
      trail.setAttribute('aria-hidden', 'true');
      trail.innerHTML =
        '<span class="tut-finger"></span><span class="tut-trail-path"></span><span class="tut-gesture-label">拖同種合併</span>';
      const host = $('wrap') || document.body;
      host.appendChild(trail);
    }
    const showTrail = cur >= 1 && cur <= 5;
    const idleLabs = ['放到空格', '拖同種合併', '點選強化', '再開波', '可重開'];
    if (!trail.classList.contains('live')) {
      trail.style.left = '';
      trail.style.top = '';
      trail.style.bottom = '';
      trail.style.transform = '';
      const finger = trail.querySelector('.tut-finger');
      if (finger) finger.style.cssText = '';
      const lab = trail.querySelector('.tut-gesture-label');
      if (lab) lab.textContent = idleLabs[cur - 1] || '跟手教學';
      trail.classList.remove('live');
      // idle position hints per step
      trail.className = 'tut-gesture-trail' + (cur === 2 ? '' : ' tut-g-step' + cur);
    }
    if (!showTrail) trail.classList.remove('show', 'live');
    else trail.classList.add('show');
    if (showTrail && window.__yinlouMarkTutGesture) window.__yinlouMarkTutGesture();
  }


  function showCharmSetDetail(focusSet, getSave) {
    const save =
      typeof getSave === 'function'
        ? getSave()
        : window.__yinlouGetSave
          ? window.__yinlouGetSave()
          : null;
    const ov = $('overlay');
    ov.classList.remove('settings-mode');
    ov.classList.add('codex-mode', 'paper-panel');
    $('overlay-title').textContent = '套裝共鳴明細';
    const html =
      typeof formatCharmSetDetailHtml === 'function'
        ? formatCharmSetDetailHtml(save, focusSet || '')
        : '<p class="card-meta">尚無套裝資料</p>';
    $('overlay-msg').innerHTML = html;
    const btn = $('btn-overlay');
    btn.textContent = '關閉';
    btn.onclick = function () {
      hideOverlay();
    };
    $('overlay-extra').innerHTML = '';
    ov.classList.add('show');
    if (window.__yinlouMarkSetBadgeDetail) window.__yinlouMarkSetBadgeDetail();
    document.querySelectorAll('[data-equip-next]').forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        const id = b.getAttribute('data-equip-next');
        const set = b.getAttribute('data-set') || focusSet || '';
        if (window.__yinlouEquipCharm) {
          const res = window.__yinlouEquipCharm(id);
          if (res && res.ok) {
            if (window.__yinlouMarkSetEquipNext) window.__yinlouMarkSetEquipNext();
            showCharmSetDetail(set, getSave || window.__yinlouGetSave);
          }
        } else {
          toast('裝備介面未就緒', 1600);
        }
      };
    });
    document.querySelectorAll('[data-unequip-slot]').forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        const slot = Number(b.getAttribute('data-unequip-slot'));
        const set = b.getAttribute('data-set') || focusSet || '';
        if (window.__yinlouEquipCharm) {
          const res = window.__yinlouEquipCharm('', slot);
          if (res && res.ok) {
            if (window.__yinlouMarkSetUnequipSwap) window.__yinlouMarkSetUnequipSwap();
            showCharmSetDetail(set, getSave || window.__yinlouGetSave);
          }
        }
      };
    });
    document.querySelectorAll('[data-swap-a]').forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        const a = Number(b.getAttribute('data-swap-a'));
        const bb = Number(b.getAttribute('data-swap-b'));
        const set = b.getAttribute('data-set') || focusSet || '';
        if (window.__yinlouSwapCharmSlots) {
          const res = window.__yinlouSwapCharmSlots(a, bb);
          if (res && res.ok) showCharmSetDetail(set, getSave || window.__yinlouGetSave);
        } else if (typeof swapCharmSlots === 'function') {
          const save2 =
            typeof getSave === 'function'
              ? getSave()
              : window.__yinlouGetSave
                ? window.__yinlouGetSave()
                : null;
          const res = swapCharmSlots(save2, a, bb);
          if (res && res.ok) {
            if (window.__yinlouMarkSetUnequipSwap) window.__yinlouMarkSetUnequipSwap();
            showCharmSetDetail(set, getSave || window.__yinlouGetSave);
          }
        }
      };
    });
    // v4.6：拖曳換欄／長按卸下
    let dragSlot = null;
    document.querySelectorAll('.set-member-row[data-drag-slot]').forEach(function (row) {
      row.addEventListener('dragstart', function (ev) {
        dragSlot = Number(row.getAttribute('data-drag-slot'));
        try {
          ev.dataTransfer.setData('text/plain', String(dragSlot));
          ev.dataTransfer.effectAllowed = 'move';
        } catch (_) {}
        row.classList.add('dragging');
      });
      row.addEventListener('dragend', function () {
        row.classList.remove('dragging');
        dragSlot = null;
      });
      row.addEventListener('dragover', function (ev) {
        ev.preventDefault();
        row.classList.add('drag-over');
      });
      row.addEventListener('dragleave', function () {
        row.classList.remove('drag-over');
      });
      row.addEventListener('drop', function (ev) {
        ev.preventDefault();
        row.classList.remove('drag-over');
        let a = dragSlot;
        try {
          const raw = ev.dataTransfer.getData('text/plain');
          if (raw !== '') a = Number(raw);
        } catch (_) {}
        const b = Number(row.getAttribute('data-drag-slot'));
        const set = row.getAttribute('data-set') || focusSet || '';
        if (a == null || isNaN(a) || isNaN(b) || a === b) return;
        if (window.__yinlouSwapCharmSlots) {
          const res = window.__yinlouSwapCharmSlots(a, b);
          if (res && res.ok) {
            if (window.__yinlouMarkSetDragSwap) window.__yinlouMarkSetDragSwap();
            showCharmSetDetail(set, getSave || window.__yinlouGetSave);
          }
        }
      });
      // 長按卸下（≥520ms）
      let lpTimer = null;
      let lpFired = false;
      const clearLp = function () {
        if (lpTimer) clearTimeout(lpTimer);
        lpTimer = null;
      };
      const startLp = function (ev) {
        if (ev.target && ev.target.closest && ev.target.closest('button')) return;
        lpFired = false;
        clearLp();
        const slot = Number(row.getAttribute('data-drag-slot'));
        const set = row.getAttribute('data-set') || focusSet || '';
        lpTimer = setTimeout(function () {
          lpFired = true;
          if (window.__yinlouEquipCharm) {
            const res = window.__yinlouEquipCharm('', slot);
            if (res && res.ok) {
              if (window.__yinlouMarkSetDragSwap) window.__yinlouMarkSetDragSwap();
              showCharmSetDetail(set, getSave || window.__yinlouGetSave);
            }
          }
        }, 520);
      };
      row.addEventListener('pointerdown', startLp);
      row.addEventListener('pointerup', clearLp);
      row.addEventListener('pointerleave', clearLp);
      row.addEventListener('pointercancel', clearLp);
      row.addEventListener('click', function (ev) {
        if (lpFired) {
          ev.preventDefault();
          ev.stopPropagation();
          lpFired = false;
        }
      });
    });
  }

  function showEndlessReplay(getSave, onClose, filterOpts) {
    filterOpts = filterOpts || {};
    const save = getSave();
    const ov = $('overlay');
    ov.classList.remove('settings-mode');
    ov.classList.add('codex-mode', 'paper-panel');
    $('overlay-title').textContent = '無盡回放列表';
    const favOnly = !!filterOpts.favOnly;
    const minWave = filterOpts.minWave || 0;
    const maxWave = filterOpts.maxWave || 0;
    const scrub = filterOpts.scrub != null ? filterOpts.scrub | 0 : 0;
    const metric = filterOpts.metric || 'multi';
    const rows =
      typeof formatEndlessReplay === 'function'
        ? formatEndlessReplay(save, {
            favOnly: favOnly,
            minWave: minWave || null,
            maxWave: maxWave || null,
          })
        : [];
    let html = '<div class="paper-body endless-replay-page">';
    html +=
      '<div class="replay-filters">' +
      '<button type="button" class="wall-mode-btn' +
      (!favOnly && !minWave && !maxWave ? ' selected' : '') +
      '" data-rf="all">全部</button>' +
      '<button type="button" class="wall-mode-btn' +
      (favOnly ? ' selected' : '') +
      '" data-rf="fav">收藏</button>' +
      '<button type="button" class="wall-mode-btn' +
      (minWave >= 50 && !maxWave ? ' selected' : '') +
      '" data-rf="w50">≥50浪</button>' +
      '<button type="button" class="wall-mode-btn' +
      (minWave >= 100 && maxWave < 200 ? ' selected' : '') +
      '" data-rf="w100">≥100浪</button>' +
      '<button type="button" class="wall-mode-btn' +
      (minWave >= 50 && maxWave === 99 ? ' selected' : '') +
      '" data-rf="r50">50–99</button>' +
      '<button type="button" class="wall-mode-btn' +
      (minWave >= 100 && maxWave === 199 ? ' selected' : '') +
      '" data-rf="r100">100–199</button>' +
      '<button type="button" class="wall-mode-btn' +
      (minWave >= 200 && !maxWave ? ' selected' : '') +
      '" data-rf="w200">≥200浪</button></div>';

    // multi-run line chart (v4.3：銀兩第三指標＋區間篩選)
    const metricMode = filterOpts.metric || 'multi';
    const multi =
      typeof formatEndlessReplayMultiChart === 'function'
        ? formatEndlessReplayMultiChart(save, {
            metric: metricMode,
            metrics:
              metricMode === 'multi'
                ? ['wave', 'kills', 'silver']
                : [metricMode],
            favOnly: favOnly,
            minWave: minWave || null,
            maxWave: maxWave || null,
          })
        : null;
    if (multi && multi.points && multi.points.length >= 2) {
      const W = 280;
      const H = 72;
      const lines = multi.lines || [];
      html +=
        '<div class="replay-multi-chart card-thick">' +
        '<div class="replay-metric-tabs">' +
        '<button type="button" class="wall-mode-btn' +
        (metricMode === 'multi' ? ' selected' : '') +
        '" data-metric="multi">疊加</button>' +
        '<button type="button" class="wall-mode-btn' +
        (metricMode === 'wave' ? ' selected' : '') +
        '" data-metric="wave">浪次</button>' +
        '<button type="button" class="wall-mode-btn' +
        (metricMode === 'kills' ? ' selected' : '') +
        '" data-metric="kills">擊殺</button>' +
        '<button type="button" class="wall-mode-btn' +
        (metricMode === 'silverRain' ? ' selected' : '') +
        '" data-metric="silverRain">銀雨</button>' +
        '<button type="button" class="wall-mode-btn' +
        (metricMode === 'silver' ? ' selected' : '') +
        '" data-metric="silver">銀兩</button>' +
        '<button type="button" class="wall-mode-btn' +
        (metricMode === 'damage' ? ' selected' : '') +
        '" data-metric="damage">傷量</button></div>' +
        '<svg class="replay-line-svg" viewBox="0 0 ' +
        W +
        ' ' +
        H +
        '" width="100%" height="' +
        H +
        '" role="img" aria-label="多局折線">';
      lines.forEach(function (line) {
        const maxV = line.max || 1;
        const pts = line.points || [];
        const step = pts.length > 1 ? (W - 20) / (pts.length - 1) : W;
        let poly = '';
        pts.forEach(function (p, i) {
          const x = 10 + i * step;
          const y = H - 10 - (p.v / maxV) * (H - 20);
          poly += (i ? ' ' : '') + x.toFixed(1) + ',' + y.toFixed(1);
        });
        html +=
          '<polyline fill="none" stroke="' +
          line.color +
          '" stroke-width="2" opacity="0.9" points="' +
          poly +
          '"/>';
        pts.forEach(function (p, i) {
          const x = 10 + i * step;
          const y = H - 10 - (p.v / maxV) * (H - 20);
          html +=
            '<circle cx="' +
            x.toFixed(1) +
            '" cy="' +
            y.toFixed(1) +
            '" r="2.5" fill="' +
            line.color +
            '" opacity="0.85"/>';
        });
      });
      html +=
        '</svg><div class="replay-line-legend">' +
        (lines
          .map(function (l) {
            return '<span style="color:' + l.color + '">● ' + l.name + '</span>';
          })
          .join(' ')) +
        '</div><div class="replay-line-actions">' +
        '<button type="button" class="wall-mode-btn" id="replay-line-export-png">匯出折線 PNG</button>' +
        '<span class="card-meta">多局折線｜左舊右新｜浪次／擊殺／銀兩／傷量</span></div></div>';
      if (window.__yinlouMarkReplayTimeline) window.__yinlouMarkReplayTimeline();
      if (metricMode === 'multi' && window.__yinlouMarkReplayMultiMetric) {
        window.__yinlouMarkReplayMultiMetric();
      }
      if (
        (metricMode === 'silver' || metricMode === 'multi' || maxWave || minWave >= 200) &&
        window.__yinlouMarkReplaySilverMetric
      ) {
        window.__yinlouMarkReplaySilverMetric();
      }
      if (
        (metricMode === 'damage' || metricMode === 'multi') &&
        window.__yinlouMarkReplayDamageMetric
      ) {
        window.__yinlouMarkReplayDamageMetric();
      }
    }

    // v4.4 雙區間對照
    const dualMode = filterOpts.dual || '50-99|100-199';
    const dual =
      typeof formatReplayDualRange === 'function'
        ? (function () {
            const parts = String(dualMode).split('|');
            const parseR = function (s) {
              const m = /^(\d+)-(\d+)$/.exec(s || '');
              return m ? { min: Number(m[1]), max: Number(m[2]) } : null;
            };
            const A = parseR(parts[0]) || { min: 50, max: 99 };
            const B = parseR(parts[1]) || { min: 100, max: 199 };
            return formatReplayDualRange(save, {
              aMin: A.min,
              aMax: A.max,
              bMin: B.min,
              bMax: B.max,
              favOnly: favOnly,
            });
          })()
        : null;
    if (dual && dual.a && dual.b) {
      const d = dual.delta || {};
      html +=
        '<div class="replay-dual-range card-thick">' +
        '<strong style="color:#C9A227">雙區間對照</strong>' +
        '<div class="replay-filters dual-range-tabs">' +
        '<button type="button" class="wall-mode-btn' +
        (dualMode === '50-99|100-199' ? ' selected' : '') +
        '" data-dual="50-99|100-199">50–99 vs 100–199</button>' +
        '<button type="button" class="wall-mode-btn' +
        (dualMode === '100-199|200-9999' ? ' selected' : '') +
        '" data-dual="100-199|200-9999">100–199 vs ≥200</button>' +
        '<button type="button" class="wall-mode-btn' +
        (dualMode === '1-99|100-9999' ? ' selected' : '') +
        '" data-dual="1-99|100-9999">＜100 vs ≥100</button></div>' +
        '<div class="dual-custom-row">' +
        '<label>A <input type="number" id="dual-a-min" min="1" max="9999" value="' +
        (function () {
          const p = String(dualMode).split('|')[0] || '50-99';
          const m = /^(\d+)-(\d+)$/.exec(p);
          return m ? m[1] : '50';
        })() +
        '" class="dual-input"/></label>' +
        '<label>– <input type="number" id="dual-a-max" min="1" max="9999" value="' +
        (function () {
          const p = String(dualMode).split('|')[0] || '50-99';
          const m = /^(\d+)-(\d+)$/.exec(p);
          return m ? m[2] : '99';
        })() +
        '" class="dual-input"/></label>' +
        '<span class="card-meta">vs</span>' +
        '<label>B <input type="number" id="dual-b-min" min="1" max="9999" value="' +
        (function () {
          const p = String(dualMode).split('|')[1] || '100-199';
          const m = /^(\d+)-(\d+)$/.exec(p);
          return m ? m[1] : '100';
        })() +
        '" class="dual-input"/></label>' +
        '<label>– <input type="number" id="dual-b-max" min="1" max="9999" value="' +
        (function () {
          const p = String(dualMode).split('|')[1] || '100-199';
          const m = /^(\d+)-(\d+)$/.exec(p);
          return m ? m[2] : '199';
        })() +
        '" class="dual-input"/></label>' +
        '<button type="button" class="wall-mode-btn" id="dual-custom-apply">套用自訂</button>' +
        '<button type="button" class="wall-mode-btn" id="dual-preset-save">收藏方案</button></div>' +
        (function () {
          const presets =
            typeof listDualRangePresets === 'function' ? listDualRangePresets(save) : [];
          if (!presets.length) return '<p class="card-meta dual-presets-empty">尚未收藏雙區間方案</p>';
          return (
            '<div class="dual-presets-row">' +
            presets
              .map(function (p) {
                return (
                  '<button type="button" class="wall-mode-btn' +
                  (dualMode === p.key ? ' selected' : '') +
                  '" data-dual-preset="' +
                  p.key +
                  '">' +
                  (p.label || p.key) +
                  '</button>' +
                  '<button type="button" class="wall-mode-btn dual-preset-del" data-dual-del="' +
                  p.key +
                  '" title="刪除">×</button>'
                );
              })
              .join('') +
            '</div>'
          );
        })() +
        '<div class="dual-range-grid">' +
        '<div><b>' +
        dual.a.label +
        '</b><span class="card-meta">n=' +
        dual.a.count +
        '</span><div>浪均 ' +
        dual.a.wave +
        '｜殺 ' +
        dual.a.kills +
        '</div><div>銀 ' +
        dual.a.silver +
        '｜傷 ' +
        dual.a.damage +
        '</div></div>' +
        '<div><b>' +
        dual.b.label +
        '</b><span class="card-meta">n=' +
        dual.b.count +
        '</span><div>浪均 ' +
        dual.b.wave +
        '｜殺 ' +
        dual.b.kills +
        '</div><div>銀 ' +
        dual.b.silver +
        '｜傷 ' +
        dual.b.damage +
        '</div></div></div>' +
        '<div class="card-meta">Δ 浪 ' +
        (d.wave >= 0 ? '+' : '') +
        d.wave +
        '｜殺 ' +
        (d.kills >= 0 ? '+' : '') +
        d.kills +
        '｜銀 ' +
        (d.silver >= 0 ? '+' : '') +
        d.silver +
        '｜傷 ' +
        (d.damage >= 0 ? '+' : '') +
        d.damage +
        '</div></div>';
      if (window.__yinlouMarkReplayDamageMetric) window.__yinlouMarkReplayDamageMetric();
    }

    // timeline scrub
    if (rows.length) {
      const idx = Math.max(0, Math.min(rows.length - 1, scrub));
      const focus = rows[idx];
      const prev = rows[idx + 1] || null;
      const cmp =
        typeof compareEndlessReplay === 'function' ? compareEndlessReplay(focus, prev) : null;
      const chart =
        typeof formatEndlessReplayChart === 'function'
          ? formatEndlessReplayChart(focus, prev)
          : null;
      html +=
        '<div class="replay-scrub card-thick">' +
        '<strong style="color:#C9A227">時間線 scrub</strong>' +
        '<input type="range" id="replay-scrub-range" min="0" max="' +
        (rows.length - 1) +
        '" value="' +
        idx +
        '" step="1" aria-label="回放時間線"/>' +
        '<div class="card-meta">#' +
        (idx + 1) +
        '／' +
        rows.length +
        '｜' +
        (focus.label || '') +
        '</div>';
      if (cmp) {
        html += '<div class="replay-grid"><span class="full">' + (cmp.summary || '') + '</span></div>';
      }
      if (chart && chart.bars && chart.bars.length) {
        const maxV = chart.max || 1;
        html += '<div class="replay-cmp-chart" aria-label="回放對照圖">';
        chart.bars.forEach(function (b) {
          const pc = Math.round((b.curr / maxV) * 100);
          const pp = Math.round((b.prev / maxV) * 100);
          html +=
            '<div class="rcc-row"><span>' +
            b.name +
            '</span><div class="rcc-bars">' +
            '<i class="rcc-curr" style="width:' +
            pc +
            '%;background:' +
            b.color +
            '" title="本局 ' +
            b.curr +
            '"></i>' +
            '<i class="rcc-prev" style="width:' +
            pp +
            '%" title="上局 ' +
            b.prev +
            '"></i></div>' +
            '<b>' +
            b.curr +
            '</b><span class="dim">' +
            b.prev +
            '</span></div>';
        });
        html += '</div>';
      }
      html += '</div>';
    }

    if (!rows.length) {
      html += '<p class="card-meta">此篩選尚無回放</p>';
    } else {
      html += '<ul class="endless-replay-list">';
      rows.forEach(function (r, i) {
        html +=
          '<li class="paper-entry' +
          (i === scrub ? ' done' : '') +
          (r.fav ? ' fav' : '') +
          '" data-scrub-li="' +
          i +
          '"><strong>' +
          (i === 0 ? '最新｜' : '#' + (i + 1) + '｜') +
          (r.label || '') +
          '</strong>' +
          '<button type="button" class="wall-mode-btn replay-fav-btn" data-fav-at="' +
          (r.at || '') +
          '">' +
          (r.fav ? '★收藏' : '☆收藏') +
          '</button>' +
          '<span class="card-meta">' +
          (r.bosses || '') +
          (r.mods ? ' · ' + r.mods : '') +
          '</span></li>';
      });
      html += '</ul>';
    }
    html += '<p class="paper-note">本機回放｜唔做線上排行｜v4.5 自訂雙區間／傷量</p></div>';
    $('overlay-msg').innerHTML = html;
    const btn = $('btn-overlay');
    btn.textContent = '關閉';
    btn.onclick = function () {
      hideOverlay();
      if (onClose) onClose();
    };
    $('overlay-extra').innerHTML = '';
    ov.classList.add('show');
    document.querySelectorAll('[data-rf]').forEach(function (b) {
      b.onclick = function () {
        const k = b.getAttribute('data-rf');
        const next = { favOnly: false, minWave: 0, maxWave: 0, metric: metric, scrub: 0, dual: dualMode };
        if (k === 'fav') next.favOnly = true;
        if (k === 'w50') next.minWave = 50;
        if (k === 'w100') next.minWave = 100;
        if (k === 'w200') next.minWave = 200;
        if (k === 'r50') {
          next.minWave = 50;
          next.maxWave = 99;
        }
        if (k === 'r100') {
          next.minWave = 100;
          next.maxWave = 199;
        }
        if ((k === 'r50' || k === 'r100' || k === 'w200') && window.__yinlouMarkReplaySilverMetric) {
          window.__yinlouMarkReplaySilverMetric();
        }
        showEndlessReplay(getSave, onClose, next);
      };
    });
    document.querySelectorAll('[data-metric]').forEach(function (b) {
      b.onclick = function () {
        showEndlessReplay(getSave, onClose, {
          favOnly: favOnly,
          minWave: minWave,
          maxWave: maxWave,
          metric: b.getAttribute('data-metric'),
          scrub: scrub,
          dual: dualMode,
        });
      };
    });
    document.querySelectorAll('[data-dual]').forEach(function (b) {
      b.onclick = function () {
        if (window.__yinlouMarkReplayDamageMetric) window.__yinlouMarkReplayDamageMetric();
        showEndlessReplay(getSave, onClose, {
          favOnly: favOnly,
          minWave: minWave,
          maxWave: maxWave,
          metric: metric,
          scrub: scrub,
          dual: b.getAttribute('data-dual'),
        });
      };
    });
    const dualApply = $('dual-custom-apply');
    if (dualApply) {
      dualApply.onclick = function () {
        const ami = Math.max(1, Number(($('dual-a-min') || {}).value) || 1);
        const ama = Math.max(ami, Number(($('dual-a-max') || {}).value) || ami);
        const bmi = Math.max(1, Number(($('dual-b-min') || {}).value) || 1);
        const bma = Math.max(bmi, Number(($('dual-b-max') || {}).value) || bmi);
        const key = ami + '-' + ama + '|' + bmi + '-' + bma;
        if (window.__yinlouMarkReplayDualCustom) window.__yinlouMarkReplayDualCustom();
        if (window.__yinlouMarkReplayDamageMetric) window.__yinlouMarkReplayDamageMetric();
        showEndlessReplay(getSave, onClose, {
          favOnly: favOnly,
          minWave: minWave,
          maxWave: maxWave,
          metric: metric,
          scrub: scrub,
          dual: key,
        });
      };
    }
    const dualSaveBtn = $('dual-preset-save');
    if (dualSaveBtn) {
      dualSaveBtn.onclick = function () {
        const ami = Math.max(1, Number(($('dual-a-min') || {}).value) || 1);
        const ama = Math.max(ami, Number(($('dual-a-max') || {}).value) || ami);
        const bmi = Math.max(1, Number(($('dual-b-min') || {}).value) || 1);
        const bma = Math.max(bmi, Number(($('dual-b-max') || {}).value) || bmi);
        const key = ami + '-' + ama + '|' + bmi + '-' + bma;
        const label = ami + '–' + ama + ' vs ' + bmi + '–' + bma;
        if (window.__yinlouSaveDualPreset) window.__yinlouSaveDualPreset(key, label);
        else if (typeof saveDualRangePreset === 'function') saveDualRangePreset(save, key, label);
        if (window.__yinlouMarkReplayDualCustom) window.__yinlouMarkReplayDualCustom();
        showEndlessReplay(getSave, onClose, {
          favOnly: favOnly,
          minWave: minWave,
          maxWave: maxWave,
          metric: metric,
          scrub: scrub,
          dual: key,
        });
      };
    }
    document.querySelectorAll('[data-dual-preset]').forEach(function (b) {
      b.onclick = function () {
        const key = b.getAttribute('data-dual-preset');
        showEndlessReplay(getSave, onClose, {
          favOnly: favOnly,
          minWave: minWave,
          maxWave: maxWave,
          metric: metric,
          scrub: scrub,
          dual: key,
        });
      };
    });
    document.querySelectorAll('[data-dual-del]').forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        const key = b.getAttribute('data-dual-del');
        if (window.__yinlouRemoveDualPreset) window.__yinlouRemoveDualPreset(key);
        else if (typeof removeDualRangePreset === 'function') removeDualRangePreset(save, key);
        showEndlessReplay(getSave, onClose, filterOpts);
      };
    });
    const range = $('replay-scrub-range');
    if (range) {
      range.oninput = function () {
        if (window.__yinlouMarkReplayTimeline) window.__yinlouMarkReplayTimeline();
        showEndlessReplay(getSave, onClose, {
          favOnly: favOnly,
          minWave: minWave,
          maxWave: maxWave,
          metric: metric,
          dual: dualMode,
          scrub: Number(range.value) || 0,
        });
      };
    }
    document.querySelectorAll('[data-scrub-li]').forEach(function (li) {
      li.onclick = function (ev) {
        if (ev.target && ev.target.getAttribute('data-fav-at')) return;
        showEndlessReplay(getSave, onClose, {
          favOnly: favOnly,
          minWave: minWave,
          maxWave: maxWave,
          metric: metric,
          dual: dualMode,
          scrub: Number(li.getAttribute('data-scrub-li')) || 0,
        });
      };
    });
    document.querySelectorAll('[data-fav-at]').forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        const at = b.getAttribute('data-fav-at');
        if (window.__yinlouToggleReplayFav) {
          window.__yinlouToggleReplayFav(at);
        } else if (typeof toggleEndlessReplayFav === 'function') {
          toggleEndlessReplayFav(save, at);
        }
        showEndlessReplay(getSave, onClose, filterOpts);
      };
    });
    if (window.__yinlouMarkEndlessReplayList) window.__yinlouMarkEndlessReplayList();
    const linePng = $('replay-line-export-png');
    if (linePng && multi && multi.points && multi.points.length) {
      linePng.onclick = function () {
        const W = 480;
        const H = 220;
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1A1510';
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = '#C9A227';
        ctx.lineWidth = 2;
        ctx.strokeRect(8, 8, W - 16, H - 16);
        ctx.fillStyle = '#C9A227';
        ctx.font = 'bold 16px sans-serif';
        const title =
          (multi.metric === 'multi' ? '疊加' : (multi.lines && multi.lines[0] && multi.lines[0].name) || '折線');
        ctx.fillText('銀樓防衛｜回放折線｜' + title, 24, 36);
        const padL = 36;
        const padR = 24;
        const padT = 56;
        const padB = 40;
        const plotW = W - padL - padR;
        const plotH = H - padT - padB;
        ctx.strokeStyle = '#5A4A38';
        ctx.beginPath();
        ctx.moveTo(padL, padT);
        ctx.lineTo(padL, H - padB);
        ctx.lineTo(W - padR, H - padB);
        ctx.stroke();
        const lines = multi.lines || [];
        lines.forEach(function (line) {
          const pts = line.points || [];
          const maxV = line.max || 1;
          ctx.strokeStyle = line.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          pts.forEach(function (p, i) {
            const x = padL + (pts.length > 1 ? (i / (pts.length - 1)) * plotW : plotW / 2);
            const y = H - padB - (p.v / maxV) * plotH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
          pts.forEach(function (p, i) {
            const x = padL + (pts.length > 1 ? (i / (pts.length - 1)) * plotW : plotW / 2);
            const y = H - padB - (p.v / maxV) * plotH;
            ctx.fillStyle = line.color;
            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fill();
          });
        });
        ctx.fillStyle = '#A89070';
        ctx.font = '10px sans-serif';
        ctx.fillText(
          (lines.map(function (l) { return l.name; }).join('／') || '') + '｜本機｜v4.2',
          24,
          H - 14
        );
        canvas.toBlob(function (blob) {
          if (!blob) {
            toast('折線 PNG 失敗', 1800);
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'yinlou-replay-line.png';
          a.click();
          setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
          if (window.__yinlouMarkReplayLinePng) window.__yinlouMarkReplayLinePng();
          toast('已匯出折線 PNG', 1800);
        }, 'image/png');
      };
    }
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
    if (opts.replay && opts.endless) {
      const r = opts.replay;
      html +=
        '<div class="endless-replay card-thick">' +
        '<strong style="color:#C9A227">無盡結算回放</strong>' +
        '<div class="replay-grid">' +
        '<span>浪次 <b>' +
        (r.wave || 0) +
        '</b></span>' +
        '<span>擊殺 <b>' +
        (r.kills || 0) +
        '</b></span>' +
        '<span>雙五 <b>×' +
        (r.dualPenta || 0) +
        '</b></span>' +
        '<span>鏡稅叠 <b>×' +
        (r.taxStacks || 0) +
        '</b></span>' +
        (r.charm ? '<span>符咒 <b>' + r.charm + '</b></span>' : '') +
        (r.bosses ? '<span class="full">' + r.bosses + '</span>' : '') +
        (r.mods ? '<span class="full dim">' + r.mods + '</span>' : '') +
        '</div></div>';
    }
    if (opts.tutorialSettle) {
      html +=
        '<div class="tut-settle-fail card-thick">' +
        '<strong style="color:#3A7A6A">教學·結算步</strong>' +
        '<span class="card-meta">失守即結算：睇擊殺／浪次／推薦陣容，再撳重開或跟芯片。箭嘴指向嘅就係呢一步。</span></div>';
    }
    html +=
      '<div class="fail-actions-hint card-thick">' +
      '<strong style="color:#C9A227">下一步</strong>' +
      '<span class="card-meta">① 重開本關　② 跟推薦芯片重整　③ 回選關　④ 無盡可睇回放時間線</span></div>' +
      '<p class="paper-note">重開保留關卡進度帳；跟推薦芯片可快速重整旗鼓｜v4.2 結算面板</p></div>';
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
    if (opts.onOpenReplay) {
      mk('無盡回放列表', () => {
        opts.onOpenReplay();
      }, true);
    }
    if (opts.onShareFail) {
      mk('一鍵分享', () => {
        opts.onShareFail();
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
      onEndlessReplay,
      onEquipCharm,
      onUpgradeCharm,
    } = opts;
    opts.onUpgradeCharm = onUpgradeCharm;
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
      '<div class="paper-row"><span>符咒</span><strong>' +
      (function () {
        const list = typeof listOwnedCharms === 'function' ? listOwnedCharms(save) : [];
        const owned = list.filter(function (c) { return c.owned; });
        const eq = owned.filter(function (c) { return c.equipped; });
        const sets = typeof charmSetResonance === 'function' ? charmSetResonance(save) : [];
        const eqLab = eq.length
          ? eq.map(function (c) { return c.name + '★' + c.star; }).join('·')
          : '未裝備';
        const setLab = sets.length ? '｜共鳴 ' + sets.map(function (s) { return s.name; }).join('·') : '';
        return eqLab + setLab + '｜庫 ' + owned.length + '/' + (list.length || 4);
      })() +
      '</strong></div>' +
      '<div class="paper-row"><span>吸附</span><strong>' +
      (save.mergeSnapPx != null ? save.mergeSnapPx + 'px' : ({ off: '關', low: '低', mid: '中', high: '高' }[save.mergeSnapSens || 'mid'] || '中')) +
      ' · buzz ' +
      (save.mergeSnapBuzz !== false ? '開' : '關') +
      '</strong></div>' +
      '<div class="paper-row"><span>版本</span><strong>v4.6.0｜存檔 v' +
      (save.version || 46) +
      '</strong></div>' +
      '<p class="paper-note">v4.6：十八池1150–1200、超千浪 Boss 輪換、拖曳／長按卸、雙區間收藏、吸附滑桿（裝置記憶）。本地牆本機｜唔做線上排行。</p>' +
      '<div id="charm-equip-bar" class="charm-equip-bar"></div>' +
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
    mk(
      '合吸附：' + ({ off: '關', low: '低', mid: '中', high: '高' }[save.mergeSnapSens || 'mid'] || '中'),
      () => {
        if (window.__yinlouCycleMergeSnapSens) window.__yinlouCycleMergeSnapSens();
        else {
          const order = ['off', 'low', 'mid', 'high'];
          const i = order.indexOf(save.mergeSnapSens || 'mid');
          save.mergeSnapSens = order[(i + 1) % order.length];
        }
        showSettings(opts);
      },
      false,
      true
    );
    mk(
      save.mergeSnapBuzz !== false ? '吸附 buzz：開' : '吸附 buzz：關',
      () => {
        if (window.__yinlouToggleMergeSnapBuzz) window.__yinlouToggleMergeSnapBuzz();
        else save.mergeSnapBuzz = save.mergeSnapBuzz === false;
        showSettings(opts);
      },
      false,
      true
    );
    (function () {
      const wrap = document.createElement('div');
      wrap.className = 'snap-slider-row';
      const lab = document.createElement('label');
      lab.textContent = '吸附靈敏度 ';
      const val = document.createElement('span');
      val.id = 'snap-px-val';
      const cur =
        save.mergeSnapPx != null
          ? save.mergeSnapPx
          : ({ off: 0, low: 40, mid: 70, high: 100 }[save.mergeSnapSens || 'mid'] || 70);
      val.textContent = cur <= 0 ? '關' : cur + 'px';
      const inp = document.createElement('input');
      inp.type = 'range';
      inp.min = '0';
      inp.max = '120';
      inp.step = '5';
      inp.value = String(cur);
      inp.id = 'merge-snap-px';
      inp.oninput = function () {
        const px = Number(inp.value) || 0;
        val.textContent = px <= 0 ? '關' : px + 'px';
      };
      inp.onchange = function () {
        const px = Number(inp.value) || 0;
        if (window.__yinlouSetMergeSnapPx) window.__yinlouSetMergeSnapPx(px);
        else {
          save.mergeSnapPx = px;
          if (typeof syncMergeSnapDevice === 'function') syncMergeSnapDevice(save);
        }
        showSettings(opts);
      };
      lab.appendChild(val);
      wrap.appendChild(lab);
      wrap.appendChild(inp);
      extra.appendChild(wrap);
    })();
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
    if (onEndlessReplay) mk('無盡回放列表', () => onEndlessReplay(), false, true);
    // v4.2 符咒三欄＋升星＋套裝共鳴
    (function wireCharmBar() {
      const bar = $('charm-equip-bar');
      if (!bar || typeof listOwnedCharms !== 'function') return;
      const list = listOwnedCharms(save);
      const slots = (save.equippedCharmIds && save.equippedCharmIds.length) || (save.equippedCharmId ? 1 : 0);
      const sets = typeof charmSetResonance === 'function' ? charmSetResonance(save) : [];
      let html =
        '<div class="charm-equip-label">雙五符咒／飾品（最多三欄｜升星★1–3｜套裝共鳴｜下一局入修飾欄）｜已裝 ' +
        slots +
        '/3</div>';
      if (sets.length) {
        html +=
          '<div class="charm-set-active">' +
          sets
            .map(function (s) {
              return '✦ ' + s.name + '｜' + s.blurb;
            })
            .join('<br/>') +
          '</div>';
      }
      html += '<div class="charm-chips">';
      html +=
        '<button type="button" class="wall-mode-btn' +
        (!slots ? ' selected' : '') +
        '" data-charm="">全卸</button>';
      list.forEach(function (c) {
        const stars = c.star > 0 ? '★'.repeat(c.star) : '';
        const setMark = c.set === 'mirror' ? '鏡' : c.set === 'ward' ? '護' : '';
        html +=
          '<button type="button" class="wall-mode-btn' +
          (c.equipped ? ' selected' : '') +
          (c.owned ? '' : ' dim') +
          '" data-charm="' +
          c.id +
          '"' +
          (c.owned ? '' : ' disabled title="尚未解鎖"') +
          '>' +
          (c.kind === 'debuff' ? '⚠' : '✦') +
          c.name +
          stars +
          (setMark ? '·' + setMark : '') +
          (c.equipped ? '·' + (c.slot + 1) : '') +
          '</button>';
        if (c.owned && c.star < 3) {
          html +=
            '<button type="button" class="wall-mode-btn charm-up" data-charm-up="' +
            c.id +
            '" title="升星">▲</button>';
        }
      });
      html += '</div>';
      bar.innerHTML = html;
      bar.querySelectorAll('[data-charm]').forEach(function (b) {
        b.onclick = function () {
          const id = b.getAttribute('data-charm') || '';
          if (onEquipCharm) onEquipCharm(id);
          showSettings(opts);
        };
      });
      bar.querySelectorAll('[data-charm-up]').forEach(function (b) {
        b.onclick = function () {
          const id = b.getAttribute('data-charm-up');
          if (opts.onUpgradeCharm) opts.onUpgradeCharm(id);
          else if (window.__yinlouUpgradeCharm) window.__yinlouUpgradeCharm(id);
          showSettings(opts);
        };
      });
    })();

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
        ? 'assets/sprites/' + id + '.png?v=4.2.0'
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
    parts.push('</div>');
    // v3.7 成就徽章牆
    parts.push('<div class="ach-badge-wall" aria-label="成就徽章牆">');
    const unlocked = ACHIEVEMENTS.filter((a) => save.unlockedAch && save.unlockedAch[a.id]);
    const showBadges = unlocked.length ? unlocked : ACHIEVEMENTS.slice(0, 12);
    for (const a of showBadges.slice(0, 36)) {
      const ok = save.unlockedAch && save.unlockedAch[a.id];
      const initial = (a.name || '?').slice(0, 1);
      parts.push(
        '<span class="ach-badge' +
          (ok ? ' lit' : ' dim') +
          '" title="' +
          a.name +
          ' — ' +
          a.blurb +
          '">' +
          initial +
          '</span>'
      );
    }
    if (!unlocked.length) {
      parts.push('<span class="card-meta">尚未解鎖徽章 — 亮起後會排成牆</span>');
    }
    parts.push('</div></div>');
    if (window.__yinlouMarkAchBadgeWall) window.__yinlouMarkAchBadgeWall();
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
    showCharmSetDetail,
    showSettings,
    showFailPanel,
    updateTutGestureLive,
    showEndlessReplay,
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
