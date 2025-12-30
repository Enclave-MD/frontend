import axios from 'axios'

// API Base URL Configuration:
// - In development: uses '/api' which Vite proxies to http://localhost:8080
// - In production: set VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

console.log('API Base URL:', API_BASE_URL)

// Create axios instance with auth token
export function createAuthenticatedClient() {
  const token = localStorage.getItem('auth_token')
  
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    // Follow redirects and don't add trailing slashes
    maxRedirects: 5,
    // Preserve trailing slash behavior
    validateStatus: (status) => status >= 200 && status < 400
  })
}

// Document APIs
export const documentAPI = {
  list: async () => {
    const client = createAuthenticatedClient()
    return client.get('/documents')
  },
  
  get: async (id) => {
    const client = createAuthenticatedClient()
    return client.get(`/documents/${id}`)
  },
  
  // Direct upload - simpler, no CORS issues
  upload: async (file) => {
    const client = createAuthenticatedClient()
    const formData = new FormData()
    formData.append('file', file)
    return client.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  // Legacy presigned URL upload endpoints (kept for reference)
  initUpload: async (metadata) => {
    const client = createAuthenticatedClient()
    return client.post('/documents/init-upload', metadata)
  },
  
  complete: async (documentId) => {
    const client = createAuthenticatedClient()
    return client.post('/documents/complete', { documentId })
  },
  
  download: async (id) => {
    const client = createAuthenticatedClient()
    return client.get(`/documents/${id}/download`)
  },
  
  delete: async (id) => {
    const client = createAuthenticatedClient()
    return client.delete(`/documents/${id}`)
  }
}

// Agent APIs (replaces TEE APIs)
export const agentAPI = {
  query: async (question, documentIds = null) => {
    const client = createAuthenticatedClient()
    return client.post('/agent/query', { question, documentIds })
  },
  
  summarize: async (documentIds) => {
    const client = createAuthenticatedClient()
    return client.post('/agent/summarize', { documentIds })
  }
}

// Redaction APIs
export const redactionAPI = {
  redact: async (documentIds) => {
    const client = createAuthenticatedClient()
    return client.post('/redaction/redact', { documentIds })
  },
  
  piiTest: async () => {
    const client = createAuthenticatedClient()
    return client.get('/redaction/pii-detection/test')
  }
}

// Legacy TEE API for backward compatibility
export const teeAPI = {
  query: async (question, documentIds = null) => {
    const client = createAuthenticatedClient()
    return client.post('/agent/query', { question, documentIds })
  },
  
  attest: async () => {
    const client = createAuthenticatedClient()
    return client.get('/redaction/health')
  },
  
  piiTest: async () => {
    const client = createAuthenticatedClient()
    return client.get('/redaction/pii-detection/test')
  }
}

// Health checks
export const healthAPI = {
  auth: async () => {
    const client = createAuthenticatedClient()
    return client.get('/auth/health')
  },
  
  document: async () => {
    const client = createAuthenticatedClient()
    return client.get('/documents/health')
  },
  
  redaction: async () => {
    const client = createAuthenticatedClient()
    return client.get('/redaction/health')
  },
  
  agent: async () => {
    const client = createAuthenticatedClient()
    return client.get('/agent/health')
  }
}
