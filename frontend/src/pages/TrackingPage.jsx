import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import { obtenirSuiviParToken, urlTelechargerIcs } from '../services/requestService'
import { formatDateTime } from '../utils/formatDate'

export default function TrackingPage() {
  const { token } = useParams()
  const [demande, setDemande] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(function () {
    obtenirSuiviParToken(token)
      .then(function (data) {
        setDemande(data)
      })
      .catch(function () {
        setErreur('Ce lien de suivi est invalide ou la demande est introuvable.')
      })
      .finally(function () {
        setChargement(false)
      })
  }, [token])

  if (chargement) {
    return (
      <div className="min-h-screen bg-surface text-ink px-4 py-16 flex flex-col items-center justify-center">
        <Loader label="Vérification du lien de suivi..." />
      </div>
    )
  }

  if (erreur) {
    return (
      <div className="min-h-screen bg-surface text-ink px-4 py-16 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-surface-alt rounded-2xl shadow-card border border-border p-8 text-center">
          <p className="text-sm text-danger">{erreur}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface text-ink px-4 py-16 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-surface-alt rounded-2xl shadow-card border border-border p-8">
        <span className="eyebrow mb-3">Suivi de demande</span>
        <h1 className="font-display text-2xl font-semibold tracking-tight mt-3 mb-4">
          {demande.motif}
        </h1>
        <Badge statut={demande.statut} />

        <dl className="text-sm space-y-3 mt-6 mb-2">
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-ink-muted">Soumise le</dt>
            <dd className="font-mono text-xs">{formatDateTime(demande.date_soumission)}</dd>
          </div>
          {demande.commentaire_admin && (
            <div className="pt-1">
              <dt className="text-ink-muted mb-1">Commentaire de l'administrateur</dt>
              <dd className="bg-surface border border-border rounded-lg px-3 py-2 leading-relaxed">
                {demande.commentaire_admin}
              </dd>
            </div>
          )}
        </dl>

        {demande.statut === 'Acceptée' && (
          <a href={urlTelechargerIcs(token)} className="block mt-6">
            <Button variant="success">
              Télécharger le fichier .ics
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}
