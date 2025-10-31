import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Mail, 
  Instagram, 
  Calendar, 
  Trash2, 
  Edit, 
  Sparkles,
  Eye,
  Download,
  Plus,
  Loader2,
  Globe as GlobeIcon,
  Grid3x3,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { accountsAPI } from '@/services/api'
import { formatRelativeTime, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import AccountDetailModal from '@/components/AccountDetailModal'
import GlobeView from '@/components/GlobeView'
import EnhancedAccountModal from '@/components/EnhancedAccountModal'

const statusConfig = {
  active: { color: 'from-emerald-400 to-emerald-500', label: 'ARMED', glow: 'glow-success' },
  pending: { color: 'from-amber-400 to-amber-500', label: 'STANDBY', glow: 'shadow-amber-500/30' },
  failed: { color: 'from-red-400 to-red-500', label: 'CRITICAL', glow: 'shadow-red-500/30' },
}

export default function Accounts() {
  const navigate = useNavigate()
  const { accounts, setAccounts, deleteAccount, viewMode, toggleViewMode, activities } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [useEnhancedModal, setUseEnhancedModal] = useState(false)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const data = await accountsAPI.getAll()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error('Failed to load accounts:', error)
      toast.error('✗ FAILED TO LOAD ASSETS', {
        style: {
          background: 'rgba(255, 51, 102, 0.1)',
          color: '#ff3366',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 51, 102, 0.3)',
          fontFamily: 'JetBrains Mono, monospace',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      })
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this account?')) return
    
    try {
      await accountsAPI.delete(id)
      deleteAccount(id)
      toast.success('✓ ASSET TERMINATED', {
        style: {
          background: 'rgba(0, 255, 148, 0.1)',
          color: '#00ff94',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 255, 148, 0.3)',
          fontFamily: 'JetBrains Mono, monospace',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      })
    } catch (error) {
      toast.error('✗ TERMINATION FAILED', {
        style: {
          background: 'rgba(255, 51, 102, 0.1)',
          color: '#ff3366',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 51, 102, 0.3)',
          fontFamily: 'JetBrains Mono, monospace',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      })
    }
  }

  const handleExport = () => {
    toast.success('✓ EXPORTING ASSET DATA', {
      style: {
        background: 'rgba(0, 229, 255, 0.1)',
        color: '#00e5ff',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 229, 255, 0.3)',
        fontFamily: 'JetBrains Mono, monospace',
        textTransform: 'uppercase',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    })
  }

  const filteredAccounts = accounts
    .filter((acc) => {
      if (filter !== 'all' && acc.status !== filter) return false
      if (search && !acc.email.toLowerCase().includes(search.toLowerCase()) &&
          !acc.username?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-5xl font-bold gradient-text-command smooth-text tracking-wider font-mono">
            ASSET REGISTRY
          </h1>
          <p className="text-slate-400 mt-2">
            Monitor & control deployed automation assets • {accounts.length} total
          </p>
        </div>
        <div className="flex gap-3">
          {/* View Toggle */}
          <motion.button
            className="px-4 py-3 rounded-lg font-bold text-white flex items-center gap-2 glass-tactical border border-cyan-500/30 font-mono uppercase tracking-wider"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleViewMode}
          >
            {viewMode === 'globe' ? (
              <>
                <Grid3x3 className="w-4 h-4" />
                Grid
              </>
            ) : (
              <>
                <GlobeIcon className="w-4 h-4" />
                HiveMap
              </>
            )}
          </motion.button>
          
          <motion.button
            className="px-6 py-3 rounded-lg font-bold text-slate-950 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 border border-cyan-400/30 font-mono uppercase tracking-wider"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export Data
          </motion.button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div 
        className="glass-tactical rounded-lg p-6 border border-cyan-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="SEARCH ASSETS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg glass-tactical text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all border border-cyan-500/20 font-mono uppercase text-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'ALL', color: 'from-slate-400 to-slate-500' },
              { key: 'active', label: 'ARMED', color: 'from-emerald-400 to-emerald-500' },
              { key: 'pending', label: 'STANDBY', color: 'from-amber-400 to-amber-500' },
              { key: 'failed', label: 'CRITICAL', color: 'from-red-400 to-red-500' },
            ].map(({ key, label, color }) => (
              <motion.button
                key={key}
                className={cn(
                  'px-4 py-2 rounded-lg font-bold text-sm transition-all font-mono tracking-wider',
                  filter === key
                    ? `bg-gradient-to-r ${color} text-slate-950 border border-white/30`
                    : 'glass-tactical text-slate-300 hover:text-white border border-cyan-500/20'
                )}
                onClick={() => setFilter(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      )}

      {/* Globe View */}
      {!loading && viewMode === 'globe' && (
        <GlobeView 
          accounts={filteredAccounts}
          onAccountClick={(account) => {
            setSelectedAccount(account)
            setUseEnhancedModal(true)
          }}
        />
      )}

      {/* Accounts Grid */}
      {!loading && viewMode === 'grid' && (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {filteredAccounts.map((account, index) => {
            const status = statusConfig[account.status] || statusConfig.pending
            
            return (
              <motion.div
                key={account.id}
                className="group relative"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div 
                  className="glass-tactical rounded-lg p-6 cursor-pointer relative overflow-hidden border border-cyan-500/20"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  }}
                  onClick={() => navigate(`/studio/${account.id}`)}
                >
                  {/* Status Badge */}
                  <motion.div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${status.color} text-slate-950 font-mono tracking-wider border border-white/30`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.2, type: 'spring' }}
                  >
                    {status.label}
                  </motion.div>

                  {/* Account Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <motion.div 
                        className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center border border-white/10"
                        whileHover={{ rotate: 5 }}
                      >
                        <Instagram className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      {/* Glow Effect */}
                      <motion.div
                        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${status.color} opacity-0 group-hover:opacity-50 blur-xl transition-opacity`}
                        initial={false}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white smooth-text truncate group-hover:gradient-text-command transition-all font-mono">
                        {account.username || 'N/A'}
                      </h3>
                      <p className="text-sm text-slate-400 truncate">{account.fullName || 'No name'}</p>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-sm truncate">{account.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-sm">Created {formatRelativeTime(account.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <motion.div 
                    className="flex gap-2 pt-4 border-t border-cyan-500/20"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 font-mono uppercase tracking-wider border border-cyan-400/30"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/studio/${account.id}`)
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Sparkles className="w-4 h-4" />
                      REACTOR
                    </motion.button>
                    <motion.button
                      className="px-4 py-2.5 rounded-lg glass-tactical text-slate-300 hover:text-white border border-cyan-500/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedAccount(account)
                        setUseEnhancedModal(true)
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      className="px-4 py-2.5 rounded-lg glass-tactical text-red-400 hover:text-red-300 border border-red-500/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(account.id)
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && filteredAccounts.length === 0 && (
        <motion.div 
          className="glass-medium rounded-2xl p-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Instagram className="w-10 h-10 text-purple-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">No accounts found</h3>
            <p className="text-slate-400 mb-6">
              {filter !== 'all' 
                ? 'Try adjusting your filters or search terms' 
                : 'Create your first Instagram account to get started'}
            </p>
            <motion.button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center gap-2"
              onClick={() => navigate('/create')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              Create Account
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Account Detail Modal */}
      <AnimatePresence>
        {selectedAccount && useEnhancedModal ? (
          <EnhancedAccountModal
            account={selectedAccount}
            onClose={() => {
              setSelectedAccount(null)
              setUseEnhancedModal(false)
            }}
            activities={activities || []}
            contentPosts={[]}
            personas={[]}
          />
        ) : selectedAccount ? (
          <AccountDetailModal
            account={selectedAccount}
            onClose={() => setSelectedAccount(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}


