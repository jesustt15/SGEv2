/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { useRepresentante } from '../context';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { parseRepresentanteData, prefijosTelf, prefijosTrabajo, tipoEdoCivil, tiposCedula } from '../helpers';
import { RadioButton } from 'primereact/radiobutton';
import { EstudianteFoto } from './EstudianteFoto';
import { FileUpload } from 'primereact/fileupload';

export const RepresentantesEdit = ({ initialData, toastRef,  onRepresentantesUpdated }) => {
  const { updateRepresentante } = useRepresentante();
  const toast = toastRef || useRef(null);

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      ced: '',
      edo_civil: '',
      edad: '',
      dire_trabajo: '',
      correoElectronico: '',
      tipoCedula: tiposCedula.length > 0 ? tiposCedula[0] : { name: "" },
      direccion: '',
      telf: '',
      prefijosTelf: prefijosTelf.length > 0 ? prefijosTelf[0] : { name: "" },
      telf_trabajo: '',
      prefijosTrabajo: prefijosTrabajo.length > 0 ? prefijosTrabajo[0] : { name: "" },
    }
  });


  useEffect(() => {
    if (initialData) {
      const defaultValues = parseRepresentanteData(
        initialData, tiposCedula, prefijosTelf, prefijosTrabajo, tipoEdoCivil);
      reset(defaultValues);
   
    }

  }, [initialData, reset, tiposCedula, prefijosTelf, prefijosTrabajo, tipoEdoCivil]);

  const [foto, setFoto] = useState(null);
  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {

    try {

      const representante_id = initialData && initialData.representante_id;
      if (!representante_id) {
        console.error("No se encontró el representante_id en initialData.");
        return;
      }
      const cedCompleta = `${data.tipoCedula?.name || ''}${data.ced}`;
      data.ced = cedCompleta;
    
      const telfCompleta = `${data.prefijosTelf?.name || ''}${data.telf}`;
      data.telf = telfCompleta;
      const telfCompletoTrabajo = `${data.prefijosTrabajo?.name || ''}${data.telf_trabajo}`;
      data.telf_trabajo = telfCompletoTrabajo;
        

      const formData = new FormData();
      formData.append('nombre', data.nombre);
      formData.append('apellido', data.apellido);
      formData.append('ced', data.ced);
      formData.append('direccion', data.direccion);    
      formData.append('telf', data.telf);
      formData.append('edo_civil', data.edo_civil?.name || '');
      formData.append('telf_trabajo', data.telf_trabajo);
      formData.append('dire_trabajo', data.dire_trabajo);
      formData.append('correoElectronico', data.correoElectronico);
      if (foto) {
        formData.append('foto', foto);
      }
      console.log("FormData a enviar:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await updateRepresentante(representante_id, formData);

    
      if (toast?.current) {
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Representante actualizado',
        });
      }
    
      if (onRepresentantesUpdated) onRepresentantesUpdated(response);
    } catch (error) {
      console.error("Error al editar Representante:", error);
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
    <h3>Datos del Representante</h3>
    <EstudianteFoto estudiante={initialData} />
    <form onSubmit={handleSubmit(onSubmit)} className="form-repre" encType='multipart/form-data'>
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
        <div className="group">
            <div className="group-item">
                <Controller
                        name="edo_civil"
                        control={control}
                        defaultValue=""
                        rules={{ required: "El edo_civil es requerido." }}
                        render={({ field }) => (
                        <>
                            <label htmlFor="edo_civil">edo_civil</label>
                            <Dropdown
                            id="edo_civil"
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            options={tipoEdoCivil}
                            optionLabel="name"
                            placeholder="Seleccione el Estado Civil"
                            className={errors.edo_civil ? 'p-invalid' : ''}
                            />
                        </>
                        )}
                    />
            </div>
            <div className="group-item">
                <Controller
                name="edad"
                control={control}
                defaultValue=""
                rules={{ required: "El edad es requerido." }}
                render={({ field }) => (
                    <>
                    <label htmlFor="edad">edad</label>
                    <InputText placeholder="Ingrese edad" id="edad" type='number' {...field} />
                    </>
                )}
                />
            </div>
        </div>
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
                        <InputText type='number' 
                        placeholder="Ingresa la cedula " className="input-ced" id="ced" {...field} />
                        </>
                    )}
                    />
                    {errors.ced && <small className="p-error">{errors.ced.message}</small>}
            </div>
            <label>¿Trabaja?</label>
                <div className="group">
                    <div className="p-field-radiobutton">
                        <Controller
                        name="trabajaOption"
                        control={control}
                        defaultValue="No"
                        render={({ field }) => (
                            <>
                            <RadioButton 
                                inputId="trabajaNo" 
                                name="trabajaOption" 
                                value="No" 
                                onChange={(e) => field.onChange(e.value)} 
                                checked={field.value === "No"} />
                            <label htmlFor="trabajaNo" className="ml-2">No</label>
        
                            <RadioButton 
                                inputId="trabajaSi" 
                                name="trabajaOption" 
                                value="Si" 
                                onChange={(e) => field.onChange(e.value)} 
                                checked={field.value === "Si"} 
                                className="ml-4" />
                            <label htmlFor="trabajaSi" className="ml-2">Sí</label>
                            </>
                        )}
                        />
                    </div>
                    <Controller
                        name="dire_trabajo"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                        <InputText 
                            placeholder="Ingresa condición especial" 
                            id="dire_trabajo" 
                            className="input-radio-button"
                            disabled={watch("trabajaOption") === "No"} 
                            {...field} 
                        />
                        )}
                    />
                    {errors.dire_trabajo && <small className="p-error">{errors.dire_trabajo.message}</small>}
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
            name="correoElectronico"
            control={control}
            defaultValue=""
            rules={{ required: "El correoElectronico es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="correoElectronico">correo Electronico</label>
                <InputText placeholder="Ingrese correoElectronico" id="correoElectronico" type='email' {...field} />
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
                      <InputText placeholder="Ingresa Telefono" type='number'
                      className="input-ced" id="telf" {...field} />
                    </>
                  )}
                />
                {errors.telf && <small className="p-error">{errors.telf.message}</small>}
            </div>
            <label htmlFor="telf_trabajo">Teléfono Trabajo</label>
              <div className="group">
                <Controller
                  name="prefijosTrabajo"
                  control={control}
                  defaultValue={prefijosTrabajo[0]}
                  rules={{ required: "Seleccione un prefijo." }}
                  render={({ field }) => (
                    <>
                      <Dropdown
                        id="prefijosTrabajo"
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={prefijosTrabajo}
                        optionLabel="name"
                        placeholder="0414"
                        className={errors.prefijo ? 'p-invalid' : 'dropdown-phone'}
                      />
                    </>
                  )}
                />
                <Controller
                  name="telf_trabajo"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Ingrese el nro telefónico" }}
                  render={({ field }) => (
                    <>
                      <InputText placeholder="Ingresa Telefono" type='number'
                      className="input-ced" id="telf_trabajo" {...field} />
                    </>
                  )}
                />
                {errors.telf_trabajo && <small className="p-error">{errors.telf_trabajo.message}</small>}
            </div>
            <label>Cambiar foto:</label>
              <FileUpload
                mode="basic"
                name="foto"
                accept="image/*"
                maxFileSize={1000000}
                customUpload
                auto
                chooseLabel='Adjuntar Archivo .JPG'
                uploadHandler={handleFotoChange}
              />
            <button type="submit" className='btn-next'>Guardar Representantes</button>
        </div>        
      </form>
    </>
    
  );
};
