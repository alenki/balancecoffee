import { motion } from 'motion/react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { contactInfo } from '../../data/locations';
import { useCity } from '../../hooks/useCity';
import styles from './AboutSection.module.css';

export function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { currentCity } = useCity();

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z"/>
          <path d="M12 13V21M12 21H8M12 21H16"/>
        </svg>
      ),
      title: 'Свежая обжарка',
      description: 'Обжариваем зёрна каждую неделю для идеального вкуса'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 6V12L16 14"/>
        </svg>
      ),
      title: 'Быстрая доставка',
      description: `С ${contactInfo.deliveryHours.start} до ${contactInfo.deliveryHours.end} по всему городу`
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      ),
      title: 'С любовью',
      description: 'Каждый напиток готовим с душой и вниманием к деталям'
    },
  ];

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.eyebrow}>О нас</span>
          <h2 className={styles.title}>
            Больше чем просто кофейня
          </h2>
          <p className={styles.subtitle}>
            Balance — это место, где каждый найдёт свой идеальный баланс вкуса и атмосферы.
            Мы создаём пространство для встреч, работы и отдыха.
          </p>
        </motion.div>

        <div className={styles.features}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={styles.feature}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.stats}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className={styles.stat}>
            <span className={styles.statNumber}>6</span>
            <span className={styles.statLabel}>городов</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>{currentCity.locations.length}</span>
            <span className={styles.statLabel}>
              {currentCity.locations.length === 1 ? 'кофейня' :
               currentCity.locations.length < 5 ? 'кофейни' : 'кофеен'} в {currentCity.name}
            </span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>позиций в меню</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative quote */}
      <motion.div
        className={styles.quote}
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <span className={styles.quoteText}>
          "Кофе — это жидкое объятие для вашей души"
        </span>
      </motion.div>
    </section>
  );
}
