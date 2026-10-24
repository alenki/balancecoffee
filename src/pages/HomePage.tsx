import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { ForewordSection } from '../components/home/ForewordSection';
import { MenuPreview } from '../components/home/MenuPreview';
import { NightSection } from '../components/home/NightSection';
import { VisitSection } from '../components/home/VisitSection';
import { CatchphraseGame } from '../components/home/CatchphraseGame';
import { useLenisInstance } from '../hooks/useLenis';

export function HomePage() {
  const { search, key } = useLocation();
  const lenis = useLenisInstance();

  // `/?game` (the header's link) opens at the game. Keyed on the location, so
  // following the link again while already here scrolls back down to it. It
  // waits two frames so it lands after the route change's scroll to the top.
  const toGame = new URLSearchParams(search).has('game');
  useEffect(() => {
    if (!toGame) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const element = document.getElementById('game');
        if (!element) return;
        if (lenis) {
          // The pinned hero changes the page's height once it has measured,
          // and Lenis clamps targets to its cached limit.
          lenis.resize();
          lenis.scrollTo(element, { duration: 1.4, force: true });
        } else {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [toGame, key, lenis]);

  return (
    <main id="main" data-ends-on-cloth>
      <HeroSection />
      <ForewordSection />
      <MenuPreview />
      <NightSection />
      <VisitSection />
      <CatchphraseGame />
    </main>
  );
}
