/* eslint-disable react/prop-types */
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
      <h3>Detalles del Estudiante</h3>
      <p>
        <strong>Cédula Escolar:</strong> {estudiante.cedulaEscolar}
      </p>
      <p>
        <strong>Nombres:</strong> {estudiante.nombres}
      </p>
      <p>
        <strong>Apellidos:</strong> {estudiante.apellidos}
      </p>
      <p>
        <strong>Fecha de Nacimiento:</strong> {estudiante.fechaNacimiento}
      </p>
      <p>
        <strong>Edad:</strong> {estudiante.edad}
      </p>
      <p>
        <strong>Sexo:</strong> {estudiante.sexo}
      </p>
      {/* Agrega aquí más detalles si lo deseas */}
    </div>
  );
};
