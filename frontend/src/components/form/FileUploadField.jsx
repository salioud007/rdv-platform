import { Dropzone } from '@mantine/dropzone'
import { Text, Group } from '@mantine/core'

export default function FileUploadField({ fichier, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink">
        Piece jointe (5 Mo max)
      </label>
      <Dropzone
        onDrop={(files) => onChange(files[0] || null)}
        maxFiles={1}
        multiple={false}
        styles={{
          root: {
            borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
          },
        }}
      >
        <Group justify="center" gap="xs" style={{ minHeight: 80, pointerEvents: 'none' }}>
          <Text size="sm" c="dimmed">
            Glissez un fichier ici ou cliquez pour selectionner
          </Text>
        </Group>
      </Dropzone>
      {fichier && (
        <span className="text-xs text-ink-muted font-mono">
          {fichier.name}
        </span>
      )}
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
