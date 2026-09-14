import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

export const LenisContext = createContext<Lenis | null>(null);

export function useLenisInstance() {
  return useContext(LenisContext);
}

export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    // The browser restores the previous scroll offset on reload, but in a
    // hash-routed SPA that offset belongs to whatever page was open last, so
    // reopening /#/menu at 16000px drops you straight into the footer.
    const previousRestoration = history.scrollRestoration;
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return () => {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = previousRestoration;
        }
      };
    }

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

    let frame = 0;
    function raf(time: number) {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    }

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
      if ('scrollRestoration' in history) {
        history.scrollRestoration = previousRestoration;
      }
    };
  }, []);

  // Every route change starts at the top, including back/forward and a
  // cold load on a deep link, which the PUSH-only check used to miss.
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return lenis;
}
