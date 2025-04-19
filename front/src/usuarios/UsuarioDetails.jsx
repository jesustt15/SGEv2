/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import "../App.css";
import { useNavigate } from "react-router-dom";

export const UsuarioDetails = ({ usuario }) => {
  
  const navigate = useNavigate();
  
  
  
  if (!usuario) {
    return (
      <div className="estudiante-detail no-selection">
        <p>Selecciona un usuario para ver sus detalles.</p>
      </div>
    );
  }

 
  return (
    <div className="estudiante-detail">
      <h3>Detalles del usuario</h3>
      <p>Nombre de Usuario</p> 
      <div className="after-p">{usuario.username}</div>
      <p>NOMBBRE</p>
      <div className="after-p">{usuario.name}</div>
      <p>rol</p> 
      <div className="after-p">{usuario.role}</div>
      <div className="btn-section">
      <Button className="btn-outline" icon="pi pi-pen-to-square"
        onClick={() => navigate(`/usuarios/${usuario.user_id}`)}
      />
      <Button className="btn-outline" icon="pi pi-trash" />
      </div>
    </div>
    
  );
};