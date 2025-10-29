import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message
    return Promise.reject(new Error(message))
  }
)

// API Methods
export const accountsAPI = {
  getAll: () => api.get('/accounts'),
  getOne: (id) => api.get(`/accounts/${id}`),
  create: (data) => api.post('/accounts/create', data),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
  getStats: () => api.get('/accounts/stats'),
}

export const botAPI = {
  createAccount: (data) => api.post('/create-account', data),
  createGmail: (data) => api.post('/create-gmail', data),
  createInstagram: (data) => api.post('/create-instagram', data),
  testProxy: (data) => api.post('/test-proxy', data),
}

export const jobsAPI = {
  getActive: () => api.get('/jobs/active'),
  getOne: (id) => api.get(`/jobs/${id}`),
}

export const activitiesAPI = {
  getAll: (params) => api.get('/activities', { params }),
}

export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getProxies: () => api.get('/analytics/proxies'),
  testProxy: (proxyUrl) => api.post('/analytics/test-proxy', { proxyUrl }),
  getTimeline: (days = 30) => api.get(`/analytics/timeline?days=${days}`),
  getSuccessRate: (days = 7) => api.get(`/analytics/success-rate?days=${days}`),
}

export default api

