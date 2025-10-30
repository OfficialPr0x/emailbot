import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

export default function FloatingParticles({ count = 20 }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Generate particles with random properties
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const colors = [
        'rgba(168, 85, 247, 0.4)', // purple
        'rgba(236, 72, 153, 0.4)', // pink
        'rgba(59, 130, 246, 0.4)', // blue
        'rgba(251, 146, 60, 0.4)', // orange
      ]
      
      return {
        id: i,
        size: Math.random() * 60 + 20, // 20-80px
        x: Math.random() * 100, // 0-100%
        y: Math.random() * 100, // 0-100%
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 8 + 8, // 8-16s
        delay: Math.random() * 5, // 0-5s
        blur: Math.random() * 30 + 20, // 20-50px
        animationType: ['particle-1', 'particle-2', 'particle-3'][Math.floor(Math.random() * 3)],
      }
    })
  }, [count])

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {particles.map((particle) => {
        // Calculate distance from mouse for reactive effect
        const particleX = (particle.x / 100) * window.innerWidth
        const particleY = (particle.y / 100) * window.innerHeight
        const distance = Math.sqrt(
          Math.pow(mousePosition.x - particleX, 2) + 
          Math.pow(mousePosition.y - particleY, 2)
        )
        const maxDistance = 300
        const influence = Math.max(0, 1 - distance / maxDistance)
        
        // Calculate offset based on mouse proximity
        const offsetX = isHovering ? (mousePosition.x - particleX) / 50 * influence : 0
        const offsetY = isHovering ? (mousePosition.y - particleY) / 50 * influence : 0

        return (
          <motion.div
            key={particle.id}
            className="particle absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
              filter: `blur(${particle.blur}px)`,
            }}
            animate={{
              x: offsetX,
              y: offsetY,
            }}
            transition={{
              type: 'spring',
              stiffness: 50,
              damping: 20,
            }}
          >
            <motion.div
              className="w-full h-full rounded-full"
              style={{
                background: particle.color,
              }}
              animate={{
                scale: [1, 1.2, 0.8, 1],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

