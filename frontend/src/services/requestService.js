import api from './api'

export async function creerDemande(formData) {
  const response = await api.post('/demandes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function listerDemandes() {
  const response = await api.get('/demandes')
  return response.data
}

export async function obtenirDetailDemande(id) {
  const response = await api.get(`/demandes/${id}`)
  return response.data
}

export async function traiterDemande(id, decision, commentaire) {
  const response = await api.patch(`/demandes/${id}/decision`, {
    decision,
    commentaire,
  })
  return response.data
}

export function urlTelechargerFichier(id) {
  return `${api.defaults.baseURL}/demandes/${id}/fichier`
}

export async function obtenirSuiviParToken(token) {
  const response = await api.get(`/tracking/${token}`)
  return response.data
}

export function urlTelechargerIcs(token) {
  return `${api.defaults.baseURL}/tracking/${token}/ics`
}
