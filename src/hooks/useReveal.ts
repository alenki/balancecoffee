import { useEffect, useRef, useState } from 'react';

/**
 * Scroll reveals that cannot leave the page blank.
 *
 * Every entrance on this site starts at `opacity: 0` and is only raised by a
 * callback, so a reveal that never arrives is not a missed animation: it is
 * copy that never appears, permanently, with no scroll position that brings
 * it back. This is the single place that decides an element is visible, and
 * it has three ways to reach that conclusion.
 *
 * 1. IntersectionObserver, the normal path, unchanged in feel.
 * 2. A geometric re-check on a timer. The site mounts behind the loading
 *    field, while `html` is still `overflow: hidden` and the document cannot
 *    scroll, so a first observation is computed against a page in a state it
 *    will not stay in. If nothing moves afterwards the observer has no reason
 *    to speak a second time and the section stays dark forever. A plain
 *    `getBoundingClientRect` ignores that temporary clipping and settles it.
 * 3. A failsafe, used only when the observer never reported at all. An
 *    entrance that does not play is a small loss; a section that never
 *    appears is the whole page.
 *
 * The timer is deliberately not `requestAnimationFrame`: frames stop in a
 * background tab, which is one of the ways the reveal goes missing.
 */

interface RevealOptions {
  /**
   * Viewport inset in pixels, with `rootMargin` semantics: a negative value
   * shrinks the trigger area, so the element has to come further in.
   */
  margin?: number;
  /** Fraction of the element that must be inside before it counts. */
  amount?: number;
}

interface Pending {
  el: Element;
  margin: number;
  amount: number;
  /** The observer has spoken at least once, so it is alive and can be trusted. */
  heard: boolean;
  /** Wall clock deadline for the failsafe. */
  due: number;
  show: () => void;
}

/** How often the pending set is re-checked geometrically. */
const SWEEP_MS = 200;

/** How long an element waits on a silent observer before it is shown anyway. */
const FAILSAFE_MS = 2500;

/**
 * One sweep for the whole page rather than a listener per element: the menu
 * page alone holds eight pending sections, and the sweep stops the moment the
 * last one has been revealed.
 */
const pending = new Set<Pending>();
let sweeper: ReturnType<typeof setInterval> | undefined;

function onScreen(entry: Pending): boolean {
  const rect = entry.el.getBoundingClientRect();
  if (rect.height === 0 && rect.width === 0) return false;

  const viewport = window.innerHeight || document.documentElement.clientHeight;
  const top = -entry.margin;
  const bottom = viewport + entry.margin;

  const overlap = Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
  if (overlap <= 0) return false;

  // Clamped against the trigger area: a section taller than the viewport can
  // never show `amount` of itself, and the observer would never fire for it
  // either. This check is the backstop, so it errs towards showing.
  const needed = Math.min(rect.height * entry.amount, (bottom - top) * 0.9);
  return overlap >= needed;
}

function sweep() {
  const now = performance.now();
  // Set iteration tolerates deletion, and `show` deletes: an entry revealed
  // here is simply not visited again.
  pending.forEach((entry) => {
    if (onScreen(entry) || (!entry.heard && now >= entry.due)) entry.show();
  });
  if (pending.size === 0 && sweeper !== undefined) {
    clearInterval(sweeper);
    sweeper = undefined;
  }
}

function watch(entry: Pending) {
  pending.add(entry);
  if (sweeper === undefined) sweeper = setInterval(sweep, SWEEP_MS);
}

export function useReveal<T extends Element = HTMLDivElement>({
  margin = 0,
  amount = 0,
}: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;

    const entry: Pending = {
      el,
      margin,
      amount,
      heard: false,
      due: performance.now() + FAILSAFE_MS,
      show: () => {},
    };

    const observer = new IntersectionObserver(
      ([record]) => {
        // Any delivery at all, intersecting or not, proves the observer is
        // working, which retires the failsafe and leaves the choreography to
        // run at scroll speed for everything still below the fold.
        entry.heard = true;
        if (record.isIntersecting) entry.show();
      },
      { rootMargin: `${margin}px`, threshold: amount }
    );

    entry.show = () => {
      if (done) return;
      done = true;
      pending.delete(entry);
      observer.disconnect();
      setRevealed(true);
    };

    observer.observe(el);
    watch(entry);

    return () => {
      done = true;
      pending.delete(entry);
      observer.disconnect();
    };
  }, [margin, amount]);

  return { ref, revealed };
}
