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
      setErreur('Impossible de télécharger le fichier.')
    }
  }

  if (chargement) {
    return (
      <div className="min-h-screen bg-surface text-ink px-4 py-10 flex justify-center">
        <Loader label="Chargement de la demande..." />
      </div>
    )
  }

  if (!demande) {
    return (
      <div className="min-h-screen bg-surface text-ink px-4 py-10 flex justify-center">
        <p className="text-sm text-danger">Demande introuvable.</p>
      </div>
    )
  }

  const dejaTraitee = demande.statut === 'Acceptée' || demande.statut === 'Refusée'

  const champs = [
    { label: 'Email', valeur: demande.email },
    { label: 'Téléphone', valeur: demande.telephone || 'Non fourni' },
    { label: 'Motif', valeur: demande.motif },
    { label: 'Message', valeur: demande.message || 'Aucun message' },
  ]

  return (
    <div className="min-h-screen bg-surface text-ink px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={function () { navigate('/admin') }}
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Retour au tableau de bord
        </button>

        <div className="bg-surface-alt rounded-2xl shadow-card border border-border p-8">
          <div className="flex justify-between items-start mb-1">
            <span className="eyebrow">Demande</span>
            <Badge statut={demande.statut} />
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight mt-3 mb-6">
            {demande.nom}
          </h1>

          <dl className="text-sm space-y-3 mb-6">
            {champs.map(function (champ) {
              return (
                <div key={champ.label} className="flex justify-between gap-4 border-b border-border pb-2">
                  <dt className="text-ink-muted shrink-0">{champ.label}</dt>
                  <dd className="text-right">{champ.valeur}</dd>
                </div>
              )
            })}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Soumise le</dt>
              <dd className="font-mono text-xs">{formatDateTime(demande.date_soumission)}</dd>
            </div>
          </dl>

          <Button variant="secondary" onClick={telechargerFichier}>
            Télécharger la pièce jointe
          </Button>

          {erreur && (
            <p className="text-sm text-danger mt-4">{erreur}</p>
          )}

          {!dejaTraitee && (
            <div className="mt-6 pt-6 border-t border-border">
              <label htmlFor="commentaire" className="text-sm font-medium block mb-2">
                Commentaire (optionnel)
              </label>
              <textarea
                id="commentaire"
                value={commentaire}
                onChange={function (e) {
                  setCommentaire(e.target.value)
                }}
                rows={3}
                className="w-full border border-border rounded-lg px-3.5 py-2.5 text-sm mb-4 transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
              <div className="flex gap-3">
                <Button
                  variant="success"
                  disabled={enTraitement}
                  onClick={function () { handleDecision('Acceptee') }}
                >
                  Accepter
                </Button>
                <Button
                  variant="danger"
                  disabled={enTraitement}
                  onClick={function () { handleDecision('Refusee') }}
                >
                  Refuser
                </Button>
              </div>
            </div>
          )}

          {dejaTraitee && demande.commentaire_admin && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-ink-muted uppercase tracking-wide font-mono mb-2">
                Commentaire laissé
              </p>
              <p className="text-sm bg-surface border border-border rounded-lg px-3 py-2 leading-relaxed">
                {demande.commentaire_admin}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
