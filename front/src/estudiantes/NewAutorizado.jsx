// NewAutorizado.jsx
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { useAutorizado } from "../context";

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
      <h2>Añadir Autorizado</h2>
      <form onSubmit={handleSubmit(createAutorizadoSubmit)}>
        <Controller
          name="nombre"
          control={control}
          defaultValue=""
          rules={{ required: "El nombre es requerido." }}
          render={({ field }) => (
            <div>
              <InputText id="nombre" {...field} placeholder="Nombre del autorizado" />
            </div>
          )}
        />
        {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}
        <br />
        <Controller
          name="apellido"
          control={control}
          defaultValue=""
          rules={{ required: "El apellido es requerido." }}
          render={({ field }) => (
            <div>
              <InputText id="apellido" {...field} placeholder="Apellido del autorizado" />
            </div>
          )}
        />
        {errors.apellido && <small className="p-error">{errors.apellido.message}</small>}
        <br />
        <Controller
          name="ced"
          control={control}
          defaultValue=""
          rules={{ required: "La cédula es requerida." }}
          render={({ field }) => (
            <div>
              <InputText id="ced" {...field} placeholder="Cédula" />
            </div>
          )}
        />
        {errors.ced && <small className="p-error">{errors.ced.message}</small>}
        <br />
        <Controller
          name="direccion"
          control={control}
          defaultValue=""
          rules={{ required: "La dirección es requerida." }}
          render={({ field }) => (
            <div>
              <InputText id="direccion" {...field} placeholder="Dirección" />
            </div>
          )}
        />
        {errors.direccion && <small className="p-error">{errors.direccion.message}</small>}
        <br />
        <Controller
          name="telf"
          control={control}
          defaultValue=""
          rules={{ required: "El teléfono es requerido." }}
          render={({ field }) => (
            <div>
              <InputText id="telf" {...field} placeholder="Teléfono" />
            </div>
          )}
        />
        {errors.telf && <small className="p-error">{errors.telf.message}</small>}
        <br />
        <Toast ref={toast} />
        <Button label="Guardar Autorizado" type="submit" />
      </form>
    </div>
  );
};
