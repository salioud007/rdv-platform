import api from './api'

export async function listerCreneauxDisponibles() {
  const response = await api.get('/creneaux/disponibles')
  return response.data
}

export async function listerTousLesCreneaux() {
  const response = await api.get('/creneaux')
  return response.data
}

export async function creerCreneau(dateHeure, dureeMinutes) {
  const response = await api.post('/creneaux', {
    date_heure: dateHeure,
    duree_minutes: dureeMinutes,
  })
  return response.data
}

export async function supprimerCreneau(creneauId) {
  const response = await api.delete(`/creneaux/${creneauId}`)
  return response.data
}
