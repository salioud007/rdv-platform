import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, PasswordInput, Alert } from '@mantine/core'
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
      <Paper
        component="form"
        onSubmit={handleSubmit}
        radius="xl"
        withBorder
        className="max-w-sm w-full"
        style={{
          backgroundColor: 'var(--color-surface-alt)',
          borderColor: 'var(--color-border)',
          boxShadow: '0 1px 2px rgba(11, 18, 32, 0.04), 0 12px 28px -12px rgba(11, 18, 32, 0.16)',
          padding: '2rem',
        }}
      >
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
          <PasswordInput
            id="password"
            label="Mot de passe"
            value={password}
            onChange={function (e) {
              setPassword(e.target.value)
            }}
            styles={{
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
            }}
          />
          {erreur && (
            <Alert color="var(--color-danger)" variant="light" radius="lg">
              {erreur}
            </Alert>
          )}
          <Button type="submit" disabled={chargement}>
            {chargement ? 'Connexion...' : 'Se connecter'}
          </Button>
        </div>
      </Paper>
    </div>
  )
}
