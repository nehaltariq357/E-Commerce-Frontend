"use client"
import { useEffect } from "react";
import { getCart } from "../../features/cart/cart.api";
import { setCart, setLoading } from "../../features/cart/cartSlice"
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export const CartInitializer=()=> {
    const dispatch = useAppDispatch()

    const user = useAppSelector((state)=>state.auth.user)

    useEffect(() => {
        const fetchCart = async () => {
            if(!user) return
            try {
                dispatch(setLoading(true));
                const response = await getCart();
                dispatch(setCart(response.data));

            } catch (error) {
                error instanceof Error ? error.message : "Cart not found"
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchCart()
    },[dispatch,user])

    return null // return null because we don't want to render anything
}