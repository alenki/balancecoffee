import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  stagger,
  useAnimate,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { getFirstLines } from '../../data/firstLines';
import styles from './FirstLineGame.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

const BEST_KEY = 'biblioteka-first-line-best';

/** Every this many right answers in a row earns a bonus. */
const SERIES = 5;
const SERIES_BONUS = 5;

/** Spines beyond this many stand off the end of the shelf. */
const SHELF_MAX = 24;

/**
 * How long a line takes to type, in ms. Short lines slow down and long ones
 * speed up, so every line leaves roughly the same time to think.
 */
const typingTime = (length: number) => Math.min(7000, Math.max(2600, length * 45));

/** Three points while under a third is typed, two under two thirds, then one. */
const worthAt = (progress: number) => (progress < 1 / 3 ? 3 : progress < 2 / 3 ? 2 : 1);

/**
 * The spines vary the way a real shelf does. Index by position, so a spine
 * keeps its look for as long as it stands.
 */
const SPINES = [
  { w: 14, h: 86 }, { w: 11, h: 72 }, { w: 17, h: 96 }, { w: 12, h: 78 },
  { w: 15, h: 90 }, { w: 10, h: 68 }, { w: 13, h: 82 },
] as const;

/** A four-pointed glint, the shape of the emblem's stardust. */
const GLINT = 'M5 0 6 4 10 5 6 6 5 10 4 6 0 5 4 4Z';

type Phase = 'idle' | 'reading' | 'answered';

interface Round {
  n: number;
  id: string;
  options: string[];
}

interface Spark {
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface Result {
  picked: string;
  correct: boolean;
  gain: number;
  bonus: number;
  sparks: Spark[];
}

function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function burst(count: number): Spark[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const reach = 46 + Math.random() * 64;
    return {
      x: Math.cos(angle) * reach,
      y: Math.sin(angle) * reach * 0.8,
      size: 0.6 + Math.random() * 0.9,
      delay: Math.random() * 0.08,
    };
  });
}

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeBest(n: number) {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {
    // Blocked storage: the record lasts as long as the page.
  }
}

/**
 * The home page's game: a book's opening line types itself out and the reader
 * names the book. The sooner, the more it scores; each right answer in a row
 * stands another spine on the shelf, and a wrong one knocks the shelf over.
 */
export function FirstLineGame() {
  const { lang, t, tn } = useLanguage();
  const reduced = useReducedMotion();
  const lines = getFirstLines(lang);
  const byId = useMemo(() => new Map(lines.map((l) => [l.id, l])), [lines]);

  const [scope, animate] = useAnimate<HTMLElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const deckRef = useRef<string[]>([]);
  const elapsedRef = useRef(0);
  const stageInView = useInView(stageRef, { amount: 0.4 });

  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState<Round | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [typed, setTyped] = useState(0);
  const [worth, setWorth] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  // Bumped whenever a streak falls, so the next shelf's spines get new keys
  // while the old ones are still toppling.
  const [run, setRun] = useState(0);
  const [best, setBest] = useState(readBest);

  const book = round ? byId.get(round.id) : undefined;
  const [open, close] = lang === 'en' ? ['“', '”'] : ['«', '»'];
  const text = book
    ? `${open}${book.line}${close}`
    : t('game.teaser');
  const shown = phase === 'reading' ? typed : text.length;

  const deal = useCallback(() => {
    if (deckRef.current.length === 0) {
      const deck = shuffle(lines.map((l) => l.id));
      // A fresh deck never opens with the line just played.
      if (round && deck[0] === round.id) deck.push(deck.shift()!);
      deckRef.current = deck;
    }
    const id = deckRef.current.shift()!;
    const shelf = byId.get(id)!.shelf;
    const decoys = shuffle(lines.filter((l) => l.shelf === shelf && l.id !== id))
      .slice(0, 3)
      .map((l) => l.id);

    elapsedRef.current = 0;
    if (fillRef.current) fillRef.current.style.transform = 'scaleX(1)';
    setTyped(0);
    setWorth(3);
    setResult(null);
    setRound((r) => ({ n: (r?.n ?? 0) + 1, id, options: shuffle([id, ...decoys]) }));
    setPhase('reading');
    stageRef.current?.focus({ preventScroll: true });
  }, [lines, byId, round]);

  const answer = useCallback((picked: string) => {
    if (phase !== 'reading' || !round) return;
    const correct = picked === round.id;
    const nextStreak = correct ? streak + 1 : 0;
    const bonus = correct && nextStreak % SERIES === 0 ? SERIES_BONUS : 0;
    const gain = correct ? worth : 0;

    setResult({
      picked,
      correct,
      gain,
      bonus,
      sparks: correct && !reduced ? burst(bonus ? 22 : 12) : [],
    });
    setPhase('answered');
    setStreak(nextStreak);
    if (!correct && streak > 0) setRun((r) => r + 1);
    if (correct) setScore((s) => s + gain + bonus);
    if (nextStreak > best) {
      setBest(nextStreak);
      writeBest(nextStreak);
    }
  }, [phase, round, streak, worth, best, reduced]);

  // The typewriter. The clock only runs while the stage is on screen, so
  // scrolling away never costs points.
  const length = text.length;
  const roundNo = round?.n;
  useEffect(() => {
    if (phase !== 'reading' || !stageInView) return;
    const duration = typingTime(length);
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      elapsedRef.current += Math.min(now - last, 100);
      last = now;
      const progress = Math.min(1, elapsedRef.current / duration);
      const w = worthAt(progress);
      setTyped(reduced ? length : Math.round(progress * length));
      setWorth(w);
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${reduced ? w / 3 : 1 - progress})`;
      }
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [phase, stageInView, length, reduced, roundNo]);

  // Answer with 1 to 4 while the game is on screen and nothing else is
  // taking typing.
  useEffect(() => {
    if (phase !== 'reading' || !round || !stageInView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '')) return;
      const i = Number(e.key) - 1;
      if (i >= 0 && i < round.options.length) {
        e.preventDefault();
        answer(round.options[i]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, round, stageInView, answer]);

  // The stamp lands, then the page feels it. A miss shakes the answers.
  useEffect(() => {
    if (!result || reduced) return;
    if (result.correct) {
      animate('[data-stage]', { y: [0, 5, -1, 0] }, { duration: 0.32, delay: 0.12 });
      if (result.bonus) {
        animate('[data-spine]', { y: [0, -16, 0] }, { duration: 0.5, delay: stagger(0.035, { startDelay: 0.4 }) });
      }
    } else {
      animate('[data-options]', { x: [0, -9, 8, -5, 3, 0] }, { duration: 0.45 });
    }
  }, [result, reduced, animate]);

  // Hand the keyboard on to Next, unless focus is busy elsewhere on the page.
  useEffect(() => {
    if (phase !== 'answered') return;
    const active = document.activeElement;
    if (active === document.body || scope.current?.contains(active)) {
      nextRef.current?.focus({ preventScroll: true });
    }
  }, [phase, scope]);

  const scoreSpring = useSpring(0, { stiffness: 90, damping: 18 });
  const scoreShown = useTransform(scoreSpring, (v) => Math.round(v));
  useEffect(() => {
    if (reduced) scoreSpring.jump(score);
    else scoreSpring.set(score);
  }, [score, reduced, scoreSpring]);

  const announcement = !result || !book
    ? ''
    : result.correct
      ? `${t('game.right')}. +${tn('game.points', result.gain + result.bonus)}.`
      : `${t('game.wrong')}. ${t('game.answerWas')}: ${book.title}, ${book.author}.`;

  const spines = Array.from({ length: Math.min(streak, SHELF_MAX) }, (_, i) => i);

  return (
    <section ref={scope} id="game" className={styles.game} aria-labelledby="first-line-title">
      <motion.div
        className={styles.intro}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease }}
      >
        <p className={styles.eyebrow}>{t('game.eyebrow')}</p>
        <h2 id="first-line-title" className={styles.title}>
          {t('game.title1')} <em>{t('game.title2')}</em>
        </h2>
        <p className={styles.lede}>{t('game.lede')}</p>
      </motion.div>

      <div className={styles.tally}>
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt>{t('game.score')}</dt>
            <dd className={styles.scoreValue}>
              <motion.span>{scoreShown}</motion.span>
              <AnimatePresence>
                {result?.correct && (
                  <motion.span
                    key={roundNo}
                    className={styles.gain}
                    aria-hidden="true"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: [0, 1, 1, 0], y: -22 }}
                    transition={{ duration: 1.3, ease: 'easeOut', delay: 0.15 }}
                  >
                    +{result.gain + result.bonus}
                  </motion.span>
                )}
              </AnimatePresence>
            </dd>
          </div>
          <div className={styles.stat}>
            <dt>{t('game.streak')}</dt>
            <dd>{streak}</dd>
          </div>
          <div className={styles.stat}>
            <dt>{t('game.best')}</dt>
            <dd>{best}</dd>
          </div>
        </dl>

        <div className={styles.shelf} aria-label={`${t('game.shelf')}: ${streak}`} role="img">
          <AnimatePresence>
            {spines.length === 0 && (
              <motion.span
                key="empty"
                className={styles.shelfEmpty}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.4 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {t('game.shelfEmpty')}
              </motion.span>
            )}
            {spines.map((i) => {
              const look = SPINES[i % SPINES.length];
              return (
                <motion.span
                  key={`${run}-${i}`}
                  className={styles.spineSlot}
                  initial={{ opacity: 0, y: -48, rotate: -14 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, x: 0 }}
                  exit={{
                    rotate: 84,
                    x: 10,
                    y: 6,
                    opacity: 0,
                    transition: { delay: i * 0.05, duration: 0.55, ease: [0.55, 0, 0.8, 0.2] },
                  }}
                  transition={{ type: 'spring', stiffness: 520, damping: 20 }}
                >
                  <span
                    data-spine
                    className={styles.spine}
                    data-band={i % 3}
                    style={{ width: look.w, height: `${look.h}%` }}
                  />
                </motion.span>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        data-stage
        tabIndex={-1}
        aria-label={t('game.stageLabel')}
        role="group"
      >
        <div className={styles.stageHead}>
          <span className={styles.roundNo}>
            {t('game.round')} {roundNo ?? 1}
          </span>
          <span className={styles.meter} aria-hidden="true">
            <span ref={fillRef} className={styles.meterFill} />
          </span>
          <span className={styles.worthSlot}>
            {phase !== 'answered' && (
              <motion.span
                key={worth}
                className={styles.worth}
                initial={phase === 'idle' ? false : { scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 600, damping: 22 }}
              >
                +{worth}
              </motion.span>
            )}
            <AnimatePresence>
              {phase === 'answered' && result && (
                <motion.span
                  key={roundNo}
                  className={`${styles.stamp} ${result.correct ? '' : styles.stampMiss}`}
                  aria-hidden="true"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 2.6, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: result.correct ? -8 : 6 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 560, damping: 24, mass: 0.9 }}
                >
                  <span className={styles.stampWord}>
                    {result.correct ? t('game.right') : t('game.wrong')}
                  </span>
                  {result.correct && (
                    <span className={styles.stampPoints}>
                      +{tn('game.points', result.gain)}
                      {result.bonus > 0 && ` · +${result.bonus} ${t('game.bonus')}`}
                    </span>
                  )}
                  {result.sparks.map((s, i) => (
                    <motion.svg
                      key={i}
                      viewBox="0 0 10 10"
                      className={styles.spark}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{ x: s.x, y: s.y, scale: [0, s.size, 0], opacity: [0, 1, 0], rotate: 90 }}
                      transition={{ duration: 0.9, delay: 0.1 + s.delay, ease: 'easeOut' }}
                    >
                      <path d={GLINT} fill="currentColor" />
                    </motion.svg>
                  ))}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </div>

        {/* Set in full and uncovered as it types, so the line never reflows
            under the reader. Screen readers get it whole. */}
        <p className={`${styles.line} ${phase === 'idle' ? styles.lineIdle : ''}`} aria-hidden="true">
          <span>{text.slice(0, shown)}</span>
          {phase !== 'answered' && <span className={styles.caret} />}
          <span className={styles.ghost}>{text.slice(shown)}</span>
        </p>
        {book && <p className="sr-only">{book.line}</p>}

        {phase === 'idle' ? (
          <button type="button" className={styles.cta} onClick={deal}>
            {t('game.start')}
          </button>
        ) : (
          round && (
            <div className={styles.options} data-options role="group" aria-label={t('game.options')}>
              {round.options.map((id, i) => {
                const option = byId.get(id)!;
                const state = !result
                  ? undefined
                  : id === round.id
                    ? 'right'
                    : id === result.picked
                      ? 'wrong'
                      : 'rest';
                return (
                  <motion.button
                    key={`${round.n}-${id}`}
                    type="button"
                    className={styles.option}
                    data-state={state}
                    aria-disabled={phase === 'answered'}
                    onClick={() => answer(id)}
                    initial={{ opacity: 0, y: 10 }}
                    // Opacity lives here, not in the stylesheet: Motion's
                    // inline style would override it there.
                    animate={{
                      opacity: state === 'rest' ? 0.5 : state === 'wrong' ? 0.6 : 1,
                      y: 0,
                      scale: state === 'right' && !reduced ? [1, 1.04, 1] : 1,
                    }}
                    transition={{ duration: 0.4, ease, delay: state ? 0 : i * 0.05 }}
                  >
                    <span className={styles.key} aria-hidden="true">{i + 1}</span>
                    <span className={styles.optionText}>
                      <span className={styles.optionTitle}>{option.title}</span>
                      <span className={styles.optionAuthor}>{option.author}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )
        )}

        <div className={styles.nextRow}>
          {phase === 'answered' && (
            <motion.button
              ref={nextRef}
              type="button"
              className={styles.cta}
              onClick={deal}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease, delay: 0.25 }}
            >
              {t('game.next')}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          )}
        </div>

        <p className="sr-only" aria-live="polite">{announcement}</p>
      </div>
    </section>
  );
}
