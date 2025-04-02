// HeaderOptions.jsx
import { Button } from "primereact/button";
import "./components.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const HeaderOptions = ({ id }) => {
  const navigate = useNavigate();

  const downloadPdf = () => {
    const input = document.getElementById("pdfContent");
    if (!input) {
      console.error("No se encontró el contenedor del PDF");
      return;
    }
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        
        pdf.save(`${studentName}.pdf`);
      })
      .catch((error) => {
        console.error("Error generando el PDF:", error);
      });
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
