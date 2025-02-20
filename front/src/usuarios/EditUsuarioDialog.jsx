import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useForm } from 'react-hook-form';
import { useUsuario } from '../context';

export const EditUsuarioDialog = ({ visible, onHide, usuario, toast, refreshUsuarios }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { updateUsuario} = useUsuario();

  const roles = [
    { name: 'admin', code: 'admin' },
    { name: 'user', code: 'user' },
  ];

  useEffect(() => {
    if (usuario) {
      reset(usuario);
      setSelectedRole(usuario.role);
    }
  }, [usuario, reset]);

  const [selectedRole, setSelectedRole] = useState(null);

  const onSubmit = async (data) => {
    try {
      data.role = selectedRole.code;
      await updateUsuario(usuario.user_id, data);
      toast.current.show({ severity: 'success', summary: 'Éxito', 
        detail: 'Usuario actualizado', 
        life: 3000 });
      onHide();
      refreshUsuarios();
    } catch (error) {
        console.log(error);
        toast.current.show({ severity: 'error', summary: 'Error', 
        detail: 'No se pudo actualizar el usuario', 
        life: 3000 });
    }
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.value);
    setValue('role', e.value.code);
  };

  return (
    <Dialog header="Editar Usuario" visible={visible} style={{ width: '450px' }} modal onHide={onHide}>
      <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">Nombre Completo</label>
          <InputText id="name" {...register('name', { required: true })} />
        <br />
          <InputText id="username" {...register('username', { required: true })} />
          <label htmlFor="username">Nombre de Usuario</label>
        <br />
          <InputText id="password" {...register('password')} />
          <label htmlFor="password">Contraseña (dejar en blanco si no desea cambiarla)</label>
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
        <Button label="Actualizar" type="submit" className="p-button-success" />
      </form>
    </Dialog>
  );
};
