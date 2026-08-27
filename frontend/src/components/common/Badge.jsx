const STYLES = {
  'En attente de traitement': 'border-accent text-accent',
  "En cours d'examen": 'border-accent text-accent',
  'Acceptée': 'border-success text-success',
  'Refusée': 'border-danger text-danger',
}

export default function Badge({ statut }) {
  const style = STYLES[statut] || 'border-border text-ink'
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-2 px-3 py-1 text-xs font-mono uppercase tracking-wide ${style}`}
    >
      {statut}
    </span>
  )
}
