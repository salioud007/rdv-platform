import { useNavigate } from 'react-router-dom'
import RequestForm from '../components/form/RequestForm'

export default function HomePage() {
  const navigate = useNavigate()

  function handleSuccess(token) {
    navigate('/confirmation', { state: { token } })
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1A17] px-4 py-12">
      <div className="max-w-lg mx-auto mb-8 text-center">
        <h1 className="font-serif text-3xl mb-2">Demande de rendez-vous</h1>
        <p className="text-sm text-[#6b6375]">
          Remplissez ce formulaire pour solliciter un rendez-vous. Aucune création de compte n'est nécessaire.
        </p>
      </div>
      <RequestForm onSuccess={handleSuccess} />
    </div>
  )
}
