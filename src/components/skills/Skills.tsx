import React, { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';
import { portfolioData, type SkillsData } from '../../data/portfolio';
import SkillCard from './SkillCard';
import ProfileStatsCard from './ProfileStatsCard';
import SplitTextScrub from '../common/SplitTextScrub';

export interface SkillsProps {
  id?: string;
  data?: SkillsData;
}

export const Skills: React.FC<SkillsProps> = ({
  id = 'skills',
  data = portfolioData.skills,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Stagger reveal of the 4 skill cards
      const cards = gridRef.current?.children;
      if (cards && cards.length > 0) {
        gsap.fromTo(
          Array.from(cards),
          {
            opacity: 0,
            y: 45,
            scale: 0.97,
            filter: 'blur(4px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            stagger: 0.09,
            duration: 0.85,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Smooth entrance for the developer profile card
      if (profileCardRef.current) {
        gsap.fromTo(
          profileCardRef.current,
          {
            opacity: 0,
            y: 50,
            scale: 0.98,
            filter: 'blur(4px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full py-12 sm:py-16 lg:py-14 bg-topo-pattern text-[#161616] overflow-hidden"
      aria-label="Technologies and Expertise"
    >
      <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Section Header with Scroll-driven Letter Scrub Animation */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="overflow-hidden mb-2">
            <span className="font-['Poppins'] text-[#bf4a1a] font-semibold text-xs sm:text-sm tracking-widest uppercase inline-block">
              {data.eyebrow}
            </span>
          </div>
          <SplitTextScrub
            text={data.title}
            scrollStart="top 90%"
            scrollEnd="top 68%"
            className="font-['Big_Shoulders_Display',sans-serif] text-[#161616] font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight leading-none inline-block"
            as="h2"
          />
        </div>

        {/* 2-Column Grid: 4 Skill Category Cards (Left) + Tall Profile / GitHub Card (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_370px] 2xl:grid-cols-[minmax(0,1fr)_410px] gap-4 sm:gap-5 items-stretch">
          {/* Left: 4 Skill Cards in 2x2 Grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {data.categories.map((category) => (
              <SkillCard key={category.id} category={category} />
            ))}
          </div>

          {/* Right: Tall Developer Profile & GitHub Contribution Card */}
          <div ref={profileCardRef} className="h-full">
            <ProfileStatsCard
              avatar={data.profileCard.avatar}
              name={data.profileCard.name}
              subtitle={data.profileCard.subtitle}
              githubUrl={data.profileCard.githubUrl}
              githubUsername="LekhrajMahajan"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
