/**
 * 銀樓防衛 — Canvas 繪製 v1.8.0
 * v1.5：場景四層 ground→mid→wall→props；halt_seal PNG；擊破／暴擊
 */
(function (global) {
  const { COLORS, GRID, CORE, HEROES, ENEMIES, MAX_STAR, upgradeLabel } = global.YD;

  let bgCache = null;
  let bgCacheW = 0;
  let bgCacheH = 0;

  function drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function ensureBgCache(w, h) {
    if (bgCache && bgCacheW === w && bgCacheH === h) return bgCache;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    // 靜態層（唔含火把閃爍）
    drawPixelRect(g, 0, 0, w, h, '#221C16');
    g.globalAlpha = 0.35;
    drawPixelRect(g, 0, 0, w, 56, '#1A1510');
    for (let i = 0; i < 7; i++) {
      const mx = 80 + i * 130;
      drawPixelRect(g, mx, 18 + (i % 3) * 4, 90, 40, '#16120E');
    }
    g.globalAlpha = 1;
    g.globalAlpha = 0.06;
    for (let y = 0; y < h; y += 4) drawPixelRect(g, 0, y, w, 1, COLORS.paper);
    g.globalAlpha = 1;
    const floorTop = GRID.originY - 14;
    const floorBot = GRID.originY + GRID.lanes * (GRID.cellH + GRID.gapY) + 10;
    drawPixelRect(g, 36, floorTop, w - 52, floorBot - floorTop, '#3A3228');
    for (let y = floorTop; y < floorBot; y += 14) {
      for (let x = 36; x < w - 16; x += 20) {
        const odd = ((x / 20) | 0) + ((y / 14) | 0);
        const shade = odd & 1 ? '#4A4034' : '#352E26';
        drawPixelRect(g, x, y, 18, 12, shade);
        drawPixelRect(g, x, y, 18, 1, '#2A241C');
        drawPixelRect(g, x, y, 1, 12, '#2A241C');
        if ((x * 11 + y * 5) % 23 === 0) drawPixelRect(g, x + 4, y + 3, 3, 2, '#5A5040');
        if ((x * 13 + y * 7) % 19 === 0) drawPixelRect(g, x + 10, y + 7, 2, 2, '#3A5A40');
        if ((x * 17 + y * 3) % 29 === 0) drawPixelRect(g, x + 6, y + 5, 2, 2, '#6A5030');
      }
    }
    for (let i = 0; i < 10; i++) {
      g.globalAlpha = 0.03 + i * 0.018;
      drawPixelRect(g, w - 36 - i * 5, floorTop, 7, floorBot - floorTop, '#1A1510');
    }
    g.globalAlpha = 1;
    const wallX = 108;
    for (let y = floorTop; y < floorBot; y += 10) {
      drawPixelRect(g, wallX, y, 14, 9, '#5A4030');
      drawPixelRect(g, wallX + 2, y + 2, 10, 5, '#6A5040');
      drawPixelRect(g, wallX, y, 14, 1, '#2A241C');
    }
    for (let i = 0; i < 5; i++) {
      const py = floorTop + 8 + i * ((floorBot - floorTop - 16) / 4);
      drawPixelRect(g, wallX - 4, py, 8, 22, '#4A3020');
      drawPixelRect(g, wallX - 2, py + 2, 4, 6, '#C45C4A');
      drawPixelRect(g, wallX + 12, py + 2, 4, 10, '#3A2820');
    }
    drawPixelRect(g, 88, floorBot - 36, 18, 14, '#5A4030');
    drawPixelRect(g, 90, floorBot - 34, 14, 4, '#C9A227');
    drawPixelRect(g, 86, floorBot - 48, 10, 10, '#6A5040');
    drawPixelRect(g, 88, floorBot - 46, 6, 3, '#C9A227');
    drawPixelRect(g, wallX + 18, floorTop + 20, 3, 28, '#3A2820');
    drawPixelRect(g, wallX + 21, floorTop + 20, 14, 10, '#C45C4A');
    drawPixelRect(g, wallX + 21, floorTop + 30, 14, 8, '#E8DCC8');
    drawPixelRect(g, w - 90, floorBot - 28, 40, 10, '#4A4034');
    drawPixelRect(g, w - 86, floorBot - 36, 8, 12, '#5A4030');
    drawPixelRect(g, w - 70, floorBot - 34, 8, 10, '#5A4030');
    g.globalAlpha = 0.2;
    drawPixelRect(g, 200, 10, 60, 10, '#1A1510');
    drawPixelRect(g, 420, 6, 80, 12, '#1A1510');
    drawPixelRect(g, 700, 12, 50, 8, '#1A1510');
    g.globalAlpha = 1;
    for (let lane = 1; lane < GRID.lanes; lane++) {
      const y = GRID.originY + lane * (GRID.cellH + GRID.gapY) - GRID.gapY / 2;
      g.globalAlpha = 0.25;
      drawPixelRect(g, GRID.originX, y, GRID.slots * (GRID.cellW + GRID.gapX), 1, '#1A1510');
      g.globalAlpha = 1;
    }
    // v0.8 戰場加厚：右緣燈柱、銅錢紋、地磚裂縫、左側匾影
    for (let i = 0; i < 4; i++) {
      const ly = floorTop + 24 + i * ((floorBot - floorTop - 40) / 3);
      drawPixelRect(g, w - 48, ly, 6, 26, '#3A3028');
      drawPixelRect(g, w - 52, ly - 8, 14, 10, '#C45C4A');
      drawPixelRect(g, w - 50, ly - 5, 10, 5, '#C9A227');
    }
    for (let i = 0; i < 6; i++) {
      const cx = 160 + i * 120;
      const cy = floorBot - 14;
      g.globalAlpha = 0.22;
      drawPixelRect(g, cx, cy, 10, 10, '#C9A227');
      drawPixelRect(g, cx + 2, cy + 2, 6, 6, '#3A3228');
      g.globalAlpha = 1;
    }
    for (let i = 0; i < 8; i++) {
      const cx = 50 + (i * 97) % (w - 100);
      const cy = floorTop + 20 + ((i * 53) % (floorBot - floorTop - 40));
      drawPixelRect(g, cx, cy, 8, 1, '#2A241C');
      drawPixelRect(g, cx + 3, cy, 1, 6, '#2A241C');
    }
    drawPixelRect(g, 42, floorTop + 8, 28, 8, '#5A4030');
    drawPixelRect(g, 44, floorTop + 10, 24, 4, '#C9A227');
    // v1.0 像素再加厚：瓦簷影、拒馬刺、地磚青苔、銅錢堆、右緣旗幟
    for (let i = 0; i < 5; i++) {
      const fx = 130 + i * 150;
      g.globalAlpha = 0.35;
      drawPixelRect(g, fx, floorTop - 6, 36, 6, '#1A1510');
      g.globalAlpha = 1;
      drawPixelRect(g, fx + 4, floorTop - 10, 28, 5, '#C45C4A');
      drawPixelRect(g, fx + 8, floorTop - 14, 20, 4, '#A04040');
    }
    for (let i = 0; i < 6; i++) {
      const bx = wallX + 22 + (i % 2) * 10;
      const by = floorTop + 40 + i * 48;
      drawPixelRect(g, bx, by, 3, 16, '#3A2820');
      drawPixelRect(g, bx - 4, by + 4, 11, 3, '#5A4030');
      drawPixelRect(g, bx - 2, by + 2, 2, 2, '#C9A227');
    }
    for (let i = 0; i < 14; i++) {
      const gx = 60 + (i * 67) % (w - 120);
      const gy = floorTop + 30 + ((i * 41) % (floorBot - floorTop - 50));
      drawPixelRect(g, gx, gy, 2, 2, '#3A5A40');
      if (i % 3 === 0) drawPixelRect(g, gx + 3, gy + 1, 2, 1, '#4A6A50');
    }
    for (let i = 0; i < 3; i++) {
      const cx = 70 + i * 28;
      const cy = floorBot - 22;
      drawPixelRect(g, cx, cy, 12, 12, '#C9A227');
      drawPixelRect(g, cx + 3, cy + 3, 6, 6, '#5A4030');
      drawPixelRect(g, cx + 5, cy + 5, 2, 2, '#E8DCC8');
    }
    for (let i = 0; i < 3; i++) {
      const fy = floorTop + 30 + i * 90;
      drawPixelRect(g, w - 28, fy, 4, 40, '#5A4030');
      drawPixelRect(g, w - 24, fy + 2, 16, 12, '#C45C4A');
      drawPixelRect(g, w - 22, fy + 5, 12, 6, '#C9A227');
    }
    bgCache = c;
    bgCacheW = w;
    bgCacheH = h;
    return c;
  }

  function sceneReady(name) {
    try {
      const Spr = global.YDSprites;
      return !!(Spr && Spr.getScene && Spr.getScene(name));
    } catch (_) {
      return false;
    }
  }

  function drawSceneLayer(ctx, name, w, h) {
    try {
      const Spr = global.YDSprites;
      const img = Spr && Spr.getScene && Spr.getScene(name);
      if (!img) return false;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, w, h);
      return true;
    } catch (_) {
      return false;
    }
  }

  function drawBackground(ctx, w, h, state) {
    const t = (state && state._animT) || 0;
    // 場景分層：ground → mid → core_wall；缺 ground／wall 則回退程式像素底
    // mid 可選；props 喺單位之後畫
    (function drawSceneOrProc() {
      const groundOk = sceneReady('battle_ground');
      const wallOk = sceneReady('core_wall');
      if (groundOk && wallOk) {
        drawSceneLayer(ctx, 'battle_ground', w, h);
        drawSceneLayer(ctx, 'battle_mid', w, h); // 缺檔略過
        drawSceneLayer(ctx, 'core_wall', w, h);
        return;
      }
      ctx.drawImage(ensureBgCache(w, h), 0, 0);
    })();
    // 動態火把閃爍（輕量；PNG／程式底都加）
    const floorTop = GRID.originY - 14;
    const floorBot = GRID.originY + GRID.lanes * (GRID.cellH + GRID.gapY) + 10;
    const wallX = 108;
    for (let i = 0; i < 5; i++) {
      const py = floorTop + 8 + i * ((floorBot - floorTop - 16) / 4);
      const flicker = 0.6 + 0.4 * Math.sin(t * 8 + i);
      ctx.globalAlpha = flicker;
      drawPixelRect(ctx, wallX + 11, py - 4, 6, 6, '#C45C4A');
      drawPixelRect(ctx, wallX + 12, py - 6, 4, 3, '#C9A227');
      ctx.globalAlpha = 1;
    }
  }

  function drawSceneProps(ctx, w, h) {
    // 前景 props：單位／FX 之後；缺檔略過
    drawSceneLayer(ctx, 'battle_props', w, h);
  }

  function drawCore(ctx, state) {
    const { x, y } = CORE;
    const hp = state.coreHp;
    const maxHp = state.coreMax;
    const flash = state.coreHitFlash || 0;
    const t = state._animT || 0;
    const useSceneWall = sceneReady('core_wall') && sceneReady('battle_ground');

    // 有 core_wall PNG 時略過靜態樓體（由場景層負責），只留動態
    if (!useSceneWall) {
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
    // 門＋門環＋門檻
    drawPixelRect(ctx, x - 12, y + 4, 24, 30, '#2A241C');
    drawPixelRect(ctx, x - 8, y + 8, 6, 10, '#3A3228');
    drawPixelRect(ctx, x + 2, y + 8, 6, 10, '#3A3228');
    drawPixelRect(ctx, x + 4, y + 18, 3, 3, '#C9A227');
    drawPixelRect(ctx, x - 6, y + 16, 3, 3, '#C9A227');
    drawPixelRect(ctx, x - 16, y + 32, 32, 4, '#4A4034');
    // 石柱
    drawPixelRect(ctx, x - 40, y - 20, 6, 52, '#5A5040');
    drawPixelRect(ctx, x + 34, y - 20, 6, 52, '#5A5040');
    drawPixelRect(ctx, x - 42, y - 24, 10, 6, '#6A6055');
    drawPixelRect(ctx, x + 32, y - 24, 10, 6, '#6A6055');
    // 瓦簷再一層
    drawPixelRect(ctx, x - 48, y - 54, 96, 4, '#8A3030');
    for (let i = 0; i < 9; i++) {
      drawPixelRect(ctx, x - 44 + i * 10, y - 52, 7, 3, i % 2 ? '#C45C4A' : '#A04040');
    }
    // 匾額陰影
    drawPixelRect(ctx, x - 22, y - 66, 44, 2, '#1A1510');
    } // end !useSceneWall static building

    // 燈籠微動
    const bob = Math.sin(t * 3) * 1.5;
    drawPixelRect(ctx, x - 48, y - 40 + bob, 10, 14, '#C45C4A');
    drawPixelRect(ctx, x - 46, y - 36 + bob, 6, 6, '#C9A227');
    drawPixelRect(ctx, x + 38, y - 40 + bob, 10, 14, '#C45C4A');
    drawPixelRect(ctx, x + 40, y - 36 + bob, 6, 6, '#C9A227');

    if (flash > 0 && !state.reduceFlash) {
      ctx.globalAlpha = Math.min(0.55, flash * 2);
      drawPixelRect(ctx, x - 48, y - 86, 96, 150, '#C45C4A');
      ctx.globalAlpha = 1;
    } else if (flash > 0 && state.reduceFlash) {
      ctx.globalAlpha = Math.min(0.2, flash);
      drawPixelRect(ctx, x - 40, y - 60, 80, 100, '#C45C4A');
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


  /** 畫正式 PNG（48 原生）；失敗回 false → 呼叫方用幾何 */
  function drawUnitSprite(ctx, id, cx, cy, size, attacking, alpha) {
    const Spr = global.YDSprites;
    if (!Spr) return false;
    const frame = Spr.getFrame(id, !!attacking);
    if (!frame) {
      // 觸發懶載（唔等）
      try { Spr.ensure(id); } catch (_) {}
      return false;
    }
    const prev = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    const s = Math.round(size);
    ctx.drawImage(frame, Math.round(cx - s / 2), Math.round(cy - s / 2), s, s);
    ctx.imageSmoothingEnabled = prev;
    return true;
  }

  function drawSilhouette(ctx, h, def, s, ox, oy) {
    const kind = def.silhouette || def.role;
    const ink = '#1A1510';
    const paper = '#E8DCC8';
    const hx = h.x + ox;
    const hy = h.y + oy;
    // 身體
    drawPixelRect(ctx, hx - s, hy - s - 4, s * 2, s * 2 + 8, def.color);
    // 肩甲／衣褶／腰帶（v1.0）
    drawPixelRect(ctx, hx - s - 2, hy - s, 4, 6, ink);
    drawPixelRect(ctx, hx + s - 2, hy - s, 4, 6, ink);
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
    } else if (kind === 'coin' || kind === 'arb') {
      drawPixelRect(ctx, hx + s - 2 + wx, hy - 8 + wy, 12, 12, '#C9A227');
      drawPixelRect(ctx, hx + s + wx, hy - 6 + wy, 8, 8, '#4A7080');
      drawPixelRect(ctx, hx + s + 2 + wx, hy - 4 + wy, 4, 4, '#E8DCC8');
      drawPixelRect(ctx, hx - 10, hy - s - 20, 20, 5, '#4A7080');
    } else if (kind === 'scroll' || kind === 'marker') {
      // 夜盤掮客：捲軸＋提燈
      drawPixelRect(ctx, hx + s - 4 + wx, hy - 12 + wy, 6, 18, paper);
      drawPixelRect(ctx, hx + s - 3 + wx, hy - 10 + wy, 4, 14, '#3A4060');
      drawPixelRect(ctx, hx + s - 2 + wx, hy - 8 + wy, 2, 10, '#C9A227');
      drawPixelRect(ctx, hx - s - 10, hy - 6, 8, 10, '#C45C4A');
      drawPixelRect(ctx, hx - s - 8, hy - 3, 4, 4, '#C9A227');
      drawPixelRect(ctx, hx - 10, hy - s - 22, 20, 5, '#3A4060');
      drawPixelRect(ctx, hx - 4, hy - s - 28, 8, 6, '#C9A227');
    } else if (kind === 'gourd' || kind === 'medic') {
      // 抄底居士：葫蘆＋布袋
      drawPixelRect(ctx, hx + s - 2 + wx, hy - 4 + wy, 10, 14, '#508070');
      drawPixelRect(ctx, hx + s + wx, hy - 8 + wy, 8, 6, '#3A7A6A');
      drawPixelRect(ctx, hx + s + 2 + wx, hy - 10 + wy, 4, 4, '#C9A227');
      drawPixelRect(ctx, hx - s - 10, hy + 2, 9, 10, '#5A4030');
      drawPixelRect(ctx, hx - s - 8, hy + 4, 5, 5, '#C9A227');
      drawPixelRect(ctx, hx - 12, hy - s - 20, 24, 5, '#508070');
      drawPixelRect(ctx, hx - 6, hy - s - 26, 12, 6, paper);
    } else if (kind === 'brush' || kind === 'locker') {
      // 鎖倉居士：鐵筆＋印匣
      drawPixelRect(ctx, hx + s - 4 + wx, hy - 16 + wy, 3, 24, ink);
      drawPixelRect(ctx, hx + s - 6 + wx, hy - 18 + wy, 7, 4, '#406858');
      drawPixelRect(ctx, hx + s - 2 + wx, hy + 6 + wy, 5, 3, '#C9A227');
      drawPixelRect(ctx, hx - s - 10, hy + 0, 9, 8, '#5A4030');
      drawPixelRect(ctx, hx - s - 8, hy + 2, 5, 4, '#C45C4A');
      drawPixelRect(ctx, hx - 12, hy - s - 20, 24, 5, '#406858');
      drawPixelRect(ctx, hx - 6, hy - s - 26, 12, 6, paper);
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
      if (occ.uid !== from.uid && from.id === occ.id && from.star === occ.star && from.star < MAX_STAR) {
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
    // 門派色環（可讀辨識）
    if (!ghost) {
      drawPixelRect(ctx, h.x - 12 + lean, h.y + 16, 24, 3, def.color);
      drawPixelRect(ctx, h.x - 10 + lean, h.y + 17, 20, 1, '#1A1510');
    }

    if (h.star >= 3 && !ghost) {
      const pulse = 0.35 + 0.25 * Math.sin(t * 5);
      const glow = h.star >= MAX_STAR ? '#E8C96A' : '#C9A227';
      ctx.globalAlpha = alpha * (h.star >= MAX_STAR ? pulse + 0.1 : pulse);
      drawPixelRect(ctx, h.x - s - 6 + lean, h.y - s - 22 + idle, s * 2 + 12, s * 2 + 40, glow);
      ctx.globalAlpha = alpha;
    }

    const sprSize = 36 + h.star * 4;
    const usedSpr = drawUnitSprite(
      ctx,
      h.id,
      h.x + lean,
      h.y - 4 + idle,
      sprSize,
      h.swingT > 0,
      alpha
    );
    if (!usedSpr) {
      drawSilhouette(ctx, h, def, s, lean, idle);
      // 單字門派標（辨識；PNG 自身已夠辨識就唔疊）
      if (!ghost && def.name) {
        ctx.fillStyle = '#1A1510';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(def.name.charAt(0), h.x + lean - s - 2, h.y - s - 8 + idle);
        ctx.fillStyle = def.color;
        ctx.fillText(def.name.charAt(0), h.x + lean - s - 3, h.y - s - 9 + idle);
      }
    }

    if (h.atkBuffT > 0 && !ghost) {
      drawPixelRect(ctx, h.x + s + 2 + lean, h.y - s - 18 + idle, 6, 6, '#C9A227');
    }
    if (!ghost && h.id === 'lock_hermit') {
      const every = (def.skill && def.skill.every) || 4;
      const prog = ((h.atkCount || 0) % every) / every;
      drawPixelRect(ctx, h.x - 8 + lean, h.y + 42, 16, 4, '#1A1510');
      drawPixelRect(ctx, h.x - 8 + lean, h.y + 42, Math.max(1, 16 * prog), 4, '#406858');
      if (prog >= 0.75) {
        ctx.fillStyle = '#C9A227';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('印', h.x + lean, h.y + 54);
      }
    }
    if (h.guardProcT > 0 && !ghost) {
      ctx.globalAlpha = alpha * 0.5;
      ctx.strokeStyle = '#C9A227';
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x - s - 8 + lean, h.y - s - 20 + idle, s * 2 + 16, s * 2 + 36);
      ctx.globalAlpha = alpha;
    }

    ctx.fillStyle = h.star >= 3 ? COLORS.gold : COLORS.silver;
    ctx.font = h.star >= 4 ? 'bold 10px sans-serif' : '10px sans-serif';
    ctx.textAlign = 'center';
    const starLabel = h.star >= 4 ? '★★★★' : '★'.repeat(h.star);
    ctx.fillText(starLabel, h.x + lean, h.y + 30);
    if (!ghost && upgradeLabel) {
      const ul = upgradeLabel(h);
      if (ul) {
        ctx.fillStyle = '#C9A227';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(ul, h.x + lean, h.y + 40);
      }
    }

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

    if (h.stunT > 0 && !ghost) {
      ctx.globalAlpha = alpha * 0.85;
      ctx.strokeStyle = '#C9A227';
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x - s - 8 + lean, h.y - s - 26 + idle, s * 2 + 16, s * 2 + 44);
      ctx.fillStyle = '#C9A227';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('停', h.x + lean, h.y - s - 30 + idle);
      ctx.globalAlpha = alpha;
    }
    if (selected || mergeMark) {
      ctx.strokeStyle = mergeMark ? COLORS.gold : COLORS.cinnabar;
      ctx.lineWidth = 2;
      ctx.strokeRect(h.x - s - 6 + lean, h.y - s - 24 + idle, s * 2 + 12, s * 2 + 42);
    }
    if (h.star >= 3) {
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = h.star >= MAX_STAR ? 3 : 2;
      ctx.strokeRect(h.x - s - 3 + lean, h.y - s - 8 + idle, s * 2 + 6, s * 2 + 14);
      if (h.star >= MAX_STAR) {
        ctx.fillStyle = COLORS.gold;
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('滿', h.x + lean, h.y - s - 30 + idle);
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawEnemy(ctx, e, state) {
    const r = e.radius;
    const t = (state && state._animT) || 0;
    const bob = Math.sin(t * 5 + e.x * 0.05) * 1.2;
    let baseA = 1;
    if (e.def && e.def.stealth) {
      const pulse = 0.45 + 0.35 * Math.sin(t * 4 + e.x * 0.03);
      baseA = e.rushT > 0 ? 0.35 : pulse;
    }
    if (e.hitFlash > 0) ctx.globalAlpha = baseA * (0.55 + Math.sin(e.hitFlash * 50) * 0.3);
    else ctx.globalAlpha = baseA;
    const eSize = Math.max(28, r * 2 + 8 + (e.boss ? 10 : 0) + (e.elite ? 4 : 0));
    const eSpr = drawUnitSprite(
      ctx,
      e.id || (e.def && e.def.id),
      e.x,
      e.y + bob,
      eSize,
      e.mode === 'fight',
      ctx.globalAlpha
    );
    if (!eSpr) {
      // 身體＋簡單特徵（無 PNG）
      drawPixelRect(ctx, e.x - r, e.y - r + bob, r * 2, r * 2, e.def.color);
      drawPixelRect(ctx, e.x - r + 2, e.y - r + 4 + bob, r * 2 - 4, 3, '#1A1510');
      drawPixelRect(ctx, e.x - r + 2, e.y - r + 2 + bob, 3, 3, '#1A1510');
      drawPixelRect(ctx, e.x + r - 5, e.y - r + 2 + bob, 3, 3, '#1A1510');
      drawPixelRect(ctx, e.x - 3, e.y + 2 + bob, 6, 2, '#E8DCC8');
      if (e.def && e.def.stealth) {
        drawPixelRect(ctx, e.x - r - 4, e.y - 2 + bob, 4, 8, '#1A1510');
        drawPixelRect(ctx, e.x + r, e.y - 2 + bob, 4, 8, '#1A1510');
        drawPixelRect(ctx, e.x - 2, e.y - r - 4 + bob, 4, 3, '#5A4060');
      }
    }
    if (e.darkMarkT > 0) {
      ctx.strokeStyle = '#3A4060';
      ctx.lineWidth = 2;
      ctx.strokeRect(e.x - r - 4, e.y - r - 4 + bob, r * 2 + 8, r * 2 + 8);
      drawPixelRect(ctx, e.x - 5, e.y - r - 12 + bob, 10, 4, '#C9A227');
    }
    if (e.lockT > 0) {
      ctx.strokeStyle = '#406858';
      ctx.lineWidth = 2;
      ctx.strokeRect(e.x - r - 5, e.y - r - 5 + bob, r * 2 + 10, r * 2 + 10);
      drawPixelRect(ctx, e.x - 10, e.y - r - 16 + bob, 20, 10, '#406858');
      drawPixelRect(ctx, e.x - 8, e.y - r - 14 + bob, 16, 6, '#1A1510');
      ctx.fillStyle = '#C9A227';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      const cut = e.lockAtkMul != null ? Math.round((1 - e.lockAtkMul) * 100) : 0;
      ctx.fillText('鎖' + (cut ? cut : ''), e.x, e.y - r - 8 + bob);
    }
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
    if (e.skillFlash > 0) {
      ctx.globalAlpha = Math.min(1, e.skillFlash * 2);
      ctx.strokeStyle = '#E8DCC8';
      ctx.lineWidth = 3;
      ctx.strokeRect(e.x - r - 6, e.y - r - 6 + bob, r * 2 + 12, r * 2 + 12);
      ctx.globalAlpha = 1;
    }
    if (e.mode === 'fight') {
      ctx.strokeStyle = '#C45C4A';
      ctx.lineWidth = 2;
      ctx.strokeRect(e.x - r - 1, e.y - r - 1 + bob, r * 2 + 2, r * 2 + 2);
    }
    if (e.boss) {
      const circuit = e.id === 'circuit_swan';
      ctx.strokeStyle = circuit ? '#E8C96A' : '#C9A227';
      ctx.lineWidth = circuit ? 3 : 2;
      ctx.strokeRect(e.x - r - 2, e.y - r - 2 + bob, r * 2 + 4, r * 2 + 4);
      ctx.fillStyle = circuit ? '#E8C96A' : '#C9A227';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(circuit ? '熔斷天鵝' : '黑天鵝', e.x, e.y - r - 8 + bob);
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
        const maxL = 0.55;
        ctx.globalAlpha = Math.min(0.95, t * 2.2);
        ctx.strokeStyle = fx.color || '#C9A227';
        ctx.lineWidth = 3;
        const rr = (fx.r || 18) + (1 - t / maxL) * 22;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, rr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(26,21,16,0.35)';
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, rr * 0.55, 0, Math.PI * 2);
        ctx.fill();
        if (fx.text) {
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.strokeStyle = '#1A1510';
          ctx.lineWidth = 4;
          ctx.strokeText(fx.text, fx.x, fx.y - rr - 6);
          ctx.fillStyle = fx.color || '#C9A227';
          ctx.fillText(fx.text, fx.x, fx.y - rr - 6);
        }
        ctx.globalAlpha = 1;
      } else if (fx.type === 'merge') {
        const t = Math.max(0, fx.life);
        const maxL = 0.7;
        const p = 1 - t / maxL;
        ctx.globalAlpha = Math.min(1, t * 2.2);
        ctx.strokeStyle = '#C9A227';
        ctx.lineWidth = 3;
        const rr = 14 + p * 40;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, rr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#E8DCC8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, rr * 0.72, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2 + p * 2.4;
          const dx = Math.cos(ang) * rr * 0.85;
          const dy = Math.sin(ang) * rr * 0.85;
          drawPixelRect(ctx, fx.x + dx - 2, fx.y + dy - 2, 4, 4, i % 2 ? '#C9A227' : '#E8DCC8');
        }
        const label =
          fx.fromStar != null
            ? '★' + fx.fromStar + '→★' + (fx.star || '')
            : '★' + (fx.star || '');
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#1A1510';
        ctx.lineWidth = 4;
        ctx.strokeText(label, fx.x, fx.y - rr - 6);
        ctx.fillStyle = '#C9A227';
        ctx.fillText(label, fx.x, fx.y - rr - 6);
        ctx.globalAlpha = 1;
      } else if (fx.type === 'upgrade') {
        const t = Math.max(0, fx.life);
        ctx.globalAlpha = Math.min(0.95, t * 2);
        ctx.strokeStyle = fx.color || '#D4AF37';
        ctx.lineWidth = 3;
        const rr = 10 + (1 - t / 0.65) * 26;
        ctx.strokeRect(fx.x - rr, fx.y - rr * 0.7, rr * 2, rr * 1.4);
        if (fx.text) {
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.strokeStyle = '#1A1510';
          ctx.lineWidth = 3;
          ctx.strokeText(fx.text, fx.x, fx.y - rr - 4);
          ctx.fillStyle = fx.color || '#D4AF37';
          ctx.fillText(fx.text, fx.x, fx.y - rr - 4);
        }
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
      } else if (fx.type === 'slash') {
        const t = Math.max(0, fx.life);
        const p = 1 - t / 0.22;
        ctx.globalAlpha = Math.min(0.95, t * 4);
        ctx.strokeStyle = fx.color || '#C9A227';
        ctx.lineWidth = 3;
        const len = 10 + p * 28;
        ctx.beginPath();
        ctx.moveTo(fx.x - len, fx.y - len * 0.35);
        ctx.lineTo(fx.x + len, fx.y + len * 0.35);
        ctx.stroke();
        ctx.strokeStyle = '#E8DCC8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fx.x - len * 0.7, fx.y - len * 0.55);
        ctx.lineTo(fx.x + len * 0.5, fx.y + len * 0.15);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (fx.type === 'death') {
        const t = Math.max(0, fx.life);
        const maxL = fx.hero ? 0.5 : 0.42;
        const p = 1 - t / maxL;
        const rr = (fx.r || 12) + p * 22;
        ctx.globalAlpha = Math.min(0.9, t * 2.4);
        ctx.strokeStyle = fx.color || '#C9A227';
        ctx.lineWidth = fx.boss ? 3 : 2;
        ctx.beginPath();
        ctx.arc(fx.x, fx.y, rr, 0, Math.PI * 2);
        ctx.stroke();
        const n = fx.boss ? 10 : fx.hero ? 8 : 6;
        for (let i = 0; i < n; i++) {
          const ang = (i / n) * Math.PI * 2 + p * 1.8;
          const dist = rr * (0.55 + p * 0.55);
          const px = fx.x + Math.cos(ang) * dist;
          const py = fx.y + Math.sin(ang) * dist;
          const col = i % 2 ? (fx.color || '#C9A227') : '#1A1510';
          drawPixelRect(ctx, px - 2, py - 2, 4, 4, col);
        }
        if (fx.boss) {
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.strokeStyle = '#1A1510';
          ctx.lineWidth = 3;
          ctx.strokeText('破', fx.x, fx.y - rr - 4);
          ctx.fillStyle = '#C9A227';
          ctx.fillText('破', fx.x, fx.y - rr - 4);
        }
        ctx.globalAlpha = 1;
      } else if (fx.type === 'coreHit') {
        if (!state.reduceFlash) {
          ctx.globalAlpha = Math.min(0.4, fx.life);
          drawPixelRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, '#C45C4A');
          ctx.globalAlpha = 1;
        }
      } else if (fx.type === 'bossWarn') {
        ctx.globalAlpha = Math.min(state.reduceFlash ? 0.1 : 0.28, fx.life * 0.22);
        drawPixelRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, '#5A4060');
        ctx.globalAlpha = 1;
      } else if (fx.type === 'circuitWarn') {
        const pulse = 0.15 + 0.12 * Math.sin((fx.life || 0) * 14);
        ctx.globalAlpha = Math.min(state.reduceFlash ? 0.12 : pulse + 0.18, 0.4);
        drawPixelRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, '#2A1828');
        ctx.globalAlpha = Math.min(0.5, fx.life);
        ctx.strokeStyle = '#C9A227';
        ctx.lineWidth = 4;
        ctx.strokeRect(40, 40, ctx.canvas.width - 80, ctx.canvas.height - 80);
        ctx.globalAlpha = 1;
      } else if (fx.type === 'eliteWarn') {
        ctx.globalAlpha = Math.min(state.reduceFlash ? 0.08 : 0.2, fx.life * 0.18);
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
      const sc = f._scale || 1;
      ctx.globalAlpha = Math.min(1, f.life * 2.2);
      const size = Math.round((f.size || 14) * sc);
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

  function drawModStrip(ctx, state) {
    const mods = state.modifiers;
    if (!mods || !mods.length) return;
    const label = mods.map((m) => m.name).join(' · ');
    ctx.globalAlpha = 0.92;
    drawPixelRect(ctx, 220, 8, 520, 22, '#1A1510');
    ctx.strokeStyle = '#5A4030';
    ctx.lineWidth = 2;
    ctx.strokeRect(220, 8, 520, 22);
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#C9A227';
    ctx.fillText('修飾｜' + label, 480, 23);
    ctx.globalAlpha = 1;
  }


  function drawMilestoneBanner(ctx, state) {
    const b = state.milestoneBanner;
    if (!b || b.life <= 0) return;
    const p = Math.min(1, b.life / (b.maxLife || 2.8));
    const alpha = p > 0.85 ? (1 - p) / 0.15 : p < 0.2 ? p / 0.2 : 1;
    ctx.globalAlpha = Math.min(1, alpha);
    drawPixelRect(ctx, 140, 150, 680, 72, '#1A1510');
    ctx.strokeStyle = '#C9A227';
    ctx.lineWidth = 4;
    ctx.strokeRect(144, 154, 672, 64);
    ctx.fillStyle = '#C9A227';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ 無盡里程碑 · ' + b.name, 480, 186);
    ctx.fillStyle = '#E8DCC8';
    ctx.font = '14px sans-serif';
    ctx.fillText('第 ' + b.wave + ' 波｜獎勵 +' + b.silver + ' 兩', 480, 210);
    ctx.globalAlpha = 1;
  }


  function drawEventBanner(ctx, state) {
    const b = state.eventBanner;
    if (!b || b.life <= 0) return;
    const p = Math.min(1, b.life / (b.maxLife || 2.4));
    const alpha = p > 0.85 ? (1 - p) / 0.15 : p < 0.2 ? p / 0.2 : 1;
    ctx.globalAlpha = Math.min(1, alpha);
    drawPixelRect(ctx, 180, 118, 600, 52, '#1A1510');
    ctx.strokeStyle = b.color || '#3A7A6A';
    ctx.lineWidth = 3;
    ctx.strokeRect(182, 120, 596, 48);
    ctx.fillStyle = b.color || '#3A7A6A';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('市況 · ' + (b.name || '事件'), 480, 142);
    ctx.fillStyle = '#E8DCC8';
    ctx.font = '12px sans-serif';
    ctx.fillText(b.blurb || '', 480, 160);
    ctx.globalAlpha = 1;
  }

  function drawBossBanner(ctx, state) {
    const b = state.bossBanner;
    if (!b || b.life <= 0) return;
    const p = Math.min(1, b.life / (b.maxLife || 2.6));
    const alpha = p > 0.85 ? (1 - p) / 0.15 : p < 0.2 ? p / 0.2 : 1;
    ctx.globalAlpha = Math.min(1, alpha);
    const elite = b.kind === 'elite';
    const circuit = b.kind === 'circuit';
    const h = b.blurb ? 72 : 56;
    drawPixelRect(ctx, 140, 188, 680, h, '#1A1510');
    ctx.strokeStyle = elite ? '#C45C4A' : circuit ? '#E8C96A' : '#C9A227';
    ctx.lineWidth = circuit ? 4 : 3;
    ctx.strokeRect(142, 190, 676, h - 4);
    ctx.fillStyle = elite ? '#C45C4A' : circuit ? '#E8C96A' : '#C9A227';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    const prefix = elite ? '⚔ 精英來襲 — ' : circuit ? '🔔 熔斷 Boss — ' : '⚠ Boss 入場 — ';
    ctx.fillText(prefix + b.name, 480, 222);
    if (b.blurb) {
      ctx.fillStyle = '#E8DCC8';
      ctx.font = '12px sans-serif';
      ctx.fillText(b.blurb, 480, 246);
    }
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
    drawBondStrip(ctx, state);
    drawLockStatus(ctx, state);
  }

  /** v1.7 羈絆狀態列：芯片式可讀 */
  function drawBondStrip(ctx, state) {
    const bonds = state._bonds || [];
    if (!bonds.length) return;
    const chipW = Math.min(118, Math.floor(560 / bonds.length));
    const total = bonds.length * chipW;
    let x = 480 - total / 2;
    const y = 46;
    for (let i = 0; i < bonds.length; i++) {
      const b = bonds[i];
      drawPixelRect(ctx, x + 1, y, chipW - 4, 16, '#1A1510');
      ctx.strokeStyle = '#C9A227';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, y, chipW - 4, 16);
      ctx.fillStyle = '#C9A227';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      const label = b.name.length > 5 ? b.name.slice(0, 5) : b.name;
      ctx.fillText(label, x + chipW / 2 - 1, y + 12);
      x += chipW;
    }
  }

  /** v1.7 鎖倉狀態：場上鎖倉數＋居士印記可讀 */
  function drawLockStatus(ctx, state) {
    let locked = 0;
    for (const e of state.enemies || []) {
      if (e.hp > 0 && e.lockT > 0) locked += 1;
    }
    const hasLocker = (state.heroes || []).some((h) => h.hp > 0 && h.id === 'lock_hermit');
    if (!locked && !hasLocker) return;
    const y = (state._bonds && state._bonds.length) ? 66 : 48;
    drawPixelRect(ctx, 780, y, 160, 20, '#1A1510');
    ctx.strokeStyle = '#406858';
    ctx.lineWidth = 2;
    ctx.strokeRect(780, y, 160, 20);
    ctx.fillStyle = '#406858';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    const procs = state.lockProcs || 0;
    ctx.fillText('鎖倉 ' + locked + (procs ? '｜印' + procs : ''), 860, y + 14);
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
    // _animT／_bonds 由主循環更新，避免每幀重算羈絆
    if (state._animT == null) state._animT = 0;
    ctx.save();
    if (state.shake > 0 && !state.paused) {
      const mag = Math.min(state.reduceShake ? 3 : 6, state.shake * (state.reduceShake ? 14 : 28));
      ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
    }
    drawBackground(ctx, w, h, state); // ground → mid → wall（或缺檔程式底）
    drawCore(ctx, state); // 場景齊則只動態；否則全畫
    drawGrid(ctx, state);
    for (const e of state.enemies) drawEnemy(ctx, e, state);
    drawDragGhost(ctx, state);
    drawFx(ctx, state);
    drawSceneProps(ctx, w, h); // 前景 props（缺檔略過）
    drawModStrip(ctx, state);
    drawEventBanner(ctx, state);
    drawBossBanner(ctx, state);
    drawMilestoneBanner(ctx, state);
    drawBondBanner(ctx, state);
    drawBanner(ctx, state);
    drawPauseVeil(ctx, state);
    ctx.restore();
  }

  global.YDRender = { render, drawPixelRect };
})(window);
