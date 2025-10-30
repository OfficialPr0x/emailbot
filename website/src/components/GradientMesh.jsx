import React from 'react'
import { motion } from 'framer-motion'

export default function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary Mesh Gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Animated Gradient 1 - Purple to Pink */}
            <motion.radialGradient
              id="gradient1"
              cx="30%"
              cy="30%"
              r="50%"
            >
              <motion.stop
                offset="0%"
                stopColor="#a855f7"
                animate={{
                  stopColor: ['#a855f7', '#ec4899', '#8b5cf6', '#a855f7'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.stop
                offset="100%"
                stopColor="transparent"
              />
            </motion.radialGradient>

            {/* Animated Gradient 2 - Pink to Orange */}
            <motion.radialGradient
              id="gradient2"
              cx="70%"
              cy="60%"
              r="50%"
            >
              <motion.stop
                offset="0%"
                stopColor="#ec4899"
                animate={{
                  stopColor: ['#ec4899', '#f97316', '#dc2626', '#ec4899'],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.stop
                offset="100%"
                stopColor="transparent"
              />
            </motion.radialGradient>

            {/* Animated Gradient 3 - Blue to Purple */}
            <motion.radialGradient
              id="gradient3"
              cx="50%"
              cy="80%"
              r="50%"
            >
              <motion.stop
                offset="0%"
                stopColor="#3b82f6"
                animate={{
                  stopColor: ['#3b82f6', '#8b5cf6', '#6366f1', '#3b82f6'],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.stop
                offset="100%"
                stopColor="transparent"
              />
            </motion.radialGradient>

            {/* Blur filter for smooth edges */}
            <filter id="blur">
              <feGaussianBlur stdDeviation="80" />
            </filter>
          </defs>

          {/* Mesh Elements */}
          <motion.circle
            cx="300"
            cy="200"
            r="400"
            fill="url(#gradient1)"
            filter="url(#blur)"
            animate={{
              cx: [300, 350, 250, 300],
              cy: [200, 250, 150, 200],
              r: [400, 450, 380, 400],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.circle
            cx="900"
            cy="400"
            r="350"
            fill="url(#gradient2)"
            filter="url(#blur)"
            animate={{
              cx: [900, 850, 950, 900],
              cy: [400, 450, 350, 400],
              r: [350, 400, 330, 350],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />

          <motion.circle
            cx="600"
            cy="600"
            r="300"
            fill="url(#gradient3)"
            filter="url(#blur)"
            animate={{
              cx: [600, 650, 550, 600],
              cy: [600, 650, 550, 600],
              r: [300, 350, 280, 300],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </svg>
      </motion.div>

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-gray-950" />
    </div>
  )
}

