/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {usePersonal } from '../context';
import {  EstudianteFoto, HeaderEdit } from '../components';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { parsePersonalData, tiposCedula, prefijosTelf, cargos } from '../helpers';
import { FileUpload } from 'primereact/fileupload';

export const PersonalEdit = ({ onPersonalUpdated, toastRef }) => {
  const { id } = useParams();
  const { personal, setPersonal, getOnePersonal, updatePersonal } = usePersonal();

  const internalToastRef = useRef(null);
  const toast = toastRef || internalToastRef;


  const {
    handleSubmit, 
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  const [foto, setFoto] = useState(null);
  const [formInitialized, setFormInitialized] = useState(false);


  useEffect(() => {
    const loadPersonal = async () => {
      if (id) {
        const fetchedPersonal = await getOnePersonal(id);
        setPersonal(fetchedPersonal);
        const defaultValues = parsePersonalData(fetchedPersonal, tiposCedula, prefijosTelf, cargos);
        reset(defaultValues);
        setFormInitialized(true);
      }
    };

    if (!formInitialized) {
      loadPersonal();
    }
  }, [id, formInitialized, reset, getOnePersonal, tiposCedula, prefijosTelf, cargos ]);

 

  const onSubmit = async (data) => {
    try {
     

        if (data.cargo && typeof data.cargo === 'object') {
            data.cargo = data.cargo.name;
          }
      const formData = new FormData();
      const cedulaCompleta = `${data.tipoCedula?.name || ''}${data.ced}`;
      data.ced = cedulaCompleta;

       const telfCompleta = `${data.prefijosTelf?.name || ''}${data.telf}`;
        data.telf = telfCompleta;

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (foto) {
        formData.append('foto', foto);
      }

      const response = await updatePersonal(id, formData);
      
      if (toast?.current) {
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Personal actualizado',
        });
      }
      
      if (onPersonalUpdated) onPersonalUpdated(response);
    } catch (error) {
      console.log("Error al crear estudiante:", error);
      if (Array.isArray(error)) {
        error.forEach(err => {
          if (err.field) {
            setError(err.field, { type: 'manual', message: err.message });
          }
        });
      } 
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Revisa los campos marcados.'
      });
    }    
  };

  return (
    <>
      <HeaderEdit />
      <Toast ref={(el) => { toast.current = el; }} />
      <EstudianteFoto estudiante={personal} />
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
          <label htmlFor="cedula">Cedula</label>
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
                <Controller
                  name="ced"
                  control={control}
                  defaultValue=""
                  rules={{ required: "La cédula es requerida." }}
                  render={({ field }) => (
                    <>
                      <InputText placeholder="Ingresa la cedula " className="input-ced" id="ced" {...field} />
                    </>
                  )}
                />
                {errors.ced && <small className="p-error">{errors.ced.message}</small>}
            </div>
            <Controller
                  name="cod"
                  control={control}
                  defaultValue=""
                  rules={{ required: "El código es requerido." }}
                  render={({ field }) => (
                    <>
                    <label htmlFor="cod">Código</label>
                      <InputText placeholder="Ingresa el código " className="input-ced" id="cod" {...field} />
                    </>
                  )}
                />
                {errors.cod && <small className="p-error">{errors.cod.message}</small>}
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
              name="cargo"
              control={control}
              defaultValue=""
              rules={{ required: "El cargo es requerido." }}
              render={({ field }) => (
                <>
                  <label htmlFor="cargo">cargo</label>
                  <Dropdown
                    id="cargo"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={cargos}
                    optionLabel="name"
                    placeholder="Seleccione el cargo"
                    className={errors.cargo ? 'p-invalid' : ''}
                  />
                </>
              )}
            />
            <label htmlFor="telefono">Teléfono</label>
              <div className="group">
                <Controller
                  name="prefijoTelf"
                  control={control}
                  defaultValue={prefijosTelf[0]}
                  rules={{ required: "Seleccione un prefijo." }}
                  render={({ field }) => (
                    <>
                      <Dropdown
                        id="prefijoTelf"
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={prefijosTelf}
                        optionLabel="name"
                        placeholder="0414"
                        className={errors.prefijo ? 'p-invalid' : 'dropdown-phone'}
                      />
                    </>
                  )}
                />
                <Controller
                  name="telf"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Ingrese el nro telefónico" }}
                  render={({ field }) => (
                    <>
                      <InputText placeholder="Ingresa Telefono" className="input-ced" id="telf" {...field} />
                    </>
                  )}
                />
                {errors.telf && <small className="p-error">{errors.telf.message}</small>}
            </div>
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
                    setFoto(selectedFile); // Guardamos el archivo en el estado
                    if (toast?.current) {
                      toast.current.show({
                        severity: 'success',
                        summary: 'Archivo cargado',
                        detail: `El archivo ${selectedFile.name} se ha cargado correctamente.`,
                      });
                    }
                  } else {
                    // Opcionalmente, si no hay archivo, mostramos un aviso
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
    </>
  );
};
