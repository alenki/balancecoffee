import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

interface LogoProps {
  variant?: 'default' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'default', size = 'md' }: LogoProps) {
  return (
    <Link to="/" className={`${styles.logo} ${styles[variant]} ${styles[size]}`}>
      <img
        src="/logos/balance_5.png"
        alt="Balance Coffee"
        className={styles.logoImage}
      />
    </Link>
  );
}
