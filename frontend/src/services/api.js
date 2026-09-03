import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'rdv_admin_token'

const api = axios.create({
  baseURL: API_BASE_URL,
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export default api
