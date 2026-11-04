/**
 * 銀樓防衛 — Canvas 繪製 v0.5.0
 * 場景再加厚、技能 CD 條、精英／羈絆橫幅、單位細節
 */
(function (global) {
  const { COLORS, GRID, CORE, HEROES, ENEMIES } = global.YD;

  function drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function drawBackground(ctx, w, h, state) {
    const t = (state && state._animT) || 0;
    drawPixelRect(ctx, 0, 0, w, h, '#221C16');
    // 遠景山影
    ctx.globalAlpha = 0.35;
    drawPixelRect(ctx, 0, 0, w, 56, '#1A1510');
    for (let i = 0; i < 7; i++) {
      const mx = 80 + i * 130;
      drawPixelRect(ctx, mx, 18 + (i % 3) * 4, 90, 40, '#16120E');
    }
    ctx.globalAlpha = 1;

    // 宣紙紋
    ctx.globalAlpha = 0.06;
    for (let y = 0; y < h; y += 4) drawPixelRect(ctx, 0, y, w, 1, COLORS.paper);
    ctx.globalAlpha = 1;

    const floorTop = GRID.originY - 14;
    const floorBot = GRID.originY + GRID.lanes * (GRID.cellH + GRID.gapY) + 10;

    // 主戰場地板（磚＋草點，密度對齊參考但原創）
    drawPixelRect(ctx, 36, floorTop, w - 52, floorBot - floorTop, '#3A3228');
    for (let y = floorTop; y < floorBot; y += 14) {
      for (let x = 36; x < w - 16; x += 20) {
        const odd = ((x / 20) | 0) + ((y / 14) | 0);
        const shade = odd & 1 ? '#4A4034' : '#352E26';
        drawPixelRect(ctx, x, y, 18, 12, shade);
        drawPixelRect(ctx, x, y, 18, 1, '#2A241C');
        drawPixelRect(ctx, x, y, 1, 12, '#2A241C');
        // 磚縫高光
        if ((x * 11 + y * 5) % 23 === 0) drawPixelRect(ctx, x + 4, y + 3, 3, 2, '#5A5040');
        // 草／落葉點
        if ((x * 13 + y * 7) % 19 === 0) drawPixelRect(ctx, x + 10, y + 7, 2, 2, '#3A5A40');
        if ((x * 17 + y * 3) % 29 === 0) drawPixelRect(ctx, x + 6, y + 5, 2, 2, '#6A5030');
      }
    }

    // 右方出生帶陰影
    for (let i = 0; i < 10; i++) {
      ctx.globalAlpha = 0.03 + i * 0.018;
      drawPixelRect(ctx, w - 36 - i * 5, floorTop, 7, floorBot - floorTop, '#1A1510');
    }
    ctx.globalAlpha = 1;

    // 左方木牆／拒馬（銀樓防線）
    const wallX = 108;
    for (let y = floorTop; y < floorBot; y += 10) {
      drawPixelRect(ctx, wallX, y, 14, 9, '#5A4030');
      drawPixelRect(ctx, wallX + 2, y + 2, 10, 5, '#6A5040');
      drawPixelRect(ctx, wallX, y, 14, 1, '#2A241C');
    }
    // 牆柱
    for (let i = 0; i < 5; i++) {
      const py = floorTop + 8 + i * ((floorBot - floorTop - 16) / 4);
      drawPixelRect(ctx, wallX - 4, py, 8, 22, '#4A3020');
      drawPixelRect(ctx, wallX - 2, py + 2, 4, 6, '#C45C4A'); // 硃紅綁帶
      // 火把
      const flicker = 0.6 + 0.4 * Math.sin(t * 8 + i);
      drawPixelRect(ctx, wallX + 12, py + 2, 4, 10, '#3A2820');
      ctx.globalAlpha = flicker;
      drawPixelRect(ctx, wallX + 11, py - 4, 6, 6, '#C45C4A');
      drawPixelRect(ctx, wallX + 12, py - 6, 4, 3, '#C9A227');
      ctx.globalAlpha = 1;
    }

    // 牆邊木箱／旗／銅錢堆／燈籠柱
    drawPixelRect(ctx, 88, floorBot - 36, 18, 14, '#5A4030');
    drawPixelRect(ctx, 90, floorBot - 34, 14, 4, '#C9A227');
    drawPixelRect(ctx, 86, floorBot - 48, 10, 10, '#6A5040');
    drawPixelRect(ctx, 88, floorBot - 46, 6, 3, '#C9A227');
    drawPixelRect(ctx, wallX + 18, floorTop + 20, 3, 28, '#3A2820');
    drawPixelRect(ctx, wallX + 21, floorTop + 20, 14, 10, '#C45C4A');
    drawPixelRect(ctx, wallX + 21, floorTop + 30, 14, 8, '#E8DCC8');
    // 右下拒馬／沙袋
    drawPixelRect(ctx, w - 90, floorBot - 28, 40, 10, '#4A4034');
    drawPixelRect(ctx, w - 86, floorBot - 36, 8, 12, '#5A4030');
    drawPixelRect(ctx, w - 70, floorBot - 34, 8, 10, '#5A4030');
    // 天上墨點雲
    ctx.globalAlpha = 0.2;
    drawPixelRect(ctx, 200, 10, 60, 10, '#1A1510');
    drawPixelRect(ctx, 420, 6, 80, 12, '#1A1510');
    drawPixelRect(ctx, 700, 12, 50, 8, '#1A1510');
    ctx.globalAlpha = 1;

    // lane 分隔細線
    for (let lane = 1; lane < GRID.lanes; lane++) {
      const y = GRID.originY + lane * (GRID.cellH + GRID.gapY) - GRID.gapY / 2;
      ctx.globalAlpha = 0.25;
      drawPixelRect(ctx, GRID.originX - 8, y, GRID.slots * (GRID.cellW + GRID.gapX) + 40, 1, '#1A1510');
      ctx.globalAlpha = 1;
    }
  }

  function drawCore(ctx, state) {
    const { x, y } = CORE;
    const hp = state.coreHp;
    const maxHp = state.coreMax;
    const flash = state.coreHitFlash || 0;
    const t = state._animT || 0;

    // 基座石階
    drawPixelRect(ctx, x - 42, y + 28, 84, 18, '#4A4034');
    drawPixelRect(ctx, x - 38, y + 24, 76, 6, '#5A5040');

    // 牆體
    drawPixelRect(ctx, x - 36, y - 48, 72, 76, flash > 0 ? '#7A4030' : '#5A4030');
    // 磚紋
    for (let by = y - 44; by < y + 24; by += 10) {
      for (let bx = x - 32; bx < x + 32; bx += 14) {
        drawPixelRect(ctx, bx, by, 12, 8, ((bx + by) & 2) ? '#6A5040' : '#4A3528');
        drawPixelRect(ctx, bx, by, 12, 1, '#2A241C');
      }
    }
    // 屋簷瓦
    drawPixelRect(ctx, x - 44, y - 58, 88, 12, '#C45C4A');
    drawPixelRect(ctx, x - 40, y - 64, 80, 8, '#A04040');
    for (let i = 0; i < 8; i++) {
      drawPixelRect(ctx, x - 38 + i * 10, y - 62, 6, 4, '#1A1510');
    }
    // 匾額
    drawPixelRect(ctx, x - 24, y - 78, 48, 14, '#C9A227');
    ctx.fillStyle = '#1A1510';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('銀樓', x, y - 68);

    // 窗
    drawPixelRect(ctx, x - 22, y - 28, 14, 16, '#E8DCC8');
    drawPixelRect(ctx, x + 8, y - 28, 14, 16, '#E8DCC8');
    drawPixelRect(ctx, x - 16, y - 22, 3, 3, '#1A1510');
    drawPixelRect(ctx, x + 14, y - 22, 3, 3, '#1A1510');
    // 門
    drawPixelRect(ctx, x - 12, y + 4, 24, 30, '#2A241C');
    drawPixelRect(ctx, x - 8, y + 8, 6, 10, '#3A3228');
    drawPixelRect(ctx, x + 4, y + 18, 3, 3, '#C9A227');

    // 燈籠微動
    const bob = Math.sin(t * 3) * 1.5;
    drawPixelRect(ctx, x - 48, y - 40 + bob, 10, 14, '#C45C4A');
    drawPixelRect(ctx, x - 46, y - 36 + bob, 6, 6, '#C9A227');
    drawPixelRect(ctx, x + 38, y - 40 + bob, 10, 14, '#C45C4A');
    drawPixelRect(ctx, x + 40, y - 36 + bob, 6, 6, '#C9A227');

    if (flash > 0) {
      ctx.globalAlpha = Math.min(0.55, flash * 2);
      drawPixelRect(ctx, x - 48, y - 86, 96, 150, '#C45C4A');
      ctx.globalAlpha = 1;
    }

    const bw = 74;
    const ratio = Math.max(0, hp / maxHp);
    drawPixelRect(ctx, x - bw / 2, y + 50, bw, 8, '#1A1510');
    drawPixelRect(ctx, x - bw / 2, y + 50, bw * ratio, 8, ratio > 0.3 ? '#3A7A6A' : '#C45C4A');
    ctx.fillStyle = COLORS.paper;
    ctx.font = '11px sans-serif';
    ctx.fillText(Math.max(0, Math.ceil(hp)) + '/' + maxHp, x, y + 72);
  }

  function drawSilhouette(ctx, h, def, s, ox, oy) {
    const kind = def.silhouette || def.role;
    const ink = '#1A1510';
    const paper = '#E8DCC8';
    const hx = h.x + ox;
    const hy = h.y + oy;
    // 身體
    drawPixelRect(ctx, hx - s, hy - s - 4, s * 2, s * 2 + 8, def.color);
    // 衣褶／腰帶
    drawPixelRect(ctx, hx - s + 2, hy - 2, 3, s + 2, ink);
    drawPixelRect(ctx, hx - s + 1, hy + 4, s * 2 - 2, 3, ink);
    drawPixelRect(ctx, hx - 2, hy + 5, 4, 2, '#C9A227');
    // 靴
    drawPixelRect(ctx, hx - s + 1, hy + s + 2, 6, 4, ink);
    drawPixelRect(ctx, hx + s - 7, hy + s + 2, 6, 4, ink);
    // 頭
    drawPixelRect(ctx, hx - 8, hy - s - 16, 16, 14, paper);
    drawPixelRect(ctx, hx - 5, hy - s - 12, 3, 3, ink);
    drawPixelRect(ctx, hx + 2, hy - s - 12, 3, 3, ink);
    drawPixelRect(ctx, hx - 3, hy - s - 6, 6, 2, '#C45C4A'); // 唇／印記點

    // 揮擊：武器額外前伸
    const swing = h.swingT > 0 ? (1 - h.swingT / 0.22) : 0;
    const wx = Math.round(swing * 10);
    const wy = Math.round(swing * -4);

    if (kind === 'blade' || kind === 'melee') {
      drawPixelRect(ctx, hx + s - 2 + wx, hy - 10 + wy, 4, 22, ink);
      drawPixelRect(ctx, hx + s + 2 + wx, hy - 14 + wy, 10, 6, '#E8DCC8');
      drawPixelRect(ctx, hx + s + 2 + wx, hy - 12 + wy, 14, 3, def.color);
    } else if (kind === 'sword' || kind === 'ranged') {
      drawPixelRect(ctx, hx + s - 4 + wx, hy - s - 8 + wy, 3, 20, ink);
      drawPixelRect(ctx, hx + s - 6 + wx, hy - 2 + wy, 8, 3, '#C9A227');
      drawPixelRect(ctx, hx - 12, hy - s - 20, 24, 5, ink);
      drawPixelRect(ctx, hx - 6, hy - s - 24, 12, 5, '#5A4030');
    } else if (kind === 'staff' || kind === 'aoe') {
      drawPixelRect(ctx, hx - s - 6 + wx, hy - s - 10 + wy, 4, 28, ink);
      drawPixelRect(ctx, hx - s - 10 + wx, hy - s - 14 + wy, 12, 8, '#5A4060');
      drawPixelRect(ctx, hx - 6, hy - s - 18, 12, 4, paper);
    } else if (kind === 'hat' || kind === 'support') {
      drawPixelRect(ctx, hx - 14, hy - s - 20, 28, 6, ink);
      drawPixelRect(ctx, hx - 7, hy - s - 26, 14, 7, '#3A7A6A');
      drawPixelRect(ctx, hx - s - 8, hy + 2, 7, 10, '#C45C4A');
      drawPixelRect(ctx, hx - s - 6, hy, 3, 3, '#C9A227');
    } else if (kind === 'shield' || kind === 'tank') {
      const guard = h.guardProcT > 0 ? 2 : 0;
      drawPixelRect(ctx, hx - s - 10 - guard, hy - 8, 10 + guard, 18, '#8A8070');
      drawPixelRect(ctx, hx - s - 8 - guard, hy - 4, 6, 10, '#C9A227');
      drawPixelRect(ctx, hx + s - 2 + wx, hy - 4 + wy, 6, 14, ink);
      drawPixelRect(ctx, hx - 10, hy - s - 20, 20, 6, '#6A6055');
    } else if (kind === 'dagger' || kind === 'assassin') {
      drawPixelRect(ctx, hx + s - 4 + wx, hy - 6 + wy, 3, 12, ink);
      drawPixelRect(ctx, hx + s - 2 + wx, hy - 10 + wy, 8, 3, '#A04040');
      drawPixelRect(ctx, hx - 10, hy - s - 20, 20, 4, ink);
      drawPixelRect(ctx, hx - 7, hy - s - 8, 14, 5, '#1A1510');
    } else if (kind === 'drum' || kind === 'buffer') {
      const beat = h.swingT > 0 ? 2 : 0;
      drawPixelRect(ctx, hx - 10, hy + 6 - beat, 20, 12, '#C9A227');
      drawPixelRect(ctx, hx - 8, hy + 8 - beat, 16, 8, '#5A4030');
      drawPixelRect(ctx, hx + s - 2 + wx, hy - 12 + wy, 3, 16, ink);
      drawPixelRect(ctx, hx - 10, hy - s - 22, 20, 6, '#C9A227');
      drawPixelRect(ctx, hx - 4, hy - s - 28, 8, 6, '#C45C4A');
    } else if (kind === 'hook' || kind === 'hunter') {
      drawPixelRect(ctx, hx + s - 4 + wx, hy - 14 + wy, 4, 20, ink);
      drawPixelRect(ctx, hx + s + wx, hy - 16 + wy, 10, 4, '#8A5040');
      drawPixelRect(ctx, hx + s + 8 + wx, hy - 14 + wy, 4, 8, ink);
      drawPixelRect(ctx, hx - 12, hy - s - 20, 24, 5, ink);
    }
  }

  function cellHighlightStyle(state, lane, slot) {
    const show = state.showCellHints !== false;
    if (!show) return null;
    const occ = state.heroes.find((h) => h.lane === lane && h.slot === slot);
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
    const t = state._animT || 0;

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
        // 格內地板紋
        drawPixelRect(ctx, x + 4, y + GRID.cellH - 10, GRID.cellW - 8, 4, '#252018');
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
    const t = (state && state._animT) || 0;
    const idle = ghost ? 0 : Math.sin(t * 3.2 + (h.idlePhase || 0)) * 1.4;
    const lean = h.swingT > 0 ? Math.sin((1 - h.swingT / 0.22) * Math.PI) * 3 : 0;
    ctx.globalAlpha = alpha;
    if (h.hitFlash > 0 && !ghost) {
      ctx.globalAlpha = alpha * (0.55 + Math.sin(h.hitFlash * 40) * 0.25);
    }
    drawPixelRect(ctx, h.x - 14 + lean, h.y + 18, 28, 6, 'rgba(0,0,0,0.35)');

    if (h.star >= 3 && !ghost) {
      const pulse = 0.35 + 0.25 * Math.sin(t * 5);
      ctx.globalAlpha = alpha * pulse;
      drawPixelRect(ctx, h.x - s - 6 + lean, h.y - s - 22 + idle, s * 2 + 12, s * 2 + 40, '#C9A227');
      ctx.globalAlpha = alpha;
    }

    drawSilhouette(ctx, h, def, s, lean, idle);

    if (h.atkBuffT > 0 && !ghost) {
      drawPixelRect(ctx, h.x + s + 2 + lean, h.y - s - 18 + idle, 6, 6, '#C9A227');
    }
    if (h.guardProcT > 0 && !ghost) {
      ctx.globalAlpha = alpha * 0.5;
      ctx.strokeStyle = '#C9A227';
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x - s - 8 + lean, h.y - s - 20 + idle, s * 2 + 16, s * 2 + 36);
      ctx.globalAlpha = alpha;
    }

    ctx.fillStyle = h.star >= 3 ? COLORS.gold : COLORS.silver;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★'.repeat(h.star), h.x + lean, h.y + 30);

    if (!ghost) {
      const bw = 36;
      drawPixelRect(ctx, h.x - bw / 2 + lean, h.y - s - 26 + idle, bw, 4, '#1A1510');
      drawPixelRect(ctx, h.x - bw / 2 + lean, h.y - s - 26 + idle, bw * (h.hp / h.maxHp), 4, '#3A7A6A');
      // 技能 CD／蓄力條
      const showCd = !state || state.showSkillCd !== false;
      if (showCd && def.skill) {
        let prog = 0;
        const sk = def.skill;
        if (sk.every) {
          if (def.role === 'support') {
            prog = ((h.auraTicks || 0) % sk.every) / sk.every;
          } else {
            prog = ((h.atkCount || 0) % sk.every) / sk.every;
          }
        } else if (sk.proc) {
          prog = h.guardProcT > 0 ? 1 : 0.15;
        }
        drawPixelRect(ctx, h.x - bw / 2 + lean, h.y - s - 21 + idle, bw, 3, '#1A1510');
        const ready = prog >= 0.95 || (sk.proc && h.guardProcT > 0);
        drawPixelRect(
          ctx,
          h.x - bw / 2 + lean,
          h.y - s - 21 + idle,
          Math.max(1, bw * prog),
          3,
          ready ? '#C9A227' : def.color
        );
      }
    }

    if (selected || mergeMark) {
      ctx.strokeStyle = mergeMark ? COLORS.gold : COLORS.cinnabar;
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x - s - 6 + lean, h.y - s - 24 + idle, s * 2 + 12, s * 2 + 42);
    }
    if (h.star >= 3) {
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x - s - 3 + lean, h.y - s - 8 + idle, s * 2 + 6, s * 2 + 14);
      ctx.fillStyle = COLORS.gold;
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('滿', h.x + lean, h.y - s - 30 + idle);
    }
    ctx.globalAlpha = 1;
  }

  function drawEnemy(ctx, e, state) {
    const r = e.radius;
    const t = (state && state._animT) || 0;
    const bob = Math.sin(t * 5 + e.x * 0.05) * 1.2;
    if (e.hitFlash > 0) ctx.globalAlpha = 0.55 + Math.sin(e.hitFlash * 50) * 0.3;
    // 身體＋簡單特徵
    drawPixelRect(ctx, e.x - r, e.y - r + bob, r * 2, r * 2, e.def.color);
    drawPixelRect(ctx, e.x - r + 2, e.y - r + 4 + bob, r * 2 - 4, 3, '#1A1510');
    drawPixelRect(ctx, e.x - r + 2, e.y - r + 2 + bob, 3, 3, '#1A1510');
    drawPixelRect(ctx, e.x + r - 5, e.y - r + 2 + bob, 3, 3, '#1A1510');
    drawPixelRect(ctx, e.x - 3, e.y + 2 + bob, 6, 2, '#E8DCC8');
    if (e.boss) {
      // 羽翼感
      drawPixelRect(ctx, e.x - r - 8, e.y - 4 + bob, 8, 10, '#2A241C');
      drawPixelRect(ctx, e.x + r, e.y - 4 + bob, 8, 10, '#2A241C');
      drawPixelRect(ctx, e.x - r - 6, e.y - 2 + bob, 4, 4, '#5A4060');
      drawPixelRect(ctx, e.x + r + 2, e.y - 2 + bob, 4, 4, '#5A4060');
    }
    if (e.elite) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 7);
      ctx.strokeStyle = pulse > 0.4 ? '#C45C4A' : '#C9A227';
      ctx.lineWidth = 2;
      ctx.strokeRect(e.x - r - 3, e.y - r - 3 + bob, r * 2 + 6, r * 2 + 6);
      drawPixelRect(ctx, e.x - 4, e.y - r - 10 + bob, 8, 4, '#C45C4A');
    }
    if (e.mode === 'fight') {
      ctx.strokeStyle = '#C45C4A';
      ctx.lineWidth = 2;
      ctx.strokeRect(e.x - r - 1, e.y - r - 1 + bob, r * 2 + 2, r * 2 + 2);
    }
    if (e.boss) {
      ctx.strokeStyle = '#C9A227';
      ctx.lineWidth = 2;
      ctx.strokeRect(e.x - r - 2, e.y - r - 2 + bob, r * 2 + 4, r * 2 + 4);
      ctx.fillStyle = '#C9A227';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('黑天鵝', e.x, e.y - r - 8 + bob);
    } else if (e.elite) {
      ctx.fillStyle = '#C45C4A';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('精英', e.x, e.y - r - 12 + bob);
      ctx.fillStyle = COLORS.paper;
      ctx.font = '9px sans-serif';
      ctx.fillText(e.def.name.slice(0, 2), e.x, e.y + 3 + bob);
    } else {
      ctx.fillStyle = COLORS.paper;
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(e.def.name.slice(0, 2), e.x, e.y + 3 + bob);
    }
    const bw = r * 2;
    drawPixelRect(ctx, e.x - r, e.y - r - 8 + bob, bw, 3, '#1A1510');
    drawPixelRect(ctx, e.x - r, e.y - r - 8 + bob, bw * (e.hp / e.maxHp), 3, '#C45C4A');
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
      } else if (fx.type === 'skill') {
        const t = Math.max(0, fx.life);
        ctx.globalAlpha = Math.min(0.9, t * 2);
        ctx.strokeStyle = fx.color || '#C9A227';
        ctx.lineWidth = 3;
        const rr = 16 + (1 - t / 0.45) * 20;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, rr, 0, Math.PI * 2);
        ctx.stroke();
        if (fx.text) {
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.strokeStyle = '#1A1510';
          ctx.lineWidth = 3;
          ctx.strokeText(fx.text, fx.x, fx.y - rr - 4);
          ctx.fillStyle = fx.color || '#C9A227';
          ctx.fillText(fx.text, fx.x, fx.y - rr - 4);
        }
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
      } else if (fx.type === 'bossWarn') {
        ctx.globalAlpha = Math.min(0.25, fx.life * 0.2);
        drawPixelRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, '#5A4060');
        ctx.globalAlpha = 1;
      } else if (fx.type === 'eliteWarn') {
        ctx.globalAlpha = Math.min(0.2, fx.life * 0.18);
        drawPixelRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, '#C45C4A');
        ctx.globalAlpha = 1;
      } else if (fx.type === 'bond') {
        const t = Math.max(0, fx.life);
        ctx.globalAlpha = Math.min(0.9, t * 1.2);
        ctx.strokeStyle = '#C9A227';
        ctx.lineWidth = 2;
        ctx.strokeRect(fx.x - 80, fx.y - 16, 160, 32);
        if (fx.text) {
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#C9A227';
          ctx.fillText(fx.text, fx.x, fx.y + 4);
        }
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

  function drawBossBanner(ctx, state) {
    const b = state.bossBanner;
    if (!b || b.life <= 0) return;
    const p = Math.min(1, b.life / (b.maxLife || 2.6));
    const alpha = p > 0.85 ? (1 - p) / 0.15 : p < 0.2 ? p / 0.2 : 1;
    ctx.globalAlpha = Math.min(1, alpha);
    const elite = b.kind === 'elite';
    drawPixelRect(ctx, 160, 200, 640, 56, '#1A1510');
    ctx.strokeStyle = elite ? '#C45C4A' : '#C9A227';
    ctx.lineWidth = 3;
    ctx.strokeRect(162, 202, 636, 52);
    ctx.fillStyle = elite ? '#C45C4A' : '#C9A227';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((elite ? '⚔ 精英來襲 — ' : '⚠ Boss 入場 — ') + b.name, 480, 236);
    ctx.globalAlpha = 1;
  }

  function drawBondBanner(ctx, state) {
    const b = state.bondBanner;
    if (!b || b.life <= 0) return;
    const p = Math.min(1, b.life / (b.maxLife || 2));
    const alpha = p > 0.85 ? (1 - p) / 0.15 : p < 0.25 ? p / 0.25 : 1;
    ctx.globalAlpha = Math.min(1, alpha);
    drawPixelRect(ctx, 220, 70, 520, 44, '#1A1510');
    ctx.strokeStyle = '#C9A227';
    ctx.lineWidth = 2;
    ctx.strokeRect(222, 72, 516, 40);
    ctx.fillStyle = '#C9A227';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('合擊羈絆 · ' + b.name, 480, 90);
    ctx.fillStyle = '#E8DCC8';
    ctx.font = '11px sans-serif';
    ctx.fillText(b.blurb || '', 480, 106);
    ctx.globalAlpha = 1;
  }

  function drawDragGhost(ctx, state) {
    const d = state.drag;
    if (!d || !d.active) return;
    if (d.kind === 'hero' && d.hero) {
      const ghost = Object.assign({}, d.hero, { x: d.x, y: d.y, swingT: 0 });
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
        swingT: 0,
        idlePhase: 0,
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
      : state.daily
        ? '每日第 ' + state.waveIndex + ' / ' + state.stage.waves.length + ' 波'
        : '第 ' + state.waveIndex + ' / ' + state.stage.waves.length + ' 波';
    ctx.fillText(state.stage.name + '  ·  ' + waveLabel + '  ·  ' + phase, 480, 32);

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
    if (global.YD && global.YD.activeBonds) {
      state._bonds = global.YD.activeBonds(state.heroes || []);
    }
    ctx.save();
    if (state.shake > 0 && !state.paused) {
      const mag = Math.min(state.reduceShake ? 3 : 6, state.shake * (state.reduceShake ? 14 : 28));
      ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
    }
    drawBackground(ctx, w, h, state);
    drawCore(ctx, state);
    drawGrid(ctx, state);
    for (const e of state.enemies) drawEnemy(ctx, e, state);
    drawDragGhost(ctx, state);
    drawFx(ctx, state);
    drawBossBanner(ctx, state);
    drawBondBanner(ctx, state);
    drawBanner(ctx, state);
    drawPauseVeil(ctx, state);
    ctx.restore();
  }

  global.YDRender = { render, drawPixelRect };
})(window);
