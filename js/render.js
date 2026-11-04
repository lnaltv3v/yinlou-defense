/**
 * 銀樓防衛 — Canvas 繪製 v0.3.0
 * 剪影辨識、欄位高亮、合併／滿星特效
 */
(function (global) {
  const { COLORS, GRID, CORE, HEROES } = global.YD;

  function drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function drawBackground(ctx, w, h) {
    drawPixelRect(ctx, 0, 0, w, h, '#2A241C');
    ctx.globalAlpha = 0.08;
    for (let y = 0; y < h; y += 4) {
      drawPixelRect(ctx, 0, y, w, 1, COLORS.paper);
    }
    ctx.globalAlpha = 1;

    const floorTop = GRID.originY - 8;
    const floorBot = GRID.originY + GRID.lanes * (GRID.cellH + GRID.gapY) + 4;
    drawPixelRect(ctx, 40, floorTop, w - 60, floorBot - floorTop, '#3A3228');
    for (let y = floorTop; y < floorBot; y += 16) {
      for (let x = 40; x < w - 20; x += 24) {
        const shade = ((x + y) / 16) & 1 ? '#4A4034' : '#353028';
        drawPixelRect(ctx, x, y, 22, 14, shade);
        drawPixelRect(ctx, x, y, 22, 1, '#2A241C');
        drawPixelRect(ctx, x, y, 1, 14, '#2A241C');
        if ((x * 13 + y * 7) % 17 === 0) {
          drawPixelRect(ctx, x + 8, y + 6, 2, 2, '#3A5A40');
        }
      }
    }

    for (let i = 0; i < 8; i++) {
      ctx.globalAlpha = 0.04 + i * 0.02;
      drawPixelRect(ctx, w - 40 - i * 6, floorTop, 8, floorBot - floorTop, '#1A1510');
    }
    ctx.globalAlpha = 1;
  }

  function drawCore(ctx, state) {
    const { x, y } = CORE;
    const hp = state.coreHp;
    const maxHp = state.coreMax;
    const flash = state.coreHitFlash || 0;

    drawPixelRect(ctx, x - 34, y - 50, 68, 90, flash > 0 ? '#7A4030' : '#5A4030');
    drawPixelRect(ctx, x - 38, y - 58, 76, 12, '#C45C4A');
    drawPixelRect(ctx, x - 20, y - 30, 16, 20, '#E8DCC8');
    drawPixelRect(ctx, x + 6, y - 30, 16, 20, '#E8DCC8');
    drawPixelRect(ctx, x - 10, y + 10, 20, 28, '#2A241C');
    drawPixelRect(ctx, x - 22, y - 72, 44, 14, '#C9A227');
    ctx.fillStyle = '#1A1510';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('銀樓', x, y - 62);

    if (flash > 0) {
      ctx.globalAlpha = Math.min(0.55, flash * 2);
      drawPixelRect(ctx, x - 42, y - 80, 84, 140, '#C45C4A');
      ctx.globalAlpha = 1;
    }

    const bw = 70;
    const ratio = Math.max(0, hp / maxHp);
    drawPixelRect(ctx, x - bw / 2, y + 48, bw, 8, '#1A1510');
    drawPixelRect(ctx, x - bw / 2, y + 48, bw * ratio, 8, ratio > 0.3 ? '#3A7A6A' : '#C45C4A');
    ctx.fillStyle = COLORS.paper;
    ctx.font = '11px sans-serif';
    ctx.fillText(Math.max(0, Math.ceil(hp)) + '/' + maxHp, x, y + 70);
  }

  /** 簡易剪影：帽／刀／盾／杖／鼓等（下輪可換正式 PNG） */
  function drawSilhouette(ctx, h, def, s) {
    const kind = def.silhouette || def.role;
    const ink = '#1A1510';
    const paper = '#E8DCC8';
    // 身體主色塊
    drawPixelRect(ctx, h.x - s, h.y - s - 4, s * 2, s * 2 + 8, def.color);
    // 頭
    drawPixelRect(ctx, h.x - 8, h.y - s - 16, 16, 14, paper);
    drawPixelRect(ctx, h.x - 5, h.y - s - 12, 3, 3, ink);
    drawPixelRect(ctx, h.x + 2, h.y - s - 12, 3, 3, ink);

    if (kind === 'blade' || kind === 'melee') {
      // 闊刀向右
      drawPixelRect(ctx, h.x + s - 2, h.y - 10, 4, 22, ink);
      drawPixelRect(ctx, h.x + s + 2, h.y - 14, 10, 6, '#E8DCC8');
      drawPixelRect(ctx, h.x + s + 2, h.y - 12, 14, 3, def.color);
    } else if (kind === 'sword' || kind === 'ranged') {
      // 細劍斜上
      drawPixelRect(ctx, h.x + s - 4, h.y - s - 8, 3, 20, ink);
      drawPixelRect(ctx, h.x + s - 6, h.y - 2, 8, 3, '#C9A227');
      // 斗笠
      drawPixelRect(ctx, h.x - 12, h.y - s - 20, 24, 5, ink);
      drawPixelRect(ctx, h.x - 6, h.y - s - 24, 12, 5, '#5A4030');
    } else if (kind === 'staff' || kind === 'aoe') {
      drawPixelRect(ctx, h.x - s - 6, h.y - s - 10, 4, 28, ink);
      drawPixelRect(ctx, h.x - s - 10, h.y - s - 14, 12, 8, '#5A4060');
      // 光頭點
      drawPixelRect(ctx, h.x - 6, h.y - s - 18, 12, 4, paper);
    } else if (kind === 'hat' || kind === 'support') {
      // 斗笠＋藥葫蘆
      drawPixelRect(ctx, h.x - 14, h.y - s - 20, 28, 6, ink);
      drawPixelRect(ctx, h.x - 7, h.y - s - 26, 14, 7, '#3A7A6A');
      drawPixelRect(ctx, h.x - s - 8, h.y + 2, 7, 10, '#C45C4A');
      drawPixelRect(ctx, h.x - s - 6, h.y, 3, 3, '#C9A227');
    } else if (kind === 'shield' || kind === 'tank') {
      drawPixelRect(ctx, h.x - s - 10, h.y - 8, 10, 18, '#8A8070');
      drawPixelRect(ctx, h.x - s - 8, h.y - 4, 6, 10, '#C9A227');
      drawPixelRect(ctx, h.x + s - 2, h.y - 4, 6, 14, ink);
      // 盔
      drawPixelRect(ctx, h.x - 10, h.y - s - 20, 20, 6, '#6A6055');
    } else if (kind === 'dagger' || kind === 'assassin') {
      drawPixelRect(ctx, h.x + s - 4, h.y - 6, 3, 12, ink);
      drawPixelRect(ctx, h.x + s - 2, h.y - 10, 8, 3, '#A04040');
      drawPixelRect(ctx, h.x - 10, h.y - s - 20, 20, 4, ink);
      // 面巾
      drawPixelRect(ctx, h.x - 7, h.y - s - 8, 14, 5, '#1A1510');
    } else if (kind === 'drum' || kind === 'buffer') {
      drawPixelRect(ctx, h.x - 10, h.y + 6, 20, 12, '#C9A227');
      drawPixelRect(ctx, h.x - 8, h.y + 8, 16, 8, '#5A4030');
      drawPixelRect(ctx, h.x + s - 2, h.y - 12, 3, 16, ink);
      // 官帽
      drawPixelRect(ctx, h.x - 10, h.y - s - 22, 20, 6, '#C9A227');
      drawPixelRect(ctx, h.x - 4, h.y - s - 28, 8, 6, '#C45C4A');
    } else if (kind === 'hook' || kind === 'hunter') {
      drawPixelRect(ctx, h.x + s - 4, h.y - 14, 4, 20, ink);
      drawPixelRect(ctx, h.x + s, h.y - 16, 10, 4, '#8A5040');
      drawPixelRect(ctx, h.x + s + 8, h.y - 14, 4, 8, ink);
      drawPixelRect(ctx, h.x - 12, h.y - s - 20, 24, 5, ink);
    }
  }

  function cellHighlightStyle(state, lane, slot) {
    if (!state.showCellHints && state.showCellHints !== undefined) {
      // 由 game 傳 showCellHints；預設開
    }
    const show = state.showCellHints !== false;
    if (!show) return null;

    const occ = state.heroes.find((h) => h.lane === lane && h.slot === slot);
    // 拖曳 hover 優先
    if (state.drag && state.drag.hoverLane === lane && state.drag.hoverSlot === slot) {
      return state.drag.validHover ? 'valid' : 'invalid';
    }
    if (state.selectedShopId) {
      if (!occ) return 'place';
      return null;
    }
    if (state.mergeFromUid) {
      const from = state.heroes.find((h) => h.uid === state.mergeFromUid);
      if (!from) return null;
      if (!occ) return 'move';
      if (occ.uid !== from.uid && from.id === occ.id && from.star === occ.star && from.star < 3) {
        return 'merge';
      }
      return null;
    }
    return null;
  }

  function drawGrid(ctx, state) {
    const heroes = state.heroes;
    const selectedUid = state.selectedHeroUid;
    const mergeFromUid = state.mergeFromUid;
    const drag = state.drag;
    const t = (state._animT || 0);

    for (let lane = 0; lane < GRID.lanes; lane++) {
      for (let slot = 0; slot < GRID.slots; slot++) {
        const x = GRID.originX + slot * (GRID.cellW + GRID.gapX);
        const y = GRID.originY + lane * (GRID.cellH + GRID.gapY);
        let bg = '#2E2820';
        const hl = cellHighlightStyle(state, lane, slot);
        if (hl === 'valid' || hl === 'place' || hl === 'move') {
          const pulse = 0.5 + 0.5 * Math.sin(t * 6);
          bg = hl === 'place' || hl === 'valid' ? (pulse > 0.45 ? '#3A4A38' : '#344438') : '#3A4048';
        } else if (hl === 'merge') {
          const pulse = 0.5 + 0.5 * Math.sin(t * 8);
          bg = pulse > 0.4 ? '#4A4030' : '#3A3428';
        } else if (hl === 'invalid') {
          bg = '#4A3030';
        }
        drawPixelRect(ctx, x, y, GRID.cellW, GRID.cellH, bg);
        ctx.strokeStyle = hl === 'merge' ? '#C9A227' : hl === 'place' || hl === 'valid' ? '#3A7A6A' : '#4A4034';
        ctx.lineWidth = hl ? 3 : 2;
        ctx.strokeRect(x + 1, y + 1, GRID.cellW - 2, GRID.cellH - 2);
        if (slot === GRID.slots - 1) {
          drawPixelRect(ctx, x + GRID.cellW - 6, y + 4, 3, GRID.cellH - 8, '#3A7A6A');
        }
      }
    }
    for (const h of heroes) {
      if (drag && drag.active && drag.heroUid === h.uid) continue;
      drawHero(ctx, h, h.uid === selectedUid, h.uid === mergeFromUid, false, state);
    }
  }

  function drawHero(ctx, h, selected, mergeMark, ghost, state) {
    const def = h.def || HEROES[h.id];
    const s = 10 + h.star * 2;
    const alpha = ghost ? 0.7 : 1;
    ctx.globalAlpha = alpha;
    if (h.hitFlash > 0 && !ghost) {
      ctx.globalAlpha = alpha * (0.55 + Math.sin(h.hitFlash * 40) * 0.25);
    }
    drawPixelRect(ctx, h.x - 14, h.y + 18, 28, 6, 'rgba(0,0,0,0.35)');

    // 滿星光暈
    if (h.star >= 3 && !ghost) {
      const pulse = 0.35 + 0.25 * Math.sin((((state && state._animT) || 0) * 5));
      ctx.globalAlpha = alpha * pulse;
      drawPixelRect(ctx, h.x - s - 6, h.y - s - 22, s * 2 + 12, s * 2 + 40, '#C9A227');
      ctx.globalAlpha = alpha;
    }

    drawSilhouette(ctx, h, def, s);

    // buff 標記
    if (h.atkBuffT > 0 && !ghost) {
      drawPixelRect(ctx, h.x + s + 2, h.y - s - 18, 6, 6, '#C9A227');
    }

    ctx.fillStyle = h.star >= 3 ? COLORS.gold : COLORS.silver;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★'.repeat(h.star), h.x, h.y + 30);

    if (!ghost) {
      const bw = 36;
      drawPixelRect(ctx, h.x - bw / 2, h.y - s - 26, bw, 4, '#1A1510');
      drawPixelRect(ctx, h.x - bw / 2, h.y - s - 26, bw * (h.hp / h.maxHp), 4, '#3A7A6A');
    }

    if (selected || mergeMark) {
      ctx.strokeStyle = mergeMark ? COLORS.gold : COLORS.cinnabar;
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x - s - 6, h.y - s - 24, s * 2 + 12, s * 2 + 42);
    }
    if (h.star >= 3) {
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x - s - 3, h.y - s - 8, s * 2 + 6, s * 2 + 14);
      // 角標 MAX
      ctx.fillStyle = COLORS.gold;
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('滿', h.x, h.y - s - 30);
    }
    ctx.globalAlpha = 1;
  }

  function drawEnemy(ctx, e) {
    const r = e.radius;
    if (e.hitFlash > 0) ctx.globalAlpha = 0.55 + Math.sin(e.hitFlash * 50) * 0.3;
    drawPixelRect(ctx, e.x - r, e.y - r, r * 2, r * 2, e.def.color);
    if (e.mode === 'fight') {
      ctx.strokeStyle = '#C45C4A';
      ctx.lineWidth = 2;
      ctx.strokeRect(e.x - r - 1, e.y - r - 1, r * 2 + 2, r * 2 + 2);
    }
    if (e.boss) {
      ctx.strokeStyle = '#C9A227';
      ctx.lineWidth = 2;
      ctx.strokeRect(e.x - r - 2, e.y - r - 2, r * 2 + 4, r * 2 + 4);
      ctx.fillStyle = '#C9A227';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('黑天鵝', e.x, e.y - r - 8);
    } else {
      ctx.fillStyle = COLORS.paper;
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(e.def.name.slice(0, 2), e.x, e.y + 3);
    }
    const bw = r * 2;
    drawPixelRect(ctx, e.x - r, e.y - r - 8, bw, 3, '#1A1510');
    drawPixelRect(ctx, e.x - r, e.y - r - 8, bw * (e.hp / e.maxHp), 3, '#C45C4A');
    ctx.globalAlpha = 1;
  }

  function drawFx(ctx, state) {
    for (const fx of state.fx) {
      if (fx.type === 'bolt') {
        ctx.globalAlpha = Math.max(0, fx.life * 6);
        ctx.strokeStyle = fx.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fx.x0, fx.y0);
        ctx.lineTo(fx.x1, fx.y1);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (fx.type === 'hit') {
        const t = Math.max(0, fx.life);
        ctx.globalAlpha = Math.min(1, t * 5);
        ctx.strokeStyle = fx.color || '#E8DCC8';
        ctx.lineWidth = 2;
        const rr = (fx.r || 10) * (1.2 - t);
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, rr, 0, Math.PI * 2);
        ctx.stroke();
        drawPixelRect(ctx, fx.x - 2, fx.y - rr, 4, 4, fx.color || '#E8DCC8');
        ctx.globalAlpha = 1;
      } else if (fx.type === 'merge') {
        const t = Math.max(0, fx.life);
        const p = 1 - t / 0.55;
        ctx.globalAlpha = Math.min(1, t * 2);
        ctx.strokeStyle = '#C9A227';
        ctx.lineWidth = 3;
        const rr = 12 + p * 36;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, rr, 0, Math.PI * 2);
        ctx.stroke();
        // 星屑
        for (let i = 0; i < 6; i++) {
          const ang = (i / 6) * Math.PI * 2 + p * 2;
          const dx = Math.cos(ang) * rr * 0.8;
          const dy = Math.sin(ang) * rr * 0.8;
          drawPixelRect(ctx, fx.x + dx - 2, fx.y + dy - 2, 4, 4, i % 2 ? '#C9A227' : '#E8DCC8');
        }
        ctx.fillStyle = '#C9A227';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★' + (fx.star || ''), fx.x, fx.y - rr - 4);
        ctx.globalAlpha = 1;
      } else if (fx.type === 'maxstar') {
        const t = Math.max(0, fx.life);
        ctx.globalAlpha = Math.min(0.85, t);
        ctx.fillStyle = '#C9A227';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#1A1510';
        ctx.lineWidth = 4;
        ctx.strokeText('滿星！', fx.x, fx.y - 48);
        ctx.fillText('滿星！', fx.x, fx.y - 48);
        ctx.globalAlpha = 1;
      } else if (fx.type === 'coreHit') {
        ctx.globalAlpha = Math.min(0.4, fx.life);
        drawPixelRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, '#C45C4A');
        ctx.globalAlpha = 1;
      }
    }
    for (const f of state.floats) {
      const by = f._bounceY || 0;
      ctx.globalAlpha = Math.min(1, f.life * 2.2);
      const size = f.size || 14;
      ctx.font = 'bold ' + size + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#1A1510';
      ctx.lineWidth = 4;
      ctx.strokeText(f.text, f.x, f.y - by);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y - by);
      ctx.globalAlpha = 1;
    }
  }

  function drawDragGhost(ctx, state) {
    const d = state.drag;
    if (!d || !d.active) return;
    if (d.kind === 'hero' && d.hero) {
      const ghost = Object.assign({}, d.hero, { x: d.x, y: d.y });
      drawHero(ctx, ghost, false, false, true, state);
    } else if (d.kind === 'shop' && d.shopId) {
      const def = HEROES[d.shopId];
      if (!def) return;
      const fake = {
        id: d.shopId,
        star: 1,
        x: d.x,
        y: d.y,
        hp: 1,
        maxHp: 1,
        def,
      };
      drawHero(ctx, fake, false, false, true, state);
    }
  }

  function drawBanner(ctx, state) {
    ctx.fillStyle = 'rgba(26,21,16,0.75)';
    drawPixelRect(ctx, 180, 8, 600, 36, 'rgba(26,21,16,0.75)');
    ctx.fillStyle = COLORS.paper;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    let phase =
      state.phase === 'prep'
        ? '整備 — 拖放／點選放置合併'
        : state.phase === 'wave'
          ? '交戰中 ×' + (state.speed || 1)
          : state.phase === 'won'
            ? '銀樓倖存！'
            : state.phase === 'lost'
              ? '銀樓失守…'
              : state.phase;
    if (state.paused && (state.phase === 'wave' || state.phase === 'prep')) {
      phase = '⏸ 已暫停';
    }
    const waveLabel = state.endless
      ? '無盡第 ' + state.waveIndex + ' 波'
      : '第 ' + state.waveIndex + ' / ' + state.stage.waves.length + ' 波';
    ctx.fillText(state.stage.name + '  ·  ' + waveLabel + '  ·  ' + phase, 480, 32);

    // 羈絆列
    if (state._bonds && state._bonds.length) {
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#C9A227';
      ctx.fillText('羈絆：' + state._bonds.map((b) => b.name).join(' · '), 480, 52);
    }
  }

  function drawPauseVeil(ctx, state) {
    if (!state.paused) return;
    if (state.phase === 'won' || state.phase === 'lost') return;
    ctx.globalAlpha = 0.35;
    drawPixelRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, '#1A1510');
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#C9A227';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暫停', 480, 270);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#E8DCC8';
    ctx.fillText('按「暫停」或 Esc 繼續', 480, 298);
  }

  function render(ctx, state) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    state._animT = (state._animT || 0) + 0.016;
    // 即時羈絆（整備期都顯示）
    if (global.YD && global.YD.activeBonds) {
      state._bonds = global.YD.activeBonds(state.heroes || []);
    }
    ctx.save();
    if (state.shake > 0 && !state.paused) {
      const mag = Math.min(6, state.shake * 28);
      ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
    }
    drawBackground(ctx, w, h);
    drawCore(ctx, state);
    drawGrid(ctx, state);
    for (const e of state.enemies) drawEnemy(ctx, e);
    drawDragGhost(ctx, state);
    drawFx(ctx, state);
    drawBanner(ctx, state);
    drawPauseVeil(ctx, state);
    ctx.restore();
  }

  global.YDRender = { render, drawPixelRect };
})(window);
