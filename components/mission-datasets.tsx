'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  ArrowUpRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { staticPath } from '@/lib/static-path';

export interface CategoryVideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  tag?: string;
  hasRealVideo?: boolean;
}

export interface DatasetCategory {
  id: string;
  name: string;
  description: string;
  hasVideo: boolean;
  videos: CategoryVideoItem[];
}

export const CATEGORIES_DATA: DatasetCategory[] = [
  {
    id: 'food-home',
    name: 'Food & Home',
    description: 'Human demonstrations in culinary prep, commercial kitchens, food processing, and cleaning.',
    hasVideo: true,
    videos: [
      {
        id: 'fh-1',
        title: 'Washing Carpet',
        description: 'First-person perspective manual carpet cleaning, deep rotary shampooing, and water extraction on floor rugs.',
        videoUrl: '/brand/video/food-&-home/Cleaning & Sanitation - Mencuci Karpet.mp4',
        tag: 'Cleaning & Sanitation',
        hasRealVideo: true,
      },
      {
        id: 'fh-2',
        title: 'Chopping Chinese Cabbage',
        description: 'Knife grip kinematics, precise slicing rhythm, and systematic chopping of Chinese cabbage leaves.',
        videoUrl: '/brand/video/food-&-home/Food Processing - Memotong Sawi Putih.mp4',
        tag: 'Food Processing',
        hasRealVideo: true,
      },
      {
        id: 'fh-3',
        title: 'Making Iced Tea',
        description: 'Beverage ingredient pouring, sugar syrup dissolution stirring, ice scoop transfer, and liquid leveling.',
        videoUrl: '/brand/video/food-&-home/Food & Beverage - Membuat Es Teh.mp4',
        tag: 'Food & Beverage',
        hasRealVideo: true,
      },
      {
        id: 'fh-4',
        title: 'Making Banana Bolen Pastry',
        description: 'Artisan pastry rolling, banana and cheese filling wrapping, edge tucking, and tray arrangement for baking.',
        videoUrl: '/brand/video/food-&-home/Food Processing - Membuat Bolen Pisang.mp4',
        tag: 'Food Processing',
        hasRealVideo: true,
      },
    ],
  },
  {
    id: 'industry-workshop',
    name: 'Industry & Workshop',
    description: 'Specialized industrial craftsmanship, fabrication line tasks, and precision manual manufacturing.',
    hasVideo: true,
    videos: [
      {
        id: 'iw-1',
        title: 'Screen Printing Caps',
        description: 'Curved surface screen printing on headwear with manual screen alignment and squeegee pressure control.',
        videoUrl: '/brand/video/industry-&-workshop/Manufacturing - Sablon Topi.mp4',
        tag: 'Manufacturing',
        hasRealVideo: true,
      },
      {
        id: 'iw-2',
        title: 'Screen Printing Tote Bags',
        description: 'Fabric tote bag manual screen printing with registration alignment and continuous ink stroke.',
        videoUrl: '/brand/video/industry-&-workshop/Manufacturing - Sablon Tas.mp4',
        tag: 'Manufacturing',
        hasRealVideo: true,
      },
      {
        id: 'iw-3',
        title: 'Curling Eyelashes',
        description: 'Micro-dexterity eyelash rolling and delicate curling around heated cylindrical mandrels.',
        videoUrl: '/brand/video/industry-&-workshop/Manufacturing - Menggulung Bulumata.mp4',
        tag: 'Manufacturing',
        hasRealVideo: true,
      },
    ],
  },
  {
    id: 'dexterous-manipulation',
    name: 'Dexterous Manipulation',
    description: 'High-frequency finger articulation, deformable object folding, and sub-millimeter hand pose tasks.',
    hasVideo: true,
    videos: [
      {
        id: 'dm-1',
        title: 'Wrapping Kerupuk Crackers',
        description: 'Bimanual sorting and rapid food snack packaging into thin polymer wrappers with hand-twist sealing.',
        videoUrl: '/brand/video/dexterous-manipulation/Sorting & Packing - Membungkus Kerupuk.mp4',
        tag: 'Sorting & Packing',
        hasRealVideo: true,
      },
      {
        id: 'dm-2',
        title: 'Folding Umbrella',
        description: 'Multi-step manual rib folding, fabric tensioning, spine alignment, and strap securing for umbrellas.',
        videoUrl: '/brand/video/dexterous-manipulation/Folding & Textile Woork - Melipat Payung.mp4',
        tag: 'Folding & Textile Work',
        hasRealVideo: true,
      },
    ],
  },
];

export default function MissionDatasets() {
  const [activeCategoryId, setActiveCategoryId] = useState('food-home');
  const [modalVideo, setModalVideo] = useState<CategoryVideoItem | null>(null);
  const [slideOffset, setSlideOffset] = useState(0);
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  const activeCategory =
    CATEGORIES_DATA.find((c) => c.id === activeCategoryId) || CATEGORIES_DATA[0];

  // Reset slide offset when category changes
  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id);
    setSlideOffset(0);
    if (carouselTrackRef.current) {
      carouselTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  // Close modal on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalVideo(null);
      }
    };
    if (modalVideo) {
      window.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [modalVideo]);

  const scrollLeft = () => {
    if (!carouselTrackRef.current) return;
    const card = carouselTrackRef.current.querySelector<HTMLElement>('.category-video-card');
    const scrollAmount = card ? card.offsetWidth + 24 : carouselTrackRef.current.clientWidth / 3;
    carouselTrackRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!carouselTrackRef.current) return;
    const card = carouselTrackRef.current.querySelector<HTMLElement>('.category-video-card');
    const scrollAmount = card ? card.offsetWidth + 24 : carouselTrackRef.current.clientWidth / 3;
    carouselTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="mission-datasets" id="datasets" aria-labelledby="featured-datasets-title">
      <div className="dataset-showcase shell" id="featured-datasets">
        {/* Section Heading */}
        <div className="dataset-heading">
          <span className="section-index">FEATURED DATASETS</span>
          <h2 id="featured-datasets-title">Featured data captures.</h2>
          <p>
            A compact sample of the task categories and specifications SYRM can collect,
            organize, and review for training pipelines.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs-container" role="tablist" aria-label="Dataset categories">
          <div className="category-tabs-track">
            {CATEGORIES_DATA.map((category) => {
              const isActive = category.id === activeCategoryId;
              return (
                <button
                  type="button"
                  key={category.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`category-tab-btn ${isActive ? 'active' : ''} ${
                    category.hasVideo ? 'has-videos' : 'pipeline-category'
                  }`}
                  onClick={() => handleSelectCategory(category.id)}
                >
                  <span>{category.name}</span>
                  {category.hasVideo && (
                    <span className="category-count-badge">{category.videos.length}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Status & Description */}
        <div className="category-header-meta">
          <p className="category-description-text">{activeCategory.description}</p>
        </div>

        {/* Carousel Container (Displays 3 Videos) */}
        <div className="category-carousel-wrapper">
          <div className="category-carousel" ref={carouselTrackRef}>
            {activeCategory.videos.map((item) => (
              <article
                key={item.id}
                className="category-video-card"
                onClick={() => setModalVideo(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setModalVideo(item);
                  }
                }}
                aria-label={`View ${item.title}`}
              >
                <div className="video-card-thumb">
                  <video
                    src={staticPath(encodeURI(item.videoUrl))}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                  />
                  <div className="video-card-overlay">
                    <span className="video-expand-hint">
                      <Maximize2 size={15} />
                      <span>Click to enlarge</span>
                    </span>
                  </div>
                  {item.tag && <span className="video-card-tag">{item.tag}</span>}
                </div>

                <div className="video-card-body">
                  <h3 className="video-card-title">{item.title}</h3>
                  <p className="video-card-desc">{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Carousel Arrow Controls - only shown when there are more than 3 videos */}
          {activeCategory.videos.length > 3 && (
            <>
              <button
                type="button"
                className="carousel-nav-btn prev"
                onClick={scrollLeft}
                aria-label="Scroll left"
                title="Previous videos"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="carousel-nav-btn next"
                onClick={scrollRight}
                aria-label="Scroll right"
                title="Next videos"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Category Request Action */}
        <div className="category-footer-action">
          <a
            href="#request"
            className="about-us-cta"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('request')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Request Datasets ↗
          </a>
        </div>
      </div>

      {/* Enlarged Video Modal */}
      {modalVideo && (
        <div
          className="video-modal-backdrop"
          onClick={() => setModalVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-video-title"
        >
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-topbar">
              <span className="video-modal-category">{activeCategory.name}</span>
              <button
                type="button"
                className="video-modal-close-btn"
                onClick={() => setModalVideo(null)}
                aria-label="Close enlarged video"
              >
                <X size={20} />
              </button>
            </div>

            <div className="video-modal-player-wrap">
              <video
                src={staticPath(encodeURI(modalVideo.videoUrl))}
                autoPlay
                controls
                playsInline
                className="video-modal-element"
              />
            </div>

            <div className="video-modal-details">
              <div className="video-modal-text">
                <h3 id="modal-video-title" className="video-modal-heading">
                  {modalVideo.title}
                </h3>
                <p className="video-modal-desc">{modalVideo.description}</p>
              </div>
              <a
                href="#request"
                className="video-modal-cta"
                onClick={() => {
                  setModalVideo(null);
                  setTimeout(() => {
                    document.getElementById('request')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
              >
                <span>Request this dataset ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
