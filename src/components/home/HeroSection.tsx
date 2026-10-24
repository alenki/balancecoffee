import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { useLenisInstance } from '../../hooks/useLenis';
import { Emblem } from '../common/Emblem';
import { Image } from '../common/Image';
import { FRONTISPIECE_SIZES } from '../common/imageSizes';
import { Wordmark } from '../common/Logo';
import styles from './HeroSection.module.css';

/**
 * The first arrival waits for the loader's head to rise into the header.
 * Coming back to the home page later there is no loader, so the book is set
 * down almost at once.
 */
let loaderStillUp = true;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 2;

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
/** The tallest a page is laid out, so on the largest screens it stays a book. */
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
 * How far the camera stands outside the face the end of the spine lies in,
 * in the book's own pixels: the foot when the book is bound on its left
 * edge, the side when it is bound at the head. The book is centred on the
 * lens, and opening it slides along that face, never across it, so the
 * slide drops out of the sum. At zero the end turns edge-on, then away.
 */
function spineMargin(portrait: boolean, boardW: number, boardH: number, pitch: number, yaw: number, lens: number) {
  const tilt = (pitch * Math.PI) / 180;
  const turn = (yaw * Math.PI) / 180;
  return portrait ? -lens * Math.cos(tilt) * Math.sin(turn) - boardW / 2 : lens * Math.sin(tilt) - boardH / 2;
}

/**
 * The book. A clothbound hardback lies shut on the page, the café's mark
 * stamped on the cover. Scrolling swings the front board open on its joint:
 * inside it, an epigraph and a photograph of the café face the title page.
 * The camera rises
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
  // Once the spread lies flat, the cup on the title page is stirred, once
  const [settled, setSettled] = useState(reduce);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Scale of the book shut, and just opened (drawn up it is always 1), the
  // angle the camera first sees it from, and what the end of the spine needs
  // to fade as the camera rises past it
  const geo = useRef({
    shut: 0.7,
    opened: 0.7,
    ...LIE.landscape,
    portrait: false,
    boardW: 0,
    boardH: 0,
    spineFade: 1,
  });

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
      const { shut, opened, pitch, yaw, portrait, boardW, boardH, spineFade } = geo.current;
      const scale = shut + (opened - shut) * open + (1 - opened) * drawUp;
      const swing = open * Math.PI;
      const tilt = pitch * (1 - camera);
      const turn = yaw * (1 - camera);
      const lens = Math.round(LENS.near + (LENS.far - LENS.near) * drawUp ** 3);
      // The end of the spine fades as the camera rises past it, then is
      // taken out, turn-in and all: the turn-in faces across, so it would
      // otherwise linger edge-on as a splinter at the gutter
      const spine = clamp01(spineMargin(portrait, boardW, boardH, tilt, turn, lens) / spineFade);

      const style = stage.style;
      style.setProperty('--open', open.toFixed(4));
      style.setProperty('--lift', Math.sin(swing).toFixed(4));
      style.setProperty('--fall', Math.max(0, -Math.cos(swing)).toFixed(4));
      style.setProperty('--scale', scale.toFixed(4));
      style.setProperty('--pitch', `${tilt.toFixed(3)}deg`);
      style.setProperty('--yaw', `${turn.toFixed(3)}deg`);
      style.setProperty('--lens', `${lens}px`);
      style.setProperty('--details', details.toFixed(3));
      style.setProperty('--spine', spine.toFixed(3));
      stage.toggleAttribute('data-shut', open === 0);
      stage.toggleAttribute('data-details', details > 0);
      stage.toggleAttribute('data-flat', drawUp === 1 && camera === 1);
      stage.toggleAttribute('data-spine-out', spine === 0);
      setIsOpen(open > 0.5);
      if (details > 0) setSettled(true);
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
      const lie = LIE[portrait ? 'portrait' : 'landscape'];
      // The end of the spine fades over the last of the camera's climb past
      // it: a block's depth short of its face, or the whole climb where the
      // shut book shows the end only barely
      const shutMargin = spineMargin(portrait, boardW, boardH, lie.pitch, lie.yaw, LENS.near);
      geo.current = {
        shut,
        opened: Math.min(shut, roomToOpen),
        ...lie,
        portrait,
        boardW,
        boardH,
        spineFade: Math.max(1, Math.min(blockT, shutMargin)),
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

  // A shut book asks to be opened: a click scrolls it open. The scroll
  // starts where the board begins to lift, since the moment the book lies
  // shut shows nothing, and eases out, so the board answers the hand at
  // once; the swing's own easing still lifts it gently. Easing in from the
  // top kept the hand waiting most of a second before the board moved.
  const openBook = () => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const pinned = section.offsetHeight - stage.offsetHeight;
    const lifts = top + pinned * SWING.from;
    const target = top + pinned * OPENED_AT;
    if (lenis) {
      if (window.scrollY < lifts) lenis.scrollTo(lifts, { immediate: true });
      lenis.scrollTo(target, { duration: 2.4, easing: easeOut });
    } else window.scrollTo({ top: target, behavior: 'smooth' });
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

            {/* Beside it, once the spread lies flat, the plain words: the
                page goes on */}
            <span className={styles.hint} aria-hidden="true">
              {t('hero.scroll')}
            </span>

            {/* Everything under the first leaf: the shadows on the page, the
                back board, the edges of the pages, the end of the spine, and
                the ribbon where it leaves the pages */}
            <span className={styles.body} aria-hidden="true">
              <span className={styles.shadow} />
              <span className={styles.fallShadow} />
              <span className={styles.back} />
              <span className={styles.backBottom} />
              <span className={styles.backRight} />
              <span className={styles.pagesBottom} />
              <span className={styles.pagesRight} />
              {/* After the faces its turn-in stands across, as Firefox
                  cuts a face along the planes painted before it */}
              <span className={styles.spineEnd} />
              <span className={styles.spineTurnIn} />
              <span className={styles.drape} />
            </span>

            {/* The title page, the first leaf, under the cover, set the way
                a Russian title page is: the author at the head, the title
                below it, the publisher's device, and the imprint at the
                foot. The café is the author, its mark the device. */}
            <div className={styles.page}>
              <div className={styles.type}>
                <Wordmark className={styles.author} />
                <h1 id="hero-title" className={styles.title}>
                  <span className="sr-only">{t('brand.name')}. </span>
                  <span className={styles.word}>{t('hero.coffee')}</span>{' '}
                  <span className={styles.and}>{t('hero.and')}</span>{' '}
                  <span className={styles.word}>{t('hero.books')}</span>
                </h1>
                <span className={styles.device} data-stirred={settled || undefined}>
                  <Emblem dust={settled && !reduce ? 'settle' : 'still'} delay={0.2} />
                </span>
                {/* The imprint: the street where a book gives its city */}
                <div className={styles.imprint}>
                  <p className={styles.place}>
                    <span>{t('brand.city')}</span>
                    <span aria-hidden="true">&nbsp;· </span>
                    <span className="sr-only">, </span>
                    <span>{t('brand.address')}</span>
                  </p>
                </div>
                {/* In the corner where the leaf is turned, the catchword: a
                    printer's cue naming what comes next, here the menu */}
                <Link
                  to="/menu"
                  className={`${styles.catchword} ${styles.live}`}
                  aria-label={t('hero.ctaMenu')}
                >
                  {t('hero.catchword')}
                  <svg className={styles.catchArrow} viewBox="0 0 16 10" aria-hidden="true" focusable="false">
                    <path d="M1 5h13.5M10.5 1l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* The front board: the stamped cloth, its two edges a reader
                can see, and inside it the endpaper */}
            <div className={styles.cover}>
              <div className={styles.front} aria-hidden="true" onClick={openBook}>
                <span className={styles.rule} />
                <Emblem className={styles.emblem} dust="settle" delay={first ? 1.1 : 0.3} />
                <Wordmark className={styles.wordmark} />
                <span className={styles.motto}>{t('brand.motto')}</span>
              </div>
              <span className={styles.coverBottom} aria-hidden="true" />
              <span className={styles.coverRight} aria-hidden="true" />
              {/* The endpaper, pasted down inside the board, and on it the
                  book's epigraph, Pushkin on habit from Eugene Onegin, over
                  the habit itself: a guest's open book and her coffee in
                  the café's cup. The café lives on his street. The two
                  share one column, so the verse keeps flush with the
                  print's edge. */}
              <div className={styles.inside}>
                <div className={styles.endpaper}>
                  <div className={styles.column}>
                    <figure className={styles.epigraph}>
                      <blockquote className={styles.verse}>
                        <p>
                          {t('hero.epigraph1')}
                          <br />
                          {t('hero.epigraph2')}
                        </p>
                      </blockquote>
                      <figcaption className={styles.poet}>{t('hero.epigraphPoet')}</figcaption>
                    </figure>
                    <div className={styles.plate}>
                      <Image
                        name="hall/book-and-cup"
                        alt={t('hero.plateAlt')}
                        className={styles.image}
                        sizes={FRONTISPIECE_SIZES}
                        priority
                      />
                    </div>
                  </div>
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
