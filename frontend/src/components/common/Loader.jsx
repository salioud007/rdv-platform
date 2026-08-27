export default function Loader({ label = 'Chargement...' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-ink-muted">
      <span className="animate-spin inline-block w-4 h-4 border-2 border-border border-t-ink rounded-full"></span>
      {label}
    </div>
  )
}
