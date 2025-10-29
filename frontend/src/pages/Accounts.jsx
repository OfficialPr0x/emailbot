import { useEffect, useState } from 'react'
import { Search, Filter, MoreVertical, Mail, Instagram, Calendar, Trash2, Edit } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useStore } from '@/store/useStore'
import { accountsAPI } from '@/services/api'
import { formatRelativeTime, getStatusColor } from '@/lib/utils'
import toast from 'react-hot-toast'
import AccountDetailModal from '@/components/AccountDetailModal'

export default function Accounts() {
  const { accounts, setAccounts, deleteAccount } = useStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState(null)

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
      toast.error('Failed to load accounts')
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
      toast.success('Account deleted successfully')
    } catch (error) {
      toast.error('Failed to delete account')
    }
  }

  const filteredAccounts = accounts
    .filter((acc) => {
      if (filter !== 'all' && acc.status !== filter) return false
      if (search && !acc.email.toLowerCase().includes(search.toLowerCase()) &&
          !acc.username?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your Instagram accounts
          </p>
        </div>
        <Button className="gradient-instagram w-full sm:w-auto">
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by email or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'pending', 'failed'].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAccounts.map((account) => (
          <Card 
            key={account.id} 
            className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
            onClick={() => setSelectedAccount(account)}
          >
            <CardContent className="p-6">
              {/* Account Avatar */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-instagram">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{account.username || 'N/A'}</h3>
                    <p className="text-xs text-muted-foreground">{account.fullName}</p>
                  </div>
                </div>
                <Badge variant={
                  account.status === 'active' ? 'success' :
                  account.status === 'failed' ? 'destructive' :
                  'warning'
                }>
                  {account.status}
                </Badge>
              </div>

              {/* Account Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{account.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatRelativeTime(account.createdAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedAccount(account)
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(account.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Instagram className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-1">No accounts found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or create a new account
            </p>
          </CardContent>
        </Card>
      )}

      {/* Account Detail Modal */}
      {selectedAccount && (
        <AccountDetailModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </div>
  )
}


