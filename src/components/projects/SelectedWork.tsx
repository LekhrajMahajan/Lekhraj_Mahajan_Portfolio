import React, { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';
import { selectedWorkData, type SelectedWorkData } from '../../data/projects';
import ProjectCard from './ProjectCard';
import SplitTextScrub from '../common/SplitTextScrub';

export interface SelectedWorkProps {
  id?: string;
  data?: SelectedWorkData;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({
  id = 'selected-work',
  data = selectedWorkData,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const isDesktop =
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1024px)').matches;

    const ctx = gsap.context(() => {
      const cards = cardListRef.current?.children;
      if (cards && cards.length > 0) {
        Array.from(cards).forEach((card) => {
          const cardTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });

          // 1. Outer Card container enters cleanly
          cardTl.fromTo(
            card,
            {
              opacity: 0,
              y: 40,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: 'power3.out',
              immediateRender: false,
            }
          );

          // 2. Project title masked vertical reveal
          const title = card.querySelector('.project-card-title');
          if (title) {
            cardTl.fromTo(
              title,
              { yPercent: 105, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.7,
                ease: 'power3.out',
                immediateRender: false,
              },
              '-=0.55'
            );
          }

          // 3. Project description and highlights metadata reveal smoothly after the title
          const details = card.querySelectorAll('.project-card-desc, .project-card-meta');
          if (details && details.length > 0) {
            cardTl.fromTo(
              Array.from(details),
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.08,
                duration: 0.5,
                ease: 'power2.out',
                immediateRender: false,
              },
              '-=0.4'
            );
          }

          // 4. Project image entrance: clip-path inset(0 0 100% 0) -> inset(0) with inner scale 1.15 -> 1
          const imgWrap = card.querySelector<HTMLElement>('.project-card-image-wrap');
          const imgEl = card.querySelector<HTMLElement>('.project-card-image');
          if (imgWrap) {
            cardTl.fromTo(
              imgWrap,
              { clipPath: 'inset(0% 0% 100% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.85,
                ease: 'power3.out',
                immediateRender: false,
              },
              '-=0.5'
            );
          }
          if (imgEl) {
            cardTl.fromTo(
              imgEl,
              { scale: 1.15 },
              {
                scale: 1,
                duration: 0.85,
                ease: 'power3.out',
                immediateRender: false,
              },
              '<'
            );
          }
        });

        // Card stack depth & scale effect: as next card stacks over, previous card scales down cleanly WITHOUT changing color!
        const stackItems = cardListRef.current?.querySelectorAll<HTMLElement>('.project-card-stack-item');
        if (stackItems && stackItems.length > 1) {
          stackItems.forEach((item, i) => {
            const innerCard = item.querySelector('.project-card-inner');
            if (!innerCard) return;

            // Animate previous card when next card scrolls up over it (scale only, keeping pure white card color)
            if (i < stackItems.length - 1) {
              const nextItem = stackItems[i + 1];
              gsap.to(innerCard, {
                scale: 0.96,
                transformOrigin: 'center center',
                ease: 'none',
                scrollTrigger: {
                  trigger: nextItem,
                  start: isDesktop ? 'top 55%' : 'top 95%',
                  end: isDesktop ? 'top 12%' : 'top 20%',
                  scrub: true,
                  onToggle: (self) => {
                    (innerCard as HTMLElement).style.willChange = self.isActive ? 'transform' : 'auto';
                  },
                },
              });
            }
          });
        }
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Dynamic Responsive Sticky Top Calculation for Project Cards
  // Guarantees that on mobile & tablet, the user scrolls through 100% of the project card
  // (preview screenshot, title, description, architecture highlights, tech badges, and VIEW PROJECT / GITHUB buttons)
  // before the card pins and the next project card stacks over it.
  useEffect(() => {
    const updateCardStickyTops = () => {
      if (typeof window === 'undefined') return;
      const vh = window.innerHeight;
      const isDesktop = window.innerWidth >= 1024;

      const cards = cardListRef.current?.querySelectorAll<HTMLElement>('.project-card-stack-item');
      if (!cards) return;

      cards.forEach((card, index) => {
        if (isDesktop) {
          const desktopTop = 78 + index * 24;
          card.style.setProperty('--card-sticky-top', `${desktopTop}px`);
          return;
        }

        // On mobile/tablet:
        const innerCard = card.querySelector<HTMLElement>('.project-card-inner') || card;
        const cardHeight = innerCard.offsetHeight;

        // Base mobile top offset when card fits: 60px + index * 12px
        const baseMobileTop = 60 + index * 12;

        // If card is taller than available viewport height:
        // Pin ONLY when its bottom reaches (vh - 16px).
        // That means sticky top = vh - cardHeight - 16px (negative value).
        const diff = vh - cardHeight - 16;
        const stickyTop = diff < baseMobileTop ? diff : baseMobileTop;
        card.style.setProperty('--card-sticky-top', `${stickyTop}px`);
      });
    };

    updateCardStickyTops();

    let resizeObserver: ResizeObserver | null = null;
    if (cardListRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateCardStickyTops();
      });
      resizeObserver.observe(cardListRef.current);
      const innerCards = cardListRef.current.querySelectorAll('.project-card-inner');
      innerCards.forEach((c) => resizeObserver?.observe(c));
    }

    window.addEventListener('resize', updateCardStickyTops, { passive: true });
    window.addEventListener('orientationchange', updateCardStickyTops, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateCardStickyTops);
      window.removeEventListener('orientationchange', updateCardStickyTops);
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full pt-10 sm:pt-14 pb-2 sm:pb-4 bg-topo-pattern text-[#161616] overflow-visible"
      aria-label="Selected Work & Projects"
    >
      {/* Anchor shim for backwards compatibility with '#projects' */}
      <div id="projects" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Eyebrow, Large Heading and Subtle Divider */}
        <div className="mb-10 sm:mb-14 border-y border-[#161616]/12 py-6 sm:py-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <SplitTextScrub
              text={data.eyebrow}
              scrollStart="top 94%"
              scrollEnd="top 75%"
              className="font-['Poppins'] text-[#bf4a1a] font-semibold text-xs sm:text-sm tracking-widest uppercase inline-block mb-1.5"
            />
            <SplitTextScrub
              text={data.title}
              scrollStart="top 90%"
              scrollEnd="top 68%"
              className="font-['Big_Shoulders_Display',sans-serif] text-[#161616] font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-none inline-block"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-['Poppins'] font-semibold uppercase tracking-wider text-[#161616]/55 select-none">
            <span className="size-2 rounded-full bg-[#bf4a1a]" />
            <span>2 FEATURED SHOWCASES</span>
          </div>
        </div>

        {/* Layered Stacking Project Cards with Depth Scale Effect */}
        <div
          ref={cardListRef}
          className="relative flex flex-col gap-[12vh] sm:gap-[15vh] lg:gap-[20vh] pb-8 sm:pb-12"
        >
          {data.projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card-stack-item sticky"
              style={{
                zIndex: index + 1,
                ['--card-index' as string]: index,
              }}
            >
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
