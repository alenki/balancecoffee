import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Image } from '../components/common/Image';
import { Emblem } from '../components/common/Emblem';
import { READING_MASONRY_SIZES } from '../components/common/imageSizes';
import { galleryPhotos, type GalleryPhoto } from '../data/gallery';
import { getGuestQuotes } from '../data/guestQuotes';
import { cafe } from '../data/cafe';
import type { GuestQuote } from '../types';
import styles from './ReadingRoomPage.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

type WallItem =
  | { kind: 'photo'; photo: GalleryPhoto }
  | { kind: 'quote'; quote: GuestQuote };

/** A guest note after every sixth photograph, starting after the third. */
function hang(photos: GalleryPhoto[], quotes: GuestQuote[]): WallItem[] {
  const wall: WallItem[] = [];
  let q = 0;
  photos.forEach((photo, i) => {
    wall.push({ kind: 'photo', photo });
    if ((i + 4) % 6 === 0 && q < quotes.length) {
      wall.push({ kind: 'quote', quote: quotes[q] });
      q += 1;
    }
  });
  return wall;
}

function Photo({ photo, index }: { photo: GalleryPhoto; index: number }) {
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <motion.figure
      ref={ref}
      className={`${styles.card} ${styles.photoCard}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.05 * Math.min(index, 12), ease }}
    >
      <Image
        name={photo.image}
        alt={photo.alt[lang]}
        fit="intrinsic"
        className={styles.photo}
        sizes={READING_MASONRY_SIZES}
        motionStyle={{ y, scale: 1.1 }}
      />
    </motion.figure>
  );
}

function Quote({ quote, index }: { quote: GuestQuote; index: number }) {
  const { lang, t } = useLanguage();
  return (
    <motion.figure
      className={`${styles.card} ${styles.quoteCard}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.05 * Math.min(index, 12), ease }}
    >
      <span className={styles.quoteMark} aria-hidden="true">
        {lang === 'ru' ? '«' : '\u201C'}
      </span>
      <blockquote className={styles.quoteText}>
        <p>{quote.text}</p>
      </blockquote>
      <figcaption className={styles.quoteSource}>
        {quote.author}, {quote.year} · {t('reading.quoteSource')}
      </figcaption>
    </motion.figure>
  );
}

export function ReadingRoomPage() {
  const { lang, t } = useLanguage();
  const wall = hang(galleryPhotos, getGuestQuotes(lang));

  return (
    <main className={styles.page} id="main" data-ends-on-cloth>
      <section className={styles.hero}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          {t('reading.title')}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
        >
          {t('reading.subtitle')}
        </motion.p>
      </section>

      <section className={styles.gridSection} aria-label={t('reading.title')}>
        <div className={styles.masonry}>
          {wall.map((item, index) =>
            item.kind === 'photo' ? (
              <Photo key={item.photo.image} photo={item.photo} index={index} />
            ) : (
              <Quote key={item.quote.id} quote={item.quote} index={index} />
            )
          )}
        </div>
      </section>

      <section className={styles.more}>
        <span className={styles.cloth} aria-hidden="true" />
        <div className={styles.moreInner}>
          <Emblem className={styles.moreEmblem} />
          <h2 className={styles.moreTitle}>{t('reading.moreTitle')}</h2>
          <p className={styles.moreText}>{t('reading.moreText')}</p>
          <a
            href={cafe.instagram}
            className={styles.moreCta}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('reading.moreCta')} ${cafe.instagramHandle}, ${t('common.newTab')}`}
          >
            {cafe.instagramHandle}
          </a>
        </div>
      </section>
    </main>
  );
}
