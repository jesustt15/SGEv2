
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { AuthProvider, EstudianteProvider, RepresentanteProvider, 
  UsuarioProvider, AutorizadoProvider, PersonalProvider, EventoProvider } from './context'
import './App.css';

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <UsuarioProvider>
          <EstudianteProvider>
            <RepresentanteProvider>
              <AutorizadoProvider>
                <PersonalProvider>
                  <EventoProvider>
                    <AppRouter/>
                  </EventoProvider> 
                </PersonalProvider>
              </AutorizadoProvider>
            </RepresentanteProvider>
          </EstudianteProvider>
        </UsuarioProvider>
      </AuthProvider>
</BrowserRouter>

  )
}

export default App
