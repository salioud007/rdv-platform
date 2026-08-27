import { createContext, useState } from 'react'
import { login as loginService, logout as logoutService } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  async function login(email, password) {
    await loginService(email, password)
    setIsAuthenticated(true)
  }

  function logout() {
    logoutService()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
