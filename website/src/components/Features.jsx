import React from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Brain,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Clock,
  Database,
  Eye,
  Fingerprint,
  Layers,
  RefreshCw,
  Crown,
} from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Profiles',
      description: 'DeepSeek AI generates realistic profiles with authentic bios, usernames, and content that passes platform checks.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Bot,
      title: 'Full Automation',
      description: 'Create Gmail + Instagram accounts with one click. Zero manual intervention. Just hit create and watch the magic.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Stealth Mode',
      description: 'Human-like behavior simulation, randomized patterns, and anti-detection techniques keep your accounts safe.',
      gradient: 'from-green-500 to-emerald-500',
      founderExclusive: true,
    },
    {
      icon: Globe,
      title: 'Unlimited Premium Proxies',
      description: 'Auto-rotating enterprise-grade proxies included. Stay anonymous and avoid IP bans with distributed requests.',
      gradient: 'from-orange-500 to-red-500',
      founderExclusive: true,
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Beautiful dashboard with live stats, success rates, proxy health, and account performance metrics.',
      gradient: 'from-purple-500 to-blue-500',
    },
    {
      icon: Database,
      title: 'CRM Built-In',
      description: 'Manage all your accounts in one place. Search, filter, edit, and track every account with our powerful CRM.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Multi-strategy form filling with 5 fallback methods ensures 99.2% success rate even on dynamic pages.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Eye,
      title: 'Live Monitoring',
      description: 'Watch accounts being created in real-time. See every step of the process with live progress updates.',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Fingerprint,
      title: 'Unique Fingerprints',
      description: 'Every account gets unique browser fingerprints, user agents, and behavioral patterns for maximum safety.',
      gradient: 'from-indigo-500 to-purple-500',
      founderExclusive: true,
    },
    {
      icon: Layers,
      title: 'Fleet Orchestration',
      description: 'Group accounts, split tasks, and control your entire fleet dynamically with advanced automation.',
      gradient: 'from-teal-500 to-green-500',
      founderExclusive: true,
    },
    {
      icon: RefreshCw,
      title: 'Auto Recovery & AI Healing',
      description: 'Self-healing AI agents automatically recover from failures and adapt to platform changes.',
      gradient: 'from-red-500 to-pink-500',
      founderExclusive: true,
    },
    {
      icon: Clock,
      title: '24/7 Priority Support',
      description: 'Direct Slack/Telegram line with priority queue and early access to updates. Founders-only perk.',
      gradient: 'from-blue-500 to-purple-500',
      founderExclusive: true,
    },
  ]

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Scale Fast</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Built from the ground up with enterprise-grade features. No compromises, no limitations.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`group glass p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 relative ${
                feature.founderExclusive ? 'ring-1 ring-yellow-500/30 hover:ring-yellow-500/50' : 'hover:shadow-purple-500/20'
              }`}
            >
              {/* Founder Badge */}
              {feature.founderExclusive && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 glow">
                    <Crown className="w-3 h-3" />
                    <span>Founder</span>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="#pricing"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-instagram rounded-full font-bold text-lg btn-ripple hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
          >
            <Crown className="w-5 h-5" />
            <span>Claim Your Founder's Pass</span>
          </a>
          <p className="mt-4 text-sm text-gray-500">
            Only 77 keys remaining · $997 one-time payment
          </p>
        </motion.div>
      </div>
    </section>
  )
}


