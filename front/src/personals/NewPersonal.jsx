/* eslint-disable react/prop-types */
import { InputText } from "primereact/inputtext";
import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { usePersonal } from "../context";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { tiposCedula, cargos, prefijosTelf } from "../helpers/dropdownOptions";

export const NewPersonal = () => {
  const { createPersonal } = usePersonal();
  const { handleSubmit, control, formState: { errors }, setError} = useForm();

  const toast = useRef(null);
  const [foto, setFoto] = useState(null);



  const onInvalid = (errors) => {
    console.log("Errores de validación:", errors);
  };


  const createPersonalSubmit = async (data) => {
    try {


      if (data.cargo && typeof data.cargo === 'object') {
        data.cargo = data.cargo.name;
      }
      const formData = new FormData();

      if (!data.tipoCedula) {
        data.tipoCedula = { name: "V-" };
      }
      const cedulaCompleta = `${data.tipoCedula.name}${data.ced}`;
      data.ced = cedulaCompleta;

      if (!data.prefijoTelf){
        data.prefijoTelf = { code: "0414" };
      }
      const telfCompleto = `${data.prefijoTelf.code}${data.telf}`;
      data.telf = telfCompleto;
      
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      if (foto) {
        formData.append('foto', foto);
      }
      
      // Llamamos a la función del contexto para crear el estudiante
     await createPersonal(formData);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Estudiante creado'
      });
      
    } catch (error) {
      console.log("Error al crear estudiante:", error);
      if (Array.isArray(error)) {
        error.forEach(err => {
          if (err.field) {
            setError(err.field, { type: 'manual', message: err.message });
          }
        });
      } else if (error.message) {
        setError("ced", { type: 'manual', message: error.message });
        setError("cod", { type: 'manual', message: error.message });
        setError("telf", { type: 'manual', message: error.message });
      }
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Revisa los campos marcados.'
      });
    }    
  };

  return (
    <div className="card">
        <h4>Datos del Personal</h4>
      <form className="form-alumno" onSubmit={handleSubmit(createPersonalSubmit, onInvalid)}>
        <div className="form-columnone">
          <Controller
            name="nombres"
            control={control}
            defaultValue=""
            rules={{ required: "El nombre es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="nombres">Nombres<span style={{ color: 'red' }}>*</span></label>
                <InputText placeholder="Ingrese nombres" id="nombres" {...field} />
              </>
            )}
          />
          {errors.nombres && <small className="p-error">{errors.nombres.message}</small>}
          <label htmlFor="ced">Cédula<span style={{ color: 'red' }}>*</span></label>
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
                rules={{ required: "La cédula requerida." }}
                render={({ field }) => (
                  <>
                    <InputText placeholder="Ingresa la cédula" className="input-ced" id="ced" {...field} />
                  </>
                )}
              />
              {errors.ced && <small className="p-error">{errors.ced.message}</small>}
              </div>
              <Controller
                name="cod"
                control={control}
                defaultValue=""
                rules={{ required: "El codigo es requerido." }}
                render={({ field }) => (
                  <>
                  <label>CÓDIGO<span style={{ color: 'red' }}>*</span></label>
                    <InputText placeholder="Ingresa el codigo" className="input-ced" id="cod" {...field} />
                  </>
                )}
              />
              {errors.cod && <small className="p-error">{errors.cod.message}</small>}
              <label htmlFor="foto">FOTO</label>
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
        </div>
        <div className="form-columntwo">
          <Controller
            name="apellidos"
            control={control}
            defaultValue=""
            rules={{ required: "El apellido es requerido." }}
            render={({ field }) => (
              <>
                <label htmlFor="apellidos">Apellidos<span style={{ color: 'red' }}>*</span></label>
                <InputText placeholder="Ingresa Apellidos" id="apellidos" {...field} />
              </>
            )}
          />
          {errors.apellidos && <small className="p-error">{errors.apellidos.message}</small>}
          <Controller
                name="cargo"
                control={control}
                defaultValue=""
                rules={{ required: "El cargo es requerido." }}
                render={({ field }) => (
                    <>
                        <label htmlFor="cargo">Cargo<span style={{ color: 'red' }}>*</span></label>
                        <Dropdown
                            id="cargo"
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            options={cargos}
                            optionLabel="name"
                            placeholder="Seleccione el Cargo"
                            className={errors.cargo ? 'p-invalid' : ''}
                        />
                    </>
                )}
            />
             <label htmlFor="telefono">Teléfono<span style={{ color: 'red' }}>*</span></label>
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
                    rules={{ required: "Ingrese el nro telefónico" ,
                      pattern: {
                        value: /^\d{7}$/,
                        message: "El número de teléfono debe contener exactamente 7 dígitos."
                      }
                    }}
                    render={({ field }) => (
                    <>
                        <InputText placeholder="Ingresa Telefono" className="input-ced" id="telf" {...field} />
                    </>
                    )}
                />
                {errors.telf && <small className="p-error">{errors.telf.message}</small>}
            </div>
          <Toast ref={toast} />
          <button type="submit" className="btn-next">SIGUIENTE</button>
        </div>
      </form>
    </div>
  );
};