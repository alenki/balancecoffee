import { useLanguage } from '../../context/LanguageContext';
import { useOpenStatus } from '../../hooks/useOpenStatus';
import { formatHour } from '../../data/cafe';
import styles from './OpenStatus.module.css';

interface OpenStatusProps {
  className?: string;
  /** `ink` on paper, `paper` on the cloth. */
  tone?: 'ink' | 'paper';
}

/** "Открыто до 22:00", live, on the café's own clock. */
export function OpenStatus({ className, tone = 'ink' }: OpenStatusProps) {
  const { t } = useLanguage();
  const status = useOpenStatus();

  const label = status.open
    ? `${t('status.openUntil')} ${formatHour(status.closesAt)}`
    : `${t(status.opensTomorrow ? 'status.opensTomorrow' : 'status.opensAt')} ${formatHour(status.opensAt)}`;

  return (
    <span
      className={[styles.status, styles[tone], status.open ? styles.open : styles.closed, className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span>
        {label}
        {status.ramadan && <span className={styles.note}> · {t('status.ramadan')}</span>}
      </span>
    </span>
  );
}
