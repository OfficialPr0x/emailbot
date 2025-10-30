import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cookie, Settings, Shield, Info } from 'lucide-react'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000"></div>
      </div>

      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="w-px h-6 bg-white/10"></div>
            <div className="flex items-center space-x-3">
              <Cookie className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold gradient-text">Cookie Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Hero */}
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black gradient-text mb-4">Cookie Policy</h2>
              <p className="text-gray-400">Last Updated: October 29, 2025</p>
              <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                This Cookie Policy explains how MyG InstaBot uses cookies and similar technologies.
              </p>
            </div>

            {/* What Are Cookies */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <Info className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">What Are Cookies?</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Cookies are small text files that are placed on your device when you visit a website. They help 
                websites remember your preferences, analyze site traffic, and improve user experience.
              </p>
              <p className="text-gray-300">
                Similar technologies include web beacons, pixels, and local storage, which serve similar purposes.
              </p>
            </section>

            {/* Types of Cookies */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Types of Cookies We Use</h3>

              <div className="space-y-6">
                <div className="glass p-6 rounded-xl border border-white/5">
                  <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                    <span className="text-2xl">🔒</span>
                    <span>Essential Cookies</span>
                  </h4>
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">Purpose:</strong> Required for the website to function properly
                  </p>
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">Examples:</strong> Authentication, security, session management
                  </p>
                  <p className="text-gray-400 text-sm">
                    These cookies cannot be disabled as they are necessary for the Service to work.
                  </p>
                </div>

                <div className="glass p-6 rounded-xl border border-white/5">
                  <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                    <span className="text-2xl">⚙️</span>
                    <span>Functional Cookies</span>
                  </h4>
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">Purpose:</strong> Remember your preferences and settings
                  </p>
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">Examples:</strong> Language preferences, theme selection, dashboard layout
                  </p>
                  <p className="text-gray-400 text-sm">
                    Disabling these may affect your user experience.
                  </p>
                </div>

                <div className="glass p-6 rounded-xl border border-white/5">
                  <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                    <span className="text-2xl">📊</span>
                    <span>Analytics Cookies</span>
                  </h4>
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">Purpose:</strong> Help us understand how visitors use our website
                  </p>
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">Examples:</strong> Page views, session duration, error tracking
                  </p>
                  <p className="text-gray-400 text-sm">
                    We use aggregated, anonymized data to improve our Service.
                  </p>
                </div>

                <div className="glass p-6 rounded-xl border border-white/5">
                  <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                    <span className="text-2xl">🎯</span>
                    <span>Performance Cookies</span>
                  </h4>
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">Purpose:</strong> Monitor and improve website performance
                  </p>
                  <p className="text-gray-300 mb-2">
                    <strong className="text-white">Examples:</strong> Load times, error rates, API response times
                  </p>
                  <p className="text-gray-400 text-sm">
                    Help us identify and fix performance issues.
                  </p>
                </div>
              </div>
            </section>

            {/* Specific Cookies */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Cookies We Use</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 text-white">Cookie Name</th>
                      <th className="py-3 text-white">Type</th>
                      <th className="py-3 text-white">Duration</th>
                      <th className="py-3 text-white">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300 text-sm">
                    <tr className="border-b border-white/5">
                      <td className="py-3"><code className="text-purple-300">session_id</code></td>
                      <td className="py-3">Essential</td>
                      <td className="py-3">Session</td>
                      <td className="py-3">Authentication</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3"><code className="text-purple-300">user_prefs</code></td>
                      <td className="py-3">Functional</td>
                      <td className="py-3">1 year</td>
                      <td className="py-3">User preferences</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3"><code className="text-purple-300">_ga</code></td>
                      <td className="py-3">Analytics</td>
                      <td className="py-3">2 years</td>
                      <td className="py-3">Google Analytics</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3"><code className="text-purple-300">theme</code></td>
                      <td className="py-3">Functional</td>
                      <td className="py-3">1 year</td>
                      <td className="py-3">Dark/light mode</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Third-Party Cookies</h3>
              <p className="text-gray-300 mb-4">
                We may use third-party services that place their own cookies on your device:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li><strong className="text-white">Google Analytics:</strong> For website analytics and insights</li>
                <li><strong className="text-white">CDN Providers:</strong> For content delivery and performance</li>
                <li><strong className="text-white">Authentication Services:</strong> For secure login functionality</li>
              </ul>
              <p className="text-gray-300 mt-4">
                These third parties have their own privacy policies governing their use of cookies.
              </p>
            </section>

            {/* Managing Cookies */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Managing Your Cookie Preferences</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-white mb-3">Browser Settings</h4>
                  <p className="text-gray-300 mb-3">
                    You can control cookies through your browser settings. Most browsers allow you to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                    <li>View what cookies are stored and delete them</li>
                    <li>Block third-party cookies</li>
                    <li>Block cookies from specific websites</li>
                    <li>Accept or reject all cookies</li>
                    <li>Delete all cookies when you close your browser</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-lg border border-white/5">
                    <h5 className="font-bold text-white mb-2">Chrome</h5>
                    <p className="text-sm text-gray-300">Settings → Privacy and security → Cookies</p>
                  </div>
                  <div className="glass p-4 rounded-lg border border-white/5">
                    <h5 className="font-bold text-white mb-2">Firefox</h5>
                    <p className="text-sm text-gray-300">Options → Privacy & Security → Cookies</p>
                  </div>
                  <div className="glass p-4 rounded-lg border border-white/5">
                    <h5 className="font-bold text-white mb-2">Safari</h5>
                    <p className="text-sm text-gray-300">Preferences → Privacy → Cookies</p>
                  </div>
                  <div className="glass p-4 rounded-lg border border-white/5">
                    <h5 className="font-bold text-white mb-2">Edge</h5>
                    <p className="text-sm text-gray-300">Settings → Privacy → Cookies</p>
                  </div>
                </div>

                <div className="glass p-4 rounded-lg border border-yellow-500/20">
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Note:</strong> Blocking or deleting cookies may affect your ability 
                    to use certain features of the Service.
                  </p>
                </div>
              </div>
            </section>

            {/* Do Not Track */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Do Not Track Signals</h3>
              <p className="text-gray-300">
                Some browsers include "Do Not Track" (DNT) features. Currently, there is no industry standard 
                for how to respond to DNT signals. MyG InstaBot does not currently respond to DNT signals, 
                but we respect your privacy choices through our cookie settings.
              </p>
            </section>

            {/* Cookie Duration */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Cookie Duration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass p-5 rounded-xl border border-white/5">
                  <h4 className="font-bold text-white mb-2">Session Cookies</h4>
                  <p className="text-gray-300 text-sm">
                    Temporary cookies that expire when you close your browser
                  </p>
                </div>
                <div className="glass p-5 rounded-xl border border-white/5">
                  <h4 className="font-bold text-white mb-2">Persistent Cookies</h4>
                  <p className="text-gray-300 text-sm">
                    Remain on your device until they expire or you delete them
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Changes to This Policy</h3>
              <p className="text-gray-300">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, 
                or our business operations. We will notify you of any material changes by posting the updated policy 
                on this page with a new "Last Updated" date.
              </p>
            </section>

            {/* More Information */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">More Information</h3>
              <p className="text-gray-300 mb-4">
                For more information about cookies and how they work, visit:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">AllAboutCookies.org</a></li>
                <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">YourOnlineChoices.com</a></li>
              </ul>
            </section>

            {/* Contact */}
            <section className="glass p-8 rounded-xl border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Contact Us</h3>
              </div>
              <p className="text-gray-300 mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong className="text-white">Email:</strong> privacy@myginstabot.com</p>
                <p><strong className="text-white">Privacy Policy:</strong> <Link to="/privacy-policy" className="text-purple-400 hover:text-purple-300 underline">View Privacy Policy</Link></p>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

