import { formatDateTime } from '../../utils/formatDate'

export default function SlotSelector({ creneaux, valeur, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="creneau" className="text-sm font-medium text-ink">
        Créneau souhaité
      </label>
      <select
        id="creneau"
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        className={`border rounded-lg px-3.5 py-2.5 text-sm bg-white transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent ${
          error ? 'border-danger' : 'border-border'
        }`}
      >
        <option value="">Sélectionner un créneau</option>
        {creneaux.map((creneau) => (
          <option key={creneau.id} value={creneau.id}>
            {formatDateTime(creneau.date_heure)} ({creneau.duree_minutes} min)
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
