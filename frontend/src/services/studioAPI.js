import api from './api'

export const studioAPI = {
  // Overview
  getOverview: (accountId) => api.get(`/studio/${accountId}`),

  // Metrics
  getMetrics: (accountId, days = 30) => api.get(`/studio/${accountId}/metrics?days=${days}`),
  getMetricsTimeline: (accountId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return api.get(`/studio/${accountId}/metrics/timeline?${queryParams}`)
  },
  recordMetrics: (accountId, data) => api.post(`/studio/${accountId}/metrics`, data),

  // Content Posts
  getContentPosts: (accountId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return api.get(`/studio/${accountId}/content?${queryParams}`)
  },
  createContentPost: (accountId, data) => api.post(`/studio/${accountId}/content`, data),
  updateContentPost: (accountId, postId, data) => api.put(`/studio/${accountId}/content/${postId}`, data),
  deleteContentPost: (accountId, postId) => api.delete(`/studio/${accountId}/content/${postId}`),

  // Personas
  getPersonas: (accountId) => api.get(`/studio/${accountId}/personas`),
  createPersona: (accountId, data) => api.post(`/studio/${accountId}/personas`, data),
  updatePersona: (accountId, personaId, data) => api.put(`/studio/${accountId}/personas/${personaId}`, data),
  activatePersona: (accountId, personaId) => api.put(`/studio/${accountId}/personas/${personaId}/activate`),
  deletePersona: (accountId, personaId) => api.delete(`/studio/${accountId}/personas/${personaId}`),

  // System Status
  getProxyStatus: (accountId) => api.get(`/studio/${accountId}/proxy-status`),
  getShadowbanCheck: (accountId) => api.get(`/studio/${accountId}/shadowban-check`),

  // AI Features (Mock)
  analyzeNiche: (accountId) => api.post(`/studio/${accountId}/niche-analyze`),
  generateCaption: (accountId, data) => api.post(`/studio/${accountId}/generate-caption`, data),
  generateContentPlan: (accountId) => api.post(`/studio/${accountId}/generate-content-plan`),
  getAudienceInsights: (accountId) => api.post(`/studio/${accountId}/audience-insights`),

  // Growth Engine (Automations)
  getAutomations: (accountId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return api.get(`/studio/${accountId}/automations?${queryParams}`)
  },
  createAutomation: (accountId, data) => api.post(`/studio/${accountId}/automations`, data),
  updateAutomation: (accountId, taskId, data) => api.put(`/studio/${accountId}/automations/${taskId}`, data),
  deleteAutomation: (accountId, taskId) => api.delete(`/studio/${accountId}/automations/${taskId}`),
  executeAutomation: (accountId, taskId) => api.post(`/studio/${accountId}/automations/${taskId}/execute`),

  // Creator Reactor
  generateReactorImage: (accountId, data) => api.post(`/studio/${accountId}/reactor/generate-image`, data),
  generateReactorVideo: (accountId, data) => api.post(`/studio/${accountId}/reactor/generate-video`, data),
  generateReactorBatch: (accountId, data) => api.post(`/studio/${accountId}/reactor/generate-batch`, data),
  getReactorPresets: (accountId) => api.get(`/studio/${accountId}/reactor/presets`),
  getReactorTemplates: (accountId) => api.get(`/studio/${accountId}/reactor/templates`),
  getReactorHistory: (accountId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return api.get(`/studio/${accountId}/reactor/history?${queryParams}`)
  },

  // Influencer Engine
  getInfluencers: (accountId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return api.get(`/studio/${accountId}/influencers?${queryParams}`)
  },
  discoverInfluencers: (accountId, data) => api.post(`/studio/${accountId}/influencers/discover`, data),
  createInfluencer: (accountId, data) => api.post(`/studio/${accountId}/influencers`, data),
  updateInfluencer: (accountId, influencerId, data) => api.put(`/studio/${accountId}/influencers/${influencerId}`, data),
  deleteInfluencer: (accountId, influencerId) => api.delete(`/studio/${accountId}/influencers/${influencerId}`),
  getCompatibilityScore: (accountId, influencerId) => api.post(`/studio/${accountId}/influencers/${influencerId}/compatibility-score`),

  // Collaborations
  getCollaborations: (accountId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString()
    return api.get(`/studio/${accountId}/collaborations?${queryParams}`)
  },
  createCollaboration: (accountId, data) => api.post(`/studio/${accountId}/collaborations`, data),
  updateCollaboration: (accountId, collabId, data) => api.put(`/studio/${accountId}/collaborations/${collabId}`, data),
  deleteCollaboration: (accountId, collabId) => api.delete(`/studio/${accountId}/collaborations/${collabId}`),
  generateOutreach: (accountId, collabId, data) => api.post(`/studio/${accountId}/collaborations/${collabId}/generate-outreach`, data),
  generateContract: (accountId, collabId, data) => api.post(`/studio/${accountId}/collaborations/${collabId}/generate-contract`, data),
  getCollaborationPerformance: (accountId, collabId) => api.get(`/studio/${accountId}/collaborations/${collabId}/performance`),

  // Niche Intel
  getNicheIntel: (accountId, data) => api.post(`/studio/${accountId}/niche-intel`, data),

  // Audience Builder
  researchAudience: (accountId, data) => api.post(`/studio/${accountId}/audience-research`, data),
  findSimilarAccounts: (accountId, data) => api.post(`/studio/${accountId}/find-similar`, data),

  // Utility
  seedData: (accountId) => api.post(`/studio/${accountId}/seed-data`),
}

export default studioAPI

