import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Image } from '../common/Image';
import { Price } from '../common/Price';
import { MENU_CARD_SIZES } from '../common/imageSizes';
import { useLanguage } from '../../context/LanguageContext';
import { pick, type MenuItem } from '../../types';
import styles from './MenuCard.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The one menu grid.
 *
 * The home preview and the menu page both render through this, so the column
 * counts and gaps exist in a single place. That matters beyond tidiness:
 * MENU_CARD_SIZES is computed from these exact numbers, and a second grid
 * definition would quietly invalidate it for one of the two callers.
 */
export function MenuGrid({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}

interface MenuCardProps {
  item: MenuItem;
  index: number;
  isVisible: boolean;
  /** Wraps the card in a link. Used by the home preview, not the menu page. */
  href?: string;
}

export function MenuCard({ item, index, isVisible, href }: MenuCardProps) {
  const { lang, t } = useLanguage();
  const name = pick(item.name, lang);

  const body = (
    <>
      <div className={styles.frame}>
        <Image
          name={item.image}
          alt={name}
          className={styles.image}
          sizes={MENU_CARD_SIZES}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.text}>
          <h3 className={styles.name}>{name}</h3>
          {item.description && (
            <p className={styles.description}>{pick(item.description, lang)}</p>
          )}
        </div>

        <div className={styles.meta}>
          <Price value={item.price} />
          {item.calories != null && (
            <span className={styles.calories}>
              <bdi>
                {item.calories} {t('common.calories')}
              </bdi>
            </span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 36 }}
      animate={isVisible ? { opacity: 1, y: 0 } : undefined}
      // Capped so the tail of a long category does not wait on a long stagger.
      transition={{ duration: 0.6, delay: 0.08 + Math.min(index * 0.05, 0.4), ease: EASE }}
    >
      {href ? (
        <a className={styles.link} href={href}>
          {body}
        </a>
      ) : (
        body
      )}
    </motion.article>
  );
}
