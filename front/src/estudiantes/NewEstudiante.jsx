/* eslint-disable react/prop-types */
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { addLocale } from "primereact/api";
import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useEstudiante } from "../context";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { tiposCedula, sexos } from "../helpers/dropdownOptions";

export const NewEstudiante = ({ onStudentCreated }) => {
  const { createEstudiante } = useEstudiante();
  const { handleSubmit, control, formState: { errors }, watch } = useForm();

  const toast = useRef(null);
  const [foto, setFoto] = useState(null);


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


      if (data.sexo && typeof data.sexo === 'object') {
        data.sexo = data.sexo.name;
      }
      const formData = new FormData();
      
      const cedulaCompleta = `${data.tipoCedula.name}${data.cedulaEscolar}`;
      data.cedulaEscolar = cedulaCompleta;
      
      if (watch("alergiaOption") === "No") {
        data.alergias = "";
     }
     if (watch("condicionOption") === "No") {
        data.condicion = "";
     }

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
      
      // Si obtenemos el ID del estudiante, llamamos al callback para avanzar.
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
        <h4>Datos Alumnos</h4>
      <form className="form-alumno" onSubmit={handleSubmit(createEstudianteSubmit, onInvalid)}>
        <div className="form-columnone">
          <Controller
            name="nombres"
            control={control}
            defaultValue=""
            rules={{ required: "El nombre es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="nombres">Nombres</label>
                <InputText placeholder="Ingrese nombres" id="nombres" {...field} />
              </>
            )}
          />
          {errors.nombres && <small className="p-error">{errors.nombres.message}</small>}

          <div className="group">
            <div className="group-item">
              <Controller
                name="fechaNacimiento"
                control={control}
                defaultValue={null}
                rules={{ required: "La fecha de nacimiento es requerida." }}
                render={({ field }) => (
                  <>
                    <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                    <Calendar placeholder="00/00/0000" inputId="fechaNacimiento" locale="es" {...field} />
                  </>
                )}
              />
              {errors.fechaNacimiento && <small className="p-error">{errors.fechaNacimiento.message}</small>}
            </div>
            <div className="group-item">
              <Controller
                name="edad"
                control={control}
                defaultValue={null}
                rules={{ required: "La edad es requerida." }}
                render={({ field }) => (
                  <>
                    <label htmlFor="edad">Edad</label>
                    <InputText placeholder="Ingrese edad" keyfilter="int" id="edad" {...field} />
                  </>
                )}
              />
              {errors.edad && <small className="p-error">{errors.edad.message}</small>}
            </div>
          </div>
          <label htmlFor="cedula">Cedula escolar</label>
          <div className="group">
              <Controller
                name="tipoCedula"
                control={control}
                defaultValue={tiposCedula[0]}
                rules={{ required: "El tipo de cédula es requerido." }}
                render={({ field }) => (
                  <>
                    <Dropdown
                      id="tipoCedula"
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={tiposCedula}
                      optionLabel="name"
                      placeholder="V-"
                      className={errors.tipoCedula ? 'p-invalid' : 'dropdown'}
                    />
                  </>
                )}
              />
              {errors.tipoCedula && <small className="p-error">{errors.tipoCedula.message}</small>}
              <Controller
                name="cedulaEscolar"
                control={control}
                defaultValue=""
                rules={{ required: "La cédula escolar es requerida." }}
                render={({ field }) => (
                  <>
                    <InputText placeholder="Ingresa la cedula escolar" className="input-ced" id="cedulaEscolar" {...field} />
                  </>
                )}
              />
              {errors.cedulaEscolar && <small className="p-error">{errors.cedulaEscolar.message}</small>}
          </div>
          <label htmlFor="alergias">Alergias</label>
          <div className="group">
            <div className="p-field-radiobutton">
              <Controller
                name="alergiaOption"
                control={control}
                defaultValue="No"
                render={({ field }) => (
                  <>
                    <RadioButton 
                      inputId="alergiaNo" 
                      name="alergiaOption" 
                      value="No" 
                      onChange={(e) => field.onChange(e.value)} 
                      checked={field.value === "No"} />
                    <label htmlFor="alergiaNo" className="ml-2">No</label>

                    <RadioButton 
                      inputId="alergiaSi" 
                      name="alergiaOption" 
                      value="Si" 
                      onChange={(e) => field.onChange(e.value)} 
                      checked={field.value === "Si"} 
                      className="ml-4" />
                    <label htmlFor="alergiaSi" className="ml-2">Sí</label>
                  </>
                )}
              />
            </div>
            <Controller
              name="alergias"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputText 
                  placeholder="Ingresa alergia" 
                  className="input-radio-button"
                  disabled={watch("alergiaOption") === "No"} 
                  {...field} 
                />
              )}
            />
          </div>
          {errors.alergias && <small className="p-error">{errors.alergias.message}</small>}
        </div>
        {/* Columna dos */}
        <div className="form-columntwo">
          <Controller
            name="apellidos"
            control={control}
            defaultValue=""
            rules={{ required: "El apellido es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="apellidos">Apellidos</label>
                <InputText placeholder="Ingresa Apellidos" id="apellidos" {...field} />
              </>
            )}
          />
          {errors.apellidos && <small className="p-error">{errors.apellidos.message}</small>}
          <Controller
            name="lugarNacimiento"
            control={control}
            defaultValue=""
            rules={{ required: "El lugar de nacimiento es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="lugarNacimiento">Lugar de Nacimiento</label>
                <InputText placeholder="Ingresa lugar de nacimiento" id="lugarNacimiento" {...field} />
              </>
            )}
          />
          {errors.lugarNacimiento && <small className="p-error">{errors.lugarNacimiento.message}</small>}
          <label>Condición especial</label>
          <div className="group">
            <div className="p-field-radiobutton">
              <Controller
                name="condicionOption"
                control={control}
                defaultValue="No"
                render={({ field }) => (
                  <>
                    <RadioButton 
                      inputId="condicionNo" 
                      name="condicionOption" 
                      value="No" 
                      onChange={(e) => field.onChange(e.value)} 
                      checked={field.value === "No"} />
                    <label htmlFor="condicionNo" className="ml-2">No</label>

                    <RadioButton 
                      inputId="condicionSi" 
                      name="condicionOption" 
                      value="Si" 
                      onChange={(e) => field.onChange(e.value)} 
                      checked={field.value === "Si"} 
                      className="ml-4" />
                    <label htmlFor="condicionSi" className="ml-2">Sí</label>
                  </>
                )}
              />
            </div>
            <Controller
              name="condicion"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputText 
                  placeholder="Ingresa condición especial" 
                  id="condicion" 
                  className="input-radio-button"
                  disabled={watch("condicionOption") === "No"} 
                  {...field} 
                />
              )}
            />
          </div>
          {errors.condicion && <small className="p-error">{errors.condicion.message}</small>}
          <div className="group">
              <div className="group-item">
                  <Controller
                    name="sexo"
                    control={control}
                    defaultValue=""
                    rules={{ required: "El sexo es requerido." }}
                    render={({ field }) => (
                      <>
                        <label htmlFor="sexo">Sexo</label>
                        <Dropdown
                          id="sexo"
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          options={sexos}
                          optionLabel="name"
                          placeholder="Seleccione el Sexo"
                          className={errors.sexo ? 'p-invalid' : ''}
                        />
                      </>
                    )}
                  />
              </div>
              <div className="group-item">
                <label htmlFor="foto">FOTO</label>
                <FileUpload
                  mode="basic"
                  name="foto"
                  accept="image/*"
                  maxFileSize={1000000}
                  customUpload
                  auto
                  chooseLabel='Adjuntar Archivo .JPG'
                  uploadHandler={onUpload}
                />
              </div>
          </div>
          <Toast ref={toast} />
          <button type="submit" className="btn-next">SIGUIENTE</button>
        </div>
      </form>
    </div>
  );
};

