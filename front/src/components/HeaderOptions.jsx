/* eslint-disable react/prop-types */
// HeaderOptions.jsx
import { Button } from "primereact/button";
import "./components.css";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useAuth, useEstudiante } from "../context";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export const HeaderOptions = ({ id, studentName }) => {
  const navigate = useNavigate();
  const { deleteEstudiante } = useEstudiante();
  const { role } = useAuth(); // Ejemplo de función para obtener el rol del usuario 
    const toast = useRef(null);

  const downloadPdf = () => {
    const input = document.getElementById("pdfContent");
    if (!input) {
      console.error("No se encontró el contenedor del PDF");
      return;
    }
  
    const options = {
      margin:       0.2, // márgenes en pulgadas
      filename:     `${studentName}.pdf`, // nombre del archivo PDF'``,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
  
    html2pdf().set(options).from(input).save();
  };
  const confirmDelete = () => {
    confirmDialog({
      message: '¿Está seguro que desea eliminar este estudiante?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await deleteEstudiante(id);
        toast.current.show({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'El estudiante se eliminó satisfactoriamente',
          life: 3000,
        });
        navigate("/estudiantes"); // Redirigir a la lista de estudiantes después de eliminar
      },
      reject: () => {
        // Puedes manejar alguna acción al cancelar, si lo deseas
      }
    });
  };

  return (
    <div className="header-options">
      <div className="btn-section-options">
        {role !== "user" && (
          <>
            <Button
              className="btn-outline"
              icon="pi pi-pen-to-square"
              onClick={() => navigate(`/estudiantes/${id}`)}
            />
            <Button className="btn-outline" icon="pi pi-trash" onClick={confirmDelete}/>
          </>
        )}
        <Button
          className="btn-outline"
          icon="pi pi-download"
          onClick={downloadPdf}
        />
      </div>
      <ConfirmDialog />
      <Toast ref={toast} />
    </div>
  );
};
