import { TextInput } from '@mantine/core'

export default function Input({ label, id, error, ...props }) {
  return (
    <TextInput
      id={id}
      label={label}
      error={error}
      styles={{
        input: {
          borderRadius: '0.75rem',
          borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
          backgroundColor: 'white',
          fontSize: '0.875rem',
          height: '2.75rem',
          transition: 'box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease',
        },
        label: {
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--color-ink)',
          marginBottom: '0.5rem',
          letterSpacing: '0.01em',
        },
        error: {
          fontSize: '0.75rem',
          color: 'var(--color-danger)',
          marginTop: '0.375rem',
        },
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 4px color-mix(in srgb, var(--color-accent) 15%, transparent)'
        e.currentTarget.style.borderColor = 'var(--color-accent)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)'
      }}
      {...props}
    />
  )
}
