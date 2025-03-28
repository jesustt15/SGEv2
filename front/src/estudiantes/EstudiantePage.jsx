/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEstudiante } from '../context';
import { EstudianteFoto, HeaderEdit } from '../components';



export const EstudiantePage = ({ initialData, updateEstudiante, toast, onEstudianteUpdated }) => {
  const { id } = useParams();

  const { estudiante, setEstudiante, getOneEstudiante } = useEstudiante();
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: initialData });
  
  const [foto, setFoto] = useState(null);
  
  const alergiaOption = watch("alergiaOption");
  const condicionOption = watch("condicionOption");

  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  // Carga el estudiante y actualiza el formulario
  useEffect(() => {
    const loadEstudiante = async () => {
      if (id) {
        const fetchedEstudiante = await getOneEstudiante(id);
        setEstudiante(fetchedEstudiante);
        setValue('nombres', fetchedEstudiante.nombres)
      }
    };
    loadEstudiante();
  }, [id, getOneEstudiante, setEstudiante]);

  useEffect(() => {
    console.log('useEffect - Estudiante actualizado:', estudiante);
  }, [estudiante]);

  const onSubmit = async (data) => {
    try {
      if (data.sexo && typeof data.sexo === 'object') {
        data.sexo = data.sexo.name;
      }

      const formData = new FormData();
      const cedulaCompleta = `${data.tipoCedula.name}${data.cedulaEscolar}`;
      data.cedulaEscolar = cedulaCompleta;

      if (alergiaOption === "No") data.alergias = "";
      if (condicionOption === "No") data.condicion = "";

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (foto) formData.append('foto', foto);

      const response = await updateEstudiante(formData);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Estudiante actualizado',
      });
      if (onEstudianteUpdated) onEstudianteUpdated(response);
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
    <>
      <HeaderEdit />
      <form onSubmit={handleSubmit(onSubmit)} className='form-alumno-edit' encType="multipart/form-data">
      <EstudianteFoto  estudiante={estudiante}/>
        <div className="form-columone">
        </div>
          <label>Nombre:</label>
          <input
            type="text"
            {...register("nombres")}
            placeholder="Ingresa el nombre"
          />
          {errors.nombre && <span>El nombre es requerido.</span>}
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            {...register("apellidos")}
            placeholder="Ingresa el apellido"
          />
          {errors.apellido && <span>El apellido es requerido.</span>}
        </div>
        {/* ...otros campos... */}
        <button type="submit">Actualizar Estudiante</button>
      </form>
    </>
  );
};


