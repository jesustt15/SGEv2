/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { usePersonal, useEstudiante, useSeccion, useAuth } from "../context";     // Ejemplo del contexto de docentes
import { getDocenteName, getCantidadAlumnos } from "../helpers";
import { useEffect, useRef } from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

export const SeccionDetails = ({ seccion }) => {
  const navigate = useNavigate();
  const { role } = useAuth(); // Ejemplo de función para obtener el rol del usuario
  const { deleteSeccion } = useSeccion(); // Ejemplo de función para eliminar sección
  const { personals, getPersonals } = usePersonal();         // Array de docentes
  const { estudiante, getEstudiantes } = useEstudiante(); 
  const toast = useRef(null);     // Array de estudiantes


  useEffect(() => {
    getPersonals();
    getEstudiantes();
  }, []);

   const confirmDelete = () => {
          confirmDialog({
            message: '¿Está seguro que desea eliminar esta seccion?',
            header: 'Confirmación de eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Si',
            accept: async () => {
              await deleteSeccion(seccion.seccion_id);
              toast.current.show({
                severity: 'success',
                summary: 'Eliminado',
                detail: 'La sección se eliminó satisfactoriamente',
                life: 3000,
              });
              confirmDialog.close();
              navigate("/secciones"); // Redirigir a la lista de estudiantes después de eliminar
            },
            reject: () => {
             confirmDialog.close();
            }
          });
      };

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
        {getDocenteName(seccion.docente_id, personals)}
      </div>
      <p>Cantidad de alumnos</p>
      <div className="after-p">
      {getCantidadAlumnos(seccion.seccion_id, estudiante)}
      </div>
      <div className="btn-section">
        {role !== 'user' && (
          <>
          <Button
            className="btn-outline"
            icon="pi pi-pen-to-square"
            onClick={() => navigate(`/secciones/${seccion.seccion_id}`)}
          />
          <Button className="btn-outline" icon="pi pi-trash" onClick={confirmDelete} />
          </>  
        )}
        <Button
          label="Ver Más"
          className="more"
          severity="secondary"
          outlined
          onClick={() => navigate(`/secciones/${seccion.seccion_id}/more`)}
        />
      </div>
      <Toast ref={toast} />
    </div>
  );
};
