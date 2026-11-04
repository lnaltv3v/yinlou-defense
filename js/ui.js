/**
 * 銀樓防衛 — HUD／商店／Toast／設定／圖鑑／成就／陣容／存檔／強化 v1.0.0
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

  /** 商店可讀像素頭像（硬邊色塊，唔用外圖） */
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
    }
    return (
      '<span class="hero-avatar" aria-hidden="true" style="--av:' +
      c +
      '">' +
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
      gear +
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
      btn.className = 'stage-btn' + (st.challenge ? ' challenge' : '');
      btn.dataset.stage = String(st.id);
      btn.textContent = st.id + '. ' + st.name;
      if (st.challenge) btn.title = '挑戰關：盤後暗盤';
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
            const meta = dailyStageMeta(today);
            b.title =
              (done ? '今日已清（可重打無額外獎）｜' : '') +
              meta.name +
              (meta.blurb ? '｜' + meta.blurb : '');
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
    const modShort =
      state.modifiers && state.modifiers.length
        ? '·' + state.modifiers.map((m) => m.name.slice(0, 2)).join('')
        : '';
    $('stat-stage').textContent = state.endless
      ? '無盡' + modShort
      : state.daily
        ? '每日' + modShort
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
      '<p class="paper-note">點場上俠客可強化（刀利／甲厚／內息）。圖鑑／成就請用下方按鈕。</p>' +
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
        parts.push(
          '<div class="paper-entry"><strong style="color:' +
            def.color +
            '">' +
            def.name +
            '</strong><span>' +
            def.blurb +
            (def.skill ? ' · ' + def.skill.name : '') +
            (def.lore ? '<br><em class="lore">' + def.lore + '</em>' : '') +
            '</span></div>'
        );
      } else {
        parts.push('<div class="paper-entry dim"><strong>？？？</strong><span>尚未召喚</span></div>');
      }
    }
    parts.push('<div class="paper-sec">敵人</div>');
    for (const id of Object.keys(ENEMIES)) {
      const def = ENEMIES[id];
      const seen = save.seenEnemies && save.seenEnemies[id];
      if (seen) {
        parts.push(
          '<div class="paper-entry"><strong style="color:' +
            (def.color || '#E8DCC8') +
            '">' +
            def.name +
            '</strong><span>HP' +
            def.hp +
            '／攻' +
            def.atk +
            (def.boss ? ' · Boss' : '') +
            (def.skill ? ' · ' + def.skill.name : '') +
            (def.lore ? '<br><em class="lore">' + def.lore + '</em>' : '') +
            '</span></div>'
        );
      } else {
        parts.push('<div class="paper-entry dim"><strong>？？？</strong><span>尚未遭遇</span></div>');
      }
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
    showAchievements,
    setHint,
    renderLineupChips,
    failTipText,
    avatarHtml,
    LINEUPS,
  };
})(window);
