import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

export default function CountdownTimer({ targetDate = new Date('2025-11-15T12:00:00-05:00') }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="inline-flex items-center space-x-4">
      {/* Clock Icon */}
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-red-500 animate-pulse" />
        <span className="text-sm font-semibold text-gray-400">Launch In:</span>
      </div>

      {/* Time Units */}
      <div className="flex items-center space-x-2">
        {timeUnits.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <motion.div
              key={unit.value}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center glass px-3 py-2 rounded-lg min-w-[60px]"
            >
              <div className="text-2xl font-black gradient-text">
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 font-medium">{unit.label}</div>
            </motion.div>
            {index < timeUnits.length - 1 && (
              <div className="text-2xl font-black text-gray-600">:</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

