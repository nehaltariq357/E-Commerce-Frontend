
export type UserRole = "USER" | "ADMIN"
export interface User{
    id:number,
    name:string,
    email:string,
    role:UserRole
}

export interface AuthState {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean
}