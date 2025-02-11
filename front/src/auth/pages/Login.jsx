import { useAuth } from "../../context/AuthContext"
import {useForm} from "react-hook-form";

export const Login = () => {
  
  const { login } = useAuth();
  const { register, handleSubmit}= useForm();


  const loginSubmit = async (data) => {

    const { username, password } = data;

    try {

      login(username, password)
      
    } catch (error) {

      console.log(error);
      
    }
  } 
  
  
  
  
    return (
      <>
        <div>Login</div>
          <form onSubmit={handleSubmit(loginSubmit)}>
            <label htmlFor="username">Username</label>
            <input type="text" 
              name="username"
              placeholder="Ingresa tu nombre de usuario"
              {...register("username", {required:true})}
            />

            <label htmlFor="password">Contraseña</label>
            <input type="text" 
              name="password"
              placeholder="Ingresa su contraseña"
              {...register("password", {required:true})}
            />
            <br />
            <input type="submit" 
            value="entrar"
            />

          </form>
      </>
   
  )
}
