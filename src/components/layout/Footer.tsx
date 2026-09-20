import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { Logo } from '../common/Logo';
import { useLanguage } from '../../context/LanguageContext';
import { contactInfo } from '../../data/contact';
import { branches } from '../../data/branches';
import { pick } from '../../types';
import styles from './Footer.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { to: '/menu', key: 'nav.menu' },
  { to: '/roastery', key: 'nav.roastery' },
  { to: '/branches', key: 'nav.branches' },
  { to: '/contact', key: 'nav.contact' },
] as const;

function Panel({
  children,
  label,
  delay = 0,
}: {
  children: React.ReactNode;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={styles.panel}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      <span className={styles.panelLabel}>{label}</span>
      {children}
    </motion.div>
  );
}

export function Footer() {
  const { lang, t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const brandRef = useRef<HTMLDivElement>(null);
  const brandInView = useInView(brandRef, { once: true, margin: '-40px' });
  const { legal } = contactInfo;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand band */}
        <div className={styles.brandBand} ref={brandRef}>
          <motion.div
            className={styles.brandInner}
            initial={{ opacity: 0, y: 20 }}
            animate={brandInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE }}
          >
            <Logo size="lg" variant="light" />
            <p className={styles.tagline}>{t('footer.tagline')}</p>
          </motion.div>
        </div>

        <div className={styles.grid}>
          <Panel label={t('footer.navigation')} delay={0}>
            <nav className={styles.list}>
              {NAV.map(({ to, key }) => (
                <Link key={to} to={to} className={styles.listLink}>
                  {t(key)}
                </Link>
              ))}
              <a
                href={contactInfo.shop}
                className={styles.listLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('nav.shop')}
              </a>
            </nav>
          </Panel>

          <Panel label={t('branches.label')} delay={0.08}>
            <div className={styles.list}>
              {branches.map((branch) => (
                <a
                  key={branch.id}
                  href={branch.mapUrl}
                  className={styles.listLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pick(branch.name, lang)}
                  {branch.isComingSoon && (
                    <span className={styles.soon}>{t('branches.comingSoon')}</span>
                  )}
                </a>
              ))}
            </div>
          </Panel>

          <Panel label={t('footer.contacts')} delay={0.16}>
            <div className={styles.list}>
              <a href={contactInfo.phoneHref} className={styles.listLink}>
                {/* A Western number inside Arabic text: isolate it or the
                    bidi algorithm reorders the groups. */}
                <bdi>{contactInfo.phone}</bdi>
              </a>
              <a href={`mailto:${contactInfo.email}`} className={styles.listLink}>
                <bdi>{contactInfo.email}</bdi>
              </a>
              <a
                href={contactInfo.instagram}
                className={styles.listLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href={contactInfo.whatsapp}
                className={styles.listLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
            <p className={styles.hours}>
              <bdi>
                {contactInfo.hours.start} {t('common.timeRange')} {contactInfo.hours.end}
              </bdi>
            </p>
          </Panel>

          <Panel label={t('footer.legal')} delay={0.24}>
            <div className={styles.legal}>
              <p className={styles.legalCompany}>{pick(legal.company, lang)}</p>
              <p className={styles.legalRow}>
                <span>{t('footer.cr')}</span>
                <bdi className={styles.legalValue}>{legal.commercialRegister}</bdi>
              </p>
              <p className={styles.legalRow}>
                <span>{t('footer.vat')}</span>
                <bdi className={styles.legalValue}>{legal.vat}</bdi>
              </p>
              <p className={styles.legalAddress}>{pick(legal.address, lang)}</p>
            </div>
          </Panel>
        </div>

        <div className={styles.colophon}>
          <p className={styles.copyright}>
            <bdi>&copy; {currentYear}</bdi> Bloom Roastery. {t('footer.rights')}.
          </p>
          <a
            href="https://lumako.net"
            className={styles.credit}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('footer.creditAria')}
          >
            <span className={styles.creditMark}>
              Lumako<span className={styles.creditDot}>.</span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
