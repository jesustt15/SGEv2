/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { usePersonal, useSeccion, useEstudiante } from "../context";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { parseImageUrl } from "../helpers";

export const NewSeccion = ( {onStudentCreated}) => {
  const { createSeccion } = useSeccion();
  const { getPersonals, personal } = usePersonal();
  const { getEstudiantes, estudiante, updateSeccionEstudiante } = useEstudiante();
  const { handleSubmit, control, formState: { errors } } = useForm();
  const toast = useRef(null);

  // Obtiene los datos al montar el componente
  useEffect(() => {
    getPersonals();
    getEstudiantes();
  }, [getPersonals, getEstudiantes]);


  // Filtra docentes según la propiedad "cargo"
  const docentes = personal.filter((perso) => perso.cargo === "Docente");

  // Muestra mensaje de carga mientras no lleguen los datos
  if (personal.length === 0) {
    return <div>Cargando datos de personales...</div>;
  }
  if (!estudiante || estudiante.length === 0) {
    return <div>Cargando datos de estudiantes...</div>;
  }

  const createSeccionSubmit = async (data) => {
    try {
      if (data.docente && typeof data.docente === "object") {
        data.docente_id = data.docente.personal_id;
        delete data.docente;
      }
  
      const formData = new FormData();
  
      if (data.estudiantes && Array.isArray(data.estudiantes)) {
        const studentIds = data.estudiantes.map((s) => s.estudiante_id);
        formData.append("estudiantes", JSON.stringify(studentIds));
      }
  
      Object.keys(data).forEach((key) => formData.append(key, data[key]));
  
      // Llamada al servicio correctamente implementado
      const response = await createSeccion(formData);
      console.log("Respuesta de createSeccion:", response);
      const newSeccionId = response?.data?.seccion_id || response?.data?.id;
      console.log("Sección creada, su ID es:", newSeccionId);
  
      if (!newSeccionId) {
        throw new Error("No se obtuvo el ID de la sección");
      }
  
      if (data.estudiantes && Array.isArray(data.estudiantes)) {
        const studentIds = data.estudiantes.map((s) => s.estudiante_id);
        console.log("Actualizando estudiantes con IDs:", studentIds);
  
        await Promise.all(
          studentIds.map(async (id) => {
            console.log(`Actualizando estudiante ${id} con seccion_id: ${newSeccionId}`);
            await updateSeccionEstudiante({ estudiante_id: id, seccion_id: newSeccionId });
          })
        );
  
        console.log("Todos los estudiantes actualizados correctamente");
      }
  
      if (toast.current) {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Sección creada y estudiantes actualizados"
        });
      }
    } catch (error) {
      console.error("Error al crear la sección o actualizar estudiantes:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Revisa los campos marcados o la conexión con la API."
      });
    }
  };
  
  
  

  return (
    <div className="card">
      <h4>Datos de la Sección</h4>
      <form className="form-alumno" onSubmit={handleSubmit(createSeccionSubmit)}>
        <div className="form-columnone">
          <div className="group">
            <div className="group-item">
              <Controller
                name="seccion"
                control={control}
                defaultValue=""
                rules={{ required: "La Sección es requerida." }}
                render={({ field }) => (
                  <>
                    <label htmlFor="seccion">Sección</label>
                    <InputText placeholder="Ingrese la sección" id="seccion" {...field} />
                  </>
                )}
              />
              {errors.seccion && <small className="p-error">{errors.seccion.message}</small>}
            </div>
            <div className="group-item">
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
          </div>
          <Controller
            name="estudiantes"
            control={control}
            defaultValue={[]}
            rules={{ required: "Debe seleccionar al menos un estudiante." }}
            render={({ field }) => (
              <>
                <label htmlFor="estudiantes">Añadir Alumnos</label>
                <MultiSelect
                  id="estudiantes"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={estudiante}  // Asegúrate de que 'estudiante' (o 'estudiantes') contenga el array de objetos.
                  placeholder="Seleccione estudiantes"
                  display="chip"
                  optionLabel="nombres"  // O, si prefieres mostrar el nombre completo, puedes crear y usar una propiedad "fullName"
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
                <InputText placeholder="Ingresa el nombre" id="nombre" {...field} />
              </>
            )}
          />
          {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}

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

         
          <Toast ref={toast} />
          <button type="submit" className="btn-next">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};


