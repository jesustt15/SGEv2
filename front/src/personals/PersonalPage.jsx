import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePersonal } from '../context';
import { EstudianteFoto, HeaderEdit, HeaderOptions } from '../components';

export const PersonalPage = () => {
  const { id } = useParams();
  const { personal, setPersonal, getOnePersonal } = usePersonal();

  useEffect(() => {
    const loadPersonal = async () => {
      if (id) {
        const fetchedPersonal = await getOnePersonal(id);
        setPersonal(fetchedPersonal);
      }
    };
    loadPersonal();
  }, [id, getOnePersonal, setPersonal]);

  if (!personal) {
    return <div>Cargando Personal...</div>;
  }

  return (
    <>
      <HeaderOptions id={personal.personal_id}
         studentName={`${personal.apellidos}${personal.nombres}`}
      />
      <h4>DATOS DEL PERSONAL</h4>
      <div className="pdfContent" id='pdfContent'>
        <HeaderEdit />
        <EstudianteFoto estudiante={personal} />
        <div className="page-section">
          <div className="form-columnone">
            <label>Nombres</label>
            <h5>{personal.nombres}</h5>
            <label>cedula</label>
            <h5>{personal.ced}</h5>
            <label>código</label>
            <h5>{personal.cod}</h5>
          </div>
          <div className="form-columntwo">
            <label>Apellidos</label>
            <h5>{personal.apellidos}</h5>
            <label>cargo</label>
            <h5>{personal.cargo}</h5>
            <label>Télefono</label>
            <h5>{personal.telf}</h5>
          </div>
        </div>
      </div>
      
    </>
  );
};