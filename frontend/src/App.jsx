import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'
import { MantineProvider } from '@mantine/core'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './router/AppRouter'
function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </MantineProvider>
  )
}
export default App
