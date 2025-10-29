import React from 'react'
import { motion } from 'framer-motion'
import { Play, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Hit Create Account',
      description: 'One click is all it takes. No forms, no configurations, no complexity. Just click and go.',
      icon: Play,
    },
    {
      number: '02',
      title: 'AI Generates Profile',
      description: 'DeepSeek AI creates a realistic profile with authentic username, bio, interests, and behavioral patterns.',
      icon: Sparkles,
    },
    {
      number: '03',
      title: 'Auto Creates Gmail + Instagram',
      description: 'Our stealth bot navigates signup flows, fills forms, handles CAPTCHAs, and verifies accounts automatically.',
      icon: CheckCircle2,
    },
    {
      number: '04',
      title: 'Track & Scale',
      description: 'Monitor creation in real-time. Accounts appear in your CRM instantly. Scale to hundreds or thousands.',
      icon: TrendingUp,
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            So Simple, It's{' '}
            <span className="gradient-text">Ridiculous</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We've eliminated every painful step. No technical knowledge required. No setup headaches.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Card */}
                <div className="glass rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-instagram rounded-full flex items-center justify-center font-black text-lg glow">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6 mt-4">
                    <step.icon className="w-8 h-8 text-purple-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Video Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300"
                  >
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </motion.div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-sm text-white/80 mb-1">Watch Demo</div>
                  <div className="font-bold text-lg">See It In Action</div>
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-3xl font-black mb-4">
                  Watch Accounts Being Created{' '}
                  <span className="gradient-text">Live</span>
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  See the entire process from start to finish. AI profile generation, 
                  form filling, verification, and the account appearing in your dashboard—all in real-time.
                </p>
                <ul className="space-y-3">
                  {[
                    'Zero manual intervention',
                    'Handles all CAPTCHAs and verifications',
                    'Completes in under 3 minutes',
                    '99.2% success rate guaranteed',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


