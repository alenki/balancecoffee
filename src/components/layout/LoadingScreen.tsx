import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { usePreloadProgress } from '../../hooks/usePreloadProgress';
import { useLenisInstance } from '../../hooks/useLenis';
import { useLanguage } from '../../context/LanguageContext';
import { images, type ImageName } from '../../generated/image-manifest';
import { HERO_SIZES } from '../common/imageSizes';
import styles from './LoadingScreen.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_PART = [0.76, 0, 0.24, 1] as const;

const srcSet = (base: string, widths: readonly number[], ext: string) =>
  widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');

/**
 * Pipeline images are responsive, so warming a hardcoded URL would cache a
 * rung the browser then declines to use. This mirrors the real `<picture>`,
 * letting the same selection run twice and land on one file.
 */
function warm(name: ImageName, sizes: string): () => Promise<void> {
  return () => {
    const meta = images[name];
    return new Promise((resolve) => {
      const done = () => resolve();
      const picture = document.createElement('picture');

      const avif = document.createElement('source');
      avif.type = 'image/avif';
      avif.srcset = srcSet(meta.base, meta.widths, 'avif');
      avif.sizes = sizes;

      const img = document.createElement('img');
      img.sizes = sizes;
      // The img must already be inside the picture, or the source is ignored.
      picture.append(avif, img);
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
      img.srcset = srcSet(meta.base, meta.widths, 'webp');
      img.src = `${meta.base}-${meta.widths[meta.widths.length - 1]}.webp`;
    });
  };
}

/** Warmed before the site is revealed, so nothing pops in behind us. */
const ASSETS = [
  warm('cafe/image', HERO_SIZES), // hero LCP image
  // Both marks are live text, not files: the header wordmark and the hero
  // one are set in Nunito, so the face is what has to land before the
  // reveal. Warming it here keeps them from reflowing out of the fallback.
  () => document.fonts.load('800 2rem Nunito')
    .then(() => document.fonts.load('300 1rem Nunito'))
    .catch(() => {}),
] as const;

/**
 * The counter is the only thing on screen and it is set in a webfont that is
 * itself still arriving. Resolving this before the figure appears means it is
 * never painted in the fallback and never snaps faces mid count. Capped, so a
 * slow font delays the loader by at most a beat rather than stalling it.
 */
const FACE_CAP = 1200;
const facePainted: Promise<unknown> = Promise.race([
  document.fonts
    .load('200 8rem Onest')
    .catch(() => {})
    .then(() => document.fonts.ready),
  new Promise((r) => setTimeout(r, FACE_CAP)),
]);

/**
 * The figure fades in, and counting starts a beat later, so it is nearly
 * solid by the time it holds a number worth reading. Without the head start
 * the fade races the climb and the first legible value is already past 20.
 */
const HEAD_START = 220;
const countGate: Promise<unknown> = facePainted.then(
  () => new Promise((r) => setTimeout(r, HEAD_START))
);

/** Beats after the counter reaches 100 (ms). */
const BEATS = {
  /** The site mounts behind the still frame, so its cost lands in silence. */
  handoff: 520,
  /** The counter lifts away. */
  exit: 760,
  /** Measured from `exiting`: 0.16s delay + 0.82s part + buffer. */
  clear: 1080,
} as const;

const BEATS_REDUCED = { handoff: 240, exit: 400, clear: 520 } as const;

type Phase = 'loading' | 'resolved' | 'exiting' | 'done';

interface LoadingScreenProps {
  /** Fired once, mid-resolve, to mount the site behind the field. */
  onDone: () => void;
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const { lang } = useLanguage();
  const lenis = useLenisInstance();
  const reduce = useReducedMotion() ?? false;

  const [phase, setPhase] = useState<Phase>('loading');

  const [faceIn, setFaceIn] = useState(false);
  useEffect(() => {
    let live = true;
    facePainted.then(() => {
      if (live) setFaceIn(true);
    });
    return () => {
      live = false;
    };
  }, []);

  // Raised from inside the rAF loop the frame the counter reaches 100.
  const resolve = useCallback(() => {
    setPhase((prev) => (prev === 'loading' ? 'resolved' : prev));
  }, []);

  const progress = usePreloadProgress({
    assets: ASSETS,
    minDuration: 1500,
    gate: countGate,
    onComplete: resolve,
  });

  const exiting = phase === 'exiting';

  // The figure changes about a hundred times on the way up. Writing it
  // straight to the DOM keeps all of that off React's render path.
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lastValue = useRef(-1);

  useMotionValueEvent(progress, 'change', (p) => {
    const value = Math.round(p * 100);
    if (value === lastValue.current) return;
    lastValue.current = value;

    const text = String(value).padStart(3, '0');
    const leading = 3 - String(value).length;
    for (let i = 0; i < 3; i += 1) {
      const el = digitRefs.current[i];
      if (!el) continue;
      if (el.textContent !== text[i]) el.textContent = text[i];
      el.classList.toggle(styles.digitGhost, value < 100 && i < leading);
    }
  });

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

  // Hold the page still until the field has parted
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

  useEffect(
    () => () => {
      document.body.style.overflow = '';
      lenisRef.current?.start();
    },
    []
  );

  if (phase === 'done') return null;

  return (
    <motion.div
      className={`${styles.overlay} ${exiting ? styles.overlayExiting : ''}`}
      aria-hidden={exiting}
      animate={{ opacity: reduce && exiting ? 0 : 1 }}
      transition={{ duration: 0.45, ease: 'linear' }}
    >
      <span className={styles.srOnly} role="status">
        {lang === 'ru' ? 'Загрузка' : 'Loading'}
      </span>

      {/* The field, split from the start so it can part on the centre line */}
      <motion.div
        className={`${styles.half} ${styles.halfTop}`}
        animate={{ y: !reduce && exiting ? '-100%' : '0%' }}
        transition={{ duration: 0.82, delay: 0.16, ease: EASE_PART }}
      >
        <span className={styles.grain} aria-hidden="true" />
      </motion.div>
      <motion.div
        className={`${styles.half} ${styles.halfBottom}`}
        animate={{ y: !reduce && exiting ? '100%' : '0%' }}
        transition={{ duration: 0.82, delay: 0.16, ease: EASE_PART }}
      >
        <span className={styles.grain} aria-hidden="true" />
      </motion.div>

      <motion.div
        className={styles.counterWrap}
        aria-hidden="true"
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: exiting || !faceIn ? 0 : 1,
          y: exiting ? -12 : 0,
        }}
        transition={
          exiting
            ? { duration: 0.45, ease: EASE }
            : { duration: 0.5, ease: EASE }
        }
      >
        <span className={styles.counter}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              ref={(el) => {
                digitRefs.current[i] = el;
              }}
              className={`${styles.digit} ${i < 2 ? styles.digitGhost : ''}`}
            >
              0
            </span>
          ))}
        </span>
      </motion.div>
    </motion.div>
  );
}
