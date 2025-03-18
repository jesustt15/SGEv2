// NewEstudiante.jsx
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { addLocale } from "primereact/api";
import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useEstudiante } from "../context";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

export const NewEstudiante = ({ onStudentCreated }) => {
  const { createEstudiante } = useEstudiante();
  const { handleSubmit, control, formState: { errors }, setError } = useForm();

  const toast = useRef(null);
  const [foto, setFoto] = useState(null);

  const sexos = [
    { name: 'Femenino', code: 'Fem' },
    { name: 'Masculino', code: 'Msc' },
  ];

  const onUpload = (event) => {
    setFoto(event.files[0]);
    toast.current.show({ severity: 'info', summary: 'Éxito', detail: 'Foto cargada' });
  };

  const onInvalid = (errors) => {
    console.log("Errores de validación:", errors);
  };

  addLocale('es', {
    firstDayOfWeek: 1,
    showMonthAfterYear: true,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
  });

  const createEstudianteSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      if (foto) {
        formData.append('foto', foto);
      }
      // Llamamos a la función del contexto para crear el estudiante
      const createdStudent = await createEstudiante(formData);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Estudiante creado'
      });
      
      // Si obtenemos el ID del estudiante, llamamos al callback para avanzar
      if (onStudentCreated && createdStudent && createdStudent.estudiante_id) {
        onStudentCreated(createdStudent.estudiante_id);
      } else {
        console.error("Error: No se recibió el ID del estudiante creado.");
      }
    } catch (error) {
      console.log("Error al crear estudiante:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Revisa los campos marcados.'
      });
    }
  };
  

  return (
    <div className="card">
      <div className="card-titles">
        <span>Añadir Alumno</span>
        <span>Datos Alumnos</span>
      </div>
      <form onSubmit={handleSubmit(createEstudianteSubmit, onInvalid)}>
        <Controller
          name="nombres"
          control={control}
          defaultValue=""
          rules={{ required: "El nombre es requerido." }}
          render={({ field }) => (
            <FloatLabel>
              <InputText id="nombres" {...field} />
              <label htmlFor="nombres">Nombres</label>
            </FloatLabel>
          )}
        />
        {errors.nombres && <small className="p-error">{errors.nombres.message}</small>}
        <br />
        <Controller
          name="apellidos"
          control={control}
          defaultValue=""
          rules={{ required: "El apellido es requerido." }}
          render={({ field }) => (
            <FloatLabel>
              <InputText id="apellidos" {...field} />
              <label htmlFor="apellidos">Apellidos</label>
            </FloatLabel>
          )}
        />
        {errors.apellidos && <small className="p-error">{errors.apellidos.message}</small>}
        <br />
        <Controller
          name="lugarNacimiento"
          control={control}
          defaultValue=""
          rules={{ required: "El lugar de nacimiento es requerido." }}
          render={({ field }) => (
            <FloatLabel>
              <InputText id="lugarNacimiento" {...field} />
              <label htmlFor="lugarNacimiento">Lugar de Nacimiento</label>
            </FloatLabel>
          )}
        />
        {errors.lugarNacimiento && <small className="p-error">{errors.lugarNacimiento.message}</small>}
        <br />
        <Controller
          name="fechaNacimiento"
          control={control}
          defaultValue={null}
          rules={{ required: "La fecha de nacimiento es requerida." }}
          render={({ field }) => (
            <FloatLabel>
              <Calendar inputId="fechaNacimiento" locale="es" {...field} />
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            </FloatLabel>
          )}
        />
        {errors.fechaNacimiento && <small className="p-error">{errors.fechaNacimiento.message}</small>}
        <br />
        <Controller
          name="edad"
          control={control}
          defaultValue={null}
          rules={{ required: "La edad es requerida." }}
          render={({ field }) => (
            <FloatLabel>
              <InputText keyfilter="int" id="edad" {...field} />
              <label htmlFor="edad">Edad</label>
            </FloatLabel>
          )}
        />
        {errors.edad && <small className="p-error">{errors.edad.message}</small>}
        <br />
        <Controller
          name="sexo"
          control={control}
          defaultValue=""
          rules={{ required: "El sexo es requerido." }}
          render={({ field }) => (
            <Dropdown
              id="sexo"
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              options={sexos}
              optionLabel="name"
              placeholder="Seleccione el Sexo"
              className={errors.sexo ? 'p-invalid' : ''}
            />
          )}
        />
        <br />
        <Controller
          name="direccionCompleta"
          control={control}
          defaultValue=""
          rules={{ required: "La dirección es requerida." }}
          render={({ field }) => (
            <FloatLabel>
              <InputTextarea id="direccionCompleta" {...field} />
              <label htmlFor="direccionCompleta">Ingrese la dirección</label>
            </FloatLabel>
          )}
        />
        {errors.direccionCompleta && <small className="p-error">{errors.direccionCompleta.message}</small>}
        <br />
        <Controller
          name="cedulaEscolar"
          control={control}
          defaultValue=""
          rules={{ required: "La cédula escolar es requerida." }}
          render={({ field }) => (
            <FloatLabel>
              <InputText id="cedulaEscolar" {...field} />
              <label htmlFor="cedulaEscolar">Cédula Escolar</label>
            </FloatLabel>
          )}
        />
        {errors.cedulaEscolar && <small className="p-error">{errors.cedulaEscolar.message}</small>}
        <br />
        <Controller
          name="telefonoResidencial"
          control={control}
          defaultValue=""
          rules={{ required: "El teléfono residencial es requerido." }}
          render={({ field }) => (
            <FloatLabel>
              <InputText keyfilter="int" id="telefonoResidencial" {...field} />
              <label htmlFor="telefonoResidencial">Teléfono Residencial</label>
            </FloatLabel>
          )}
        />
        {errors.telefonoResidencial && <small className="p-error">{errors.telefonoResidencial.message}</small>}
        <Toast ref={toast} />
        <FileUpload
          mode="basic"
          name="foto"
          accept="image/*"
          maxFileSize={1000000}
          customUpload
          uploadHandler={onUpload}
        />
        <br />
        <Button label="Añadir" type="submit" />
      </form>
    </div>
  );
};
