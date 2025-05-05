/* eslint-disable react/prop-types */
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { useAutorizado } from "../context";
import { Dropdown } from "primereact/dropdown";
import { prefijosTelf, tiposCedula } from "../helpers/dropdownOptions";
import "./estudiantes.css"
import { FileUpload } from "primereact/fileupload";

export const NewAutorizado = ({ studentId, onAutorizadoCreated }) => {
  const { createAutorizado } = useAutorizado();
  const { handleSubmit, control, formState: { errors }, setError } = useForm();

  const [foto, setFoto] = useState(null);
  const toast = useRef(null);


  const createAutorizadoSubmit = async (data) => {
    try {
      // Agregamos el ID del estudiante para vincular al autorizado
      data.estudiante_id = studentId;

      if (!data.tipoCedula) {
        data.tipoCedula = { name: "V-" };
      }
      const cedulaCompleta = `${data.tipoCedula.name}${data.ced}`;
      data.ced = cedulaCompleta;

      if (!data.prefijoTelf){
        data.prefijoTelf = { code: "0414" };
      }
      const telfCompleto = `${data.prefijoTelf.code}${data.telf}`;
      data.telf = telfCompleto;

      const formData = new FormData();
      
      // Recorremos cada propiedad de data y la añadimos a formData
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      
      // Si existe la foto del autorizado (asegúrate de gestionar correctamente su estado o valor)
      if (foto) {
        formData.append('foto', foto);
      }
      
      // Llamamos a la función para crear el autorizado, la cual ahora debe esperar un FormData
      const createdAuthorized = await createAutorizado(formData);
      console.log(createdAuthorized);
      
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Autorizado creado y vinculado al estudiante'
      });
      
      if (onAutorizadoCreated) {
        onAutorizadoCreated();
      }
    } catch (error) {
      console.log("Error al crear Autorizado:", error);
      if (Array.isArray(error)) {
        error.forEach(err => {
          if (err.field) {
            setError(err.field, { type: 'manual', message: err.message });
          }
        });
      }
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Revisa los campos marcados.'
      });
    }    
  };
  ;

  return (
    <div className="card">
      <h4>Datos de contacto AUtorizado</h4>
      <form className="form-alumno" onSubmit={handleSubmit(createAutorizadoSubmit)}>
        <div className="form-columnone">
          <Controller
            name="nombre"
            control={control}
            defaultValue=""
            rules={{ required: "El nombre es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="nombre">nombre<span style={{ color: 'red' }}>*</span></label>
                <InputText id="nombre" {...field} placeholder="Nombre del autorizado" />
              </>
            )}
          />
          {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}
           <label htmlFor="cedula">CEDULA<span style={{ color: 'red' }}>*</span></label>
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
                rules={{ required: "La cédula es requerida." }}
                render={({ field }) => (
                  <>
                    <InputText type='number' placeholder="Ingresa la cedula" className="input-ced" id="ced" {...field} />
                  </>
                )}
              />
              {errors.ced && <small className="p-error">{errors.ced.message}</small>}
            </div>
          <Controller
            name="direccion"
            control={control}
            defaultValue=""
            rules={{ required: "La dirección es requerida." }}
            render={({ field }) => (
              <>
              <label htmlFor="direccion">Dirección<span style={{ color: 'red' }}>*</span></label>
                <InputText id="direccion" {...field} placeholder="Dirección" />
              </>
            )}
          />
          {errors.direccion && <small className="p-error">{errors.direccion.message}</small>}
          <Controller
            name="observaciones"
            control={control}
            defaultValue=""
            rules={{ required: "El observaciones es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="observaciones">observaciones<span style={{ color: 'red' }}>*</span></label>
                <InputText placeholder="Ingrese observaciones" id="observaciones" {...field} />
              </>
            )}
            />             
          {errors.observaciones && <small className="p-error">{errors.observaciones.message}</small>}
        </div>
        <div className="form-columntwo">
          <Controller
            name="apellido"
            control={control}
            defaultValue=""
            rules={{ required: "El apellido es requerido." }}
            render={({ field }) => (
              <>
              <label htmlFor="apellido">Apellido<span style={{ color: 'red' }}>*</span></label>
                <InputText id="apellido" {...field} placeholder="Apellido del autorizado" />
              </>
            )}
          />
          {errors.apellido && <small className="p-error">{errors.apellido.message}</small>}
          <Controller
            name="parentesco"
            control={control}
            defaultValue=""
            rules={{ required: "El parentesco es requerido." }}
            render={({ field }) => (
              <>
              <label htmlFor="parentesco">Parentesco<span style={{ color: 'red' }}>*</span></label>
                <InputText id="parentesco" {...field} placeholder="Parentesco del autorizado" />
              </>
            )}
          />
          {errors.parentesco && <small className="p-error">{errors.parentesco.message}</small>}
          <label htmlFor="telefono">Teléfono<span style={{ color: 'red' }}>*</span></label>
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
                  rules={{ required: "Ingrese el nro telefónico" ,
                    pattern: {
                      value: /^\d{7}$/,
                      message: "El número de teléfono debe contener exactamente 7 dígitos."
                    }
                  }}
                  render={({ field }) => (
                    <>
                      <InputText type='number' placeholder="Ingresa Telefono" className="input-ced" id="telf" {...field} />
                    </>
                  )}
                />
                {errors.telf && <small className="p-error">{errors.telf.message}</small>}
              </div>
            <label htmlFor="foto">FOTO</label>
            <FileUpload
                mode="basic"
                name="foto"
                accept="image/*"
                customUpload
                chooseLabel="Adjuntar Archivo (.JPG)"
                maxFileSize={1000000}
                uploadHandler={(e) => {
                  if (e.files && e.files[0]) {
                    const selectedFile = e.files[0];
                    setFoto(selectedFile); // Guardamos el archivo en el estado
                    if (toast?.current) {
                      toast.current.show({
                        severity: 'success',
                        summary: 'Archivo cargado',
                        detail: `El archivo ${selectedFile.name} se ha cargado correctamente.`,
                      });
                    }
                  } else {
                    // Opcionalmente, si no hay archivo, mostramos un aviso
                    if (toast?.current) {
                      toast.current.show({
                        severity: 'warn',
                        summary: 'Sin archivo',
                        detail: 'No se ha seleccionado ningún archivo.',
                      });
                    }
                  }
                }}
              />
        </div>
        <Toast ref={toast} />
        <button className="btn-next">Siguiente</button>
      </form>
    </div>
  );
};
