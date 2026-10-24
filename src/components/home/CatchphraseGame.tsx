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
import { getCatchphrases } from '../../data/catchphrases';
import { PEN_RING, PEN_STROKE } from '../common/penMarks';
import styles from './CatchphraseGame.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

const BEST_KEY = 'biblioteka-catchphrase-best';

/** Every this many right answers in a row earns a bonus. */
const SERIES = 5;
const SERIES_BONUS = 5;

/** How long after the answer's own points a series bonus lands, in seconds. */
const BONUS_BEAT = 0.85;

/** Spines beyond this many stand off the end of the shelf. */
const SHELF_MAX = 64;

/**
 * How long every round's clock runs, in ms. A phrase is known from its first
 * words; what takes the time is placing it, so the clock is the same for a
 * short phrase as for a long one.
 */
const ROUND_TIME = 9000;

/**
 * How long a phrase takes to type, in ms: a typist's pace, held to half the
 * round, so a long phrase is whole while it still scores.
 */
const typingTime = (length: number) => Math.min(ROUND_TIME / 2, length * 80);

/** Three points in the round's first third, two in its second, then one. */
const worthAt = (progress: number) => (progress < 1 / 3 ? 3 : progress < 2 / 3 ? 2 : 1);

/**
 * The spines vary the way a real shelf does. Index by position, so a spine
 * keeps its look for as long as it stands.
 */
const SPINES = [
  { w: 14, h: 86 }, { w: 11, h: 72 }, { w: 17, h: 96 }, { w: 12, h: 78 },
  { w: 15, h: 90 }, { w: 10, h: 68 }, { w: 13, h: 82 },
] as const;

/**
 * The pen's loops round a mark. A series bonus goes round a second time,
 * wider and at another angle, the way a hand does.
 */
const LOOPS = [
  { rotate: -4, scale: 1, delay: 0.3 },
  { rotate: 9, scale: 1.07, delay: 0.1 },
] as const;

/** The bonus rolling the figure on, like a counter's wheel. */
const ROLL = { type: 'spring', stiffness: 420, damping: 32 } as const;

type Phase = 'idle' | 'reading' | 'answered';

interface Round {
  n: number;
  id: string;
  options: string[];
}

interface Result {
  picked: string;
  correct: boolean;
  gain: number;
  bonus: number;
}

function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
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

interface MarkProps {
  gain: number;
  bonus: number;
  reduced: boolean;
}

/**
 * The points a right answer scored, written in red in the margin of its plate
 * and circled, as a mark is given in a school exercise book. A series bonus
 * rolls the figure on to the new total a beat later and circles it again.
 */
function Mark({ gain, bonus, reduced }: MarkProps) {
  const [total, setTotal] = useState(reduced ? gain + bonus : gain);

  useEffect(() => {
    if (!bonus || reduced) return;
    const id = window.setTimeout(() => setTotal(gain + bonus), BONUS_BEAT * 1000);
    return () => window.clearTimeout(id);
  }, [gain, bonus, reduced]);

  const first = total === gain;

  return (
    <span className={styles.mark} aria-hidden="true">
      <span className={styles.figure}>
        <AnimatePresence initial={!reduced}>
          <motion.span
            key={total}
            className={styles.figureFace}
            // Written left to right; the bonus rolls in under it like a counter.
            initial={
              first
                ? { clipPath: 'inset(0 100% 0 0)', y: '0%' }
                : { clipPath: 'inset(0 0% 0 0)', y: '110%' }
            }
            animate={{ clipPath: 'inset(0 0% 0 0)', y: '0%' }}
            exit={{ y: '-110%', transition: ROLL }}
            transition={first ? { duration: 0.24, delay: 0.08, ease: [0.3, 0.2, 0.3, 1] } : ROLL}
          >
            <span className={styles.plus}>+</span>
            {total}
          </motion.span>
        </AnimatePresence>
      </span>
      {LOOPS.slice(0, first ? 1 : 2).map((loop, i) => (
        <svg
          key={i}
          className={styles.loop}
          viewBox="0 0 60 48"
          style={{ rotate: `${loop.rotate}deg`, scale: loop.scale }}
          focusable="false"
        >
          <motion.path
            d={PEN_RING}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            // Hidden until the pen moves, or the round cap shows as a dot.
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { ...PEN_STROKE, delay: loop.delay },
              opacity: { duration: 0.01, delay: loop.delay },
            }}
          />
        </svg>
      ))}
    </span>
  );
}

/**
 * The home page's game: a catchphrase types itself out and the reader names
 * the book it comes from. The sooner, the more it scores; each right answer
 * in a row stands another spine on the shelf, and a wrong one knocks the
 * shelf over.
 */
export function CatchphraseGame() {
  const { lang, t, tn } = useLanguage();
  const reduced = useReducedMotion();
  const phrases = getCatchphrases(lang);
  const byId = useMemo(() => new Map(phrases.map((p) => [p.id, p])), [phrases]);

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

  const phrase = round ? byId.get(round.id) : undefined;
  const [open, close] = lang === 'en' ? ['“', '”'] : ['«', '»'];
  const text = phrase
    ? `${open}${phrase.line}${close}`
    : t('game.teaser');
  const shown = phase === 'reading' ? typed : text.length;

  const deal = useCallback(() => {
    if (deckRef.current.length === 0) {
      const deck = shuffle(phrases.map((p) => p.id));
      // A fresh deck never opens with the phrase just played.
      if (round && deck[0] === round.id) deck.push(deck.shift()!);
      deckRef.current = deck;
    }
    const id = deckRef.current.shift()!;
    const { shelf, title } = byId.get(id)!;
    // A book can give the shelf several phrases, but it stands among the
    // answers once: the wrong ones are three other books.
    const books = new Set([title]);
    const decoys: string[] = [];
    for (const p of shuffle(phrases)) {
      if (decoys.length === 3) break;
      if (p.shelf !== shelf || books.has(p.title)) continue;
      books.add(p.title);
      decoys.push(p.id);
    }

    elapsedRef.current = 0;
    if (fillRef.current) fillRef.current.style.transform = 'scaleX(1)';
    setTyped(0);
    setWorth(3);
    setResult(null);
    setRound((r) => ({ n: (r?.n ?? 0) + 1, id, options: shuffle([id, ...decoys]) }));
    setPhase('reading');
    stageRef.current?.focus({ preventScroll: true });
  }, [phrases, byId, round]);

  const answer = useCallback((picked: string) => {
    if (phase !== 'reading' || !round) return;
    const correct = picked === round.id;
    const nextStreak = correct ? streak + 1 : 0;
    const bonus = correct && nextStreak % SERIES === 0 ? SERIES_BONUS : 0;
    const gain = correct ? worth : 0;

    setResult({ picked, correct, gain, bonus });
    setPhase('answered');
    setStreak(nextStreak);
    if (!correct && streak > 0) setRun((r) => r + 1);
    if (correct) setScore((s) => s + gain + bonus);
    if (nextStreak > best) {
      setBest(nextStreak);
      writeBest(nextStreak);
    }
  }, [phase, round, streak, worth, best]);

  // The typewriter, and the round's clock running on past it. The clock only
  // runs while the stage is on screen, so scrolling away never costs points.
  const length = text.length;
  const roundNo = round?.n;
  useEffect(() => {
    if (phase !== 'reading' || !stageInView) return;
    const typing = typingTime(length);
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      elapsedRef.current += Math.min(now - last, 100);
      last = now;
      const progress = Math.min(1, elapsedRef.current / ROUND_TIME);
      const w = worthAt(progress);
      setTyped(reduced ? length : Math.round(Math.min(1, elapsedRef.current / typing) * length));
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

  // A miss shakes the answers. A series bonus makes the shelf jump as the
  // mark rolls on to its total.
  useEffect(() => {
    if (!result || reduced) return;
    if (!result.correct) {
      animate('[data-options]', { x: [0, -9, 8, -5, 3, 0] }, { duration: 0.45 });
    } else if (result.bonus) {
      animate('[data-spine]', { y: [0, -16, 0] }, { duration: 0.5, delay: stagger(0.035, { startDelay: BONUS_BEAT }) });
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

  const announcement = !result || !phrase
    ? ''
    : result.correct
      ? `${t('game.right')}. +${tn('game.points', result.gain + result.bonus)}.`
      : `${t('game.wrong')}. ${t('game.answerWas')}: ${phrase.title}, ${phrase.author}.`;

  const spines = Array.from({ length: Math.min(streak, SHELF_MAX) }, (_, i) => i);

  return (
    <section ref={scope} id="game" className={styles.game} aria-labelledby="catchphrase-title">
      <motion.div
        className={styles.intro}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease }}
      >
        <h2 id="catchphrase-title" className={styles.title}>
          {t('game.title1')} <em>{t('game.title2')}</em>
        </h2>
        <p className={styles.lede}>{t('game.lede')}</p>
      </motion.div>

      <div className={styles.tally}>
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt>{t('game.score')}</dt>
            <dd>
              <motion.span>{scoreShown}</motion.span>
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
              {phase === 'answered' && result && !result.correct && (
                <motion.span
                  key={roundNo}
                  className={styles.stamp}
                  aria-hidden="true"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 2.6, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 6 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', stiffness: 560, damping: 24, mass: 0.9 }}
                >
                  <span className={styles.stampWord}>{t('game.wrong')}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </div>

        {/* Set in full and uncovered as it types, so the phrase never reflows
            under the reader. Screen readers get it whole. */}
        <p
          className={`${styles.line} ${phase === 'idle' ? styles.lineIdle : ''}`}
          data-verse={phrase?.line.includes('\n') || undefined}
          aria-hidden="true"
        >
          <span>{text.slice(0, shown)}</span>
          {phase !== 'answered' && <span className={styles.caret} />}
          <span className={styles.ghost}>{text.slice(shown)}</span>
        </p>
        {phrase && <p className="sr-only">{phrase.line}</p>}

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
                    {state === 'right' && result?.correct && (
                      <Mark gain={result.gain} bonus={result.bonus} reduced={!!reduced} />
                    )}
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
