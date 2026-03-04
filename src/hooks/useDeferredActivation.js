import { useEffect, useState } from 'react';

export default function useDeferredActivation({
  minDelayMs = 120,
  timeoutMs = 1200,
  initiallyActive = false
} = {}) {
  const [isReady, setIsReady] = useState(initiallyActive);

  useEffect(() => {
    if (isReady) return;
    if (typeof window === 'undefined') {
      setIsReady(true);
      return;
    }

    let timeoutId = null;
    let idleId = null;
    let rafA = null;
    let rafB = null;
    let cancelled = false;

    const activate = () => {
      if (!cancelled) setIsReady(true);
    };

    const queueIdle = () => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(activate, { timeout: timeoutMs });
      } else {
        timeoutId = window.setTimeout(activate, Math.max(0, minDelayMs));
      }
    };

    timeoutId = window.setTimeout(() => {
      rafA = window.requestAnimationFrame(() => {
        rafB = window.requestAnimationFrame(queueIdle);
      });
    }, Math.max(0, minDelayMs));

    return () => {
      cancelled = true;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      if (rafA !== null) window.cancelAnimationFrame(rafA);
      if (rafB !== null) window.cancelAnimationFrame(rafB);
      if (idleId !== null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [initiallyActive, isReady, minDelayMs, timeoutMs]);

  return isReady;
}
