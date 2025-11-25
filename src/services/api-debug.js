import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

console.log('🔵 [API] Initializing with base URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('🔵 [API Request]', config.method.toUpperCase(), config.url)
  console.log('   Token present:', !!token)
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('   Authorization header set')
  }
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('🟢 [API Response]', response.config.method.toUpperCase(), response.config.url)
    console.log('   Status:', response.status)
    return response
  },
  (error) => {
    const status = error.response?.status
    const url = error.config?.url
    
    console.log('🔴 [API Error]', error.config?.method?.toUpperCase(), url)
    console.log('   Status:', status)
    console.log('   Error:', error.message)
    
    if (status === 401) {
      console.log('🔴 [API] 401 Unauthorized detected')
      
      // Only clear auth and redirect if we're not on login/register pages
      const path = window.location.pathname
      console.log('   Current path:', path)
      
      if (!path.includes('/login') && !path.includes('/register')) {
        console.log('🔴 [API] Clearing auth and redirecting to login')
        console.trace('401 handler stack trace:')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      } else {
        console.log('⚠️  [API] On login/register page, not clearing auth')
      }
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  login: (credentials) => {
    console.log('🔵 [authAPI] login() called')
    return api.post('/auth/login', credentials)
  },
  register: (userData) => {
    console.log('🔵 [authAPI] register() called')
    return api.post('/auth/register', userData)
  },
  getProfile: () => {
    console.log('🔵 [authAPI] getProfile() called')
    return api.get('/auth/profile')
  },
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

// TEE APIs
export const teeAPI = {
  query: (question, documentIds = null) => 
    api.post('/tee/query', { question, documentIds }),
  attest: () => api.get('/tee/attest'),
  piiTest: () => api.get('/tee/pii-detection/test'),
}

// Health checks
export const healthAPI = {
  auth: () => api.get('/auth/health'),
  document: () => api.get('/documents/../health'),
  tee: () => api.get('/tee/health'),
}

export default api
