import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {PrimeReactProvider} from 'primereact/api'
import 'primereact/resources/themes/lara-dark-purple/theme.css'  // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; 
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
        
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
        <App />
    </PrimeReactProvider>
  </StrictMode>,
)
