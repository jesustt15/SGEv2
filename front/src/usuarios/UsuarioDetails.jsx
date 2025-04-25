/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useAuth, useUsuario } from "../context";
import { useRef } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

export const UsuarioDetails = ({ usuario }) => {
  
  const navigate = useNavigate();
  const  {deleteUsuario} = useUsuario();
  const {role} = useAuth() // Ejemplo de función para eliminar usuario
  const toast = useRef(null);     // Array de estudiantes
  
  
  
  if (!usuario) {
    return (
      <div className="estudiante-detail no-selection">
        <p>Selecciona un usuario para ver sus detalles.</p>
      </div>
    );
  }
const confirmDelete = () => {
          confirmDialog({
            message: '¿Está seguro que desea eliminar este usuario?',
            header: 'Confirmación de eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
              await deleteUsuario(usuario.user_id);
              toast.current.show({
                severity: 'success',
                summary: 'Eliminado',
                detail: 'La sección se eliminó satisfactoriamente',
                life: 3000,
              });
              navigate("/usuarios"); 
            },
            reject: () => {
            }
          });
  };

 
  return (
    <div className="estudiante-detail">
      <h3>Detalles del usuario</h3>
      <p>Nombre de Usuario</p> 
      <div className="after-p">{usuario.username}</div>
      <p>NOMBBRE</p>
      <div className="after-p">{usuario.name}</div>
      <p>rol</p> 
      <div className="after-p">{usuario.role}</div>
      {role !== "user" && (
        <div className="btn-section">
          <Button
            className="btn-outline"
            icon="pi pi-pen-to-square"
            onClick={() => navigate(`/usuarios/${usuario.user_id}`)}
          />
          <Button
            className="btn-outline"
            icon="pi pi-trash"
            onClick={confirmDelete}
          />
        </div>
      )}
      <ConfirmDialog />
      <Toast  ref={toast} position="top-right" baseZIndex={1000} />
    </div>
    
  );
};