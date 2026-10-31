import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsapSetup';
import { prefersReducedMotion } from './motion';

let lenisInstance: Lenis | null = null;
const listeners = new Set<(progress: number, scrollY: number) => void>();
let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Initializes Lenis smooth momentum scrolling and synchronizes it with GSAP ScrollTrigger.
 */
export const initSmoothScroll = (): (() => void) => {
  // If reduced motion is requested, do not initialize smooth inertia scroll
  if (prefersReducedMotion()) {
    return () => {};
  }

  // Destroy any existing instance before creating a new one
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.0,
    infinite: false,
  });

  lenisInstance = lenis;

  // Synchronize Lenis scroll with GSAP ScrollTrigger
  lenis.on('scroll', (e: { progress: number; scroll: number }) => {
    ScrollTrigger.update();
    const progress = Math.min(100, Math.max(0, (e.progress || 0) * 100));
    const scrollY = e.scroll || 0;
    listeners.forEach((callback) => callback(progress, scrollY));
  });

  // Drive Lenis from GSAP's high-precision RAF ticker
  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tickerCallback);
    lenis.destroy();
    lenisInstance = null;
  };
};

/**
 * Returns the current Lenis scroll velocity.
 */
export const getScrollVelocity = (): number => {
  return lenisInstance?.velocity || 0;
};

/**
 * Get current Lenis instance
 */
export const getLenis = (): Lenis | null => lenisInstance;

/**
 * Single debounced recalculation that waits for fonts ready and images decoded
 * (capped at 2s) before updating Lenis and ScrollTrigger once.
 */
export const refreshScrollOnce = (debounceMs = 50): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();

  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  return new Promise<void>((resolve) => {
    refreshTimeout = setTimeout(async () => {
      refreshTimeout = null;

      try {
        const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();
        const images = Array.from(document.images);
        const imagePromises = images.map((img) => {
          if (img.complete) return Promise.resolve();
          if (typeof img.decode === 'function') {
            return img.decode().catch(() => {});
          }
          return new Promise<void>((res) => {
            img.onload = () => res();
            img.onerror = () => res();
          });
        });

        const timeoutPromise = new Promise<void>((res) => setTimeout(res, 2000));

        await Promise.race([
          Promise.all([fontPromise, ...imagePromises]),
          timeoutPromise,
        ]);
      } catch {
        // Continue even if font or image loading errors
      }

      if (lenisInstance) {
        lenisInstance.resize();
      }
      ScrollTrigger.refresh();
      resolve();
    }, debounceMs);
  });
};

/**
 * Recalculate scroll dimensions and refresh GSAP ScrollTrigger after layout updates
 */
export const refreshScroll = () => {
  if (lenisInstance) {
    lenisInstance.resize();
  }
  ScrollTrigger.refresh();
};

/**
 * Subscribe to scroll progress updates (0% to 100%)
 */
export const onScrollProgress = (
  callback: (progress: number, scrollY: number) => void
): (() => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

/**
 * Butter-smooth scroll to target element, selector, or Y-offset
 */
export const smoothScrollTo = (
  target: string | number | HTMLElement,
  options?: { offset?: number; duration?: number }
) => {
  const prefersReduced = prefersReducedMotion();

  if (lenisInstance && !prefersReduced) {
    lenisInstance.scrollTo(target, {
      duration: options?.duration ?? 1.2,
      offset: options?.offset ?? 0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    return;
  }

  // Fallback if Lenis is not active or reduced motion is preferred
  if (typeof window !== 'undefined') {
    if (typeof target === 'number') {
      window.scrollTo({
        top: target,
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
        });
      }
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    }
  }
};
