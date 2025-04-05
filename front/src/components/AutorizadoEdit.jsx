import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { useAutorizado } from '../context';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { parseAutorizadoData, prefijosTelf, tiposCedula } from '../helpers';
import { EstudianteFoto } from './EstudianteFoto';
import { FileUpload } from 'primereact/fileupload';

export const AutorizadoEdit = ({ initialData, toastRef,  onAutorizadoUpdated }) => {
  const { updateAutorizado } = useAutorizado();
  const toast = toastRef || useRef(null);

  const { handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      parentesco: '',
      ced: '',
      tipoCedula: tiposCedula.length > 0 ? tiposCedula[0] : { name: "" },
      direccion: '',
      observaciones: '',
      telf: '',
      phonePrefix: prefijosTelf.length > 0 ? prefijosTelf[0] : { name: "" },
    }
  });


  useEffect(() => {
    if (initialData) {
      const defaultValues = parseAutorizadoData(initialData, tiposCedula, prefijosTelf);
      reset(defaultValues);
    }
  }, [initialData, reset, tiposCedula, prefijosTelf]);

  const [foto, setFoto] = useState(null);
  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    try {

      const autorizado_id = initialData && initialData.autorizado_id;
      if (!autorizado_id) {
        console.error("No se encontró el autorizado_id en initialData.");
        return;
      }
      const cedCompleta = `${data.tipoCedula?.name || ''}${data.ced}`;
      data.ced = cedCompleta;
    
      const telfCompleta = `${data.prefijosTelf?.name || ''}${data.telf}`;
      data.telf = telfCompleta;
        

      const formData = new FormData();
      formData.append('nombre', data.nombre);
      formData.append('apellido', data.apellido);
      formData.append('parentesco', data.parentesco);
      formData.append('ced', data.ced);
      formData.append('direccion', data.direccion);    
      formData.append('telf', data.telf);
      formData.append('observaciones', data.observaciones || '');
      if (foto) {
        formData.append('foto', foto);
      }
      
      const response = await updateAutorizado(autorizado_id, formData);

    
      if (toast?.current) {
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Autorizado actualizado',
        });
      }
    
      if (onAutorizadoUpdated) onAutorizadoUpdated(response);
    } catch (error) {
      console.error("Error al editar Autorizado:", error);
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
    <Toast ref={(el) => { toast.current = el; }} />
    <h3>Datos del Autorizado</h3>
    <EstudianteFoto estudiante={initialData}/>
    <form onSubmit={handleSubmit(onSubmit)} className="form-alumno" encType='multipart/form-data'>
      <div className="form-columnone">
        <Controller
              name="nombre"
              control={control}
              defaultValue=""
              rules={{ required: "El nombre es requerido." }}
              render={({ field }) => (
                <>
                  <label htmlFor="nombre">Nombres</label>
                  <InputText placeholder="Ingrese nombre" id="nombre" {...field} />
                </>
              )}
              />
              <label htmlFor="ced">Cédula</label>
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
                  name="ced"
                  control={control}
                  defaultValue=""
                  rules={{ required: "La cédula  es requerida." }}
                  render={({ field }) => (
                    <>
                      <InputText placeholder="Ingresa la cedula " className="input-ced" id="ced" {...field} />
                    </>
                  )}
                />
                {errors.ced && <small className="p-error">{errors.ced.message}</small>}
            </div>
            <Controller
            name="direccion"
            control={control}
            defaultValue=""
            rules={{ required: "El direccion es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="direccion">Dirección</label>
                <InputText placeholder="Ingrese direccion" id="direccion" {...field} />
              </>
            )}
            />
            <Controller
            name="observaciones"
            control={control}
            defaultValue=""
            rules={{ required: "El observaciones es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="observaciones">observaciones</label>
                <InputText placeholder="Ingrese observaciones" id="observaciones" {...field} />
              </>
            )}
            />             
      </div>
      <div className="form-columntwo">
      <Controller
            name="apellido"
            control={control}
            defaultValue=""
            rules={{ required: "El apellido es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="apellido">apellidos</label>
                <InputText placeholder="Ingrese apellido" id="apellido" {...field} />
              </>
            )}
            />
             <Controller
            name="parentesco"
            control={control}
            defaultValue=""
            rules={{ required: "El parentesco es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="parentesco">Parentesco</label>
                <InputText placeholder="Ingrese parentesco" id="parentesco" {...field} />
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
              maxFileSize={1000000}
              customUpload
              auto
              uploadHandler={handleFotoChange}
              chooseLabel='Adjuntar Archivos .JPG'
            />
            <button type="submit" className='btn-next'>Guardar Autorizado</button>
        </div>        
      </form>
    </>
    
  );
};
