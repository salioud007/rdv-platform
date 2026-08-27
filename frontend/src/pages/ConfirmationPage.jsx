import { useState } from 'react'
import { useLocation, Navigate, Link } from 'react-router-dom'
import Button from '../components/common/Button'

export default function ConfirmationPage() {
  const location = useLocation()
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

  const boiteClasses = [
    'max-w-lg',
    'w-full',
    'border-2',
    'border-ink',
    'rounded-sm',
    'p-6',
    'text-center',
  ].join(' ')

  const lienClasses = [
    'text-sm',
    'underline',
    'mt-6',
    'text-ink',
  ].join(' ')

  return (
    <div className="min-h-screen bg-surface text-ink px-4 py-12 flex flex-col items-center">
      <div className={boiteClasses}>
        <h1 className="font-serif text-2xl mb-3">
          Demande transmise
        </h1>
        <p className="text-sm text-ink-muted mb-6">
          Votre demande a bien ete enregistree.
          Conservez le lien ci-dessous.
          Il ne pourra pas vous etre renvoye.
        </p>

        <div className="bg-white border border-border rounded-sm px-3 py-2 mb-3 break-all font-mono text-sm">
          {lienSuivi}
        </div>

        <Button onClick={copierLien} variant="secondary">
          {copie ? 'Lien copie' : 'Copier le lien'}
        </Button>

        <p className="text-xs text-danger mt-6">
          Attention.
          Ce lien est votre seul moyen d acceder au suivi.
        </p>
      </div>

      <Link to={'/suivi/' + token} className={lienClasses}>
        Consulter le suivi maintenant
      </Link>
    </div>
  )
}
