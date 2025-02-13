import { InputText } from "primereact/inputtext";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";

export const Login = () => {
  const { login } = useAuth();
  const { register, handleSubmit } = useForm();

  const loginSubmit = async (data) => {
    const { username, password } = data;
    try {
      await login(username, password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex align-items-center justify-content-center">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
          <div className="text-900 text-3xl font-medium mb-3">
            ¡Bienvenido a SGE!
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit(loginSubmit)}>
            <label htmlFor="username" className="block text-900 font-medium mb-2">
              Username
            </label>
            <InputText
              id="username"
              type="text"
              placeholder="Ingrese su nombre de usuario"
              className="w-full mb-3"
              {...register("username", { required: true })}
            />
            <label htmlFor="password" className="block text-900 font-medium mb-2">
              Contraseña
            </label>
            <InputText
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              className="w-full mb-3"
              {...register("password", { required: true })}
            />
            <Button label="Ingresar" icon="pi pi-user" className="w-full" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
};
