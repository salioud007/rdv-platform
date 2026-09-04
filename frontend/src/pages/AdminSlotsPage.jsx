import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, NumberInput, Table } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import Badge from '../components/common/Badge'
import { listerTousLesCreneaux, creerCreneau, supprimerCreneau } from '../services/slotService'
import { formatDateTime } from '../utils/formatDate'

function obtenirDateMinimale() {
  return new Date()
}

function obtenirDateMaximale() {
  const dansDeuxAns = new Date()
  dansDeuxAns.setFullYear(dansDeuxAns.getFullYear() + 2)
  return dansDeuxAns
}

const cardStyle = {
  backgroundColor: 'var(--color-surface-alt)',
  borderColor: 'var(--color-border)',
}

export default function AdminSlotsPage() {
  const navigate = useNavigate()
  const [creneaux, setCreneaux] = useState([])
  const [chargement, setChargement] = useState(true)
  const [dateHeure, setDateHeure] = useState(null)
  const [dureeMinutes, setDureeMinutes] = useState(30)
  const [erreur, setErreur] = useState(null)
  const [suppressionEnCours, setSuppressionEnCours] = useState(null)

  const dateMinimale = obtenirDateMinimale()
  const dateMaximale = obtenirDateMaximale()

  useEffect(function () {
    chargerCreneaux()
  }, [])

  function chargerCreneaux() {
    setChargement(true)
    listerTousLesCreneaux()
      .then(function (data) {
        setCreneaux(data)
      })
      .finally(function () {
        setChargement(false)
      })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur(null)

    if (!dateHeure) {
      setErreur('Une date et heure sont obligatoires.')
      return
    }

    const dateChoisie = new Date(dateHeure)

    if (isNaN(dateChoisie.getTime())) {
      setErreur('La date saisie est invalide.')
      return
    }

    const maintenant = new Date()
    if (dateChoisie <= maintenant) {
      setErreur('La date du creneau doit etre dans le futur.')
      return
    }

    const limiteHaute = new Date()
    limiteHaute.setFullYear(limiteHaute.getFullYear() + 2)
    if (dateChoisie > limiteHaute) {
      setErreur('La date du creneau ne peut pas depasser 2 ans dans le futur.')
      return
    }

    const duree = Number(dureeMinutes)
    if (!duree || duree <= 0) {
      setErreur('La duree doit etre superieure a 0.')
      return
    }
    if (duree > 480) {
      setErreur('La duree ne peut pas depasser 480 minutes (8 heures).')
      return
    }

    try {
      const dateFormatee = dateHeure.length === 16 ? dateHeure + ':00' : dateHeure
      await creerCreneau(dateFormatee, duree)
      setDateHeure(null)
      chargerCreneaux()
    } catch (err) {
      const messageErreur =
        err.response &&
        err.response.data &&
        err.response.data.error
          ? err.response.data.error
          : 'Erreur lors de la creation du creneau.'
      setErreur(messageErreur)
    }
  }

  async function handleSupprimer(creneau) {
    const confirmation = window.confirm(
      `Supprimer le creneau du ${formatDateTime(creneau.date_heure)} ?`
    )
    if (!confirmation) return

    setErreur(null)
    setSuppressionEnCours(creneau.id)

    try {
      await supprimerCreneau(creneau.id)
      chargerCreneaux()
    } catch (err) {
      const messageErreur =
        err.response &&
        err.response.data &&
        err.response.data.error
          ? err.response.data.error
          : 'Erreur lors de la suppression du creneau.'
      setErreur(messageErreur)
    } finally {
      setSuppressionEnCours(null)
    }
  }

  const inputStyles = {
    input: {
      borderRadius: '0.75rem',
      borderColor: 'var(--color-border)',
      backgroundColor: 'white',
      fontSize: '0.875rem',
      height: '2.75rem',
    },
    label: {
      fontSize: '0.8125rem',
      fontWeight: 600,
      color: 'var(--color-ink)',
      marginBottom: '0.5rem',
    },
  }

  return (
    <div className="min-h-screen bg-surface text-ink px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="eyebrow mb-3">Disponibilites</span>
            <h1 className="font-display text-3xl font-semibold tracking-tight mt-3">
              Gestion des creneaux
            </h1>
          </div>
          <Button variant="secondary" onClick={function () { navigate('/admin') }}>
            Retour au tableau de bord
          </Button>
        </div>

        <Paper
          component="form"
          onSubmit={handleSubmit}
          radius="xl"
          withBorder
          style={{
            ...cardStyle,
            boxShadow: '0 1px 2px rgba(11, 18, 32, 0.04), 0 12px 28px -12px rgba(11, 18, 32, 0.16)',
          }}
          p="lg"
          className="mb-6 flex gap-3 items-end flex-wrap"
        >
          <DateTimePicker
            label="Date et heure"
            placeholder="Choisir une date"
            minDate={dateMinimale}
            maxDate={dateMaximale}
            value={dateHeure}
            onChange={setDateHeure}
            valueFormat="DD MMM YYYY HH:mm"
            styles={inputStyles}
            className="flex-1"
          />
          <NumberInput
            label="Duree (minutes)"
            min={1}
            max={480}
            value={dureeMinutes}
            onChange={setDureeMinutes}
            styles={inputStyles}
            className="w-32"
          />
          <Button type="submit">
            Ajouter
          </Button>
        </Paper>

        {erreur && (
          <p className="text-sm text-danger mb-4">{erreur}</p>
        )}

        {chargement ? (
          <Paper radius="xl" withBorder style={cardStyle} p="xl" className="flex justify-center">
            <Loader label="Chargement des creneaux..." />
          </Paper>
        ) : creneaux.length === 0 ? (
          <Paper radius="xl" withBorder style={cardStyle} p="xl" className="text-center">
            <p className="text-sm text-ink-muted">
              Aucun creneau cree pour le moment.
            </p>
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
            <Table verticalSpacing="sm" horizontalSpacing="md">
              <Table.Thead style={{ backgroundColor: 'var(--color-table-header)' }}>
                <Table.Tr>
                  <Table.Th className="text-xs font-medium text-ink-muted uppercase tracking-wide">Date</Table.Th>
                  <Table.Th className="text-xs font-medium text-ink-muted uppercase tracking-wide">Duree</Table.Th>
                  <Table.Th className="text-xs font-medium text-ink-muted uppercase tracking-wide">Statut</Table.Th>
                  <Table.Th className="text-xs font-medium text-ink-muted uppercase tracking-wide">Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {creneaux.map(function (creneau) {
                  return (
                    <Table.Tr key={creneau.id}>
                      <Table.Td className="font-mono text-xs">
                        {formatDateTime(creneau.date_heure)}
                      </Table.Td>
                      <Table.Td className="text-ink-muted">
                        {creneau.duree_minutes} min
                      </Table.Td>
                      <Table.Td>
                        <Badge statut={creneau.statut} />
                      </Table.Td>
                      <Table.Td>
                        {creneau.statut !== 'Annule' && (
                          <Button
                            variant="secondary"
                            onClick={function () { handleSupprimer(creneau) }}
                            disabled={suppressionEnCours === creneau.id}
                          >
                            {suppressionEnCours === creneau.id ? '...' : 'Supprimer'}
                          </Button>
                        )}
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
