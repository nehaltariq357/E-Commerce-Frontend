import { api } from "../../lib/api";
import { User } from "./auth.types";

interface LoginInput {
  email: string;
  password: string;
}
interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
}

export const loginUser = async(credentials:LoginInput)=>{
return api<LoginResponse>("/auth/login",{
    method:"POST",
    body: JSON.stringify(credentials),
})
}