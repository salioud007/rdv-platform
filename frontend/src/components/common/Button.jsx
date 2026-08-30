import { Button as MantineButton } from '@mantine/core'

const VARIANT_CONFIG = {
  primary: { color: 'var(--color-ink)', variant: 'filled' },
  secondary: { color: 'var(--color-ink)', variant: 'outline' },
  danger: { color: 'var(--color-danger)', variant: 'filled' },
  success: { color: 'var(--color-success)', variant: 'filled' },
}

export default function Button({ children, variant = 'primary', type = 'button', onClick, disabled }) {
  const config = VARIANT_CONFIG[variant]
  return (
    <MantineButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      color={config.color}
      variant={config.variant}
      radius="lg"
      styles={{
        root: {
          fontWeight: 500,
          fontSize: '0.875rem',
          transition: 'all 180ms ease',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      }}
    >
      {children}
    </MantineButton>
  )
}
