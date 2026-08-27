export const ALLOWED_EXTENSIONS = ['pdf', 'zip']
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export function validerFichier(fichier) {
  if (!fichier) {
    return "Un fichier est obligatoire (pdf ou zip)."
  }
  const extension = fichier.name.split('.').pop().toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return "Extension non autorisée (pdf ou zip uniquement)."
  }
  if (fichier.size > MAX_FILE_SIZE_BYTES) {
    return "Fichier trop volumineux (5 Mo maximum)."
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
