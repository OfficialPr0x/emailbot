import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard({ children, className = '', disabled = false }) {
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const cardRef = useRef(null)

  // Motion values for smooth animations
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring configuration for smooth, natural motion
  const springConfig = { damping: 20, stiffness: 150 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig)

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = (e) => {
    if (disabled || isMobile) return

    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate mouse position relative to card center (-0.5 to 0.5)
    const x = (e.clientX - centerX) / rect.width
    const y = (e.clientY - centerY) / rect.height

    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseEnter = () => {
    if (!disabled && !isMobile) {
      setIsHovering(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  if (disabled || isMobile) {
    // On mobile or when disabled, return simple hover scale
    return (
      <motion.div
        className={className}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      className={`tilt-card ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isHovering ? 1.02 : 1,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <motion.div
        style={{
          rotateX: isHovering ? rotateX : 0,
          rotateY: isHovering ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 20,
        }}
      >
        <div className="tilt-card-inner" style={{ transformStyle: 'preserve-3d' }}>
          {children}
        </div>

        {/* Shine effect that follows mouse */}
        {isHovering && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

