import { InputText } from "primereact/inputtext";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import Logo from "../../assets/logo.png";
import Profes from "../../assets/profes.png";
import "./login.css";

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
    <div className="general-container">
      <div className="login-container">
        <div className="logo-container">
          <img src={Logo} alt="Logo-colegio" />
        </div>
        <div className="title-container">
          <h2>Bienvenido al Sistema De Gestion Escolar del Colegio<span> C.E.I.B Tumeremo</span> </h2>
        </div>
        <div className="form-container">
              <form className="form-submit" onSubmit={handleSubmit(loginSubmit)}>
                <label htmlFor="username" className="block text-900 font-medium mb-2">
                  Usuario
                </label>
                <InputText
                  id="username"
                  type="text"
                  placeholder="Ingrese el usuario"
                  className="input-login"
                  {...register("username", { required: true })}
                />
                <label htmlFor="password" className="block text-900 font-medium mb-2">
                  Contraseña
                </label>
                <InputText
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  className="input-login"
                  {...register("password", { required: true })}
                />
                <Button label="Ingresar"  className="btn-submit" type="submit" />
              </form>
        </div>
      </div>
      <div className="img-container">
        <img src={Profes} alt="Profes" />
      </div>
    </div>
  );
};
