import { useCallback, useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cafe } from '../data/cafe';
import { useLanguage } from '../context/LanguageContext';
import { useLenisInstance } from '../hooks/useLenis';
import { MarkScale } from '../components/reviews/MarkScale';
import { Postmark } from '../components/reviews/Postmark';
import styles from './ReviewsPage.module.css';

const ease = [0.16, 1, 0.3, 1] as const;

/** Clears the header and leaves a line of air above whatever is scrolled to. */
const SCROLL_OFFSET = -120;

/**
 * One part of the letter. On a fresh page each part is written in from the
 * left, one after another; a part that is left blank when the letter is
 * sent folds away.
 */
function Part({ order, className, children }: { order: number; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: 'inset(0% 100% 0% 0%)' }}
      // The clip comes off once the line is written, or it would crop the
      // ring and the postmark that later reach past the line's box.
      animate={{ clipPath: 'inset(0% 0% 0% 0%)', transitionEnd: { clipPath: 'none' } }}
      exit={{ opacity: 0, height: 0, marginTop: 0, transition: { duration: 0.3, ease } }}
      transition={{ duration: 0.8, delay: 0.25 + order * 0.12, ease }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A blank in a sentence, as wide as what is written on it. The input sits
 * in a grid cell beside an invisible copy of its own text, which sets the
 * width, so the rule under it grows with the word.
 */
function Blank({ value, placeholder, ...props }: InputHTMLAttributes<HTMLInputElement> & { value: string }) {
  return (
    <span className={styles.blank} data-value={value || placeholder} data-empty={!value || undefined}>
      <input type="text" size={1} value={value} placeholder={placeholder} {...props} />
    </span>
  );
}

type Missing = 'both' | 'mark' | 'text' | null;

const HINT = {
  both: 'reviews.hint',
  mark: 'reviews.needMark',
  text: 'reviews.needText',
} as const;

/**
 * The guest book. A review is written as a short letter to the café and
 * sent as a WhatsApp message to its own number: no backend, nothing stored
 * on the way, and it lands where the team already reads orders.
 */
export function ReviewsPage() {
  const { t } = useLanguage();
  const lenis = useLenisInstance();
  const [mark, setMark] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [review, setReview] = useState('');
  const [tried, setTried] = useState(false);
  const [nudge, setNudge] = useState(0);
  const [sent, setSent] = useState<{ url: string; on: Date } | null>(null);
  // Each new letter is a fresh sheet: bumping it remounts the letter, which
  // writes its parts in again.
  const [sheet, setSheet] = useState(0);

  const letterRef = useRef<HTMLFormElement>(null);
  const firstMarkRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const thanksRef = useRef<HTMLHeadingElement>(null);

  const written = review.trim().length > 0;
  const missing: Missing = mark === null ? (written ? 'mark' : 'both') : written ? null : 'text';
  const sealed = sent !== null;
  const hint = tried && missing ? t(HINT[missing]) : '';
  // The prompt answers the mark: a four asks what kept it from a five.
  const prompt = mark === null ? t('reviews.reviewPlaceholder') : t(`reviews.prompt${mark}`);

  // Brings a part of the letter into view if it is not already, then runs
  // onComplete. Lenis caches the page height, and a fresh sheet has just
  // changed it, so it measures again first.
  const scrollTo = useCallback(
    (target: HTMLElement, onComplete?: () => void) => {
      const { top, bottom } = target.getBoundingClientRect();
      if (top > -SCROLL_OFFSET && bottom < window.innerHeight) {
        onComplete?.();
        return;
      }
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(target, { offset: SCROLL_OFFSET, onComplete: () => onComplete?.() });
      } else {
        window.scrollTo({ top: window.scrollY + top + SCROLL_OFFSET });
        onComplete?.();
      }
    },
    [lenis],
  );

  const compose = () => {
    const head = [
      t('reviews.messageHeader'),
      `${t('reviews.messageRating')}: ${mark} ${t('reviews.ratingOf')}`,
    ];
    if (name.trim()) head.push(`${t('reviews.messageName')}: ${name.trim()}`);
    if (contact.trim()) head.push(`${t('reviews.messageContact')}: ${contact.trim()}`);
    return `${head.join('\n')}\n\n${review.trim()}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (sealed) return;
    if (missing) {
      setTried(true);
      if (mark === null) {
        firstMarkRef.current?.focus({ preventScroll: true });
        const scale = firstMarkRef.current?.closest('fieldset');
        if (scale) scrollTo(scale, () => setNudge((n) => n + 1));
      } else {
        // Inside the click, so a phone raises its keyboard for it.
        bodyRef.current?.focus();
      }
      return;
    }
    const url = `${cafe.whatsapp}?text=${encodeURIComponent(compose())}`;
    // Opened inside the submit gesture, so pop-up blockers let it through.
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent({ url, on: new Date() });
  };

  const handleReset = () => {
    setMark(null);
    setName('');
    setContact('');
    setReview('');
    setTried(false);
    setSent(null);
    setSheet((n) => n + 1);
  };

  // The send button leaves with the letter's other controls, so focus goes
  // to the thanks that replaces it, without moving the page.
  useEffect(() => {
    if (sent) thanksRef.current?.focus({ preventScroll: true });
  }, [sent]);

  // A fresh sheet is shorter than the letter it replaces; bring its top
  // into view and start the keyboard at the marks.
  useEffect(() => {
    if (sheet === 0 || !letterRef.current) return;
    firstMarkRef.current?.focus({ preventScroll: true });
    scrollTo(letterRef.current);
  }, [sheet, scrollTo]);

  const blank = (label: string) => `${t(label)}, ${t('reviews.optional')}`;

  return (
    <main className={styles.page} id="main">
      <section className={styles.section}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <h1 className={styles.title}>
            {t('reviews.title1')}{' '}
            <span className={styles.titleItalic}>{t('reviews.title2')}</span>
          </h1>
          <p className={styles.subtitle}>{t('reviews.subtitle')}</p>
        </motion.header>

        <form
          key={sheet}
          ref={letterRef}
          className={styles.letter}
          onSubmit={handleSubmit}
          noValidate
          data-sealed={sealed || undefined}
          aria-label={t('reviews.formLabel')}
        >
          <Part order={0}>
            <p className={styles.salutation}>{t('reviews.salutation')}</p>
          </Part>

          <Part order={1} className={styles.marks}>
            <MarkScale
              value={mark}
              onChange={setMark}
              sealed={sealed}
              nudge={nudge}
              firstRef={firstMarkRef}
            />
          </Part>

          <Part order={2} className={styles.body}>
            {/* The copy after the textarea sizes it, so it grows a line at a
                time as the guest writes and never scrolls inside itself. While
                the letter is open it keeps one spare line to write into. */}
            <div
              className={styles.writing}
              data-value={sealed ? review : `${review || prompt}\n`}
              data-empty={!review || undefined}
            >
              <textarea
                ref={bodyRef}
                rows={1}
                aria-label={t('reviews.reviewLabel')}
                placeholder={prompt}
                required
                value={review}
                onChange={(e) => setReview(e.target.value)}
                readOnly={sealed}
                tabIndex={sealed ? -1 : undefined}
              />
            </div>
          </Part>

          <div className={styles.closing}>
            <AnimatePresence>
              {(!sealed || name.trim()) && (
                <Part key="sign" order={3}>
                  <p>
                    {t('reviews.signOff')}{' '}
                    <Blank
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('reviews.namePlaceholder')}
                      aria-label={blank('reviews.nameLabel')}
                      autoComplete="given-name"
                      readOnly={sealed}
                      tabIndex={sealed ? -1 : undefined}
                    />
                  </p>
                </Part>
              )}
              {(!sealed || contact.trim()) && (
                <Part key="ps" order={4} className={styles.postscript}>
                  <p>
                    {t('reviews.postscript')}{' '}
                    <Blank
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={t('reviews.contactPlaceholder')}
                      aria-label={blank('reviews.contactLabel')}
                      autoComplete="tel"
                      readOnly={sealed}
                      tabIndex={sealed ? -1 : undefined}
                    />
                  </p>
                </Part>
              )}
            </AnimatePresence>
            {sent && <Postmark date={sent.on} />}
          </div>

          <AnimatePresence>
            {!sealed && (
              <motion.div
                key="send"
                className={styles.send}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0, paddingTop: 0, transition: { duration: 0.3, ease } }}
                transition={{ duration: 0.6, delay: 0.85, ease }}
              >
                <button
                  type="submit"
                  className={styles.submit}
                  data-ready={missing === null || undefined}
                  aria-describedby={hint ? 'send-hint' : undefined}
                >
                  {t('reviews.submit')}
                </button>
                <p className={styles.hint} id="send-hint" aria-live="polite">
                  {hint}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <AnimatePresence>
          {sent && (
            <motion.div
              key="after"
              className={styles.after}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.6, delay: 0.55, ease }}
            >
              <h2 className={styles.thanks} ref={thanksRef} tabIndex={-1}>
                {t('reviews.successTitle')}
              </h2>
              <p className={styles.afterText}>{t('reviews.successText')}</p>
              <p className={styles.afterNote}>
                {t('reviews.successRetryLead')}{' '}
                <a href={sent.url} className={styles.link} target="_blank" rel="noopener noreferrer">
                  {t('reviews.successRetry')}
                </a>
              </p>
              <p className={styles.afterNote}>
                {t('reviews.successPublic')}{' '}
                <a
                  href={cafe.yandexReviews}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('reviews.successPublicCta')}, ${t('common.newTab')}`}
                >
                  {t('reviews.successPublicCta')}
                </a>
              </p>
              <button type="button" className={styles.another} onClick={handleReset}>
                {t('reviews.another')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
