import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔵 [AuthContext] useEffect triggered')
    
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    console.log('🔵 [AuthContext] Token exists:', !!token)
    console.log('🔵 [AuthContext] Saved user exists:', !!savedUser)
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        console.log('🔵 [AuthContext] Restoring user from localStorage:', userData)
        setUser(userData)
      } catch (error) {
        console.error('🔴 [AuthContext] Error parsing saved user:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    
    console.log('🔵 [AuthContext] Setting loading to false')
    setLoading(false)
  }, [])

  // Watch for user changes
  useEffect(() => {
    console.log('🟢 [AuthContext] User state changed:', user)
  }, [user])

  const login = async (credentials) => {
    console.log('🔵 [AuthContext] login() called with:', credentials.email)
    
    try {
      console.log('🔵 [AuthContext] Calling authAPI.login...')
      const response = await authAPI.login(credentials)
      console.log('🟢 [AuthContext] Login response:', response.data)
      
      const { user, token } = response.data
      
      console.log('🔵 [AuthContext] Storing token in localStorage')
      localStorage.setItem('token', token)
      
      console.log('🔵 [AuthContext] Storing user in localStorage')
      localStorage.setItem('user', JSON.stringify(user))
      
      console.log('🔵 [AuthContext] Setting user state')
      setUser(user)
      
      console.log('🟢 [AuthContext] Login complete, user:', user)
      
      // Verify storage
      setTimeout(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        console.log('🔍 [AuthContext] Verification after 100ms:')
        console.log('   Token still in storage:', !!storedToken)
        console.log('   User still in storage:', !!storedUser)
        console.log('   User state:', user)
      }, 100)
      
      return user
    } catch (error) {
      console.error('🔴 [AuthContext] Login error:', error)
      throw error
    }
  }

  const register = async (userData) => {
    console.log('🔵 [AuthContext] register() called')
    const response = await authAPI.register(userData)
    const { user, token } = response.data
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    
    return user
  }

  const logout = () => {
    console.log('🔴 [AuthContext] logout() called')
    console.trace('Logout stack trace:')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
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
