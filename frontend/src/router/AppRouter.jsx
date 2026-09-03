import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/common/Loader'
import HomePage from '../pages/HomePage'
import ConfirmationPage from '../pages/ConfirmationPage'
import TrackingPage from '../pages/TrackingPage'
import AdminLoginPage from '../pages/AdminLoginPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import AdminSlotsPage from '../pages/AdminSlotsPage'
import AdminRequestDetailPage from '../pages/AdminRequestDetailPage'

function RouteProtegee({ children }) {
  const { isAuthenticated, pret } = useAuth()

  if (!pret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader label="Vérification de la session..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/suivi/:token" element={<TrackingPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <RouteProtegee>
              <AdminDashboardPage />
            </RouteProtegee>
          }
        />
        <Route
          path="/admin/creneaux"
          element={
            <RouteProtegee>
              <AdminSlotsPage />
            </RouteProtegee>
          }
        />
        <Route
          path="/admin/demandes/:id"
          element={
            <RouteProtegee>
              <AdminRequestDetailPage />
            </RouteProtegee>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
