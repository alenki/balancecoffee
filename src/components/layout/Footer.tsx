import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useCity } from '../../hooks/useCity';
import { contactInfo } from '../../data/locations';
import styles from './Footer.module.css';

export function Footer() {
  const { currentCity } = useCity();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo size="lg" variant="light" />
            <p className={styles.tagline}>
              Уютные кофейни с душой
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Навигация</h4>
              <Link to="/" className={styles.link}>Главная</Link>
              <Link to="/menu" className={styles.link}>Меню</Link>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Контакты</h4>
              <a href={contactInfo.phoneHref} className={styles.link}>
                {contactInfo.phone}
              </a>
              <a href={contactInfo.telegram} className={styles.link} target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>{currentCity.name}</h4>
              {currentCity.locations.slice(0, 3).map((location, index) => (
                <span key={index} className={styles.address}>
                  {location.address}
                  {location.isComingSoon && <span className={styles.soon}> скоро</span>}
                </span>
              ))}
              {currentCity.locations.length > 3 && (
                <span className={styles.more}>
                  и ещё {currentCity.locations.length - 3}...
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            {currentYear} Balance Coffee. Все права защищены.
          </p>
          <div className={styles.hours}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4.5V8L10.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Доставка {contactInfo.deliveryHours.start} — {contactInfo.deliveryHours.end}</span>
          </div>
        </div>
      </div>

      {/* Decorative coffee bean pattern */}
      <div className={styles.decoration} aria-hidden="true">
        <svg viewBox="0 0 100 100" className={styles.bean}>
          <ellipse cx="50" cy="50" rx="30" ry="45" fill="currentColor" opacity="0.05"/>
          <path d="M50 10 Q55 50 50 90" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.08"/>
        </svg>
      </div>
    </footer>
  );
}
