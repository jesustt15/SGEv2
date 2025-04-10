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
  const { handleSubmit, control, formState: { errors } } = useForm();

  const [foto, setFoto] = useState(null);
  const toast = useRef(null);



  const onUpload = (event) => {
    setFoto(event.files[0]);
    toast.current.show({ severity: 'info', summary: 'Éxito', detail: 'Foto cargada' });
  };

  const createAutorizadoSubmit = async (data) => {
    try {
      // Agregamos el ID del estudiante para vincular al autorizado
      data.estudiante_id = studentId;


      const cedulaCompleta = `${data.tipoCedula.name}${data.ced}`;
      data.ced = cedulaCompleta;

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
      console.error("Error al crear autorizado:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Verifica los datos.'
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
                <label htmlFor="nombre">nombre</label>
                <InputText id="nombre" {...field} placeholder="Nombre del autorizado" />
              </>
            )}
          />
          {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}
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
                rules={{ required: "La cédula es requerida." }}
                render={({ field }) => (
                  <>
                    <InputText placeholder="Ingresa la cedula" className="input-ced" id="ced" {...field} />
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
              <label htmlFor="direccion">Dirección</label>
                <InputText id="direccion" {...field} placeholder="Dirección" />
              </>
            )}
          />
          {errors.direccion && <small className="p-error">{errors.direccion.message}</small>}
          <Controller
            name="observaciones"
            control={control}
            defaultValue=""
            rules={{ required: "Coloque unas observaciones." }}
            render={({ field }) => (
              <>
                <label htmlFor="observaciones">Observaciones</label>
                <InputText id="observaciones" {...field} placeholder="Observaciones" />
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
              <label htmlFor="apellido">Apellido</label>
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
              <label htmlFor="parentesco">Parentesco</label>
                <InputText id="parentesco" {...field} placeholder="parentesco del autorizado" />
              </>
            )}
          />
          {errors.parentesco && <small className="p-error">{errors.parentesco.message}</small>}
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
        <button className="btn-next">Siguiente</button>
      </form>
    </div>
  );
};
