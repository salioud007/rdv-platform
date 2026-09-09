import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Paper, Modal, Textarea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import api from '../services/api'
import {
  obtenirDetailDemande,
  obtenirHistoriqueDemande,
  traiterDemande,
  urlTelechargerFichier,
} from '../services/requestService'
import { formatDateTime } from '../utils/formatDate'

const cardStyle = {
  backgroundColor: 'var(--color-surface-alt)',
  borderColor: 'var(--color-border)',
  boxShadow: '0 1px 2px rgba(11, 18, 32, 0.04), 0 12px 28px -12px rgba(11, 18, 32, 0.16)',
}

export default function AdminRequestDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [demande, setDemande] = useState(null)
  const [historique, setHistorique] = useState([])
  const [commentaire, setCommentaire] = useState('')
  const [chargement, setChargement] = useState(true)
  const [enTraitement, setEnTraitement] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [decisionEnAttente, setDecisionEnAttente] = useState(null)
  const [opened, { open, close }] = useDisclosure(false)

  useEffect(function () {
    obtenirDetailDemande(id)
      .then(function (data) {
        setDemande(data)
      })
      .finally(function () {
        setChargement(false)
      })
    obtenirHistoriqueDemande(id)
      .then(function (data) {
        setHistorique(data)
      })
      .catch(function () {
        setHistorique([])
      })
  }, [id])

  function demanderConfirmation(decision) {
    setDecisionEnAttente(decision)
    open()
  }

  async function confirmerDecision() {
    setEnTraitement(true)
    setErreur(null)
    close()
    try {
      const result = await traiterDemande(id, decisionEnAttente, commentaire)
      setDemande(result)
      setCommentaire('')
      const nouvelHistorique = await obtenirHistoriqueDemande(id)
      setHistorique(nouvelHistorique)
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
      lien.download = demande.nom_fichier_original || demande.fichier_path
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

  const demandeFinalisee = demande.statut === 'Acceptée'
  const dejaTraitee = demandeFinalisee

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

        <Paper radius="xl" withBorder style={cardStyle} p="xl">
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
              <Textarea
                label="Commentaire (optionnel)"
                value={commentaire}
                onChange={function (e) {
                  setCommentaire(e.target.value)
                }}
                rows={3}
                className="mb-4"
                styles={{
                  input: {
                    borderRadius: '0.75rem',
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'white',
                    fontSize: '0.875rem',
                  },
                  label: {
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                    marginBottom: '0.5rem',
                  },
                }}
              />
              <div className="flex gap-3">
                <Button
                  variant="success"
                  disabled={enTraitement}
                  onClick={function () { demanderConfirmation('Acceptee') }}
                >
                  Accepter
                </Button>
                <Button
                  variant="danger"
                  disabled={enTraitement}
                  onClick={function () { demanderConfirmation('Refusee') }}
                >
                  Refuser
                </Button>
              </div>
            </div>
          )}

          {demande.commentaire_admin && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-ink-muted uppercase tracking-wide font-mono mb-2">
                Dernier commentaire laissé
              </p>
              <p className="text-sm bg-surface border border-border rounded-lg px-3 py-2 leading-relaxed">
                {demande.commentaire_admin}
              </p>
            </div>
          )}

          {historique.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-ink-muted uppercase tracking-wide font-mono mb-3">
                Historique des décisions
              </p>
              <ul className="space-y-3">
                {historique.map(function (entree, index) {
                  return (
                    <li key={entree.id} className="text-sm bg-surface border border-border rounded-lg px-3 py-2">
                      <div className="flex justify-between items-center gap-3">
                        <span>
                          <span className="text-ink-muted">{entree.ancien_statut}</span>
                          {' → '}
                          <span className="font-medium">{entree.nouveau_statut}</span>
                        </span>
                        <span className="font-mono text-xs text-ink-muted shrink-0">
                          {formatDateTime(entree.date_changement)}
                        </span>
                      </div>
                      {entree.commentaire_admin && (
                        <p className="text-ink-muted mt-1 text-xs leading-relaxed">
                          {entree.commentaire_admin}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </Paper>
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title="Confirmer la décision"
        radius="lg"
        centered
      >
        <p className="text-sm text-ink-muted mb-6">
          {decisionEnAttente === 'Acceptee'
            ? (demande.statut === 'Refusée'
                ? 'Cette demande a déjà été refusée. Confirmez-vous sa réévaluation et son acceptation ? Le demandeur pourra télécharger son fichier .ics.'
                : 'Confirmez-vous l\'acceptation de cette demande ? Le demandeur pourra télécharger son fichier .ics.')
            : 'Confirmez-vous le refus de cette demande ?'}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={close}>
            Annuler
          </Button>
          <Button
            variant={decisionEnAttente === 'Acceptee' ? 'success' : 'danger'}
            onClick={confirmerDecision}
          >
            Confirmer
          </Button>
        </div>
      </Modal>
    </div>
  )
}
