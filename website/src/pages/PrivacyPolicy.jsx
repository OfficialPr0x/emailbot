import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from 'lucide-react'

export default function PrivacyPolicy() {
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
              <Shield className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold gradient-text">Privacy Policy</h1>
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
              <h2 className="text-5xl font-black gradient-text mb-4">Privacy Policy</h2>
              <p className="text-gray-400">Last Updated: October 29, 2025</p>
              <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                Your privacy is important to us. This Privacy Policy explains how MyG InstaBot 
                collects, uses, and protects your personal information.
              </p>
            </div>

            {/* Information We Collect */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Information We Collect</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-white mb-2">Account Information</h4>
                  <p className="text-gray-300">
                    When you use MyG InstaBot, we collect and store account credentials (Gmail and Instagram) 
                    that you create through our service. This information is encrypted and stored securely in our database.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">Usage Data</h4>
                  <p className="text-gray-300">
                    We collect information about how you use our service, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 ml-4 mt-2 space-y-1">
                    <li>Account creation statistics and success rates</li>
                    <li>API requests and response times</li>
                    <li>Error logs and debugging information</li>
                    <li>System performance metrics</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">Technical Information</h4>
                  <p className="text-gray-300">
                    We automatically collect certain technical information, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 ml-4 mt-2 space-y-1">
                    <li>IP addresses (if you provide proxy information)</li>
                    <li>Browser type and version</li>
                    <li>Operating system information</li>
                    <li>Device identifiers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <Eye className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">How We Use Your Information</h3>
              </div>

              <div className="space-y-4 text-gray-300">
                <p>We use the collected information for the following purposes:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong className="text-white">Service Delivery:</strong> To create and manage social media accounts as requested</li>
                  <li><strong className="text-white">Platform Improvement:</strong> To analyze usage patterns and improve our service</li>
                  <li><strong className="text-white">Technical Support:</strong> To provide customer support and troubleshooting</li>
                  <li><strong className="text-white">Security:</strong> To detect and prevent fraud, abuse, and security issues</li>
                  <li><strong className="text-white">Communications:</strong> To send important updates and notifications about the service</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Data Security</h3>
              </div>

              <div className="space-y-4 text-gray-300">
                <p>We implement industry-standard security measures to protect your data:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong className="text-white">Encryption:</strong> All credentials are encrypted at rest and in transit</li>
                  <li><strong className="text-white">Access Control:</strong> Strict access controls limit who can view your data</li>
                  <li><strong className="text-white">Secure Storage:</strong> Data is stored in secure, monitored databases</li>
                  <li><strong className="text-white">Regular Audits:</strong> We conduct regular security audits and updates</li>
                </ul>

                <div className="glass p-4 rounded-lg border border-yellow-500/20 mt-4">
                  <p className="text-sm">
                    <strong className="text-white">Note:</strong> No method of transmission over the Internet is 100% secure. 
                    While we strive to protect your data, we cannot guarantee absolute security.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Data Sharing and Disclosure</h3>

              <div className="space-y-4 text-gray-300">
                <p className="font-semibold text-white">We do NOT sell your personal information.</p>
                <p>We may share your information only in the following circumstances:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong className="text-white">Service Providers:</strong> With trusted third-party services that help us operate (e.g., cloud hosting)</li>
                  <li><strong className="text-white">Legal Requirements:</strong> When required by law, regulation, or legal process</li>
                  <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong className="text-white">Your Consent:</strong> When you explicitly authorize us to share information</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Your Privacy Rights</h3>

              <div className="space-y-4 text-gray-300">
                <p>Depending on your location, you may have the following rights:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="glass p-4 rounded-lg border border-white/5">
                    <h4 className="font-bold text-white mb-2">Access</h4>
                    <p className="text-sm">Request access to your personal data</p>
                  </div>
                  <div className="glass p-4 rounded-lg border border-white/5">
                    <h4 className="font-bold text-white mb-2">Correction</h4>
                    <p className="text-sm">Request correction of inaccurate data</p>
                  </div>
                  <div className="glass p-4 rounded-lg border border-white/5">
                    <h4 className="font-bold text-white mb-2">Deletion</h4>
                    <p className="text-sm">Request deletion of your data</p>
                  </div>
                  <div className="glass p-4 rounded-lg border border-white/5">
                    <h4 className="font-bold text-white mb-2">Portability</h4>
                    <p className="text-sm">Request a copy of your data</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Cookies and Tracking</h3>
              <p className="text-gray-300 mb-4">
                We use cookies and similar technologies to enhance your experience. For detailed information, 
                please see our <Link to="/cookie-policy" className="text-purple-400 hover:text-purple-300 underline">Cookie Policy</Link>.
              </p>
            </section>

            {/* Data Retention */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Data Retention</h3>
              <p className="text-gray-300">
                We retain your personal information for as long as necessary to provide our services and comply 
                with legal obligations. Account data is retained while your account is active and for a reasonable 
                period afterward for backup and legal purposes.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Children's Privacy</h3>
              <p className="text-gray-300">
                MyG InstaBot is not intended for use by individuals under the age of 18. We do not knowingly 
                collect personal information from children. If you believe we have collected information from 
                a child, please contact us immediately.
              </p>
            </section>

            {/* International Transfers */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">International Data Transfers</h3>
              <p className="text-gray-300">
                Your information may be transferred to and processed in countries other than your country of 
                residence. These countries may have different data protection laws. We ensure appropriate 
                safeguards are in place to protect your information.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Changes to This Policy</h3>
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any material changes 
                by posting the new policy on this page and updating the "Last Updated" date. Your continued use 
                of the service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section className="glass p-8 rounded-xl border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <Mail className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Contact Us</h3>
              </div>
              <p className="text-gray-300 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong className="text-white">Email:</strong> privacy@myginstabot.com</p>
                <p><strong className="text-white">Support:</strong> <Link to="/support" className="text-purple-400 hover:text-purple-300 underline">Contact Support</Link></p>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

