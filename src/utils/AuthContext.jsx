import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('auth_user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      })
      
      const { user: userData, token } = response.data
      
      // Store in localStorage
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      
      // Update state
      setUser(userData)
      
      return userData
    } catch (error) {
      // Re-throw with more context if needed
      if (error.response) {
        // Server responded with error status
        throw error
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error. Please check your connection.')
      } else {
        // Something else happened
        throw new Error('An unexpected error occurred.')
      }
    }
  }

  const register = async (email, password, fullName) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      fullName
    })
    
    const { user: userData, token } = response.data
    
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    setUser(userData)
    
    return userData
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
