// 🎨 Unicorn-Grade Design System Tokens
// Premium Creative Suite Aesthetic: Framer × Spline × Arc Browser

export const colors = {
  // Intelligent Gradients
  gradients: {
    primary: 'from-violet-500 via-purple-500 to-fuchsia-500',
    primaryDark: 'from-violet-600 via-purple-600 to-fuchsia-600',
    accent: 'from-cyan-400 via-blue-500 to-purple-600',
    accentAlt: 'from-blue-500 via-purple-500 to-pink-500',
    success: 'from-emerald-400 to-teal-500',
    warning: 'from-amber-400 to-orange-500',
    danger: 'from-rose-400 to-red-500',
    neural: 'from-slate-700 via-slate-800 to-slate-900',
    neuralLight: 'from-slate-600 via-slate-700 to-slate-800',
    glass: 'from-white/10 to-white/5',
    glassDark: 'from-black/20 to-black/10',
    
    // Special Effects
    reactor: 'from-orange-500 via-red-500 to-pink-600',
    influencer: 'from-purple-500 via-pink-500 to-rose-500',
    analytics: 'from-blue-500 via-cyan-400 to-teal-400',
    creative: 'from-violet-600 via-fuchsia-500 to-pink-500',
  },
  
  // Solid Colors with Semantic Meaning
  solid: {
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    accent: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },
}

export const shadows = {
  // Multi-layered Depth
  neu: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
    xl: '0 16px 64px rgba(0, 0, 0, 0.16), 0 8px 16px rgba(0, 0, 0, 0.12)',
  },
  
  // Colored Glow Effects
  glow: {
    sm: '0 0 12px rgba(168, 85, 247, 0.3)',
    md: '0 0 24px rgba(168, 85, 247, 0.4)',
    lg: '0 0 36px rgba(168, 85, 247, 0.5)',
    xl: '0 0 48px rgba(168, 85, 247, 0.6)',
  },
  
  glowAccent: {
    sm: '0 0 12px rgba(59, 130, 246, 0.3)',
    md: '0 0 24px rgba(59, 130, 246, 0.4)',
    lg: '0 0 36px rgba(59, 130, 246, 0.5)',
  },
  
  glowSuccess: {
    sm: '0 0 12px rgba(52, 211, 153, 0.3)',
    md: '0 0 24px rgba(52, 211, 153, 0.4)',
  },
  
  glowDanger: {
    sm: '0 0 12px rgba(251, 113, 133, 0.3)',
    md: '0 0 24px rgba(251, 113, 133, 0.4)',
  },
  
  // Inner Glow
  innerGlow: 'inset 0 0 24px rgba(168, 85, 247, 0.2)',
  innerGlowAccent: 'inset 0 0 24px rgba(59, 130, 246, 0.2)',
}

export const blur = {
  // Glassmorphic Hierarchy
  sm: '4px',
  md: '12px',
  lg: '24px',
  xl: '40px',
  '2xl': '64px',
}

export const motion = {
  // Framer-style Easing Curves
  spring: {
    smooth: { type: 'spring', stiffness: 300, damping: 30 },
    bouncy: { type: 'spring', stiffness: 400, damping: 25 },
    gentle: { type: 'spring', stiffness: 200, damping: 35 },
    snappy: { type: 'spring', stiffness: 500, damping: 30 },
  },
  
  ease: {
    fluid: [0.25, 0.46, 0.45, 0.94],
    magnetic: [0.34, 1.56, 0.64, 1],
    smooth: [0.43, 0.13, 0.23, 0.96],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
  
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    slower: 0.7,
  },
}

export const spacing = {
  // Spatial Rhythm System (Base 8px with golden ratio scaling)
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
}

export const borderRadius = {
  // Smooth, Modern Corners
  sm: '0.5rem',   // 8px
  md: '0.75rem',  // 12px
  lg: '1rem',     // 16px
  xl: '1.5rem',   // 24px
  '2xl': '2rem',  // 32px
  full: '9999px',
}

export const typography = {
  // Font Weights
  weight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Font Sizes (Harmonious Scale)
  size: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  // Line Heights
  leading: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
}

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80,
}

// CSS-in-JS Helper Functions
export const getGradientClass = (gradientName) => {
  return `bg-gradient-to-r ${colors.gradients[gradientName] || colors.gradients.primary}`
}

export const getShadow = (type, size = 'md') => {
  return shadows[type]?.[size] || shadows.neu.md
}

export const getBlur = (size = 'md') => {
  return `blur(${blur[size]})`
}

