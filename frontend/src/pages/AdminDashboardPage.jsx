import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, SegmentedControl, Table } from '@mantine/core'
import Badge from '../components/common/Badge'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'
import { listerDemandes } from '../services/requestService'
import { formatDateTime } from '../utils/formatDate'

const FILTRES = [
  { value: 'toutes', label: 'Toutes' },
  { value: 'En attente de traitement', label: 'En attente' },
  { value: "En cours d'examen", label: 'En cours' },
  { value: 'Acceptée', label: 'Acceptée' },
  { value: 'Refusée', label: 'Refusée' },
]

const cardStyle = {
  backgroundColor: 'var(--color-surface-alt)',
  borderColor: 'var(--color-border)',
}

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
          <Paper radius="xl" withBorder style={cardStyle} p="lg">
            <p className="text-3xl font-mono font-medium text-signal">{enAttente}</p>
            <p className="text-xs text-ink-muted mt-1">En attente</p>
          </Paper>
          <Paper radius="xl" withBorder style={cardStyle} p="lg">
            <p className="text-3xl font-mono font-medium text-ink">{traitees}</p>
            <p className="text-xs text-ink-muted mt-1">Traitées ce mois</p>
          </Paper>
          <Paper radius="xl" withBorder style={cardStyle} p="lg">
            <p className="text-3xl font-mono font-medium text-success">{tauxAcceptation}%</p>
            <p className="text-xs text-ink-muted mt-1">Taux d'acceptation</p>
          </Paper>
        </div>

        <SegmentedControl
          value={filtre}
          onChange={setFiltre}
          data={FILTRES}
          radius="xl"
          className="mb-4"
          styles={{
            root: {
              backgroundColor: 'var(--color-surface-alt)',
              border: '1px solid var(--color-border)',
            },
            indicator: {
              backgroundColor: 'var(--color-ink)',
            },
            label: {
              fontSize: '0.75rem',
              fontWeight: 500,
            },
          }}
        />

        {chargement ? (
          <Paper radius="xl" withBorder style={cardStyle} p="xl" className="flex justify-center">
            <Loader label="Chargement des demandes..." />
          </Paper>
        ) : demandesFiltrees.length === 0 ? (
          <Paper radius="xl" withBorder style={cardStyle} p="xl" className="text-center">
            <p className="text-sm text-ink-muted">Aucune demande pour ce filtre.</p>
          </Paper>
        ) : (
          <Paper
            radius="xl"
            withBorder
            style={{
              ...cardStyle,
              boxShadow: '0 1px 2px rgba(11, 18, 32, 0.04), 0 12px 28px -12px rgba(11, 18, 32, 0.16)',
              overflow: 'hidden',
            }}
          >
            <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md">
              <Table.Thead style={{ backgroundColor: 'var(--color-table-header)' }}>
                <Table.Tr>
                  <Table.Th className="text-xs font-medium text-ink-muted uppercase tracking-wide">Nom</Table.Th>
                  <Table.Th className="text-xs font-medium text-ink-muted uppercase tracking-wide">Date souhaitée</Table.Th>
                  <Table.Th className="text-xs font-medium text-ink-muted uppercase tracking-wide">Motif</Table.Th>
                  <Table.Th className="text-xs font-medium text-ink-muted uppercase tracking-wide">Statut</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {demandesFiltrees.map(function (demande) {
                  return (
                    <Table.Tr
                      key={demande.id}
                      style={{ cursor: 'pointer' }}
                      onClick={function () {
                        navigate('/admin/demandes/' + demande.id)
                      }}
                    >
                      <Table.Td className="font-medium">{demande.nom}</Table.Td>
                      <Table.Td>
                        <span className="font-mono text-xs">{formatDateTime(demande.date_heure_creneau)}</span>
                        {demande.conflits > 0 && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-signal bg-signal/10 px-2 py-0.5 rounded-full">
                            {'\u26A0 ' + demande.conflits + ' autre(s)'}
                          </span>
                        )}
                      </Table.Td>
                      <Table.Td className="text-ink-muted">{demande.motif}</Table.Td>
                      <Table.Td>
                        <Badge statut={demande.statut} />
                      </Table.Td>
                      <Table.Td className="text-ink-muted text-right">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
              </Table.Tbody>
            </Table>
          </Paper>
        )}
      </div>
    </div>
  )
}
