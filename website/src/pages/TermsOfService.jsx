import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsOfService() {
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
              <FileText className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold gradient-text">Terms of Service</h1>
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
              <h2 className="text-5xl font-black gradient-text mb-4">Terms of Service</h2>
              <p className="text-gray-400">Last Updated: October 29, 2025</p>
              <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                Please read these Terms of Service carefully before using MyG InstaBot.
              </p>
            </div>

            {/* Acceptance */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <Scale className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">1. Acceptance of Terms</h3>
              </div>
              <p className="text-gray-300">
                By accessing or using MyG InstaBot ("the Service"), you agree to be bound by these Terms of Service 
                ("Terms"). If you do not agree to these Terms, you may not use the Service. We reserve the right to 
                modify these Terms at any time, and your continued use constitutes acceptance of any changes.
              </p>
            </section>

            {/* Service Description */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">2. Service Description</h3>
              <p className="text-gray-300 mb-4">
                MyG InstaBot provides automation software for creating and managing social media accounts. The Service includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li>Automated Gmail account creation</li>
                <li>Automated Instagram account setup</li>
                <li>Account management dashboard</li>
                <li>API access for integration</li>
                <li>Analytics and monitoring tools</li>
              </ul>
            </section>

            {/* Eligibility */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">3. Eligibility</h3>
              <div className="space-y-4 text-gray-300">
                <p>To use the Service, you must:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into binding contracts</li>
                  <li>Not be prohibited from using the Service under applicable laws</li>
                  <li>Comply with all local, state, national, and international laws</li>
                </ul>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">4. User Responsibilities</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white mb-2">You agree to:</h4>
                  <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                    <li>Use the Service only for lawful purposes</li>
                    <li>Comply with all applicable platform Terms of Service (Gmail, Instagram)</li>
                    <li>Not engage in any activity that could harm or impair the Service</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Use reasonable rate limiting to avoid detection</li>
                    <li>Not share or resell access to the Service without authorization</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">You agree NOT to:</h4>
                  <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                    <li>Use the Service for spam, fraud, or illegal activities</li>
                    <li>Attempt to reverse engineer or modify the Service</li>
                    <li>Create accounts for harassment, abuse, or malicious purposes</li>
                    <li>Violate intellectual property rights</li>
                    <li>Bypass any security features or rate limits</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Platform Compliance */}
            <section className="glass p-8 rounded-xl border border-yellow-500/20">
              <div className="flex items-start space-x-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">5. Third-Party Platform Compliance</h3>
                  <p className="text-gray-300 mb-4">
                    You acknowledge and agree that:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                    <li>You are solely responsible for complying with Gmail and Instagram Terms of Service</li>
                    <li>Automated account creation may violate platform policies</li>
                    <li>You use the Service at your own risk regarding platform compliance</li>
                    <li>We are not responsible for account suspensions or bans</li>
                    <li>Platform policies may change without notice</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">6. Intellectual Property</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  All content, features, and functionality of the Service, including but not limited to software, 
                  text, graphics, logos, and trademarks, are owned by MyG InstaBot and protected by copyright, 
                  trademark, and other intellectual property laws.
                </p>
                <p>
                  You may not copy, modify, distribute, sell, or lease any part of the Service without our 
                  express written permission.
                </p>
              </div>
            </section>

            {/* Payment and Fees */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">7. Payment and Fees</h3>
              <div className="space-y-4 text-gray-300">
                <p>If you purchase a paid subscription:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Fees are billed in advance on a recurring basis</li>
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>We reserve the right to change pricing with notice</li>
                  <li>You are responsible for all applicable taxes</li>
                  <li>Payment information is processed securely</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="glass p-8 rounded-xl border border-red-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">8. Limitation of Liability</h3>
              <div className="space-y-4 text-gray-300">
                <p className="font-bold text-white">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</p>
                <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>We do not guarantee uninterrupted or error-free operation</li>
                  <li>We are not liable for account suspensions or bans from third-party platforms</li>
                  <li>We are not responsible for data loss or security breaches</li>
                  <li>Our total liability shall not exceed the amount paid by you in the past 12 months</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                </ul>
              </div>
            </section>

            {/* Indemnification */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">9. Indemnification</h3>
              <p className="text-gray-300">
                You agree to indemnify and hold harmless MyG InstaBot, its officers, directors, employees, and 
                agents from any claims, damages, losses, liabilities, and expenses arising from your use of the 
                Service or violation of these Terms.
              </p>
            </section>

            {/* Termination */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">10. Termination</h3>
              <div className="space-y-4 text-gray-300">
                <p>We reserve the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Suspend or terminate your access at any time for any reason</li>
                  <li>Terminate accounts that violate these Terms</li>
                  <li>Remove or disable content that violates policies</li>
                </ul>
                <p className="mt-4">
                  You may terminate your account at any time by contacting support. Upon termination, your right 
                  to use the Service ceases immediately.
                </p>
              </div>
            </section>

            {/* Disclaimer of Educational Use */}
            <section className="glass p-8 rounded-xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">11. Educational and Research Use</h3>
              <p className="text-gray-300">
                MyG InstaBot is provided primarily for educational and research purposes. Users are responsible 
                for ensuring their use complies with all applicable laws, regulations, and third-party Terms of Service. 
                We do not endorse or encourage any activities that violate platform policies or applicable laws.
              </p>
            </section>

            {/* Governing Law */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">12. Governing Law</h3>
              <p className="text-gray-300">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                in which MyG InstaBot operates, without regard to conflict of law principles.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">13. Dispute Resolution</h3>
              <p className="text-gray-300">
                Any disputes arising from these Terms or the Service shall be resolved through binding arbitration, 
                except where prohibited by law. You waive your right to participate in class action lawsuits.
              </p>
            </section>

            {/* Modifications */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">14. Modifications to Service</h3>
              <p className="text-gray-300">
                We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any 
                time with or without notice. We shall not be liable to you or any third party for any modification, 
                suspension, or discontinuance.
              </p>
            </section>

            {/* Severability */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">15. Severability</h3>
              <p className="text-gray-300">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions 
                shall remain in full force and effect.
              </p>
            </section>

            {/* Entire Agreement */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">16. Entire Agreement</h3>
              <p className="text-gray-300">
                These Terms constitute the entire agreement between you and MyG InstaBot regarding the Service 
                and supersede all prior agreements and understandings.
              </p>
            </section>

            {/* Contact */}
            <section className="glass p-8 rounded-xl border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <h3 className="text-2xl font-bold text-white">Contact Information</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Questions about these Terms? Contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong className="text-white">Email:</strong> legal@myginstabot.com</p>
                <p><strong className="text-white">Support:</strong> <Link to="/support" className="text-purple-400 hover:text-purple-300 underline">Contact Support</Link></p>
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-gray-400">
                  By using MyG InstaBot, you acknowledge that you have read, understood, and agree to be bound 
                  by these Terms of Service.
                </p>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

