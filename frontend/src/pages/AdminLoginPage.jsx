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

  return (
    <div className="min-h-screen bg-surface text-ink flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="max-w-sm w-full bg-surface-alt rounded-2xl shadow-card border border-border p-8">
        <span className="eyebrow mb-3">Accès sécurisé</span>
        <h1 className="font-display text-2xl font-semibold tracking-tight mt-3 mb-6">
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
            <p className="text-sm text-danger">{erreur}</p>
          )}
          <Button type="submit" disabled={chargement}>
            {chargement ? 'Connexion...' : 'Se connecter'}
          </Button>
        </div>
      </form>
    </div>
  )
}
