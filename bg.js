/* ──────────────────────────────────────────────
   Cyber Ghost Background
   Black + Orange / Red palette
   Easter eggs: RE4 · DMC · threat actors · sec
   ────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Palette ── */
  const ORANGE  = [255, 85,  0];
  const DEEPLRED = [210, 30, 10];
  const AMBER   = [255, 150, 20];

  function rgb(c, a) { return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }

  /* ── Easter Egg pool ── */
  const EGGS = [
    /* RE4 */
    'What are ya buying?', 'Las Plagas', 'GANADO.EXE',
    'Salazar.dll', 'Krauser_was_here', 'STRANGER→STRANGER',
    'Ashley.process', 'merchant_spawn',
    /* DMC */
    'Son of Sparda', 'MOTIVATION↑', 'DevilTrigger.sys',
    'STYLISH!!', 'jackass.exe', 'vergil_was_right',
    'I need more POWER', 'Sparda.kernel',
    'Yamato.exploit', 'NERO_AGENT', 'V_ghost_process',
    /* Threat actors */
    'APT28::Fancy Bear', 'Lazarus Group', 'Sandworm.ru',
    'Cozy Bear online', 'Dark Caracal', 'Volt Typhoon',
    'Scattered Spider', 'ALPHV/BlackCat',
    /* Tools & TTPs */
    'CobaltStrike.beacon', 'SLIVER_C2', 'Havoc.Framework',
    'LSASS.dump', 'Mimikatz.exe', 'SharpHound',
    'LATERAL_MOVEMENT', 'PERSISTENCE', 'C2_BEACON',
    '0day_acquired', 'CVE-2024-????', 'SHELLCODE_INJECTED',
    /* Flavor */
    'fileless_threat', 'ghost_in_net', 'shadow_broker',
    'eternal_blue', 'ROOTKIT.SYS', 'payload_delivered',
  ];

  /* ── Ghost class ── */
  class Ghost {
    constructor(initRandom) {
      this.spawn(initRandom);
    }

    spawn(anywhere) {
      this.x   = Math.random() * W;
      this.y   = anywhere ? Math.random() * H : H + 80 + Math.random() * 120;
      this.vx  = (Math.random() - 0.5) * 0.35;
      this.vy  = -(0.25 + Math.random() * 0.45);
      this.sz  = 28 + Math.random() * 44;         // body height half-size
      this.phase     = Math.random() * Math.PI * 2;
      this.phaseSpd  = 0.007 + Math.random() * 0.013;
      this.alpha     = 0;
      this.peakAlpha = 0.12 + Math.random() * 0.22;
      this.fadeIn    = true;
      /* eye color alternates orange / red */
      this.eyeRGB = Math.random() > 0.45 ? ORANGE : DEEPLRED;
      this.bodyRGB = Math.random() > 0.45 ? ORANGE : DEEPLRED;
      /* optional: some ghosts are purple (DMC Vergil / spectral) */
      if (Math.random() < 0.2) {
        this.eyeRGB  = [180, 60, 255];
        this.bodyRGB = [140, 40, 200];
      }
    }

    update() {
      this.phase += this.phaseSpd;
      this.x += this.vx + Math.sin(this.phase * 1.3) * 0.25;
      this.y += this.vy + Math.cos(this.phase) * 0.12;

      if (this.fadeIn) {
        this.alpha = Math.min(this.alpha + 0.004, this.peakAlpha);
        if (this.alpha >= this.peakAlpha) this.fadeIn = false;
      }

      /* pulse brightness */
      this.pulseA = this.peakAlpha * (0.7 + 0.3 * Math.sin(this.phase * 2));

      if (this.y < -this.sz * 3) this.spawn(false);
      if (this.x < -150) this.x = W + 60;
      if (this.x >  W + 150) this.x = -60;
    }

    draw() {
      const x = this.x, y = this.y, s = this.sz;
      const w = Math.sin(this.phase) * 0.14;   /* wobble */
      const a = this.pulseA ?? this.alpha;

      ctx.save();
      ctx.globalAlpha = a;

      /* ── outer aura ── */
      const aura = ctx.createRadialGradient(x, y, 0, x, y, s * 2.2);
      aura.addColorStop(0,   rgb(this.bodyRGB, 0.10));
      aura.addColorStop(0.5, rgb(this.bodyRGB, 0.04));
      aura.addColorStop(1,   rgb(this.bodyRGB, 0));
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.ellipse(x, y, s * 1.8, s * 2.4, 0, 0, Math.PI * 2);
      ctx.fill();

      /* ── body outline ── */
      ctx.shadowColor  = rgb(this.eyeRGB, 0.9);
      ctx.shadowBlur   = 18;
      ctx.strokeStyle  = rgb(this.bodyRGB, 0.55);
      ctx.lineWidth    = 1.2;

      const hs = s * 0.38;   /* head semi-width */
      ctx.beginPath();
      /* head arc */
      ctx.arc(x + w * s * 0.8, y - s * 0.25, hs, Math.PI, 0);
      /* right shoulder → mid body */
      ctx.bezierCurveTo(
        x + hs + w * s * 0.5 + s * 0.15, y + s * 0.15,
        x + s * 0.48 + w * s,             y + s * 0.7,
        x + s * 0.32 + w * s * 0.6,       y + s * 1.1
      );
      /* right wisp */
      ctx.bezierCurveTo(
        x + s * 0.18,  y + s * 1.4,
        x + s * 0.08,  y + s * 1.55,
        x,             y + s * 1.45
      );
      /* left wisp */
      ctx.bezierCurveTo(
        x - s * 0.12,  y + s * 1.55,
        x - s * 0.22,  y + s * 1.4,
        x - s * 0.35 + w * s * 0.4, y + s * 1.1
      );
      /* left mid body → shoulder */
      ctx.bezierCurveTo(
        x - s * 0.5 + w * s * 0.8,  y + s * 0.65,
        x - s * 0.5 - w * s * 0.3,  y + s * 0.15,
        x - hs + w * s * 0.8,       y - s * 0.25
      );
      ctx.stroke();

      /* ── face lines (DMC scar / RE4 mask detail) ── */
      ctx.globalAlpha = a * 0.4;
      ctx.strokeStyle = rgb(this.eyeRGB, 0.5);
      ctx.lineWidth   = 0.6;
      ctx.shadowBlur  = 6;
      /* vertical nose line */
      ctx.beginPath();
      ctx.moveTo(x + w * s * 0.8, y - s * 0.38);
      ctx.lineTo(x + w * s * 0.8, y - s * 0.05);
      ctx.stroke();
      /* horizontal brow cut */
      ctx.beginPath();
      ctx.moveTo(x - hs * 0.55 + w * s * 0.5, y - s * 0.35);
      ctx.lineTo(x + hs * 0.55 + w * s * 0.5, y - s * 0.35);
      ctx.stroke();
      ctx.globalAlpha = a;

      /* ── eyes ── */
      ctx.shadowColor = rgb(this.eyeRGB, 1);
      ctx.shadowBlur  = 22;
      const ey = y - s * 0.18 + w * s * 0.15;
      const ex = s * 0.14;

      /* glow bloom */
      ctx.fillStyle = rgb(this.eyeRGB, 0.18);
      ctx.beginPath();
      ctx.ellipse(x - ex + w * s * 0.7, ey, s * 0.13, s * 0.09, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + ex + w * s * 0.7, ey, s * 0.13, s * 0.09, 0, 0, Math.PI * 2);
      ctx.fill();

      /* pupil */
      ctx.fillStyle = rgb(this.eyeRGB, 1);
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.ellipse(x - ex + w * s * 0.7, ey, s * 0.07, s * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + ex + w * s * 0.7, ey, s * 0.07, s * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();

      /* inner white spark */
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(x - ex + w * s * 0.7, ey - s * 0.01, s * 0.025, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + ex + w * s * 0.7, ey - s * 0.01, s * 0.025, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  /* ── Particle class ── */
  class Particle {
    constructor() { this.reset(true); }

    reset(anywhere) {
      this.x    = Math.random() * W;
      this.y    = anywhere ? Math.random() * H : H + 5;
      this.vy   = -(0.4 + Math.random() * 1.4);
      this.vx   = (Math.random() - 0.5) * 0.6;
      this.r    = 0.8 + Math.random() * 2.5;
      this.life = anywhere ? Math.random() : 1.0;
      this.decay = 0.002 + Math.random() * 0.004;
      this.col  = Math.random() < 0.55 ? ORANGE :
                  Math.random() < 0.70 ? DEEPLRED : AMBER;
      this.maxA = 0.3 + Math.random() * 0.4;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      if (this.life <= 0 || this.y < -10) this.reset(false);
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.maxA * this.life;
      ctx.shadowColor = rgb(this.col, 0.8);
      ctx.shadowBlur  = 6;
      ctx.fillStyle   = rgb(this.col, 0.9);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /* ── Easter Egg text class ── */
  class EasterEgg {
    constructor() { this.reset(true); }

    reset(cold) {
      this.text  = EGGS[Math.floor(Math.random() * EGGS.length)];
      this.x     = 40 + Math.random() * (W - 80);
      this.y     = cold
        ? 40 + Math.random() * (H - 80)
        : 60 + Math.random() * (H - 120);
      this.vy    = -(0.08 + Math.random() * 0.14);
      this.alpha = 0;
      this.stage = 'in';
      this.hold  = 0;
      this.maxHold = 90 + Math.random() * 160;
      this.fs    = 8 + Math.floor(Math.random() * 4);
      this.col   = Math.random() < 0.6 ? ORANGE : DEEPLRED;
    }

    update() {
      this.y += this.vy;
      if (this.stage === 'in') {
        this.alpha += 0.012;
        if (this.alpha >= 0.35) { this.alpha = 0.35; this.stage = 'hold'; }
      } else if (this.stage === 'hold') {
        this.hold++;
        if (this.hold >= this.maxHold) this.stage = 'out';
      } else {
        this.alpha -= 0.009;
        if (this.alpha <= 0) this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.font        = `${this.fs}px "JetBrains Mono", monospace`;
      ctx.shadowColor = rgb(this.col, 0.9);
      ctx.shadowBlur  = 8;
      ctx.fillStyle   = rgb(this.col, 1);
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  }

  /* ── Init entities ── */
  const GHOST_COUNT = Math.max(5, Math.min(10, Math.floor(W / 180)));
  const ghosts  = Array.from({ length: GHOST_COUNT }, () => new Ghost(true));
  const parts   = Array.from({ length: 80 }, () => new Particle());
  const eggs    = Array.from({ length: 5 },  () => new EasterEgg());

  /* stagger egg timers */
  eggs.forEach((e, i) => {
    e.stage = 'in';
    e.y += i * (H / 5);
  });

  /* ── Main loop ── */
  function loop() {
    /* trail fade — dark red-tinted */
    ctx.fillStyle = 'rgba(4,1,0,0.18)';
    ctx.fillRect(0, 0, W, H);

    parts.forEach(p => { p.update(); p.draw(); });
    ghosts.forEach(g => { g.update(); g.draw(); });
    eggs.forEach(e => { e.update(); e.draw(); });

    requestAnimationFrame(loop);
  }

  loop();
})();
