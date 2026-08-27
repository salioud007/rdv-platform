const STYLES = {
  'En attente de traitement': 'border-[#B45309] text-[#B45309]',
  "En cours d'examen": 'border-[#B45309] text-[#B45309]',
  'Acceptée': 'border-[#166534] text-[#166534]',
  'Refusée': 'border-[#991B1B] text-[#991B1B]',
}

export default function Badge({ statut }) {
  const style = STYLES[statut] || 'border-[#D6D2C4] text-[#1C1A17]'
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-2 px-3 py-1 text-xs font-mono uppercase tracking-wide ${style}`}
    >
      {statut}
    </span>
  )
}
