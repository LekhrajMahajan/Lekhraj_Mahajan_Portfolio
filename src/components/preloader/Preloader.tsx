import React, { useEffect, useRef, useState } from 'react';
import { gsap, Flip, SplitText } from '../../utils/gsapSetup';
import { prefersReducedMotion, isAuditBot } from '../../utils/motion';
import './preloader.css';
import type { PreloaderProps } from './preloader.types';

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  onExitStart,
  brandTitle = 'Lekhraj Mahajan',
  firstName = 'LEKHRAJ',
  lastName = 'MAHAJAN',
  tagline = 'PORTFOLIO LOADING',
  statusText = 'PREPARING INTERFACE',
  maxTimeoutMs = 5500,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [ariaProgress, setAriaProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>(statusText);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(() => {
    return typeof document !== 'undefined' ? !document.fonts : true;
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const nameStackRef = useRef<HTMLDivElement>(null);
  const footerMetaRef = useRef<HTMLDivElement>(null);

  // Stable callback refs
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const onExitStartRef = useRef(onExitStart);
  useEffect(() => {
    onExitStartRef.current = onExitStart;
  }, [onExitStart]);

  const resolvedFirst = (
    firstName ||
    (brandTitle.includes(' ') ? brandTitle.split(' ')[0] : brandTitle)
  ).toUpperCase();

  const resolvedLast = (
    lastName ||
    (brandTitle.includes(' ') ? brandTitle.split(' ').slice(1).join(' ') : '')
  ).toUpperCase();

  useEffect(() => {
    // 1. Audit bot instant skip
    if (isAuditBot()) {
      document.documentElement.classList.remove('scroll-hide');
      document.body.classList.remove('scroll-hide');
      onExitStartRef.current?.();
      onCompleteRef.current?.();
      return;
    }

    // 2. Prevent scrolling while preloader is active
    document.documentElement.classList.add('scroll-hide');
    document.body.classList.add('scroll-hide');

    // 3. Reduced motion fast-path
    if (prefersReducedMotion()) {
      onExitStartRef.current?.();
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.25,
        delay: 0.1,
        ease: 'power2.out',
        onComplete: () => {
          document.documentElement.classList.remove('scroll-hide');
          document.body.classList.remove('scroll-hide');
          onCompleteRef.current?.();
        },
      });
      return;
    }

    // 4. Repeat visit check: sessionStorage['portfolio-preloader-seen']
    const hasSeen =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('portfolio-preloader-seen') === 'true';

    // 5. Unhide name as soon as fonts are ready
    if (document.fonts) {
      document.fonts.ready
        .then(() => {
          setFontsLoaded(true);
        })
        .catch(() => {
          setFontsLoaded(true);
        });
    }

    // Fallback font load safety after 300ms
    const fontFallbackTimer = setTimeout(() => {
      setFontsLoaded(true);
    }, 300);

    let isExited = false;
    let lastAriaTime = 0;
    const progressTracker = { val: 0 };

    // Smooth, calibrated duration (~3.8s) so the user can clearly see and appreciate
    // the outline-to-fill text reveal, circular arc draw, and rolling digit counter
    const duration = hasSeen ? 2.8 : 3.8;

    // Trigger SplitText entrance when name becomes visible
    const triggerNameEntrance = () => {
      if (nameStackRef.current) {
        try {
          const split = new SplitText(
            nameStackRef.current.querySelectorAll('.loader-name-outline, .loader-name-fill'),
            { type: 'lines,chars' }
          );
          gsap.from(split.chars, {
            yPercent: 110,
            opacity: 0,
            duration: 0.6,
            stagger: 0.015,
            ease: 'back.out(1.5)',
          });
        } catch {
          gsap.from(nameStackRef.current.children, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
          });
        }
      }
    };

    // Stagger entrance slightly after font ready
    const entranceTimer = setTimeout(() => {
      triggerNameEntrance();
    }, 150);

    // Guaranteed smooth progress tween that counts continuously from 0 to 100
    const progressTween = gsap.to(progressTracker, {
      val: 100,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        const p = Math.min(100, Math.round(progressTracker.val));
        setProgress(p);

        const now = Date.now();
        if (now - lastAriaTime >= 100 || p === 100) {
          lastAriaTime = now;
          setAriaProgress(p);
        }

        if (p < 35) {
          setStatus('LOADING FONTS');
        } else if (p < 85) {
          setStatus('WARMING UP THE INTERFACE');
        } else {
          setStatus('READY');
        }
      },
      onComplete: () => {
        // Dwell pause (~600ms) at 100% so user clearly perceives the completed glowing state
        setTimeout(() => {
          triggerExit();
        }, 600);
      },
    });

    // Hard safety timer
    const hardSafetyTimer = setTimeout(() => {
      if (!isExited) {
        progressTween.kill();
        setProgress(100);
        triggerExit();
      }
    }, maxTimeoutMs);

    // 6. Exit Animation Sequence with Flip into Navbar Logo
    const triggerExit = () => {
      if (isExited) return;
      isExited = true;
      clearTimeout(hardSafetyTimer);

      // Record seen state on exit completion
      sessionStorage.setItem('portfolio-preloader-seen', 'true');

      const exitTl = gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove('scroll-hide');
          document.body.classList.remove('scroll-hide');
          onCompleteRef.current?.();
        },
      });

      // Fire onExitStart ~40% into the 0.9s exit (~0.36s) to overlap Hero entrance
      exitTl.call(() => {
        onExitStartRef.current?.();
      }, [], 0.36);

      // Check for Navbar Logo element for Flip transition
      const logoEl = document.querySelector('[data-brand-logo]') as HTMLElement | null;
      const isDesktopFine =
        window.innerWidth >= 768 &&
        window.matchMedia('(pointer: fine)').matches;

      if (!hasSeen && logoEl && isDesktopFine && nameStackRef.current) {
        try {
          logoEl.style.opacity = '0';

          Flip.fit(nameStackRef.current, logoEl, {
            duration: 0.9,
            ease: 'power4.inOut',
            scale: true,
            absolute: true,
            onComplete: () => {
              logoEl.style.opacity = '1';
              if (nameStackRef.current) {
                nameStackRef.current.style.display = 'none';
              }
            },
          });
        } catch {
          if (logoEl) logoEl.style.opacity = '1';
        }
      } else if (logoEl) {
        logoEl.style.opacity = '1';
      }

      // Rings and orbit fade + scale out
      if (orbitRef.current) {
        exitTl.to(
          orbitRef.current,
          {
            scale: 1.15,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          0
        );
      }

      // Footer counter & status fade out
      if (footerMetaRef.current) {
        exitTl.to(
          footerMetaRef.current,
          {
            opacity: 0,
            y: 18,
            duration: 0.35,
            ease: 'power2.inOut',
          },
          0
        );
      }

      // Curtain wipe up
      if (revealRef.current) {
        exitTl.to(
          revealRef.current,
          {
            yPercent: -100,
            duration: 0.65,
            ease: 'power4.inOut',
          },
          0.15
        );
      }

      if (rootRef.current) {
        exitTl.to(
          rootRef.current,
          {
            yPercent: -100,
            duration: 0.75,
            ease: 'power4.inOut',
          },
          0.18
        );
      }
    };

    return () => {
      clearTimeout(fontFallbackTimer);
      clearTimeout(entranceTimer);
      clearTimeout(hardSafetyTimer);
      progressTween.kill();
    };
  }, [brandTitle, firstName, lastName, maxTimeoutMs]);

  // Digits for rolling counter (0-9 columns)
  const hDigit = Math.floor(progress / 100);
  const tDigit = Math.floor((progress % 100) / 10);
  const oDigit = progress % 10;

  // SVG Ring Calculations (Radius 195, Circumference ~1225.22)
  const radius = 195;
  const circumference = 2 * Math.PI * radius; // 1225.22
  const strokeOffset = circumference * (1 - progress / 100);
  const angleDegrees = (progress / 100) * 360;

  return (
    <div
      ref={rootRef}
      className="loader"
      role="progressbar"
      aria-label="Portfolio Loading Progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={ariaProgress}
      tabIndex={-1}
    >
      <div className="loader-bg" aria-hidden="true" />
      <div ref={revealRef} className="loader-reveal" aria-hidden="true" />

      <div ref={shellRef} className="loader-shell">
        {/* SVG Synced Rings */}
        <div ref={orbitRef} className="loader-orbit-wrap" aria-hidden="true">
          <svg
            className="loader-orbit-svg"
            viewBox="0 0 440 440"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="loader-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#bf4a1a" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* Base subtle outer track */}
            <circle
              cx="220"
              cy="220"
              r={radius}
              stroke="rgba(229, 227, 220, 0.08)"
              strokeWidth="2"
              fill="none"
            />

            {/* Active Progress Outer Ring (Burnt Orange) */}
            <circle
              cx="220"
              cy="220"
              r={radius}
              stroke="#bf4a1a"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              transform="rotate(-90 220 220)"
            />

            {/* Glowing Orange Dot Sitting at the Arc Tip */}
            <g
              style={{
                transform: `rotate(${angleDegrees}deg)`,
                transformOrigin: '220px 220px',
                transition: 'transform 0.08s linear',
              }}
            >
              <circle
                cx="220"
                cy={220 - radius}
                r="5"
                fill="#bf4a1a"
                className="loader-tip-dot"
              />
            </g>

            {/* Thin dashed inner ring with slow counter-rotation */}
            <circle
              cx="220"
              cy="220"
              r={165}
              stroke="rgba(229, 227, 220, 0.16)"
              strokeWidth="1"
              strokeDasharray="4 8"
              fill="none"
              className="loader-inner-ring"
            />
          </svg>
        </div>

        {/* Central Brand Typography (Outline -> Solid Fill bottom-to-top) */}
        <div className="loader-brand">
          <p className="loader-tagline">{tagline}</p>

          <div
            ref={nameStackRef}
            className="loader-title-stack"
            style={{ visibility: fontsLoaded ? 'visible' : 'hidden' }}
          >
            {/* First Name Line */}
            <div className="loader-name-line">
              <span className="loader-name-outline">{resolvedFirst}</span>
              <span
                className="loader-name-fill"
                style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
              >
                {resolvedFirst}
              </span>
            </div>

            {/* Last Name Line */}
            {resolvedLast && (
              <div className="loader-name-line">
                <span className="loader-name-outline">{resolvedLast}</span>
                <span
                  className="loader-name-fill"
                  style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
                >
                  {resolvedLast}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Meta: Status on Left, Rolling Counter on Right */}
        <div ref={footerMetaRef} className="loader-footer-meta">
          {/* Status text */}
          <div className="loader-status-container">
            <span className="loader-status-text">{status}</span>
          </div>

          {/* Large Rolling-Digit Counter (3 digit columns 0-9) */}
          <div className="loader-counter-wrap" aria-hidden="true">
            {/* Hundreds Column */}
            <div className="loader-digit-col">
              <div
                className="loader-digit-strip"
                style={{ transform: `translateY(-${hDigit * 10}%)` }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <span key={n} className="loader-digit-val">
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Tens Column */}
            <div className="loader-digit-col">
              <div
                className="loader-digit-strip"
                style={{ transform: `translateY(-${tDigit * 10}%)` }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <span key={n} className="loader-digit-val">
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Ones Column */}
            <div className="loader-digit-col">
              <div
                className="loader-digit-strip"
                style={{ transform: `translateY(-${oDigit * 10}%)` }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <span key={n} className="loader-digit-val">
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <span className="loader-counter-pct">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
