import React, { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsapSetup';
import { prefersReducedMotion } from '../../utils/motion';

const getElementFromTarget = (target: EventTarget | null): HTMLElement | null => {
  if (!target) return null;
  if (target instanceof HTMLElement) return target;
  if (target instanceof Element) return target as HTMLElement;
  if ('parentElement' in target && (target as Node).parentElement) {
    return (target as Node).parentElement as HTMLElement;
  }
  return null;
};

/**
 * Custom Animated Cursor with Magnetic Snapping & Difference Blend-Mode.
 * Features:
 * - Fluid lagging outer circle and snappy inner dot.
 * - Circular difference blend lens over interactive buttons, links, and nav items (identical to Logo hover).
 * - Smooth magnetic attraction on nav links, buttons, and social icons.
 * - Seamlessly yields to the Optical Magnifying Glass in the project text zones.
 */
export const CustomCursor: React.FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;

    if (!outer || !inner || typeof window === 'undefined') return;

    // Only enable on devices with a fine pointer (mouse/trackpad), not touchscreens, and respect reduced motion
    const isFinePointer =
      window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion()) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    document.body.classList.add('custom-cursor-active');

    // Initial position off-screen until first movement
    gsap.set([outer, inner], {
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
    });

    // High performance GSAP quickTo setters for 60-120fps tracking
    const xToOuter = gsap.quickTo(outer, 'x', {
      duration: 0.22,
      ease: 'power2.out',
    });
    const yToOuter = gsap.quickTo(outer, 'y', {
      duration: 0.22,
      ease: 'power2.out',
    });
    const xToInner = gsap.quickTo(inner, 'x', {
      duration: 0.08,
      ease: 'power2.out',
    });
    const yToInner = gsap.quickTo(inner, 'y', {
      duration: 0.08,
      ease: 'power2.out',
    });

    let isVisible = false;
    let currentHoverMode: 'none' | 'expand' | 'icon' | 'hidden' = 'none';
    let activeMagneticEl: HTMLElement | null = null;

    const showCursor = () => {
      if (!isVisible) {
        isVisible = true;
        if (currentHoverMode === 'none') {
          gsap.to([outer, inner], { opacity: 1, duration: 0.2 });
        } else if (currentHoverMode === 'expand' || currentHoverMode === 'icon') {
          gsap.to(outer, { opacity: 1, duration: 0.2 });
          gsap.to(inner, { opacity: 0, duration: 0.2 });
        }
      }
    };

    const hideCursor = () => {
      if (isVisible) {
        isVisible = false;
        gsap.to([outer, inner], { opacity: 0, duration: 0.2 });
      }
      if (activeMagneticEl) {
        gsap.to(activeMagneticEl, {
          x: 0,
          y: 0,
          duration: 0.45,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });
        activeMagneticEl = null;
      }
    };

    // Hover effect animations (Matches Logo hover: expands white circle with difference blend mode)
    const setExpandState = () => {
      currentHoverMode = 'expand';
      gsap.to(outer, {
        scale: 2.15,
        opacity: 1,
        backgroundColor: '#ffffff',
        borderColor: 'transparent',
        mixBlendMode: 'difference',
        duration: 0.22,
        ease: 'power2.out',
      });
      gsap.to(inner, {
        scale: 0.2,
        opacity: 0,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    const setIconState = () => {
      currentHoverMode = 'icon';
      gsap.to(outer, {
        scale: 1.6,
        opacity: 1,
        backgroundColor: '#ffffff',
        borderColor: 'transparent',
        mixBlendMode: 'difference',
        duration: 0.22,
        ease: 'power2.out',
      });
      gsap.to(inner, {
        scale: 0.2,
        opacity: 0,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    const setHiddenState = () => {
      currentHoverMode = 'hidden';
      gsap.to([outer, inner], {
        opacity: 0,
        scale: 0.2,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    const setNormalState = () => {
      currentHoverMode = 'none';
      gsap.to(outer, {
        scale: 1,
        opacity: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(34, 40, 49, 0.45)',
        mixBlendMode: 'normal',
        duration: 0.22,
        ease: 'power2.out',
      });
      gsap.to(inner, {
        scale: 1,
        opacity: 1,
        backgroundColor: '#bf4a1a',
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      showCursor();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Inner snappy dot tracks mouse 1:1
      xToInner(mouseX);
      yToInner(mouseY);

      const rawTarget = getElementFromTarget(e.target);

      // 1. If cursor is inside the Project Text Magnifier Zone, hide global cursor to show optical lens
      if (rawTarget?.closest('[data-magnify-zone="true"]')) {
        if (activeMagneticEl) {
          gsap.to(activeMagneticEl, {
            x: 0,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          activeMagneticEl = null;
        }
        if (currentHoverMode !== 'hidden') {
          setHiddenState();
        }
        xToOuter(mouseX);
        yToOuter(mouseY);
        return;
      }

      // 2. Hide custom cursor over form inputs, textareas, contact form fields, and actively selected text
      const selection = window.getSelection();
      const isSelectingText = selection && !selection.isCollapsed && selection.toString().trim().length > 0;
      const isFormFieldOrNoCursor = rawTarget?.closest(
        'input, textarea, select, [contenteditable], [data-no-cursor="true"], .no-cursor, .contact-field-wrap'
      );

      if (isSelectingText || isFormFieldOrNoCursor) {
        if (activeMagneticEl) {
          gsap.to(activeMagneticEl, {
            x: 0,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          activeMagneticEl = null;
        }
        if (currentHoverMode !== 'hidden') {
          setHiddenState();
        }
        xToOuter(mouseX);
        yToOuter(mouseY);
        return;
      }

      // 3. If pointer is over an element explicitly opting out of cursor lens & magnetic effects
      if (rawTarget?.closest('.no-magnetic')) {
        if (activeMagneticEl) {
          gsap.to(activeMagneticEl, {
            x: 0,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          activeMagneticEl = null;
        }
        if (currentHoverMode !== 'none') {
          setNormalState();
        }
        xToOuter(mouseX);
        yToOuter(mouseY);
        return;
      }

      // 4. Check if hovering an interactive button, link, or clickable element (excluding elements opting out)
      const interactiveTarget = rawTarget?.closest<HTMLElement>(
        'button:not([data-no-cursor="true"]):not(.no-magnetic), a:not([data-no-cursor="true"]):not(.no-magnetic), .group\\/btn:not([data-no-cursor="true"]):not(.no-magnetic), [role="button"]:not([data-no-cursor="true"]):not(.no-magnetic), .hover-this:not([data-no-cursor="true"]):not(.no-magnetic), .hover-icon, .hero-social-btn, .hero-social-link, .nav-contact-btn, .nav-link-item'
      );

      if (interactiveTarget) {
        if (activeMagneticEl && activeMagneticEl !== interactiveTarget) {
          gsap.to(activeMagneticEl, {
            x: 0,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        activeMagneticEl = interactiveTarget;

        const rect = interactiveTarget.getBoundingClientRect();
        const currentX = (gsap.getProperty(interactiveTarget, 'x') as number) || 0;
        const currentY = (gsap.getProperty(interactiveTarget, 'y') as number) || 0;
        const naturalCenterX = rect.left + rect.width / 2 - currentX;
        const naturalCenterY = rect.top + rect.height / 2 - currentY;
        const deltaX = mouseX - naturalCenterX;
        const deltaY = mouseY - naturalCenterY;

        const isIcon =
          interactiveTarget.classList.contains('hover-icon') ||
          interactiveTarget.classList.contains('hero-social-btn') ||
          interactiveTarget.classList.contains('hero-social-link');
        const maxDistX = isIcon ? 20 : 26;
        const maxDistY = isIcon ? 20 : 20;
        const pullFactor = isIcon ? 0.45 : 0.42;

        const pullX = Math.max(-maxDistX, Math.min(maxDistX, deltaX * pullFactor));
        const pullY = Math.max(-maxDistY, Math.min(maxDistY, deltaY * pullFactor));

        gsap.to(interactiveTarget, {
          x: pullX,
          y: pullY,
          duration: 0.18,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        const snapFactor = isIcon ? 0.6 : 0.35;
        const targetCursorX = mouseX - deltaX * snapFactor;
        const targetCursorY = mouseY - deltaY * snapFactor;

        xToOuter(targetCursorX);
        yToOuter(targetCursorY);
        return;
      }

      // Spring back any previously magnetic element that is no longer hovered
      if (activeMagneticEl) {
        gsap.to(activeMagneticEl, {
          x: 0,
          y: 0,
          duration: 0.45,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });
        activeMagneticEl = null;
      }

      // 4. Everywhere else: normal state
      if (currentHoverMode !== 'none') {
        setNormalState();
      }
      xToOuter(mouseX);
      yToOuter(mouseY);
    };

    // Check hovered target for visual cursor state
    const handlePointerOver = (e: PointerEvent) => {
      const target = getElementFromTarget(e.target);
      if (!target) return;

      // Hide custom cursor over form inputs, textareas, contact form fields, and elements opting out
      if (
        target.closest(
          'input, textarea, select, [contenteditable], [data-no-cursor="true"], .no-cursor, .contact-field-wrap'
        )
      ) {
        setHiddenState();
        return;
      }

      // Check if inside project text magnifying zone
      if (target.closest('[data-magnify-zone="true"]')) {
        setHiddenState();
        return;
      }

      if (target.closest('.no-magnetic')) {
        setNormalState();
        return;
      }

      // Interactive button / link / nav link / social icon (Exact same as Logo)
      const interactive = target.closest<HTMLElement>(
        'button:not([data-no-cursor="true"]):not(.no-magnetic), a:not([data-no-cursor="true"]):not(.no-magnetic), .group\\/btn:not([data-no-cursor="true"]):not(.no-magnetic), [role="button"]:not([data-no-cursor="true"]):not(.no-magnetic), .hover-this:not([data-no-cursor="true"]):not(.no-magnetic), .hover-icon, .hero-social-btn, .hero-social-link, .nav-contact-btn, .nav-link-item'
      );
      if (interactive) {
        const isIcon =
          interactive.classList.contains('hover-icon') ||
          interactive.classList.contains('hero-social-btn') ||
          interactive.classList.contains('hero-social-link');
        if (isIcon) {
          setIconState();
        } else {
          setExpandState();
        }
        return;
      }

      setNormalState();
    };

    const handlePointerOut = (e: PointerEvent) => {
      const target = getElementFromTarget(e.target);
      if (!target) return;

      if (
        target.closest(
          'input, textarea, select, [contenteditable], [data-no-cursor="true"], .no-cursor, .contact-field-wrap'
        )
      ) {
        setNormalState();
        return;
      }

      const interactive = target.closest<HTMLElement>(
        'button:not([data-no-cursor="true"]):not(.no-magnetic), a:not([data-no-cursor="true"]):not(.no-magnetic), .hover-this:not([data-no-cursor="true"]):not(.no-magnetic), .hover-icon, [role="button"]:not([data-no-cursor="true"]):not(.no-magnetic), .hero-contact-button, .hero-download-cv, .hero-social-btn, .hero-social-link, .nav-contact-btn, .nav-link-item'
      );

      if (interactive) {
        if (e.relatedTarget && interactive.contains(e.relatedTarget as Node)) {
          return;
        }

        setNormalState();
        gsap.to(interactive, {
          x: 0,
          y: 0,
          duration: 0.45,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });
        if (activeMagneticEl === interactive) {
          activeMagneticEl = null;
        }
      }
    };

    // Click feedback
    const handleMouseDown = () => {
      if (currentHoverMode === 'expand') {
        gsap.to(outer, { scale: 1.8, duration: 0.12, ease: 'power2.out' });
      } else if (currentHoverMode === 'icon') {
        gsap.to(outer, { scale: 1.3, duration: 0.12, ease: 'power2.out' });
      } else if (currentHoverMode !== 'hidden') {
        gsap.to(outer, { scale: 0.75, duration: 0.12, ease: 'power2.out' });
        gsap.to(inner, { scale: 0.5, duration: 0.08, ease: 'power2.out' });
      }
    };

    const handleMouseUp = () => {
      if (currentHoverMode === 'expand') {
        gsap.to(outer, { scale: 2.15, duration: 0.18, ease: 'power2.out' });
      } else if (currentHoverMode === 'icon') {
        gsap.to(outer, { scale: 1.5, duration: 0.18, ease: 'power2.out' });
      } else if (currentHoverMode !== 'hidden') {
        gsap.to(outer, { scale: 1, duration: 0.18, ease: 'power2.out' });
        gsap.to(inner, { scale: 1, duration: 0.15, ease: 'power2.out' });
      }
    };

    const handleMouseLeave = () => {
      hideCursor();
    };

    const handleMouseEnter = () => {
      showCursor();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerout', handlePointerOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (activeMagneticEl) {
        gsap.set(activeMagneticEl, { x: 0, y: 0 });
      }
    };
  }, []);

  return (
    <>
      {/* Outer tracking ring (expands into difference lens over interactive targets) */}
      <div
        ref={outerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none rounded-full z-99999 will-change-transform border border-[#222831a8] hidden md:block"
        style={{
          width: 40,
          height: 40,
          opacity: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      />

      {/* Inner precise dot */}
      <div
        ref={innerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none rounded-full z-100000 will-change-transform bg-[#bf4a1a] hidden md:block"
        style={{
          width: 7,
          height: 7,
          opacity: 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
