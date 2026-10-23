import type { CSSProperties } from 'react';
import { EMBLEM_DUST, EMBLEM_LINE, EMBLEM_VIEWBOX } from './brandMarks';
import styles from './Emblem.module.css';

/** Where the spoon's bowl sits in the emblem's own coordinates. */
const SPOON: readonly [number, number] = [62, 346];

/**
 * Per-mote timing, fixed at module load so it is stable across renders.
 * Motes surface in order of distance from the spoon, as if stirred up out of
 * the cup, then each twinkles on its own slightly irrational period so the
 * cloud never pulses in unison.
 */
const MOTES = EMBLEM_DUST.map(([x, y, d], i) => {
  const distance = Math.hypot(x - SPOON[0], y - SPOON[1]);
  return {
    d,
    style: {
      '--rise-delay': `${(distance / 340).toFixed(3)}s`,
      '--twinkle-duration': `${(2.6 + ((i * 0.618) % 1) * 2.8).toFixed(2)}s`,
      // Positive, so a twinkle never starts before its mote has risen.
      '--twinkle-delay': `${(((i * 0.377) % 1) * 2.4).toFixed(2)}s`,
    } as CSSProperties,
  };
});

interface EmblemProps {
  className?: string;
  /**
   * `still`: the mark as printed.
   * `settle`: the stardust rises off the spoon, then holds still where it
   * lands, like foil, with no animation left running.
   * `alive`: the stardust rises off the spoon, then keeps twinkling.
   */
  dust?: 'still' | 'settle' | 'alive';
  /** Delay before the stardust starts rising, in seconds. */
  delay?: number;
}

/** The hand stirring a cup, from the logo. Takes `currentColor`. */
export function Emblem({ className, dust = 'still', delay = 0 }: EmblemProps) {
  return (
    <svg
      viewBox={EMBLEM_VIEWBOX}
      className={[styles.emblem, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      focusable="false"
    >
      <path d={EMBLEM_LINE} fill="currentColor" fillRule="evenodd" />
      <g
        className={dust === 'still' ? undefined : styles[dust]}
        style={{ '--dust-delay': `${delay}s` } as CSSProperties}
      >
        {MOTES.map((mote, i) => (
          <path key={i} d={mote.d} fill="currentColor" className={styles.mote} style={mote.style} />
        ))}
      </g>
    </svg>
  );
}
