import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { useReveal } from '../hooks/useReveal';
import { useLanguage } from '../context/LanguageContext';
import { contactInfo } from '../data/contact';
import { openBranches } from '../data/branches';
import { pick } from '../types';
import styles from './ContactPage.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

const SOCIALS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'snapchat', label: 'Snapchat' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'x', label: 'X' },
] as const;

export function ContactPage() {
  const { lang, t, sign } = useLanguage();
  // One reveal for the pair: the stagger below is what separates them.
  const { ref: bodyRef, revealed: bodyIn } = useReveal<HTMLDivElement>({ margin: -60 });
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  /**
   * The form hands off to WhatsApp rather than posting anywhere.
   *
   * There is no backend behind this site, and a form that silently discards
   * what someone typed and thanks them for it is worse than no form. This
   * composes the same message into their real WhatsApp line, which they
   * already publish and already answer.
   */
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const body = name ? `${name}: ${message}` : message;
    window.open(
      `${contactInfo.whatsapp}?text=${encodeURIComponent(body)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const canSend = message.trim().length > 0;

  return (
    <main className={styles.page} id="main">
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, x: -14 * sign }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            {t('contact.label')}
          </motion.span>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {t('contact.title1')}{' '}
            <span className={styles.titleAccent}>{t('contact.title2')}</span>
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.container}>
          <div className={styles.layout} ref={bodyRef}>
            {/* Channels */}
            <motion.div
              className={styles.channels}
              initial={{ opacity: 0, y: 24 }}
              animate={bodyIn ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <a href={contactInfo.phoneHref} className={styles.channel}>
                <span className={styles.channelLabel}>{t('contact.callUs')}</span>
                <span className={styles.channelValue}>
                  <bdi>{contactInfo.phone}</bdi>
                </span>
              </a>

              <a
                href={contactInfo.whatsapp}
                className={styles.channel}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.channelLabel}>{t('contact.whatsapp')}</span>
                <span className={styles.channelValue}>
                  <bdi>{contactInfo.phone}</bdi>
                </span>
              </a>

              <a href={`mailto:${contactInfo.email}`} className={styles.channel}>
                <span className={styles.channelLabel}>{t('contact.email')}</span>
                <span className={styles.channelValue}>
                  <bdi>{contactInfo.email}</bdi>
                </span>
              </a>

              <div className={styles.channel}>
                <span className={styles.channelLabel}>{t('contact.visit')}</span>
                <span className={styles.channelValue}>
                  {openBranches.map((b) => pick(b.name, lang)).join(` ${t('common.and')} `)}
                </span>
              </div>

              <div className={styles.socials}>
                <span className={styles.channelLabel}>{t('contact.follow')}</span>
                <div className={styles.socialRow}>
                  {SOCIALS.map(({ key, label }) => (
                    <a
                      key={key}
                      href={contactInfo[key]}
                      className={styles.social}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              className={styles.form}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 24 }}
              animate={bodyIn ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              <label className={styles.field}>
                <span className={styles.fieldLabel}>{t('contact.formName')}</span>
                <input
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>{t('contact.formMessage')}</span>
                <textarea
                  className={styles.textarea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  required
                />
              </label>

              <button type="submit" className={styles.submit} disabled={!canSend}>
                {t('contact.formSend')}
              </button>

              <p className={styles.formNote}>{t('contact.formNote')}</p>
            </motion.form>
          </div>
        </div>
      </section>
    </main>
  );
}
