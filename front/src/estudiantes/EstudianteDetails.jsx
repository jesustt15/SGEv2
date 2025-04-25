/* eslint-disable react/prop-types */
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuth, useEstudiante } from "../context";

export const EstudianteDetails = ({ estudiante }) => {
  const { deleteEstudiante } = useEstudiante();
  const { role } = useAuth(); // Ejemplo de función para obtener el rol del usuario
  const navigate = useNavigate();
  const toast = useRef(null);

  const confirmDelete = () => {
    confirmDialog({
      message: '¿Está seguro que desea eliminar este estudiante?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await deleteEstudiante(estudiante.estudiante_id);
        toast.current.show({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'El estudiante se eliminó satisfactoriamente',
          life: 3000,
        });
      },
      reject: () => {
        // Puedes manejar alguna acción al cancelar, si lo deseas
      }
    });
  };

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
        {role !== "user" && (
          <>
           <Button className="btn-outline" icon="pi pi-pen-to-square"
            onClick={() => navigate(`/estudiantes/${estudiante.estudiante_id}`)}
            />
            <Button className="btn-outline" icon="pi pi-trash" onClick={confirmDelete} />
          </>
        )}
        <Button label="Ver Más" className="more" severity="secondary" outlined  
          onClick={() => navigate(`/estudiantes/${estudiante.estudiante_id}/more`)} />
      </div>
      {/* Incluye el ConfirmDialog y el Toast */}
      <ConfirmDialog />
      <Toast ref={toast} />
    </div>
  );
};

