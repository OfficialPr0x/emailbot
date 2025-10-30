import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Twitter, Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features', type: 'anchor' },
      { name: 'Pricing', href: '#pricing', type: 'anchor' },
      { name: 'How It Works', href: '#how-it-works', type: 'anchor' },
      { name: 'FAQ', href: '#faq', type: 'anchor' },
    ],
    Company: [
      { name: 'About', href: '#', type: 'anchor' },
      { name: 'Blog', href: '#', type: 'anchor' },
      { name: 'Careers', href: '#', type: 'anchor' },
      { name: 'Contact', href: '/support', type: 'route' },
    ],
    Resources: [
      { name: 'Documentation', href: '/docs', type: 'route' },
      { name: 'API Reference', href: '/api-reference', type: 'route' },
      { name: 'Community', href: '/community', type: 'route' },
      { name: 'Support', href: '/support', type: 'route' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy-policy', type: 'route' },
      { name: 'Terms of Service', href: '/terms-of-service', type: 'route' },
      { name: 'Cookie Policy', href: '/cookie-policy', type: 'route' },
      { name: 'Disclaimer', href: '/disclaimer', type: 'route' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:support@myg-instabot.com', label: 'Email' },
  ]

  return (
    <footer className="border-t border-white/10 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-instagram rounded-xl flex items-center justify-center glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold gradient-text">MyG InstaBot</span>
              </div>

              {/* Description */}
              <p className="text-gray-400 mb-6 leading-relaxed">
                The most advanced Instagram account creation platform. 
                Scale your presence with AI-powered automation.
              </p>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="font-bold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.type === 'route' ? (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MyG InstaBot. All rights reserved.
            </p>

            {/* Status Badge */}
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">All Systems Operational</span>
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Status
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Changelog
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center text-xs text-gray-500 max-w-4xl mx-auto">
            <p>
              MyG InstaBot is designed for educational purposes and legitimate business use. 
              Users are responsible for complying with all applicable laws and platform Terms of Service. 
              We do not endorse or encourage any activities that violate the terms of Instagram or Gmail.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}


