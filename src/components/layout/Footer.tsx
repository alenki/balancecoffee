import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { Logo } from '../common/Logo';
import { contactInfo, cities } from '../../data/locations';
import styles from './Footer.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

function AnimatedSection({ children, className, delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const brandRef = useRef<HTMLDivElement>(null);
  const brandInView = useInView(brandRef, { once: true, margin: '-40px' });

  return (
    <footer className={styles.footer}>
      {/* ── Brand Band ── */}
      <div className={styles.brandBand} ref={brandRef}>
        <motion.div
          className={styles.brandInner}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={brandInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 1, ease }}
        >
          <span className={styles.brandLabel}>Specialty Coffee</span>
          <h2 className={styles.brandText}>BALANCE COFFEE</h2>
          <p className={styles.brandTagline}>Кофе, созданный с намерением</p>
        </motion.div>
      </div>

      {/* ── Triptych Panels ── */}
      <div className={styles.container}>
        <div className={styles.triptych}>
          <AnimatedSection className={`${styles.panel} ${styles.panelCompact}`} delay={0}>
            <span className={styles.panelLabel}>География</span>
            <h3 className={styles.panelHeading}>Наши<br />кофейни</h3>
            <div className={styles.panelContent}>
              <div className={styles.cityGrid}>
                {cities.map((city) => (
                  <div key={city.id} className={styles.cityCard}>
                    <span className={styles.cityCardCount}>{city.locations.length}</span>
                    <span className={styles.cityCardName}>{city.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className={styles.panel} delay={0.1}>
            <span className={styles.panelLabel}>Навигация</span>
            <h3 className={styles.panelHeading}>Наши<br />страницы</h3>
            <nav className={styles.panelContent}>
              <Link to="/" className={styles.navLink}>
                <span>Главная</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/menu" className={styles.navLink}>
                <span>Меню</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/daily" className={styles.navLink}>
                <span>Daily</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/reviews" className={styles.navLink}>
                <span>Отзывы</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </nav>
          </AnimatedSection>

          <AnimatedSection className={styles.panel} delay={0.2}>
            <span className={styles.panelLabel}>Контакты</span>
            <h3 className={styles.panelHeading}>Свяжитесь<br />с нами</h3>
            <div className={styles.panelContent}>
              <a
                href="https://www.instagram.com/balancecoffee.ru/"
                className={styles.contactLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href={contactInfo.telegram}
                className={styles.contactLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
              <a href={contactInfo.phoneHref} className={styles.contactLink}>
                {contactInfo.phone}
              </a>
            </div>
            <div className={styles.panelFooter}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 4.5V8L10.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{contactInfo.deliveryHours.start} — {contactInfo.deliveryHours.end}</span>
            </div>
          </AnimatedSection>
        </div>

        {/* ── Brand Row ── */}
        <AnimatedSection className={styles.brandRow} delay={0.3}>
          <div className={styles.brandRowLeft}>
            <span className={styles.brandRowDescriptor}>Кофе, выпечка, свежевыжатые соки</span>
          </div>
          <div className={styles.brandRowCenter}>
            <Logo size="lg" variant="light" />
          </div>
          <div className={styles.brandRowRight}>
            <span className={styles.brandRowDescriptor}>Specialty Coffee · Open 7/7</span>
          </div>
        </AnimatedSection>

        {/* ── Colophon ── */}
        <AnimatedSection className={styles.colophon} delay={0.35}>
          <a
            href="https://okaraf.ru"
            className={styles.karafBadge}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.karafText}>Made by Karaf</span>
            <span className={styles.karafLine} aria-hidden="true" />
          </a>
          <p className={styles.copyright}>
            &copy; {currentYear} Balance Coffee
          </p>
        </AnimatedSection>
      </div>
    </footer>
  );
}
