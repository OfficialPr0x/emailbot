/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        instagram: {
          pink: '#E1306C',
          purple: '#833AB4',
          orange: '#FD1D1D',
          yellow: '#F77737',
        }
      },
      backgroundImage: {
        'gradient-instagram': 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-pink': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-blue': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'shimmer': 'shimmer 2.5s linear infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'particle-1': 'particleFloat1 8s ease-in-out infinite',
        'particle-2': 'particleFloat2 10s ease-in-out infinite',
        'particle-3': 'particleFloat3 12s ease-in-out infinite',
        'mesh-morph': 'meshMorph 15s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-3px)' },
          '40%, 60%': { transform: 'translateX(3px)' },
        },
        particleFloat1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        particleFloat2: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(-40px, 30px) rotate(120deg)' },
          '66%': { transform: 'translate(20px, -30px) rotate(240deg)' },
        },
        particleFloat3: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-60px) scale(1.2)' },
        },
        meshMorph: {
          '0%, 100%': { 
            transform: 'translate(0, 0) rotate(0deg)',
          },
          '33%': { 
            transform: 'translate(20px, -20px) rotate(5deg)',
          },
          '66%': { 
            transform: 'translate(-20px, 20px) rotate(-5deg)',
          },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3)',
          },
        },
        bounceIn: {
          '0%': { 
            opacity: 0,
            transform: 'scale(0.3)',
          },
          '50%': { 
            opacity: 1,
            transform: 'scale(1.05)',
          },
          '70%': { 
            transform: 'scale(0.9)',
          },
          '100%': { 
            transform: 'scale(1)',
          },
        },
        scaleIn: {
          '0%': { 
            opacity: 0,
            transform: 'scale(0.9)',
          },
          '100%': { 
            opacity: 1,
            transform: 'scale(1)',
          },
        },
        slideInLeft: {
          '0%': { 
            opacity: 0,
            transform: 'translateX(-30px)',
          },
          '100%': { 
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
        fadeInUp: {
          '0%': { 
            opacity: 0,
            transform: 'translateY(20px)',
          },
          '100%': { 
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }
    },
  },
  plugins: [],
}


