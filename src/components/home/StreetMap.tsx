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
    // Narrow enough that the names stay clear down to a 320px phone
    name: 'tall',
    x0: -95,
    y0: -165,
    w: 225,
    h: 360,
    labels: [
      { street: 'lenina', at: 60 },
      { street: 'pushkina', at: -40, after: true },
      { street: 'chekhova', at: -55 },
      { street: 'keshokova', at: 75, after: true },
      { street: 'shogentsukova', at: 40 },
    ],
  },
];

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

  const at = (crop: Crop, x: number, y: number): CSSProperties => ({
    left: `${((x - crop.x0) / crop.w) * 100}%`,
    top: `${((y - crop.y0) / crop.h) * 100}%`,
  });

  return (
    <figure>
      <div className={styles.map} role="img" aria-label={t('visit.mapAlt')}>
        {CROPS.map((crop, c) => {
          const door = `${(-crop.x0 / crop.w) * 100}% ${(-crop.y0 / crop.h) * 100}%`;
          return (
            <div
              key={crop.name}
              className={`${styles.crop} ${styles[crop.name]}`}
              style={{ aspectRatio: `${crop.w} / ${crop.h}` }}
            >
              <motion.svg
                className={styles.streets}
                viewBox={`${crop.x0} ${crop.y0} ${crop.w} ${crop.h}`}
                aria-hidden="true"
                focusable="false"
                initial={reduce ? false : { clipPath: `circle(0% at ${door})` }}
                animate={show && !reduce ? { clipPath: `circle(120% at ${door})` } : undefined}
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
