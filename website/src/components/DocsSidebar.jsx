import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Rocket, 
  Settings, 
  Database, 
  Code, 
  Zap,
  Shield,
  GitBranch
} from 'lucide-react'

const sections = [
  {
    title: 'Getting Started',
    icon: Rocket,
    items: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'quick-start', label: 'Quick Start' },
      { id: 'installation', label: 'Installation' },
      { id: 'configuration', label: 'Configuration' },
    ]
  },
  {
    title: 'Core Concepts',
    icon: BookOpen,
    items: [
      { id: 'architecture', label: 'Architecture' },
      { id: 'workflow', label: 'Workflow' },
      { id: 'browser-automation', label: 'Browser Automation' },
      { id: 'ai-profiles', label: 'AI Profile Generation' },
    ]
  },
  {
    title: 'Features',
    icon: Zap,
    items: [
      { id: 'gmail-creation', label: 'Gmail Creation' },
      { id: 'instagram-setup', label: 'Instagram Setup' },
      { id: 'proxy-support', label: 'Proxy Support' },
      { id: 'error-handling', label: 'Error Handling' },
    ]
  },
  {
    title: 'Database',
    icon: Database,
    items: [
      { id: 'schema', label: 'Database Schema' },
      { id: 'models', label: 'Data Models' },
      { id: 'migrations', label: 'Migrations' },
    ]
  },
  {
    title: 'Advanced',
    icon: Code,
    items: [
      { id: 'customization', label: 'Customization' },
      { id: 'scaling', label: 'Scaling' },
      { id: 'deployment', label: 'Deployment' },
      { id: 'best-practices', label: 'Best Practices' },
    ]
  },
  {
    title: 'Security',
    icon: Shield,
    items: [
      { id: 'stealth-mode', label: 'Stealth Mode' },
      { id: 'detection-avoidance', label: 'Detection Avoidance' },
      { id: 'rate-limiting', label: 'Rate Limiting' },
    ]
  },
]

export default function DocsSidebar({ activeSection, onSectionChange }) {
  return (
    <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pb-8">
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center space-x-2 mb-3">
              <section.icon className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            <ul className="space-y-1 ml-6 border-l border-white/10">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSectionChange(item.id)}
                    className={`
                      w-full text-left px-4 py-2 text-sm rounded-r-lg transition-all duration-200
                      ${activeSection === item.id
                        ? 'bg-gradient-instagram text-white font-semibold border-l-2 border-purple-500'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Scroll to top button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="mt-6 w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
      >
        Scroll to Top
      </motion.button>
    </div>
  )
}

