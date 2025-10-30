import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "What's included in the Founder's Pass?",
      answer: "The Founder's Pass gives you lifetime access to ALL Architect-tier features forever: unlimited synthetic identities, fleet orchestration, embedded AI agents, role-based sub-accounts, webhooks, IP rotation, full system logs, priority roadmap input, private Founder Discord, early beta access, and white-label dashboard. One payment of $997. No subscriptions, ever.",
    },
    {
      question: 'Can I upgrade later if I miss the presale?',
      answer: "No - the Founder's Pass is a one-time opportunity only available during presale. After launch on November 15th, the system will only be available as a $497/month subscription. Once all 100 keys are claimed, this lifetime deal disappears forever.",
    },
    {
      question: 'What happens after 100 keys sell out?',
      answer: "Once all 100 Founder's Pass keys are claimed, the presale ends permanently. The platform launches on November 15th with monthly subscription plans starting at $297/month. Founders get lifetime access with no recurring charges and exclusive perks that monthly subscribers won't receive.",
    },
    {
      question: 'Is this a subscription?',
      answer: "No! The Founder's Pass is a one-time payment of $997 for lifetime access. You'll never pay again. No monthly fees, no annual renewals, no hidden costs. Pay once, use forever. After launch, the only option will be monthly subscriptions starting at $297-$997/month.",
    },
    {
      question: 'When will I get access?',
      answer: "You'll receive your unique license key immediately after payment. The full platform launches November 15th, 12:00 PM EST. In the meantime, you'll get exclusive access to the private Founder Discord channel where you can connect with other founders, provide roadmap input, and get early previews.",
    },
    {
      question: 'Is this legal and safe to use?',
      answer: 'MyG InstaBot is designed for educational purposes and legitimate business use cases like managing multiple accounts for clients. We use advanced stealth techniques and human-like behavior to ensure accounts remain safe. However, you should always comply with platform Terms of Service and use responsibly.',
    },
    {
      question: 'How does the AI profile generation work?',
      answer: 'We integrate with DeepSeek AI to generate realistic profiles including names, usernames, bios, interests, and content. The AI ensures each profile is unique and authentic-looking, helping your accounts blend in naturally and avoid detection.',
    },
    {
      question: 'What makes your proxies "premium"?',
      answer: 'Our 100 included proxies are residential IPs from verified providers, not cheap datacenter proxies. They auto-rotate with each request, have high success rates, and are optimized specifically for social media automation. Enterprise plans get even more proxies.',
    },
    {
      question: 'What is the actual success rate?',
      answer: "We maintain a 99.2% success rate across all account creations. Our multi-strategy form filling system has 5 different fallback methods, so if one approach doesn't work, we automatically try the next. This ensures reliability even when platforms update their interfaces.",
    },
    {
      question: 'Can I manage accounts after creation?',
      answer: 'Absolutely! MyG InstaBot includes a full CRM dashboard where you can view, search, filter, edit, and manage all your created accounts. Track performance, update profiles, and organize accounts by tags or campaigns—all from one beautiful interface.',
    },
    {
      question: 'How long does it take to create an account?',
      answer: 'The entire process (Gmail + Instagram) typically completes in under 3 minutes. You can watch the creation happen in real-time with our live monitoring feature. Bulk operations can create multiple accounts in parallel.',
    },
    {
      question: 'Do I need technical knowledge to use this?',
      answer: "Not at all! We've designed MyG InstaBot to be completely user-friendly. Just hit 'Create Account' and everything happens automatically. The AI handles profile generation, the bot handles form filling, and the proxies rotate automatically. Zero configuration needed.",
    },
    {
      question: 'What happens if an account creation fails?',
      answer: 'Our system has intelligent error recovery with exponential backoff. If a creation fails, we automatically retry with different strategies. You can see failure reasons in the analytics dashboard, and failed attempts don\'t count against your quota.',
    },
    {
      question: 'Can I integrate this with my own tools?',
      answer: 'Yes! Professional and Enterprise plans include full API access. You can trigger account creation programmatically, fetch account data, monitor job status, and integrate MyG InstaBot into your existing workflows or applications.',
    },
    {
      question: 'What kind of support do you offer?',
      answer: 'All plans include email support with response times under 24 hours. Professional plans get priority support, and Enterprise customers get 24/7 dedicated support with direct access to our engineering team. We also have comprehensive documentation and video tutorials.',
    },
  ]

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about MyG InstaBot
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-lg pr-4">{faq.question}</span>
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-instagram rounded-full flex items-center justify-center">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center glass rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
          <p className="text-gray-400 mb-6">
            Our team is here to help. Get in touch and we'll respond within 24 hours.
          </p>
          <motion.a
            href="mailto:support@myg-instabot.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-3 bg-gradient-instagram rounded-full font-bold btn-ripple"
          >
            Contact Support
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}


