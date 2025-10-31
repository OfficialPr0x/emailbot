import { useEffect, useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Globe from 'react-globe.gl'
import { geocodeAccounts, calculateDistance } from '@/lib/geocoding'
import { Loader2 } from 'lucide-react'

const STATUS_COLORS = {
  active: '#10b981',    // Emerald green
  pending: '#f59e0b',   // Amber yellow
  failed: '#ef4444',    // Red
  suspended: '#6b7280', // Gray
}

export default function GlobeView({ accounts, onAccountClick }) {
  const globeRef = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const containerRef = useRef()

  // Geocode accounts and prepare for globe
  const geocodedAccounts = useMemo(() => {
    return geocodeAccounts(accounts)
  }, [accounts])

  // Generate connection arcs between nearby accounts (hive mind effect)
  const connectionArcs = useMemo(() => {
    const arcs = []
    const maxDistance = 500 // km - only connect nearby accounts
    
    for (let i = 0; i < geocodedAccounts.length; i++) {
      for (let j = i + 1; j < geocodedAccounts.length; j++) {
        const acc1 = geocodedAccounts[i]
        const acc2 = geocodedAccounts[j]
        
        if (!acc1.coordinates || !acc2.coordinates) continue
        
        const distance = calculateDistance(
          acc1.coordinates.lat,
          acc1.coordinates.lng,
          acc2.coordinates.lat,
          acc2.coordinates.lng
        )
        
        if (distance <= maxDistance) {
          arcs.push({
            startLat: acc1.coordinates.lat,
            startLng: acc1.coordinates.lng,
            endLat: acc2.coordinates.lat,
            endLng: acc2.coordinates.lng,
            color: [
              STATUS_COLORS[acc1.status] || STATUS_COLORS.pending,
              STATUS_COLORS[acc2.status] || STATUS_COLORS.pending,
            ],
          })
        }
      }
    }
    
    return arcs
  }, [geocodedAccounts])

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    
    // Initial load delay for smooth animation
    const timer = setTimeout(() => setIsLoading(false), 500)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      clearTimeout(timer)
    }
  }, [])

  // Auto-rotate globe
  useEffect(() => {
    if (globeRef.current && !isLoading) {
      const controls = globeRef.current.controls()
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.5
      controls.enableZoom = true
      controls.enablePan = false
      controls.minDistance = 200
      controls.maxDistance = 600
    }
  }, [isLoading])

  // Custom point label for tooltip
  const getPointLabel = (account) => {
    if (!account) return ''
    
    const statusColor = STATUS_COLORS[account.status] || STATUS_COLORS.pending
    
    return `
      <div style="
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(12px);
        border: 1px solid ${statusColor};
        border-radius: 12px;
        padding: 12px 16px;
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        min-width: 200px;
      ">
        <div style="
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          color: ${statusColor};
        ">
          @${account.username || 'N/A'}
        </div>
        <div style="
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 4px;
        ">
          ${account.location || 'Unknown location'}
        </div>
        <div style="
          display: inline-block;
          padding: 2px 8px;
          background: ${statusColor}22;
          border: 1px solid ${statusColor};
          border-radius: 6px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          color: ${statusColor};
        ">
          ${account.status}
        </div>
        <div style="
          margin-top: 8px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        ">
          Click for details
        </div>
      </div>
    `
  }

  // Point size based on followers
  const getPointSize = (account) => {
    const baseSize = 0.3
    const followers = account.followers || 0
    return baseSize + Math.min(followers / 1000, 1) * 0.7
  }

  // Point color based on status
  const getPointColor = (account) => {
    return STATUS_COLORS[account.status] || STATUS_COLORS.pending
  }

  if (isLoading) {
    return (
      <div 
        ref={containerRef}
        className="w-full h-[600px] flex items-center justify-center glass-medium rounded-2xl"
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Initializing HiveMap™...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-[600px] overflow-hidden rounded-2xl glass-medium"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Stats Overlay */}
      <div className="absolute top-6 left-6 z-10 glass-light rounded-xl px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-white font-medium">
              {geocodedAccounts.filter(a => a.status === 'active').length} Active
            </span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm text-white font-medium">
              {geocodedAccounts.filter(a => a.status === 'pending').length} Pending
            </span>
          </div>
          {geocodedAccounts.filter(a => a.status === 'failed').length > 0 && (
            <>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm text-white font-medium">
                  {geocodedAccounts.filter(a => a.status === 'failed').length} Failed
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hive Mind Badge */}
      <div className="absolute top-6 right-6 z-10 glass-light rounded-xl px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping absolute" />
            <div className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <span className="text-sm text-white font-semibold gradient-text-primary">
            HiveMap™ Active
          </span>
        </div>
      </div>

      {/* Connection Info */}
      {connectionArcs.length > 0 && (
        <div className="absolute bottom-6 right-6 z-10 glass-light rounded-xl px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs text-slate-300">
              {connectionArcs.length} connections active
            </span>
          </div>
        </div>
      )}

      {/* Globe */}
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        
        // Globe appearance
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        // Atmosphere
        atmosphereColor="rgba(138, 92, 246, 0.3)"
        atmosphereAltitude={0.2}
        
        // Points (accounts)
        pointsData={geocodedAccounts}
        pointLat={d => d.coordinates.lat}
        pointLng={d => d.coordinates.lng}
        pointColor={getPointColor}
        pointAltitude={0.015}
        pointRadius={getPointSize}
        pointLabel={getPointLabel}
        onPointClick={(account) => {
          if (onAccountClick && account) {
            onAccountClick(account)
          }
        }}
        pointsMerge={true}
        
        // Arcs (connections)
        arcsData={connectionArcs}
        arcStartLat={d => d.startLat}
        arcStartLng={d => d.startLng}
        arcEndLat={d => d.endLat}
        arcEndLng={d => d.endLng}
        arcColor={d => d.color}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcStroke={0.3}
        arcAltitude={0.01}
        arcsTransitionDuration={1000}
        
        // Animation
        animateIn={true}
      />

      {/* Helper text */}
      {geocodedAccounts.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <div className="text-center glass-medium rounded-2xl p-8">
            <p className="text-slate-400 text-lg">
              No accounts to display on HiveMap™
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Create accounts to see them visualized on the globe
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

