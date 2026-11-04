/**
 * 銀樓防衛 — Web Audio 極簡蜂鳴 v2.0.0
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
