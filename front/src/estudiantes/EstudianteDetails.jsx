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
        <strong>Cédula Escolar</strong> {estudiante.cedulaEscolar}
      </p>
      <p>
        <strong>NOMBRES</strong> {estudiante.nombres}
      </p>
      <p>
        <strong>APELLIDOS</strong> {estudiante.apellidos}
      </p>
      <p>
        <strong>FECHA DE NACIMIENTO</strong> {estudiante.fechaNacimiento}
      </p>
      <p>
        <strong>EDAD</strong> {estudiante.edad}
      </p>
      <p>
        <strong>SEXO</strong> {estudiante.sexo}
      </p>
      <p>
        <strong>LUGAR DE NACIMIENTO</strong> {estudiante.lugarNacimiento}
      </p>
      <p>
        <strong>DIRECCIÓN COMPLETA</strong> {estudiante.direccionCompleta}
      </p>
      <p>
        <strong>TELEFONO</strong> {estudiante.telf}
      </p>
      <p>
        <strong>CORREO ELECTRÓNICO</strong> {estudiante.sexo}
      </p>
    </div>
  );
};
