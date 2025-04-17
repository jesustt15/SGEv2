/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { usePersonal, useEstudiante } from "../context";     // Ejemplo del contexto de docentes
import { getDocenteName, getCantidadAlumnos } from "../helpers";
import { useEffect } from "react";

export const SeccionDetails = ({ seccion }) => {
  const navigate = useNavigate();
  const { personal, getPersonals } = usePersonal();         // Array de docentes
  const { estudiante, getEstudiantes } = useEstudiante();      // Array de estudiantes


  useEffect(() => {
    getPersonals();
    getEstudiantes();
  }, []);

  if (!seccion) {
    return (
      <div className="estudiante-detail no-selection">
        <p>Selecciona una sección para ver sus detalles.</p>
      </div>
    );
  }

  return (
    <div className="estudiante-detail">
      <h3>Detalles de la sección</h3>
      <p>Nombre del nivel</p>
      <div className="after-p">{seccion.nombre}</div>
      <p>Nivel</p>
      <div className="after-p">{seccion.nivel}</div>
      <p>Sección</p>
      <div className="after-p">{seccion.seccion}</div>
      <p>Docente</p>
      <div className="after-p">
        {getDocenteName(seccion.docente_id, personal)}
      </div>
      <p>Cantidad de alumnos</p>
      <div className="after-p">
      {getCantidadAlumnos(seccion.seccion_id, estudiante)}
      </div>
      <div className="btn-section">
        <Button
          className="btn-outline"
          icon="pi pi-pen-to-square"
          onClick={() => navigate(`/secciones/${seccion.seccion_id}`)}
        />
        <Button className="btn-outline" icon="pi pi-trash" />
        <Button
          label="Ver Más"
          className="more"
          severity="secondary"
          outlined
          onClick={() => navigate(`/secciones/${seccion.seccion_id}/more`)}
        />
      </div>
    </div>
  );
};
