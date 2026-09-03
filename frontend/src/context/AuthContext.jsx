import { createContext, useState, useEffect } from 'react'
import { login as loginService, logout as logoutService } from '../services/authService'
import { getStoredToken, setAuthToken } from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pret, setPret] = useState(false)

  useEffect(function () {
    const token = getStoredToken()
    if (token) {
      setAuthToken(token)
      setIsAuthenticated(true)
    }
    setPret(true)
  }, [])

  async function login(email, password) {
    await loginService(email, password)
    setIsAuthenticated(true)
  }

  function logout() {
    logoutService()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, pret }}>
      {children}
    </AuthContext.Provider>
  )
}
