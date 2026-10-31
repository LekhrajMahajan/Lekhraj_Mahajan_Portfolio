import React, { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';

export interface SplitWordScrubProps {
  text: string;
  className?: string;
  triggerElement?: string | HTMLElement | null;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  scrub?: boolean | number;
  ease?: string;
  as?: 'p' | 'div' | 'span' | 'h2' | 'h3';
  fadedOpacity?: number;
  fadedBlur?: number;
  disableTrigger?: boolean;
}

/**
 * Word-by-Word Scroll Scrub Text Reveal.
 * 
 * Features:
 * - Each word begins in a dimmed state.
 * - As the user scrolls through the section, words sequentially illuminate
 *   synchronized with scroll position. On desktop, subtle de-blurring is applied;
 *   on mobile/touch devices, blur is avoided for GPU performance.
 * - Smooth reverse scrubbing when scrolling backwards.
 * - Fully accessible with sr-only text.
 * - Reduced-motion safe.
 */
export const SplitWordScrub: React.FC<SplitWordScrubProps> = ({
  text,
  className = '',
  triggerElement,
  scrollStart = 'top 80%',
  scrollEnd = 'bottom 35%',
  stagger = 0.06,
  scrub = 1,
  ease = 'none',
  as: Component = 'p',
  fadedOpacity = 0.18,
  fadedBlur = 5,
  disableTrigger = false,
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (disableTrigger) return;
    const el = containerRef.current;
    if (!el) return;

    const wordSpans = el.querySelectorAll<HTMLElement>('.scrub-word');
    if (!wordSpans || wordSpans.length === 0) return;

    if (prefersReducedMotion()) {
      wordSpans.forEach((span) => {
        span.style.opacity = '1';
        span.style.filter = 'none';
      });
      return;
    }

    const isMobileOrTouch =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

    const ctx = gsap.context(() => {
      if (isMobileOrTouch) {
        // Mobile / Touch: opacity only, no blur filter
        gsap.fromTo(
          wordSpans,
          {
            opacity: fadedOpacity,
            filter: 'none',
          },
          {
            opacity: 1,
            filter: 'none',
            stagger: {
              each: stagger,
              from: 'start',
            },
            ease,
            immediateRender: true,
            scrollTrigger: {
              trigger: triggerElement || el,
              start: scrollStart,
              end: scrollEnd,
              scrub,
              invalidateOnRefresh: true,
            },
          }
        );
      } else {
        // Desktop: opacity + blur de-focus scrub
        gsap.fromTo(
          wordSpans,
          {
            opacity: fadedOpacity,
            filter: `blur(${fadedBlur}px)`,
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            stagger: {
              each: stagger,
              from: 'start',
            },
            ease,
            immediateRender: true,
            scrollTrigger: {
              trigger: triggerElement || el,
              start: scrollStart,
              end: scrollEnd,
              scrub,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [
    text,
    triggerElement,
    scrollStart,
    scrollEnd,
    stagger,
    scrub,
    ease,
    fadedOpacity,
    fadedBlur,
    disableTrigger,
  ]);

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Component
      ref={containerRef as React.Ref<never>}
      className={className}
      aria-label={text}
    >
      <span aria-hidden="true" className="inline">
        {words.map((word, i) => (
          <span
            key={i}
            className="scrub-word inline-block"
            style={{
              marginRight: '0.28em',
              opacity: fadedOpacity,
            }}
          >
            {word}
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </Component>
  );
};

export default SplitWordScrub;
