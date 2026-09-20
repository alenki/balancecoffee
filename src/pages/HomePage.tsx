import { HeroSection } from '../components/home/HeroSection';
import { StorySection } from '../components/home/StorySection';
import { MenuPreview } from '../components/home/MenuPreview';
import { RoasterySection } from '../components/home/RoasterySection';
import { BranchesSection } from '../components/home/BranchesSection';

export function HomePage() {
  return (
    <main id="main">
      <HeroSection />
      <StorySection />
      <MenuPreview />
      <RoasterySection />
      <BranchesSection />
    </main>
  );
}
