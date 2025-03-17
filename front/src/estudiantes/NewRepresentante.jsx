// NewRepresentante.jsx
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";

export const NewRepresentante = ({ estudianteId, onRepresentanteCreated }) => {
  // Supón que dispones de estas funciones en tu contexto o servicio API
  const createRepresentante = async (data) => {
    // Llama a la API para crear el representante
    // Devuelve el objeto creado (incluyendo el id)
    return { id: 101, ...data };
  };
  const asociarEstudianteRepresentante = async ({ estudiante_id, representante_id }) => {
    // Llama a la API para asociar el representante al estudiante
    return { message: "Representante asociado exitosamente" };
  };

  const { handleSubmit, control, formState: { errors } } = useForm();
  const toast = useRef(null);

  const createRepresentanteSubmit = async (data) => {
    try {
      const createdRepresentante = await createRepresentante(data);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Representante creado' });
      
      // Asociamos automáticamente al estudiante
      await asociarEstudianteRepresentante({
        estudiante_id: estudianteId,
        representante_id: createdRepresentante.id,
      });
      toast.current.show({
        severity: 'success',
        summary: 'Asociación exitosa',
        detail: 'Representante vinculado al estudiante',
      });
      
      if (onRepresentanteCreated) {
        onRepresentanteCreated();
      }
    } catch (error) {
      console.log("Error al crear representante:", error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Revisa los campos.' });
    }
  };

  return (
    <div className="card">
      <h2>Añadir Representante</h2>
      <form onSubmit={handleSubmit(createRepresentanteSubmit)}>
        <Controller
          name="nombreRepresentante"
          control={control}
          defaultValue=""
          rules={{ required: "El nombre es requerido." }}
          render={({ field }) => (
            <div>
              <InputText id="nombreRepresentante" {...field} placeholder="Nombre del representante" />
            </div>
          )}
        />
        {errors.nombreRepresentante && <small className="p-error">{errors.nombreRepresentante.message}</small>}
        <br />
        {/* Puedes agregar más campos según lo necesites */}
        <Toast ref={toast} />
        <Button label="Guardar Representante" type="submit" />
      </form>
    </div>
  );
};
