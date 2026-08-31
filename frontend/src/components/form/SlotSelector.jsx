import { Select } from '@mantine/core'
import { formatDateTime } from '../../utils/formatDate'

export default function SlotSelector({ creneaux, valeur, onChange, error }) {
  const data = creneaux.map((creneau) => ({
    value: String(creneau.id),
    label: `${formatDateTime(creneau.date_heure)} (${creneau.duree_minutes} min)`,
  }))

  return (
    <Select
      label="Créneau souhaité"
      placeholder="Sélectionner un créneau"
      data={data}
      value={valeur || null}
      onChange={(val) => onChange(val || '')}
      error={error}
      styles={{
        input: {
          borderRadius: '0.75rem',
          borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
          backgroundColor: 'white',
          fontSize: '0.875rem',
          height: '2.75rem',
        },
        label: {
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--color-ink)',
          marginBottom: '0.5rem',
        },
      }}
    />
  )
}
