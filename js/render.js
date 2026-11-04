/**
 * 銀樓防衛 — Canvas 繪製（程式像素色塊，可換 PNG）
 */
(function (global) {
  const { COLORS, GRID, CORE, HEROES } = global.YD;

  function drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function drawBackground(ctx, w, h) {
    drawPixelRect(ctx, 0, 0, w, h, '#2A241C');
    // 宣紙感橫紋
    ctx.globalAlpha = 0.08;
    for (let y = 0; y < h; y += 4) {
      drawPixelRect(ctx, 0, y, w, 1, COLORS.paper);
    }
    ctx.globalAlpha = 1;

    // 石磚地面（密度參考 Fortias 地板，原創色塊）
    const floorTop = GRID.originY - 8;
    const floorBot = GRID.originY + GRID.lanes * (GRID.cellH + GRID.gapY) + 4;
    drawPixelRect(ctx, 40, floorTop, w - 60, floorBot - floorTop, '#3A3228');
    for (let y = floorTop; y < floorBot; y += 16) {
      for (let x = 40; x < w - 20; x += 24) {
        const shade = ((x + y) / 16) & 1 ? '#4A4034' : '#353028';
        drawPixelRect(ctx, x, y, 22, 14, shade);
        drawPixelRect(ctx, x, y, 22, 1, '#2A241C');
        drawPixelRect(ctx, x, y, 1, 14, '#2A241C');
        // 草點／縫
        if (((x * 13 + y * 7) % 17) === 0) {
          drawPixelRect(ctx, x + 8, y + 6, 2, 2, '#3A5A40');
        }
      }
    }

    // 右側出生霧
    for (let i = 0; i < 8; i++) {
      ctx.globalAlpha = 0.04 + i * 0.02;
      drawPixelRect(ctx, w - 40 - i * 6, floorTop, 8, floorBot - floorTop, '#1A1510');
    }
    ctx.globalAlpha = 1;
  }

  function drawCore(ctx, hp, maxHp) {
    const { x, y, r } = CORE;
    // 銀樓建築
    drawPixelRect(ctx, x - 34, y - 50, 68, 90, '#5A4030');
    drawPixelRect(ctx, x - 38, y - 58, 76, 12, '#C45C4A');
    drawPixelRect(ctx, x - 20, y - 30, 16, 20, '#E8DCC8');
    drawPixelRect(ctx, x + 6, y - 30, 16, 20, '#E8DCC8');
    drawPixelRect(ctx, x - 10, y + 10, 20, 28, '#2A241C');
    // 金匾
    drawPixelRect(ctx, x - 22, y - 72, 44, 14, '#C9A227');
    ctx.fillStyle = '#1A1510';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('銀樓', x, y - 62);

    // HP
    const bw = 70;
    const ratio = Math.max(0, hp / maxHp);
    drawPixelRect(ctx, x - bw / 2, y + 48, bw, 8, '#1A1510');
    drawPixelRect(ctx, x - bw / 2, y + 48, bw * ratio, 8, ratio > 0.3 ? '#3A7A6A' : '#C45C4A');
    ctx.fillStyle = COLORS.paper;
    ctx.font = '11px sans-serif';
    ctx.fillText(Math.max(0, Math.ceil(hp)) + '/' + maxHp, x, y + 70);
  }

  function drawGrid(ctx, heroes, selectedUid, mergeFromUid) {
    for (let lane = 0; lane < GRID.lanes; lane++) {
      for (let slot = 0; slot < GRID.slots; slot++) {
        const x = GRID.originX + slot * (GRID.cellW + GRID.gapX);
        const y = GRID.originY + lane * (GRID.cellH + GRID.gapY);
        drawPixelRect(ctx, x, y, GRID.cellW, GRID.cellH, '#2E2820');
        ctx.strokeStyle = '#4A4034';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, GRID.cellW - 2, GRID.cellH - 2);
        // 前線標記
        if (slot === GRID.slots - 1) {
          drawPixelRect(ctx, x + GRID.cellW - 6, y + 4, 3, GRID.cellH - 8, '#3A7A6A');
        }
      }
    }
    for (const h of heroes) {
      drawHero(ctx, h, h.uid === selectedUid, h.uid === mergeFromUid);
    }
  }

  function drawHero(ctx, h, selected, mergeMark) {
    const def = h.def || HEROES[h.id];
    const s = 10 + h.star * 2;
    // 影子
    drawPixelRect(ctx, h.x - 14, h.y + 18, 28, 6, 'rgba(0,0,0,0.35)');
    // 身體
    drawPixelRect(ctx, h.x - s, h.y - s - 4, s * 2, s * 2 + 8, def.color);
    // 頭
    drawPixelRect(ctx, h.x - 8, h.y - s - 16, 16, 14, '#E8DCC8');
    drawPixelRect(ctx, h.x - 5, h.y - s - 12, 3, 3, '#1A1510');
    drawPixelRect(ctx, h.x + 2, h.y - s - 12, 3, 3, '#1A1510');
    // 角色符號
    ctx.fillStyle = '#1A1510';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    const glyph =
      def.role === 'melee'
        ? '刀'
        : def.role === 'ranged'
          ? '劍'
          : def.role === 'aoe'
            ? '槓'
            : def.role === 'support'
              ? '息'
              : def.role === 'tank'
                ? '衛'
                : '刺';
    ctx.fillText(glyph, h.x, h.y + 4);

    // 星
    ctx.fillStyle = h.star >= 3 ? COLORS.gold : COLORS.silver;
    ctx.font = '10px sans-serif';
    ctx.fillText('★'.repeat(h.star), h.x, h.y + 28);

    // 血條
    const bw = 36;
    drawPixelRect(ctx, h.x - bw / 2, h.y - s - 22, bw, 4, '#1A1510');
    drawPixelRect(
      ctx,
      h.x - bw / 2,
      h.y - s - 22,
      bw * (h.hp / h.maxHp),
      4,
      '#3A7A6A'
    );

    if (selected || mergeMark) {
      ctx.strokeStyle = mergeMark ? COLORS.gold : COLORS.cinnabar;
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x - s - 6, h.y - s - 20, s * 2 + 12, s * 2 + 36);
    }
    if (h.star >= 3) {
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x - s - 2, h.y - s - 6, s * 2 + 4, s * 2 + 12);
    }
  }

  function drawEnemy(ctx, e) {
    const r = e.radius;
    drawPixelRect(ctx, e.x - r, e.y - r, r * 2, r * 2, e.def.color);
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
      }
    }
    for (const f of state.floats) {
      ctx.globalAlpha = Math.min(1, f.life * 2);
      ctx.fillStyle = f.color;
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#1A1510';
      ctx.lineWidth = 3;
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillText(f.text, f.x, f.y);
      ctx.globalAlpha = 1;
    }
  }

  function drawBanner(ctx, state) {
    ctx.fillStyle = 'rgba(26,21,16,0.75)';
    drawPixelRect(ctx, 200, 8, 560, 36, 'rgba(26,21,16,0.75)');
    ctx.fillStyle = COLORS.paper;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    const phase =
      state.phase === 'prep'
        ? '整備中 — 放置／合併後開波'
        : state.phase === 'wave'
          ? '交戰中'
          : state.phase === 'won'
            ? '銀樓倖存！'
            : state.phase === 'lost'
              ? '銀樓失守…'
              : state.phase;
    ctx.fillText(
      state.stage.name + '  ·  第 ' + state.waveIndex + ' / ' + state.stage.waves.length + ' 波  ·  ' + phase,
      480,
      32
    );
  }

  function render(ctx, state) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    drawBackground(ctx, w, h);
    drawCore(ctx, state.coreHp, state.coreMax);
    drawGrid(ctx, state.heroes, state.selectedHeroUid, state.mergeFromUid);
    for (const e of state.enemies) drawEnemy(ctx, e);
    drawFx(ctx, state);
    drawBanner(ctx, state);
  }

  global.YDRender = { render, drawPixelRect };
})(window);
