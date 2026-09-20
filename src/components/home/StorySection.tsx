import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { openBranches } from '../../data/branches';
import { origins } from '../../data/contact';
import { allItems } from '../../data/menu';
import styles from './StorySection.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

export function StorySection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(innerRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  // Vertical only: translateY needs no direction handling.
  const drift = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);

  const stats = [
    { value: String(openBranches.length), label: t('story.statBranches') },
    { value: String(origins.length), label: t('story.statOrigins') },
    { value: String(allItems.length), label: t('story.statItems') },
  ];

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.grain} aria-hidden="true" />

      <motion.span
        className={`${styles.corner} ${styles.cornerStart}`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 0.5, ease: EASE }}
      >
        {t('story.label')}
      </motion.span>
      <motion.span
        className={`${styles.corner} ${styles.cornerEnd}`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 0.6, ease: EASE }}
      >
        {t('story.since')}
      </motion.span>

      <motion.div className={styles.inner} ref={innerRef} style={{ y: drift }}>
        <motion.p
          className={styles.lead}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease: EASE }}
        >
          {t('story.lead')}
        </motion.p>

        <motion.p
          className={styles.body}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 0.12, ease: EASE }}
        >
          {t('story.body1')}
        </motion.p>

        <motion.p
          className={styles.body}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
        >
          {t('story.body2')}
        </motion.p>

        <motion.div
          className={styles.stats}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
