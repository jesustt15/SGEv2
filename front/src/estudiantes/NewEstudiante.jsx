import { Button } from "primereact/button";
// import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { Calendar } from 'primereact/calendar';
import { InputText } from "primereact/inputtext";
import { addLocale } from 'primereact/api';
import { useState,  useRef } from "react";
import { useForm } from "react-hook-form";
import { useEstudiante} from "../context";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";

export const NewEstudiante= () => {

  const { createEstudiante} = useEstudiante();
  const [date, setDate] = useState(null);
  const { register, handleSubmit, } = useForm();
  const toast = useRef(null);
    const [foto, setFoto] = useState(null);

  const onUpload = (event) => {
    setFoto(event.files[0]);
    toast.current.show({ severity: 'info', summary: 'Éxito', detail: 'Foto cargada' });
  };
  
//   const sexos = [
//     { sexo: "Masculino", code: "Masculino" },
//     { sexo: "Femenino", code: "Femenino" },
//   ];

  addLocale('es', {
    firstDayOfWeek: 1,
    showMonthAfterYear: true,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
});

//   useEffect(() => {
//     register("sexo", { required: true });
//   }, [register]);

  const createEstudianteSubmit = async (data) => {
    try {
        console.log("lestoy dando");
      data.fechaNacimiento = date; // Incluye la fecha de nacimiento
  
      // Crea un objeto FormData y agrega todos los campos del formulario
      const formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      // Agrega la foto al FormData
      formData.append('foto', foto);
  
      await createEstudiante(formData);
    } catch (error) {
      console.log('Error al crear estudiante:', error);
    }
  };
  

//   const handleSexoChange = (e) => {
//     setSelectedsexo(e.value);
//     setValue('sexo', e.value.code);
//   };
  

  return (
    <div className="card">
      <form onSubmit={handleSubmit(createEstudianteSubmit)}>
        <FloatLabel>
          <label htmlFor="nombres">Nombres</label>
          <InputText id="nombres" {...register("nombres", { required: true })} />
        </FloatLabel>
        <br />
        <FloatLabel>
          <InputText
            id="apellidos"
            {...register("apellidos", { required: true })}
          />
          <label htmlFor="apellidos">Apellidos</label>
        </FloatLabel>
        <br />
        <FloatLabel>
            <Calendar inputId="fechaNacimiento" value={date} onChange={(e) => setDate(e.value)} locale="es" />
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
        </FloatLabel>
        <br />
        <FloatLabel>
            <InputNumber id="edad"  {...register("edad", { required: true })}/>
            <label htmlFor="edad">Edad</label>
        </FloatLabel>
        <br />
        {/* <Dropdown
          value={selectedsexo}
          onChange={handleSexoChange}
          options={sexos}
          optionLabel="name"
          placeholder="Sexo"
          className="w-full md:w-14rem"
        /> */}
        <br />
        <FloatLabel>
            <InputTextarea id="direccionCompleta" rows={5} cols={30} {...register("direccionCompleta", { required: true })}/>
            <label htmlFor="direccionCompleta">Ingrese la direccion</label>
        </FloatLabel>
        <br/>
        <FloatLabel>
            <InputNumber id="telefonoResidencial"  {...register("telefonoResidencial")}/>
            <label htmlFor="telefonoResidencial">Telefono Residencial</label>
        </FloatLabel>
        <br/>
        <FloatLabel>
          <label htmlFor="cedulaEscolar">Cedula Escolar</label>
          <InputText id="cedulaEscolar" {...register("cedulaEscolar", { required: true })} />
        </FloatLabel>
        <br/>
        <FloatLabel>
          <label htmlFor="correo">Correo</label>
          <InputText id="correo" {...register("correo")} />
        </FloatLabel>
        <br/>
        <Toast ref={toast}></Toast>
        <FileUpload
            mode="basic"
            name="foto"
            accept="image/*"
            maxFileSize={1000000}
            customUpload
            uploadHandler={onUpload}
         />
        <br />
        <Button label="Añadir" type="submit" />
      </form>
    </div>
  );
};
