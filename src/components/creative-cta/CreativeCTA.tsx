import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, CheckCircle2, Mail } from 'lucide-react';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';
import { portfolioData, type CreativeCTAStat } from '../../data/portfolio';
import { smoothScrollTo, getScrollVelocity } from '../../utils/smoothScroll';
import './creative-cta.css';

export interface CreativeCTAProps {
  id?: string;
  introPill?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  supportingText?: string;
  startProjectHref?: string;
  startProjectLabel?: string;
  viewWorkHref?: string;
  viewWorkLabel?: string;
  cardLabel?: string;
  cardTitle?: string;
  features?: string[];
  stats?: CreativeCTAStat[];
  topMarqueeItems?: string[];
  bottomMarqueeItems?: string[];
}

export const CreativeCTA: React.FC<CreativeCTAProps> = ({
  id = 'creative-cta',
  introPill = portfolioData.creativeCta.introPill,
  headlineLine1 = portfolioData.creativeCta.headlineLine1,
  headlineLine2 = portfolioData.creativeCta.headlineLine2,
  supportingText = portfolioData.creativeCta.supportingText,
  startProjectHref = portfolioData.creativeCta.startProjectHref,
  startProjectLabel = portfolioData.creativeCta.startProjectLabel || 'Start a project',
  viewWorkHref = portfolioData.creativeCta.viewWorkHref,
  viewWorkLabel = portfolioData.creativeCta.viewWorkLabel || 'View work',
  cardLabel = portfolioData.creativeCta.cardLabel,
  cardTitle = portfolioData.creativeCta.cardTitle,
  features = portfolioData.creativeCta.features,
  stats = portfolioData.creativeCta.stats,
  topMarqueeItems = portfolioData.creativeCta.topMarqueeItems,
  bottomMarqueeItems = portfolioData.creativeCta.bottomMarqueeItems,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ctaButtonsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const topTrackRef = useRef<HTMLDivElement>(null);
  const bottomTrackRef = useRef<HTMLDivElement>(null);

  // Velocity-driven GSAP marquee loop
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const topTrack = topTrackRef.current;
    const bottomTrack = bottomTrackRef.current;
    if (!topTrack || !bottomTrack) return;

    const topTween = gsap.to(topTrack, {
      xPercent: -50,
      repeat: -1,
      duration: 30,
      ease: 'none',
    });

    const bottomTween = gsap.fromTo(
      bottomTrack,
      { xPercent: -50 },
      {
        xPercent: 0,
        repeat: -1,
        duration: 34,
        ease: 'none',
      }
    );

    const baseSpeed = 1;
    let currentSpeed = 1;

    const ticker = () => {
      const vel = getScrollVelocity();
      // Calculate speed proportional to scroll velocity
      const targetSpeed = baseSpeed + Math.min(Math.abs(vel) * 0.18, 6);
      // Ease back smoothly to base speed
      currentSpeed += (targetSpeed - currentSpeed) * 0.08;

      // Flip direction with scroll direction
      const dir = vel < -0.15 ? -1 : 1;
      topTween.timeScale(currentSpeed * dir);
      bottomTween.timeScale(currentSpeed * dir);
    };

    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
      topTween.kill();
      bottomTween.kill();
    };
  }, []);

  // GSAP ScrollTrigger coordinated entrance animation
  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      const headingLines = headingRef.current?.querySelectorAll('.creative-cta-line');

      tl.from(pillRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power3.out',
      });

      if (headingLines && headingLines.length > 0) {
        tl.from(
          headingLines,
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=0.25'
        );
      }

      tl.from(
        textRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.35'
      )
        .from(
          ctaButtonsRef.current,
          {
            opacity: 0,
            y: 18,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.35'
        )
        .from(
          cardRef.current,
          {
            opacity: 0,
            y: 32,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.45'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Smooth scroll handler for anchor links
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(href, { offset: -40 });
    }
  };

  // Build repeated text strings for seamless looping
  const topMarqueeString = topMarqueeItems.join(' / ') + ' / ';
  const bottomMarqueeString = bottomMarqueeItems.join(' / ') + ' / ';

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative flex min-h-140 w-full items-center overflow-hidden bg-[#161616] py-10 sm:py-16 text-[#e5e3dc] lg:min-h-screen lg:py-0 selection:bg-[#bf4a1a] selection:text-white max-w-full"
      aria-label="Creative Call To Action"
    >
      {/* 1. Ambient Background Gradients */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(191,74,26,0.28),transparent_28%),linear-gradient(135deg,rgba(229,227,220,0.08),transparent_34%)]"
        aria-hidden="true"
      />

      {/* 2. Inset Decorative Border */}
      <div
        className="pointer-events-none absolute inset-5 rounded-[30px] md:border md:border-[#e5e3dc]/10"
        aria-hidden="true"
      />

      {/* 3. Top Diagonal Marquee Strip (Cream/Off-White) */}
      <div
        className="creative-cta-marquee-strip pointer-events-none absolute left-1/2 top-10 w-[140vw] -translate-x-1/2 rotate-[7deg] border-y border-[#e5e3dc]/10 bg-[#e5e3dc]/8 py-3.5 block z-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        <div ref={topTrackRef} className="creative-cta-marquee-track-left whitespace-nowrap font-['Big_Shoulders_Display',sans-serif] text-[36px] sm:text-[44px] font-semibold uppercase leading-none text-[#e5e3dc]/40">
          <span className="px-6">{topMarqueeString}</span>
          <span className="px-6">{topMarqueeString}</span>
          <span className="px-6">{topMarqueeString}</span>
          <span className="px-6">{topMarqueeString}</span>
          <span className="px-6">{topMarqueeString}</span>
          <span className="px-6">{topMarqueeString}</span>
        </div>
      </div>

      {/* 4. Bottom Diagonal Marquee Strip (Burnt Orange) */}
      <div
        className="creative-cta-marquee-strip pointer-events-none absolute bottom-14 left-1/2 w-[140vw] -translate-x-1/2 -rotate-6 border-y border-[#bf4a1a]/25 bg-[#bf4a1a]/12 py-3.5 block z-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        <div ref={bottomTrackRef} className="creative-cta-marquee-track-right whitespace-nowrap font-['Big_Shoulders_Display',sans-serif] text-[36px] sm:text-[44px] font-semibold uppercase leading-none text-[#bf4a1a]/80">
          <span className="px-6">{bottomMarqueeString}</span>
          <span className="px-6">{bottomMarqueeString}</span>
          <span className="px-6">{bottomMarqueeString}</span>
          <span className="px-6">{bottomMarqueeString}</span>
          <span className="px-6">{bottomMarqueeString}</span>
          <span className="px-6">{bottomMarqueeString}</span>
        </div>
      </div>

      {/* 5. Main Content Grid Container */}
      <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-6 sm:py-10 lg:py-20">
        <div className="grid items-end gap-10 lg:gap-12 lg:grid-cols-[1fr_420px]">
          {/* Left Column: Heading, Supporting Text & CTAs */}
          <div className="flex flex-col items-start">
            {/* Introductory Pill */}
            <div
              ref={pillRef}
              className="inline-flex items-center gap-3 rounded-full border border-[#e5e3dc]/15 bg-[#e5e3dc]/8 px-4 py-2 font-['Poppins'] text-xs font-bold uppercase text-[#e5e3dc]/70 backdrop-blur shadow-sm"
            >
              <span className="size-2 rounded-full bg-[#bf4a1a] shadow-[0_0_20px_rgba(191,74,26,0.9)]" />
              <span>{introPill}</span>
            </div>

            {/* Oversized Condensed Headline with Masked Reveal */}
            <h2
              ref={headingRef}
              className="mt-5 sm:mt-7 max-w-5xl font-['Big_Shoulders_Display',sans-serif] text-[32px] sm:text-[52px] md:text-[80px] lg:text-[132px] font-semibold uppercase leading-[0.9] text-[#e5e3dc] tracking-tight"
            >
              <span className="block overflow-hidden pb-1">
                <span className="creative-cta-line inline-block">{headlineLine1}</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="creative-cta-line inline-block">{headlineLine2}</span>
              </span>
            </h2>

            {/* Supporting Copy */}
            <p
              ref={textRef}
              className="mt-4 sm:mt-7 max-w-2xl font-['Poppins'] text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed md:leading-8 text-[#e5e3dc]/68"
            >
              {supportingText}
            </p>

            {/* CTA Buttons */}
            <div
              ref={ctaButtonsRef}
              className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row w-full sm:w-auto"
            >
              {/* Button 1: Start A Project / View The Spot Exam */}
              <a
                href={startProjectHref}
                target={startProjectHref.startsWith('http') ? '_blank' : undefined}
                rel={startProjectHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleSmoothScroll(e, startProjectHref)}
                className="group inline-flex min-h-11 sm:min-h-13 items-center justify-center gap-2.5 sm:gap-3 rounded-full bg-[#e5e3dc] px-6 sm:px-7 font-['Poppins'] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#161616] transition-all duration-300 hover:bg-white hover:text-[#161616] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-md hover-this"
              >
                <span>{startProjectLabel}</span>
                <ArrowUpRight
                  size={18}
                  className="transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              {/* Button 2: View Work / View All Projects */}
              <a
                href={viewWorkHref}
                target={viewWorkHref.startsWith('http') ? '_blank' : undefined}
                rel={viewWorkHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleSmoothScroll(e, viewWorkHref)}
                className="group inline-flex min-h-11 sm:min-h-13 items-center justify-center gap-2.5 sm:gap-3 rounded-full border border-[#e5e3dc]/25 px-6 sm:px-7 font-['Poppins'] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#e5e3dc] transition duration-300 hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover-this"
              >
                <span>{viewWorkLabel}</span>
                <ArrowUpRight
                  size={18}
                  className="transition duration-300 group-hover:rotate-45"
                />
              </a>
            </div>
          </div>

          {/* Right Column: Project Fit Summary Card */}
          <div
            ref={cardRef}
            className="rounded-[26px] border border-[#e5e3dc]/12 bg-[#e5e3dc]/8 p-5 sm:p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between gap-5 border-b border-[#e5e3dc]/10 pb-5">
              <div>
                <p className="font-['Poppins'] text-xs font-bold uppercase tracking-wider text-[#bf4a1a]">
                  {cardLabel}
                </p>
                <h3 className="mt-2 font-['Big_Shoulders_Display',sans-serif] text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-none text-[#e5e3dc]">
                  {cardTitle}
                </h3>
              </div>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, '#contact')}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#161616] text-[#e5e3dc] border border-[#e5e3dc]/20 hover:bg-[#e5e3dc] hover:text-[#161616] hover:scale-105 transition-all duration-300 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white hover-this"
                aria-label="Contact for project fit"
              >
                <Mail size={20} strokeWidth={2} />
              </a>
            </div>

            {/* Feature Rows */}
            <ul className="mt-5 grid gap-3" aria-label="Feature deliverables">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 rounded-2xl border border-[#e5e3dc]/10 bg-[#e5e3dc]/[0.07] px-4 py-3 font-['Poppins'] text-sm font-semibold text-[#e5e3dc]/76"
                >
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-[#bf4a1a]"
                    strokeWidth={2.2}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Three Compact Stats */}
            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#e5e3dc]/10 bg-black/25 p-2.5 sm:p-4 text-center sm:text-left"
                >
                  <strong className="block font-['Big_Shoulders_Display',sans-serif] text-2xl sm:text-3xl md:text-4xl font-semibold leading-none text-[#e5e3dc]">
                    {stat.value}
                  </strong>
                  <span className="mt-1.5 sm:mt-2 block font-['Poppins'] text-[9px] sm:text-[11px] font-semibold uppercase leading-tight sm:leading-4 text-[#e5e3dc]/52">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreativeCTA;
