import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { MenuPreview } from '../components/home/MenuPreview';
import { LocationSection } from '../components/home/LocationSection';

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <MenuPreview />
      <LocationSection />
    </main>
  );
}
