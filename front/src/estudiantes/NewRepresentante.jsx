/* eslint-disable react/prop-types */
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { useRepresentante } from "../context";
import axios from "../api/config";
import "./estudiantes.css";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { FileUpload } from "primereact/fileupload";
import { tiposCedula, prefijosTelf, tipoEdoCivil, prefijosTrabajo, tipos } from "../helpers/dropdownOptions";

export const NewRepresentante = ({ studentId, onRepresentanteCreated }) => {
  const {createRepresentante} = useRepresentante();
  const { handleSubmit, control, formState: { errors }, watch } = useForm();
  const toast = useRef(null);
  const [foto, setFoto] = useState(null);

  const onUpload = (event) => {
    setFoto(event.files[0]);
    toast.current.show({ severity: 'info', summary: 'Éxito', detail: 'Foto cargada' });
  };

  // Función para vincular el representante con el estudiante en la tabla EstudianteRepresentante.
  const asociarEstudianteRepresentante = async ({ estudiante_id, representante_id }) => {
    const response = await axios.post('/estudiantes/asociar', { 
      estudiante_id, 
      representante_id 
    });
    
    return response.data;
  };
  
  const createRepresentanteSubmit = async (data) => {
    console.log("Datos del formulario:", data);
    
    try {

      if (data.edo_civil && typeof data.edo_civil === 'object') {
        data.edo_civil = data.edo_civil.name;
      }
      if (data.tipo && typeof data.tipo === 'object') {
        data.tipo = data.tipo.name;
      }

      const formData = new FormData();
      
      const cedulaCompleta = `${data.tipoCedula.name}${data.ced}`;
      data.ced = cedulaCompleta;

      const telfCompleto = `${data.prefijoTelf.code}${data.telf}`;
      data.telf = telfCompleto;

      const telfTrabajoCompleto = `${data.prefijoTrabajo.code}${data.telf_trabajo}`;
      data.telf_trabajo = telfTrabajoCompleto;

      if (watch("trabajaOption") === "No") {
        data.trabajo = "";
     }

      Object.keys(data).forEach(key => formData.append(key, data[key]));
      if (foto) {
        formData.append('foto', foto);
      }


      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const createdRepresentante = await createRepresentante(formData);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Representante creado'
      });
      // Vincula automáticamente al estudiante con el representante creado.
      console.log("Enviando payload:", { estudiante_id: studentId, representante_id: createdRepresentante.representante_id });
      await asociarEstudianteRepresentante({
      estudiante_id: studentId,
      representante_id: createdRepresentante.representante_id,
    });

      toast.current.show({
        severity: 'success',
        summary: 'Asociación exitosa',
        detail: 'Representante vinculado al estudiante'
      });
      if (onRepresentanteCreated) {
        onRepresentanteCreated();
      }
    } catch (error) {
      console.log("Error al crear representante:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Revisa los campos.'
      });
    }
  };

  return (
    <div className="card">
      <h2>datos de Padre o Madre</h2>
      <form className="form-alumno" onSubmit={handleSubmit(createRepresentanteSubmit)}>
        <div className="form-columnone">
          <Controller
              name="nombre"
              control={control}
              defaultValue=""
              rules={{ required: "El nombre es requerido." }}
              render={({ field }) => (
                <>
                  <label htmlFor="nombre">Nombres</label>
                  <InputText id="nombre" {...field} placeholder="Nombres " />
                </>
              )}
            />
            {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}
             <div className="group">
              <div className="group-item">
                <Controller
                      name="edo_civil"
                      control={control}
                      defaultValue=""
                      rules={{ required: "es requerido." }}
                      render={({ field }) => (
                        <>
                          <label htmlFor="edo_civil">edo. civil</label>
                          <Dropdown
                            id="edo_civil"
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            options={tipoEdoCivil}
                            optionLabel="name"
                            placeholder="SOLTERO/A"
                            className={errors.edo_civil ? 'p-invalid' : ''}
                          />
                        </>
                      )}
                    />
              </div>
              <div className="group-item">
                <Controller
                      name="edad"
                      control={control}
                      defaultValue=""
                      rules={{ required: "La edad es requerida." }}
                      render={({ field }) => (
                        <>
                          <label htmlFor="edad">Edad</label>
                          <InputText type="number" id="edad" {...field} placeholder="Edad" />
                        </>
                      )}
                    />
             </div>
             </div>
             <label htmlFor="cedula">CEDULA</label>
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
                name="ced"
                control={control}
                defaultValue=""
                rules={{ required: "La cédula escolar es requerida." }}
                render={({ field }) => (
                  <>
                    <InputText placeholder="Ingresa la cedula escolar" className="input-ced" id="ced" {...field} />
                  </>
                )}
              />
              {errors.ced && <small className="p-error">{errors.ced.message}</small>}
            </div>
            <label>¿TRABAJA?</label>
          <div className="group">
            <div className="p-field-radiobutton">
              <Controller
                name="trabajaOption"
                control={control}
                defaultValue="No"
                render={({ field }) => (
                  <>
                    <RadioButton 
                      inputId="trabajaNo" 
                      name="trabajaOption" 
                      value="No" 
                      onChange={(e) => field.onChange(e.value)} 
                      checked={field.value === "No"} />
                    <label htmlFor="trabajaNo" className="ml-2">No</label>
                    <RadioButton 
                      inputId="trabajaSi" 
                      name="trabajaOption" 
                      value="Si" 
                      onChange={(e) => field.onChange(e.value)} 
                      checked={field.value === "Si"} 
                      className="ml-4" />
                    <label htmlFor="trabajaSi" className="ml-2">Sí</label>
                  </>
                )}
              />
            </div>
            <Controller
              name="dire_trabajo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputText 
                  placeholder="Ingrese dirección de trabajo" 
                  id="dire_trabajo" 
                  className="input-radio-button-t"
                  disabled={watch("trabajaOption") === "No"} 
                  {...field} 
                />
              )}
            />
            {errors.dire_trabajo && <small className="p-error">{errors.dire_trabajo.message}</small>}
          </div>
          <Controller
            name="correoElectronico"
            control={control}
            defaultValue=""
            rules={{ required: "La correoElectronico es requerida." }}
            render={({ field }) => (
              <>
                <label htmlFor="correoElectronico">correo Electrónico</label>
                <InputText type="email" id="correoElectronico" {...field} placeholder="Ingrese correo Electronico" />
              </>
            )}
          />
        </div>

        <div className="form-columntwo">
          <Controller
            name="apellido"
            control={control}
            defaultValue=""
            rules={{ required: "El apellido es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="apellido">Apellidos</label>
                <InputText id="apellido" {...field} placeholder="Apellidos" />
              </>
            )}
          />
          {errors.apellido && <small className="p-error">{errors.apellido.message}</small>}
            <Controller
            name="direccion"
            control={control}
            defaultValue=""
            rules={{ required: "La direccion es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="direccion">Direccion</label>
                <InputText id="direccion" {...field} placeholder="Direccion" />
              </>
            )}
          />
          {errors.direccion && <small className="p-error">{errors.direccion.message}</small>}
          <label htmlFor="telefono">Teléfono</label>
            <div className="group">
                <Controller
                  name="prefijoTelf"
                  control={control}
                  defaultValue={prefijosTelf[0]}
                  rules={{ required: "Seleccione un prefijo." }}
                  render={({ field }) => (
                    <>
                      <Dropdown
                        id="prefijoTelf"
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={prefijosTelf}
                        optionLabel="name"
                        placeholder="0414"
                        className={errors.prefijo ? 'p-invalid' : 'dropdown-phone'}
                      />
                    </>
                  )}
                />
                <Controller
                  name="telf"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Ingrese el nro telefónico" }}
                  render={({ field }) => (
                    <>
                      <InputText placeholder="Ingresa Telefono" className="input-ced" id="telf" {...field} />
                    </>
                  )}
                />
                {errors.telf && <small className="p-error">{errors.telf.message}</small>}
          </div>
        <label htmlFor="telf_trabajo">Teléfono del Trabajo</label>
            <div className="group">
                <Controller
                  name="prefijoTrabajo"
                  control={control}
                  defaultValue={prefijosTrabajo[0]}
                  rules={{ required: "Seleccione un prefijo." }}
                  render={({ field }) => (
                    <>
                      <Dropdown
                        id="prefijoTrabajo"
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={prefijosTrabajo}
                        optionLabel="name"
                        placeholder="0286"
                        className={errors.prefijo ? 'p-invalid' : 'dropdown-phone'}
                      />
                    </>
                  )}
                />
                <Controller
                  name="telf_trabajo"
                  control={control}
                  defaultValue=""
                  disabled={watch("trabajaOption") === "No"} 
                  render={({ field }) => (
                    <>
                      <InputText placeholder="Ingresa Telefono" className="input-ced" id="telf_trabajo" {...field} />
                    </>
                  )}
                />
                {errors.telf_trabajo && <small className="p-error">{errors.telf_trabajo.message}</small>}
                </div>
                <Controller
                name="tipo"
                control={control}
                defaultValue=""
                rules={{ required: "es requerido." }}
                render={({ field }) => (
                  <>
                    <label htmlFor="tipo">Tipo</label>
                    <Dropdown
                      id="tipo"
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={tipos}
                      optionLabel="name"
                      placeholder="padres"
                      className={errors.tipo ? 'p-invalid' : ''}
                    />
                  </>
                )}
              />
        {errors.tipo && <small className="p-error">{errors.tipo.message}</small>}
                          
        <label htmlFor="foto">FOTO</label>
          <FileUpload
            mode="basic"
            name="foto"
            accept="image/*"
            maxFileSize={1000000}
            customUpload
            uploadHandler={onUpload}
          />
        

        </div>


        <Toast ref={toast} />
        <button type="submit" className="btn-next">Siguiente</button>
      </form>
    </div>
  );
};


 

      