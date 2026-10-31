import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
import { onScrollProgress, smoothScrollTo } from '../../utils/smoothScroll';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';
import './scroll-indicator.css';

export interface ScrollIndicatorProps {
  threshold?: number;
}

interface BallConfig {
  x: number;
  y: number;
  size: number;
  gradient: string;
}

// 32 Small 3D Marbles / Balls in signature palette (burnt orange, amber, obsidian, cream)
const BALLS: BallConfig[] = [
  // Layer 0 (Bottom Floor)
  { x: 4, y: 57, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 13, y: 58, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ffd175 0%, #d65d2b 65%, #8c2e08 100%)' },
  { x: 22, y: 57, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 31, y: 58, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e3dc 65%, #9e9a8f 100%)' },

  // Layer 1
  { x: 8, y: 49, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #555555 0%, #161616 75%, #000000 100%)' },
  { x: 17, y: 48, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 26, y: 49, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ffd175 0%, #d65d2b 65%, #8c2e08 100%)' },
  { x: 33, y: 48, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },

  // Layer 2
  { x: 4, y: 41, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 13, y: 40, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e3dc 65%, #9e9a8f 100%)' },
  { x: 22, y: 41, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 31, y: 40, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #555555 0%, #161616 75%, #000000 100%)' },

  // Layer 3
  { x: 8, y: 33, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ffd175 0%, #d65d2b 65%, #8c2e08 100%)' },
  { x: 17, y: 32, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 26, y: 33, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 33, y: 32, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e3dc 65%, #9e9a8f 100%)' },

  // Layer 4
  { x: 4, y: 25, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 13, y: 24, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #555555 0%, #161616 75%, #000000 100%)' },
  { x: 22, y: 25, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ffd175 0%, #d65d2b 65%, #8c2e08 100%)' },
  { x: 31, y: 24, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },

  // Layer 5
  { x: 8, y: 17, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e3dc 65%, #9e9a8f 100%)' },
  { x: 17, y: 16, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 26, y: 17, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 33, y: 16, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ffd175 0%, #d65d2b 65%, #8c2e08 100%)' },

  // Layer 6
  { x: 4, y: 10, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 13, y: 9, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ffd175 0%, #d65d2b 65%, #8c2e08 100%)' },
  { x: 22, y: 10, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #555555 0%, #161616 75%, #000000 100%)' },
  { x: 31, y: 9, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },

  // Layer 7 (Top Lid)
  { x: 8, y: 3, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 17, y: 2, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e3dc 65%, #9e9a8f 100%)' },
  { x: 26, y: 3, size: 8.5, gradient: 'radial-gradient(circle at 35% 35%, #ff8c52 0%, #bf4a1a 60%, #7a2608 100%)' },
  { x: 33, y: 2, size: 9, gradient: 'radial-gradient(circle at 35% 35%, #ffd175 0%, #d65d2b 65%, #8c2e08 100%)' },
];

/**
 * Ball Jar Scroll Progress & Back-to-Top Button.
 * Features:
 * - A glass jar that fills with small colorful 3D balls (marbles) as you scroll down.
 * - At 100% scroll, the jar is completely filled to the top with balls.
 * - Clicking the jar smoothly scrolls to top with Lenis and playful bounce.
 */
export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ threshold = 40 }) => {
  const jarRef = useRef<HTMLDivElement>(null);

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

  const updateState = useCallback((p: number, y: number) => {
    setProgress(p);
    setIsVisible(y > threshold || p > 2);
  }, [threshold]);

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
    if (!prefersReducedMotion() && jarRef.current) {
      gsap.fromTo(
        jarRef.current,
        { scale: 0.9, rotate: -4 },
        { scale: 1, rotate: 0, duration: 0.45, ease: 'elastic.out(1, 0.4)' }
      );
    }
    smoothScrollTo(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleScrollToTop();
    }
  };

  // Calculate how many balls are filled according to scroll percentage
  const totalBalls = BALLS.length;
  const filledCount = Math.round((progress / 100) * totalBalls);

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      onKeyDown={handleKeyDown}
      data-no-cursor="true"
      aria-label={`Scroll to top of page. Currently at ${Math.round(progress)}% of page.`}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group flex flex-col items-center cursor-pointer select-none transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bf4a1a] focus-visible:ring-offset-2 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100 active:scale-95'
          : 'opacity-0 translate-y-4 pointer-events-none scale-90'
      }`}
    >
      <div ref={jarRef} className="relative flex flex-col items-center">
        {/* Glass Jar Neck / Rim */}
        <div className="w-8 h-2 rounded-t-[5px] bg-white/40 border-t border-x border-white/80 shadow-xs backdrop-blur-xs" />

        {/* Glass Jar Body with Small Balls */}
        <div className="relative w-12 h-20 rounded-b-[20px] rounded-t-[6px] bg-white/20 backdrop-blur-md border-[1.5px] border-white/80 shadow-[0_12px_32px_rgba(22,22,22,0.18),0_4px_12px_rgba(191,74,26,0.12),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Subtle rising warm liquid glow tint */}
          <div
            className="absolute bottom-0 inset-x-0 bg-linear-to-t from-[#bf4a1a]/35 via-[#bf4a1a]/15 to-transparent transition-[height] duration-150 pointer-events-none"
            style={{ height: `${progress}%` }}
            aria-hidden="true"
          />

          {/* 32 Small 3D Marbles / Balls that fill up as you scroll down */}
          <div className="absolute inset-0 p-1 pointer-events-none z-10">
            {BALLS.map((ball, i) => {
              const isFilled = i < filledCount;
              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${ball.size}px`,
                    height: `${ball.size}px`,
                    left: `${ball.x}px`,
                    top: `${ball.y}px`,
                    background: ball.gradient,
                    boxShadow:
                      'inset -1px -1px 2px rgba(0,0,0,0.45), inset 1px 1px 1.5px rgba(255,255,255,0.85), 0 1px 2.5px rgba(0,0,0,0.3)',
                    transform: isFilled
                      ? 'scale(1) translateY(0)'
                      : 'scale(0) translateY(-14px)',
                    opacity: isFilled ? 1 : 0,
                    transition:
                      'transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.16s ease-out',
                  }}
                />
              );
            })}
          </div>

          {/* Vertical Curved Glass Reflection Streak on left */}
          <div className="absolute left-1.5 top-2 bottom-2 w-1 rounded-full bg-linear-to-b from-white/80 via-white/20 to-transparent pointer-events-none z-20" />

          {/* Foreground Overlay: Upward Chevron & Progress % */}
          <div className="relative z-30 flex flex-col items-center justify-between h-full py-2 px-1 select-none pointer-events-none">
            {/* Top Chevron Up with hover bounce */}
            <ChevronUp
              size={16}
              strokeWidth={3}
              className={`transition-colors duration-200 transition-transform duration-300 group-hover:-translate-y-1 ${
                filledCount > 24
                  ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]'
                  : 'text-[#bf4a1a]'
              }`}
              aria-hidden="true"
            />

            {/* Bottom Scroll Percentage */}
            <span
              className={`font-['Poppins',sans-serif] text-[11px] font-bold tracking-tight leading-none pb-0.5 transition-colors duration-200 ${
                filledCount > 6
                  ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
                  : 'text-[#bf4a1a]'
              }`}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ScrollIndicator;
