'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import LanguageSwitcher from '@/components/language-switcher';
import { staticPath } from '@/lib/static-path';

export function Logo() {
  return (
    <span className="logo-lockup">
      <img className="logo" src={staticPath('/brand/syrm-logo.svg')} alt="SYRM" />
      <small>Collective Intelligence in Real Motion</small>
    </span>
  );
}

export default function SiteHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollYRef.current;

          // Check if page is scrolled past the top banner
          setIsScrolled(currentScrollY > 20);

          // Always visible near top of page (first 60px)
          if (currentScrollY <= 60) {
            setIsVisible(true);
          } else if (diff > 8) {
            // Scrolling down -> hide header upwards
            setIsVisible(false);
          } else if (diff < -8) {
            // Scrolling up -> show header from top
            setIsVisible(true);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`site-header ${isScrolled ? 'is-scrolled' : ''} ${isVisible ? 'is-visible' : 'is-hidden'}`}
      role="banner"
    >
      <nav className="nav shell" aria-label="Main Navigation">
        <a href="#top" aria-label="SYRM Home">
          <Logo />
        </a>
        <div className="nav-links">
          <a href="#story">Story</a>
          <a href="#coverage">Coverage</a>
          <a href="#about">About</a>
          <a href="#datasets">Datasets</a>
          <a href="#request">Contact</a>
        </div>
        <LanguageSwitcher />
        <a className="nav-cta" href="#request">
          Start a collection <ArrowUpRight size={15} />
        </a>
      </nav>
    </header>
  );
}
