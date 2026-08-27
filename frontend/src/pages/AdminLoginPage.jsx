import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState(null)
  const [chargement, setChargement] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur(null)
    setChargement(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setErreur('Identifiants incorrects.')
    } finally {
      setChargement(false)
    }
  }

  const conteneurClasses = [
    'min-h-screen',
    'bg-[#F7F5F0]',
    'text-[#1C1A17]',
    'flex',
    'items-center',
    'justify-center',
    'px-4',
  ].join(' ')

  const carteClasses = [
    'max-w-sm',
    'w-full',
    'border',
    'border-[#D6D2C4]',
    'rounded-sm',
    'p-6',
    'bg-white',
  ].join(' ')

  return (
    <div className={conteneurClasses}>
      <form onSubmit={handleSubmit} className={carteClasses}>
        <h1 className="font-serif text-2xl mb-6 text-center">
          Espace administrateur
        </h1>

        <div className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={function (e) {
              setEmail(e.target.value)
            }}
          />
          <Input
            id="password"
            label="Mot de passe"
            type="password"
            value={password}
            onChange={function (e) {
              setPassword(e.target.value)
            }}
          />

          {erreur && (
            <p className="text-sm text-[#991B1B]">{erreur}</p>
          )}

          <Button type="submit" disabled={chargement}>
            {chargement ? 'Connexion...' : 'Se connecter'}
          </Button>
        </div>
      </form>
    </div>
  )
}
