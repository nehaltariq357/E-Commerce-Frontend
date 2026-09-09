"use client"
import {setAddresses,setAddressLoading} from "../../features/address/addressSlice"
import {useAppDispatch,useAppSelector} from "../../store/hooks"
import {getAddress} from "../../features/address/address.api"
import { useEffect } from "react";

export const AddressInitializer=()=>{
    const dispatch = useAppDispatch()
    const user = useAppSelector((state)=>state.auth.user)

    useEffect(()=>{
        const loadAddresses = async()=>{
            if(!user){
                dispatch(setAddresses([]))
                return 
            }
            try{
                dispatch(setAddressLoading(true))
                const response = await getAddress()
                dispatch(setAddresses(response.data))
            }catch(error){
                console.error("failed to load addresses: ",error
                )
                dispatch(setAddresses([]))
            }finally{
                dispatch(setAddressLoading(false))
            }
        }
        loadAddresses()
    },[dispatch,user])

    return null
}