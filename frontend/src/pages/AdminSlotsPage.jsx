import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loader from '../components/common/Loader'
import { listerTousLesCreneaux, creerCreneau } from '../services/slotService'
import { formatDateTime } from '../utils/formatDate'

function obtenirDateMinimale() {
  const maintenant = new Date()
  maintenant.setMinutes(maintenant.getMinutes() - maintenant.getTimezoneOffset())
  return maintenant.toISOString().slice(0, 16)
}

function obtenirDateMaximale() {
  const dansDeuxAns = new Date()
  dansDeuxAns.setFullYear(dansDeuxAns.getFullYear() + 2)
  dansDeuxAns.setMinutes(dansDeuxAns.getMinutes() - dansDeuxAns.getTimezoneOffset())
  return dansDeuxAns.toISOString().slice(0, 16)
}

export default function AdminSlotsPage() {
  const navigate = useNavigate()
  const [creneaux, setCreneaux] = useState([])
  const [chargement, setChargement] = useState(true)
  const [dateHeure, setDateHeure] = useState('')
  const [dureeMinutes, setDureeMinutes] = useState('30')
  const [erreur, setErreur] = useState(null)

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
      const dateFormatee = dateHeure.replace('T', ' ') + ':00'
      await creerCreneau(dateFormatee, duree)
      setDateHeure('')
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

  const formeClasses = [
    'bg-surface-alt',
    'rounded-2xl',
    'shadow-card',
    'border',
    'border-border',
    'p-6',
    'mb-6',
    'flex',
    'gap-3',
    'items-end',
  ].join(' ')

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

        <form onSubmit={handleSubmit} className={formeClasses}>
          <Input
            id="dateHeure"
            label="Date et heure"
            type="datetime-local"
            min={dateMinimale}
            max={dateMaximale}
            value={dateHeure}
            onChange={function (e) {
              setDateHeure(e.target.value)
            }}
          />
          <Input
            id="duree"
            label="Duree (minutes)"
            type="number"
            min="1"
            max="480"
            value={dureeMinutes}
            onChange={function (e) {
              setDureeMinutes(e.target.value)
            }}
          />
          <Button type="submit">
            Ajouter
          </Button>
        </form>

        {erreur && (
          <p className="text-sm text-danger mb-4">{erreur}</p>
        )}

        {chargement ? (
          <div className="bg-surface-alt rounded-2xl border border-border p-8 flex justify-center">
            <Loader label="Chargement des creneaux..." />
          </div>
        ) : creneaux.length === 0 ? (
          <div className="bg-surface-alt rounded-2xl border border-border p-12 text-center">
            <p className="text-sm text-ink-muted">
              Aucun creneau cree pour le moment.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl shadow-card border border-border bg-surface-alt overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-table-header text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Duree</th>
                  <th className="px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Statut</th>
                </tr>
              </thead>
              <tbody>
                {creneaux.map(function (creneau) {
                  return (
                    <tr key={creneau.id} className="border-t border-border">
                      <td className="px-4 py-3 font-mono text-xs">
                        {formatDateTime(creneau.date_heure)}
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        {creneau.duree_minutes} min
                      </td>
                      <td className="px-4 py-3">
                        {creneau.disponible ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide bg-success/10 text-success rounded-full px-3 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            Disponible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide bg-secondary-hover text-ink-muted rounded-full px-3 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            Pris
                          </span>
                        )}
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
