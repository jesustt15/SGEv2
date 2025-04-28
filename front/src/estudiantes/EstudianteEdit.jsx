/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEstudiante } from '../context';
import { AutorizadoEdit, EstudianteFoto, HeaderEdit, RepresentantesEdit } from '../components';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { sexos, parseEstudianteData, tiposCedula } from '../helpers';
import { RadioButton } from 'primereact/radiobutton';
import { FileUpload } from 'primereact/fileupload';

export const EstudianteEdit = ({ onEstudianteUpdated, toastRef }) => {
  const { id } = useParams();
  const { estudiante, setEstudiante, getOneEstudiante, updateEstudiante } = useEstudiante();

  const internalToastRef = useRef(null);
  const toast = toastRef || internalToastRef;

  const autorizado = estudiante.autorizados?.[0];
  const representantePadre = estudiante.representantes?.find(rep => rep.tipo === 'Padre');
  const representanteMadre = estudiante.representantes?.find(rep => rep.tipo === 'Madre');
  const {
    watch,
    handleSubmit, 
    control,
    reset,
    formState: { errors },
  } = useForm();

  const [foto, setFoto] = useState(null);
  const [formInitialized, setFormInitialized] = useState(false);


  useEffect(() => {
    const loadEstudiante = async () => {
      if (id) {
        const fetchedEstudiante = await getOneEstudiante(id);
        setEstudiante(fetchedEstudiante);
        const defaultValues = parseEstudianteData(fetchedEstudiante, tiposCedula, sexos);
        reset(defaultValues);
        setFormInitialized(true);
      }
    };

    if (!formInitialized) {
      loadEstudiante();
    }
  }, [id, formInitialized, reset, getOneEstudiante, tiposCedula, sexos]);

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

      const response = await updateEstudiante(id, formData);
      
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
          <Controller
            name="nombres"
            control={control}
            defaultValue=""
            rules={{ required: "El nombre es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="nombres">Nombres</label>
                <InputText placeholder="Ingrese nombres" id="nombres" {...field} />
              </>
            )}
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
              <Controller
                  name="edad"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "La edad es requerida." }}
                  render={({ field }) => (
                      <InputText type='number' placeholder="Ingrese edad" keyfilter="int" id="edad" {...field} />
                  )}
                />
                {errors.edad && <small className="p-error">{errors.edad.message}</small>}
              </div>
          </div>
          <label htmlFor="cedula">Cedula escolar</label>
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
                  name="cedulaEscolar"
                  control={control}
                  defaultValue=""
                  rules={{ required: "La cédula escolar es requerida." }}
                  render={({ field }) => (
                    <>
                      <InputText placeholder="Ingresa la cedula escolar" className="input-ced" id="cedulaEscolar" {...field} />
                    </>
                  )}
                />
                {errors.cedulaEscolar && <small className="p-error">{errors.cedulaEscolar.message}</small>}
            </div>
            <Controller
              name="sexo"
              control={control}
              defaultValue=""
              rules={{ required: "El sexo es requerido." }}
              render={({ field }) => (
                <>
                  <label htmlFor="sexo">Sexo</label>
                  <Dropdown
                    id="sexo"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={sexos}
                    optionLabel="name"
                    placeholder="Seleccione el Sexo"
                    className={errors.sexo ? 'p-invalid' : ''}
                  />
                </>
              )}
            />

          
        </div>
        
        <div className="form-columntwo">
            <Controller
            name="apellidos"
            control={control}
            defaultValue=""
            rules={{ required: "El nombre es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="apellidos">apellidos</label>
                <InputText placeholder="Ingrese apellidos" id="apellidos" {...field} />
              </>
            )}
            />
          {errors.apellidos && <span>El nombre es requerido.</span>}
          <Controller
            name="lugarNacimiento"
            control={control}
            defaultValue=""
            rules={{ required: "El lugar de nacimiento es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="lugarNacimiento">Lugar de Nacimiento</label>
                <InputText placeholder="Ingresa lugar de nacimiento" id="lugarNacimiento" {...field} />
              </>
            )}
          />
          {errors.lugarNacimiento && <small className="p-error">{errors.lugarNacimiento.message}</small>}
         <label>Condición especial</label>
          <div className="group">
            <div className="p-field-radiobutton">
              <Controller
                name="condicionOption"
                control={control}
                defaultValue="No"
                render={({ field }) => (
                  <>
                    <RadioButton 
                      inputId="condicionNo" 
                      name="condicionOption" 
                      value="No" 
                      onChange={(e) => field.onChange(e.value)} 
                      checked={field.value === "No"} />
                    <label htmlFor="condicionNo" className="ml-2">No</label>

                    <RadioButton 
                      inputId="condicionSi" 
                      name="condicionOption" 
                      value="Si" 
                      onChange={(e) => field.onChange(e.value)} 
                      checked={field.value === "Si"} 
                      className="ml-4" />
                    <label htmlFor="condicionSi" className="ml-2">Sí</label>
                  </>
                )}
              />
            </div>
              <Controller
                name="condicion"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputText 
                    placeholder="Ingresa condición especial" 
                    id="condicion" 
                    className="input-radio-button"
                    disabled={watch("condicionOption") === "No"} 
                    {...field} 
                  />
                )}
              />
          </div>
          {errors.condicion && <small className="p-error">{errors.condicion.message}</small>}
          <label>Cambiar foto:</label>
          <FileUpload
                mode="basic"
                name="foto"
                accept="image/*"
                customUpload
                chooseLabel="Adjuntar Archivo (.JPG)"
                maxFileSize={1000000}
                uploadHandler={(e) => {
                  if (e.files && e.files[0]) {
                    const selectedFile = e.files[0];
                    setFoto(selectedFile); 
                    if (toast?.current) {
                      toast.current.show({
                        severity: 'success',
                        summary: 'Archivo cargado',
                        detail: `El archivo ${selectedFile.name} se ha cargado correctamente.`,
                      });
                    }
                  } else {
                    if (toast?.current) {
                      toast.current.show({
                        severity: 'warn',
                        summary: 'Sin archivo',
                        detail: 'No se ha seleccionado ningún archivo.',
                      });
                    }
                  }
                }}
              />
          <button className='btn-next' type="submit">Guardar Cambios</button>
        </div>
      </form>
      {representanteMadre ? (
          <RepresentantesEdit initialData={representanteMadre}/>
      ):(
          <br />
      )}
      {representantePadre ? (
          <RepresentantesEdit initialData={representantePadre}/>
      ):(
          <br />
      )}
      <AutorizadoEdit initialData={autorizado}  />
    </>
  );
};
