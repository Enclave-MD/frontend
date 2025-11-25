import axios from 'axios'

// Use /api which will be proxied by Vite dev server to localhost:8080
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear auth and redirect if we're not on login/register pages
      const path = window.location.pathname
      if (!path.includes('/login') && !path.includes('/register')) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
}

// Document APIs
export const documentAPI = {
  list: () => api.get('/documents'),
  get: (id) => api.get(`/documents/${id}`),
  initUpload: (metadata) => api.post('/documents/init-upload', metadata),
  complete: (documentId) => api.post('/documents/complete', { documentId }),
  download: (id) => api.get(`/documents/${id}/download`),
  delete: (id) => api.delete(`/documents/${id}`),
}

// Agent APIs (replaces TEE APIs)
export const agentAPI = {
  query: (question, documentIds = null) => 
    api.post('/agent/query', { question, documentIds }),
  summarize: (documentIds) => 
    api.post('/agent/summarize', { documentIds }),
}

// Redaction APIs
export const redactionAPI = {
  redact: (documentIds) => 
    api.post('/redaction/redact', { documentIds }),
  piiTest: () => api.get('/redaction/pii-detection/test'),
}

// Health checks
export const healthAPI = {
  auth: () => api.get('/auth/health'),
  document: () => api.get('/documents/health'),
  redaction: () => api.get('/redaction/health'),
  agent: () => api.get('/agent/health'),
}

export default api
