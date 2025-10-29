import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function StatsBar() {
  const [counts, setCounts] = useState({
    accounts: 0,
    success: 0,
    proxies: 0,
    uptime: 0,
  })

  useEffect(() => {
    const targetCounts = {
      accounts: 15847,
      success: 99.2,
      proxies: 100,
      uptime: 99.9,
    }

    const duration = 2000 // 2 seconds
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounts({
        accounts: Math.floor(targetCounts.accounts * progress),
        success: (targetCounts.success * progress).toFixed(1),
        proxies: Math.floor(targetCounts.proxies * progress),
        uptime: (targetCounts.uptime * progress).toFixed(1),
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounts(targetCounts)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      label: 'Accounts Created',
      value: counts.accounts.toLocaleString(),
      suffix: '+',
    },
    {
      label: 'Success Rate',
      value: counts.success,
      suffix: '%',
    },
    {
      label: 'Premium Proxies',
      value: counts.proxies,
      suffix: '',
    },
    {
      label: 'Uptime',
      value: counts.uptime,
      suffix: '%',
    },
  ]

  return (
    <section className="py-12 border-y border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


