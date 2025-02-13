
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { AuthProvider, UsuarioProvider } from './context'
import './App.css';

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <UsuarioProvider>
          <AppRouter />
        </UsuarioProvider>
      </AuthProvider>
</BrowserRouter>

  )
}

export default App
