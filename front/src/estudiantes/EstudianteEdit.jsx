import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEstudiante } from '../context';
import { EstudianteFoto, HeaderEdit } from '../components';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

export const EstudianteEdit = ({ onEstudianteUpdated, toastRef }) => {
  const { id } = useParams();
  const { estudiante, setEstudiante, getOneEstudiante, updateEstudiante } = useEstudiante();
  
  // Si no se recibe la referencia Toast desde un padre, usar una interna.
  const toast = toastRef || useRef(null);

  const {
    register, 
    handleSubmit, 
    control,
    reset,
    formState: { errors },
  } = useForm();

  const [foto, setFoto] = useState(null);
  const [formInitialized, setFormInitialized] = useState(false);

  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  useEffect(() => {
    const loadEstudiante = async () => {
      if (id) {
        const fetchedEstudiante = await getOneEstudiante(id);
        setEstudiante(fetchedEstudiante);
        const fechaNacimiento = fetchedEstudiante.fechaNacimiento
          ? new Date(fetchedEstudiante.fechaNacimiento)
          : null;
        reset({
          nombres: fetchedEstudiante.nombres || '',
          apellidos: fetchedEstudiante.apellidos || '',
          fechaNacimiento: fechaNacimiento,
          edad: fetchedEstudiante.edad || '',
          sexo: fetchedEstudiante.sexo || '',
          lugarNacimiento: fetchedEstudiante.lugarNacimiento || '',
          cedulaEscolar: fetchedEstudiante.cedulaEscolar || '',
          condicion: fetchedEstudiante.condicion || '',
        });
        setFormInitialized(true);
      }
    };

    if (!formInitialized) {
      loadEstudiante();
    }
  }, [id, formInitialized, reset, getOneEstudiante, setEstudiante]);

  const onSubmit = async (data) => {
    try {
      if (data.sexo && typeof data.sexo === 'object') {
        data.sexo = data.sexo.name;
      }

      const formData = new FormData();
      const cedulaCompleta = `${data.tipoCedula?.name || ''}${data.cedulaEscolar}`;
      data.cedulaEscolar = cedulaCompleta;

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (foto) {
        formData.append('foto', foto);
      }

      const response = await updateEstudiante(formData);
      
      if (toast?.current) {
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Estudiante actualizado',
        });
      }
      
      if (onEstudianteUpdated) onEstudianteUpdated(response);
    } catch (error) {
      console.error("Error al editar estudiante:", error);
      if (toast?.current) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Revisa los campos marcados.',
        });
      }
    }
  };

  return (
    <>
      <HeaderEdit />
      <Toast ref={(el) => { toast.current = el; }} />
      <EstudianteFoto estudiante={estudiante} />
      <form onSubmit={handleSubmit(onSubmit)} className='form-alumno' encType="multipart/form-data">
        <div className="form-columnone">
          <label>Nombres</label>
          <input
            type="text"
            placeholder="Ingresa el nombre"
            {...register("nombres", { required: true })}
          />
          {errors.nombres && <span>El nombre es requerido.</span>}
          
          <div className="group-label">
            <div className="group-item">
              <label>Fecha de Nacimiento</label>
            </div>
            <div className="group-item">
              <label>Edad</label>
            </div>
          </div>
          <div className='group'>
            <div className="group-item">
              <Controller
                control={control}
                name="fechaNacimiento"
                rules={{ required: true }}
                render={({ field }) => (
                  <Calendar
                    {...field}
                    dateFormat="dd/mm/yy"
                    placeholder="Selecciona la fecha"
                  />
                )}
              />
              {errors.fechaNacimiento && <span>La fecha es requerida.</span>}
            </div>
            <div className="group-item">
              <input 
                type="text" 
                placeholder="Ingresa la edad"
                {...register('edad', { required: true })}
              />
              {errors.edad && <span>La edad es requerida.</span>}
            </div>
          </div>
          <label>Sexo</label>
          <input
            type="text" 
            placeholder="Ingresa el sexo"
            {...register('sexo', { required: true })}
          />
          <label>Cambiar foto:</label>
          <input type="file" accept="image/*" onChange={handleFotoChange} />
        </div>
        
        <div className="form-columntwo">
          <label>Apellidos</label>
          <input
            type="text"
            placeholder="Ingresa el apellido"
            {...register("apellidos", { required: true })}
          />
          {errors.apellidos && <span>El apellido es requerido.</span>}
          
          <label>Lugar de Nacimiento</label>
          <input
            type="text"
            placeholder="Ingresa el lugar de nacimiento"
            {...register("lugarNacimiento", { required: true })}
          />
          {errors.lugarNacimiento && <span>El lugar de nacimiento es requerido.</span>}
          
          <label>Condición</label>
          <input
            type="text"
            placeholder="Ingresa condición especial"
            {...register("condicion", { required: true })}
          />
          {errors.condicion && <span>La condición es requerida.</span>}
          <button type="submit">Actualizar Estudiante</button>
        </div>
      </form>
    </>
  );
};
