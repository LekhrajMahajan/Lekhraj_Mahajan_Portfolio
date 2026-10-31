import React, { useRef, useState, useEffect } from 'react'

export interface MagneticProps {
  children?: React.ReactNode
  padding?: number
  disabled?: boolean
  magnetStrength?: number
  activeTransition?: string
  inactiveTransition?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Optional standalone Magnetic Wrapper.
 * Note: CustomCursor already provides automatic magnetic attraction globally.
 */
export const Magnetic: React.FC<MagneticProps> = ({
  children,
  padding = 35,
  disabled = false,
  magnetStrength = 3.5,
  activeTransition = 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
  inactiveTransition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  className = '',
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const effectivePos = disabled ? { x: 0, y: 0 } : position

  useEffect(() => {
    if (disabled) return
    if (typeof window === 'undefined') return
    const isFinePointer =
      window.matchMedia && window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distX = Math.abs(centerX - e.clientX)
      const distY = Math.abs(centerY - e.clientY)

      if (distX < rect.width / 2 + padding && distY < rect.height / 2 + padding) {
        setIsHovered(true)
        const offsetX = (e.clientX - centerX) / magnetStrength
        const offsetY = (e.clientY - centerY) / magnetStrength
        setPosition({ x: offsetX, y: offsetY })
      } else {
        if (isHovered) {
          setIsHovered(false)
          setPosition({ x: 0, y: 0 })
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [padding, disabled, magnetStrength, isHovered])

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`.trim()}
      style={{ display: 'inline-block', ...style }}
    >
      <div
        style={{
          transform: `translate3d(${effectivePos.x}px, ${effectivePos.y}px, 0)`,
          transition: isHovered ? activeTransition : inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Magnetic
