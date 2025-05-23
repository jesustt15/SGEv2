/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useAuth, usePersonal } from "../context";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export const PersonalDetails = ({ personal }) => {
  const navigate = useNavigate();
  const { deletePersonal } = usePersonal();
  const { role } = useAuth(); // Obtención del rol del usuario
  const toast = useRef(null);

  const confirmDelete = () => {
    confirmDialog({
      message: '¿Está seguro que desea eliminar este personal?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',    // Texto personalizado para "Aceptar"
      rejectLabel: 'No',    // Texto personalizado para "Rechazar"
      accept: async () => {
        await deletePersonal(personal.personal_id);
        toast.current.show({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'El Personal se eliminó satisfactoriamente',
          life: 3000,
        });

      },
      reject: () => {
      }
    });
  };

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
        {role !== "user" && (
          <>
            <Button 
              className="btn-outline" 
              icon="pi pi-pen-to-square"
              onClick={() => navigate(`/personals/${personal.personal_id}`)}
            />
            <Button 
              className="btn-outline" 
              icon="pi pi-trash" 
              onClick={confirmDelete}
            />
          </>
        )}
        <Button 
          label="Ver Más" 
          className="more" 
          severity="secondary" 
          outlined  
          onClick={() => navigate(`/personals/${personal.personal_id}/more`)}
        />
      </div>
      <Toast ref={toast} />
    </div>
  );
};
