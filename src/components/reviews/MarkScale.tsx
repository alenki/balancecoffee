import { useEffect, useState, type Ref } from 'react';
import { AnimatePresence, motion, stagger, useAnimate, useReducedMotion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './MarkScale.module.css';

const MARKS = [1, 2, 3, 4, 5] as const;

/**
 * A quick pen loop, drawn once and kept as a path: it starts at one o'clock,
 * runs anticlockwise the way a right hand circles a word, and overshoots its
 * start on a slightly wider radius.
 */
const RING =
  'M41.7 10.3C40.7 10.1 37.9 9 35.7 8.7C33.5 8.4 31.1 8.3 28.8 8.5C26.5 8.7 24 9.1 21.8 9.8C19.6 10.4 17.5 11.3 15.7 12.4C14 13.5 12.5 14.9 11.3 16.3C10.1 17.8 9.3 19.5 8.7 21.2C8.1 22.9 7.9 24.7 7.9 26.4C8 28.2 8.4 30 9.3 31.5C10.1 33 11.3 34.5 12.9 35.7C14.5 36.8 16.5 37.8 18.7 38.5C20.8 39.2 23.4 39.7 25.8 39.9C28.2 40.1 30.8 40.1 33.2 39.8C35.7 39.5 38.1 39 40.4 38.2C42.7 37.4 45 36.3 46.9 35C48.8 33.7 50.7 32.2 52 30.5C53.4 28.9 54.4 27 54.9 25.2C55.4 23.3 55.4 21.3 55.1 19.5C54.7 17.7 53.8 15.9 52.6 14.3C51.5 12.7 49.9 11.2 48.2 10C46.5 8.8 44.5 7.8 42.3 7.1C40.2 6.4 37.7 5.9 35.3 5.7C32.8 5.5 28.7 5.9 27.4 6';

/** No hand circles two numbers at quite the same angle. */
const TILT = [-6, 4, -2, 7, -4];

function Ring({ tilt, reduce }: { tilt: number; reduce: boolean }) {
  return (
    <motion.svg
      className={styles.ring}
      viewBox="0 0 60 48"
      style={{ rotate: tilt }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      aria-hidden="true"
      focusable="false"
    >
      <motion.path
        d={RING}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        // A round cap would show a dot before the stroke starts; the path
        // stays hidden until it is moving.
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.46, ease: [0.4, 0.1, 0.2, 1] },
          opacity: { duration: 0.01 },
        }}
      />
    </motion.svg>
  );
}

interface MarkScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  /** Sent: only the chosen mark stays, and closes up to the words before it. */
  sealed: boolean;
  /** Bumped to run a wave through the numbers when a letter is sent unmarked. */
  nudge: number;
  /** The first number's radio, so the page can move focus to the scale. */
  firstRef?: Ref<HTMLInputElement>;
}

/**
 * "I give you 1 2 3 4 5", read as part of the letter. The guest circles a
 * number in red ink, the way a mark is given in a school exercise book, and
 * the word for it is written beside the ring.
 */
export function MarkScale({ value, onChange, sealed, nudge, firstRef }: MarkScaleProps) {
  const { t } = useLanguage();
  const reduce = useReducedMotion() ?? false;
  const [preview, setPreview] = useState<number | null>(null);
  const [scope, animate] = useAnimate<HTMLSpanElement>();

  useEffect(() => {
    if (nudge === 0 || reduce) return;
    animate('[data-face]', { y: [0, -6, 0] }, { duration: 0.42, delay: stagger(0.06), ease: 'easeOut' });
  }, [nudge, reduce, animate]);

  const shown = sealed ? value : (preview ?? value);

  return (
    <fieldset className={styles.scale} disabled={sealed} data-chosen={value !== null || undefined}>
      <legend className="sr-only">{t('reviews.ratingLabel')}</legend>
      <span aria-hidden="true">{t('reviews.markLead')}</span>{' '}
      <span className={styles.marks} ref={scope}>
        <AnimatePresence mode="popLayout" initial={false}>
          {MARKS.filter((mark) => !sealed || mark === value).map((mark) => (
            <motion.label
              key={mark}
              layout="position"
              className={styles.mark}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setPreview(mark);
              }}
              onPointerLeave={() => setPreview(null)}
            >
              <input
                ref={mark === 1 ? firstRef : undefined}
                type="radio"
                name="mark"
                value={mark}
                checked={value === mark}
                onChange={() => onChange(mark)}
                className={styles.input}
              />
              <span className={styles.face} data-face aria-hidden="true">
                {mark}
              </span>
              <span className="sr-only">
                {mark} {t('reviews.ratingOf')}, {t(`reviews.grade${mark}`)}
              </span>
              <AnimatePresence>
                {value === mark && <Ring key="ring" tilt={TILT[mark - 1]} reduce={reduce} />}
              </AnimatePresence>
            </motion.label>
          ))}
        </AnimatePresence>
        <motion.span
          layout="position"
          className={styles.word}
          data-preview={(shown !== null && shown !== value) || undefined}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          {shown !== null && t(`reviews.grade${shown}`)}
        </motion.span>
      </span>
    </fieldset>
  );
}
