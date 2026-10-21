import { lazy, Suspense } from 'react';
import ScrollStoryCopy from '@/components/scroll-story-copy';
import CoverageStory from '@/components/coverage-story';
import ContactStory from '@/components/contact-story';
import BrandStory from '@/components/brand-story';
import AboutUs from '@/components/about-us';
import SiteHeader, { Logo } from '@/components/site-header';
import { staticPath } from '@/lib/static-path';

const WorldDataScene = lazy(() => import('@/components/world-data-scene'));
const MissionDatasets = lazy(() => import('@/components/mission-datasets'));

export default function Home(){return <main>
  <SiteHeader/>

  <div className="journey" id="story">
    <div className="story-visual">
      <Suspense fallback={<div className="world-data-scene-loading" aria-label="Loading data visualization" />}>
        <WorldDataScene/>
      </Suspense>
    </div>
    <div className="journey-content">
      <div className="story-scroll"><ScrollStoryCopy/></div>
      <section className="coverage-flow" id="coverage"><CoverageStory/></section>
    </div>
  </div>

  <AboutUs/>

  <Suspense fallback={<section className="mission-datasets mission-datasets-loading" aria-label="Loading featured datasets" />}>
    <MissionDatasets/>
  </Suspense>
  <BrandStory/>
  <ContactStory/>
  <footer className="footer shell">
    <Logo/>
    <p>Real-world data collection at scale.</p>
    <a className="footer-contact" href="mailto:business@syrm.ai">
      <span>Email</span>
      business@syrm.ai
    </a>
    <div>© 2026 SYRM</div>
  </footer>
</main>}
