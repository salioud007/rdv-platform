const STYLES = {
  'En attente de traitement': 'bg-signal/10 text-signal',
  "En cours d'examen": 'bg-accent/10 text-accent',
  'Acceptée': 'bg-success/10 text-success',
  'Refusée': 'bg-danger/10 text-danger',
}

export default function Badge({ statut }) {
  const style = STYLES[statut] || 'bg-secondary-hover text-ink-muted'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono uppercase tracking-wide ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {statut}
    </span>
  )
}
