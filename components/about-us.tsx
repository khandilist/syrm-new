'use client';

import { useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize2 } from 'lucide-react';
import { staticPath } from '@/lib/static-path';

export default function AboutUs() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  return (
    <section className="about-us-section" id="about" aria-labelledby="about-us-title">
      <div className="shell">
        <div className="about-us-grid">
          <div className="about-us-content">
            <span className="section-index about-us-eyebrow">ABOUT US</span>
            <h2 id="about-us-title" className="about-us-title">
              The collection operation<br />behind the data
            </h2>
            <p className="about-us-body">
              Physical-AI teams need demonstrations that reflect how people actually work:
              varied tools, layouts, objects, and routines. SYRM runs the operational layer
              behind that data. We source and brief demonstrators, organize real-world
              sessions, manage capture, and review delivery sets against the collection
              specification.
            </p>
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

          <div className="about-us-media">
            <div className="about-video-wrapper">
              <video
                ref={videoRef}
                src={staticPath('/brand/video/syrm-preview.mp4')}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Real-world collection demonstration preview"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />


              <div className="about-video-controls" role="group" aria-label="Video controls">
                <button
                  type="button"
                  className="about-video-btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  type="button"
                  className="about-video-btn"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <button
                  type="button"
                  className="about-video-btn"
                  onClick={toggleFullscreen}
                  aria-label="Toggle fullscreen"
                  title="Fullscreen"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
