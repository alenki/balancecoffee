import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useLenisInstance } from '../../hooks/useLenis';
import { Emblem } from '../common/Emblem';
import { Image } from '../common/Image';
import { Wordmark } from '../common/Logo';
import { OpenStatus } from '../common/OpenStatus';
import { HERO_SIZES } from '../common/imageSizes';
import styles from './HeroSection.module.css';

/**
 * The first arrival waits for the loader's head to rise into the header.
 * Coming back to the home page later there is no loader, so the book is set
 * down almost at once.
 */
let loaderStillUp = true;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

interface Beat {
  from: number;
  span: number;
}

/** The beats, as spans of the pinned scroll: a moment shut, then each in turn. */
const SWING: Beat = { from: 0.06, span: 0.5 };
const DRAW_UP: Beat = { from: 0.56, span: 0.26 };
const DETAILS: Beat = { from: 0.7, span: 0.12 };
/** The camera rises from the reader's chair to straight overhead across both. */
const CAMERA: Beat = { from: 0.06, span: 0.76 };
/** Where opening the book by hand scrolls to: drawn up, details showing. */
const OPENED_AT = 0.84;
/** The tallest a page is laid out, so the photograph never outgrows its file. */
const MAX_PAGE_H = 1000;

/**
 * How the book is made, as fractions of the page height: how far the boards
 * stand out past the pages (the squares), how thick a board is, how deep the
 * pages lie between the boards, and how far from the spine the joint is
 * pressed into the cover.
 */
const MAKE = { square: 0.012, board: 0.011, block: 0.11, joint: 0.034 };

/**
 * How the shut book lies, in degrees: tipped away from the reader, so the
 * pages show along its foot, and turned a little, so they show along its
 * side too.
 */
const LIE = {
  landscape: { pitch: 30, yaw: -8 },
  portrait: { pitch: 30, yaw: -6 },
};

/**
 * The lens, as a perspective distance in pixels. Close while the book lies
 * on the table, so its depth reads; long by the time the spread fills the
 * screen, so the open book lies flat and both boards meet the pages square.
 */
const LENS = { near: 1800, far: 40000 };

/**
 * The book. A clothbound hardback lies shut on the page, the café's mark
 * stamped on the cover. Scrolling swings the front board open on its joint:
 * the room is pasted inside it, facing the title page. The camera rises
 * from the table to straight overhead as the open book is drawn up until the
 * spread fills the screen, and the page goes on.
 *
 * Landscape the book is bound on its left edge. Portrait it is bound at the
 * head and opens upward, so the spread stands one page over the other and
 * fits a phone.
 *
 * The section is pinned while it scrolls. Progress is written to the stage as
 * a few custom properties and CSS does the drawing; nothing re-renders on
 * scroll except the ribbon's label, once, as the book passes half open.
 */
export function HeroSection() {
  const { t } = useLanguage();
  const lenis = useLenisInstance();
  const reduce = useReducedMotion() ?? false;
  const [first] = useState(() => loaderStillUp);
  const [isOpen, setIsOpen] = useState(reduce);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Scale of the book shut, and just opened (drawn up it is always 1), and
  // the angle the camera first sees it from
  const geo = useRef({ shut: 0.7, opened: 0.7, ...LIE.landscape });

  useEffect(() => {
    loaderStillUp = false;
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const render = useCallback(
    (p: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const beat = ({ from, span }: Beat) => (reduce ? 1 : clamp01((p - from) / span));
      const open = easeInOut(beat(SWING));
      const drawUp = easeInOut(beat(DRAW_UP));
      const camera = easeInOut(beat(CAMERA));
      const details = beat(DETAILS);
      const { shut, opened, pitch, yaw } = geo.current;
      const scale = shut + (opened - shut) * open + (1 - opened) * drawUp;
      const swing = open * Math.PI;

      const style = stage.style;
      style.setProperty('--open', open.toFixed(4));
      style.setProperty('--lift', Math.sin(swing).toFixed(4));
      style.setProperty('--fall', Math.max(0, -Math.cos(swing)).toFixed(4));
      style.setProperty('--scale', scale.toFixed(4));
      style.setProperty('--pitch', `${(pitch * (1 - camera)).toFixed(3)}deg`);
      style.setProperty('--yaw', `${(yaw * (1 - camera)).toFixed(3)}deg`);
      style.setProperty('--lens', `${Math.round(LENS.near + (LENS.far - LENS.near) * drawUp ** 3)}px`);
      style.setProperty('--details', details.toFixed(3));
      stage.toggleAttribute('data-shut', open === 0);
      stage.toggleAttribute('data-details', details > 0);
      setIsOpen(open > 0.5);
    },
    [reduce]
  );

  // Laid out at its final size, so the book is mostly drawn down, not up
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const root = getComputedStyle(document.documentElement);
      const headerH = parseFloat(root.getPropertyValue('--header-h')) || 64;
      const gutter = parseFloat(root.getPropertyValue('--gutter')) || 20;
      // The stage is 100svh, which holds still while a phone's toolbars
      // slide away; the window's own height would resize the book mid scroll.
      // Its bottom padding keeps the ribbon's length clear of the edge.
      const { paddingBottom } = getComputedStyle(stage);
      const availW = stage.clientWidth - 2 * gutter;
      const availH = stage.clientHeight - headerH - 2 * gutter - parseFloat(paddingBottom);
      const portrait = window.matchMedia('(orientation: portrait)').matches;

      // Drawn up, the open spread fills what is left: one board beside the
      // other in landscape, one over the other in portrait, each a page and
      // its squares.
      const { square, board, block, joint } = MAKE;
      let pageH = Math.floor(
        Math.min(
          MAX_PAGE_H,
          portrait
            ? Math.min(availH / (2 * (1 + square)), availW / (0.75 + 2 * square))
            : Math.min(availH / (1 + 2 * square), availW / (2 * (0.75 + square)))
        )
      );
      const sq = Math.round(pageH * square);
      let pageW = Math.round(pageH * 0.75);
      // Open, the book centres on its spine, half a board over; keeping that
      // half whole keeps the title page's type on the pixel grid.
      if (portrait && (pageH + sq) % 2) pageH -= 1;
      if (!portrait && (pageW + sq) % 2) pageW -= 1;
      const boardW = portrait ? pageW + 2 * sq : pageW + sq;
      const boardH = portrait ? pageH + sq : pageH + 2 * sq;
      const boardT = Math.max(2, Math.round(pageH * board));
      const blockT = Math.round(pageH * block);

      const shutH = portrait
        ? Math.min(availH * 0.5, (availW * 0.8 * boardH) / boardW)
        : Math.min(availH * 0.7, (availW * 0.58 * boardH) / boardW);
      const shut = Math.min(1, shutH / boardH);
      const roomToOpen = portrait ? availH / (2 * boardH) : availW / (2 * boardW);
      geo.current = {
        shut,
        opened: Math.min(shut, roomToOpen),
        ...LIE[portrait ? 'portrait' : 'landscape'],
      };

      // The ribbon leaves the pages partway down the stack and falls over
      // the back board's edge onto the page
      const dropY = sq + boardT / 2;
      const dropZ = blockT * 0.6 + boardT;

      const make: Record<string, string> = {
        '--page-w': `${pageW}px`,
        '--page-h': `${pageH}px`,
        '--page-x': `${portrait ? sq : 0}px`,
        '--page-y': `${portrait ? 0 : sq}px`,
        '--board-w': `${boardW}px`,
        '--board-h': `${boardH}px`,
        '--square': `${sq}px`,
        '--board': `${boardT}px`,
        '--block': `${blockT}px`,
        '--joint': `${Math.round(pageH * joint)}px`,
        '--ribbon-x': `${portrait ? boardW / 2 : Math.round(pageW * 0.06)}px`,
        '--ribbon-drape': `${Math.hypot(dropY, dropZ).toFixed(2)}px`,
        '--ribbon-angle': `${((Math.atan2(dropZ, dropY) * 180) / Math.PI).toFixed(2)}deg`,
      };
      for (const [name, value] of Object.entries(make)) stage.style.setProperty(name, value);
      render(scrollYProgress.get());
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [render, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, 'change', render);

  // A shut book asks to be opened: a click scrolls it open.
  const openBook = () => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const target = top + (section.offsetHeight - stage.offsetHeight) * OPENED_AT;
    if (lenis) lenis.scrollTo(target, { duration: 2.4, easing: easeInOut });
    else window.scrollTo({ top: target, behavior: 'smooth' });
  };

  // Open, the ribbon reads on. The hash is the route, so the jump moves
  // focus in JavaScript.
  const readOn = () => {
    const next = sectionRef.current?.nextElementSibling;
    if (!(next instanceof HTMLElement)) return;
    const heading = next.querySelector<HTMLElement>('h2');
    if (lenis) lenis.scrollTo(next);
    else next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.hero} ${first ? '' : styles.again} ${reduce ? styles.still : ''}`}
      aria-labelledby="hero-title"
    >
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.scene}>
          <div className={styles.book}>
            {/* The bookmark: shut, it opens the book; open, it reads on.
                First in the source, so the next tab after opening lands on
                the title page's own links. */}
            <button
              type="button"
              className={styles.ribbon}
              onClick={isOpen ? readOn : openBook}
              aria-label={isOpen ? t('hero.readOn') : t('hero.openBook')}
            />

            {/* Everything under the first leaf: the shadows on the page, the
                back board, the edges of the pages, the headbands, and the
                ribbon where it leaves the pages */}
            <span className={styles.body} aria-hidden="true">
              <span className={styles.shadow} />
              <span className={styles.fallShadow} />
              <span className={styles.back} />
              <span className={styles.backBottom} />
              <span className={styles.backRight} />
              <span className={styles.pagesBottom} />
              <span className={styles.pagesRight} />
              <span className={`${styles.headband} ${styles.headbandHead}`} />
              <span className={`${styles.headband} ${styles.headbandTail}`} />
              <span className={styles.drape} />
            </span>

            {/* The title page, the first leaf, under the cover */}
            <div className={styles.page}>
              <p className={styles.place}>
                {t('brand.city')}, {t('brand.address')}
              </p>
              <h1 id="hero-title" className={styles.title}>
                <span>{t('hero.coffee')}</span>{' '}
                <span>
                  {t('hero.and')} {t('hero.books')}
                </span>
              </h1>
              <div className={styles.details}>
                <OpenStatus />
                <Link to="/menu" className={styles.menuLink}>
                  {t('hero.ctaMenu')}
                </Link>
              </div>
            </div>

            {/* The front board: the stamped cloth, its two edges a reader
                can see, and inside it the room */}
            <div className={styles.cover}>
              <div className={styles.front} aria-hidden="true" onClick={openBook}>
                <span className={styles.rule} />
                <Emblem className={styles.emblem} dust="settle" delay={first ? 1.1 : 0.3} />
                <Wordmark className={styles.wordmark} />
                <span className={styles.motto}>{t('brand.motto')}</span>
              </div>
              <span className={styles.coverBottom} aria-hidden="true" />
              <span className={styles.coverRight} aria-hidden="true" />
              {/* The room, printed on the endpaper pasted down inside the
                  board. The loader warms it, and index.html preloads it, so
                  it is there before the cover lifts. */}
              <div className={styles.inside}>
                <div className={styles.plate}>
                  <Image
                    name="hall/counter"
                    alt={t('hero.plateAlt')}
                    className={styles.image}
                    sizes={HERO_SIZES}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <span className={styles.cue} aria-hidden="true" />
      </div>
    </section>
  );
}
