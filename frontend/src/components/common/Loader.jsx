import { Loader as MantineLoader } from '@mantine/core'

export default function Loader({ label = 'Chargement...' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-ink-muted">
      <MantineLoader color="var(--color-accent)" type="dots" size="sm" />
      {label}
    </div>
  )
}
