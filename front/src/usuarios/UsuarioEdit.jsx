import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUsuario } from "../context";
import { useParams } from "react-router-dom";

export const UsuarioEdit = () => {
  const { id } = useParams();
  const { getOneUsuario, updateUsuario } = useUsuario();
  const [selectedRole, setSelectedRole] = useState(null);
  const roles = [
    { name: "Administrador", code: "admin" },
    { name: "Usuario", code: "user" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  // Carga la información del usuario y establece los valores iniciales del formulario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const usuario = await getOneUsuario(id);
        // Se espera que "usuario" contenga { name, username, role }.
        reset({
          name: usuario.name,
          username: usuario.username,
          password: "",        // Se deja vacío para que el usuario ingrese una nueva contraseña si lo desea
          confirmPassword: "", // También se limpia este campo
          role: usuario.role,  // Código del rol (p.ej., 'admin' o 'user')
        });
        const roleSelected = roles.find(r => r.code === usuario.role);
        setSelectedRole(roleSelected);
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      }
    };
    fetchUsuario();
  }, [id, getOneUsuario, reset]);

  useEffect(() => {
    register("role", { required: "El rol es requerido" });
  }, [register]);

  const updateUsuarioSubmit = async (data) => {
    // Aunque la validación en el input ya evita contraseñas distintas,
    // se podría agregar lógica adicional aquí si fuera necesario.
    try {
      data.role = selectedRole.code;
      await updateUsuario(id, data);
    } catch (error) {
      console.error("Error actualizando el usuario:", error);
    }
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.value);
    setValue("role", e.value.code);
  };

  return (
    <div className="card">
      <h4>EDITAR USUARIO</h4>
      <form className="form-alumno" onSubmit={handleSubmit(updateUsuarioSubmit)}>
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
        <Button className="btn-next" label="Actualizar" type="submit" />
      </form>
    </div>
  );
};
