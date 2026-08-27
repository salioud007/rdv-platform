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

  const conteneurClasses = [
    'min-h-screen',
    'bg-[#F7F5F0]',
    'text-[#1C1A17]',
    'px-4',
    'py-12',
    'flex',
    'flex-col',
    'items-center',
  ].join(' ')

  const carteClasses = [
    'max-w-lg',
    'w-full',
    'border',
    'border-[#D6D2C4]',
    'rounded-sm',
    'p-6',
    'bg-white',
  ].join(' ')

  if (chargement) {
    return (
      <div className={conteneurClasses}>
        <Loader label="Verification du lien de suivi..." />
      </div>
    )
  }

  if (erreur) {
    return (
      <div className={conteneurClasses}>
        <p className="text-sm text-[#991B1B]">{erreur}</p>
      </div>
    )
  }

  return (
    <div className={conteneurClasses}>
      <div className={carteClasses}>
        <h1 className="font-serif text-2xl mb-4">
          Suivi de votre demande
        </h1>

        <div className="mb-4">
          <Badge statut={demande.statut} />
        </div>

        <dl className="text-sm space-y-2 mb-4">
          <div>
            <dt className="text-[#6b6375]">Motif</dt>
            <dd>{demande.motif}</dd>
          </div>
          <div>
            <dt className="text-[#6b6375]">Soumise le</dt>
            <dd>{formatDateTime(demande.date_soumission)}</dd>
          </div>
          {demande.commentaire_admin && (
            <div>
              <dt className="text-[#6b6375]">Commentaire</dt>
              <dd>{demande.commentaire_admin}</dd>
            </div>
          )}
        </dl>

        {demande.statut === 'Acceptée' && (
          <a href={urlTelechargerIcs(token)}>
            <Button variant="success">
              Telecharger le fichier .ics
            </Button>
          </a>
        )}
      </div>
    </div>
  )
}
