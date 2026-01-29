import { Link } from 'react-router-dom';
import { useLenisInstance } from '../../hooks/useLenis';
import styles from './Logo.module.css';

interface LogoProps {
  variant?: 'default' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'default', size = 'md' }: LogoProps) {
  const lenis = useLenisInstance();

  const handleClick = () => {
    lenis?.scrollTo(0, { duration: 1.2 });
  };

  return (
    <Link
      to="/"
      onClick={handleClick}
      className={`${styles.logo} ${styles[variant]} ${styles[size]}`}
    >
      <img
        src="/logos/balance_5.png"
        alt="Balance Coffee"
        className={styles.logoImage}
      />
    </Link>
  );
}
