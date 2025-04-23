// HeaderOptions.jsx
import { Button } from "primereact/button";
import "./components.css";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

export const HeaderOptions = ({ id, studentName }) => {
  const navigate = useNavigate();

  const downloadPdf = () => {
    const input = document.getElementById("pdfContent");
    if (!input) {
      console.error("No se encontró el contenedor del PDF");
      return;
    }
  
    const options = {
      margin:       0.5, // márgenes en pulgadas
      filename:     `${studentName}.pdf`, // nombre del archivo PDF'``,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
  
    html2pdf().set(options).from(input).save();
  };

  return (
    <div className="header-options">
      <h4>Datos del alumno</h4>
      <div className="btn-section-options">
        <Button
          className="btn-outline"
          icon="pi pi-pen-to-square"
          onClick={() => navigate(`/estudiantes/${id}`)}
        />
        <Button className="btn-outline" icon="pi pi-trash" />
        <Button
          className="btn-outline"
          icon="pi pi-download"
          onClick={downloadPdf}
        />
      </div>
    </div>
  );
};
