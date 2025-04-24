/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import "../App.css";
import { useNavigate } from "react-router-dom";

export const EstudianteDetails = ({ estudiante }) => {
  
  const navigate = useNavigate();
  
  
  
  if (!estudiante) {
    return (
      <div className="estudiante-detail no-selection">
        <p>Selecciona un estudiante para ver sus detalles.</p>
      </div>
    );
  }

 
  return (
    <div className="estudiante-detail">
      <h3>Detalles del Alumno</h3>
      <p>CEDULA ESCOLAR</p> 
      <div className="after-p">{estudiante.cedulaEscolar}</div>
      <p>NOMBRES</p>
      <div className="after-p">{estudiante.nombres}</div>
      <p>APELLIDOS</p> 
      <div className="after-p">{estudiante.apellidos}</div>
      <p>FECHA DE NACIMIENTO</p>
      <div className="after-p">{estudiante.fechaNacimiento}</div>
      <p>EDAD</p>
      <div className="after-p">{estudiante.edad}</div>
      <p>SEXO</p>
      <div className="after-p">{estudiante.sexo}</div>
      <p>LUGAR DE NACIMIENTO</p>
      <div className="after-p">{estudiante.lugarNacimiento}</div>
      <div className="btn-section">
      <Button className="btn-outline" icon="pi pi-pen-to-square"
        onClick={() => navigate(`/estudiantes/${estudiante.estudiante_id}`)}
      />
      <Button className="btn-outline" icon="pi pi-trash" />
      <Button label="Ver Más" className="more" severity="secondary" outlined  
      onClick={() => navigate(`/estudiantes/${estudiante.estudiante_id}/more`)} />
      </div>
    </div>
    
  );
};
