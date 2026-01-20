import axios from 'axios'
import toast from 'react-hot-toast'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred'
      toast.error(message)

      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    } else if (error.request) {
      // No response from server
      toast.error('Unable to connect to server')
    } else {
      // Request setup error
      toast.error('An unexpected error occurred')
    }
    return Promise.reject(error)
  }
)

// API client methods
const apiClient = {
  // Health check
  healthCheck: async () => {
    const response = await api.get('/health')
    return response.data
  },

  // Learning Sessions
  sessions: {
    create: async (data) => {
      const response = await api.post('/api/sessions', data)
      return response.data
    },

    list: async () => {
      const response = await api.get('/api/sessions')
      return response.data
    },

    get: async (id) => {
      const response = await api.get(`/api/sessions/${id}`)
      return response.data
    },

    update: async (id, data) => {
      const response = await api.put(`/api/sessions/${id}`, data)
      return response.data
    },

    delete: async (id) => {
      const response = await api.delete(`/api/sessions/${id}`)
      return response.data
    },

    analyze: async (id) => {
      const response = await api.post(`/api/sessions/${id}/analyze`)
      return response.data
    }
  },

  // Coach Questions
  questions: {
    generate: async (sessionId) => {
      const response = await api.post(`/api/sessions/${sessionId}/generate-questions`)
      return response.data
    },

    list: async (sessionId) => {
      const response = await api.get(`/api/questions/${sessionId}`)
      return response.data
    },

    respond: async (questionId, response) => {
      const res = await api.post(`/api/questions/${questionId}/response`, { response })
      return res.data
    },

    updateResponse: async (questionId, response) => {
      const res = await api.put(`/api/questions/${questionId}/response`, { response })
      return res.data
    },

    getResponses: async (sessionId) => {
      const response = await api.get(`/api/sessions/${sessionId}/responses`)
      return response.data
    }
  },

  // Content Drafts
  drafts: {
    create: async (sessionId, data) => {
      const response = await api.post(`/api/sessions/${sessionId}/drafts`, data)
      return response.data
    },

    list: async (sessionId) => {
      const response = await api.get(`/api/sessions/${sessionId}/drafts`)
      return response.data
    },

    get: async (id) => {
      const response = await api.get(`/api/drafts/${id}`)
      return response.data
    },

    update: async (id, data) => {
      const response = await api.put(`/api/drafts/${id}`, data)
      return response.data
    },

    delete: async (id) => {
      const response = await api.delete(`/api/drafts/${id}`)
      return response.data
    },

    autoSave: async (id, content) => {
      const response = await api.post(`/api/drafts/${id}/auto-save`, { content })
      return response.data
    },

    getSuggestions: async (id) => {
      const response = await api.get(`/api/drafts/${id}/suggestions`)
      return response.data
    }
  },

  // Platform Adaptations
  adaptations: {
    generate: async (draftId, platform) => {
      const response = await api.post(`/api/drafts/${draftId}/adapt/${platform}`)
      return response.data
    },

    list: async (draftId) => {
      const response = await api.get(`/api/drafts/${draftId}/adaptations`)
      return response.data
    },

    update: async (id, data) => {
      const response = await api.put(`/api/adaptations/${id}`, data)
      return response.data
    },

    regenerate: async (id, feedback) => {
      const response = await api.post(`/api/adaptations/${id}/regenerate`, { feedback })
      return response.data
    }
  },

  // AI Agents (Legacy endpoints - keeping for compatibility)
  agents: {
    analyze: async (content, type = 'text') => {
      const response = await api.post('/api/agents/analyze', { content, type })
      return response.data
    },

    generateQuestions: async (sessionId, analysis) => {
      const response = await api.post('/api/agents/questions', { sessionId, analysis })
      return response.data
    },

    adaptContent: async (content, platform) => {
      const response = await api.post('/api/agents/adapt', { content, platform })
      return response.data
    }
  },

  // File Upload
  upload: {
    file: async (file) => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },

    fetchUrl: async (url) => {
      const response = await api.post('/api/upload/url', { url })
      return response.data
    }
  },

  // User/Auth (for future use)
  auth: {
    register: async (data) => {
      const response = await api.post('/api/auth/register', data)
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
      }
      return response.data
    },

    login: async (credentials) => {
      const response = await api.post('/api/auth/login', credentials)
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token)
      }
      return response.data
    },

    logout: async () => {
      const response = await api.post('/api/auth/logout')
      localStorage.removeItem('auth_token')
      return response.data
    },

    me: async () => {
      const response = await api.get('/api/auth/me')
      return response.data
    }
  }
}

export default apiClient