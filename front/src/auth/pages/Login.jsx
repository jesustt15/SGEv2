import { useAuth } from "../AuthContext"
import {useForm} from "react-hook-form";

export const Login = () => {
  
  const {login } = useAuth();
  const { register, handleSubmit}= useForm();


  const loginSubmit = async (data) => {

    
  } 
  
  
  
  
    return (
    <div>Login</div>
  )
}
