import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { useRef } from 'react';
import { cities } from '../../data/locations';
import styles from './AboutSection.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const manifestoInView = useInView(manifestoRef, { once: true, margin: '-80px' });
  const storyInView = useInView(storyRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const manifestoParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  const totalLocations = cities.reduce((sum, c) => sum + c.locations.length, 0);

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* ══════════════════════════════════════════
          PART 1 — THE MANIFESTO (Dark)
          ══════════════════════════════════════════ */}
      <div className={styles.manifesto} ref={manifestoRef}>
        {/* Grain overlay */}
        <div className={styles.grain} aria-hidden="true" />

        {/* Corner accents matching hero style */}
        <motion.span
          className={`${styles.cornerAccent} ${styles.cornerTL}`}
          initial={{ opacity: 0 }}
          animate={manifestoInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6, ease }}
        >
          О нас
        </motion.span>
        <motion.span
          className={`${styles.cornerAccent} ${styles.cornerTR}`}
          initial={{ opacity: 0 }}
          animate={manifestoInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.7, ease }}
        >
          Est. 2019
        </motion.span>

        <motion.div
          className={styles.manifestoInner}
          style={{ y: manifestoParallax }}
        >
          {/* Manifesto text — each line staggered */}
          <div className={styles.manifestoText}>
            <motion.p
              className={styles.manifestoLine}
              initial={{ opacity: 0, y: 50 }}
              animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0, ease }}
            >
              Мы — Balance. Бренд{' '}
              <em className={styles.manifestoEmphasis}>specialty кофе,</em>{' '}
              обжаренного здесь, в России.
            </motion.p>

            <motion.p
              className={styles.manifestoLine}
              initial={{ opacity: 0, y: 50 }}
              animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.15, ease }}
            >
              Мы также — места. Минималистичные и{' '}
              <em className={styles.manifestoEmphasis}>настоящие</em>{' '}
              кофейни.
            </motion.p>

            <motion.p
              className={styles.manifestoLine}
              initial={{ opacity: 0, y: 50 }}
              animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease }}
            >
              Мы за архитектурные линии и за{' '}
              <em className={styles.manifestoEmphasis}>выразительные,</em>{' '}
              тонкие зёрна.
            </motion.p>

            <motion.p
              className={styles.manifestoLine}
              initial={{ opacity: 0, y: 50 }}
              animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.45, ease }}
            >
              Мы за искренние и яркие впечатления,{' '}
              <em className={styles.manifestoEmphasis}>постоянно обновляемые.</em>
            </motion.p>
          </div>

          {/* Stats as inline editorial typography */}
          <motion.div
            className={styles.statsRow}
            initial={{ opacity: 0, y: 30 }}
            animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.7, ease }}
          >
            <div className={styles.stat}>
              <span className={styles.statNumber}>{cities.length}</span>
              <span className={styles.statDivider} />
              <span className={styles.statLabel}>городов</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{totalLocations}</span>
              <span className={styles.statDivider} />
              <span className={styles.statLabel}>кофеен</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statDivider} />
              <span className={styles.statLabel}>позиций</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          PART 2 — THE STORY (Light split)
          ══════════════════════════════════════════ */}
      <div className={styles.story} ref={storyRef}>
        <div className={styles.storyGrid}>
          {/* Left — Full-height editorial image */}
          <motion.div
            className={styles.storyImageCol}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={storyInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease }}
          >
            <motion.div className={styles.storyImageInner} style={{ y: imageParallax }}>
              <img
                src="/cafe photos/image_3.png"
                alt="Интерьер Balance Coffee"
                className={styles.storyImage}
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          {/* Right — Brand story + Founder card */}
          <div className={styles.storyContent}>
            <motion.span
              className={styles.storyLabel}
              initial={{ opacity: 0, x: -20 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease }}
            >
              История бренда
            </motion.span>

            <motion.h2
              className={styles.storyHeading}
              initial={{ opacity: 0, y: 40 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease }}
            >
              Не просто кофе —<br />
              <span className={styles.storyHeadingAccent}>пространство</span>
            </motion.h2>

            <motion.p
              className={styles.storyText}
              initial={{ opacity: 0, y: 30 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.35, ease }}
            >
              5 лет назад мы открыли Balance Coffee с одной простой
              идеей — создать пространство, где современные, прогрессивные
              и деятельные люди могли бы собираться вместе, обмениваться
              идеями и вдохновляться друг другом.
            </motion.p>

            <motion.p
              className={styles.storyText}
              initial={{ opacity: 0, y: 30 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.45, ease }}
            >
              Сегодня наши кофейни посещает более 6000 таких удивительных
              людей каждый день. Мы мечтаем объединить таких людей по всей
              территории России и за её пределами.
            </motion.p>

            {/* Founder card */}
            <motion.div
              className={styles.founderCard}
              initial={{ opacity: 0, y: 40 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.55, ease }}
            >
              <div className={styles.founderImageWrap}>
                <img
                  src="/cafe photos/image_5.png"
                  alt="Основатель Balance Coffee"
                  className={styles.founderImage}
                  loading="lazy"
                />
              </div>
              <div className={styles.founderInfo}>
                <blockquote className={styles.founderQuote}>
                  Я хотел окружить себя людьми, которые разделяют те же ценности, что и я.
                </blockquote>
                <div className={styles.founderMeta}>
                  <span className={styles.founderName}>Курбан Муртазалиев</span>
                  <span className={styles.founderTitle}>CEO Balance Coffee</span>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              className={styles.storyCta}
              initial={{ opacity: 0, y: 20 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7, ease }}
            >
              <a href="#/menu" className={styles.ctaLink}>
                <span>Открыть меню</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Bottom border accent — editorial divider */}
        <motion.div
          className={styles.sectionDivider}
          initial={{ scaleX: 0 }}
          animate={storyInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8, ease }}
        />
      </div>
    </section>
  );
}
