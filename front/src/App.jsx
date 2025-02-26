
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { AuthProvider, EstudianteProvider, UsuarioProvider } from './context'
import './App.css';

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <UsuarioProvider>
          <EstudianteProvider>
              <AppRouter />
          </EstudianteProvider>
        </UsuarioProvider>
      </AuthProvider>
</BrowserRouter>

  )
}

export default App
