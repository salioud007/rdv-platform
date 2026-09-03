export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

export function validerFichier(fichier) {
  if (!fichier) {
    return "Un fichier est obligatoire."
  }
  if (fichier.size > MAX_FILE_SIZE_BYTES) {
    return "Fichier trop volumineux (50 Mo maximum)."
  }
  return null
}

export function validerEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validerTelephone(telephone) {
  if (!telephone || telephone.trim() === '') {
    return true
  }
  const regex = /^[0-9+\-\s().]+$/
  return regex.test(telephone)
}

export function validerChampsObligatoires(champs) {
  const manquants = Object.entries(champs)
    .filter(function (entree) {
      const valeur = entree[1]
      return !valeur || valeur.trim() === ''
    })
    .map(function (entree) {
      return entree[0]
    })
  return manquants
}
