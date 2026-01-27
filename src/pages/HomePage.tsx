import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { PhotoStrip } from '../components/home/PhotoStrip';
import { MenuPreview } from '../components/home/MenuPreview';
import { LocationSection } from '../components/home/LocationSection';

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <PhotoStrip />
      <MenuPreview />
      <LocationSection />
    </main>
  );
}
