import React from 'react'
import { SignIn as ClerkSignIn } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Zap, Shield, Users, TrendingUp } from 'lucide-react'
import FloatingParticles from '../components/FloatingParticles'
import GradientMesh from '../components/GradientMesh'
import TiltCard from '../components/TiltCard'

export default function SignIn() {
  // Faster animation variants for returning users
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Gradient Mesh Background */}
      <GradientMesh />

      {/* Floating Particles - fewer for cleaner look */}
      <FloatingParticles count={15} />

      {/* Animated background orbs */}
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
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Back to home button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
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
          <motion.h1
            className="text-3xl font-bold text-white mb-3"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Welcome Back
          </motion.h1>
          <p className="text-gray-400 text-lg">Sign in to access your dashboard</p>
        </motion.div>

        {/* Quick stats banner */}
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
          
          <div className="relative z-10 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Users, value: '10K+', label: 'Users' },
              { icon: TrendingUp, value: '99.2%', label: 'Success' },
              { icon: Shield, value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.6 + index * 0.1,
                  duration: 0.4,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <stat.icon className="w-5 h-5 text-purple-400 mb-1" />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Clerk Sign In Component with 3D tilt and enhanced styling */}
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
                <ClerkSignIn
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
                      
                      formFieldSuccessText: 'text-green-400',
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
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  redirectUrl="/dashboard"
                />
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Sign up link */}
        <motion.div variants={itemVariants} className="text-center mt-6">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/sign-up">
              <motion.span
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign up →
              </motion.span>
            </Link>
          </p>
        </motion.div>

        {/* Security badges */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex items-center justify-center space-x-4 flex-wrap gap-2"
        >
          {[
            { icon: '🔒', text: 'SSL Secured', color: 'green' },
            { icon: '✓', text: 'GDPR Compliant', color: 'blue' },
            { icon: '⚡', text: 'Fast Login', color: 'yellow' },
          ].map((badge, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-1.5 glass px-3 py-2 rounded-full border border-white/10 text-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <span>{badge.icon}</span>
              <span className="text-gray-300 font-medium">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating activity indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute -right-24 top-1/3 hidden lg:block"
        >
          <motion.div
            className="glass p-4 rounded-2xl border border-green-500/30"
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
              </div>
              <span className="text-sm font-semibold text-white">Live Now</span>
            </div>
            <div className="text-xs text-gray-400">847 accounts active</div>
          </motion.div>
        </motion.div>

        {/* Floating success stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="absolute -left-24 top-1/2 hidden lg:block"
        >
          <motion.div
            className="glass p-4 rounded-2xl border border-purple-500/30 glow-pulse"
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-instagram rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">2.4K</div>
                <div className="text-xs text-gray-400">This week</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative bottom border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
    </div>
  )
}
