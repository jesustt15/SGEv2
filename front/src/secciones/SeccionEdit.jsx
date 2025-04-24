import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEstudiante, usePersonal, useSeccion } from '../context';
import { HeaderEdit } from '../components';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { parseImageUrl, parseSeccionData } from '../helpers';
import Icon from "../assets/user-default.jpg";

export const SeccionEdit = ({  toastRef }) => {
  const { id } = useParams();
  const { setSeccion, getOneSeccion,  updateSeccion } = useSeccion();
  const { getEstudiantes, updateSeccionEstudiante, estudiante } = useEstudiante();
  const { personals, getPersonals } = usePersonal();

  // toastRef: usamos el que se pase por prop o el que define internamente
  const internalToastRef = useRef(null);
  const toast = toastRef || internalToastRef;
  
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const [formInitialized, setFormInitialized] = useState(false);

  // Cargamos el listado completo desde los contextos
  useEffect(() => {
    getPersonals();
    getEstudiantes();
  }, [getPersonals, getEstudiantes]);

  const docentes = personals.filter((perso) => perso.cargo === "Docente");

  // Esperamos que además de la sección se tenga el listado de estudiantes (estudiante) cargado
  useEffect(() => {
    const loadSeccion = async () => {
      if (id) {
        const fetchedSeccion = await getOneSeccion(id);
        console.log("Fetched Sección:", fetchedSeccion);
        setSeccion(fetchedSeccion);
        let defaultValues = parseSeccionData(fetchedSeccion, estudiante);
        if (fetchedSeccion.docente_id) {
          console.log("docente_id en seccion:", fetchedSeccion.docente_id);
          const teacherFull = docentes.find(d => d.personal_id === fetchedSeccion.docente_id);
          console.log("Teacher encontrado:", teacherFull);
          if (teacherFull) {
            defaultValues.docente = teacherFull;
          }
        }
        reset(defaultValues);
        setFormInitialized(true);
      }
    };
  
    if (!formInitialized && id && Array.isArray(estudiante) && Array.isArray(docentes)) {
      loadSeccion();
    }
  }, [id, formInitialized, reset, getOneSeccion, estudiante, docentes]);
  
  

  const updateSeccionSubmit = async (data) => {
    try {
      // Conversión del docente: extraemos el personal_id y eliminamos el objeto docente
      if (data.docente && typeof data.docente === "object") {
        data.docente_id = data.docente.personal_id;
        delete data.docente;
      }
  
      // Creamos el FormData para la actualización de la sección
      const formData = new FormData();
      
      // Si tienes estudiantes, los extraes y los agregas como JSON
      let studentIds = [];
      if (data.estudiantes && Array.isArray(data.estudiantes)) {
        studentIds = data.estudiantes.map((s) => s.estudiante_id);
        formData.append("estudiantes", JSON.stringify(studentIds));
      }
  
      // Agrega el resto de las propiedades al formData
      Object.keys(data).forEach((key) => {
        // Evita duplicar el campo 'estudiantes'
        if (key !== "estudiantes") {
          formData.append(key, data[key]);
        }
      });
  
      // Realiza la actualización de la sección.
      const response = await updateSeccion(id, formData);
      console.log("Respuesta completa del updateSeccion:", response.data);
      
      // Usamos el ID devuelto o, si no, el id original
      const newSeccionId = response?.data?.seccion_id || response?.data?.id || id;
      console.log("Sección actualizada, su ID es:", newSeccionId);
      
      if (!newSeccionId) {
        throw new Error("No se obtuvo el ID de la sección");
      }
      
      // Actualiza los estudiantes usando el endpoint de actualización en bloque.
      if (studentIds.length) {
        console.log("Actualizando estudiantes con IDs:", studentIds);
        const estudiantesResponse = await updateSeccionEstudiante(newSeccionId, studentIds);
        console.log("Respuesta de actualización en bloque de estudiantes:", estudiantesResponse);
      }
      
      if (toast.current) {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Sección y estudiantes actualizados correctamente"
        });
      }
    } catch (error) {
      console.error("Error al actualizar la sección o estudiantes:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Revisa los campos o la conexión con la API."
      });
    }
  };
  
  return (
    <>
      <HeaderEdit />
      <Toast ref={(el) => { toast.current = el; }} />
      <form
        onSubmit={handleSubmit(updateSeccionSubmit)}
        className="form-alumno"
        encType="multipart/form-data"
      >
        <div className="form-columnone">
          <Controller
            name="nombre"
            control={control}
            defaultValue=""
            rules={{ required: "El nombre es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="nombre">Nombre</label>
                <InputText placeholder="Ingrese nombres" id="nombre" {...field} />
              </>
            )}
          />
          {errors.nombre && <span>El nombre es requerido.</span>}
          <Controller
            name="seccion"
            control={control}
            defaultValue=""
            rules={{ required: "La sección es requerida." }}
            render={({ field }) => (
              <>
                <label htmlFor="seccion">Sección</label>
                <InputText placeholder="Ingresa la sección" id="seccion" {...field} />
              </>
            )}
          />
          {errors.seccion && <small className="p-error">{errors.seccion.message}</small>}
          <Controller
            name="nivel"
            control={control}
            defaultValue=""
            rules={{ required: "El nivel es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="nivel">Nivel</label>
                <InputText placeholder="Ingresa el nivel" id="nivel" {...field} />
              </>
            )}
          />
          {errors.nivel && <small className="p-error">{errors.nivel.message}</small>}
        </div>
        <div className="form-columntwo">
        <Controller
          name="docente"
          control={control}
          defaultValue=""
          rules={{ required: "El docente es requerido." }}
          render={({ field }) => (
          <>
            <label htmlFor="docente">Docente</label>
            <Dropdown
              id="docente"
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              options={docentes}
              placeholder="Seleccione el docente"
              filter
              appendTo={document.body}
              className={errors.docente ? "p-invalid" : ""}
              // Indica cómo se mostrará cada opción en el panel desplegable:
              itemTemplate={(option) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={option.foto ? parseImageUrl(option.foto) : Icon}
                    alt="Foto del docente"
                    style={{
                      width: '30px',
                      height: '30px',
                      marginRight: '8px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <span>{option.nombres} {option.apellidos}</span>
                </div>
              )}
              // Define cómo se muestra el valor seleccionado cuando el Dropdown está cerrado.
              valueTemplate={(option) => {
                if (option) {
                  return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={ option.foto ? parseImageUrl(option.foto) : Icon}
                        alt="Foto del docente"
                        style={{
                          width: '30px',
                          height: '30px',
                          marginRight: '8px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <span>{option.nombres} {option.apellidos}</span>
                    </div>
                  );
                }
                return <span>Seleccione el docente</span>;
              }}
            />
          </>
        )}
      />
          <Controller
            name="estudiantes"
            control={control}
            defaultValue={[]}  // Aquí se cargará la selección de estudiantes (los que tienen ese seccion_id)
            rules={{ required: "Debe seleccionar al menos un estudiante." }}
            render={({ field }) => (
              <>
                <label htmlFor="estudiantes">Estudiantes</label>
                <MultiSelect
                  id="estudiantes"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  // Las opciones mostrarán TODOS los estudiantes (recuerda que "estudiante" es tu listado completo)
                  options={estudiante}
                  placeholder="Seleccione estudiantes"
                  display="chip"
                  optionLabel="nombres"
                  itemTemplate={(option) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={option.foto ? parseImageUrl(option.foto) : Icon}
                        alt="Foto del estudiante"
                        style={{
                          width: '30px',
                          height: '30px',
                          marginRight: '8px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <span>{option.nombres} {option.apellidos}</span>
                    </div>
                  )}
                />
              </>
            )}
          />
          <button className="btn-next" type="submit">Guardar Cambios</button>
        </div>
      </form>
    </>
  );
};
