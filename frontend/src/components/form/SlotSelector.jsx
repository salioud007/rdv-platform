import { formatDateTime } from '../../utils/formatDate'

export default function SlotSelector({ creneaux, valeur, onChange, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="creneau" className="text-sm font-medium text-[#1C1A17]">
        Créneau souhaité
      </label>
      <select
        id="creneau"
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        className={`border rounded-sm px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#B45309] ${
          error ? 'border-[#991B1B]' : 'border-[#D6D2C4]'
        }`}
      >
        <option value="">Sélectionner un créneau</option>
        {creneaux.map((creneau) => (
          <option key={creneau.id} value={creneau.id}>
            {formatDateTime(creneau.date_heure)} ({creneau.duree_minutes} min)
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-[#991B1B]">{error}</span>}
    </div>
  )
}
