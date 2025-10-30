import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Marcus Chen',
      role: 'Growth Agency Owner',
      avatar: '👨‍💼',
      rating: 5,
      quote: "This paid for itself in 2 weeks. We were spending $1,200/month on manual account creation. Now it's automated, faster, and costs nothing ongoing. Best ROI I've ever seen.",
      results: '247 accounts created',
      location: 'San Francisco, CA',
    },
    {
      name: 'Sarah Williams',
      role: 'Social Media Manager',
      avatar: '👩‍💻',
      rating: 5,
      quote: "The AI healing is insane. Instagram changed their flow 3 times last month and I didn't have to do anything. It just... works. Forever. No updates to buy. No subscriptions. Perfect.",
      results: '98.7% success rate',
      location: 'London, UK',
    },
    {
      name: 'Alex Rodriguez',
      role: 'E-commerce Entrepreneur',
      avatar: '🚀',
      rating: 5,
      quote: "I was paying $497/month for inferior tools. Switching to the Founder's Pass was a no-brainer. Same features, lifetime access, and I saved $17,000 over 3 years. Do the math.",
      results: 'Saved $17,000+',
      location: 'Miami, FL',
    },
    {
      name: 'Jessica Park',
      role: 'Marketing Director',
      avatar: '💎',
      rating: 5,
      quote: "The fleet orchestration is game-changing. We run 50+ accounts simultaneously with zero issues. Support team is incredible. This isn't software—it's an investment that prints money.",
      results: '50+ active accounts',
      location: 'Toronto, Canada',
    },
    {
      name: 'David Kumar',
      role: 'Digital Agency Founder',
      avatar: '⚡',
      rating: 5,
      quote: "I've bought every automation tool out there. This is the first one I'll never stop using. Unlimited identities, perfect fingerprinting, and I'll never pay again. Worth 10x the price.",
      results: '312 identities created',
      location: 'Dubai, UAE',
    },
    {
      name: 'Emily Thompson',
      role: 'SaaS Founder',
      avatar: '👑',
      rating: 5,
      quote: "My only regret is not buying this sooner. The white-label dashboard lets me resell this to clients. I've already made back my investment 5x over. Absolute game-changer.",
      results: '5x ROI in 30 days',
      location: 'Austin, TX',
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Loved By Founders</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            347 Founders Can't Be <span className="gradient-text">Wrong</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real founders. Real results. Real ROI. These aren't fake reviews—these are people who locked in lifetime access and never looked back.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-purple-400 mb-4 opacity-50" />

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 mb-6 leading-relaxed">{testimonial.quote}</p>

              {/* Results badge */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl px-4 py-2 mb-4">
                <div className="text-sm font-bold text-green-400 text-center">
                  {testimonial.results}
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
                <div className="w-12 h-12 bg-gradient-instagram rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                  <div className="text-xs text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center space-x-6 glass px-8 py-4 rounded-2xl">
            <div>
              <div className="text-4xl font-black gradient-text">4.9/5</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
            <div>
              <div className="text-4xl font-black gradient-text">98%</div>
              <div className="text-sm text-gray-500">Would Recommend</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
            <div>
              <div className="text-4xl font-black gradient-text">$847K</div>
              <div className="text-sm text-gray-500">Total Savings</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
