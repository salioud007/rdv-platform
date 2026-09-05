import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Paper, Alert } from '@mantine/core'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import { obtenirSuiviParToken, urlTelechargerIcs } from '../services/requestService'
import { formatDateTime } from '../utils/formatDate'
const cardStyle = {
  backgroundColor: 'var(--color-surface-alt)',
  borderColor: 'var(--color-border)',
  boxShadow: '0 1px 2px rgba(11, 18, 32, 0.04), 0 12px 28px -12px rgba(11, 18, 32, 0.16)',
}
export default function TrackingPage() {
  const { token } = useParams()
  const [demande, setDemande] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(true)

  useEffect(function () {
    let isActif = true

    function charger(estPremierChargement) {
      obtenirSuiviParToken(token)
        .then(function (data) {
          if (!isActif) return
          setDemande(data)
          setErreur(null)
        })
        .catch(function () {
          if (!isActif) return
          setErreur('Ce lien de suivi est invalide ou la demande est introuvable.')
        })
        .finally(function () {
          if (isActif && estPremierChargement) setChargement(false)
        })
    }

    charger(true)

    const intervalId = setInterval(function () {
      setDemande(function (demandeActuelle) {
        if (demandeActuelle && demandeActuelle.statut === 'Acceptée') {
          clearInterval(intervalId)
        }
        return demandeActuelle
      })
      charger(false)
    }, 3000)

    return function () {
      isActif = false
      clearInterval(intervalId)
    }
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
        <Paper radius="xl" withBorder className="max-w-md w-full" style={cardStyle}>
          <div className="p-8">
            <Alert color="var(--color-danger)" variant="light" radius="lg">
              {erreur}
            </Alert>
          </div>
        </Paper>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-surface text-ink px-4 py-16 flex flex-col items-center justify-center">
      <Paper radius="xl" withBorder className="max-w-md w-full" style={cardStyle}>
        <div className="p-8">
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
      </Paper>
    </div>
  )
}
