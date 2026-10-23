import { useEffect, useRef } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';

/**
 * A plain URL, or a task that resolves once whatever it warms has landed.
 * The function form exists for responsive images, where the caller has to
 * mirror the real `<picture>` to warm the rung the browser will actually pick.
 */
export type Warmable = string | (() => Promise<unknown>);

interface PreloadOptions {
  /** Warmed before the site is revealed. Failures never block. */
  assets: readonly Warmable[];
  /** Floor (ms): the reveal never runs before the choreography has read. */
  minDuration?: number;
  /** Ceiling (ms): a slow or missing asset can never hold the site hostage. */
  maxDuration?: number;
  /** Fired once, from the rAF loop, on the frame progress reaches 1. */
  onComplete: () => void;
}

const VIDEO = /\.(mp4|webm|mov|m4v)$/i;

/** Resolves when the asset is cached, or when it fails. Never rejects. */
function warm(url: string): Promise<void> {
  return new Promise((resolve) => {
    const done = () => resolve();

    if (VIDEO.test(url)) {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.addEventListener('loadeddata', done, { once: true });
      video.addEventListener('error', done, { once: true });
      video.src = url;
      video.load();
      return;
    }

    const image = new Image();
    image.addEventListener('load', done, { once: true });
    image.addEventListener('error', done, { once: true });
    image.src = url;
  });
}

/**
 * Honest load progress, smoothed for the eye.
 *
 * Real completion is the ceiling: the readout never claims more than has
 * actually landed. Elapsed time is the floor: it never sprints past the
 * choreography on a warm cache. A rAF lerp sits between the two so the
 * readout always drifts and never jumps, stalls, or snaps.
 */
export function usePreloadProgress({
  assets,
  minDuration = 1800,
  maxDuration = 6000,
  onComplete,
}: PreloadOptions): MotionValue<number> {
  const progress = useMotionValue(0);

  const completeRef = useRef(onComplete);
  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    let start = 0;

    // Every asset, plus webfonts, so the page is never revealed mid swap.
    const total = assets.length + 1;
    let settled = 0;
    const land = () => {
      settled += 1;
    };

    assets.forEach((asset) => {
      const task = typeof asset === 'string' ? warm(asset) : asset();
      task.then(land, land);
    });
    document.fonts.ready.then(land, land);

    let shown = 0;

    const loop = (now: number) => {
      if (cancelled) return;
      if (start === 0) start = now;

      const elapsed = now - start;

      // Time floor, shaped so the readout sets off with intent.
      const paced = Math.min(1, elapsed / minDuration);
      const pacedEased = 1 - Math.pow(1 - paced, 1.55);

      const real = settled / total;
      const expired = elapsed >= maxDuration;

      // Hold below 100 until the last asset lands: never finish on a lie.
      const target = expired
        ? 1
        : Math.min(pacedEased, real === 1 ? 1 : Math.min(real, 0.96));

      // Faster pull on the final run-up so 96 → 100 reads as a resolve,
      // not a crawl.
      shown = Math.min(1, Math.max(0, shown + (target - shown) * (target === 1 ? 0.14 : 0.085)));
      if (target === 1 && 1 - shown < 0.004) shown = 1;

      progress.set(shown);

      if (shown === 1) {
        completeRef.current();
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    // Asset list is a module constant at the call site; load runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return progress;
}
