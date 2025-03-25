/* eslint-disable react/prop-types */
import { InputText } from "primereact/inputtext";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { useAutorizado } from "../context";
import { Dropdown } from "primereact/dropdown";
import { tiposCedula } from "../helpers/dropdownOptions";
import "./estudiantes.css"

export const NewAutorizado = ({ studentId, onAutorizadoCreated }) => {
  const { createAutorizado } = useAutorizado();
  const { handleSubmit, control, formState: { errors } } = useForm();
  const toast = useRef(null);

  const createAutorizadoSubmit = async (data) => {
    try {
      // Agregamos automáticamente el id del estudiante al objeto que enviamos
      const payload = { ...data, estudiante_id: studentId };
      console.log(payload);

      await createAutorizado(payload);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Autorizado creado y vinculado al estudiante'
      });
      
      if (onAutorizadoCreated) {
        onAutorizadoCreated();
      }
    } catch (error) {
      console.log("Error al crear autorizado:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Verifica los datos.'
      });
    }
  };

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
            rules={{ required: "El teléfono es requerido." }}
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
            <Controller
            name="telf"
            control={control}
            defaultValue=""
            rules={{ required: "El teléfono es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="telf">Telefóno</label>
                <InputText id="telf" {...field} placeholder="Teléfono" />
              </>
            )}
          />
          {errors.telf && <small className="p-error">{errors.telf.message}</small>}
        </div>
 
        <Toast ref={toast} />
        <button className="btn-next">Siguiente</button>
      </form>
    </div>
  );
};
