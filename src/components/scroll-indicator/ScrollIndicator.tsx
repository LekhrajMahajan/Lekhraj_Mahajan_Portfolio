import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
import { onScrollProgress, smoothScrollTo } from '../../utils/smoothScroll';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';
import './scroll-indicator.css';

export interface ScrollIndicatorProps {
  threshold?: number;
}

/**
 * Capsule Liquid Scroll Progress & Back-to-Top Button.
 *
 * Features:
 * - Sleek, glassmorphic capsule/pill shape matching the website aesthetic.
 * - Dynamic liquid filling up proportionally to scroll progress.
 * - Rich brand palette: deep obsidian/burnt orange base (#661e05 / #bf4a1a) fading
 *   into a warm, glowing amber meniscus (#ff8c52) with an internal liquid gradient fade.
 * - Gentle undulating animated liquid wave on the surface.
 * - Realistic glass specular highlights (curved rim reflection, top dome gloss).
 * - Tactile squash-and-stretch click bounce that smoothly scrolls to the top of the page.
 */
export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ threshold = 40 }) => {
  const capsuleRef = useRef<HTMLDivElement>(null);

  const calculateProgress = useCallback(() => {
    if (typeof window === 'undefined') return { progress: 0, scrollY: 0 };
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const rawProgress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
    const clampedProgress =
      maxScroll > 0 && scrollY >= maxScroll - 6
        ? 100
        : Math.min(100, Math.max(0, rawProgress));
    return { progress: clampedProgress, scrollY };
  }, []);

  const [progress, setProgress] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return maxScroll > 0 ? Math.min(100, Math.max(0, (scrollY / maxScroll) * 100)) : 0;
  });

  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    return scrollY > threshold;
  });

  const updateState = useCallback(
    (p: number, y: number) => {
      setProgress(p);
      setIsVisible(y > threshold || p > 2);
    },
    [threshold]
  );

  useEffect(() => {
    const unsubscribeLenis = onScrollProgress((_lenisProgress, scrollY) => {
      const doc = calculateProgress();
      updateState(doc.progress, scrollY);
    });

    const handleNativeEvent = () => {
      const current = calculateProgress();
      updateState(current.progress, current.scrollY);
    };

    window.addEventListener('scroll', handleNativeEvent, { passive: true });
    window.addEventListener('resize', handleNativeEvent, { passive: true });

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(handleNativeEvent).catch(() => {});
    }

    return () => {
      unsubscribeLenis();
      window.removeEventListener('scroll', handleNativeEvent);
      window.removeEventListener('resize', handleNativeEvent);
    };
  }, [calculateProgress, updateState]);

  const handleScrollToTop = () => {
    if (!prefersReducedMotion() && capsuleRef.current) {
      gsap
        .timeline()
        .to(capsuleRef.current, {
          scaleX: 1.14,
          scaleY: 0.88,
          y: -4,
          duration: 0.12,
          ease: 'power2.out',
        })
        .to(capsuleRef.current, {
          scaleX: 1,
          scaleY: 1,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1.2, 0.4)',
        });
    }
    smoothScrollTo(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleScrollToTop();
    }
  };

  const roundedProgress = Math.round(progress);
  const isFull = roundedProgress >= 99;

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      onKeyDown={handleKeyDown}
      data-no-cursor="true"
      aria-label={`Scroll to top of page. Currently at ${roundedProgress}% of page.`}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group flex flex-col items-center cursor-pointer select-none transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bf4a1a] focus-visible:ring-offset-2 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100 active:scale-95'
          : 'opacity-0 translate-y-4 pointer-events-none scale-90'
      }`}
    >
      <div
        ref={capsuleRef}
        className="relative flex flex-col items-center scroll-indicator-float"
      >
        {/* Glass Capsule Body */}
        <div
          className={`relative w-11 sm:w-12 h-22 sm:h-24 rounded-full bg-[#161616]/65 backdrop-blur-md border-[1.5px] border-white/20 group-hover:border-[#bf4a1a]/60 shadow-[0_12px_32px_rgba(22,22,22,0.35),0_4px_16px_rgba(191,74,26,0.18),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 ${
            isFull ? 'capsule-glow-full' : ''
          }`}
        >
          {/* Liquid Chamber (Fills Upwards via Scroll Progress) */}
          <div
            className="absolute bottom-0 inset-x-0 transition-[height] duration-150 ease-out pointer-events-none"
            style={{ height: `${progress}%` }}
            aria-hidden="true"
          >
            {/* Wavy Liquid Surface Meniscus (Seamless Medium Orange with Liquid Body) */}
            {progress > 1 && progress < 99 && (
              <div className="absolute -top-3 left-0 w-full h-5 pointer-events-none z-10">
                {/* Secondary Soft Crest Wave */}
                <svg
                  className="absolute top-0 left-0 w-[200%] h-full fill-[#e86a32] opacity-85 animate-liquid-wave-1"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M 0 7 Q 12.5 11, 25 7 T 50 7 Q 62.5 11, 75 7 T 100 7 V 20 H 0 Z" />
                </svg>
                {/* Primary Solid Medium Orange Wave (Seamlessly merges with liquid fill) */}
                <svg
                  className="absolute top-0.5 left-0 w-[200%] h-full fill-[#d85a24] animate-liquid-wave-2"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M 0 8 Q 12.5 4, 25 8 T 50 8 Q 62.5 4, 75 8 T 100 8 V 20 H 0 Z" />
                </svg>
              </div>
            )}

            {/* Liquid Fill Body with Brand Colors & Internal Fade */}
            <div className="w-full h-full relative overflow-hidden">
              {/* Vertical Brand Color Gradient - Medium Orange Top */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, #661e05 0%, #872906 20%, #bf4a1a 45%, #d85a24 75%, #d85a24 100%)',
                }}
              />

              {/* Internal Liquid Soft Fade & Specular Glow (Smooth center fade without harsh top line) */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 45%, rgba(255, 190, 140, 0.3) 0%, rgba(191, 74, 26, 0.08) 55%, transparent 85%)',
                }}
              />

              {/* Rising Micro-Bubbles inside Liquid */}
              {progress > 14 && (
                <div className="absolute inset-x-0 bottom-1 top-2 pointer-events-none overflow-hidden">
                  <span className="absolute bottom-1 left-2 size-1 rounded-full bg-white/60 animate-liquid-bubble-1" />
                  <span className="absolute bottom-2 right-2.5 size-1.5 rounded-full bg-white/50 animate-liquid-bubble-2" />
                  <span className="absolute bottom-3 left-4 size-1 rounded-full bg-white/70 animate-liquid-bubble-3" />
                </div>
              )}
            </div>
          </div>

          {/* Glass Reflections & Specular Curved Highlights */}
          {/* 1. Left Vertical Curved Highlight Streak */}
          <div className="absolute left-1.5 top-3 bottom-3 w-1 rounded-full bg-linear-to-b from-white/70 via-white/20 to-transparent pointer-events-none z-20" />

          {/* 2. Right Subtle Rim Specular Reflection */}
          <div className="absolute right-1 top-4 bottom-4 w-[1px] bg-white/15 pointer-events-none z-20" />

          {/* 3. Top Dome Gloss Highlight */}
          <div className="absolute top-1 left-2.5 right-2.5 h-3 rounded-full bg-linear-to-b from-white/35 to-transparent blur-[0.5px] pointer-events-none z-20" />

          {/* 4. Bottom Dome Ambient Reflection */}
          <div className="absolute bottom-1 left-2.5 right-2.5 h-2 rounded-full bg-black/25 blur-[0.5px] pointer-events-none z-20" />

          {/* Foreground Overlay: Upward Chevron & Progress % */}
          <div className="relative z-30 flex flex-col items-center justify-between h-full py-2.5 px-1 select-none pointer-events-none">
            {/* Top Chevron Up with hover bounce */}
            <ChevronUp
              size={16}
              strokeWidth={3}
              className={`transition-all duration-300 group-hover:-translate-y-1 ${
                progress > 75
                  ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]'
                  : 'text-[#bf4a1a] group-hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
              }`}
              aria-hidden="true"
            />

            {/* Bottom Scroll Percentage */}
            <span
              className={`font-['Poppins',sans-serif] text-[10.5px] sm:text-[11px] font-bold tracking-tight leading-none pb-0.5 transition-colors duration-200 ${
                progress > 14
                  ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]'
                  : 'text-[#e5e3dc] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
              }`}
            >
              {roundedProgress}%
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ScrollIndicator;
