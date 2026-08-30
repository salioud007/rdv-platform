import { useNavigate } from 'react-router-dom'
import { Paper } from '@mantine/core'
import RequestForm from '../components/form/RequestForm'
export default function HomePage() {
  const navigate = useNavigate()
  function handleSuccess(token) {
    navigate('/confirmation', { state: { token } })
  }
  return (
    <div className="min-h-screen bg-surface text-ink px-4 py-16">
      <div className="max-w-lg mx-auto mb-10">
        <span className="eyebrow mb-4">Nouvelle demande</span>
        <h1 className="font-display text-4xl font-semibold tracking-tight mt-3 mb-3">
          Demande de rendez-vous
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Remplissez ce formulaire pour solliciter un rendez-vous. Aucune création decompte n'est nécessaire — un lien de suivi vous sera remis à l'envoi.
        </p>
      </div>
      <Paper
        radius="xl"
        withBorder
        className="max-w-lg mx-auto"
        style={{
          backgroundColor: 'var(--color-surface-alt)',
          borderColor: 'var(--color-border)',
          boxShadow: '0 1px 2px rgba(11, 18, 32, 0.04), 0 12px 28px -12px rgba(11, 18, 32, 0.16)',
          padding: '1.5rem',
        }}
      >
        <RequestForm onSuccess={handleSuccess} />
      </Paper>
    </div>
  )
}
