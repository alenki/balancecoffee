import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useReveal } from '../../hooks/useReveal';
import { Logo } from '../common/Logo';
import { useLanguage } from '../../context/LanguageContext';
import { contactInfo } from '../../data/contact';
import { branches } from '../../data/branches';
import { pick } from '../../types';
import styles from './Footer.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Every entrance in this footer is vertical, so none of them needs `sign`:
 * there is no `x` anywhere in the file, which is why `sign` is deliberately
 * not destructured from `useLanguage` below.
 */
const RISE = { opacity: 0, y: 22 };
const SETTLED = { opacity: 1, y: 0 };

const NAV = [
  { to: '/menu', key: 'nav.menu' },
  { to: '/branches', key: 'nav.branches' },
  { to: '/contact', key: 'nav.contact' },
] as const;

/**
 * Points along the reading direction. `out` turns it into the outbound arrow
 * that marks a link leaving the site.
 *
 * Drawn rather than set: no face the site loads carries an arrow glyph, so a
 * character would fall through to a system font with foreign metrics. Both
 * flips live in the stylesheet, because neither `scale` nor `rotate` is
 * mirrored by the document's direction.
 */
function Arrow({ out = false }: { out?: boolean }) {
  return (
    <svg
      className={out ? `${styles.barArrow} ${styles.barArrowOut}` : styles.barArrow}
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 10H16M16 10L11 5M16 10L11 15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One track of the ledger. The observer lives on the band rather than here:
 * four observers for four columns is four chances to miss an observation, and
 * the stagger only needs a delay.
 */
function Track({
  label,
  delay,
  revealed,
  children,
}: {
  label: string;
  delay: number;
  revealed: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={styles.track}
      initial={RISE}
      animate={revealed ? SETTLED : undefined}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      <h2 className={styles.trackLabel}>{label}</h2>
      {children}
    </motion.div>
  );
}

export function Footer() {
  const { lang, t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const { legal, hours } = contactInfo;

  // One reveal per band, with the children inside a band separated by their
  // own delay. Three observers, where the outgoing footer ran five.
  const { ref: nameplateRef, revealed: nameplateIn } = useReveal<HTMLDivElement>({ margin: -40 });
  const { ref: ledgerRef, revealed: ledgerIn } = useReveal<HTMLDivElement>({ margin: -60 });
  const { ref: colophonRef, revealed: colophonIn } = useReveal<HTMLDivElement>({ margin: -20 });

  return (
    <footer className={styles.footer}>
      <div className={styles.grain} aria-hidden="true" />

      {/* Beat one: the nameplate. One acid hairline crosses the whole page, the
          monogram cuts it, the name carries the width, one editorial line
          closes it. */}
      <div className={styles.band} ref={nameplateRef}>
        <motion.div
          className={styles.wire}
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={nameplateIn ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.3, ease: EASE }}
        />

        <div className={styles.crown}>
          <div className={styles.crownPad}>
            <motion.div
              className={styles.crownMark}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={nameplateIn ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.8, ease: EASE, delay: 0.18 }}
            >
              <Logo size="lg" variant="light" markOnly />
            </motion.div>
          </div>
        </div>

        <div className={`${styles.bandInner} ${styles.masthead}`}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 12 }}
            animate={nameplateIn ? SETTLED : undefined}
            transition={{ duration: 0.7, ease: EASE, delay: 0.26 }}
          >
            {/* The Arabic string is already in Arabic-Indic digits, so it needs
                no isolation. */}
            {t('story.since')}
          </motion.p>

          <motion.div
            className={styles.name}
            aria-hidden="true"
            initial={{ opacity: 0, y: 28 }}
            animate={nameplateIn ? SETTLED : undefined}
            transition={{ duration: 1.1, ease: EASE, delay: 0.32 }}
          >
            {lang === 'ar' ? (
              // Kashida, the way their logo file draws it. Decorative: the
              // accessible name lives on the monogram's link above.
              <span className={styles.nameArabic}>بلـــــوم روســـتري</span>
            ) : (
              <span className={styles.nameLatin}>Bloom Roastery</span>
            )}
          </motion.div>

          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0, y: 16 }}
            animate={nameplateIn ? SETTLED : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: 0.44 }}
          >
            {t('footer.tagline')}
          </motion.p>
        </div>
      </div>

      {/* Beat two: the ledger. Four tracks divided by vertical hairlines and
          bracketed by one rule above and one below. Browse, the track that is
          a list of destinations, is the only one that rules its rows. Every
          other row is a stack of a label over its value, which is what removes
          the label to value span a band this wide would otherwise open. */}
      <div className={styles.band} ref={ledgerRef}>
        <div className={styles.bandInner}>
          <div className={styles.tracks}>
            <Track label={t('footer.navigation')} delay={0} revealed={ledgerIn}>
              <nav className={styles.bars} aria-label={t('footer.navigation')}>
                {NAV.map(({ to, key }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`${styles.bar} ${styles.barNav} ${styles.barLink}`}
                  >
                    <span className={styles.barName}>{t(key)}</span>
                    <Arrow />
                    <span className={styles.barRule} aria-hidden="true" />
                  </Link>
                ))}
                <a
                  href={contactInfo.shop}
                  className={`${styles.bar} ${styles.barNav} ${styles.barLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.barName}>{t('nav.shop')}</span>
                  <Arrow out />
                  <span className={styles.barRule} aria-hidden="true" />
                </a>
              </nav>
            </Track>

            <Track label={t('branches.label')} delay={0.08} revealed={ledgerIn}>
              <div className={styles.bars}>
                {branches.map((branch) => (
                  <a
                    key={branch.id}
                    href={branch.mapUrl}
                    className={`${styles.bar} ${styles.barLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.barLead}>
                      <span className={styles.barName}>{pick(branch.name, lang)}</span>
                      {branch.isComingSoon && (
                        <span className={styles.soon}>{t('branches.comingSoon')}</span>
                      )}
                    </span>
                    <span className={styles.barMeta}>
                      {pick(branch.district ?? branch.city, lang)}
                    </span>
                    {/* Nothing in the visible row says the link opens a map.
                        The utility is the global one in index.css. */}
                    <span className="sr-only">{t('branches.viewMap')}</span>
                    <span className={styles.barRule} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </Track>

            <Track label={t('footer.contacts')} delay={0.16} revealed={ledgerIn}>
              <div className={styles.bars}>
                <a href={contactInfo.phoneHref} className={`${styles.bar} ${styles.barLink}`}>
                  <span className={styles.barLabel}>{t('contact.callUs')}</span>
                  {/* A Western number inside Arabic text: isolate it or the
                      bidi algorithm reorders the groups. */}
                  <bdi className={styles.barValue}>{contactInfo.phone}</bdi>
                  <span className={styles.barRule} aria-hidden="true" />
                </a>

                <a
                  href={`mailto:${contactInfo.email}`}
                  className={`${styles.bar} ${styles.barLink}`}
                >
                  <span className={styles.barLabel}>{t('contact.email')}</span>
                  <bdi className={styles.barValue}>{contactInfo.email}</bdi>
                  <span className={styles.barRule} aria-hidden="true" />
                </a>

                <div className={styles.bar}>
                  <span className={styles.barLabel}>{t('contact.follow')}</span>
                  <span className={styles.channels}>
                    <a
                      href={contactInfo.instagram}
                      className={styles.channel}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                    <span className={styles.channelDiamond} aria-hidden="true" />
                    <a
                      href={contactInfo.whatsapp}
                      className={styles.channel}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('contact.whatsapp')}
                    </a>
                  </span>
                </div>

                <div className={styles.bar}>
                  <span className={styles.barLabel}>{t('branches.daily')}</span>
                  {/* One isolate around the whole range, not one per end: the
                      range is a single bidi run. */}
                  <bdi className={styles.barValue}>
                    {hours.start} {t('common.timeRange')} {hours.end}
                  </bdi>
                </div>
              </div>
            </Track>

            <Track label={t('footer.legal')} delay={0.24} revealed={ledgerIn}>
              <div className={styles.bars}>
                <div className={styles.bar}>
                  <p className={styles.barCompany}>{pick(legal.company, lang)}</p>
                </div>
                <div className={styles.bar}>
                  <span className={styles.barLabel}>{t('footer.cr')}</span>
                  <bdi className={styles.barFigure}>{legal.commercialRegister}</bdi>
                </div>
                <div className={styles.bar}>
                  <span className={styles.barLabel}>{t('footer.vat')}</span>
                  <bdi className={styles.barFigure}>{legal.vat}</bdi>
                </div>
                <div className={styles.bar}>
                  <span className={styles.barLabel}>{t('contact.visit')}</span>
                  {/* The Arabic address is already in Arabic-Indic digits, and
                      the English one sits in an LTR run, so neither needs an
                      isolate. */}
                  <address className={styles.barAddress}>{pick(legal.address, lang)}</address>
                </div>
              </div>
            </Track>
          </div>
        </div>
      </div>

      {/* Beat three: the colophon. A mark at each end and the brand ornament
          between them, so the closing band is the rule. */}
      <div className={styles.band} ref={colophonRef}>
        <div className={styles.bandInner}>
          <motion.div
            className={styles.colophon}
            initial={{ opacity: 0, y: 14 }}
            animate={colophonIn ? SETTLED : undefined}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {/* The full stop sits inside the isolate: outside it, it is a bidi
                neutral in an Arabic paragraph and resolves to the paragraph's
                direction, which puts it on the wrong side of the name. */}
            <p className={styles.copyright}>
              <bdi>&copy; {currentYear} Bloom Roastery.</bdi> {t('footer.rights')}.
            </p>
            <span className={styles.colophonSeam} aria-hidden="true" />
            <a
              href="https://lumako.net"
              className={styles.credit}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footer.creditAria')}
            >
              {/* Isolated for the same reason the copyright above is. The
                  full stop is part of the Lumako mark, but on its own it is a
                  bidi neutral with a Latin run on one side and the end of an
                  Arabic paragraph on the other, so it takes the paragraph's
                  direction and reorders to the far side of the word: the mark
                  reads ".Lumako" in the site's default language. */}
              <bdi className={styles.creditMark}>
                Lumako<span className={styles.creditDot}>.</span>
              </bdi>
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
