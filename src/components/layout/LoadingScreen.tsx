import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useAnimate, useReducedMotion } from 'motion/react';
import { usePreloadProgress } from '../../hooks/usePreloadProgress';
import { useLenisInstance } from '../../hooks/useLenis';
import { useLanguage } from '../../context/LanguageContext';
import { Wordmark } from '../common/Logo';
import styles from './LoadingScreen.module.css';

const EASE_PART = [0.76, 0, 0.24, 1] as const;

/**
 * The faces are declared by Google's stylesheet. Asking for one before that
 * sheet has arrived finds nothing and resolves at once.
 */
function stylesheetsLoaded(): Promise<unknown> {
  const links = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')];
  return Promise.all(
    links.map(
      (link) =>
        link.sheet ??
        new Promise((resolve) => {
          link.addEventListener('load', resolve, { once: true });
          link.addEventListener('error', resolve, { once: true });
        })
    )
  );
}

/**
 * The first screen's faces. Google serves each script as its own subset and
 * the browser fetches one only once text needs it, which is after the loader
 * has gone: on a cold cache the title then paints in Georgia. Asking for a
 * sample of both scripts warms them while the loader is still up.
 */
function warmFaces(): Promise<unknown> {
  const sample = 'Кофе и книги Coffee and books';
  return stylesheetsLoaded()
    .then(() =>
      Promise.all([
        document.fonts.load('300 1em Literata', sample),
        document.fonts.load('600 1em "Ysabeau Office"', sample),
      ])
    )
    .catch(() => {});
}

/** Warmed before the page parts, so nothing pops in behind it. */
const ASSETS = [
  '/cloth.webp', // the hero book's cloth grain
  warmFaces, // title and running head
] as const;

/** The traced wordmark is 1140 x 106.8. */
const MARK_RATIO = 106.8 / 1140;
/**
 * In the header the wordmark sits 0.137 of its own width above the rule.
 * The loader keeps that proportion, so it is the running head drawn large.
 */
const GAP_RATIO = 0.137;

/** Beats after the rule has been drawn the full width (ms). */
const BEATS = {
  /** The site mounts behind the still frame, so its cost lands in silence. */
  handoff: 380,
  /** The page parts along the rule. */
  exit: 600,
  /** Measured from `exit`: the head has landed and given way to the header. */
  clear: 1480,
} as const;

const BEATS_REDUCED = { handoff: 240, exit: 400, clear: 520 } as const;

/** The part, then a beat for the head to settle into the real header. */
const MOVE = { duration: 0.92, delay: 0.08, ease: EASE_PART };
const SETTLE = { duration: 0.35, delay: 1.04, ease: 'linear' as const };

type Phase = 'loading' | 'resolved' | 'exiting' | 'done';

interface Frame {
  /** The seam, in px from the top: the rule is drawn along it. */
  seam: number;
  markWidth: number;
  markTop: number;
}

/** Whole pixels throughout, so the rule never straddles two rows. */
function measureFrame(): Frame {
  const markWidth = Math.round(Math.min(560, Math.max(232, window.innerWidth * 0.4)));
  const seam = Math.round(window.innerHeight / 2);
  const markTop = Math.round(seam - markWidth * GAP_RATIO - markWidth * MARK_RATIO);
  return { seam, markWidth, markTop };
}

interface Landing {
  /** How far the head rises: its rule lands on the header's own rule. */
  rise: number;
  x: number;
  y: number;
  scale: number;
}

/**
 * Where the header's wordmark and rule sit. Positions are taken relative to
 * the header, so a transform on it (hidden by scroll, say) cannot skew them.
 */
function measureLanding(frame: Frame, mark: HTMLElement): Landing | null {
  const header = document.querySelector('header');
  const logo = header?.querySelector('a[href="#/"] svg');
  if (!header || !logo) return null;

  const head = header.getBoundingClientRect();
  const target = logo.getBoundingClientRect();
  const from = mark.getBoundingClientRect();

  return {
    // The header's border sits below its bar: the last pixel of its box.
    rise: head.height - 1 - frame.seam,
    x: target.left - head.left + target.width / 2 - (from.left + from.width / 2),
    y: target.top - head.top + target.height / 2 - (from.top + from.height / 2),
    scale: target.width / from.width,
  };
}

interface LoadingScreenProps {
  /** Fired once, before the page parts, to mount the site behind it. */
  onDone: () => void;
}

/**
 * The running head. The wordmark sits over a rule that is drawn out from the
 * centre as the site really loads. At 100 the page parts along that rule:
 * the lower half falls away and the upper half rises until it is the header,
 * its wordmark and rule landing exactly on the real ones, and then gives way
 * to it. The loader does not leave the page; it becomes its first line.
 */
export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const { t } = useLanguage();
  const lenis = useLenisInstance();
  const reduce = useReducedMotion() ?? false;

  const [phase, setPhase] = useState<Phase>('loading');
  const [frame, setFrame] = useState(measureFrame);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const headRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  // Raised from inside the rAF loop the frame the rule reaches the edges.
  const resolve = useCallback(() => {
    setPhase((prev) => (prev === 'loading' ? 'resolved' : prev));
  }, []);

  const progress = usePreloadProgress({
    assets: ASSETS,
    minDuration: 1600,
    onComplete: resolve,
  });

  const exiting = phase === 'exiting';

  // Phase machine
  const handedOff = useRef(false);
  const handoff = useCallback(() => {
    if (handedOff.current) return;
    handedOff.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (phase !== 'resolved') return;
    const beats = reduce ? BEATS_REDUCED : BEATS;
    const a = setTimeout(handoff, beats.handoff);
    const b = setTimeout(() => setPhase('exiting'), beats.exit);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [phase, reduce, handoff]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const beats = reduce ? BEATS_REDUCED : BEATS;
    const c = setTimeout(() => setPhase('done'), beats.clear);
    return () => clearTimeout(c);
  }, [phase, reduce]);

  // The composition follows the window until the page starts to part.
  useEffect(() => {
    if (phase !== 'loading') return;
    const onResize = () => setFrame(measureFrame());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [phase]);

  // The part. The site has mounted by now, so the header can be measured;
  // this runs before paint, so it starts from exactly the frame on screen.
  useLayoutEffect(() => {
    const head = headRef.current;
    const bottom = bottomRef.current;
    const mark = markRef.current;
    if (phase !== 'exiting' || reduce || !head || !bottom || !mark) return;

    // Without a header to land in, the head simply parts off the top.
    const to = measureLanding(frame, mark) ?? {
      rise: -(frame.seam + 1),
      x: 0,
      y: -(frame.seam + 1),
      scale: 1,
    };

    animate(bottom, { y: '100%' }, MOVE);
    animate(head, { y: to.rise }, MOVE);
    animate(head, { opacity: 0 }, SETTLE);
    animate(mark, { x: to.x, y: to.y, scale: to.scale }, MOVE);
    animate(mark, { opacity: 0 }, SETTLE);
  }, [phase, reduce, frame, animate]);

  // Hold the page still until the head has become the header
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const released = phase === 'done';
    document.body.style.overflow = released ? '' : 'hidden';
    if (released) lenis?.start();
    else lenis?.stop();
  }, [phase, lenis]);

  // The header keeps its ribbon furled until the loader has gone, then lets
  // it drop onto the current page as the last beat.
  useEffect(() => {
    const root = document.documentElement;
    if (phase !== 'done') root.dataset.loading = '';
    else delete root.dataset.loading;
  }, [phase]);

  useEffect(
    () => () => {
      document.body.style.overflow = '';
      delete document.documentElement.dataset.loading;
      lenisRef.current?.start();
    },
    []
  );

  if (phase === 'done') return null;

  return (
    <motion.div
      ref={scope}
      className={`${styles.overlay} ${exiting ? styles.overlayExiting : ''}`}
      aria-hidden={exiting}
      initial={{ opacity: 1 }}
      animate={{ opacity: reduce && exiting ? 0 : 1 }}
      transition={{ duration: 0.45, ease: 'linear' }}
    >
      <span className={styles.srOnly} role="status">
        {t('loader.status')}
      </span>

      <div ref={bottomRef} className={styles.bottom} style={{ top: frame.seam + 1 }} />

      <div ref={headRef} className={styles.head} style={{ height: frame.seam + 1 }}>
        <motion.span className={styles.rule} style={{ scaleX: progress }} />
      </div>

      <div
        ref={markRef}
        className={styles.mark}
        aria-hidden="true"
        style={{ top: frame.markTop, width: frame.markWidth, marginLeft: -frame.markWidth / 2 }}
      >
        <Wordmark className={styles.wordmark} />
      </div>
    </motion.div>
  );
}
