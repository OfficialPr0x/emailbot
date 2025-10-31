// 🎭 Animation Utilities - Framer Motion Variants
// Premium micro-interactions and transitions

import { motion } from 'framer-motion'

// ============================================================================
// ENTRANCE ANIMATIONS
// ============================================================================

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  },
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.2 }
  },
}

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.15 }
  },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
}

export const slideInRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: { duration: 0.2 }
  },
}

export const slideInLeft = {
  initial: { x: '-100%', opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: { 
    x: '-100%', 
    opacity: 0,
    transition: { duration: 0.2 }
  },
}

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerChildrenFast = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

export const staggerChildrenSlow = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

export const childVariant = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
}

// ============================================================================
// HOVER ANIMATIONS
// ============================================================================

export const magneticHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  },
  tap: { 
    scale: 0.97,
    transition: { duration: 0.1 }
  },
}

export const liftHover = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -4,
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  },
  tap: { 
    y: -2,
    scale: 1,
    transition: { duration: 0.1 }
  },
}

export const scaleHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  },
}

export const glowHover = {
  rest: { 
    boxShadow: '0 0 0 rgba(168, 85, 247, 0)',
  },
  hover: { 
    boxShadow: '0 0 24px rgba(168, 85, 247, 0.4)',
    transition: { duration: 0.3 }
  },
}

// ============================================================================
// LOOPING ANIMATIONS
// ============================================================================

export const floatingBadge = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 12px rgba(168, 85, 247, 0.3)',
      '0 0 24px rgba(168, 85, 247, 0.5)',
      '0 0 12px rgba(168, 85, 247, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

export const rotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

export const spin = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// ============================================================================
// COMPLEX ANIMATIONS
// ============================================================================

export const cardFlip = {
  initial: { rotateY: 0 },
  flipped: { 
    rotateY: 180,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
}

export const slideDrawer = {
  closed: { 
    x: '100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  open: { 
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
}

export const expandCollapse = {
  collapsed: { 
    height: 0,
    opacity: 0,
    transition: { duration: 0.3 }
  },
  expanded: { 
    height: 'auto',
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
}

export const liquidMorph = {
  initial: { 
    borderRadius: '24px',
    scale: 1,
  },
  morph: { 
    borderRadius: ['24px', '12px', '32px', '24px'],
    scale: [1, 1.02, 0.98, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// ============================================================================
// MODAL & OVERLAY ANIMATIONS
// ============================================================================

export const modalBackdrop = {
  initial: { opacity: 0, backdropFilter: 'blur(0px)' },
  animate: { 
    opacity: 1,
    backdropFilter: 'blur(12px)',
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.2 }
  },
}

export const modalContent = {
  initial: { scale: 0.9, y: 40, opacity: 0 },
  animate: { 
    scale: 1,
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  },
  exit: { 
    scale: 0.95,
    y: 20,
    opacity: 0,
    transition: { duration: 0.2 }
  },
}

export const slideUpModal = {
  initial: { y: '100%', opacity: 0 },
  animate: { 
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: { 
    y: '100%',
    opacity: 0,
    transition: { duration: 0.3 }
  },
}

// ============================================================================
// NOTIFICATION ANIMATIONS
// ============================================================================

export const notificationSlideIn = {
  initial: { x: 400, opacity: 0, scale: 0.8 },
  animate: { 
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  },
  exit: { 
    x: 400,
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 }
  },
}

export const notificationBounce = {
  animate: {
    x: [0, -10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1,
    x: 0,
    transition: { 
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  exit: { 
    opacity: 0,
    x: 20,
    transition: { duration: 0.3 }
  },
}

export const pageFade = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.4 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const createStagger = (staggerDelay = 0.1, delayChildren = 0) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
})

export const createSpring = (stiffness = 300, damping = 30) => ({
  type: 'spring',
  stiffness,
  damping,
})

export const createEase = (duration = 0.3, ease = [0.25, 0.46, 0.45, 0.94]) => ({
  duration,
  ease,
})

// ============================================================================
// DRAG ANIMATIONS
// ============================================================================

export const draggable = {
  drag: true,
  dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
  dragElastic: 0.2,
  whileDrag: { scale: 1.05, cursor: 'grabbing' },
}

export const dragGhost = {
  whileDrag: {
    scale: 1.1,
    rotate: 5,
    opacity: 0.8,
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
  },
}

// ============================================================================
// TACTICAL ANIMATIONS - Command Center Grade
// ============================================================================

// Command Entry - Fast, precise, authoritative
export const commandEntry = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
  },
  exit: {
    opacity: 0,
    y: -5,
    transition: { duration: 0.15 }
  },
}

// Status Pulse - For live indicators and system status
export const statusPulse = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut',
  },
}

// Data Update Flash - Quick feedback for real-time updates
export const dataFlash = {
  animate: { 
    opacity: [0.5, 1, 0.5],
  },
  transition: { 
    duration: 0.3,
    ease: 'easeOut',
  },
}

// Tactical Glow - Cyan/emerald glow effects
export const tacticalGlow = {
  rest: { 
    boxShadow: '0 0 0 rgba(0, 229, 255, 0)',
  },
  hover: { 
    boxShadow: '0 0 24px rgba(0, 229, 255, 0.4)',
    transition: { duration: 0.2 }
  },
}

// Tactical Pulse Glow - For armed/active states
export const tacticalPulseGlow = {
  animate: {
    boxShadow: [
      '0 0 12px rgba(0, 229, 255, 0.3)',
      '0 0 24px rgba(0, 229, 255, 0.5)',
      '0 0 12px rgba(0, 229, 255, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Snap Scale - Quick, snappy interactions
export const snapScale = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  },
}

// Sharp Slide - Fast, linear slide for data panels
export const sharpSlide = {
  initial: { x: -10, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.2, ease: 'linear' }
  },
  exit: { 
    x: 10, 
    opacity: 0,
    transition: { duration: 0.15 }
  },
}

