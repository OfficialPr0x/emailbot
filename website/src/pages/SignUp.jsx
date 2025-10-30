import React, { useState } from 'react'
import { SignUp as ClerkSignUp } from '@clerk/clerk-react'
import { motion, useAnimation } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Zap, Shield, TrendingUp, CheckCircle, Users } from 'lucide-react'
import FloatingParticles from '../components/FloatingParticles'
import GradientMesh from '../components/GradientMesh'
import TiltCard from '../components/TiltCard'

export default function SignUp() {
  const [isSuccess, setIsSuccess] = useState(false)

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Gradient Mesh Background */}
      <GradientMesh />

      {/* Floating Particles */}
      <FloatingParticles count={20} />

      {/* Additional animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-72 h-72 bg-pink-500 opacity-20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Back to home button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-8 z-10"
      >
        <Link to="/">
          <motion.div
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors glass px-4 py-2 rounded-full border border-white/10"
            whileHover={{ x: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </motion.div>
        </Link>
      </motion.div>

      {/* Main content with orchestrated animations */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and title */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Link to="/">
            <motion.div
              className="flex items-center justify-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.img
                src="https://res.cloudinary.com/dolij7wjr/image/upload/v1761774571/649d7188-741a-4898-90e1-2ab07bc09c6f_coslbt.png"
                alt="MyG InstaBot Logo"
                className="w-14 h-14 rounded-xl"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <span className="text-3xl font-black gradient-text">MyG InstaBot™</span>
            </motion.div>
          </Link>
          <motion.div
            className="flex items-center justify-center space-x-2 mb-3"
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
            <Sparkles className="w-6 h-6 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </motion.div>
          <p className="text-gray-400 text-lg">Start automating your Instagram growth today</p>
        </motion.div>

        {/* Features banner with staggered animation */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-2xl p-4 mb-6 border border-purple-500/30 overflow-hidden relative"
        >
          {/* Animated border shimmer */}
          <motion.div
            className="absolute inset-0 border-2 border-transparent rounded-2xl"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '200% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          <div className="relative z-10 flex items-center justify-center space-x-6 text-sm flex-wrap gap-3">
            {[
              { icon: Zap, text: 'AI-Powered', delay: 0 },
              { icon: Shield, text: 'Automated', delay: 0.1 },
              { icon: TrendingUp, text: 'Secure', delay: 0.2 },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.8 + item.delay,
                  duration: 0.4,
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: item.delay,
                  }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                </motion.div>
                <item.icon className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Clerk Sign Up Component with 3D tilt and enhanced styling */}
        <motion.div variants={itemVariants}>
          <TiltCard disabled={true}>
            <div className="glass rounded-2xl p-8 shadow-2xl border border-white/10 overflow-hidden relative">
              {/* Glow effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl opacity-20 blur-xl pointer-events-none"
                animate={{
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              <div className="relative z-10">
                <ClerkSignUp
                  appearance={{
                    elements: {
                      rootBox: 'w-full',
                      card: 'bg-transparent shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      
                      // Social buttons with gradient borders
                      socialButtonsBlockButton: 
                        'glass border-2 border-purple-500/30 hover:border-purple-500/60 hover:bg-white/10 text-white ' +
                        'transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20',
                      socialButtonsBlockButtonText: 'text-white font-medium',
                      socialButtonsIconButton: 'transition-transform duration-300 hover:rotate-12',
                      
                      dividerLine: 'bg-white/10',
                      dividerText: 'text-gray-400 text-sm',
                      
                      // Form fields with glow effects
                      formFieldLabel: 'text-gray-300 font-medium text-sm mb-2',
                      formFieldInput: 
                        'glass border border-white/10 text-white bg-white/5 ' +
                        'focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 ' +
                        'placeholder:text-gray-500 transition-all duration-300 ' +
                        'hover:border-white/20 input-glow',
                      
                      // Button with shimmer effect
                      formButtonPrimary: 
                        'bg-gradient-instagram hover:opacity-90 text-white font-semibold py-3 ' +
                        'transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 ' +
                        'relative overflow-hidden btn-glow',
                      
                      footerActionLink: 'text-purple-400 hover:text-purple-300 font-medium transition-colors',
                      footerActionText: 'text-gray-400',
                      
                      identityPreviewText: 'text-white',
                      identityPreviewEditButton: 'text-purple-400 hover:text-purple-300',
                      
                      formFieldInputShowPasswordButton: 'text-gray-400 hover:text-white transition-all password-toggle',
                      formFieldAction: 'text-purple-400 hover:text-purple-300 transition-colors',
                      
                      formFieldSuccessText: 'text-green-400 flex items-center gap-2',
                      formFieldErrorText: 'text-red-400 animate-shake',
                      
                      otpCodeFieldInput: 
                        'glass border border-white/10 text-white bg-white/5 ' +
                        'focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 ' +
                        'transition-all duration-300 animate-bounce-in',
                      
                      formResendCodeLink: 'text-purple-400 hover:text-purple-300 font-medium',
                      
                      // Alert styling
                      alertText: 'text-sm',
                      alert__success: 'bg-green-500/10 border border-green-500/30 text-green-400',
                      alert__error: 'bg-red-500/10 border border-red-500/30 text-red-400 animate-shake',
                    },
                  }}
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  redirectUrl="/dashboard"
                />
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Sign in link */}
        <motion.div variants={itemVariants} className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/sign-in">
              <motion.span
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign in →
              </motion.span>
            </Link>
          </p>
        </motion.div>

        {/* Trust badges with parallax effect */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <motion.div
            className="mb-3 flex items-center justify-center space-x-2"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <p className="font-medium text-gray-400">
              Trusted by <span className="text-white font-bold">10,000+</span> Instagram marketers worldwide
            </p>
          </motion.div>
          
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
            {[
              { icon: '🔒', text: 'SSL Secured' },
              { icon: '✓', text: 'GDPR Compliant' },
              { icon: '⚡', text: 'Instant Setup' },
            ].map((badge, index) => (
              <motion.span
                key={index}
                className="flex items-center space-x-1 glass px-3 py-1.5 rounded-full border border-white/10"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <span>{badge.icon}</span>
                <span className="text-gray-300">{badge.text}</span>
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Floating stat cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="absolute -right-20 top-40 hidden lg:block"
        >
          <motion.div
            className="glass p-4 rounded-2xl border border-purple-500/30 glow-pulse"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-instagram rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">99.2%</div>
                <div className="text-xs text-gray-400">Success Rate</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute -left-24 bottom-40 hidden lg:block"
        >
          <motion.div
            className="glass p-4 rounded-2xl border border-pink-500/30"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-white">Creating accounts...</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">@growth_2024</div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative bottom border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  )
}
