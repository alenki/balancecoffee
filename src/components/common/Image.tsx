import { useState, type CSSProperties } from 'react';
import { motion, type MotionStyle } from 'motion/react';
import { images, type ImageName } from '../../generated/image-manifest';
import styles from './Image.module.css';

/**
 * Images already decoded once in this session.
 *
 * Remounting an image (back navigation, a language switch, scrolling a route
 * back into view) would otherwise replay the blur-up over a picture the
 * browser already holds, which reads as a glitch rather than as polish.
 */
const shown = new Set<ImageName>();

/**
 * How the image occupies its box:
 * - `cover`    : fills a positioned ancestor (the common case: a wrapper with
 *                 a fixed `aspect-ratio`). Needs `position: relative` above it.
 * - `intrinsic`: reserves its own aspect ratio in normal flow, for masonry and
 *                 other places where the image decides the height.
 * - `bare`     : no frame and no placeholder; for logos and flat artwork.
 */
type Fit = 'cover' | 'intrinsic' | 'bare';

interface ImageProps {
  name: ImageName;
  alt: string;
  /** Required for `cover`/`intrinsic`: a wrong value defeats the whole ladder. */
  sizes?: string;
  className?: string;
  frameClassName?: string;
  fit?: Fit;
  /** LCP images: fetched eagerly at high priority and shown without a fade. */
  priority?: boolean;
  /**
   * Parallax or other motion values applied to the image itself. Whether this
   * is passed must be constant per call site: it selects the element type.
   */
  motionStyle?: MotionStyle;
  style?: CSSProperties;
}

// The manifest's paths are rooted at the site; the site itself may be served
// from a subfolder (BASE_URL, set by `base` in vite.config.ts).
const at = (base: string) => `${import.meta.env.BASE_URL}${base.replace(/^\//, '')}`;

const srcSetFor = (base: string, widths: number[], ext: string) =>
  widths.map((w) => `${at(base)}-${w}.${ext} ${w}w`).join(', ');

export function Image({
  name,
  alt,
  sizes,
  className,
  frameClassName,
  fit = 'cover',
  priority = false,
  motionStyle,
  style,
}: ImageProps) {
  const meta = images[name];
  // Captured once per mount: an image seen earlier in the session skips the
  // dissolve completely, rather than fading in over itself.
  const [seenBefore] = useState(() => shown.has(name));
  const [loaded, setLoaded] = useState(seenBefore);

  if (!meta) {
    if (import.meta.env.DEV) console.warn(`<Image>: "${name}" is not in the manifest.`);
    return null;
  }

  const instant = priority || seenBefore;
  const imgClass = [
    styles.img,
    instant ? styles.instant : loaded ? styles.loaded : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const shared = {
    alt,
    sizes,
    className: imgClass,
    // Widest WebP rung is the ultimate fallback; srcSet handles everything modern.
    src: `${at(meta.base)}-${meta.widths[meta.widths.length - 1]}.webp`,
    srcSet: srcSetFor(meta.base, meta.widths, 'webp'),
    width: meta.w,
    height: meta.h,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
    decoding: 'async' as const,
    onLoad: () => {
      shown.add(name);
      setLoaded(true);
    },
    // A failed load must still reveal the element, or it stays invisible at
    // opacity 0 with no alt text and nothing to debug.
    onError: () => setLoaded(true),
  };

  const picture = (
    <picture>
      <source type="image/avif" srcSet={srcSetFor(meta.base, meta.widths, 'avif')} sizes={sizes} />
      {motionStyle ? (
        <motion.img {...shared} style={motionStyle} />
      ) : (
        <img {...shared} style={style} />
      )}
    </picture>
  );

  if (fit === 'bare') return picture;

  const frameStyle = {
    ...(meta.lqip ? { '--lqip': `url("${meta.lqip}")` } : null),
    ...(fit === 'intrinsic' ? { aspectRatio: `${meta.w} / ${meta.h}` } : null),
  } as CSSProperties;

  return (
    <span
      className={[fit === 'cover' ? styles.frameCover : styles.frameIntrinsic, frameClassName]
        .filter(Boolean)
        .join(' ')}
      style={frameStyle}
    >
      {picture}
    </span>
  );
}
