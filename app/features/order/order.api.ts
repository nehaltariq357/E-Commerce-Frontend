import { CreateOrderInput, Order } from "./order.types";

import { api } from "../../lib/api";

interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}
interface OrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
}
interface MessageResponse {
  success: boolean;
  message: string;
}

// create order

export const createOrder = async(data:CreateOrderInput)=>{
    return api(`/orders`,{
        method:"POST",
        body:JSON.stringify(data)
    })
}

// get my orders

export const getMyOrders = async()=>{
    return api< OrdersResponse>(`/orders`)
}

// get my order by id

export const getOrderById = async(orderId:number)=>{
    return api < OrderResponse>(   `/orders/${orderId}`)
}

// cancel order

export const cancelOrder = async(orderId:number)=>{
return api(`/orders/${orderId}/cancel`,{
    method:"PATCH"
})
}