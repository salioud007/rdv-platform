import { Badge as MantineBadge } from '@mantine/core'

const STYLES = {
  'En attente de traitement': 'var(--color-signal)',
  "En cours d'examen": 'var(--color-accent)',
  'Acceptée': 'var(--color-success)',
  'Refusée': 'var(--color-danger)',
  'Ouvert': 'var(--color-success)',
  'Reserve': 'var(--color-ink-muted)',
  'Annule': 'var(--color-danger)',
}

const LABELS = {
  'Ouvert': 'Disponible',
  'Reserve': 'Reserve',
  'Annule': 'Annule',
}

export default function Badge({ statut }) {
  const couleur = STYLES[statut] || 'var(--color-ink-muted)'
  const label = LABELS[statut] || statut
  return (
    <MantineBadge
      variant="light"
      radius="xl"
      leftSection={
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '9999px',
            backgroundColor: couleur,
            display: 'inline-block',
          }}
        />
      }
      style={{
        backgroundColor: `color-mix(in srgb, ${couleur} 10%, transparent)`,
        color: couleur,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontSize: '0.6875rem',
      }}
    >
      {label}
    </MantineBadge>
  )
}
