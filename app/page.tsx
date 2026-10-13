import { lazy, Suspense } from 'react';
import { ArrowUpRight } from 'lucide-react';
import ScrollStoryCopy from '@/components/scroll-story-copy';
import CoverageStory from '@/components/coverage-story';
import LanguageSwitcher from '@/components/language-switcher';
import ContactStory from '@/components/contact-story';
import BrandStory from '@/components/brand-story';
import { staticPath } from '@/lib/static-path';

const WorldDataScene = lazy(() => import('@/components/world-data-scene'));
const MissionDatasets = lazy(() => import('@/components/mission-datasets'));

function Logo(){return <span className="logo-lockup"><img className="logo" src={staticPath('/brand/syrm-logo.png')} alt="SYRM"/><small>Collective Intelligence in Real Motion</small></span>}

export default function Home(){return <main>
  <nav className="nav shell"><a href="#top"><Logo/></a><div className="nav-links"><a href="#story">Story</a><a href="#coverage">Coverage</a><a href="#request">Contact</a></div><LanguageSwitcher/><a className="nav-cta" href="#request">Start a collection <ArrowUpRight size={15}/></a></nav>

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
