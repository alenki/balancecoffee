import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { cities, contactInfo } from '../data/locations';
import { useLanguage } from '../context/LanguageContext';
import styles from './ReviewsPage.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

export function ReviewsPage() {
  const { t } = useLanguage();
  const [selectedCafe, setSelectedCafe] = useState('');
  const [contact, setContact] = useState('');
  const [review, setReview] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLDivElement>(null);

  // Prevent Lenis from intercepting wheel events on the dropdown list
  useEffect(() => {
    const el = dropdownListRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [isDropdownOpen]);

  const sectionInView = useInView(sectionRef, { once: true, margin: '-40px' });
  const formInView = useInView(formRef, { once: true, margin: '-60px' });

  const allCafes = cities.flatMap(city =>
    city.locations
      .filter(loc => !loc.isComingSoon)
      .map(loc => ({
        label: `${city.name}, ${loc.address}`,
        value: `${city.id}-${loc.address}`,
        city: city.name,
        address: loc.address,
      }))
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isDropdownOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCafe || !review.trim()) return;
    // TODO: nothing is sent anywhere yet. The review text is discarded and the
    // visitor is shown a thank-you screen. Wire this to a real destination
    // (Telegram bot, Google Form, or an email endpoint) before relying on it.
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedCafe('');
    setContact('');
    setReview('');
    setIsSubmitted(false);
  };

  const canSubmit = Boolean(selectedCafe) && review.trim().length > 0;
  const selectedLabel = allCafes.find(c => c.value === selectedCafe);

  return (
    <main className={styles.page} id="main">
      <section className={styles.section} ref={sectionRef}>
        <div className={styles.container}>
          {/* Editorial Header: hidden after submission */}
          <AnimatePresence>
            {!isSubmitted && (
              <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: 24 }}
                animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease }}
              >
                <motion.span
                  className={styles.heroEyebrow}
                  initial={{ opacity: 0, y: 10 }}
                  animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease }}
                >
                  {t('reviews.eyebrow')}
                </motion.span>

                <motion.h1
                  className={styles.heroTitle}
                  initial={{ opacity: 0, y: 24 }}
                  animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: 0.08, ease }}
                >
                  {t('reviews.title1')}
                  <br />
                  <span className={styles.heroTitleItalic}>{t('reviews.title2')}</span>
                </motion.h1>

                <motion.p
                  className={styles.heroSubtitle}
                  initial={{ opacity: 0, y: 14 }}
                  animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.18, ease }}
                >
                  {t('reviews.subtitle')}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form / Success */}
          <div ref={formRef}>
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className={styles.form}
                  initial={{ opacity: 0, y: 30 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, delay: 0.1, ease }}
                >
                  {/* Stacked vertical layout */}
                  <div className={styles.fieldStack}>
                    {/* Cafe selector */}
                    <div
                      className={`${styles.fieldGroup} ${focusedField === 'cafe' ? styles.fieldGroupActive : ''}`}
                      ref={dropdownRef}
                    >
                      <label className={styles.fieldLabel} id="cafe-label">
                        {t('reviews.cafeLabel')}
                      </label>
                      <button
                        type="button"
                        id="cafe-trigger"
                        aria-labelledby="cafe-label cafe-trigger"
                        className={`${styles.selectTrigger} ${selectedCafe ? styles.selectFilled : ''}`}
                        onClick={() => {
                          setIsDropdownOpen(!isDropdownOpen);
                          setFocusedField(isDropdownOpen ? null : 'cafe');
                        }}
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                      >
                        <span className={styles.selectValue}>
                          {selectedLabel
                            ? selectedLabel.label
                            : t('reviews.cafePlaceholder')}
                        </span>
                        <motion.svg
                          className={styles.selectChevron}
                          width="16" height="16" viewBox="0 0 16 16"
                          fill="none" aria-hidden="true"
                          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                          transition={{ duration: 0.25, ease }}
                        >
                          <path d="M4 6L8 10L12 6"
                            stroke="currentColor" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            ref={dropdownListRef}
                            className={styles.dropdown}
                            initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
                            animate={{ opacity: 1, y: 0, scaleY: 1 }}
                            exit={{ opacity: 0, y: -8, scaleY: 0.96 }}
                            transition={{ duration: 0.2, ease }}
                            role="listbox"
                          >
                            {cities.map(city => (
                              <div key={city.id} className={styles.dropdownGroup}>
                                <span className={styles.dropdownCity}>{city.name}</span>
                                {city.locations
                                  .filter(loc => !loc.isComingSoon)
                                  .map(loc => {
                                    const val = `${city.id}-${loc.address}`;
                                    return (
                                      <button
                                        key={val}
                                        type="button"
                                        className={`${styles.dropdownOption} ${selectedCafe === val ? styles.dropdownSelected : ''}`}
                                        onClick={() => {
                                          setSelectedCafe(val);
                                          setIsDropdownOpen(false);
                                          setFocusedField(null);
                                        }}
                                        role="option"
                                        aria-selected={selectedCafe === val}
                                      >
                                        <span className={styles.dropdownAddress}>{loc.address}</span>
                                        {selectedCafe === val && (
                                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.dropdownCheck}>
                                            <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        )}
                                      </button>
                                    );
                                  })}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Contact */}
                    <div className={`${styles.fieldGroup} ${focusedField === 'contact' ? styles.fieldGroupActive : ''}`}>
                      <label className={styles.fieldLabel} htmlFor="contact-field">
                        {t('reviews.contactLabel')}
                      </label>
                      <input
                        id="contact-field"
                        type="text"
                        className={styles.field}
                        placeholder={t('reviews.contactPlaceholder')}
                        value={contact}
                        onChange={e => setContact(e.target.value)}
                        onFocus={() => setFocusedField('contact')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>

                    {/* Review textarea */}
                    <div className={`${styles.fieldGroup} ${styles.fieldGroupLarge} ${focusedField === 'review' ? styles.fieldGroupActive : ''}`}>
                      <div className={styles.textareaHeader}>
                        <label className={styles.fieldLabel} htmlFor="review-field">
                          {t('reviews.reviewLabel')}
                        </label>
                        <span className={styles.charCount}>
                          {review.length > 0 && `${review.length} ${t('reviews.charCount')}`}
                        </span>
                      </div>
                      <textarea
                        id="review-field"
                        className={`${styles.field} ${styles.textarea}`}
                        placeholder={t('reviews.reviewPlaceholder')}
                        required
                        rows={6}
                        value={review}
                        onChange={e => setReview(e.target.value)}
                        onFocus={() => setFocusedField('review')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.formActions}>
                    <div className={styles.submitCol}>
                      <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={!canSubmit}
                        aria-describedby={canSubmit ? undefined : 'submit-hint'}
                      >
                        <span className={styles.submitText}>{t('reviews.submit')}</span>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className={styles.submitArrow}>
                          <path d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5"
                            stroke="currentColor" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {/* A disabled control with no explanation reads as broken. */}
                      {!canSubmit && (
                        <p className={styles.submitHint} id="submit-hint">
                          {t('reviews.hint')}
                        </p>
                      )}
                    </div>

                    <div className={styles.altContact}>
                      <span className={styles.altContactLabel}>{t('reviews.altContact')}</span>
                      <div className={styles.altContactLinks}>
                        <a href={contactInfo.phoneHref} className={styles.contactLink} aria-label={t('reviews.phone')}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{t('reviews.phone')}</span>
                        </a>
                        <span className={styles.altContactDot} />
                        <a href={contactInfo.telegram} className={styles.contactLink}
                           aria-label="Telegram" target="_blank" rel="noopener noreferrer">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M21 5L10 14M21 5L14 21L10 14L3 10L21 5Z"
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>Telegram</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  className={styles.success}
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease }}
                >
                  <motion.h2
                    className={styles.successTitle}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6, ease }}
                  >
                    {t('reviews.successTitle1')}
                    <br />
                    <em>{t('reviews.successTitle2')}</em>
                  </motion.h2>

                  <motion.p
                    className={styles.successText}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    {t('reviews.successText')}
                  </motion.p>

                  <motion.button
                    type="button"
                    className={styles.successBtn}
                    onClick={handleReset}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5, ease }}
                  >
                    {t('reviews.another')}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
