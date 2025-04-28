import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUsuario } from "../context";

export const NewUsuario = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const { createUsuario } = useUsuario();
  const roles = [
    { name: "Administrador", code: "admin" },
    { name: "Usuario", code: "user" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    register("role", { required: "El rol es requerido" });
  }, [register]);

  const createUsuarioSubmit = async (data) => {
    // La validación se realiza en el campo "confirmPassword" (aunque también podrías validarla aquí de forma extra)
    try {
      // Asigna el código del role seleccionado al campo 'role'
      data.role = selectedRole.code;
      await createUsuario(data);
    } catch (error) {
      console.log("Error al crear usuario:", error);
      if (Array.isArray(error)) {
        error.forEach(err => {
          if (err.field) {
            setError(err.field, { type: 'manual', message: err.message });
          }
        });
      } 
    }    
  };


  const handleRoleChange = (e) => {
    setSelectedRole(e.value);
    setValue("role", e.value.code); // Actualiza el campo del formulario con el código del role
  };

  return (
    <div className="card">
      <h4>DATOS DEL NUEVO USUARIO</h4>
      <form className="form-alumno" onSubmit={handleSubmit(createUsuarioSubmit)}>
        <div className="form-columnone">
          <label htmlFor="name">Nombre Completo</label>
          <InputText
            id="name"
            {...register("name", { required: "El nombre es requerido" })}
          />
          {errors.name && <span>{errors.name.message}</span>}
          
          <label htmlFor="username">Nombre de Usuario</label>
          <InputText
            id="username"
            {...register("username", { required: "El usuario es requerido" })}
          />
          {errors.username && <span>{errors.username.message}</span>}
          
          <label htmlFor="password">Contraseña</label>
          <InputText
            id="password"
            type="password"
            {...register("password", { required: "La contraseña es requerida" })}
          />
          {errors.password && <span>{errors.password.message}</span>}
          
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <InputText
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Confirma la contraseña",
              validate: (value) =>
                value === watch("password") || "Las contraseñas no coinciden"
            })}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
        </div>
        <div className="form-columntwo">
          <label htmlFor="role">ROL</label>        
          <Dropdown
            value={selectedRole}
            onChange={handleRoleChange}
            options={roles}
            optionLabel="name"
            placeholder="Seleccione un Rol"
            className="w-full md:w-14rem"
          />
          {errors.role && <span>{errors.role.message}</span>}
        </div>
        <Button className="btn-next" label="Añadir" type="submit" />
      </form>
    </div>
  );
};



