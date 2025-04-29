import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEstudiante } from '../context';
import { EstudianteFoto, HeaderEdit, HeaderOptions } from '../components';

export const EstudiantePage = () => {
  const { id } = useParams();
  const { estudiante, setEstudiante, getOneEstudiante } = useEstudiante();

  useEffect(() => {
    const loadEstudiante = async () => {
      if (id) {
        const fetchedEstudiante = await getOneEstudiante(id);
        setEstudiante(fetchedEstudiante);
      }
    };
    loadEstudiante();
  }, [id, getOneEstudiante, setEstudiante]);

  if (!estudiante) {
    return <div>Cargando estudiante...</div>;
  }

  const representantePadre = estudiante.representantes?.find(rep => rep.tipo === 'Padre');
  const representanteMadre = estudiante.representantes?.find(rep => rep.tipo === 'Madre');
  const autorizado = estudiante.autorizados?.[0];

  return (
    <>
      <HeaderOptions id={estudiante.estudiante_id}
         studentName={`${estudiante.apellidos}${estudiante.nombres}`}
      />
      <div id="pdfContent" className="pdfContent">
        <HeaderEdit />
        <hr />
        <EstudianteFoto estudiante={estudiante} />
        <div className="page-section">
          <div className="form-columnone">
            <label>Nombres</label>
            <h5>{estudiante.nombres}</h5>
            <label>Cedula Escolar</label>
            <h5>{estudiante.cedulaEscolar}</h5>
            <div className="group-label">
              <div className="group-item">
                <label>Fecha de Nacimiento</label>
              </div>
              <div className="group-item">
                <label>Edad</label>
              </div>
            </div>
            <div className='group'>
              <div className="group-item">
                <h5>{estudiante.fechaNacimiento}</h5>
              </div>
              <div className="group-item">
                <h5>{estudiante.edad}</h5>
              </div>
            </div>
            <label>Sexo</label>
            <h5>{estudiante.sexo}</h5>
          </div>
          <div className="form-columntwo">
            <label>Apellidos</label>
            <h5>{estudiante.apellidos}</h5>
            <label>Lugar de Nacimiento</label>
            <h5>{estudiante.lugarNacimiento}</h5>
            <label>Condición Especial</label>
            <h5>{estudiante.condicion}</h5>
          </div>
        </div>
        <hr />
            {representantePadre ? (
              <>
                <h4 className="parent-type">Representantes</h4>
                <EstudianteFoto estudiante={representantePadre} />
                <div className="page-section-large">
                  <div className="form-columnone">
                    <label>Nombres</label>
                    <h5>{representantePadre.nombre}</h5>
                    <div className="group-label">
                      <div className="group-item">
                        <label>Edo. Civil</label>
                      </div>
                      <div className="group-item">
                        <label>Edad</label>
                      </div>
                    </div>
                    <div className="group">
                      <div className="group-item">
                        <h5>{representantePadre.edo_civil}/A</h5>
                      </div>
                      <div className="group-item">
                        <h5>{representantePadre.edad}</h5>
                      </div>
                    </div>
                    <label>Cédula</label>
                    <h5>{representantePadre.ced}</h5>
                    <label>¿trabaja?</label>
                    <h5>{representantePadre.dire_trabajo}</h5>
                    <label>correo electrónico</label>
                    <h5>{representantePadre.correoElectronico}</h5>
                  </div>
                  <div className="form-columntwo">
                    <label>Apellidos</label>
                    <h5>{representantePadre.apellido}</h5>
                    <label>dirección</label>
                    <h5>{representantePadre.direccion}</h5>
                    <label>Teléfono</label>
                    <h5>{representantePadre.telf}</h5>
                    <label>Telefono del trabajo</label>
                    <h5>{representantePadre.telf_trabajo}</h5>
                  </div>
                </div>
            </>
            ) : (
              <br />
            )}
            {representanteMadre ? (
              <>
                <h4 className="parent-type">Representantes</h4>
                <EstudianteFoto estudiante={representanteMadre} />
                <div className="page-section-large">
                  <div className="form-columnone">
                    <label>Nombres</label>
                    <h5>{representanteMadre.nombre}</h5>
                    <div className="group-label">
                      <div className="group-item">
                        <label>Edo. Civil</label>
                      </div>
                      <div className="group-item">
                        <label>Edad</label>
                      </div>
                    </div>
                    <div className="group">
                      <div className="group-item">
                        <h5>{representanteMadre.edo_civil}/A</h5>
                      </div>
                      <div className="group-item">
                        <h5>{representanteMadre.edad}</h5>
                      </div>
                    </div>
                    <label>Cédula</label>
                    <h5>{representanteMadre.ced}</h5>
                    <label>¿trabaja?</label>
                    <h5>{representanteMadre.dire_trabajo}</h5>
                    <label>correo electrónico</label>
                    <h5>{representanteMadre.correoElectronico}</h5>
                  </div>
                  <div className="form-columntwo">
                    <label>Apellidos</label>
                    <h5>{representanteMadre.apellido}</h5>
                    <label>dirección</label>
                    <h5>{representanteMadre.direccion}</h5>
                    <label>Teléfono</label>
                    <h5>{representanteMadre.telf}</h5>
                    <label>Telefono del trabajo</label>
                    <h5>{representanteMadre.telf_trabajo}</h5>
                  </div>
                </div>
              </>

            ) : (
              <br />
            )}
            <hr />
            {autorizado ? (
            <>
              <h4 className="parent-type">AUTORIZADO</h4>
              <EstudianteFoto estudiante={autorizado} />
              <div className='page-section'>
                <div className="form-columnone">
                  <label>Nombres</label>
                  <h5>{autorizado.nombre}</h5>
                  <label>cédula</label>
                  <h5>{autorizado.ced}</h5>
                  <label>dirección</label>
                  <h5>{autorizado.direccion}</h5>
                  <label>observación</label>
                  <h5>{autorizado.observaciones}</h5>
                </div>
                <div className="form-columntwo">
                  <label>Apellidos</label>
                  <h5>{autorizado.apellido}</h5>
                  <label>Parentesco</label>
                  <h5>{autorizado.parentesco}</h5>
                  <label>Teléfono</label>
                  <h5>{autorizado.telf}</h5>
                </div>
              </div>
            </>
          ) : (
            <p>No hay autorizado registrado para este estudiante.</p>
          )}
      </div>
      
    </>
  );
};
