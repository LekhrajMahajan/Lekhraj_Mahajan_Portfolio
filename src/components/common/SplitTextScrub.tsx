import React, { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';

export interface SplitTextScrubProps {
  text: string;
  className?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  animationDuration?: number;
  scrub?: boolean | number;
  ease?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
}

/**
 * Accessible Character-by-Character Scroll-Scrub Reveal Component.
 * 
 * Features:
 * - Accessible: Complete text is readable by assistive technologies (screen readers) via aria-label and sr-only span.
 * - Fluid Character Splitting: Individual character spans scale and translate smoothly with scroll position.
 *   On desktop, subtle de-blurring is added; on mobile/touch, blur is omitted for performance.
 * - Full Reverse Scrubbing: Unrolls and rolls back smoothly when scrolling up and down.
 * - Reduced Motion: Bypasses GSAP and renders cleanly at full opacity when prefers-reduced-motion is enabled.
 */
export const SplitTextScrub: React.FC<SplitTextScrubProps> = ({
  text,
  className = '',
  scrollStart = 'top 90%',
  scrollEnd = 'top 68%',
  stagger = 0.025,
  animationDuration = 1,
  scrub = 0.8,
  ease = 'power3.out',
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    const spans = el.querySelectorAll('.scrub-char');
    if (!spans || spans.length === 0) return;

    const isMobileOrTouch =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

    const ctx = gsap.context(() => {
      if (isMobileOrTouch) {
        gsap.fromTo(
          spans,
          {
            opacity: 0.08,
            yPercent: 55,
            scaleY: 1.35,
            scaleX: 0.9,
            transformOrigin: '50% 100%',
          },
          {
            duration: animationDuration,
            ease,
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            stagger,
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: scrollStart,
              end: scrollEnd,
              scrub,
            },
          }
        );
      } else {
        gsap.fromTo(
          spans,
          {
            opacity: 0.08,
            yPercent: 55,
            scaleY: 1.35,
            scaleX: 0.9,
            filter: 'blur(4px)',
            transformOrigin: '50% 100%',
          },
          {
            duration: animationDuration,
            ease,
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            filter: 'blur(0px)',
            stagger,
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: scrollStart,
              end: scrollEnd,
              scrub,
            },
          }
        );
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [text, scrollStart, scrollEnd, stagger, animationDuration, scrub, ease]);

  return (
    <Component
      ref={containerRef}
      className="overflow-hidden"
      aria-label={text}
    >
      {/* Visual character spans hidden from screen reader announcements */}
      <span className={className} aria-hidden="true">
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="scrub-char inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
      {/* Accessible text for assistive technologies */}
      <span className="sr-only">{text}</span>
    </Component>
  );
};

export default SplitTextScrub;
