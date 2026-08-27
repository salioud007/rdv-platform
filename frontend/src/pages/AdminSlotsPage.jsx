import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loader from '../components/common/Loader'
import { listerTousLesCreneaux, creerCreneau } from '../services/slotService'
import { formatDateTime } from '../utils/formatDate'

export default function AdminSlotsPage() {
  const navigate = useNavigate()
  const [creneaux, setCreneaux] = useState([])
  const [chargement, setChargement] = useState(true)
  const [dateHeure, setDateHeure] = useState('')
  const [dureeMinutes, setDureeMinutes] = useState('30')
  const [erreur, setErreur] = useState(null)

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
    try {
      const dateFormatee = dateHeure.replace('T', ' ') + ':00'
      await creerCreneau(dateFormatee, Number(dureeMinutes))
      setDateHeure('')
      chargerCreneaux()
    } catch (err) {
      setErreur('Erreur lors de la creation du creneau.')
    }
  }

  const conteneurClasses = [
    'min-h-screen',
    'bg-surface',
    'text-ink',
    'px-4',
    'py-8',
  ].join(' ')

  const formeClasses = [
    'border',
    'border-border',
    'rounded-sm',
    'p-4',
    'bg-white',
    'mb-6',
    'flex',
    'gap-3',
    'items-end',
  ].join(' ')

  return (
    <div className={conteneurClasses}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-serif text-2xl">
            Gestion des creneaux
          </h1>
          <Button
            variant="secondary"
            onClick={function () {
              navigate('/admin')
            }}
          >
            Retour au tableau de bord
          </Button>
        </div>

        <form onSubmit={handleSubmit} className={formeClasses}>
          <Input
            id="dateHeure"
            label="Date et heure"
            type="datetime-local"
            value={dateHeure}
            onChange={function (e) {
              setDateHeure(e.target.value)
            }}
          />
          <Input
            id="duree"
            label="Duree (minutes)"
            type="number"
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
          <Loader label="Chargement des creneaux..." />
        ) : (
          <div className="border border-border rounded-sm bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#EFEBE1] text-left">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Duree</th>
                  <th className="px-3 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {creneaux.map(function (creneau) {
                  return (
                    <tr key={creneau.id} className="border-t border-border">
                      <td className="px-3 py-2">
                        {formatDateTime(creneau.date_heure)}
                      </td>
                      <td className="px-3 py-2">
                        {creneau.duree_minutes} min
                      </td>
                      <td className="px-3 py-2">
                        {creneau.disponible ? (
                          <span className="text-success text-xs">Disponible</span>
                        ) : (
                          <span className="text-ink-muted text-xs">Pris</span>
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
