import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { GallerySection } from '../components/home/GallerySection';
import { MenuPreview } from '../components/home/MenuPreview';
import { LocationSection } from '../components/home/LocationSection';

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <MenuPreview />
      <LocationSection />
    </main>
  );
}
