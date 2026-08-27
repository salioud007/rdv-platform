import api, { setAuthToken } from './api'

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password })
  const { token } = response.data
  setAuthToken(token)
  return token
}

export function logout() {
  setAuthToken(null)
}
