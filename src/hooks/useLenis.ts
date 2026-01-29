import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import Lenis from 'lenis';

export const LenisContext = createContext<Lenis | null>(null);

export function useLenisInstance() {
  return useContext(LenisContext);
}

export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = instance;
    setLenis(instance);

    function raf(time: number) {
      instance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (navigationType === 'PUSH') {
      lenisRef.current?.scrollTo(0, { immediate: true });
    }
  }, [pathname, navigationType]);

  return lenis;
}
