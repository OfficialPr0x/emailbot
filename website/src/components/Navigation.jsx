import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, BookOpen, Code, Users, LifeBuoy, LogIn, LayoutDashboard, Crown, Flame } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth, UserButton } from '@clerk/clerk-react'
import PaymentModal from './PaymentModal'

export default function Navigation({ scrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const { isSignedIn, isLoaded } = useAuth()

  const navLinks = [
    { name: 'Features', href: '#features', type: 'anchor' },
    { name: 'How It Works', href: '#how-it-works', type: 'anchor' },
    { name: 'Pricing', href: '#pricing', type: 'anchor' },
    { name: 'FAQ', href: '#faq', type: 'anchor' },
  ]

  const resourceLinks = [
    { name: 'Documentation', href: '/docs', icon: BookOpen },
    { name: 'API Reference', href: '/api-reference', icon: Code },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Support', href: '/support', icon: LifeBuoy },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/">
              <motion.div
                className="flex items-center space-x-4 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src="https://res.cloudinary.com/dolij7wjr/image/upload/v1761774571/649d7188-741a-4898-90e1-2ab07bc09c6f_coslbt.png"
                  alt="MyG InstaBot Logo"
                  className="w-14 h-14 rounded-xl"
                />
                <span className="text-4xl font-black gradient-text">MyG InstaBot™</span>
              </motion.div>
            </Link>
            
            {isHomePage && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1.5 rounded-full text-xs font-bold animate-pulse"
              >
                <Flame className="w-3 h-3" />
                <span>653 Keys Left</span>
              </motion.div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isHomePage && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {link.name}
              </a>
            ))}
            
            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-white transition-colors duration-200 font-medium flex items-center space-x-1">
                <span>Resources</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="glass rounded-xl p-2 border border-white/10 shadow-xl">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <link.icon className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-medium">{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Authentication Buttons */}
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="flex items-center space-x-4">
                    <Link to="/dashboard">
                      <motion.div
                        className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-instagram rounded-full font-semibold btn-ripple hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </motion.div>
                    </Link>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: 'w-10 h-10 border-2 border-purple-500'
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    {isHomePage ? (
                      <motion.button
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-instagram rounded-full font-semibold btn-ripple hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Crown className="w-4 h-4" />
                        <span>Get Founder's Pass</span>
                      </motion.button>
                    ) : (
                      <>
                        <Link to="/sign-in">
                          <motion.div
                            className="flex items-center space-x-2 px-5 py-2.5 glass border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <LogIn className="w-4 h-4" />
                            <span>Login</span>
                          </motion.div>
                        </Link>
                        <Link to="/sign-up">
                          <motion.div
                            className="px-6 py-2.5 bg-gradient-instagram rounded-full font-semibold btn-ripple hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Get Started
                          </motion.div>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 glass rounded-2xl p-4"
          >
            {isHomePage && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-3 text-gray-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            <div className="border-t border-white/10 my-3"></div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-3">
              Resources
            </div>
            {resourceLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="flex items-center space-x-3 py-3 px-3 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="w-5 h-5 text-purple-400" />
                <span>{link.name}</span>
              </Link>
            ))}
            
            {/* Mobile Authentication */}
            <div className="border-t border-white/10 mt-3 pt-3">
              {isLoaded && (
                <>
                  {isSignedIn ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block mt-2 px-6 py-3 bg-gradient-instagram rounded-full text-center font-semibold"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Go to Dashboard
                      </Link>
                      <div className="flex justify-center mt-3">
                        <UserButton 
                          afterSignOutUrl="/"
                          appearance={{
                            elements: {
                              avatarBox: 'w-10 h-10 border-2 border-purple-500'
                            }
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/sign-in"
                        className="block mt-2 px-6 py-3 glass border border-white/10 rounded-full text-center font-semibold hover:bg-white/10 transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/sign-up"
                        className="block mt-2 px-6 py-3 bg-gradient-instagram rounded-full text-center font-semibold"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />
    </motion.nav>
  )
}


