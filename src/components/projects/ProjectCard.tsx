import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectItem } from '../../data/projects';
import SkillIcon from '../skills/SkillIcon';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';

export interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

const LENS_DIAMETER = 126;
const RADIUS = LENS_DIAMETER / 2;
const ZOOM = 1.48;

interface EditorialContentProps {
  project: ProjectItem;
  isClone?: boolean;
}

const EditorialContent: React.FC<EditorialContentProps> = ({
  project,
  isClone = false,
}) => {
  return (
    <div
      className={`project-editorial-content flex flex-col justify-between flex-1 ${
        isClone ? 'pointer-events-none select-none' : ''
      }`}
    >
      <div>
        {/* Top Badges: Category & Project Type */}
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bf4a1a]/25 bg-[#bf4a1a]/10 px-3 py-1 font-['Poppins'] text-[11px] font-bold uppercase text-[#bf4a1a]">
            {project.category}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#161616]/10 bg-[#161616]/5 px-3 py-1 font-['Poppins'] text-[11px] font-bold uppercase text-[#161616]/75">
            {project.projectType}
          </span>
        </div>

        {/* Large Condensed Project Headline */}
        <div className="overflow-hidden pb-0.5">
          <h3
            {...(!isClone ? { id: `project-title-${project.id}` } : {})}
            className={`${
              isClone ? '' : 'project-card-title '
            }font-['Big_Shoulders_Display',sans-serif] text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-bold uppercase leading-[0.98] text-[#161616] tracking-tight`}
          >
            {project.title}
          </h3>
        </div>

        {/* Description */}
        <p
          className={`${
            isClone ? '' : 'project-card-desc '
          }mt-2 font-['Poppins'] text-xs sm:text-[13px] text-[#161616]/75 leading-relaxed`}
        >
          {project.description}
        </p>

        {/* Key Highlights / Architecture Points */}
        {project.highlights && project.highlights.length > 0 && (
          <div
            className={`${
              isClone ? '' : 'project-card-meta '
            }mt-3 pt-2.5 border-t border-[#161616]/8`}
          >
            <h4 className="font-['Poppins'] text-[11px] font-bold uppercase tracking-wider text-[#bf4a1a] mb-1.5">
              Key Highlights &amp; Architecture:
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
              {project.highlights.map((item, hIdx) => (
                <li
                  key={hIdx}
                  className="flex items-start gap-1.5 text-[11px] sm:text-xs font-['Poppins'] text-[#161616]/80 leading-snug"
                >
                  <span className="size-1.5 rounded-full bg-[#bf4a1a] mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        {/* Technology Badges */}
        <div className="mt-3.5 pt-2.5 border-t border-[#161616]/8">
          <div className="flex flex-wrap items-center gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#161616]/10 bg-[#161616]/4 py-0.5 pl-1 pr-2.5 text-[11px] font-semibold font-['Poppins'] text-[#161616]"
              >
                <span className="size-5 rounded-full bg-[#e5e3dc] flex items-center justify-center shrink-0 p-0.5">
                  <SkillIcon name={tech} className="size-3" />
                </span>
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const isReversed = index % 2 === 1;
  const displayNumber = String(index + 1).padStart(2, '0');

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const lensWrapRef = useRef<HTMLDivElement>(null);
  const cloneContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleLoadedMetadata = () => {
      if (video.currentTime === 0) {
        video.currentTime = 0.001;
      }
    };
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handlePointerEnter = () => {
    if (prefersReducedMotion()) return;
    const video = videoRef.current;

    if (video) {
      setIsPlaying(true);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    }
  };

  const handlePointerLeave = () => {
    if (prefersReducedMotion()) return;
    const video = videoRef.current;

    if (video) {
      setIsPlaying(false);
      video.pause();
    }
  };

  const handleMediaClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      setIsPlaying(true);
      video.play().catch(() => {});
    } else {
      setIsPlaying(false);
      video.pause();
    }
  };

  // Optical Magnifying Glass Event Handlers
  const handleZonePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const isFine =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: fine)').matches;
    if (!isFine) return;

    const zone = zoneRef.current;
    const lensWrap = lensWrapRef.current;
    const clone = cloneContentRef.current;
    if (!zone || !lensWrap || !clone) return;

    // Synchronize clone container dimensions exactly with the base container
    clone.style.width = `${zone.clientWidth}px`;
    clone.style.height = `${zone.clientHeight}px`;

    const rect = zone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.set(lensWrap, {
      x: x - RADIUS,
      y: y - RADIUS,
    });

    const cloneX = RADIUS - x * ZOOM;
    const cloneY = RADIUS - y * ZOOM;
    clone.style.transform = `translate3d(${cloneX}px, ${cloneY}px, 0) scale(${ZOOM})`;

    gsap.to(lensWrap, {
      scale: 1,
      opacity: 1,
      duration: 0.22,
      ease: 'back.out(1.5)',
      overwrite: 'auto',
    });
  };

  const handleZonePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const isFine =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: fine)').matches;
    if (!isFine) return;

    const zone = zoneRef.current;
    const lensWrap = lensWrapRef.current;
    const clone = cloneContentRef.current;
    if (!zone || !lensWrap || !clone) return;

    const rect = zone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.set(lensWrap, {
      x: x - RADIUS,
      y: y - RADIUS,
    });

    const cloneX = RADIUS - x * ZOOM;
    const cloneY = RADIUS - y * ZOOM;
    clone.style.transform = `translate3d(${cloneX}px, ${cloneY}px, 0) scale(${ZOOM})`;
  };

  const handleZonePointerLeave = () => {
    const lensWrap = lensWrapRef.current;
    if (!lensWrap) return;

    gsap.to(lensWrap, {
      scale: 0,
      opacity: 0,
      duration: 0.16,
      ease: 'power2.in',
      overwrite: 'auto',
    });
  };

  return (
    <article
      className="project-card-inner group overflow-hidden rounded-[24px] sm:rounded-[28px] border border-[#161616]/12 bg-white shadow-[0_20px_55px_rgba(22,22,22,0.12)] transition-[box-shadow,border-color] duration-300 flex flex-col lg:flex-row items-stretch"
      aria-labelledby={`project-title-${project.id}`}
    >
      {/* Media / Screenshot Preview Frame */}
      <div
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className={`relative bg-[#161616]/4 p-3 sm:p-4 pt-14 sm:pt-14 lg:p-4 rounded-2xl lg:rounded-3xl lg:w-[46%] xl:w-[48%] shrink-0 flex flex-col justify-center ${
          isReversed ? 'lg:order-2' : ''
        }`}
      >
        {/* Top-Left: Project Index Number Pill */}
        <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#161616]/90 px-3 py-1 font-['Poppins'] text-xs font-bold text-[#e5e3dc] shadow-md select-none">
          <span className="size-1.5 rounded-full bg-[#bf4a1a]" />
          <span>{displayNumber}</span>
        </div>

        {/* Top-Right: Status Badge (e.g. Ongoing / Live) */}
        {project.status && (
          <div className="absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#161616]/90 px-3 py-1 font-['Poppins'] text-[11px] font-bold text-[#e5e3dc] shadow-sm select-none">
            <span className="size-2 rounded-full bg-[#bf4a1a] animate-pulse" />
            <span>{project.status}</span>
          </div>
        )}

        {/* Clipped Media Container with Exact Matching Video Size & Aspect Ratio */}
        <div
          ref={frameRef}
          onClick={handleMediaClick}
          className="project-card-image-wrap relative w-full aspect-[1280/610] overflow-hidden rounded-[18px] border border-[#161616]/10 bg-white flex items-center justify-center shadow-inner cursor-pointer select-none"
        >
          {/* Direct Live Video (Muted, auto-plays on hover, pauses on leave, exact container fit) */}
          {project.video && (
            <video
              ref={videoRef}
              src={`${project.video}#t=0.001`}
              muted
              playsInline
              loop
              preload="auto"
              aria-label={`${project.title} live video preview`}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          )}

          {/* Subtle Live Preview Status Indicator Badge */}
          {project.video && (
            <div
              className={`absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#161616]/85 backdrop-blur-xs px-2.5 py-1 font-['Poppins'] text-[10px] font-semibold text-[#e5e3dc] shadow-sm select-none transition-all duration-300 ${
                isPlaying
                  ? 'opacity-0 translate-y-1 pointer-events-none'
                  : 'opacity-85 translate-y-0 group-hover:opacity-100'
              }`}
            >
              <span className="size-1.5 rounded-full bg-[#bf4a1a] animate-pulse" />
              <span>HOVER TO PREVIEW</span>
            </div>
          )}
        </div>
      </div>

      {/* Editorial Content / Information Container */}
      <div
        className={`flex flex-col p-4 sm:p-6 lg:p-6 xl:p-7 justify-between flex-1 ${
          isReversed ? 'lg:order-1' : ''
        }`}
      >
        {/* Optical Magnifying Glass Active Zone (Badges, Title, Desc, Highlights, Tech Pills) */}
        <div
          ref={zoneRef}
          data-magnify-zone="true"
          onPointerEnter={handleZonePointerEnter}
          onPointerMove={handleZonePointerMove}
          onPointerLeave={handleZonePointerLeave}
          className="relative select-none flex-1 flex flex-col justify-between cursor-none"
        >
          {/* Base Editorial Content */}
          <EditorialContent project={project} />

          {/* Optical Magnifying Glass Overlay */}
          <div
            ref={lensWrapRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-40 hidden md:block will-change-transform"
            style={{
              width: `${LENS_DIAMETER}px`,
              height: `${LENS_DIAMETER}px`,
              transform: 'scale(0)',
              opacity: 0,
            }}
          >
            {/* Circular Lens Frame with Glass Glare & Rim */}
            <div
              className="relative size-full rounded-full border-[3px] border-[#bf4a1a] overflow-hidden bg-white"
              style={{
                boxShadow:
                  '0 14px 36px rgba(0,0,0,0.32), 0 2px 10px rgba(191,74,26,0.3), inset 0 0 16px rgba(191,74,26,0.06)',
              }}
            >
              {/* Cloned Enlarged Content: Rendered at 1.48x scale with optical tracking */}
              <div
                ref={cloneContentRef}
                aria-hidden="true"
                className="absolute top-0 left-0 pointer-events-none origin-top-left"
              >
                <EditorialContent project={project} isClone />
              </div>

              {/* Specular glare gradient and subtle glass reflections */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 45%, rgba(191,74,26,0.05) 85%, rgba(0,0,0,0.08) 100%)',
                }}
              />
              {/* Specular rim glare curve along top-left rim */}
              <div
                className="absolute inset-1 rounded-full border-t-2 border-l-2 border-white/80 pointer-events-none"
                style={{ opacity: 0.85 }}
              />
            </div>

            {/* Authentic angled handle attached to bottom-right of circle */}
            <svg
              width="46"
              height="46"
              viewBox="0 0 46 46"
              fill="none"
              className="absolute -bottom-7 -right-7 pointer-events-none select-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
            >
              {/* Metal connector collar */}
              <path
                d="M7 7 L14 14"
                stroke="#bf4a1a"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Deep dark handle body */}
              <path
                d="M14 14 L38 38"
                stroke="#161616"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Subtle warm metallic highlight line */}
              <path
                d="M15 13 L37 35"
                stroke="#bf4a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Action CTAs: Primary (View Project) & Secondary (GitHub Repo when available) */}
        {/* Placed OUTSIDE the magnifying zone so buttons retain normal hover & magnetic click states */}
        <div className="mt-4 flex flex-wrap items-center gap-3 pt-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#161616] px-5 font-['Poppins'] text-xs font-bold uppercase tracking-wide text-[#e5e3dc] transition-all duration-300 hover:bg-black hover:text-white shadow-sm hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616] hover-this"
              aria-label={`View live project for ${project.title}`}
            >
              <span>VIEW PROJECT</span>
              <ArrowUpRight
                size={15}
                strokeWidth={2.2}
                className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            </a>
          )}

          {/* GitHub Repo Button - Only rendered if repositoryUrl is provided */}
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#161616]/20 bg-white px-4 font-['Poppins'] text-xs font-bold uppercase tracking-wide text-[#161616] transition-all duration-300 hover:bg-[#161616] hover:text-[#e5e3dc] hover:border-[#161616] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616] hover-this"
              aria-label={`View GitHub repository for ${project.title}`}
            >
              {/* Vector GitHub Emblem */}
              <svg
                viewBox="0 0 98 96"
                className="size-3.5 fill-current shrink-0"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.215-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                />
              </svg>
              <span>GITHUB REPO</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
