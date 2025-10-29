import React from 'react'
import { motion } from 'framer-motion'
import { Monitor, Smartphone, Tablet } from 'lucide-react'

export default function Dashboard() {
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
            A Dashboard You'll{' '}
            <span className="gradient-text">Actually Love</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Forget clunky interfaces. We built a gorgeous, Instagram-inspired dashboard 
            that makes managing thousands of accounts feel effortless.
          </p>
        </motion.div>

        {/* Device Mockups */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Main Dashboard Preview */}
          <div className="relative glass rounded-3xl p-4 glow max-w-6xl mx-auto">
            {/* Browser Chrome */}
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-white/10">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="glass rounded-lg px-4 py-1 text-sm text-gray-400">
                  https://myg-instabot.com/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-3">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-instagram rounded-xl"></div>
                    <div>
                      <div className="font-bold">MyG InstaBot</div>
                      <div className="text-xs text-gray-400">Dashboard</div>
                    </div>
                  </div>
                  {['Dashboard', 'Accounts', 'Create', 'Analytics', 'Settings'].map((item, i) => (
                    <div
                      key={i}
                      className={`px-4 py-2 rounded-xl ${
                        i === 0
                          ? 'bg-gradient-instagram'
                          : 'bg-white/5 hover:bg-white/10'
                      } transition-colors cursor-pointer`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Active', value: '847' },
                      { label: 'Today', value: '124' },
                      { label: 'Success', value: '99.2%' },
                    ].map((stat, i) => (
                      <div key={i} className="glass p-4 rounded-xl">
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="glass p-4 rounded-xl">
                    <div className="text-sm text-gray-400 mb-3">Account Creation Trend</div>
                    <div className="h-32 flex items-end space-x-1">
                      {[40, 70, 45, 80, 60, 90, 75, 85, 70, 95, 80, 88].map((height, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 bg-gradient-instagram rounded-t"
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Recent Accounts */}
                  <div className="glass p-4 rounded-xl">
                    <div className="text-sm text-gray-400 mb-3">Recent Accounts</div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                          <div className="w-8 h-8 bg-gradient-purple rounded-full"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">sarah_marketing_2024</div>
                            <div className="text-xs text-gray-500">2 minutes ago</div>
                          </div>
                          <div className="text-xs glass px-2 py-1 rounded text-green-400">Active</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Feature Pills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="absolute -left-4 top-1/4 hidden xl:block"
          >
            <div className="glass p-3 rounded-full">
              <div className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">Desktop</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="absolute -right-4 top-1/3 hidden xl:block"
          >
            <div className="glass p-3 rounded-full">
              <div className="flex items-center space-x-2">
                <Tablet className="w-5 h-5 text-pink-400" />
                <span className="text-sm font-medium">Tablet</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="absolute -right-4 bottom-1/4 hidden xl:block"
          >
            <div className="glass p-3 rounded-full">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Mobile</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'Real-Time Updates',
              description: 'WebSocket-powered live monitoring. See every account creation as it happens.',
            },
            {
              title: 'Beautiful Analytics',
              description: 'Charts, graphs, and insights that actually matter. Track performance effortlessly.',
            },
            {
              title: 'Fully Responsive',
              description: 'Manage your accounts from any device. Desktop, tablet, or mobile—it just works.',
            },
          ].map((feature, i) => (
            <div key={i} className="text-center">
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


