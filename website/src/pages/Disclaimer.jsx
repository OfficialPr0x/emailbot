import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Scale, ShieldAlert, Info } from 'lucide-react'

export default function Disclaimer() {
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
              <AlertTriangle className="w-6 h-6 text-purple-400" />
              <h1 className="text-xl font-bold gradient-text">Disclaimer</h1>
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
              <h2 className="text-5xl font-black gradient-text mb-4">Disclaimer</h2>
              <p className="text-gray-400">Last Updated: October 29, 2025</p>
              <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                Important information about the use and limitations of MyG InstaBot.
              </p>
            </div>

            {/* General Disclaimer */}
            <section className="glass p-8 rounded-xl border border-yellow-500/20">
              <div className="flex items-start space-x-3 mb-6">
                <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">General Disclaimer</h3>
                  <p className="text-gray-300 mb-4">
                    The information and services provided by MyG InstaBot are for <strong className="text-white">educational 
                    and research purposes only</strong>. By using this software, you acknowledge and agree to the following terms:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>You use MyG InstaBot entirely at your own risk</li>
                    <li>We make no guarantees about the effectiveness or results</li>
                    <li>You are solely responsible for compliance with all applicable laws and platform terms</li>
                    <li>We disclaim all liability for any consequences arising from your use</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Platform Compliance */}
            <section className="glass p-8 rounded-xl border border-red-500/20">
              <div className="flex items-start space-x-3 mb-6">
                <ShieldAlert className="w-8 h-8 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Third-Party Platform Policies</h3>
                  <div className="space-y-4 text-gray-300">
                    <p className="font-bold text-white">
                      IMPORTANT: Automated account creation may violate the Terms of Service of Gmail and Instagram.
                    </p>
                    <p>
                      MyG InstaBot automates interactions with third-party platforms (Gmail and Instagram). 
                      These platforms have strict Terms of Service that may prohibit automation:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                      <li>Gmail Terms of Service prohibit certain automated activities</li>
                      <li>Instagram Terms of Service restrict automation and bot usage</li>
                      <li>Violating these terms may result in account suspension or permanent bans</li>
                      <li>You may face legal consequences for violating platform policies</li>
                    </ul>
                    <p className="mt-4 font-bold text-white">
                      You acknowledge that you are solely responsible for complying with all third-party Terms of Service.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* No Warranties */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">No Warranties</h3>
              <div className="space-y-4 text-gray-300">
                <p className="font-bold text-white uppercase">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND.
                </p>
                <p>We specifically disclaim:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Warranties of merchantability or fitness for a particular purpose</li>
                  <li>Warranties that the service will be uninterrupted or error-free</li>
                  <li>Warranties regarding the accuracy or reliability of results</li>
                  <li>Warranties that accounts created will remain active or functional</li>
                  <li>Any implied warranties arising from course of dealing or usage of trade</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Limitation of Liability</h3>
              <div className="space-y-4 text-gray-300">
                <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>We are not liable for any account suspensions, bans, or deletions</li>
                  <li>We are not liable for any data loss or security breaches</li>
                  <li>We are not liable for any financial losses or business interruptions</li>
                  <li>We are not liable for any legal consequences you may face</li>
                  <li>We are not liable for any indirect, incidental, or consequential damages</li>
                  <li>Our maximum liability shall not exceed the amount you paid us in the past 12 months</li>
                </ul>
              </div>
            </section>

            {/* No Professional Advice */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">No Professional Advice</h3>
              <p className="text-gray-300">
                The information provided through MyG InstaBot does not constitute legal, financial, or professional advice. 
                You should consult with appropriate professionals before using automation software in a business context. 
                We recommend consulting with:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 mt-3 space-y-1">
                <li>Legal counsel regarding compliance with laws and regulations</li>
                <li>Compliance experts regarding platform Terms of Service</li>
                <li>Security professionals regarding data protection</li>
              </ul>
            </section>

            {/* Results Disclaimer */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">No Guarantee of Results</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  We make no representations or guarantees about:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Success rates for account creation</li>
                  <li>Account longevity or functionality</li>
                  <li>Platform acceptance of created accounts</li>
                  <li>Ability to bypass detection or verification systems</li>
                  <li>Specific business outcomes or revenue generation</li>
                </ul>
                <p className="mt-4">
                  Past performance and success rates do not guarantee future results. Platform policies and 
                  detection methods change frequently and without notice.
                </p>
              </div>
            </section>

            {/* Legal Compliance */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <Scale className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Legal Compliance</h3>
              </div>
              <div className="space-y-4 text-gray-300">
                <p className="font-bold text-white">
                  You are responsible for ensuring your use of MyG InstaBot complies with all applicable laws.
                </p>
                <p>This includes, but is not limited to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Computer Fraud and Abuse Act (CFAA) and similar laws</li>
                  <li>Digital Millennium Copyright Act (DMCA)</li>
                  <li>General Data Protection Regulation (GDPR) if applicable</li>
                  <li>California Consumer Privacy Act (CCPA) if applicable</li>
                  <li>Anti-spam laws (CAN-SPAM Act, etc.)</li>
                  <li>Local, state, and federal regulations in your jurisdiction</li>
                </ul>
              </div>
            </section>

            {/* Third-Party Services */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Third-Party Services</h3>
              <p className="text-gray-300">
                MyG InstaBot may integrate with or reference third-party services, websites, or resources. 
                We have no control over and assume no responsibility for the content, privacy policies, or 
                practices of any third-party services. You acknowledge and agree that we shall not be liable 
                for any damage or loss caused by your use of any third-party services.
              </p>
            </section>

            {/* Technical Limitations */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Technical Limitations</h3>
              <p className="text-gray-300 mb-4">
                You acknowledge that:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li>The software may have bugs, errors, or technical limitations</li>
                <li>Platform changes may break functionality without warning</li>
                <li>We cannot guarantee compatibility with all systems or configurations</li>
                <li>Performance may vary based on network conditions and system resources</li>
                <li>Updates and maintenance may cause temporary service interruptions</li>
              </ul>
            </section>

            {/* User Responsibility */}
            <section className="glass p-8 rounded-xl border border-purple-500/20">
              <div className="flex items-start space-x-3 mb-6">
                <Info className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Your Responsibilities</h3>
                  <p className="text-gray-300 mb-4">
                    By using MyG InstaBot, you agree that you are solely responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Understanding and complying with all applicable laws and regulations</li>
                    <li>Reading and complying with third-party platform Terms of Service</li>
                    <li>Implementing appropriate security measures for your data</li>
                    <li>Monitoring your account creation activities</li>
                    <li>Any consequences arising from your use of the service</li>
                    <li>Determining the legality of your use in your jurisdiction</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Indemnification */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Indemnification</h3>
              <p className="text-gray-300">
                You agree to indemnify, defend, and hold harmless MyG InstaBot, its owners, operators, employees, 
                and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising 
                from your use of the Service or violation of these terms, third-party rights, or applicable laws.
              </p>
            </section>

            {/* Updates */}
            <section className="glass p-8 rounded-xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Updates to Disclaimer</h3>
              <p className="text-gray-300">
                We reserve the right to update this Disclaimer at any time without prior notice. Changes become 
                effective immediately upon posting. Your continued use of the Service after changes constitutes 
                acceptance of the updated Disclaimer.
              </p>
            </section>

            {/* Final Warning */}
            <section className="glass p-8 rounded-xl border border-red-500/20">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Final Warning</h3>
                  <p className="text-gray-300 mb-4 font-bold text-white">
                    USE OF THIS SOFTWARE MAY RESULT IN:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Permanent suspension or banning of created accounts</li>
                    <li>IP address blacklisting</li>
                    <li>Legal action from platform providers</li>
                    <li>Violation of Terms of Service</li>
                    <li>Potential legal consequences in your jurisdiction</li>
                  </ul>
                  <p className="mt-4 text-gray-300">
                    <strong className="text-white">By using MyG InstaBot, you acknowledge that you have read, understood, 
                    and accept all risks associated with its use.</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="glass p-8 rounded-xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Questions?</h3>
              <p className="text-gray-300 mb-4">
                If you have questions about this Disclaimer:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong className="text-white">Email:</strong> legal@myginstabot.com</p>
                <p><strong className="text-white">Terms of Service:</strong> <Link to="/terms-of-service" className="text-purple-400 hover:text-purple-300 underline">View Terms</Link></p>
                <p><strong className="text-white">Privacy Policy:</strong> <Link to="/privacy-policy" className="text-purple-400 hover:text-purple-300 underline">View Privacy</Link></p>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

