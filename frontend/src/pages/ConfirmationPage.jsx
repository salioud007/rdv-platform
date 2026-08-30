import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { Paper, CopyButton, ThemeIcon, Alert } from '@mantine/core'
import Button from '../components/common/Button'

export default function ConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = location.state?.token
  if (!token) {
    return <Navigate to="/" replace />
  }
  const lienSuivi = window.location.origin + '/suivi/' + token
  return (
    <div className="min-h-screen bg-surface text-ink px-4 py-16 flex flex-col items-center justify-center">
      <Paper
        radius="xl"
        withBorder
        className="max-w-md w-full"
        style={{
          backgroundColor: 'var(--color-surface-alt)',
          borderColor: 'var(--color-border)',
          boxShadow: '0 1px 2px rgba(11, 18, 32, 0.04), 0 12px 28px -12px rgba(11, 18, 32, 0.16)',
        }}
      >
        <div className="p-8 text-center">
          <ThemeIcon
            size={48}
            radius="xl"
            variant="light"
            color="var(--color-success)"
            className="mx-auto mb-5"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </ThemeIcon>
          <h1 className="font-display text-2xl font-semibold tracking-tight mb-2">
            Demande transmise
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            Votre demande a été enregistrée. Conservez le lien ci-dessous — il ne pourra pas vous être renvoyé.
          </p>
        </div>
        <div className="relative h-0 border-t border-dashed border-border">
          <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-surface" />
          <span className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-surface" />
        </div>
        <div className="p-8">
          <span className="eyebrow mb-3">Référence de suivi</span>
          <div className="mt-3 bg-surface border border-border rounded-lg px-4 py-3 mb-4 break-all font-mono text-sm">
            {lienSuivi}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate('/suivi/' + token)}>
              Consulter le suivi
            </Button>
            <CopyButton value={lienSuivi} timeout={2000}>
              {({ copied, copy }) => (
                <Button onClick={copy} variant="secondary">
                  {copied ? 'Lien copié' : 'Copier le lien'}
                </Button>
              )}
            </CopyButton>
          </div>
          <Alert color="var(--color-danger)" variant="light" radius="lg" className="mt-5">
            <span className="text-xs">
              Attention — ce lien est votre seul moyen d'accéder au suivi.
            </span>
          </Alert>
        </div>
      </Paper>
    </div>
  )
}
