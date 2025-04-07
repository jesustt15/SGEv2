/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import "../App.css";
import { useNavigate } from "react-router-dom";

export const PersonalDetails = ({ personal }) => {
  
  const navigate = useNavigate();
  
  
  
  if (!personal) {
    return (
      <div className="estudiante-detail no-selection">
        <p>Selecciona un estudiante para ver sus detalles.</p>
      </div>
    );
  }

 
  return (
    <div className="estudiante-detail">
      <h3>Detalles del Personal</h3>
      <p>CEDULA</p> 
      <div className="after-p">{personal.ced}</div>
      <p>NOMBRES</p>
      <div className="after-p">{personal.nombres}</div>
      <p>APELLIDOS</p> 
      <div className="after-p">{personal.apellidos}</div>
      <p>CÓDIGO</p> 
      <div className="after-p">{personal.cod}</div>
      <p>CARGO</p>
      <div className="after-p">{personal.cargo}</div>
      <p>TELEFONO</p>
      <div className="after-p">{personal.telf}</div>
      <div className="btn-section">
      <Button className="btn-outline" icon="pi pi-pen-to-square"
        onClick={() => navigate(`/personals/${personal.personal_id}`)}
      />
      <Button className="btn-outline" icon="pi pi-trash" />
      <Button label="Ver Más" className="more" severity="secondary" outlined  
      onClick={() => navigate(`/personals/${personal.personal_id}/more`)} />
      </div>
    </div>
    
  );
};