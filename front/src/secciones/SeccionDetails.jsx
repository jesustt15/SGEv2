/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import "../App.css";
import { useNavigate } from "react-router-dom";

export const SeccionDetails = ({ seccion }) => {
  
  const navigate = useNavigate();
  
  
  
  if (!seccion) {
    return (
      <div className="estudiante-detail no-selection">
        <p>Selecciona una sección para ver sus detalles.</p>
      </div>
    );
  }

 
  return (
    <div className="estudiante-detail">
      <h3>Detalles de la seccion</h3>
      <p>CEDULA</p> 
      <div className="after-p">{seccion.ced}</div>
      <p>NOMBRES</p>
      <div className="after-p">{seccion.nombres}</div>
      <p>APELLIDOS</p> 
      <div className="after-p">{seccion.apellidos}</div>
      <p>CÓDIGO</p> 
      <div className="after-p">{seccion.cod}</div>
      <p>CARGO</p>
      <div className="after-p">{seccion.cargo}</div>
      <p>TELEFONO</p>
      <div className="after-p">{seccion.telf}</div>
      <div className="btn-section">
      <Button className="btn-outline" icon="pi pi-pen-to-square"
        onClick={() => navigate(`/seccions/${seccion.seccion_id}`)}
      />
      <Button className="btn-outline" icon="pi pi-trash" />
      <Button label="Ver Más" className="more" severity="secondary" outlined  
      onClick={() => navigate(`/secciones/${seccion.seccion_id}/more`)} />
      </div>
    </div>
    
  );
};