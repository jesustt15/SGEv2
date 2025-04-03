import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { useAutorizado } from '../context';

export const AutorizadoEdit = ({ initialData }) => {

    const {updateAutorizado} = useAutorizado();
  const { handleSubmit, reset, register, formState: { errors } } = useForm({
    defaultValues: {
      autorizado: '',
    }
  });

  useEffect(() => {
    reset({
      autorizado: initialData?.nombre || '',
      // Asigna otros datos si es necesario
    });
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    await updateAutorizado(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-autorizado">
      <h3>Datos del Autorizado</h3>
      <label htmlFor="autorizado">Autorizado</label>
      <InputText
        id="autorizado"
        placeholder="Nombre del autorizado"
        {...register("autorizado", { required: "El campo autorizado es requerido" })}
      />
      {errors.autorizado && <span>{errors.autorizado.message}</span>}
      <button type="submit">Guardar Autorizado</button>
    </form>
  );
};
