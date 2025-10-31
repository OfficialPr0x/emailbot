import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Flame, Image as ImageIcon, Video, Grid, Sparkles, Download, Plus, 
  Loader2, Zap, Sliders, Play, Clock, Wand2, LayoutGrid, ChevronRight,
  Star, TrendingUp
} from 'lucide-react'
import { useStudioContext } from '@/contexts/StudioContext'
import studioAPI from '@/services/studioAPI'
import { fadeInUp, fadeInScale, staggerChildren, childVariant } from '@/lib/animations'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'

const GENERATION_MODES = [
  { id: 'image', name: 'Image', icon: ImageIcon, gradient: 'from-purple-500 to-pink-500' },
  { id: 'video', name: 'Video', icon: Video, gradient: 'from-orange-500 to-red-500' },
  { id: 'batch', name: 'Batch', icon: LayoutGrid, gradient: 'from-cyan-500 to-blue-500' },
  { id: 'storyboard', name: 'Storyboard', icon: Grid, gradient: 'from-emerald-500 to-teal-500' },
]

const STYLE_PRESETS = [
  { id: 'minimalist', name: 'Minimalist', color: 'from-slate-400 to-slate-600', emoji: '🎯' },
  { id: 'aesthetic', name: 'Aesthetic', color: 'from-pink-400 to-purple-600', emoji: '✨' },
  { id: 'bold', name: 'Bold', color: 'from-orange-500 to-red-600', emoji: '🔥' },
  { id: 'dark', name: 'Dark Mode', color: 'from-slate-700 to-black', emoji: '🌙' },
  { id: 'lifestyle', name: 'Lifestyle', color: 'from-teal-400 to-cyan-500', emoji: '🌊' },
  { id: 'neon', name: 'Neon Pop', color: 'from-fuchsia-500 to-cyan-400', emoji: '💫' },
]

export default function CreatorReactorModule() {
  const { accountId } = useStudioContext()
  
  // Generation State
  const [activeMode, setActiveMode] = useState('image')
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('minimalist')
  const [temperature, setTemperature] = useState(0.7)
  const [size, setSize] = useState('1024x1024')
  const [duration, setDuration] = useState(5)
  const [batchCount, setBatchCount] = useState(4)
  
  // Results
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [generationHistory, setGenerationHistory] = useState([])
  
  // Presets
  const [presets, setPresets] = useState([])

  useEffect(() => {
    loadPresets()
    loadHistory()
  }, [accountId])

  useEffect(() => {
    // Simulate generation progress
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) return prev
          return prev + Math.random() * 10
        })
      }, 300)
      return () => clearInterval(interval)
    } else {
      setGenerationProgress(0)
    }
  }, [isGenerating])

  const loadPresets = async () => {
    try {
      const response = await studioAPI.getReactorPresets(accountId)
      setPresets(response.data.data || [])
    } catch (error) {
      console.error('Failed to load presets:', error)
    }
  }

  const loadHistory = async () => {
    try {
      const response = await studioAPI.getReactorHistory(accountId)
      setGenerationHistory(response.data.data || [])
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    try {
      setIsGenerating(true)
      setGeneratedContent(null)
      setGenerationProgress(0)

      let response
      if (activeMode === 'image') {
        response = await studioAPI.generateReactorImage(accountId, {
          prompt,
          style: selectedStyle,
          size,
          temperature,
        })
      } else if (activeMode === 'video') {
        response = await studioAPI.generateReactorVideo(accountId, {
          prompt,
          style: selectedStyle,
          duration,
          temperature,
        })
      } else if (activeMode === 'batch') {
        response = await studioAPI.generateReactorBatch(accountId, {
          prompt,
          style: selectedStyle,
          count: batchCount,
          temperature,
        })
      }

      setGenerationProgress(100)
      setGeneratedContent(response.data.data)
      loadHistory() // Reload history
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Generation failed. Please try again.')
    } finally {
      setTimeout(() => setIsGenerating(false), 500)
    }
  }

  const getTemperatureColor = (temp) => {
    if (temp < 0.4) return 'from-blue-500 to-cyan-400'
    if (temp < 0.7) return 'from-purple-500 to-pink-500'
    return 'from-orange-500 to-red-500'
  }

  const getTemperatureLabel = (temp) => {
    if (temp < 0.4) return 'Precise'
    if (temp < 0.7) return 'Balanced'
    return 'Creative'
  }

  return (
    <motion.div
      className="h-full"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 20px rgba(249, 115, 22, 0.3)',
                '0 0 40px rgba(239, 68, 68, 0.4)',
                '0 0 20px rgba(236, 72, 153, 0.3)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Flame className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold gradient-text-reactor smooth-text">
              Creator Reactor
            </h1>
            <p className="text-sm text-slate-400 smooth-text">
              AI-Powered Content Creation Nucleus
            </p>
          </div>
        </div>
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-5 gap-6 h-[calc(100vh-240px)]">
        {/* Left Panel: Prompt Studio (40%) */}
        <div className="col-span-2 space-y-4 overflow-y-auto pr-2">
          {/* Mode Selector */}
          <motion.div
            className="glass-medium rounded-2xl p-4 neu-shadow-md"
            variants={fadeInScale}
          >
            <Label className="text-sm font-semibold text-slate-200 mb-3 block">
              Generation Mode
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {GENERATION_MODES.map((mode) => {
                const Icon = mode.icon
                const isActive = activeMode === mode.id
                
                return (
                  <motion.button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`
                      relative p-3 rounded-xl transition-all
                      ${isActive ? 'glass-medium' : 'glass-light hover:glass-medium'}
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${mode.gradient} opacity-20`}
                        layoutId="activeMode"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <div className="relative flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {mode.name}
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Prompt Input */}
          <motion.div
            className="glass-medium rounded-2xl p-4 neu-shadow-md"
            variants={fadeInScale}
          >
            <Label className="text-sm font-semibold text-slate-200 mb-3 block">
              Creative Prompt
            </Label>
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.01 }}
            >
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your vision... The more detailed, the better!"
                className="min-h-[120px] glass-light border-white/10 focus:border-purple-500/50 text-white placeholder-slate-500 resize-none"
                style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                }}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                {prompt.length} characters
              </div>
            </motion.div>
          </motion.div>

          {/* Style Presets */}
          <motion.div
            className="glass-medium rounded-2xl p-4 neu-shadow-md"
            variants={fadeInScale}
          >
            <Label className="text-sm font-semibold text-slate-200 mb-3 block">
              Style Preset
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_PRESETS.map((preset) => {
                const isActive = selectedStyle === preset.id
                
                return (
                  <motion.button
                    key={preset.id}
                    onClick={() => setSelectedStyle(preset.id)}
                    className={`
                      relative p-3 rounded-lg transition-all text-center
                      ${isActive ? 'glass-medium' : 'glass-light hover:glass-medium'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${preset.color} opacity-20`}
                        layoutId="activePreset"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <div className="relative">
                      <div className="text-2xl mb-1">{preset.emoji}</div>
                      <div className={`text-xs font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {preset.name}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Temperature Slider */}
          <motion.div
            className="glass-medium rounded-2xl p-4 neu-shadow-md"
            variants={fadeInScale}
          >
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-semibold text-slate-200">
                AI Temperature
              </Label>
              <span className={`text-xs font-bold bg-gradient-to-r ${getTemperatureColor(temperature)} bg-clip-text text-transparent`}>
                {getTemperatureLabel(temperature)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  rgb(59 130 246) 0%, 
                  rgb(168 85 247) 50%, 
                  rgb(239 68 68) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </motion.div>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`
              w-full py-4 rounded-xl font-semibold text-white relative overflow-hidden
              ${!prompt.trim() || isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%)',
            }}
            whileHover={prompt.trim() && !isGenerating ? { scale: 1.02 } : {}}
            whileTap={prompt.trim() && !isGenerating ? { scale: 0.98 } : {}}
          >
            {isGenerating && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
            <div className="relative flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating... {Math.round(generationProgress)}%</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Generate {activeMode === 'batch' ? `${batchCount} Variants` : activeMode.charAt(0).toUpperCase() + activeMode.slice(1)}</span>
                </>
              )}
            </div>
          </motion.button>
        </div>

        {/* Right Panel: Living Canvas (60%) */}
        <div className="col-span-3 overflow-y-auto">
          <AnimatePresence mode="wait">
            {generatedContent ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="space-y-4"
              >
                {/* Generated Content Display */}
                {activeMode === 'batch' && generatedContent.results ? (
                  // Batch Grid
                  <div className="grid grid-cols-2 gap-4">
                    {generatedContent.results.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-medium rounded-2xl overflow-hidden neu-shadow-lg hover-lift"
                        whileHover={{ scale: 1.02, y: -4 }}
                      >
                        <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 relative">
                          {item.url ? (
                            <img src={item.url} alt={`Generated ${index + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Sparkles className="w-12 h-12 text-slate-600" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">Variant #{index + 1}</span>
                            <motion.button
                              className="glass-light p-2 rounded-lg"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Download className="w-4 h-4 text-slate-300" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Single Content
                  <motion.div
                    className="glass-medium rounded-2xl overflow-hidden neu-shadow-xl"
                    layout
                  >
                    <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative">
                      {generatedContent.url ? (
                        activeMode === 'video' ? (
                          <video src={generatedContent.url} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={generatedContent.url} alt="Generated content" className="w-full h-full object-cover" />
                        )
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-16 h-16 text-slate-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white smooth-text">
                            {activeMode === 'video' ? 'Generated Video' : 'Generated Image'}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">{generatedContent.metadata?.model || 'AI Model v1'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            className="glass-light px-4 py-2 rounded-lg flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Download className="w-4 h-4 text-slate-300" />
                            <span className="text-sm text-slate-300">Download</span>
                          </motion.button>
                        </div>
                      </div>
                      <div className="glass-light rounded-lg p-3">
                        <p className="text-xs text-slate-400 mb-1">Prompt Used:</p>
                        <p className="text-sm text-slate-200">{generatedContent.prompt}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // Empty State
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Flame className="w-12 h-12 text-orange-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2 smooth-text">
                    Ready to Create Magic
                  </h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto smooth-text">
                    Enter your creative prompt and select your preferences.
                    The Reactor will generate stunning content in seconds.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
