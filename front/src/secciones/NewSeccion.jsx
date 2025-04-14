import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { usePersonal, useSeccion, useEstudiante } from "../context";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { parseImageUrl } from "../helpers";

export const NewSeccion = ({ onStudentCreated }) => {
  const { createSeccion } = useSeccion();
  const { getPersonals, personal } = usePersonal();
  const { getEstudiantes, estudiantes } = useEstudiante();
  const { handleSubmit, control, formState: { errors } } = useForm();
  const toast = useRef(null);

  // Obtiene los datos al montar el componente
  useEffect(() => {
    getPersonals();
    getEstudiantes();
  }, [getPersonals, getEstudiantes]);

  // Depuración: Log de los estudiantes cuando se actualiza el estado
  useEffect(() => {
    console.log("estudiantes actualizados:", estudiantes);
  }, [estudiantes]);

  // Filtra docentes según la propiedad "cargo"
  const docentes = personal.filter((perso) => perso.cargo === "Docente");
  console.log("docentes:", docentes);

  // Por el momento, usamos todos los estudiantes sin filtrar
  console.log("lista completa de estudiantes:", estudiantes);

  // Muestra mensaje de carga mientras no lleguen los datos
  if (personal.length === 0) {
    return <div>Cargando datos de personales...</div>;
  }
  if (!estudiantes || estudiantes.length === 0) {
    return <div>Cargando datos de estudiantes...</div>;
  }

  const createSeccionSubmit = async (data) => {
    try {
      // Extrae el docente seleccionado: convierte el objeto a su personal_id
      if (data.docente && typeof data.docente === "object") {
        data.docente_id = data.docente.personal_id;
        delete data.docente;
      }
      
      // Prepara FormData para enviar todos los campos
      const formData = new FormData();
      
      // Si existen estudiantes seleccionados, extrae sus identificadores
      if (data.estudiantes && Array.isArray(data.estudiantes)) {
        const studentIds = data.estudiantes.map(s => s.estudiante_id);
        formData.append("estudiantes", JSON.stringify(studentIds));
      }
      
      // Agrega el resto de los campos al FormData
      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      // Envía la solicitud para crear la sección
      await createSeccion(formData);
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Sección creada"
      });
    } catch (error) {
      console.error("Error al crear la sección:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Revisa los campos marcados."
      });
    }
  };

  return (
    <div className="card">
      <h4>Datos de la Sección</h4>
      <form className="form-alumno" onSubmit={handleSubmit(createSeccionSubmit)}>
        <div className="form-columnone">
          <Controller
            name="seccion"
            control={control}
            defaultValue=""
            rules={{ required: "La Sección es requerida." }}
            render={({ field }) => (
              <>
                <label htmlFor="seccion">Sección</label>
                <input placeholder="Ingrese la sección" id="seccion" {...field} />
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
                <input placeholder="Ingresa el nivel" id="nivel" {...field} />
              </>
            )}
          />
          {errors.nivel && <small className="p-error">{errors.nivel.message}</small>}
        </div>

        <div className="form-columntwo">
          <Controller
            name="nombre"
            control={control}
            defaultValue=""
            rules={{ required: "El nombre del nivel es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="nombre">Nombre del Nivel</label>
                <input placeholder="Ingresa el nombre" id="nombre" {...field} />
              </>
            )}
          />
          {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}

          {/* Dropdown para seleccionar el docente filtrado */}
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
                  itemTemplate={(option) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={parseImageUrl(option.foto)}
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
                />
              </>
            )}
          />
          {errors.docente && <small className="p-error">{errors.docente.message}</small>}

          {/* MultiSelect para agregar estudiantes a la sección */}
          <Controller
            name="estudiantes"
            control={control}
            defaultValue={[]}
            rules={{ required: "Debe seleccionar al menos un estudiante." }}
            render={({ field }) => (
              <>
                <label htmlFor="estudiantes">Estudiantes</label>
                <MultiSelect
                  id="estudiantes"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={estudiantes}  // Muestra todos los estudiantes
                  placeholder="Seleccione estudiantes"
                  display="chip"
                  appendTo={document.body}
                  itemTemplate={(option) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={parseImageUrl(option.foto)}
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
          {errors.estudiantes && <small className="p-error">{errors.estudiantes.message}</small>}

          <Toast ref={toast} />
          <button type="submit" className="btn-next">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};


