/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import "../App.css";

export const EstudianteDetails = ({ estudiante }) => {
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
      <p>
        CEDULA ESCOLAR 
        <div>{estudiante.cedulaEscolar}</div>
      </p>
      <p>
        NOMBRES
        <div>{estudiante.nombres}</div>
      </p>
      <p>
        APELLIDOS 
        <div>{estudiante.apellidos}</div>
      </p>
      <p>
        FECHA DE NACIMIENTO
        <div>{estudiante.fechaNacimiento}</div>
      </p>
      <p>
        EDAD
        <div>{estudiante.edad}</div>
      </p>
      <p>
        SEXO
        <div>{estudiante.sexo}</div>
      </p>
      <p>
        LUGAR DE NACIMIENTO
        <div>{estudiante.lugarNacimiento}</div>
      </p>
      <p>
        TELEFONO
        <div>{estudiante.telf}</div>
      </p>
      <p>
        CORREO ELECTRÓNICO
        <div>{estudiante.sexo}</div>
      </p>
      <div className="btn-section">
      <Button className="btn-outline" icon="pi pi-pen-to-square" />
      <Button className="btn-outline" icon="pi pi-trash" />
      <Button label="Ver Más" className="more" severity="secondary" outlined />
      </div>
    </div>
    
  );
};
