import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';
import { Logo } from '../navbar/Logo';
import { contactData } from '../../data/contact';
import { portfolioData } from '../../data/portfolio';
import { triggerResumeDownload } from '../../utils/downloadResume';
import { smoothScrollTo } from '../../utils/smoothScroll';
import './footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cols = gridRef.current?.children;
      if (cols && cols.length > 0) {
        gsap.fromTo(
          Array.from(cols),
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.75,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (href === '#home' || href === '#') {
        smoothScrollTo(0);
      } else {
        smoothScrollTo(href, { offset: -40 });
      }
    }
  };

  const handleInfoModal = (title: string, description: string) => {
    setModalContent({ title, description });
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full border-t border-[#161616]/12 bg-topo-pattern text-[#161616] pt-16 sm:pt-20 pb-8 overflow-hidden"
      aria-label="Site footer"
    >
      {/* Background Organic Sand Contours & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft Left Ambient Organic Blob */}
        <div className="absolute -left-32 top-10 size-96 rounded-full bg-[#161616]/3 blur-3xl" />
        {/* Soft Right Ambient Organic Blob */}
        <div className="absolute -right-32 bottom-10 size-96 rounded-full bg-[#bf4a1a]/5 blur-3xl" />

        {/* Topographic Contour Lines SVG Pattern */}
        <svg
          className="absolute inset-0 size-full opacity-15 stroke-[#161616]/40 fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M-100,120 C200,60 400,240 800,140 C1200,40 1400,200 1800,120" strokeWidth="1" />
          <path d="M-100,220 C250,160 500,320 900,220 C1300,120 1500,280 1900,180" strokeWidth="1" />
          <path d="M-100,320 C300,260 600,400 1000,300 C1400,200 1600,360 2000,260" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative max-w-384 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Editorial Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 lg:pb-18">
          {/* Column 1: L Logo & Brand Identification */}
          <div className="flex flex-col items-start">
            {/* Custom Geometric "L" Lettermark Logo for Lekhraj */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="group inline-block transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bf4a1a] rounded-xl hover-this"
              aria-label="Back to home with Lekhraj brand logo"
            >
              <Logo className="w-24 sm:w-28 md:w-32 h-auto text-[#161616] transition-colors duration-300" />
            </a>

            <p className="mt-6 font-['Poppins'] text-xs sm:text-sm text-[#161616]/70 leading-relaxed max-w-45">
              &copy;{currentYear} Portfolio By Lekhraj.
            </p>
          </div>

          {/* Column 2: LINKS */}
          <div className="flex flex-col items-start">
            <h2 className="font-['Big_Shoulders_Display',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-[#161616] tracking-wide mb-6">
              LINKS
            </h2>
            <ul className="flex flex-col gap-3.5 font-['Poppins'] text-xs sm:text-sm font-semibold uppercase text-[#161616]/75">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleInfoModal(
                      'Support & Inquiries',
                      'For project consultations, full-time engineering inquiries, or technical support, please reach out directly at lekhrajmahajan506@gmail.com.'
                    )
                  }
                  className="hover:text-[#161616] hover:underline transition-colors cursor-pointer text-left"
                >
                  SUPPORT
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleInfoModal(
                      'Open Source Licenses',
                      'All open source projects and demonstrative code published by Lekhraj Mahajan are licensed under the MIT License unless explicitly stated otherwise.'
                    )
                  }
                  className="hover:text-[#161616] hover:underline transition-colors cursor-pointer text-left"
                >
                  LICENSES
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleInfoModal(
                      'Terms of Use',
                      'This portfolio showcases original web development projects, UI engineering, and full-stack architecture contributions by Lekhraj Mahajan for employment and contracting purposes.'
                    )
                  }
                  className="hover:text-[#161616] hover:underline transition-colors cursor-pointer text-left"
                >
                  TERMS OF USE
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    handleInfoModal(
                      'Privacy Policy',
                      'No personal data is sold or shared. Contact inquiries submitted via this portfolio are transmitted directly to Lekhraj Mahajan for professional correspondence.'
                    )
                  }
                  className="hover:text-[#161616] hover:underline transition-colors cursor-pointer text-left"
                >
                  PRIVACY POLICY
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: PAGES */}
          <div className="flex flex-col items-start">
            <h2 className="font-['Big_Shoulders_Display',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-[#161616] tracking-wide mb-6">
              PAGES
            </h2>
            <ul className="flex flex-col gap-3.5 font-['Poppins'] text-xs sm:text-sm font-semibold uppercase text-[#161616]/75">
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, '#about')}
                  className="hover:text-[#161616] hover:underline transition-colors"
                >
                  ABOUT ME
                </a>
              </li>
              <li>
                <a
                  href="#selected-work"
                  onClick={(e) => handleNavClick(e, '#selected-work')}
                  className="hover:text-[#161616] hover:underline transition-colors"
                >
                  MY WORK
                </a>
              </li>
              <li>
                <a
                  href={portfolioData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (
                      !triggerResumeDownload(
                        portfolioData.resumeUrl,
                        'Lekhraj Resume.pdf'
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className="hover:text-[#161616] hover:underline transition-colors"
                >
                  DOWNLOAD CV
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="hover:text-[#161616] hover:underline transition-colors"
                >
                  CONTACT
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: CONTACT */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-['Big_Shoulders_Display',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-[#161616] tracking-wide">
                CONTACT
              </h2>
              {/* Decorative Burnt-Orange Cross Icon */}
              <span className="text-[#bf4a1a] text-2xl font-black select-none leading-none">
                &#10005;
              </span>
            </div>

            <div className="flex flex-col items-start gap-1.5 font-['Poppins'] text-xs sm:text-sm font-medium text-[#161616]/80 mb-6">
              <p className="uppercase tracking-wider font-semibold text-[#161616]">
                {contactData.location}
              </p>
              <a
                href={`mailto:${contactData.email}`}
                data-no-cursor="true"
                className="no-magnetic text-xs sm:text-sm font-medium text-[#161616] hover:text-[#bf4a1a] transition-colors break-all"
                aria-label={`Send email to ${contactData.email}`}
              >
                {contactData.email}
              </a>
              <a
                href={`tel:${contactData.phone.replace(/\s+/g, '')}`}
                data-no-cursor="true"
                className="no-magnetic text-xs sm:text-sm font-medium text-[#161616] hover:text-[#bf4a1a] transition-colors"
                aria-label={`Call ${contactData.phone}`}
              >
                {contactData.phone}
              </a>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-5 text-[#161616]">
              {/* GitHub */}
              <a
                href={contactData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="size-8 rounded-full bg-[#161616]/5 hover:bg-[#161616] hover:text-[#e5e3dc] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs hover-this"
                aria-label="Visit GitHub profile"
              >
                <svg viewBox="0 0 98 96" className="size-4 fill-current" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.215-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={contactData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="size-8 rounded-full bg-[#161616]/5 hover:bg-[#161616] hover:text-[#e5e3dc] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs hover-this"
                aria-label="Visit LinkedIn profile"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Email */}
              <a
                href={`mailto:${contactData.email}`}
                className="size-8 rounded-full bg-[#161616]/5 hover:bg-[#161616] hover:text-[#e5e3dc] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs hover-this"
                aria-label="Send email"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden="true">
                  <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Divider, Diagonal Lines, Copyright, Arc) */}
        <div className="relative border-t border-[#161616]/12 pt-8 flex items-center justify-between">
          {/* Left Decorative 5 Diagonal Slashes in Burnt-Orange */}
          <div className="hidden sm:flex items-center gap-2 select-none" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="inline-block w-1.5 h-6 bg-[#bf4a1a] -skew-x-25 rounded-xs"
              />
            ))}
          </div>

          {/* Center Copyright Text */}
          <div className="flex-1 text-center">
            <p className="font-['Poppins'] text-xs sm:text-sm text-[#161616]/75 font-normal tracking-wide">
              &copy;{currentYear} By Lekhraj | All rights reserved.
            </p>
          </div>

          {/* Right Decorative Semicircle Arc */}
          <div className="hidden sm:block w-24 h-12 overflow-hidden select-none pointer-events-none" aria-hidden="true">
            <div className="size-24 rounded-full border-2 border-[#bf4a1a] translate-y-2 opacity-80" />
          </div>
        </div>
      </div>

      {/* Reusable Modal Dialog for Links (Support, Licenses, Terms, Privacy) */}
      {modalContent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161616]/60 backdrop-blur-sm"
          onClick={() => setModalContent(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#161616]/15 bg-[#e5e3dc] p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="modal-title"
              className="font-['Big_Shoulders_Display',sans-serif] text-2xl sm:text-3xl font-extrabold uppercase text-[#161616] tracking-tight"
            >
              {modalContent.title}
            </h3>
            <p className="mt-3 font-['Poppins'] text-xs sm:text-sm text-[#161616]/80 leading-relaxed">
              {modalContent.description}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="rounded-full bg-[#161616] px-6 py-2 font-['Poppins'] text-xs font-bold uppercase tracking-wider text-[#e5e3dc] hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
