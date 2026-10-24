import { useEffect, useState, type Ref } from 'react';
import { AnimatePresence, motion, stagger, useAnimate, useReducedMotion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { PEN_RING, PEN_STROKE } from '../common/penMarks';
import styles from './MarkScale.module.css';

const MARKS = [1, 2, 3, 4, 5] as const;

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
        d={PEN_RING}
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
          pathLength: PEN_STROKE,
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
