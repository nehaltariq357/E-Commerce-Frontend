import {createSlice} from "@reduxjs/toolkit";
import type {AuthState,User} from "./auth.types"
import type {PayloadAction} from "@reduxjs/toolkit"

const initialState:AuthState={
    user:null,
    isAuthenticated:false,
    isLoading:true
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
      setUser:(state,action:PayloadAction<User>)=>{
        state.user = action.payload,
        state.isAuthenticated = true,
        state.isLoading = false
      },

      logout:(state)=>{
        state.user = null,
        state.isAuthenticated = false,
        state.isLoading = false
      },
      setLoading:(state,action:PayloadAction<boolean>)=>{
        state.isLoading = action.payload
      }

    }
})

export const {logout,setLoading,setUser} = authSlice.actions // for components use
export default authSlice.reducer // for store