import type { CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { BUS_STOP, MAP_TURN, STREETS, type StreetId } from '../../data/streetMap';
import { Wordmark } from '../common/Logo';
import styles from './StreetMap.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

interface Label {
  street: StreetId;
  /** Where along the street, in metres: x for a level street, y for an upright one. */
  at: number;
  /** Set below a level street, or right of an upright one, instead of above or left. */
  after?: boolean;
}

/** A window onto the drawing, in metres from the door. CSS shows one per width. */
interface Crop {
  name: 'wide' | 'medium' | 'tall';
  x0: number;
  y0: number;
  w: number;
  h: number;
  /**
   * Pixels to the metre. A crop with a scale keeps it at every width: x0 and w
   * are what it shows on a 320px phone, and a wider screen sees more streets
   * either side of the door instead of the same ones drawn larger.
   */
  scale?: number;
  labels: Label[];
}

/**
 * Each crop keeps the two avenues, Keshokova and the café's corner in view.
 * Labels sit where their street runs clear of the café's mark, the stop's
 * name and each other, at every width the crop is shown.
 */
const CROPS: Crop[] = [
  {
    name: 'wide',
    x0: -300,
    y0: -178,
    w: 860,
    h: 358,
    labels: [
      { street: 'lenina', at: 300 },
      { street: 'pushkina', at: 290 },
      { street: 'chekhova', at: -55 },
      { street: 'keshokova', at: 75 },
      { street: 'shogentsukova', at: 280 },
      { street: 'nogmova', at: 70 },
    ],
  },
  {
    name: 'medium',
    x0: -180,
    y0: -175,
    w: 460,
    h: 355,
    labels: [
      { street: 'lenina', at: 200 },
      { street: 'pushkina', at: 140 },
      { street: 'chekhova', at: -55 },
      { street: 'keshokova', at: 75 },
      { street: 'shogentsukova', at: 170 },
    ],
  },
  {
    // Phones keep one scale, the smallest at which the café's name still
    // clears the side street 83m east of the door
    name: 'tall',
    x0: -105,
    y0: -210,
    w: 255,
    h: 410,
    scale: 1.1,
    labels: [
      { street: 'lenina', at: 60 },
      { street: 'pushkina', at: 70, after: true },
      { street: 'chekhova', at: -55 },
      { street: 'keshokova', at: -60, after: true },
      { street: 'shogentsukova', at: 40 },
    ],
  },
];

/** The whole drawing, which a crop with a scale lays out at that scale. */
const BOUNDS = (() => {
  const xs = STREETS.flatMap((s) => s.points.filter((_, i) => i % 2 === 0));
  const ys = STREETS.flatMap((s) => s.points.filter((_, i) => i % 2 === 1));
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
  return { x0, y0, w: Math.max(...xs) - x0, h: Math.max(...ys) - y0 };
})();

const toPath = (points: readonly number[]) =>
  points.reduce((d, n, i) => d + (i % 2 ? `,${n}` : `${i ? ' L' : 'M'}${n}`), '');

const MAJOR_D = STREETS.filter((s) => s.major).map((s) => toPath(s.points)).join(' ');
const MINOR_D = STREETS.filter((s) => !s.major).map((s) => toPath(s.points)).join(' ');

/**
 * The point on a street at `at`, and the street's angle there, normalised so
 * level names read left to right and upright ones bottom to top.
 */
function anchor(street: StreetId, at: number) {
  for (const { id, points } of STREETS) {
    if (id !== street) continue;
    for (let i = 2; i < points.length; i += 2) {
      const [ax, ay, bx, by] = [points[i - 2], points[i - 1], points[i], points[i + 1]];
      const level = Math.abs(bx - ax) > Math.abs(by - ay);
      const [from, to] = level ? [ax, bx] : [ay, by];
      if (at < Math.min(from, to) || at > Math.max(from, to)) continue;
      const k = (at - from) / (to - from);
      let angle = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
      if (angle > 45) angle -= 180;
      if (angle <= -135) angle += 180;
      return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, angle };
    }
  }
  throw new Error(`No ${street} at ${at}`);
}

const LABELS = CROPS.map((crop) =>
  crop.labels.map((label) => ({ ...label, ...anchor(label.street, label.at) })),
);

/** North, as a unit vector on the turned map. */
const TURN = (MAP_TURN * Math.PI) / 180;
const NORTH = [Math.sin(TURN), -Math.cos(TURN)] as const;

interface StreetMapProps {
  /** Starts the drawing: the streets spread out from the door, then the mark lands. */
  show: boolean;
}

/**
 * The few blocks around the door, drawn like the map on a novel's endpapers:
 * streets in ink, the café in red, the stop the directions name. Turned so
 * Pushkina runs level; the arrow in the corner points north.
 */
export function StreetMap({ show }: StreetMapProps) {
  const { t } = useLanguage();
  const reduce = useReducedMotion() ?? false;

  /** A point in metres: a share of the crop, or pixels from the door at a fixed scale. */
  const at = (crop: Crop, x: number, y: number): CSSProperties =>
    crop.scale
      ? {
          left: `calc(${(-crop.x0 / crop.w) * 100}% + ${x * crop.scale}px)`,
          top: `${(y - crop.y0) * crop.scale}px`,
        }
      : {
          left: `${((x - crop.x0) / crop.w) * 100}%`,
          top: `${((y - crop.y0) / crop.h) * 100}%`,
        };

  return (
    <figure>
      <div className={styles.map} role="img" aria-label={t('visit.mapAlt')}>
        {CROPS.map((crop, c) => {
          // At a fixed scale the drawing is the whole map, running far past
          // the window, so the reveal spreads as far as the crop is tall
          // rather than by the drawing's own size
          const frame = crop.scale ? BOUNDS : crop;
          const door = `${(-frame.x0 / frame.w) * 100}% ${(-frame.y0 / frame.h) * 100}%`;
          const [from, to] = crop.scale ? ['0px', `${crop.h * crop.scale}px`] : ['0%', '120%'];
          return (
            <div
              key={crop.name}
              className={`${styles.crop} ${styles[crop.name]}`}
              style={crop.scale ? { height: crop.h * crop.scale } : { aspectRatio: `${crop.w} / ${crop.h}` }}
            >
              <motion.svg
                className={styles.streets}
                viewBox={`${frame.x0} ${frame.y0} ${frame.w} ${frame.h}`}
                style={
                  crop.scale
                    ? { ...at(crop, frame.x0, frame.y0), width: frame.w * crop.scale, height: frame.h * crop.scale }
                    : undefined
                }
                aria-hidden="true"
                focusable="false"
                initial={reduce ? false : { clipPath: `circle(${from} at ${door})` }}
                animate={show && !reduce ? { clipPath: `circle(${to} at ${door})` } : undefined}
                transition={{ duration: 2.2, ease }}
              >
                <path d={MINOR_D} className={styles.minor} />
                <path d={MAJOR_D} className={styles.major} />
              </motion.svg>

              <motion.div
                className={styles.overlay}
                initial={reduce ? false : { opacity: 0 }}
                animate={show && !reduce ? { opacity: 1 } : undefined}
                transition={{ duration: 0.9, delay: 0.8, ease }}
              >
                {LABELS[c].map((label) => (
                  <span
                    key={label.street}
                    className={`${styles.label} ${label.after ? styles.after : ''}`}
                    style={{ ...at(crop, label.x, label.y), '--angle': `${label.angle}deg` } as CSSProperties}
                  >
                    {t(`visit.street.${label.street}`)}
                  </span>
                ))}

                <span className={styles.stop} style={at(crop, BUS_STOP[0], BUS_STOP[1])} />
                <span className={styles.stopName} style={at(crop, BUS_STOP[0], BUS_STOP[1])}>
                  {t('visit.stop')}
                </span>

                <span className={styles.north}>
                  <svg viewBox="-12 -12 24 24" style={{ rotate: `${MAP_TURN}deg` }}>
                    <path d="M0 10V-10M-3.2 -5.6L0 -10L3.2 -5.6" />
                  </svg>
                  <span style={{ translate: `${NORTH[0] * 17}px ${NORTH[1] * 17}px` }}>{t('visit.north')}</span>
                </span>
              </motion.div>

              <motion.span
                className={styles.door}
                style={at(crop, 0, 0)}
                initial={reduce ? false : { opacity: 0, scale: 2.4 }}
                animate={show && !reduce ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: 0.6, delay: 1.3, ease }}
              />
              <motion.span
                className={styles.cafeName}
                style={at(crop, 0, 0)}
                initial={reduce ? false : { opacity: 0 }}
                animate={show && !reduce ? { opacity: 1 } : undefined}
                transition={{ duration: 0.8, delay: 1.5, ease }}
              >
                <Wordmark />
              </motion.span>
            </div>
          );
        })}
      </div>
      <figcaption className={styles.credit}>
        {/* The ODbL asks for this wherever the drawing is shown */}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t('visit.mapCredit')}, ${t('common.newTab')}`}
        >
          {t('visit.mapCredit')}
        </a>
      </figcaption>
    </figure>
  );
}
