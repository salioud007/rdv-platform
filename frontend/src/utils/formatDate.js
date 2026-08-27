export function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString.replace(' ', 'T'))
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString.replace(' ', 'T'))
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
