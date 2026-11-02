import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, SplitText } from '../../utils/gsapSetup';
import { prefersReducedMotion, isAuditBot } from '../../utils/motion';
import { portfolioData, type SocialLink } from '../../data/portfolio';
import { triggerResumeDownload } from '../../utils/downloadResume';
import { GitHubIcon, LinkedInIcon, MailIcon } from './SocialIcons';
import './hero.css';

interface HeroProps {
  onContactClick?: () => void;
  isLoaded?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onContactClick: _onContactClick,
  isLoaded = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const roleTextRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const portraitGlowRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  // 1. Masked Slide Swap between Professional Roles (~2.4s interval)
  useEffect(() => {
    const el = roleTextRef.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      let idx = 0;
      const interval = setInterval(() => {
        idx = (idx + 1) % portfolioData.roles.length;
        if (roleTextRef.current) {
          roleTextRef.current.textContent = portfolioData.roles[idx];
        }
      }, 2400);
      return () => clearInterval(interval);
    }

    let roleIdx = 0;
    const intervalTimer = setInterval(() => {
      if (!roleTextRef.current) return;

      const tl = gsap.timeline();
      tl.to(roleTextRef.current, {
        yPercent: -100,
        opacity: 0,
        duration: 0.42,
        ease: 'power2.in',
        onComplete: () => {
          roleIdx = (roleIdx + 1) % portfolioData.roles.length;
          if (roleTextRef.current) {
            roleTextRef.current.textContent = portfolioData.roles[roleIdx];
            gsap.set(roleTextRef.current, { yPercent: 100, opacity: 0 });
          }
        },
      }).to(roleTextRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 0.48,
        ease: 'power3.out',
      });
    }, 2400);

    return () => {
      clearInterval(intervalTimer);
    };
  }, []);

  // 2. Desktop Mouse Parallax and Spotlight (Fine pointer only)
  useEffect(() => {
    const isFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches;

    if (!isFinePointer || prefersReducedMotion()) return;

    const portrait = portraitRef.current;
    const glow = portraitGlowRef.current;
    const container = containerRef.current;
    if (!portrait || !container) return;

    const xToPortrait = gsap.quickTo(portrait, 'x', { duration: 0.45, ease: 'power2.out' });
    const yToPortrait = gsap.quickTo(portrait, 'y', { duration: 0.45, ease: 'power2.out' });
    const xToGlow = glow ? gsap.quickTo(glow, 'x', { duration: 0.85, ease: 'power2.out' }) : null;
    const yToGlow = glow ? gsap.quickTo(glow, 'y', { duration: 0.85, ease: 'power2.out' }) : null;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      // Smooth subtle horizontal parallax for portrait cutout while keeping bottom edge grounded
      xToPortrait(normX * 14);
      yToPortrait(0);

      // Slower, wider parallax for the ambient orange glow behind (+-22px)
      if (xToGlow && yToGlow) {
        xToGlow(normX * 22);
        yToGlow(normY * 22);
      }

      // Soft cursor-following spotlight CSS custom properties
      container.style.setProperty('--mx', `${e.clientX}px`);
      container.style.setProperty('--my', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 3. Initial hidden state while preloader is active to prevent flash
  useEffect(() => {
    if (prefersReducedMotion() || isAuditBot() || hasAnimatedRef.current) return;

    if (!isLoaded) {
      gsap.set(
        [
          eyebrowRef.current,
          headingRef.current,
          roleRef.current,
          introRef.current,
          ctaRef.current,
          socialsRef.current,
        ],
        { opacity: 0, y: 24 }
      );
      if (portraitRef.current) {
        gsap.set(portraitRef.current, { opacity: 0, x: 45 });
      }
    }
  }, [isLoaded]);

  // 4. GSAP Entrance Animation - Coordinated with Preloader Exit
  useEffect(() => {
    if (!isLoaded || hasAnimatedRef.current) return;

    if (prefersReducedMotion() || isAuditBot()) {
      hasAnimatedRef.current = true;
      gsap.set(
        [
          eyebrowRef.current,
          headingRef.current,
          roleRef.current,
          introRef.current,
          ctaRef.current,
          socialsRef.current,
          portraitRef.current,
        ],
        { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
      );
      return;
    }

    hasAnimatedRef.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05 });

      // Eyebrow entrance
      if (eyebrowRef.current) {
        tl.to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        });
      }

      // Heading: SplitText Line Mask Reveal
      if (headingRef.current) {
        // Ensure container is visible and positioned
        gsap.set(headingRef.current, { opacity: 1, y: 0 });

        try {
          const splitHeading = new SplitText(headingRef.current, {
            type: 'lines',
            linesClass: 'overflow-hidden pb-1',
          });
          tl.from(splitHeading.lines, {
            yPercent: 110,
            opacity: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out',
          }, '-=0.35');
        } catch {
          tl.from(
            headingRef.current,
            { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' },
            '-=0.35'
          );
        }
      }

      // Role Line
      if (roleRef.current) {
        tl.to(
          roleRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.45'
        );
      }

      // Introduction
      if (introRef.current) {
        tl.to(
          introRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        );
      }

      // CTA Buttons
      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        );
      }

      // Social Media Icons
      if (socialsRef.current) {
        tl.to(
          socialsRef.current,
          { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
          '-=0.35'
        );
      }

      // Portrait Image Entrance
      if (portraitRef.current) {
        tl.to(
          portraitRef.current,
          { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' },
          0.25
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // Social icon mapping (standalone clean vector icons)
  const renderSocialIcon = (icon: SocialLink['icon']) => {
    switch (icon) {
      case 'github':
        return <GitHubIcon size={24} />;
      case 'linkedin':
        return <LinkedInIcon size={24} />;
      case 'mail':
        return <MailIcon size={24} />;
      default:
        return <ArrowUpRight size={24} />;
    }
  };

  const handleDownloadCV = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 1. Programmatically trigger native file download via Blob URL
    // so the browser saves the file to disk without opening an extra duplicate tab
    const allowed = triggerResumeDownload(
      portfolioData.resumeUrl,
      'Lekhraj Resume.pdf'
    );

    // 2. If the user rapidly double-clicks, prevent the second click from opening a second tab
    if (!allowed) {
      e.preventDefault();
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full flex items-end justify-center pt-24 sm:pt-28 md:pt-32 lg:pt-32 pb-0 overflow-hidden bg-transparent text-[#161616]"
      aria-label="Hero Section"
    >
      {/* Subtle Static Grain Overlay */}
      <div className="hero-grain-overlay" aria-hidden="true" />

      {/* Soft Cursor Spotlight */}
      <div className="hero-spotlight" aria-hidden="true" />

      {/* Ambient background glow */}
      <div
        ref={portraitGlowRef}
        className="pointer-events-none absolute -right-20 bottom-10 size-96 rounded-full bg-[#bf4a1a]/8 blur-[130px] z-0"
        aria-hidden="true"
      />

      <div className="max-w-384 w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
          {/* ================================================================
              LEFT COLUMN: Editorial Copy, Role Slider, CTAs, Socials
              ================================================================ */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10 pb-8 sm:pb-12 lg:pb-14">
            {/* 1. Eyebrow */}
            <p ref={eyebrowRef} className="hero-eyebrow mb-3">
              {portfolioData.eyebrow}
            </p>

            {/* 2. Main Heading (Big Shoulders Display at large clamp size) */}
            <h1
              ref={headingRef}
              className="hero-heading text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-black uppercase tracking-tight leading-[0.92] mb-4 text-[#161616]"
            >
              Hi, I'm{' '}
              <span className="text-[#bf4a1a]">
                {portfolioData.firstName}
              </span>
            </h1>

            {/* 3. Masked Slide Swap Role Line */}
            <div
              ref={roleRef}
              className="hero-role-wrapper mb-5"
              aria-live="polite"
            >
              <span className="text-[#161616]/60 font-semibold mr-1.5 sm:mr-2 text-xl sm:text-3xl lg:text-4xl">
                A
              </span>
              <span className="hero-role-slider">
                <span ref={roleTextRef} className="hero-role-item text-[#161616] tracking-tight">
                  {portfolioData.roles[0]}
                </span>
              </span>
            </div>

            {/* 4. Short Introduction */}
            <p ref={introRef} className="hero-description mb-8">
              {portfolioData.introduction}
            </p>

            {/* 5. CTA Button */}
            <div
              ref={ctaRef}
              className="flex flex-wrap items-center gap-4 sm:gap-5 mb-10"
            >
              <a
                href={portfolioData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDownloadCV}
                className="hero-download-cv hover-this"
                aria-label="Download and view Lekhraj's CV (PDF)"
              >
                <span>DOWNLOAD CV</span>
              </a>
            </div>

            {/* 6. Social Media Icons (Clean standalone icons without circles) */}
            <div
              ref={socialsRef}
              className="flex items-center gap-6 sm:gap-7"
              aria-label="Social Media Links"
            >
              {portfolioData.socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="hero-social-link hover-icon"
                >
                  <span className="inline-flex items-center justify-center">
                    {renderSocialIcon(social.icon)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ================================================================
              RIGHT COLUMN: Cutout Portrait with Parallax (Touches Bottom Section)
              ================================================================ */}
          <div
            ref={portraitRef}
            id="bannerPhoto"
            className="lg:col-span-5 flex justify-center lg:justify-end items-end relative w-full pt-4 lg:pt-0 z-10 self-end -mb-0.5"
          >
            <img
              src={portfolioData.portraitImage}
              alt={portfolioData.portraitAlt}
              width={640}
              height={720}
              className="w-full max-w-125 sm:max-w-140 lg:max-w-155 xl:max-w-165 h-auto object-contain block align-bottom select-none pointer-events-none drop-shadow-[0_20px_45px_rgba(191,74,26,0.18)]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
