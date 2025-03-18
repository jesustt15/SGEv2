// NewRepresentante.jsx
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { useRepresentante } from "../context";
import axios from "../api/config";

export const NewRepresentante = ({ studentId, onRepresentanteCreated }) => {
  const {createRepresentante} = useRepresentante();
  const { handleSubmit, control, formState: { errors } } = useForm();
  const toast = useRef(null);



  // Función para vincular el representante con el estudiante en la tabla EstudianteRepresentante.
  const asociarEstudianteRepresentante = async ({ estudiante_id, representante_id }) => {
    const response = await axios.post('/estudiantes/asociar', { 
      estudiante_id, 
      representante_id 
    });
    
    return response.data;
  };
  

  const createRepresentanteSubmit = async (data) => {
    try {
      const createdRepresentante = await createRepresentante(data);
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
      <h2>Añadir Representante</h2>
      <form onSubmit={handleSubmit(createRepresentanteSubmit)}>
        <Controller
          name="nombre"
          control={control}
          defaultValue=""
          rules={{ required: "El nombre es requerido." }}
          render={({ field }) => (
            <div>
              <InputText id="nombre" {...field} placeholder="Nombres " />
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
              <InputText id="apellido" {...field} placeholder="Apellidos" />
            </div>
          )}
        />
        {errors.apellido && <small className="p-error">{errors.apellido.message}</small>}
        <br />
        <Controller
          name="ced"
          control={control}
          defaultValue=""
          rules={{ required: "la cedula es requerida." }}
          render={({ field }) => (
            <div>
              <InputText id="ced" {...field} placeholder="Cedula" />
            </div>
          )}
        />
        {errors.ced && <small className="p-error">{errors.ced.message}</small>}
        <br />
        <Controller
          name="direccion"
          control={control}
          defaultValue=""
          rules={{ required: "La direccion es requerido." }}
          render={({ field }) => (
            <div>
              <InputText id="direccion" {...field} placeholder="Direccion" />
            </div>
          )}
        />
        {errors.direccion && <small className="p-error">{errors.direccion.message}</small>}
        <br />
        <Controller
          name="tipo"
          control={control}
          defaultValue=""
          rules={{ required: "tipo." }}
          render={({ field }) => (
            <div>
              <InputText id="tipo" {...field} placeholder="Tipo" />
            </div>
          )}
        />
        {errors.tipo && <small className="p-error">{errors.tipo.message}</small>}
        <br />
        <Controller
          name="telf"
          control={control}
          defaultValue=""
          rules={{ required: "El telf es requerido." }}
          render={({ field }) => (
            <div>
              <InputText id="telf" {...field} placeholder="telf" />
            </div>
          )}
        />
        {errors.telf && <small className="p-error">{errors.telf.message}</small>}
        <br />
        
        <Toast ref={toast} />
        <Button label="Guardar Representante" type="submit" />
      </form>
    </div>
  );
};
