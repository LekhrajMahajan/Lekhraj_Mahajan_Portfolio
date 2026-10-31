import React, { useRef } from 'react';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';
import type { SkillCategory } from '../../data/portfolio';
import SkillIcon from './SkillIcon';

export interface SkillCardProps {
  category: SkillCategory;
  className?: string;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  category,
  className = '',
}) => {
  const cardRef = useRef<HTMLElement>(null);

  // Spotlight and subtle 3D tilt (max ~6deg) on desktop fine pointer
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch' || prefersReducedMotion()) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    gsap.to(card, {
      rotateY: normX * 5.5,
      rotateX: -normY * 5.5,
      transformPerspective: 850,
      duration: 0.25,
      ease: 'power2.out',
    });
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--mx', '-500px');
    card.style.setProperty('--my', '-500px');
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.45,
      ease: 'power2.out',
    });
  };

  // Subtle magnetic attraction for badge on hover
  const handleBadgeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || prefersReducedMotion()) return;
    const badge = e.currentTarget;
    const rect = badge.getBoundingClientRect();
    const bx = (e.clientX - rect.left - rect.width / 2) * 0.22;
    const by = (e.clientY - rect.top - rect.height / 2) * 0.22;
    gsap.to(badge, { x: bx, y: by, duration: 0.2, ease: 'power2.out' });
  };

  const handleBadgeLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.35, ease: 'power2.out' });
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        background: 'radial-gradient(380px circle at var(--mx, -500px) var(--my, -500px), rgba(191,74,26,0.14), transparent 75%), rgba(255, 255, 255, 0.78)',
      }}
      className={`rounded-[20px] border border-[#161616]/10 p-4 sm:p-5 shadow-[0_12px_36px_rgba(22,22,22,0.06)] backdrop-blur-md transition-[box-shadow,border-color] duration-300 hover:shadow-[0_22px_50px_rgba(22,22,22,0.12)] hover:border-[#161616]/25 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header: Title + Orange Dot + Ring Accent + Description */}
        <div className="flex items-start justify-between gap-3 mb-3.5 pb-2.5 border-b border-[#161616]/8">
          <div className="flex items-center gap-2">
            <h3 className="font-['Big_Shoulders_Display',sans-serif] text-2xl sm:text-[28px] font-bold uppercase tracking-tight text-[#161616] leading-none">
              {category.title}
            </h3>
            {/* Visual accent: Orange dot & hollow ring */}
            <span className="size-2 rounded-full bg-[#bf4a1a] shrink-0" />
            <span className="size-4.5 rounded-full border border-[#161616]/20 shrink-0 hidden xs:inline-block" />
          </div>
          {category.summary && (
            <p className="max-w-56 sm:max-w-64 font-['Poppins'] text-[11px] sm:text-xs text-[#161616]/65 text-right leading-snug shrink-0">
              {category.summary}
            </p>
          )}
        </div>

        {/* Skill Badges Wrapping Grid with Authentic Circular Icon Badges */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {category.skills.map((skill) => (
            <div
              key={skill.name}
              onPointerMove={handleBadgeMove}
              onPointerLeave={handleBadgeLeave}
              className="group inline-flex items-center gap-2 rounded-full bg-[#161616] text-[#e5e3dc] py-1 pl-1 pr-3 sm:py-1.5 sm:pl-1.5 sm:pr-3.5 text-xs sm:text-[12.5px] font-semibold font-['Poppins'] border border-[#161616]/20 shadow-xs transition-[background-color,border-color] duration-200 hover:bg-[#bf4a1a] hover:border-[#bf4a1a] cursor-default select-none"
            >
              {/* Circular light badge holding the technology logo */}
              <span className="size-6 sm:size-7 rounded-full bg-[#e5e3dc] flex items-center justify-center shrink-0 p-0.5 transition-transform duration-200 group-hover:scale-110">
                <SkillIcon name={skill.name} className="size-3.5 sm:size-4" />
              </span>
              <span className="tracking-wide">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default SkillCard;
