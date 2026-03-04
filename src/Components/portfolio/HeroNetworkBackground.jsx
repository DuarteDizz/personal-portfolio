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

export default function HeroNetworkBackground({ className = '', isActive = true }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const ctxRef = useRef(null);
  const loopRef = useRef(null);
  const drawFrameRef = useRef(null);
  const activeRef = useRef(isActive);

  const stateRef = useRef({
    w: 0,
    h: 0,
    dpr: 1,
    nodes: [],
    edges: [],
    pulses: [],
    lastT: 0,
    lastDrawAt: 0,
    frame: 0,
    reduce: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    ctxRef.current = ctx;

    const st = stateRef.current;
    st.reduce = prefersReducedMotion();

    const initScene = () => {
      const area = st.w * st.h;
      const baseCount = Math.round(clamp(area / 28000, 28, 56));
      const nodeCount = clamp(baseCount, 26, 60);

      st.nodes = [];
      st.edges = [];
      st.pulses = [];
      st.frame = 0;
      st.lastT = 0;
      st.lastDrawAt = 0;

      const speed = clamp(Math.min(st.w, st.h) / 900, 0.65, 1.1);

      for (let i = 0; i < nodeCount; i++) {
        const hub = Math.random() < 0.16;
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
            tint: Math.random() < 0.5 ? 'cyan' : 'teal'
          });
          added++;
        }
      }

      st.edges = edges.slice(0, 120);
    };

    const spawnPulse = (tNow) => {
      if (st.edges.length === 0) return;
      const maxPulses = Math.min(10, Math.max(4, Math.floor(st.nodes.length / 7)));
      if (st.pulses.length >= maxPulses) return;

      const edgeIndex = Math.floor(Math.random() * st.edges.length);
      const e = st.edges[edgeIndex];
      const dir = Math.random() < 0.5 ? 1 : -1;
      const speed = rand(90, 170);

      st.pulses.push({
        edgeIndex,
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

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        n.x += n.vx * dt * 60;
        n.y += n.vy * dt * 60;
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

      st.frame += 1;
      if (st.frame % 14 === 0) rebuildEdges();

      const spawnChance = dt * 0.9;
      if (Math.random() < spawnChance) spawnPulse(tNow);

      for (let p = st.pulses.length - 1; p >= 0; p--) {
        const pulse = st.pulses[p];
        const e = st.edges[pulse.edgeIndex];
        if (!e) {
          st.pulses.splice(p, 1);
          continue;
        }

        const len = Math.max(1, e.d);
        const deltaT = (pulse.speed * dt) / len;
        pulse.t += pulse.dir * deltaT;

        if (pulse.t >= 1 || pulse.t <= 0) {
          const dstIndex = pulse.dir === 1 ? e.j : e.i;
          const dst = st.nodes[dstIndex];
          if (dst) dst.pingUntil = tNow + rand(160, 240);
          st.pulses.splice(p, 1);
        }
      }
    };

    const drawFrame = (tNow, isStatic = false) => {
      const localCtx = ctxRef.current;
      if (!localCtx) return;

      const { w, h, nodes, edges, pulses } = st;
      if (w <= 1 || h <= 1) return;

      const dark = isDarkMode();

      localCtx.clearRect(0, 0, w, h);

      const maxDist = Math.max(220, Math.min(w, h) * 0.42);
      localCtx.lineCap = 'round';

      for (let k = 0; k < edges.length; k++) {
        const e = edges[k];
        const a = nodes[e.i];
        const b = nodes[e.j];
        if (!a || !b) continue;

        const strength = clamp(1 - e.d / maxDist, 0, 1);
        const baseA = dark ? 0.14 : 0.18;
        const alpha = baseA * (0.25 + 0.75 * strength);

        localCtx.strokeStyle =
          e.tint === 'cyan'
            ? `rgba(34,211,238,${alpha})`
            : `rgba(20,184,166,${alpha})`;

        localCtx.lineWidth = 1.0;
        localCtx.beginPath();
        localCtx.moveTo(a.x, a.y);
        localCtx.lineTo(b.x, b.y);
        localCtx.stroke();

        const glowA = dark ? alpha * 0.45 : alpha * 0.35;
        localCtx.strokeStyle =
          e.tint === 'cyan'
            ? `rgba(34,211,238,${glowA})`
            : `rgba(20,184,166,${glowA})`;
        localCtx.lineWidth = 2.2;
        localCtx.beginPath();
        localCtx.moveTo(a.x, a.y);
        localCtx.lineTo(b.x, b.y);
        localCtx.stroke();
      }

      for (let p = 0; p < pulses.length; p++) {
        const pulse = pulses[p];
        const e = edges[pulse.edgeIndex];
        if (!e) continue;

        const a = nodes[e.i];
        const b = nodes[e.j];
        if (!a || !b) continue;

        const edgeT = clamp(pulse.t, 0, 1);
        const x = a.x + (b.x - a.x) * edgeT;
        const y = a.y + (b.y - a.y) * edgeT;
        const alpha = dark ? 0.55 : 0.50;

        localCtx.fillStyle =
          pulse.tint === 'cyan'
            ? `rgba(34,211,238,${alpha})`
            : `rgba(20,184,166,${alpha})`;
        localCtx.beginPath();
        localCtx.arc(x, y, 2.0, 0, Math.PI * 2);
        localCtx.fill();

        localCtx.fillStyle =
          pulse.tint === 'cyan'
            ? `rgba(34,211,238,${alpha * 0.22})`
            : `rgba(20,184,166,${alpha * 0.22})`;
        localCtx.beginPath();
        localCtx.arc(x, y, 5.0, 0, Math.PI * 2);
        localCtx.fill();
      }

      const timeSec = tNow * 0.001;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const breathe = 1 + n.breathAmp * Math.sin(timeSec * n.breathSpd + n.breathPh);
        let r = n.baseR * breathe;

        if (!isStatic && n.pingUntil > tNow) {
          const tLeft = (n.pingUntil - tNow) / 220;
          const ping = clamp(tLeft, 0, 1);
          r *= 1 + 0.28 * ping;
        }

        const coreAlpha = dark ? 0.55 : 0.48;
        const glowAlpha = dark ? 0.16 : 0.12;

        localCtx.fillStyle =
          n.tint === 'cyan'
            ? `rgba(34,211,238,${glowAlpha})`
            : `rgba(20,184,166,${glowAlpha})`;
        localCtx.beginPath();
        localCtx.arc(n.x, n.y, r * 3.2, 0, Math.PI * 2);
        localCtx.fill();

        localCtx.fillStyle =
          n.tint === 'cyan'
            ? `rgba(34,211,238,${coreAlpha})`
            : `rgba(20,184,166,${coreAlpha})`;
        localCtx.beginPath();
        localCtx.arc(n.x, n.y, r, 0, Math.PI * 2);
        localCtx.fill();
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      const localCtx = ctxRef.current;
      if (!parent || !localCtx) return;

      const rect = parent.getBoundingClientRect();
      st.w = Math.max(1, Math.floor(rect.width));
      st.h = Math.max(1, Math.floor(rect.height));
      st.dpr = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = Math.floor(st.w * st.dpr);
      canvas.height = Math.floor(st.h * st.dpr);
      canvas.style.width = `${st.w}px`;
      canvas.style.height = `${st.h}px`;
      localCtx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);

      initScene();
      drawFrame(performance.now(), true);
    };

    const targetFrameMs = 1000 / 30;

    const loop = (tNow) => {
      if (!activeRef.current || st.reduce || document.hidden) {
        rafRef.current = null;
        st.lastT = 0;
        st.lastDrawAt = 0;
        drawFrame(tNow || performance.now(), true);
        return;
      }

      if (st.lastDrawAt && tNow - st.lastDrawAt < targetFrameMs) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const dt = st.lastT ? clamp((tNow - st.lastT) / 1000, 0, 0.05) : targetFrameMs / 1000;
      st.lastT = tNow;
      st.lastDrawAt = tNow;

      step(dt, tNow);
      drawFrame(tNow, false);

      rafRef.current = requestAnimationFrame(loop);
    };

    drawFrameRef.current = drawFrame;
    loopRef.current = loop;

    const onVisibility = () => {
      st.lastT = 0;
      st.lastDrawAt = 0;

      if (!document.hidden && activeRef.current && !st.reduce && !rafRef.current && loopRef.current) {
        rafRef.current = requestAnimationFrame(loopRef.current);
      }
    };

    const onMotionPref = () => {
      st.reduce = prefersReducedMotion();
      st.lastT = 0;
      st.lastDrawAt = 0;

      if (st.reduce && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      drawFrameRef.current?.(performance.now(), true);

      if (!st.reduce && activeRef.current && !document.hidden && !rafRef.current && loopRef.current) {
        rafRef.current = requestAnimationFrame(loopRef.current);
      }
    };

    const mm = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    mm?.addEventListener?.('change', onMotionPref);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', resize, { passive: true });

    resize();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      loopRef.current = null;
      drawFrameRef.current = null;
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      mm?.removeEventListener?.('change', onMotionPref);
    };
  }, []);

  useEffect(() => {
    activeRef.current = isActive;

    const st = stateRef.current;
    st.lastT = 0;
    st.lastDrawAt = 0;

    if (!isActive) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      drawFrameRef.current?.(performance.now(), true);
      return;
    }

    if (!st.reduce && !document.hidden && !rafRef.current && loopRef.current) {
      rafRef.current = requestAnimationFrame(loopRef.current);
    }
  }, [isActive]);

  return (
    <div aria-hidden className={`absolute inset-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-white/[0.06] dark:bg-slate-950/[0.04] backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white/70 dark:from-slate-950/70 dark:to-slate-950/70" />
    </div>
  );
}
