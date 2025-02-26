import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useForm } from 'react-hook-form';
import { useEstudiante } from '../context';

export const EditEstudianteDialog = ({ visible, onHide, estudiante, toast, refreshEstudiantes }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { updateEstudiante} = useEstudiante();

  const roles = [
    { name: 'admin', code: 'admin' },
    { name: 'user', code: 'user' },
  ];

  useEffect(() => {
    if (estudiante) {
      reset(estudiante);
      setSelectedRole(estudiante.role);
    }
  }, [estudiante, reset]);

  const [selectedRole, setSelectedRole] = useState(null);

  const onSubmit = async (data) => {
    try {
      data.role = selectedRole.code;
      await updateEstudiante(estudiante.estudiante_id, data);
      toast.current.show({ severity: 'success', summary: 'Éxito', 
        detail: 'Estudiante actualizado', 
        life: 3000 });
      onHide();
      refreshEstudiantes();
    } catch (error) {
        console.log(error);
        toast.current.show({ severity: 'error', summary: 'Error', 
        detail: 'No se pudo actualizar el Estudiante', 
        life: 3000 });
    }
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.value);
    setValue('role', e.value.code);
  };

  return (
    <Dialog header="Editar Estudiante" visible={visible} style={{ width: '450px' }} modal onHide={onHide}>
      <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">Nombre Completo</label>
          <InputText id="name" {...register('name', { required: true })} />
        <br />
          <InputText id="username" {...register('username', { required: true })} />
          <label htmlFor="username">Nombre de Estudiante</label>
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
