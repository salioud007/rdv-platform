import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import Button from '../components/common/Button'

export default function ConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = location.state?.token
  const [copie, setCopie] = useState(false)

  if (!token) {
    return <Navigate to="/" replace />
  }

  const lienSuivi = window.location.origin + '/suivi/' + token

  function copierLien() {
    navigator.clipboard.writeText(lienSuivi)
    setCopie(true)
    setTimeout(function () {
      setCopie(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-surface text-ink px-4 py-16 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-surface-alt rounded-2xl shadow-card border border-border">
        <div className="p-8 text-center">
          <div className="mx-auto mb-5 w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
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
            <Button onClick={copierLien} variant="secondary">
              {copie ? 'Lien copié' : 'Copier le lien'}
            </Button>
          </div>
          <p className="text-xs text-danger mt-5 text-center">
            Attention — ce lien est votre seul moyen d'accéder au suivi.
          </p>
        </div>
      </div>
    </div>
  )
}
