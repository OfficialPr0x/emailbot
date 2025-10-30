import React, { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import SocialProofTicker from '../components/SocialProofTicker'
import StatsBar from '../components/StatsBar'
import ValueBreakdown from '../components/ValueBreakdown'
import Features from '../components/Features'
import ScarcityTiers from '../components/ScarcityTiers'
import HowItWorks from '../components/HowItWorks'
import Dashboard from '../components/Dashboard'
import FounderPerks from '../components/FounderPerks'
import ComparisonTable from '../components/ComparisonTable'
import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'
import RiskReversal from '../components/RiskReversal'
import FAQ from '../components/FAQ'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import ExitIntentModal from '../components/ExitIntentModal'
import PaymentModal from '../components/PaymentModal'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-4000"></div>
      </div>

      <Navigation scrolled={scrolled} />
      <Hero />
      <SocialProofTicker />
      <StatsBar />
      <ValueBreakdown />
      <Features />
      <ScarcityTiers />
      <HowItWorks />
      <Dashboard />
      <FounderPerks />
      <ComparisonTable />
      <Pricing />
      <Testimonials />
      <RiskReversal />
      <FAQ />
      <CTA />
      <Footer />
      
      {/* Exit Intent Modal */}
      <ExitIntentModal onOpenPaymentModal={() => setIsPaymentModalOpen(true)} />
      
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />
    </div>
  )
}

