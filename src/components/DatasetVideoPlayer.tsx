import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, 
  Eye, EyeOff, Layers, Activity, FastForward, Rewind, 
  Sparkles, Check, Shield, Cpu, Compass, Video,
  ExternalLink
} from 'lucide-react';
import { ExtendedDatasetSpec, ActionSegment } from '../data/datasets';
import { CornerDots } from './CornerDots';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface DatasetVideoPlayerProps {
  dataset: ExtendedDatasetSpec;
  isDark?: boolean;
}

export function DatasetVideoPlayer({ dataset }: DatasetVideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const isSeekingRef = useRef<boolean>(false);
  const seekTargetTimeRef = useRef<number>(0);
  const lastSeekTimestampRef = useRef<number>(0);
  const microtaskRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Playback & view states
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hasResetToStartRef = useRef<boolean>(false);

  // Annotation overlay state (for simulation / CV inspection)
  const [showOverlays, setShowOverlays] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showTelemetryHUD, setShowTelemetryHUD] = useState(true);

  // Active micro-task segment
  const segments: ActionSegment[] = dataset.videoSegments || [
    {
      id: 'seg-1',
      label: 'Initial Setup & Workspace Alignment',
      timestamp: '00:00',
      timeSeconds: 0,
      duration: '15.0s',
      description: 'Human operator establishes initial grasp, calibrates sensory alignment and workspace coordinates.',
      phase: 'Initialization'
    },
    {
      id: 'seg-2',
      label: 'Primary Task Trajectory Execution',
      timestamp: '00:15',
      timeSeconds: 15,
      duration: '30.0s',
      description: 'Continuous bimanual fine-manipulation and tactile force regulation across target materials.',
      phase: 'Execution'
    },
    {
      id: 'seg-3',
      label: 'Target Positioning & Contact Verification',
      timestamp: '00:45',
      timeSeconds: 45,
      duration: '25.0s',
      description: 'Terminal object placement, inspection, and geometric tolerance validation.',
      phase: 'Completion'
    }
  ];

  const [realDuration, setRealDuration] = useState<number | null>(null);

  const totalDuration = useMemo(() => {
    if (realDuration && realDuration > 0) {
      return realDuration;
    }
    if (dataset.videoDuration) {
      const parts = dataset.videoDuration.split(':').map(Number);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return parts[0] * 60 + parts[1];
      }
    }
    const lastSeg = segments[segments.length - 1];
    if (lastSeg) {
      const segDur = parseFloat(lastSeg.duration) || 10;
      return lastSeg.timeSeconds + segDur;
    }
    return 60;
  }, [realDuration, dataset.videoDuration, segments]);

  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  // Helper to find which segment corresponds to current time and sync UI
  const syncTimeToSegment = useCallback((rawTime: number) => {
    // If user recently clicked a microtask or dragged seekbar:
    if (isSeekingRef.current) {
      const elapsed = Date.now() - lastSeekTimestampRef.current;
      // In the first 700ms, completely reject external time updates from player
      if (elapsed < 700) {
        return;
      }
      // For up to 3 seconds, reject if player hasn't moved close to seek target
      if (elapsed < 3000 && Math.abs(rawTime - seekTargetTimeRef.current) > 2.0) {
        return;
      }
      isSeekingRef.current = false;
    }

    const time = Math.max(0, Math.min(rawTime, totalDuration));
    setCurrentTime(time);

    // If video reached or exceeded total duration, pause playback
    if (time >= totalDuration - 0.25) {
      setIsPlaying(false);
    }

    let foundIdx = 0;
    for (let i = 0; i < segments.length; i++) {
      if (time >= segments[i].timeSeconds) {
        foundIdx = i;
      } else {
        break;
      }
    }

    setActiveSegmentIndex(foundIdx);
  }, [segments, totalDuration]);

  // Reset state when dataset changes
  useEffect(() => {
    setCurrentTime(0);
    setActiveSegmentIndex(0);
    setRealDuration(null);
    isSeekingRef.current = false;
    hasResetToStartRef.current = false;
  }, [dataset.youtubeId]);

  // 1. YouTube IFrame API Initialization
  useEffect(() => {
    let checkYtInterval: NodeJS.Timeout | null = null;

    const initYT = () => {
      if (window.YT && window.YT.Player && iframeRef.current) {
        try {
          if (!ytPlayerRef.current) {
            ytPlayerRef.current = new window.YT.Player(iframeRef.current, {
              events: {
                onReady: () => {
                  if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                      JSON.stringify({ event: 'listening' }),
                      '*'
                    );
                    iframeRef.current.contentWindow.postMessage(
                      JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
                      '*'
                    );
                  }
                  try {
                    const dur = ytPlayerRef.current?.getDuration();
                    if (typeof dur === 'number' && dur > 0) {
                      setRealDuration(dur);
                    }
                    ytPlayerRef.current?.seekTo(0, true);
                  } catch {}
                },
                onStateChange: (event: any) => {
                  if (event.data === 1) {
                    setIsPlaying(true);
                    isSeekingRef.current = false;
                  } else if (event.data === 0) {
                    // Video ended: loop cleanly back to 0
                    try {
                      ytPlayerRef.current?.seekTo(0, true);
                      ytPlayerRef.current?.playVideo();
                    } catch {}
                  } else if (event.data === 2 && !isSeekingRef.current) {
                    setIsPlaying(false);
                  }
                },
              },
            });
          }
        } catch {
          // ignore
        }
      }
    };

    if (window.YT && window.YT.Player) {
      initYT();
    } else {
      checkYtInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          initYT();
          if (checkYtInterval) clearInterval(checkYtInterval);
        }
      }, 300);
    }

    return () => {
      if (checkYtInterval) clearInterval(checkYtInterval);
      // NOTE: Do NOT call ytPlayerRef.current.destroy() because YouTube's API removes the <iframe> DOM element!
      ytPlayerRef.current = null;
    };
  }, [dataset.youtubeId]);

  // 2. Window postMessage listener for YouTube infoDelivery events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        if (data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setRealDuration((prev) => (prev !== data.info.duration ? data.info.duration : prev));
          }
          if (typeof data.info.currentTime === 'number') {
            const t = data.info.currentTime;
            // Prevent YouTube from auto-resuming at previous watch location (e.g., jumping from 0 to 39s)
            if (!hasResetToStartRef.current && t > 2.0) {
              hasResetToStartRef.current = true;
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                  JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
                  '*'
                );
                iframeRef.current.contentWindow.postMessage(
                  JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
                  '*'
                );
              }
              return;
            }
            if (t <= 2.0) {
              hasResetToStartRef.current = true;
            }
            syncTimeToSegment(t);
          }
          if (typeof data.info.playerState === 'number') {
            if (data.info.playerState === 0) {
              // Video ended: loop cleanly back to 0
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                  JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
                  '*'
                );
                iframeRef.current.contentWindow.postMessage(
                  JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
                  '*'
                );
              }
            } else if (!isSeekingRef.current) {
              setIsPlaying(data.info.playerState === 1);
            }
          }
        }
      } catch {
        // Not a JSON message
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [syncTimeToSegment]);

  // 3. Polling interval to query real playback time without duplicate command flooding
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'listening' }),
        '*'
      );
    }

    const timer = setInterval(() => {
      // Check YouTube Player API
      if (ytPlayerRef.current) {
        try {
          if (typeof ytPlayerRef.current.getDuration === 'function') {
            const dur = ytPlayerRef.current.getDuration();
            if (typeof dur === 'number' && dur > 0) {
              setRealDuration((prev) => (prev !== dur ? dur : prev));
            }
          }
          if (typeof ytPlayerRef.current.getCurrentTime === 'function') {
            const t = ytPlayerRef.current.getCurrentTime();
            if (typeof t === 'number' && !isNaN(t) && t >= 0) {
              syncTimeToSegment(t);
              return;
            }
          }
        } catch {}
      }

      // Check HTML5 video
      if (videoRef.current && !videoRef.current.paused) {
        syncTimeToSegment(videoRef.current.currentTime);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [syncTimeToSegment]);

  // Time formatting helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Seek to specific action segment in YouTube or HTML5 video (Manual Selection)
  const jumpToSegment = (seg: ActionSegment, idx: number) => {
    const target = Math.max(0, Math.min(seg.timeSeconds, totalDuration));
    isSeekingRef.current = true;
    seekTargetTimeRef.current = target;
    lastSeekTimestampRef.current = Date.now();

    setActiveSegmentIndex(idx);
    setCurrentTime(target);
    setIsPlaying(true);

    const executeSeekAndPlay = () => {
      if (ytPlayerRef.current) {
        try {
          if (typeof ytPlayerRef.current.seekTo === 'function') {
            ytPlayerRef.current.seekTo(target, true);
          }
          if (typeof ytPlayerRef.current.playVideo === 'function') {
            ytPlayerRef.current.playVideo();
          }
        } catch {}
      }

      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [target, true]
          }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'playVideo',
            args: []
          }),
          '*'
        );
      }
    };

    executeSeekAndPlay();
    // Re-trigger playVideo after 150ms and 350ms to ensure player resumes even if it was in ended state
    setTimeout(executeSeekAndPlay, 150);
    setTimeout(executeSeekAndPlay, 350);

    if (videoRef.current) {
      videoRef.current.currentTime = target;
      videoRef.current.play().catch(() => {});
    }
  };

  // Seekbar scrubbing
  const handleSeek = (newTime: number) => {
    const target = Math.max(0, Math.min(newTime, totalDuration));
    isSeekingRef.current = true;
    seekTargetTimeRef.current = target;
    lastSeekTimestampRef.current = Date.now();

    setCurrentTime(target);

    let foundIdx = 0;
    for (let i = 0; i < segments.length; i++) {
      if (target >= segments[i].timeSeconds) {
        foundIdx = i;
      } else {
        break;
      }
    }
    setActiveSegmentIndex(foundIdx);

    const executeSeek = () => {
      if (ytPlayerRef.current) {
        try {
          if (typeof ytPlayerRef.current.seekTo === 'function') {
            ytPlayerRef.current.seekTo(target, true);
          }
          if (isPlaying && typeof ytPlayerRef.current.playVideo === 'function') {
            ytPlayerRef.current.playVideo();
          }
        } catch {}
      }

      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [target, true]
          }),
          '*'
        );
        if (isPlaying) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'playVideo',
              args: []
            }),
            '*'
          );
        }
      }
    };

    executeSeek();
    setTimeout(executeSeek, 150);

    if (videoRef.current) {
      videoRef.current.currentTime = target;
    }
  };

  // Play/pause controls
  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    // If restarting after video ended
    if (nextState && currentTime >= totalDuration - 0.5) {
      jumpToSegment(segments[0], 0);
      return;
    }

    if (ytPlayerRef.current) {
      try {
        if (nextState && typeof ytPlayerRef.current.playVideo === 'function') {
          ytPlayerRef.current.playVideo();
        } else if (!nextState && typeof ytPlayerRef.current.pauseVideo === 'function') {
          ytPlayerRef.current.pauseVideo();
        }
      } catch {}
    }

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: nextState ? 'playVideo' : 'pauseVideo',
          args: []
        }),
        '*'
      );
    }

    if (videoRef.current) {
      if (nextState) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Volume & mute controls
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (ytPlayerRef.current) {
      try {
        if (nextMuted && typeof ytPlayerRef.current.mute === 'function') {
          ytPlayerRef.current.mute();
        } else if (!nextMuted && typeof ytPlayerRef.current.unMute === 'function') {
          ytPlayerRef.current.unMute();
        }
      } catch {}
    }

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: nextMuted ? 'mute' : 'unMute',
          args: []
        }),
        '*'
      );
    }

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVol === 0 && !isMuted) {
      setIsMuted(true);
    }

    if (ytPlayerRef.current) {
      try {
        if (typeof ytPlayerRef.current.setVolume === 'function') {
          ytPlayerRef.current.setVolume(newVol);
        }
        if (newVol > 0 && typeof ytPlayerRef.current.unMute === 'function') {
          ytPlayerRef.current.unMute();
        }
      } catch {}
    }

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'setVolume',
          args: [newVol]
        }),
        '*'
      );
    }

    if (videoRef.current) {
      videoRef.current.volume = newVol / 100;
      videoRef.current.muted = newVol === 0;
    }
  };

  // Simulated coordinate offsets for overlays
  const t = currentTime || 2;
  const leftHandX = 36 + Math.sin(t * 1.5) * 4;
  const leftHandY = 58 + Math.cos(t * 1.8) * 3;
  const rightHandX = 64 + Math.cos(t * 1.5) * 4;
  const rightHandY = 56 + Math.sin(t * 1.7) * 3;
  const doughBoxX = 35 + Math.sin(t * 0.8) * 2;
  const doughBoxY = 48 + Math.cos(t * 0.9) * 2;
  const doughBoxW = 30 + Math.sin(t * 0.5) * 3;
  const doughBoxH = 22 + Math.cos(t * 0.5) * 2;

  const youtubeUrl = dataset.youtubeUrl || (dataset.youtubeId ? `https://youtu.be/${dataset.youtubeId}` : undefined);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: 4K VIDEO PLAYER (8 Cols on Desktop)                          */}
      {/* ========================================================================= */}
      <div className="lg:col-span-8 flex flex-col">
        <div 
          ref={containerRef}
          className="relative w-full h-full rounded-2xl overflow-hidden bg-[#07080a] border border-white/[0.12] select-none shadow-2xl flex flex-col justify-between"
        >
        <CornerDots />

        {/* Video Player Header Bar */}
        <div className="px-4 py-3 bg-[#0d0f14] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-mono font-bold text-white text-[11px] uppercase tracking-wider">
              Real Demonstration Stream
            </span>
            <span className="font-mono text-slate-400 text-[11px] hidden sm:inline">
              • Stream Code: <span className="text-slate-200">{dataset.code}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/[0.08] border border-white/10 text-[10px] font-mono text-slate-200">
              {dataset.resolution || '4K UHD'} • {dataset.fps || 60} FPS
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* CV Overlays Toggle */}
            <button
              type="button"
              onClick={() => setShowOverlays(!showOverlays)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                showOverlays
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-xs'
                  : 'bg-white/[0.05] text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
              title="Toggle Computer Vision 3D Hand Skeleton & 6DoF Mesh Overlays"
            >
              {showOverlays ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
              <span>{showOverlays ? 'CV Overlays: ON' : 'CV Overlays'}</span>
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Fullscreen Player"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Aspect Ratio Box (16:9) */}
        <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden bg-black select-none">
          {dataset.youtubeId ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
              <iframe
                key={dataset.youtubeId}
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${dataset.youtubeId}?enablejsapi=1&autoplay=1&mute=1&playsinline=1&rel=0&controls=0&modestbranding=1&showinfo=0&iv_load_policy=3&fs=0&disablekb=1`}
                title={dataset.title}
                style={{
                  width: '140%',
                  height: '140%',
                  position: 'absolute',
                  top: '-20%',
                  left: '-20%',
                  border: 0,
                  pointerEvents: 'none',
                }}
                className="select-none pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => {
                  if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                      JSON.stringify({ event: 'listening' }),
                      '*'
                    );
                    iframeRef.current.contentWindow.postMessage(
                      JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
                      '*'
                    );
                  }
                }}
              />
            </div>
          ) : dataset.videoUrl ? (
            <video
              ref={videoRef}
              src={dataset.videoUrl}
              autoPlay
              playsInline
              muted={isMuted}
              loop
              onTimeUpdate={(e) => syncTimeToSegment(e.currentTarget.currentTime)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full relative flex flex-col items-center justify-center bg-[#090b0e] p-8 text-center">
              <img 
                src={dataset.thumbnail} 
                alt={dataset.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-sm"
              />
              <div className="relative z-10 max-w-md">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4 text-white">
                  <Video className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-display font-bold text-white mb-2 tracking-tight">
                  First-Person Stream Preview
                </h4>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Synchronized 4K raw video capture stream for {dataset.code}. High-frame-rate multimodal trajectories recorded at 60 FPS.
                </p>
              </div>
            </div>
          )}

          {/* Transparent interactive click overlay on top of video to toggle play/pause via custom player */}
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 w-full h-full z-10 cursor-pointer bg-transparent border-0 outline-none focus:outline-none"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          />

          {/* Custom Play overlay button when paused */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1px] cursor-pointer transition-all border-0 outline-none group"
              aria-label="Resume video"
            >
              <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 fill-black ml-1" />
              </div>
            </button>
          )}

          {/* OVERLAY LAYER: 3D Hand Pose (21 Joint Skeletons) & 6DoF Telemetry */}
          {showOverlays && (
            <div className="absolute inset-0 pointer-events-none z-20">
              <svg 
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="0.4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Left Hand MANO Skeleton Lines */}
                {showSkeleton && (
                  <>
                    <g stroke="#38bdf8" strokeWidth="0.4" strokeOpacity="0.85" filter="url(#glow)">
                      <line x1={leftHandX} y1={leftHandY} x2={leftHandX - 4} y2={leftHandY - 4} />
                      <line x1={leftHandX} y1={leftHandY} x2={leftHandX - 2} y2={leftHandY - 7} />
                      <line x1={leftHandX} y1={leftHandY} x2={leftHandX + 1} y2={leftHandY - 8} />
                      <line x1={leftHandX} y1={leftHandY} x2={leftHandX + 4} y2={leftHandY - 6} />
                      <line x1={leftHandX} y1={leftHandY} x2={leftHandX + 6} y2={leftHandY - 3} />
                      <line x1={leftHandX - 4} y1={leftHandY - 4} x2={leftHandX - 6} y2={leftHandY - 7} />
                      <line x1={leftHandX - 2} y1={leftHandY - 7} x2={leftHandX - 3} y2={leftHandY - 11} />
                      <line x1={leftHandX + 1} y1={leftHandY - 8} x2={leftHandX + 1} y2={leftHandY - 12} />
                      <line x1={leftHandX + 4} y1={leftHandY - 6} x2={leftHandX + 5} y2={leftHandY - 10} />
                      <line x1={leftHandX + 6} y1={leftHandY - 3} x2={leftHandX + 8} y2={leftHandY - 6} />
                    </g>

                    <g fill="#38bdf8">
                      <circle cx={leftHandX} cy={leftHandY} r="0.9" />
                      <circle cx={leftHandX - 4} cy={leftHandY - 4} r="0.6" />
                      <circle cx={leftHandX - 2} cy={leftHandY - 7} r="0.6" />
                      <circle cx={leftHandX + 1} cy={leftHandY - 8} r="0.6" />
                      <circle cx={leftHandX + 4} cy={leftHandY - 6} r="0.6" />
                      <circle cx={leftHandX + 6} cy={leftHandY - 3} r="0.6" />
                      <circle cx={leftHandX - 6} cy={leftHandY - 7} r="0.7" fill="#facc15" />
                      <circle cx={leftHandX - 3} cy={leftHandY - 11} r="0.7" fill="#facc15" />
                      <circle cx={leftHandX + 1} cy={leftHandY - 12} r="0.7" fill="#facc15" />
                      <circle cx={leftHandX + 5} cy={leftHandY - 10} r="0.7" fill="#facc15" />
                      <circle cx={leftHandX + 8} cy={leftHandY - 6} r="0.7" fill="#facc15" />
                    </g>

                    {/* Right Hand MANO Skeleton */}
                    <g stroke="#4ade80" strokeWidth="0.4" strokeOpacity="0.85" filter="url(#glow)">
                      <line x1={rightHandX} y1={rightHandY} x2={rightHandX - 6} y2={rightHandY - 3} />
                      <line x1={rightHandX} y1={rightHandY} x2={rightHandX - 4} y2={rightHandY - 6} />
                      <line x1={rightHandX} y1={rightHandY} x2={rightHandX - 1} y2={rightHandY - 8} />
                      <line x1={rightHandX} y1={rightHandY} x2={rightHandX + 3} y2={rightHandY - 7} />
                      <line x1={rightHandX} y1={rightHandY} x2={rightHandX + 5} y2={rightHandY - 4} />
                    </g>
                    <g fill="#4ade80">
                      <circle cx={rightHandX} cy={rightHandY} r="0.9" />
                      <circle cx={rightHandX - 6} cy={rightHandY - 3} r="0.6" />
                      <circle cx={rightHandX - 4} cy={rightHandY - 6} r="0.6" />
                      <circle cx={rightHandX - 1} cy={rightHandY - 8} r="0.6" />
                      <circle cx={rightHandX + 3} cy={rightHandY - 7} r="0.6" />
                      <circle cx={rightHandX + 5} cy={rightHandY - 4} r="0.6" />
                    </g>
                  </>
                )}

                {/* 6DoF Bounding Box */}
                {showBoundingBoxes && (
                  <g stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="1.5,1.5" fill="none">
                    <rect x={doughBoxX} y={doughBoxY} width={doughBoxW} height={doughBoxH} rx="0.5" />
                    <text x={doughBoxX + 1} y={doughBoxY + 3.5} fill="#f59e0b" fontSize="2.2" fontFamily="monospace" fontWeight="bold">
                      {dataset.code} / TARGET_OBJECT
                    </text>
                  </g>
                )}
              </svg>

              {/* HUD Sensor Readout overlay */}
              {showTelemetryHUD && (
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/20 p-2.5 rounded-xl font-mono text-[10px] text-white space-y-1 shadow-lg pointer-events-none">
                  <div className="text-sky-400 font-bold flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-sky-400" />
                    <span>MANO 3D POSE: SYNCHRONIZED</span>
                  </div>
                  <div className="text-slate-300">
                    Joints: 21 Right / 21 Left • Freq: 60Hz
                  </div>
                  <div className="text-slate-300">
                    Segment: <span className="text-white font-bold">{segments[activeSegmentIndex]?.phase}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Video Control Bar: Seekbar, Detik, & Volume */}
        <div className="px-4 py-2.5 bg-[#0a0c10] border-t border-white/[0.08] flex items-center gap-3 sm:gap-4 text-xs font-mono select-none">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            )}
          </button>

          {/* Seekbar */}
          <div className="flex-1 relative flex items-center group py-2">
            <div className="relative w-full h-1.5 rounded-full bg-white/[0.15] overflow-hidden">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-white rounded-full transition-all duration-75"
                style={{ width: `${Math.min(100, (currentTime / (totalDuration || 1)) * 100)}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={totalDuration || 60}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              title="Seek video position"
            />
          </div>

          {/* Detik (Current / Total duration) */}
          <div className="text-[11px] font-mono text-slate-300 tabular-nums shrink-0">
            <span className="text-white font-semibold">{formatTime(currentTime)}</span>
            <span className="text-slate-500 mx-1">/</span>
            <span className="text-slate-400">{formatTime(totalDuration)}</span>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-slate-200" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              className="w-14 sm:w-20 h-1 bg-white/[0.15] rounded-full accent-white cursor-pointer"
              title={`Volume: ${isMuted ? 0 : volume}%`}
            />
          </div>
        </div>
      </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: MICROTASKS (Horizontal scroll on mobile/tablet, Sidebar on desktop) */}
      {/* ========================================================================= */}
      <div className="lg:col-span-4 flex flex-col">
        <div className="relative flex flex-col h-full rounded-2xl border border-white/[0.12] bg-[#07080a] shadow-2xl overflow-hidden lg:min-h-[460px]">
          <CornerDots />

          {/* Microtasks Header */}
          <div className="p-3.5 sm:px-4 bg-[#0d0f14] border-b border-white/[0.08] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <h4 className="text-xs sm:text-sm font-display font-bold text-white tracking-wide uppercase">
                Microtask Timelines
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.08] border border-white/15 text-slate-200 font-bold">
              {segments.length} Microtasks
            </span>
          </div>

          {/* Microtasks List: Scroll kesamping (horizontal) di mobile & tablet, scroll kebawah (vertical) di desktop */}
          <div className="flex-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto max-h-none lg:max-h-[510px] p-3 gap-3 lg:gap-2.5 touch-pan-x overscroll-x-contain snap-x snap-mandatory lg:snap-none">
            {segments.map((seg, idx) => {
              const isActive = activeSegmentIndex === idx;
              return (
                <button
                  key={seg.id}
                  ref={(el) => { microtaskRefs.current[idx] = el; }}
                  type="button"
                  onClick={() => jumpToSegment(seg, idx)}
                  className={`w-[280px] sm:w-[320px] lg:w-full shrink-0 snap-start text-left p-3.5 rounded-xl border transition-all cursor-pointer group flex flex-col ${
                    isActive 
                      ? 'bg-white/[0.08] border-white/80 text-white shadow-xl ring-1 ring-white/20' 
                      : 'bg-[#0d1016] border-white/[0.08] hover:border-white/20 text-slate-300 hover:bg-[#121620]'
                  }`}
                >
                  {/* Top line: microtask tag and timestamp badge */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                      isActive 
                        ? 'bg-white text-black font-extrabold shadow-xs' 
                        : 'bg-white/[0.06] text-slate-300 border border-white/10 group-hover:bg-white/10 group-hover:text-white'
                    }`}>
                      microtask {idx + 1}
                    </span>
                    <span className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded border ${
                      isActive 
                        ? 'bg-white/10 text-white border-white/20' 
                        : 'bg-white/[0.04] text-slate-300 border-white/[0.08]'
                    }`}>
                      {seg.timestamp} ({seg.duration})
                    </span>
                  </div>

                  {/* Microtask Label / Action Name */}
                  <div className={`text-xs sm:text-sm font-semibold mb-1 leading-snug line-clamp-2 ${
                    isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {seg.label}
                  </div>

                  {/* Phase badge */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={`text-[10px] font-mono uppercase tracking-wider truncate ${
                      isActive ? 'text-slate-200 font-semibold' : 'text-slate-400'
                    }`}>
                      Phase: {seg.phase}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-[#8a8f98] line-clamp-2 leading-relaxed font-normal">
                    {seg.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Microtask Footer Note */}
          <div className="p-2.5 bg-[#0a0c10] border-t border-white/[0.06] text-center text-[10px] font-mono text-slate-500">
            <span className="lg:hidden">Geser ke samping (swipe) untuk melihat seluruh {segments.length} microtask →</span>
            <span className="hidden lg:inline">Scroll down to inspect all {segments.length} sequential microtasks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
