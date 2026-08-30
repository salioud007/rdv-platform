import { useState, useEffect } from 'react'
import { Textarea, Alert } from '@mantine/core'
import Input from '../common/Input'
import Button from '../common/Button'
import SlotSelector from './SlotSelector'
import FileUploadField from './FileUploadField'
import { listerCreneauxDisponibles } from '../../services/slotService'
import { creerDemande } from '../../services/requestService'
import {
  validerFichier,
  validerEmail,
  validerTelephone,
} from '../../utils/validators'

export default function RequestForm({ onSuccess }) {
  const [creneaux, setCreneaux] = useState([])
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [motif, setMotif] = useState('')
  const [message, setMessage] = useState('')
  const [creneauId, setCreneauId] = useState('')
  const [fichier, setFichier] = useState(null)
  const [erreurs, setErreurs] = useState({})
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [erreurServeur, setErreurServeur] = useState(null)

  useEffect(function () {
    listerCreneauxDisponibles()
      .then(setCreneaux)
      .catch(function () {
        setCreneaux([])
      })
  }, [])

  function valider() {
    const nouvellesErreurs = {}
    if (!nom.trim()) {
      nouvellesErreurs.nom = 'Le nom est obligatoire.'
    }
    if (!email.trim()) {
      nouvellesErreurs.email = "L'email est obligatoire."
    } else if (!validerEmail(email)) {
      nouvellesErreurs.email = 'Email invalide.'
    }
    if (!validerTelephone(telephone)) {
      nouvellesErreurs.telephone = 'Numero de telephone invalide.'
    }
    if (!motif.trim()) {
      nouvellesErreurs.motif = 'Le motif est obligatoire.'
    }
    if (!creneauId) {
      nouvellesErreurs.creneau = 'Un creneau doit etre selectionne.'
    }
    const erreurFichier = validerFichier(fichier)
    if (erreurFichier) {
      nouvellesErreurs.fichier = erreurFichier
    }

    setErreurs(nouvellesErreurs)
    return Object.keys(nouvellesErreurs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErreurServeur(null)
    if (!valider()) return

    setEnvoiEnCours(true)
    try {
      const formData = new FormData()
      formData.append('nom', nom)
      formData.append('email', email)
      formData.append('telephone', telephone)
      formData.append('motif', motif)
      formData.append('message', message)
      formData.append('creneau_id', creneauId)
      formData.append('fichier', fichier)

      const result = await creerDemande(formData)
      onSuccess(result.token)
    } catch (err) {
      const messageErreur =
        err.response &&
        err.response.data &&
        err.response.data.error
          ? err.response.data.error
          : "Une erreur est survenue lors de l'envoi."
      setErreurServeur(messageErreur)
    } finally {
      setEnvoiEnCours(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto">
      <Input
        id="nom"
        label="Nom complet"
        value={nom}
        onChange={function (e) {
          setNom(e.target.value)
        }}
        error={erreurs.nom}
      />
      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={function (e) {
          setEmail(e.target.value)
        }}
        error={erreurs.email}
      />
      <Input
        id="telephone"
        label="Telephone (optionnel)"
        value={telephone}
        onChange={function (e) {
          setTelephone(e.target.value)
        }}
        error={erreurs.telephone}
      />
      <Input
        id="motif"
        label="Motif du rendez-vous"
        value={motif}
        onChange={function (e) {
          setMotif(e.target.value)
        }}
        error={erreurs.motif}
      />
      <SlotSelector
        creneaux={creneaux}
        valeur={creneauId}
        onChange={setCreneauId}
        error={erreurs.creneau}
      />
      <FileUploadField
        fichier={fichier}
        onChange={setFichier}
        error={erreurs.fichier}
      />
      <Textarea
        id="message"
        label="Message complementaire (optionnel)"
        value={message}
        onChange={function (e) {
          setMessage(e.target.value)
        }}
        rows={3}
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

      {erreurServeur && (
        <Alert color="var(--color-danger)" variant="light" radius="lg">
          {erreurServeur}
        </Alert>
      )}

      <Button type="submit" disabled={envoiEnCours}>
        {envoiEnCours ? 'Envoi en cours...' : 'Envoyer ma demande'}
      </Button>
    </form>
  )
}
