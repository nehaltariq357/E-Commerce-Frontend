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
interface MeResponse { success: boolean; message: string; data: User; }
// get current user

export const getCurrentUser = async()=>{
    return api<MeResponse>("/auth/me")
}

// refresh function

export const refreshAccessToken = async()=>{
  return api("/auth/refresh",{
    method:"POST"
  })

}