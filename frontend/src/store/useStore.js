import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // Accounts
      accounts: [],
      selectedAccount: null,
      
      setAccounts: (accounts) => set({ accounts }),
      addAccount: (account) => set((state) => ({
        accounts: [account, ...state.accounts]
      })),
      updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map((acc) =>
          acc.id === id ? { ...acc, ...updates } : acc
        )
      })),
      deleteAccount: (id) => set((state) => ({
        accounts: state.accounts.filter((acc) => acc.id !== id)
      })),
      setSelectedAccount: (account) => set({ selectedAccount: account }),
      
      // Activity Feed
      activities: [],
      setActivities: (activities) => set({ activities }),
      addActivity: (activity) => set((state) => ({
        activities: [activity, ...state.activities].slice(0, 100) // Keep last 100
      })),
      clearActivities: () => set({ activities: [] }),
      
      // Stats
      stats: {
        total: 0,
        active: 0,
        creating: 0,
        failed: 0,
        successRate: 0,
      },
      setStats: (stats) => set({ stats }),
      
      // Active Jobs
      activeJobs: [],
      addJob: (job) => set((state) => ({
        activeJobs: [...state.activeJobs, job]
      })),
      updateJob: (id, updates) => set((state) => ({
        activeJobs: state.activeJobs.map((job) =>
          job.id === id ? { ...job, ...updates } : job
        )
      })),
      removeJob: (id) => set((state) => ({
        activeJobs: state.activeJobs.filter((job) => job.id !== id)
      })),
      
      // UI State
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
      })),
      
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      
      // Settings
      settings: {
        autoRefresh: true,
        refreshInterval: 30000,
        notifications: true,
        proxyUrl: '',
        useAiProfile: true,
      },
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
    }),
    {
      name: 'myg-bot-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        settings: state.settings,
      }),
    }
  )
)

