import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';
import { portfolioData, type AboutData } from '../../data/portfolio';
import { smoothScrollTo } from '../../utils/smoothScroll';
import SplitWordScrub from '../common/SplitWordScrub';

export interface AboutProps {
  id?: string;
  data?: AboutData;
}

export const About: React.FC<AboutProps> = ({
  id = 'about',
  data = portfolioData.about,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const locationRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const wordSpans = rightColRef.current?.querySelectorAll<HTMLElement>('.scrub-word');
      const checkItems = rightColRef.current?.querySelectorAll<HTMLElement>('.about-checklist-item');
      if (wordSpans) wordSpans.forEach((s) => { s.style.opacity = '1'; s.style.filter = 'none'; });
      if (checkItems) checkItems.forEach((s) => { s.style.opacity = '1'; s.style.filter = 'none'; });
      if (ctaRef.current) { ctaRef.current.style.opacity = '1'; ctaRef.current.style.filter = 'none'; }
      return;
    }

    const isMobileOrTouch =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

    const ctx = gsap.context(() => {
      // 1. Entrance timeline for Left Column (Eyebrow, Main 3-line Headline, Location)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      const titleLines = headingRef.current?.querySelectorAll('.about-title-line');

      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }
        );
      }

      if (titleLines && titleLines.length > 0) {
        tl.fromTo(
          Array.from(titleLines),
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.85,
            ease: 'power3.out',
            immediateRender: false,
          },
          '-=0.3'
        );
      }

      if (locationRef.current) {
        tl.fromTo(
          locationRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', immediateRender: false },
          '-=0.4'
        );
      }

      // 2. UNIFIED SCROLL SCRUB REVEAL for Entire Right Area
      // Scrubs as About Me rises into view, so that by the time it reaches the top (scroll ~24-25%),
      // EVERYTHING (paragraph words, checklist points, and button) is 100% revealed and clear.
      const wordSpans = rightColRef.current?.querySelectorAll<HTMLElement>('.scrub-word');
      const checkItems = rightColRef.current?.querySelectorAll<HTMLElement>('.about-checklist-item');
      const ctaBtn = ctaRef.current;

      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobileOrTouch ? 'top 85%' : 'top 95%',
          end: isMobileOrTouch ? 'top 45%' : 'top 10%',
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });

      if (isMobileOrTouch) {
        // Mobile/Touch: Opacity only, avoiding GPU blur filter overhead
        if (wordSpans && wordSpans.length > 0) {
          scrubTl.fromTo(
            Array.from(wordSpans),
            { opacity: 0.18, filter: 'none' },
            {
              opacity: 1,
              filter: 'none',
              stagger: 0.007,
              duration: 0.22,
              ease: 'none',
            },
            0
          );
        }

        if (checkItems && checkItems.length > 0) {
          scrubTl.fromTo(
            Array.from(checkItems),
            { opacity: 0.18, filter: 'none' },
            {
              opacity: 1,
              filter: 'none',
              stagger: 0.04,
              duration: 0.20,
              ease: 'none',
            },
            0.30
          );
        }

        if (ctaBtn) {
          scrubTl.fromTo(
            ctaBtn,
            { opacity: 0.18, filter: 'none' },
            {
              opacity: 1,
              filter: 'none',
              duration: 0.20,
              ease: 'none',
            },
            0.60
          );
        }
      } else {
        // Desktop: Opacity + blur de-focus scrub
        if (wordSpans && wordSpans.length > 0) {
          scrubTl.fromTo(
            Array.from(wordSpans),
            {
              opacity: 0.18,
              filter: 'blur(5px)',
            },
            {
              opacity: 1,
              filter: 'blur(0px)',
              stagger: 0.007,
              duration: 0.22,
              ease: 'none',
            },
            0
          );
        }

        if (checkItems && checkItems.length > 0) {
          scrubTl.fromTo(
            Array.from(checkItems),
            {
              opacity: 0.18,
              filter: 'blur(5px)',
            },
            {
              opacity: 1,
              filter: 'blur(0px)',
              stagger: 0.04,
              duration: 0.20,
              ease: 'none',
            },
            0.30
          );
        }

        if (ctaBtn) {
          scrubTl.fromTo(
            ctaBtn,
            {
              opacity: 0.18,
              filter: 'blur(5px)',
            },
            {
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.20,
              ease: 'none',
            },
            0.60
          );
        }
      }

      // Stage D: Holding buffer from 0.80 to 1.0
      // Guarantees all elements are already 100% revealed and clear
      // well before the section reaches top: 0 (~24-25% scroll)
      scrubTl.to({}, { duration: 0.20 }, 0.80);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(href, { offset: -40 });
    }
  };

  // Split key points into two balanced columns
  const midPoint = Math.ceil(data.keyPoints.length / 2);
  const col1 = data.keyPoints.slice(0, midPoint);
  const col2 = data.keyPoints.slice(midPoint);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full lg:min-h-screen flex flex-col justify-center py-12 sm:py-16 lg:py-10 bg-topo-pattern text-[#161616] overflow-hidden"
      aria-label="About Lekhraj"
    >
      <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column: Eyebrow, Main 3-line Headline, Location */}
          <div ref={leftColRef} className="lg:w-96 xl:w-105 shrink-0">
            <span
              ref={eyebrowRef}
              className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#bf4a1a] font-['Poppins'] block mb-2 sm:mb-3"
            >
              {data.eyebrow}
            </span>

            <h2
              ref={headingRef}
              className="font-['Big_Shoulders_Display',sans-serif] text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] lg:leading-[1.0] font-semibold uppercase text-[#161616] tracking-tight"
            >
              <span className="block overflow-hidden pb-1">
                <span className="about-title-line inline-block">
                  {data.headlineLine1}
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="about-title-line inline-block text-[#bf4a1a]">
                  {data.headlineHighlight}
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="about-title-line inline-block">
                  {data.headlineLine3}
                </span>
              </span>
            </h2>

            <p
              ref={locationRef}
              className="mt-4 sm:mt-5 lg:mt-6 font-['Poppins'] text-xs sm:text-sm text-[#161616]/65 font-medium leading-relaxed"
            >
              {data.location}
            </p>
          </div>

          {/* Right Column: Introduction Paragraph, Key Points Checklist, CTA */}
          <div ref={rightColRef} className="flex-1 lg:max-w-2xl">
            {/* Introduction Copy with Word-by-Word Scroll Scrub Reveal */}
            <SplitWordScrub
              text={data.introduction}
              disableTrigger={true}
              fadedOpacity={0.18}
              fadedBlur={5}
              className="font-['Poppins'] text-base sm:text-xl lg:text-[20px] xl:text-[22px] lg:leading-[1.45] font-normal text-[#161616] mb-4 sm:mb-5 lg:mb-6 block"
            />

            {/* Checklist: 2 Columns on Tablet/Desktop with Scroll Scrub Reveal */}
            <div
              ref={listRef}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2.5 sm:gap-y-3 mb-5 sm:mb-6 lg:mb-7"
            >
              {[col1[0], col2[0], col1[1], col2[1], col1[2], col2[2]].filter(Boolean).map((item) => (
                <div
                  key={item}
                  className="about-checklist-item flex items-center gap-2.5 font-['Poppins'] text-xs sm:text-[13px] lg:text-sm font-semibold text-[#161616]/85 leading-snug"
                  style={{ opacity: 0.18 }}
                >
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-[#bf4a1a]"
                    strokeWidth={2.2}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Outlined Action Button with Scroll Scrub Reveal */}
            <div
              ref={ctaRef}
              style={{ opacity: 0.18 }}
            >
              <a
                href={data.ctaHref}
                onClick={(e) => handleSmoothScroll(e, data.ctaHref)}
                className="inline-flex items-center gap-2 rounded-full border border-[#161616]/25 bg-transparent px-6 py-2.5 font-['Poppins'] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#161616] transition-all duration-300 hover:bg-[#161616] hover:text-[#e5e3dc] hover:border-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616] group hover-this"
              >
                <span>{data.ctaLabel}</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
