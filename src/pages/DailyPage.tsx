import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import styles from './DailyPage.module.css';

interface DailyItem {
  id: string;
  type: 'image' | 'quote' | 'music';
  image?: string;
  title?: string;
  artist?: string;
  quote?: string;
  quoteKey?: string;
  spotifyUrl?: string;
}

// Items ordered for optimal column-based masonry flow (top to bottom, left to right)
// With 3 columns: items 1-7 = left, items 8-14 = middle, items 15-21 = right
// Quote/music cards only in middle column (positions 9 and 12)
const dailyItems: DailyItem[] = [
  // LEFT COLUMN (items 1-7) - images only
  {
    id: '1',
    type: 'image',
    image: '/cafe photos/image_16.png',
  },
  {
    id: '3',
    type: 'image',
    image: '/cafe photos/image_3.png',
  },
  {
    id: '4',
    type: 'image',
    image: '/cafe photos/image_4.png',
  },
  {
    id: '5',
    type: 'image',
    image: '/cafe photos/image_5.png',
  },
  {
    id: '6',
    type: 'image',
    image: '/cafe photos/image_6.png',
  },
  {
    id: '7',
    type: 'image',
    image: '/cafe photos/image_7.png',
  },
  // MIDDLE COLUMN (items 8-14) - images + 2 quote cards spread out
  {
    id: '8',
    type: 'quote',
    quoteKey: 'daily.quote1',
  },
  {
    id: '9',
    type: 'image',
    image: '/cafe photos/image_9.png',
  },
  {
    id: '10',
    type: 'image',
    image: '/cafe photos/image_8.png',
  },
  {
    id: '11',
    type: 'quote',
    quoteKey: 'daily.quote2',
  },
  {
    id: '12',
    type: 'image',
    image: '/cafe photos/image_11.png',
  },
  {
    id: '13',
    type: 'image',
    image: '/cafe photos/image_10.png',
  },
  {
    id: '14',
    type: 'image',
    image: '/cafe photos/image_12.png',
  },
  // RIGHT COLUMN (items 15-21) - images only
  {
    id: '15',
    type: 'image',
    image: '/cafe photos/image_13.png',
  },
  {
    id: '16',
    type: 'image',
    image: '/cafe photos/image_14.png',
  },
  {
    id: '17',
    type: 'image',
    image: '/cafe photos/image_15.png',
  },
];

function ParallaxImage({ src, index }: { src: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <motion.div
      ref={ref}
      className={`${styles.card} ${styles.imageCard}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: 0.05 * Math.min(index, 12),
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <motion.img
        src={src}
        alt=""
        className={styles.cardImage}
        loading="lazy"
        style={{ y }}
      />
    </motion.div>
  );
}

function DailyCard({ item, index }: { item: DailyItem; index: number }) {
  const { t } = useLanguage();

  if (item.type === 'image') {
    return <ParallaxImage src={item.image!} index={index} />;
  }

  if (item.type === 'quote') {
    const quoteText = item.quoteKey ? t(item.quoteKey) : item.quote;
    return (
      <motion.div
        className={`${styles.card} ${styles.quoteCard}`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.05 * Math.min(index, 12),
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div className={styles.quoteContent}>
          <span className={styles.quoteMark}>"</span>
          <p className={styles.quoteText}>{quoteText}</p>
        </div>
      </motion.div>
    );
  }

  if (item.type === 'music') {
    return (
      <motion.div
        className={`${styles.card} ${styles.musicCard}`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.05 * Math.min(index, 12),
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div className={styles.musicContent}>
          <span className={styles.musicLabel}>{item.title}</span>
          <span className={styles.musicArtist}>{item.artist}</span>
          <p className={styles.musicQuote}>{item.quote}</p>
          {item.spotifyUrl && (
            <a
              href={item.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.spotifyLink}
            >
              listen on spotify
            </a>
          )}
        </div>
      </motion.div>
    );
  }

  return null;
}

export function DailyPage() {
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Daily
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {t('daily.subtitle').split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </motion.p>
      </section>

      {/* Masonry Grid */}
      <section className={styles.gridSection}>
        <div className={styles.masonry}>
          {dailyItems.map((item, index) => (
            <DailyCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

    </main>
  );
}
