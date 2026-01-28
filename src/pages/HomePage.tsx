import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { GallerySection } from '../components/home/GallerySection';
import { MenuPreview } from '../components/home/MenuPreview';
import { CafesSection } from '../components/home/CafesSection';

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <MenuPreview />
      <GallerySection />
      <CafesSection />
    </main>
  );
}
