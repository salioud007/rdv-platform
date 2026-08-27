import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'
import { listerDemandes } from '../services/requestService'
import { formatDateTime } from '../utils/formatDate'

const FILTRES = ['toutes', 'En attente de traitement', "En cours d'examen", 'Acceptée', 'Refusée']

export default function AdminDashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [demandes, setDemandes] = useState([])
  const [filtre, setFiltre] = useState('toutes')
  const [chargement, setChargement] = useState(true)

  useEffect(function () {
    chargerDemandes()
  }, [])

  function chargerDemandes() {
    setChargement(true)
    listerDemandes()
      .then(function (data) {
        setDemandes(data)
      })
      .finally(function () {
        setChargement(false)
      })
  }

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  const demandesFiltrees = demandes.filter(function (d) {
    if (filtre === 'toutes') return true
    return d.statut === filtre
  })

  const enAttente = demandes.filter(function (d) {
    return d.statut === 'En attente de traitement'
  }).length

  const traitees = demandes.filter(function (d) {
    return d.statut === 'Acceptée' || d.statut === 'Refusée'
  }).length

  const acceptees = demandes.filter(function (d) {
    return d.statut === 'Acceptée'
  }).length

  const tauxAcceptation = traitees > 0
    ? Math.round((acceptees / traitees) * 100)
    : 0

  return (
    <div className="min-h-screen bg-surface text-ink px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="eyebrow mb-3">Administration</span>
            <h1 className="font-display text-3xl font-semibold tracking-tight mt-3">
              Tableau de bord
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={function () { navigate('/admin/creneaux') }}>
              Gérer les créneaux
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-alt rounded-2xl border border-border p-5">
            <p className="text-3xl font-mono font-medium text-signal">{enAttente}</p>
            <p className="text-xs text-ink-muted mt-1">En attente</p>
          </div>
          <div className="bg-surface-alt rounded-2xl border border-border p-5">
            <p className="text-3xl font-mono font-medium text-ink">{traitees}</p>
            <p className="text-xs text-ink-muted mt-1">Traitées ce mois</p>
          </div>
          <div className="bg-surface-alt rounded-2xl border border-border p-5">
            <p className="text-3xl font-mono font-medium text-success">{tauxAcceptation}%</p>
            <p className="text-xs text-ink-muted mt-1">Taux d'acceptation</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {FILTRES.map(function (statut) {
            const actif = filtre === statut
            return (
              <button
                key={statut}
                onClick={function () { setFiltre(statut) }}
                className={
                  actif
                    ? 'text-xs font-medium px-3.5 py-1.5 rounded-full bg-ink text-white transition-colors'
                    : 'text-xs font-medium px-3.5 py-1.5 rounded-full border border-border text-ink-muted hover:bg-secondary-hover transition-colors'
                }
              >
                {statut === 'toutes' ? 'Toutes' : statut}
              </button>
            )
          })}
        </div>

        {chargement ? (
          <div className="bg-surface-alt rounded-2xl border border-border p-8 flex justify-center">
            <Loader label="Chargement des demandes..." />
          </div>
        ) : demandesFiltrees.length === 0 ? (
          <div className="bg-surface-alt rounded-2xl border border-border p-12 text-center">
            <p className="text-sm text-ink-muted">Aucune demande pour ce filtre.</p>
          </div>
        ) : (
          <div className="rounded-2xl shadow-card border border-border bg-surface-alt overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-table-header text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Nom</th>
                  <th className="px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Date souhaitée</th>
                  <th className="px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Motif</th>
                  <th className="px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Statut</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {demandesFiltrees.map(function (demande) {
                  return (
                    <tr
                      key={demande.id}
                      className="border-t border-border cursor-pointer hover:bg-surface transition-colors"
                      onClick={function () {
                        navigate('/admin/demandes/' + demande.id)
                      }}
                    >
                      <td className="px-4 py-3 font-medium">{demande.nom}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs">{formatDateTime(demande.date_heure_creneau)}</span>
                        {demande.conflits > 0 && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-signal bg-signal/10 px-2 py-0.5 rounded-full">
                            {'\u26A0 ' + demande.conflits + ' autre(s)'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{demande.motif}</td>
                      <td className="px-4 py-3">
                        <Badge statut={demande.statut} />
                      </td>
                      <td className="px-4 py-3 text-ink-muted text-right">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
