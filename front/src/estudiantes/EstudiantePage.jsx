import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const EditEstudiante = ({ initialData, updateEstudiante, toast, onEstudianteUpdated }) => {
  // Inicializamos react-hook-form con los valores iniciales
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialData });

  // Estado para la foto nueva
  const [foto, setFoto] = useState(null);

  // Obtenemos el valor de campos condicionales
  const alergiaOption = watch("alergiaOption");
  const condicionOption = watch("condicionOption");

  // Manejador para cambio de foto
  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  // Función de envío del formulario que arma el FormData siguiendo la lógica de edición
  const onSubmit = async (data) => {
    try {
      // Si el campo "sexo" viene como objeto, se transforma (esto dependerá de la forma en que manejes el select)
      if (data.sexo && typeof data.sexo === 'object') {
        data.sexo = data.sexo.name;
      }

      // Creamos un objeto FormData para enviar datos y archivos
      const formData = new FormData();

      // Construimos la cédula completa a partir de "tipoCedula" y "cedulaEscolar"
      const cedulaCompleta = `${data.tipoCedula.name}${data.cedulaEscolar}`;
      data.cedulaEscolar = cedulaCompleta;

      // Si se selecciona "No" en la opción de alergia o condición, se vacían esos campos
      if (alergiaOption === "No") {
        data.alergias = "";
      }
      if (condicionOption === "No") {
        data.condicion = "";
      }

      // Agregamos todas las propiedades de data al FormData
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      // Si se seleccionó una nueva foto, la adjuntamos
      if (foto) {
        formData.append('foto', foto);
      }

      // Se llama a la función que actualiza el estudiante en el backend
      const response = await updateEstudiante(formData);

      // Mostramos notificación exitosa
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Estudiante actualizado',
      });

      // Callback para continuar el flujo (por ejemplo, redirección o refrescar la lista)
      if (onEstudianteUpdated) {
        onEstudianteUpdated(response);
      }
    } catch (error) {
      console.error("Error al editar estudiante:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Revisa los campos marcados.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      {/* Campo Nombre */}
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          {...register("nombre", { required: true })}
          placeholder="Ingresa el nombre"
        />
        {errors.nombre && <span>El nombre es requerido.</span>}
      </div>

      {/* Campo Apellido */}
      <div>
        <label>Apellido:</label>
        <input
          type="text"
          {...register("apellido", { required: true })}
          placeholder="Ingresa el apellido"
        />
        {errors.apellido && <span>El apellido es requerido.</span>}
      </div>

      {/* Campo Sexo */}
      <div>
        <label>Sexo:</label>
        <select {...register("sexo", { required: true })}>
          <option value="">Seleccione...</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>
        {errors.sexo && <span>Seleccione un sexo.</span>}
      </div>

      {/* Campo Tipo de cédula */}
      <div>
        <label>Tipo de cédula:</label>
        <select {...register("tipoCedula", { required: true })}>
          <option value="">Seleccione...</option>
          {/* Para efectos ilustrativos se asume que tipoCedula es un objeto con propiedad "name" */}
          <option value='{"name":"V"}'>V</option>
          <option value='{"name":"E"}'>E</option>
        </select>
        {errors.tipoCedula && <span>Seleccione el tipo de cédula.</span>}
      </div>

      {/* Campo Cédula Escolar */}
      <div>
        <label>Cédula Escolar:</label>
        <input
          type="text"
          {...register("cedulaEscolar", { required: true })}
          placeholder="Ingresa la cédula escolar"
        />
        {errors.cedulaEscolar && <span>La cédula escolar es requerida.</span>}
      </div>

      {/* Gestión de Alergias */}
      <div>
        <label>Alergias:</label>
        <select {...register("alergiaOption", { required: true })}>
          <option value="">Seleccione...</option>
          <option value="Si">Si</option>
          <option value="No">No</option>
        </select>
        {alergiaOption === "Si" && (
          <div>
            <label>Detalle de alergias:</label>
            <input
              type="text"
              {...register("alergias", { required: true })}
              placeholder="Describa las alergias"
            />
          </div>
        )}
      </div>

      {/* Gestión de Condición */}
      <div>
        <label>Condición:</label>
        <select {...register("condicionOption", { required: true })}>
          <option value="">Seleccione...</option>
          <option value="Si">Si</option>
          <option value="No">No</option>
        </select>
        {condicionOption === "Si" && (
          <div>
            <label>Detalle de la condición:</label>
            <input
              type="text"
              {...register("condicion", { required: true })}
              placeholder="Describa la condición"
            />
          </div>
        )}
      </div>

      {/* Campo para la Foto */}
      <div>
        <label>Foto:</label>
        <input type="file" accept="image/*" onChange={handleFotoChange} />
      </div>

      <button type="submit">Actualizar Estudiante</button>
    </form>
  );
};

