import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { gsap } from '../../utils/gsapSetup'
import { prefersReducedMotion } from '../../utils/motion'
import { portfolioData, type NavItem } from '../../data/portfolio'
import { triggerResumeDownload } from '../../utils/downloadResume'
import { Logo } from './Logo'
import { smoothScrollTo, onScrollProgress } from '../../utils/smoothScroll'
import './navbar.css'

interface NavbarProps {
  navItems?: NavItem[]
  isLoaded?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  navItems = portfolioData.navItems,
  isLoaded = true,
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isHidden, setIsHidden] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  const headerRef = useRef<HTMLElement>(null)
  const hasAnimatedRef = useRef<boolean>(false)

  // Smooth, stable entrance animation once loaded (clear transform so CSS controls translateY)
  useEffect(() => {
    if (!isLoaded || hasAnimatedRef.current) return
    hasAnimatedRef.current = true

    if (prefersReducedMotion() || !headerRef.current) return

    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        clearProps: 'transform',
      }
    )
  }, [isLoaded])

  // Track scroll position for instant smart hide/show:
  // Top-to-bottom scroll (downwards) -> slide navbar UP (hide)
  // Bottom-to-top scroll (upwards) -> slide navbar back DOWN (show)
  const lastScrollY = useRef<number>(0)

  const handleScrollUpdate = useCallback((currentScrollY: number) => {
    setIsScrolled(currentScrollY > 20)

    // Never hide when mobile drawer menu is actively open
    if (isMobileMenuOpen) {
      setIsHidden(false)
      lastScrollY.current = currentScrollY
      return
    }

    // Always visible at the very top of the page
    if (currentScrollY <= 24) {
      setIsHidden(false)
      lastScrollY.current = currentScrollY
      return
    }

    const delta = currentScrollY - lastScrollY.current

    // Top-to-bottom scroll (scrolling DOWN): hide navbar by sliding it UP
    if (delta > 5 && currentScrollY > 50) {
      setIsHidden(true)
    }
    // Bottom-to-top scroll (scrolling UP): show navbar by sliding it back DOWN
    else if (delta < -4) {
      setIsHidden(false)
    }

    lastScrollY.current = currentScrollY
  }, [isMobileMenuOpen])

  useEffect(() => {
    // 1. Listen to Lenis smooth momentum scroll
    const unsubscribeLenis = onScrollProgress((_progress, scrollY) => {
      handleScrollUpdate(scrollY)
    })

    // 2. Direct listener for native scroll
    const onNativeScroll = () => {
      handleScrollUpdate(window.scrollY)
    }
    window.addEventListener('scroll', onNativeScroll, { passive: true })

    return () => {
      unsubscribeLenis()
      window.removeEventListener('scroll', onNativeScroll)
    }
  }, [handleScrollUpdate])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)

    if (href === '#home' || href === '#' || href === '') {
      smoothScrollTo(0)
    } else {
      smoothScrollTo(href, { offset: -40 })
    }
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 navbar-auto-hide ${
        isHidden && !isMobileMenuOpen ? 'navbar--hidden' : 'navbar--visible'
      } ${
        isScrolled
          ? 'bg-[#e5e3dc]/90 backdrop-blur-md shadow-sm border-b border-[#161616]/10 py-3.5'
          : 'bg-transparent py-5 lg:py-6'
      } ${!isLoaded ? 'opacity-0 pointer-events-none' : ''}`}
    >
      <div className='max-w-384 mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
        {/* Left: Brand Monogram */}
        <a
          href='#home'
          onClick={e => handleNavClick(e, '#home')}
          className='group flex items-center p-2 -m-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bf4a1a] rounded hover-this cursor-pointer select-none'
          aria-label={`${portfolioData.name} - Back to Home`}
        >
          <Logo className='w-10 sm:w-12 h-auto text-[#161616] transition-colors duration-300 drop-shadow-sm' />
        </a>

        {/* Center: Desktop Navigation Links with Magnetic Attraction & Sharp White Text on Hover */}
        <nav
          className='hidden md:flex items-center gap-1 lg:gap-2'
          aria-label='Main Navigation'
        >
          {navItems.map((item, idx) => (
            <React.Fragment key={item.label}>
              <a
                href={item.href}
                onClick={e => handleNavClick(e, item.href)}
                className='nav-link-item hover-this cursor-pointer select-none'
              >
                <span>{item.label}</span>
              </a>
              {idx < navItems.length - 1 && (
                <span className='text-xs text-[#161616]/40 select-none px-0.5' aria-hidden="true">
                  •
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Right: Contact CTA Button (Desktop) */}
        <div className='hidden md:flex items-center'>
          <a
            href={`#${portfolioData.contactSectionId}`}
            onClick={e =>
              handleNavClick(e, `#${portfolioData.contactSectionId}`)
            }
            className='nav-contact-btn group hover-this'
            aria-label='Contact Lekhraj'
          >
            <span>Contact</span>
            <span className='icon-circle'>
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className='flex md:hidden items-center'>
          <button
            type='button'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#161616]/20 bg-[#e5e3dc]/80 backdrop-blur-md text-[#161616] font-['Poppins'] text-xs font-bold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bf4a1a] transition-colors"
            aria-expanded={isMobileMenuOpen}
            aria-label={
              isMobileMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
          >
            <span>{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          role='dialog'
          aria-modal='true'
          aria-label='Mobile Navigation'
          className='md:hidden fixed inset-x-0 top-16 bg-[#e5e3dc] border-b border-[#161616]/10 shadow-2xl p-6 mobile-menu-drawer'
        >
          <div className='flex flex-col gap-4'>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#bf4a1a] font-['Poppins']">
              Navigation
            </span>
            <div className='flex flex-col gap-2'>
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={e => handleNavClick(e, item.href)}
                  className="text-3xl font-bold uppercase font-['Big_Shoulders_Display',sans-serif] tracking-wider text-[#161616] hover:text-[#bf4a1a] py-2 transition-colors border-b border-[#161616]/5"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className='pt-4 flex flex-col gap-3'>
              <a
                href={`#${portfolioData.contactSectionId}`}
                onClick={e =>
                  handleNavClick(e, `#${portfolioData.contactSectionId}`)
                }
                className='w-full py-3 rounded-full bg-[#161616] text-[#e5e3dc] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#bf4a1a] transition-colors'
              >
                <span>GET IN TOUCH</span>
                <ArrowUpRight size={15} />
              </a>

              <a
                href={portfolioData.resumeUrl}
                target='_blank'
                rel='noopener noreferrer'
                onClick={(e) => {
                  if (
                    !triggerResumeDownload(
                      portfolioData.resumeUrl,
                      'Lekhraj Resume.pdf'
                    )
                  ) {
                    e.preventDefault()
                  }
                }}
                className='w-full py-3 rounded-full border border-[#161616]/30 text-[#161616] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-[#bf4a1a] hover:text-[#bf4a1a] transition-colors'
              >
                DOWNLOAD CV
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
