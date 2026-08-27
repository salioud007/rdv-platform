import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import api from '../services/api'
import {
  obtenirDetailDemande,
  traiterDemande,
  urlTelechargerFichier,
} from '../services/requestService'
import { formatDateTime } from '../utils/formatDate'

export default function AdminRequestDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [demande, setDemande] = useState(null)
  const [commentaire, setCommentaire] = useState('')
  const [chargement, setChargement] = useState(true)
  const [enTraitement, setEnTraitement] = useState(false)
  const [erreur, setErreur] = useState(null)

  useEffect(function () {
    obtenirDetailDemande(id)
      .then(function (data) {
        setDemande(data)
      })
      .finally(function () {
        setChargement(false)
      })
  }, [id])

  async function handleDecision(decision) {
    setEnTraitement(true)
    setErreur(null)
    try {
      const result = await traiterDemande(id, decision, commentaire)
      setDemande(result)
    } catch (err) {
      setErreur('Erreur lors du traitement de la demande.')
    } finally {
      setEnTraitement(false)
    }
  }

  async function telechargerFichier() {
    try {
      const response = await api.get(
        '/demandes/' + id + '/fichier',
        { responseType: 'blob' }
      )
      const url = window.URL.createObjectURL(response.data)
      const lien = document.createElement('a')
      lien.href = url
      lien.download = 'piece-jointe'
      lien.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setErreur('Impossible de telecharger le fichier.')
    }
  }

  const conteneurClasses = [
    'min-h-screen',
    'bg-surface',
    'text-ink',
    'px-4',
    'py-8',
  ].join(' ')

  const carteClasses = [
    'max-w-2xl',
    'mx-auto',
    'border',
    'border-border',
    'rounded-sm',
    'p-6',
    'bg-white',
  ].join(' ')

  if (chargement) {
    return (
      <div className={conteneurClasses}>
        <Loader label="Chargement de la demande..." />
      </div>
    )
  }

  if (!demande) {
    return (
      <div className={conteneurClasses}>
        <p className="text-sm text-danger">Demande introuvable.</p>
      </div>
    )
  }

  const dejaTraitee = demande.statut === 'Acceptée' || demande.statut === 'Refusée'

  return (
    <div className={conteneurClasses}>
      <div className="max-w-2xl mx-auto mb-4">
        <Button
          variant="secondary"
          onClick={function () {
            navigate('/admin')
          }}
        >
          Retour au tableau de bord
        </Button>
      </div>

      <div className={carteClasses}>
        <div className="flex justify-between items-start mb-4">
          <h1 className="font-serif text-2xl">
            {demande.nom}
          </h1>
          <Badge statut={demande.statut} />
        </div>

        <dl className="text-sm space-y-2 mb-6">
          <div>
            <dt className="text-ink-muted">Email</dt>
            <dd>{demande.email}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Telephone</dt>
            <dd>{demande.telephone || 'Non fourni'}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Motif</dt>
            <dd>{demande.motif}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Message</dt>
            <dd>{demande.message || 'Aucun message'}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Soumise le</dt>
            <dd>{formatDateTime(demande.date_soumission)}</dd>
          </div>
        </dl>

        <Button variant="secondary" onClick={telechargerFichier}>
          Telecharger la piece jointe
        </Button>

        {erreur && (
          <p className="text-sm text-danger mt-4">{erreur}</p>
        )}

        {!dejaTraitee && (
          <div className="mt-6 pt-6 border-t border-border">
            <label
              htmlFor="commentaire"
              className="text-sm font-medium block mb-2"
            >
              Commentaire (optionnel)
            </label>
            <textarea
              id="commentaire"
              value={commentaire}
              onChange={function (e) {
                setCommentaire(e.target.value)
              }}
              rows={3}
              className="w-full border border-border rounded-sm px-3 py-2 text-sm mb-4"
            />
            <div className="flex gap-3">
              <Button
                variant="success"
                disabled={enTraitement}
                onClick={function () {
                  handleDecision('Acceptee')
                }}
              >
                Accepter
              </Button>
              <Button
                variant="danger"
                disabled={enTraitement}
                onClick={function () {
                  handleDecision('Refusee')
                }}
              >
                Refuser
              </Button>
            </div>
          </div>
        )}

        {dejaTraitee && demande.commentaire_admin && (
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-ink-muted mb-1">
              Commentaire laisse
            </p>
            <p className="text-sm">{demande.commentaire_admin}</p>
          </div>
        )}
      </div>
    </div>
  )
}
