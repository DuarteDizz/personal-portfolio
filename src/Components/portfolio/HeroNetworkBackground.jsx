import React, { useEffect, useRef } from 'react';

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

function isDarkMode() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default function HeroNetworkBackground({ className = '' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const stateRef = useRef({
    w: 0,
    h: 0,
    dpr: 1,
    nodes: [],
    edges: [],
    pulses: [],
    lastT: 0,
    frame: 0,
    reduce: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    const st = stateRef.current;
    st.reduce = prefersReducedMotion();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      st.w = Math.max(1, Math.floor(rect.width));
      st.h = Math.max(1, Math.floor(rect.height));
      st.dpr = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = Math.floor(st.w * st.dpr);
      canvas.height = Math.floor(st.h * st.dpr);
      canvas.style.width = `${st.w}px`;
      canvas.style.height = `${st.h}px`;
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);

      initScene();
      drawFrame(0, true);
    };

    const initScene = () => {
      const area = st.w * st.h;

      // Responsive node count (kept modest for perf)
      const baseCount = Math.round(clamp(area / 28000, 28, 56)); // ~30–56
      const nodeCount = clamp(baseCount, 26, 60);

      st.nodes = [];
      st.edges = [];
      st.pulses = [];
      st.frame = 0;
      st.lastT = 0;

      // motion scales with viewport
      const speed = clamp(Math.min(st.w, st.h) / 900, 0.65, 1.1);

      for (let i = 0; i < nodeCount; i++) {
        const hub = Math.random() < 0.16; // a few larger hubs
        const baseR = hub ? rand(4.2, 6.2) : rand(2.0, 4.6);
        st.nodes.push({
          x: rand(0, st.w),
          y: rand(0, st.h),
          vx: rand(-0.18, 0.18) * speed,
          vy: rand(-0.14, 0.14) * speed,
          baseR,
          breathAmp: rand(0.10, 0.22),
          breathSpd: rand(0.6, 1.25),
          breathPh: rand(0, Math.PI * 2),
          tint: Math.random() < 0.5 ? 'cyan' : 'teal',
          pingUntil: 0
        });
      }

      rebuildEdges();
    };

    const rebuildEdges = () => {
      const nodes = st.nodes;
      const N = nodes.length;
      const edges = [];
      if (N < 2) {
        st.edges = edges;
        return;
      }

      // connect each node to K nearest neighbors within threshold
      const K = 3;
      const maxDist = Math.max(220, Math.min(st.w, st.h) * 0.42);

      const seen = new Set();

      for (let i = 0; i < N; i++) {
        const a = nodes[i];
        const dists = [];

        for (let j = 0; j < N; j++) {
          if (i === j) continue;
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d2 = dx * dx + dy * dy;
          dists.push({ j, d2 });
        }

        dists.sort((p, q) => p.d2 - q.d2);

        let added = 0;
        for (let k = 0; k < dists.length && added < K; k++) {
          const j = dists[k].j;
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          if (d > maxDist) continue;

          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (seen.has(key)) continue;
          seen.add(key);

          edges.push({
            i,
            j,
            d,
            // small variation so lines aren't uniform
            tint: Math.random() < 0.5 ? 'cyan' : 'teal'
          });
          added++;
        }
      }

      // hard cap edges for perf
      st.edges = edges.slice(0, 120);
    };

    const spawnPulse = (tNow) => {
      if (st.edges.length === 0) return;
      const maxPulses = Math.min(10, Math.max(4, Math.floor(st.nodes.length / 7)));
      if (st.pulses.length >= maxPulses) return;

      const e = st.edges[Math.floor(Math.random() * st.edges.length)];
      const dir = Math.random() < 0.5 ? 1 : -1;

      // speed is in px/sec roughly
      const speed = rand(90, 170);
      st.pulses.push({
        edgeIndex: st.edges.indexOf(e),
        t: dir === 1 ? 0 : 1,
        dir,
        speed,
        born: tNow,
        tint: Math.random() < 0.5 ? 'cyan' : 'teal'
      });
    };

    const step = (dt, tNow) => {
      const nodes = st.nodes;
      const w = st.w;
      const h = st.h;

      // update node positions (subtle drift + bounce)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        n.x += n.vx * dt * 60;
        n.y += n.vy * dt * 60;

        // gentle extra wobble (super subtle)
        n.x += Math.sin((tNow * 0.001) * (0.6 + i * 0.002)) * 0.04;
        n.y += Math.cos((tNow * 0.001) * (0.7 + i * 0.002)) * 0.04;

        if (n.x < 0) {
          n.x = 0;
          n.vx *= -1;
        } else if (n.x > w) {
          n.x = w;
          n.vx *= -1;
        }

        if (n.y < 0) {
          n.y = 0;
          n.vy *= -1;
        } else if (n.y > h) {
          n.y = h;
          n.vy *= -1;
        }
      }

      // refresh edges occasionally (not every frame)
      st.frame++;
      if (st.frame % 14 === 0) rebuildEdges();

      // spawn pulses at a low rate
      const spawnChance = dt * 0.9; // ~0.9 pulses/sec average
      if (Math.random() < spawnChance) spawnPulse(tNow);

      // move pulses
      const pulses = st.pulses;
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        const e = st.edges[pulse.edgeIndex];
        if (!e) {
          pulses.splice(p, 1);
          continue;
        }

        // advance based on edge length
        const len = Math.max(1, e.d);
        const deltaT = (pulse.speed * dt) / len;
        pulse.t += pulse.dir * deltaT;

        // reached end?
        if (pulse.t >= 1 || pulse.t <= 0) {
          const dstIndex = pulse.dir === 1 ? e.j : e.i;
          const dst = st.nodes[dstIndex];
          if (dst) dst.pingUntil = tNow + rand(160, 240);
          pulses.splice(p, 1);
        }
      }
    };

    const drawFrame = (tNow, isStatic = false) => {
      const { w, h, nodes, edges, pulses } = st;
      if (w <= 1 || h <= 1) return;

      const dark = isDarkMode();

      ctx.clearRect(0, 0, w, h);

      // --- edges ---
      const maxDist = Math.max(220, Math.min(w, h) * 0.42);
      ctx.lineCap = 'round';

      for (let k = 0; k < edges.length; k++) {
        const e = edges[k];
        const a = nodes[e.i];
        const b = nodes[e.j];
        if (!a || !b) continue;

        const strength = clamp(1 - e.d / maxDist, 0, 1);

        // cyan/teal with subtle variation
        const baseA = dark ? 0.14 : 0.18;
        const alpha = baseA * (0.25 + 0.75 * strength);

        const cyan = `rgba(34,211,238,${alpha})`;
        const teal = `rgba(20,184,166,${alpha})`;
        ctx.strokeStyle = e.tint === 'cyan' ? cyan : teal;

        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        // faint glow pass (cheap)
        const glowA = dark ? alpha * 0.45 : alpha * 0.35;
        ctx.strokeStyle =
          e.tint === 'cyan'
            ? `rgba(34,211,238,${glowA})`
            : `rgba(20,184,166,${glowA})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // --- pulses ---
      for (let p = 0; p < pulses.length; p++) {
        const pulse = pulses[p];
        const e = edges[pulse.edgeIndex];
        if (!e) continue;

        const a = nodes[e.i];
        const b = nodes[e.j];
        if (!a || !b) continue;

        const t = clamp(pulse.t, 0, 1);
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;

        const alpha = dark ? 0.55 : 0.50;
        const col =
          pulse.tint === 'cyan'
            ? `rgba(34,211,238,${alpha})`
            : `rgba(20,184,166,${alpha})`;

        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(x, y, 2.0, 0, Math.PI * 2);
        ctx.fill();

        // tiny halo
        ctx.fillStyle =
          pulse.tint === 'cyan'
            ? `rgba(34,211,238,${alpha * 0.22})`
            : `rgba(20,184,166,${alpha * 0.22})`;
        ctx.beginPath();
        ctx.arc(x, y, 5.0, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- nodes ---
      const timeSec = tNow * 0.001;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        const breathe = 1 + n.breathAmp * Math.sin(timeSec * n.breathSpd + n.breathPh);
        let r = n.baseR * breathe;

        // ping effect when pulse reaches node
        if (!isStatic && n.pingUntil > tNow) {
          const tLeft = (n.pingUntil - tNow) / 220;
          const ping = clamp(tLeft, 0, 1);
          r *= 1 + 0.28 * ping;
        }

        const coreAlpha = dark ? 0.55 : 0.48;
        const glowAlpha = dark ? 0.16 : 0.12;

        const cyanCore = `rgba(34,211,238,${coreAlpha})`;
        const tealCore = `rgba(20,184,166,${coreAlpha})`;
        const core = n.tint === 'cyan' ? cyanCore : tealCore;

        const cyanGlow = `rgba(34,211,238,${glowAlpha})`;
        const tealGlow = `rgba(20,184,166,${glowAlpha})`;
        const glow = n.tint === 'cyan' ? cyanGlow : tealGlow;

        // glow
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 3.2, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (tNow) => {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const dt = st.lastT ? clamp((tNow - st.lastT) / 1000, 0, 0.05) : 0.016;
      st.lastT = tNow;

      if (!st.reduce) step(dt, tNow);
      drawFrame(tNow, st.reduce);

      rafRef.current = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      // when tab becomes visible again, reset timing so dt doesn't spike
      st.lastT = 0;
    };

    const onMotionPref = () => {
      st.reduce = prefersReducedMotion();
      drawFrame(performance.now(), true);
    };

    const mm = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    mm?.addEventListener?.('change', onMotionPref);
    document.addEventListener('visibilitychange', onVisibility);

    window.addEventListener('resize', resize, { passive: true });
    resize();

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      mm?.removeEventListener?.('change', onMotionPref);
    };
  }, []);

  return (
    <div aria-hidden className={`absolute inset-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* soft glass wash (keeps it modern + readable) */}
      <div className="absolute inset-0 bg-white/[0.06] dark:bg-slate-950/[0.04] backdrop-blur-[2px]" />

      {/* vignette/fade so background doesn’t compete with content */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white/70 dark:from-slate-950/70 dark:to-slate-950/70" />
    </div>
  );
}
