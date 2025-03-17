// NewAutorizado.jsx
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export const NewAutorizado = ({ estudianteId, onAutorizadoCreated }) => {
  // Supón que tienes estas funciones
  const createAutorizado = async (data) => {
    // Llama a la API para crear el autorizado
    return { id: 201, ...data };
  };
  const vincularAutorizadoEstudiante = async ({ estudiante_id, autorizado_id }) => {
    // Llama a la API para asociar al autorizado con el estudiante
    return { message: "Autorizado vinculado exitosamente" };
  };

  const { handleSubmit, control, formState: { errors } } = useForm();
  const toast = useRef(null);

  const createAutorizadoSubmit = async (data) => {
    try {
      const createdAutorizado = await createAutorizado(data);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Autorizado creado' });
      
      // Vinculamos automáticamente al estudiante
      await vincularAutorizadoEstudiante({
        estudiante_id: estudianteId,
        autorizado_id: createdAutorizado.id,
      });
      toast.current.show({
        severity: 'success',
        summary: 'Asociación exitosa',
        detail: 'Autorizado vinculado al estudiante',
      });
      
      if (onAutorizadoCreated) {
        onAutorizadoCreated();
      }
    } catch (error) {
      console.log("Error al crear autorizado:", error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Verifica los datos.' });
    }
  };

  return (
    <div className="card">
      <h2>Añadir Autorizado</h2>
      <form onSubmit={handleSubmit(createAutorizadoSubmit)}>
        <Controller
          name="nombreAutorizado"
          control={control}
          defaultValue=""
          rules={{ required: "El nombre es requerido." }}
          render={({ field }) => (
            <div>
              <InputText id="nombreAutorizado" {...field} placeholder="Nombre del autorizado" />
            </div>
          )}
        />
        {errors.nombreAutorizado && <small className="p-error">{errors.nombreAutorizado.message}</small>}
        <br />
        <Toast ref={toast} />
        <Button label="Guardar Autorizado" type="submit" />
      </form>
    </div>
  );
};
