
import {Routes, Route, Navigate} from 'react-router-dom';
import { Home, Login } from '../auth';
import { RutaProtegida } from './RutaProtegida';


export const AppRouter = () => {
  return (
    <Routes>
    <Route path="/auth/*" element={<Login />} />
    <Route element={<RutaProtegida />}>
        <Route path="/" element={<Home />} />
       
    </Route>
    <Route path="*" element={<Navigate to="/auth/" />} />
    </Routes>
  )
}
