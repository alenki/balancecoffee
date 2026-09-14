import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { cities, contactInfo } from '../../data/locations';
import { useLanguage } from '../../context/LanguageContext';
import type { City } from '../../types';
import styles from './CafesSection.module.css';

const ease = [0.16, 1, 0.3, 1] as const;
const totalLocations = cities.reduce((sum, c) => sum + c.locations.length, 0);

function CityRow({
  city,
  index,
  isExpanded,
  onToggle,
  isVisible,
  t,
}: {
  city: City;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isVisible: boolean;
  t: (key: string) => string;
}) {
  const hasComingSoon = city.locations.some((l) => l.isComingSoon);

  return (
    <motion.div
      className={styles.cityRow}
      initial={{ opacity: 0, y: 25 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.2 + index * 0.08, ease }}
    >
      {/* Divider line: animates width */}
      <motion.div
        className={styles.rowDivider}
        initial={{ scaleX: 0 }}
        animate={isVisible ? { scaleX: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.15 + index * 0.08, ease }}
      />

      <button
        className={`${styles.rowButton} ${isExpanded ? styles.rowButtonActive : ''}`}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className={styles.rowLeft}>
          <span className={styles.cityIndex}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className={styles.cityName}>{city.name}</h3>
          <span className={styles.cityMeta}>
            {city.locations.length}{' '}
            {city.locations.length === 1
              ? t('cafes.cafe1')
              : city.locations.length < 5
                ? t('cafes.cafe2to4')
                : t('cafes.cafe5plus')}
            {hasComingSoon && (
              <span className={styles.soonDot} aria-label={t('cafes.soonLabel')} />
            )}
          </span>
        </div>

        <div className={styles.rowRight}>
          <span
            className={`${styles.expandIcon} ${isExpanded ? styles.expandIconActive : ''}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="4" y1="10" x2="16" y2="10" />
              <line
                x1="10"
                y1="4"
                x2="10"
                y2="16"
                className={styles.verticalLine}
              />
            </svg>
          </span>
        </div>
      </button>

      {/* Expandable addresses */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.addressList}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <div className={styles.addressListInner}>
              {city.locations.map((location, locIndex) => (
                <motion.div
                  key={locIndex}
                  className={styles.addressRow}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: locIndex * 0.06,
                    ease,
                  }}
                >
                  <span className={styles.addressDot} />
                  <span className={styles.addressText}>
                    {location.address}
                  </span>
                  {location.isComingSoon && (
                    <span className={styles.soonBadge}>{t('cafes.soon')}</span>
                  )}
                </motion.div>
              ))}

              {/* Contact row inside expanded */}
              <div className={styles.expandedContact}>
                <a
                  href={contactInfo.phoneHref}
                  className={styles.contactLink}
                >
                  {contactInfo.phone}
                </a>
                <span className={styles.contactDivider}>·</span>
                <span className={styles.contactHours}>
                  {contactInfo.deliveryHours.start} {t('common.timeRange')}{' '}
                  {contactInfo.deliveryHours.end}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function CafesSection() {
  const { t } = useLanguage();
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, margin: '-80px' });
  const listInView = useInView(listRef, { once: true, margin: '-60px' });
  const footerInView = useInView(footerRef, { once: true, margin: '-60px' });

  const toggleCity = (cityId: string) => {
    setExpandedCity((prev) => (prev === cityId ? null : cityId));
  };

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* Corner accents */}
      <motion.span
        className={`${styles.cornerAccent} ${styles.cornerTL}`}
        initial={{ opacity: 0, x: -12 }}
        animate={headerInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3, ease }}
      >
        {t('cafes.label')}
      </motion.span>
      <motion.span
        className={`${styles.cornerAccent} ${styles.cornerTR}`}
        initial={{ opacity: 0, x: 12 }}
        animate={headerInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.4, ease }}
      >
        {cities.length} {t('cafes.cityCount')}
      </motion.span>

      <div className={styles.container}>
        {/* Editorial Header */}
        <div className={styles.header} ref={headerRef}>
          <motion.span
            className={styles.headerItalic}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            {t('cafes.headerItalic')}
          </motion.span>

          <motion.h2
            className={styles.headerBold}
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease }}
          >
            {t('cafes.headerBold1')}
            <br />
            <span className={styles.headerBoldAccent}>{t('cafes.headerBold2')}</span>
          </motion.h2>
        </div>

        {/* City Listing */}
        <div className={styles.cityList} ref={listRef}>
          {cities.map((city, index) => (
            <CityRow
              key={city.id}
              city={city}
              index={index}
              isExpanded={expandedCity === city.id}
              onToggle={() => toggleCity(city.id)}
              isVisible={listInView}
              t={t}
            />
          ))}

          {/* Final divider */}
          <motion.div
            className={styles.rowDivider}
            initial={{ scaleX: 0 }}
            animate={listInView ? { scaleX: 1 } : {}}
            transition={{
              duration: 0.9,
              delay: 0.15 + cities.length * 0.08,
              ease,
            }}
          />
        </div>

        {/* Footer Area */}
        <div className={styles.sectionFooter} ref={footerRef}>
          {/* Stats */}
          <motion.div
            className={styles.stats}
            initial={{ opacity: 0, y: 15 }}
            animate={footerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <span className={styles.statItem}>
              <span className={styles.statNumber}>{cities.length}</span>
              <span className={styles.statLabel}>{t('cafes.statCities')}</span>
            </span>
            <span className={styles.statDivider} />
            <span className={styles.statItem}>
              <span className={styles.statNumber}>{totalLocations}</span>
              <span className={styles.statLabel}>{t('cafes.statCafes')}</span>
            </span>
          </motion.div>

          {/* CTA */}
          <motion.div
            className={styles.ctaWrap}
            initial={{ opacity: 0, y: 15 }}
            animate={footerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            <a href="https://www.instagram.com/lumako.ru/" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
              {t('cafes.cta')}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
