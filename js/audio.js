/**
 * 銀樓防衛 — Web Audio 極簡蜂鳴 v3.5.0
 * 可關；正式 ogg／wav 仍後備。
 */
(function (global) {
  let ctx = null;
  let unlocked = false;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  function unlock() {
    const c = getCtx();
    if (!c) return;
    if (c.state === 'suspended') {
      c.resume().catch(function () {});
    }
    unlocked = true;
  }

  /** 單音蜂鳴 */
  function tone(freq, dur, type, vol, when) {
    const c = getCtx();
    if (!c || !unlocked) return;
    try {
      const t0 = c.currentTime + (when || 0);
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(Math.max(0.001, vol || 0.06), t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.max(0.03, dur || 0.08));
      o.connect(g);
      g.connect(c.destination);
      o.start(t0);
      o.stop(t0 + Math.max(0.04, dur || 0.08) + 0.02);
    } catch (_) {}
  }

  const KINDS = {
    click: function () {
      tone(520, 0.04, 'square', 0.035);
    },
    summon: function () {
      tone(330, 0.06, 'triangle', 0.05);
      tone(440, 0.08, 'triangle', 0.04, 0.05);
    },
    merge: function () {
      tone(392, 0.07, 'square', 0.05);
      tone(523, 0.1, 'square', 0.045, 0.06);
      tone(659, 0.12, 'triangle', 0.04, 0.12);
    },
    upgrade: function () {
      tone(440, 0.05, 'triangle', 0.045);
      tone(660, 0.09, 'triangle', 0.05, 0.05);
    },
    hit: function () {
      tone(180, 0.035, 'square', 0.028);
    },
    crit: function () {
      tone(260, 0.04, 'square', 0.04);
      tone(420, 0.05, 'triangle', 0.03, 0.03);
    },
    hurt: function () {
      tone(140, 0.07, 'sawtooth', 0.03);
    },
    core: function () {
      tone(90, 0.12, 'sawtooth', 0.05);
      tone(70, 0.16, 'square', 0.035, 0.05);
    },
    wave: function () {
      tone(220, 0.08, 'triangle', 0.04);
      tone(277, 0.1, 'triangle', 0.035, 0.07);
    },
    win: function () {
      tone(392, 0.1, 'triangle', 0.05);
      tone(494, 0.1, 'triangle', 0.045, 0.1);
      tone(587, 0.14, 'triangle', 0.05, 0.2);
    },
    lose: function () {
      tone(220, 0.14, 'sawtooth', 0.04);
      tone(165, 0.18, 'sawtooth', 0.035, 0.12);
    },
    boss: function () {
      tone(110, 0.16, 'square', 0.055);
      tone(82, 0.2, 'sawtooth', 0.04, 0.08);
    },
    elite: function () {
      tone(300, 0.08, 'square', 0.04);
      tone(200, 0.1, 'triangle', 0.035, 0.06);
    },
    skill: function () {
      tone(600, 0.05, 'triangle', 0.035);
      tone(800, 0.06, 'triangle', 0.03, 0.04);
    },
    // v3.5：蜂鳴分層（唔加外部音檔）
    penta: function () {
      tone(98, 0.14, 'square', 0.05);
      tone(130, 0.12, 'sawtooth', 0.035, 0.06);
      tone(196, 0.1, 'triangle', 0.04, 0.14);
      tone(247, 0.08, 'triangle', 0.03, 0.22);
    },
    mirage: function () {
      tone(156, 0.1, 'triangle', 0.04);
      tone(233, 0.12, 'sine', 0.035, 0.07);
      tone(311, 0.09, 'triangle', 0.028, 0.15);
    },
    dual_penta: function () {
      tone(87, 0.16, 'square', 0.055);
      tone(110, 0.14, 'sawtooth', 0.04, 0.05);
      tone(146, 0.12, 'triangle', 0.038, 0.14);
      tone(220, 0.1, 'triangle', 0.032, 0.24);
      tone(277, 0.08, 'sine', 0.025, 0.32);
    },
    tax_stack: function () {
      tone(180, 0.06, 'triangle', 0.035);
      tone(240, 0.07, 'triangle', 0.03, 0.05);
      tone(320, 0.08, 'sine', 0.028, 0.1);
    },
    // v3.7：雙五符咒／九池蜂鳴分層（無外部音檔）
    dual_penta_charm: function () {
      tone(92, 0.12, 'square', 0.045);
      tone(138, 0.1, 'triangle', 0.038, 0.06);
      tone(207, 0.1, 'sine', 0.032, 0.14);
      tone(311, 0.08, 'triangle', 0.028, 0.22);
      tone(415, 0.06, 'sine', 0.022, 0.3);
    },
    late350: function () {
      tone(73, 0.14, 'sawtooth', 0.04);
      tone(110, 0.12, 'square', 0.035, 0.08);
      tone(165, 0.1, 'triangle', 0.03, 0.18);
    },
    // v3.8：符咒裝備／十池／回放 buzz
    charm_equip: function () {
      tone(196, 0.07, 'triangle', 0.035);
      tone(247, 0.08, 'sine', 0.03, 0.05);
      tone(330, 0.09, 'triangle', 0.028, 0.12);
    },
    late400: function () {
      tone(65, 0.15, 'sawtooth', 0.042);
      tone(98, 0.12, 'square', 0.036, 0.07);
      tone(147, 0.1, 'triangle', 0.03, 0.16);
      tone(220, 0.08, 'sine', 0.024, 0.26);
    },
    replay: function () {
      tone(180, 0.05, 'triangle', 0.03);
      tone(240, 0.06, 'sine', 0.028, 0.05);
      tone(300, 0.07, 'triangle', 0.025, 0.1);
    },
  };

  let enabled = true;
  let hitThrottle = 0;

  function setEnabled(v) {
    enabled = !!v;
    if (enabled) unlock();
  }

  function isEnabled() {
    return enabled;
  }

  function play(kind) {
    if (!enabled) return;
    unlock();
    const now = performance.now();
    if (kind === 'hit') {
      if (now - hitThrottle < 45) return;
      hitThrottle = now;
    }
    const fn = KINDS[kind];
    if (fn) fn();
  }

  global.YDAudio = {
    unlock,
    play,
    setEnabled,
    isEnabled,
    tone,
  };

  // 首次手勢解鎖（瀏覽器自動播放政策）
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
      window.addEventListener(
        ev,
        function () {
          unlock();
        },
        { once: true, passive: true }
      );
    });
  }
})(window);
