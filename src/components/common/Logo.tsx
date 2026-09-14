import { Link } from 'react-router-dom';
import { useLenisInstance } from '../../hooks/useLenis';
import { Image } from './Image';
import { LOGO_SIZES } from './imageSizes';
import styles from './Logo.module.css';

interface LogoProps {
  variant?: 'default' | 'light';
  size?: 'sm' | 'md' | 'lg';
  /** Set on the header logo, which is above the fold. */
  priority?: boolean;
}

export function Logo({ variant = 'default', size = 'md', priority = false }: LogoProps) {
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
      <Image
        name="logos/balance_5"
        alt="Balance Coffee"
        fit="bare"
        className={styles.logoImage}
        sizes={LOGO_SIZES}
        priority={priority}
      />
    </Link>
  );
}
