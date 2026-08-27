import { useNavigate } from 'react-router-dom'
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
          Remplissez ce formulaire pour solliciter un rendez-vous. Aucune création de compte n'est nécessaire — un lien de suivi vous sera remis à l'envoi.
        </p>
      </div>
      <div className="max-w-lg mx-auto bg-surface-alt rounded-2xl shadow-card border border-border p-6 sm:p-8">
        <RequestForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
