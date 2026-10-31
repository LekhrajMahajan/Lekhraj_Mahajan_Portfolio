import React, { useState, useEffect, useCallback, useRef } from 'react'
import { initSmoothScroll, refreshScrollOnce } from './utils/smoothScroll'
import { gsap } from './utils/gsapSetup'
import { prefersReducedMotion } from './utils/motion'
import 'lenis/dist/lenis.css'
import Preloader from './components/preloader/Preloader'
import Navbar from './components/navbar/Navbar'
import Hero from './components/hero/Hero'
import CreativeCTA from './components/creative-cta/CreativeCTA'
import About from './components/about/About'
import Skills from './components/skills/Skills'
import { portfolioData } from './data/portfolio'

import SelectedWork from './components/projects/SelectedWork'
import Contact from './components/contact/Contact'
import Footer from './components/footer/Footer'
import ScrollIndicator from './components/scroll-indicator/ScrollIndicator'
import CustomCursor from './components/common/CustomCursor'

export const App: React.FC = () => {
  // Preloader displays on initial page load and unmounts once the exit animation completes
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [heroReady, setHeroReady] = useState<boolean>(false)
  const curtainContainerRef = useRef<HTMLDivElement>(null)

  // Initialize Lenis smooth momentum scrolling synchronized with GSAP ScrollTrigger
  useEffect(() => {
    const cleanup = initSmoothScroll()
    return () => {
      cleanup()
    }
  }, [])

  // Dynamic Responsive Sticky Top Calculation for Curtain Panels
  // Guarantees that on mobile & tablet, the user scrolls through 100% of the section's content
  // ("proper dikhe") before the panel pins and the next curtain panel slides over it.
  useEffect(() => {
    const updatePanelStickyTops = () => {
      if (typeof window === 'undefined') return
      const vh = window.innerHeight
      const isDesktop = window.innerWidth >= 1024

      const panels = [
        document.querySelector<HTMLElement>('.curtain-panel--1'),
        document.querySelector<HTMLElement>('.curtain-panel--2'),
        document.querySelector<HTMLElement>('.curtain-panel--3'),
      ]

      panels.forEach((panel) => {
        if (!panel) return

        if (isDesktop) {
          panel.style.setProperty('--panel-sticky-top', '0px')
          return
        }

        // On mobile/tablet, measure the inner section height
        const section = panel.querySelector<HTMLElement>('section') || panel
        const height = section.offsetHeight

        // If the section is taller than viewport (height > vh):
        // Pin ONLY when its bottom reaches the viewport bottom (vh - 12px margin).
        // That means: stickyTop = vh - height - 12px (a negative value).
        // If it fits within viewport (height <= vh):
        // Pin at 0px.
        const diff = vh - height - 12
        const stickyTop = diff < 0 ? diff : 0
        panel.style.setProperty('--panel-sticky-top', `${stickyTop}px`)
      })
    }

    updatePanelStickyTops()

    const container = curtainContainerRef.current
    let resizeObserver: ResizeObserver | null = null

    if (container && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updatePanelStickyTops()
      })
      resizeObserver.observe(container)
      const sections = container.querySelectorAll('section')
      sections.forEach((s) => resizeObserver?.observe(s))
    }

    window.addEventListener('resize', updatePanelStickyTops, { passive: true })
    window.addEventListener('orientationchange', updatePanelStickyTops, { passive: true })

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updatePanelStickyTops)
      window.removeEventListener('orientationchange', updatePanelStickyTops)
    }
  }, [heroReady])

  // Curtain Depth Scrub: When the next panel slides over a pinned one,
  // the covered panel scrubs: scale 1 -> 0.94, y -> -3vh (desktop), scale 1 -> 0.96 (mobile/tablet).
  // Color stays pure and natural without dimming filter per user preference.
  useEffect(() => {
    if (prefersReducedMotion()) return

    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches

    const ctx = gsap.context(() => {
      const panel1 = document.querySelector('.curtain-panel--1 > section, .curtain-panel--1')
      const panel2Wrapper = document.querySelector('.curtain-panel--2')
      const panel2Content = document.querySelector('.curtain-panel--2 > section, .curtain-panel--2')
      const panel3Wrapper = document.querySelector('.curtain-panel--3')

      if (panel1 && panel2Wrapper) {
        gsap.to(panel1, {
          scale: isMobile ? 0.96 : 0.94,
          y: isMobile ? 0 : '-3vh',
          transformOrigin: 'center center',
          ease: 'none',
          scrollTrigger: {
            trigger: panel2Wrapper,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        })
      }

      if (panel2Content && panel3Wrapper) {
        gsap.to(panel2Content, {
          scale: isMobile ? 0.96 : 0.94,
          y: isMobile ? 0 : '-3vh',
          transformOrigin: 'center center',
          ease: 'none',
          scrollTrigger: {
            trigger: panel3Wrapper,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        })
      }
    }, curtainContainerRef)

    return () => ctx.revert()
  }, [heroReady])

  // Fired ~40% into the preloader exit flight to begin waking up the Hero and Navbar
  const handleExitStart = useCallback(() => {
    setHeroReady(true)
  }, [])

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false)
    refreshScrollOnce()
  }, [])

  return (
    <div className='relative min-h-screen bg-topo-pattern text-[#161616] antialiased selection:bg-[#bf4a1a] selection:text-white overflow-x-clip'>
      {/* 1. Initial Preloader Experience (unmounts after exit timeline completes) */}
      {isLoading && (
        <Preloader
          firstName={portfolioData.firstName.toUpperCase()}
          lastName={portfolioData.lastName.toUpperCase()}
          brandTitle={`${portfolioData.firstName} ${portfolioData.lastName}`}
          tagline='PORTFOLIO LOADING'
          statusText='PREPARING INTERFACE'
          onExitStart={handleExitStart}
          onComplete={handlePreloaderComplete}
        />
      )}

      {/* 2. Top Navigation Bar */}
      <Navbar isLoaded={heroReady} />

      {/* 3. Main Content Sections */}
      <main className='relative overflow-x-clip'>
        {/* TASK 01: Hero Section with Preloader-Coordinated Entrance */}
        <Hero isLoaded={heroReady} />

        {/* ═══════════════════════════════════════════════════════════════
            CURTAIN STACKING ZONE
            Each section pins at the top and the next section slides up
            from below like a curtain, covering the previous one.
            ═══════════════════════════════════════════════════════════════ */}
        <div
          ref={curtainContainerRef}
          className='curtain-stack-container relative'
        >
          {/* TASK 02: Dark Creative CTA Banner — z-index 1 (first layer, pinned at bottom) */}
          <div className='curtain-panel curtain-panel--1'>
            <CreativeCTA />
          </div>

          {/* TASK 03: About Me Section — z-index 2 (slides over CreativeCTA) */}
          <div className='curtain-panel curtain-panel--2'>
            <About />
          </div>

          {/* TASK 03: Technologies & Expertise Section — z-index 3 (slides over About) */}
          <div className='curtain-panel curtain-panel--3'>
            <Skills />
          </div>
        </div>

        {/* TASK 05: Selected Work Section (Professional & Personal Showcases) */}
        <SelectedWork id='selected-work' />

        {/* TASK 06: Contact Section */}
        <Contact id='contact' />
      </main>

      {/* 4. Site Footer */}
      <Footer />

      {/* 5. Vertical Scroll Progress & Back-to-Top Indicator */}
      <ScrollIndicator />

      {/* 6. Signature Interactive Animated & Magnetic Cursor */}
      <CustomCursor />
    </div>
  )
}

export default App
