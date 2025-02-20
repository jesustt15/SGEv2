import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUsuario } from "../context";

export const NewUsuario = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const { createUsuario } = useUsuario();
  const { register, handleSubmit, setValue } = useForm();
  const roles = [
    { name: "Administrador", code: "admin" },
    { name: "Usuario", code: "user" },
  ];

  useEffect(() => {
    register("role", { required: true });
  }, [register]);

  const createUsuarioSubmit = async (data) => {
    try {
      // Asigna el código del role seleccionado al campo 'role'
      data.role = selectedRole.code;
      await createUsuario(data);
    } catch (error) {
      console.log("Error creating user:", error);
    }
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.value);
    setValue("role", e.value.code); // Usar setValue para actualizar el campo del formulario con el código del role
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit(createUsuarioSubmit)}>
        <FloatLabel>
          <label htmlFor="name">Nombre Completo</label>
          <InputText id="name" {...register("name", { required: true })} />
        </FloatLabel>
        <br />
        <FloatLabel>
          <InputText
            id="username"
            {...register("username", { required: true })}
          />
          <label htmlFor="username">Nombre de Usuario</label>
        </FloatLabel>
        <br />
        <FloatLabel>
          <InputText
            id="password"
            {...register("password", { required: true })}
          />
          <label htmlFor="password">Contraseña</label>
        </FloatLabel>
        <br />
        <Dropdown
          value={selectedRole}
          onChange={handleRoleChange}
          options={roles}
          optionLabel="name"
          placeholder="Seleccione un Rol"
          className="w-full md:w-14rem"
        />
        <br />
        <Button label="Añadir" type="submit" />
      </form>
    </div>
  );
};
