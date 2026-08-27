import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'
import { listerDemandes } from '../services/requestService'
import { formatDateTime } from '../utils/formatDate'

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

  const conteneurClasses = [
    'min-h-screen',
    'bg-surface',
    'text-ink',
    'px-4',
    'py-8',
  ].join(' ')

  const statCarteClasses = [
    'border',
    'border-border',
    'rounded-sm',
    'p-4',
    'bg-white',
    'text-center',
  ].join(' ')

  return (
    <div className={conteneurClasses}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-serif text-2xl">
            Tableau de bord
          </h1>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={function () {
                navigate('/admin/creneaux')
              }}
            >
              Gerer les creneaux
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Deconnexion
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={statCarteClasses}>
            <p className="text-2xl font-mono">{enAttente}</p>
            <p className="text-xs text-ink-muted">En attente</p>
          </div>
          <div className={statCarteClasses}>
            <p className="text-2xl font-mono">{traitees}</p>
            <p className="text-xs text-ink-muted">Traitees ce mois</p>
          </div>
          <div className={statCarteClasses}>
            <p className="text-2xl font-mono">{tauxAcceptation}%</p>
            <p className="text-xs text-ink-muted">Taux d acceptation</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {['toutes', 'En attente de traitement', "En cours d'examen", 'Acceptée', 'Refusée'].map(function (statut) {
            return (
              <button
                key={statut}
                onClick={function () {
                  setFiltre(statut)
                }}
                className={
                  filtre === statut
                    ? 'text-xs px-3 py-1 rounded-full bg-ink text-white'
                    : 'text-xs px-3 py-1 rounded-full border border-border'
                }
              >
                {statut === 'toutes' ? 'Toutes' : statut}
              </button>
            )
          })}
        </div>

        {chargement ? (
          <Loader label="Chargement des demandes..." />
        ) : (
          <div className="border border-border rounded-sm bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-table-header text-left">
                <tr>
                  <th className="px-3 py-2">Nom</th>
                  <th className="px-3 py-2">Date souhaitee</th>
                  <th className="px-3 py-2">Motif</th>
                  <th className="px-3 py-2">Statut</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {demandesFiltrees.map(function (demande) {
                  return (
                    <tr
                      key={demande.id}
                      className="border-t border-border cursor-pointer hover:bg-surface"
                      onClick={function () {
                        navigate('/admin/demandes/' + demande.id)
                      }}
                    >
                      <td className="px-3 py-2">{demande.nom}</td>
                      <td className="px-3 py-2">
                        {formatDateTime(demande.date_heure_creneau)}
                        {demande.conflits > 0 && (
                          <span className="ml-2 text-xs text-accent">
                            {'\u26A0 ' + demande.conflits + ' autre(s) ce jour'}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">{demande.motif}</td>
                      <td className="px-3 py-2">
                        <Badge statut={demande.statut} />
                      </td>
                      <td className="px-3 py-2 text-ink-muted">
                        {'>'}
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
