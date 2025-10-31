import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function AmbientBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated Gradient Mesh - Mouse Reactive */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(
            circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
            rgba(168, 85, 247, 0.25) 0%,
            rgba(59, 130, 246, 0.15) 25%,
            rgba(236, 72, 153, 0.12) 50%,
            transparent 100%
          )`,
        }}
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary Dynamic Layer */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(
              circle at ${(1 - mousePosition.x) * 100}% ${(1 - mousePosition.y) * 100}%,
              rgba(192, 132, 252, 0.15) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at ${mousePosition.x * 50}% ${mousePosition.y * 50 + 50}%,
              rgba(59, 130, 246, 0.12) 0%,
              transparent 50%
            )
          `,
        }}
        animate={{
          scale: [1, 1.08, 1],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Large Floating Orbs - More Dramatic */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 150, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Additional Accent Orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Scanline Effect (Subtle) */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
          backgroundSize: '100% 4px',
        }}
        animate={{
          y: ['-100%', '100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

