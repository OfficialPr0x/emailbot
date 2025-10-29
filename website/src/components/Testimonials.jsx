import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Martinez',
      role: 'Social Media Agency Owner',
      avatar: '👩‍💼',
      rating: 5,
      text: "MyG InstaBot has been a total game-changer for my agency. We went from manually creating 5-10 accounts per week to 100+ on autopilot. The AI profiles are so realistic that we've never had issues. Best investment we've made this year.",
    },
    {
      name: 'Mike Chen',
      role: 'E-commerce Marketer',
      avatar: '👨‍💻',
      rating: 5,
      text: "I was skeptical at first, but this tool is insane. The stealth mode and proxy rotation actually work. I've created over 500 accounts in the past month with zero bans. The dashboard is gorgeous and makes everything so easy to manage.",
    },
    {
      name: 'Jessica Thompson',
      role: 'Growth Hacker',
      avatar: '👩‍🚀',
      rating: 5,
      text: "Finally, a bot that actually delivers on its promises. The 99.2% success rate isn't marketing BS—it's real. The real-time monitoring is addictive to watch. I can scale my Instagram presence like never before.",
    },
    {
      name: 'David Rodriguez',
      role: 'Digital Marketing Consultant',
      avatar: '👨‍💼',
      rating: 5,
      text: "I've tried every Instagram automation tool out there. MyG InstaBot is in a league of its own. The AI profile generation, the multi-strategy form filling, the built-in CRM—it's the complete package. Worth every penny.",
    },
    {
      name: 'Emily Watson',
      role: 'Influencer Manager',
      avatar: '👩‍🎨',
      rating: 5,
      text: "Managing multiple client accounts used to be a nightmare. Now with MyG InstaBot, I can spin up new accounts in minutes and track everything from one beautiful dashboard. The automation is flawless and the proxies are rock solid.",
    },
    {
      name: 'Alex Kim',
      role: 'SaaS Founder',
      avatar: '👨‍🔬',
      rating: 5,
      text: "This is what automation should be. One click and you're done. No technical knowledge needed. The live monitoring feature is brilliant—I love watching the accounts get created in real-time. Customer support is top-notch too.",
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Loved By{' '}
            <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real users are saying.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-2xl p-6 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-purple-500/20" />

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-purple rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-black gradient-text">2,847+</div>
            <div className="text-sm text-gray-400">Happy Users</div>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-center">
            <div className="text-3xl font-black gradient-text">15,847+</div>
            <div className="text-sm text-gray-400">Accounts Created</div>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-center">
            <div className="text-3xl font-black gradient-text">4.9/5</div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-center">
            <div className="text-3xl font-black gradient-text">99.2%</div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


