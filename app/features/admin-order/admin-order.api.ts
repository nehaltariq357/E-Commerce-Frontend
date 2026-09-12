import { api } from "../../lib/api";
import { AdminOrder, OrderStatus } from "./admin-order.types";

interface AdminOrdersResponse {
  success: boolean;
  message: string;
  data: AdminOrder[];
}
interface AdminOrderResponse {
  success: boolean;
  message: string;
  data: AdminOrder;
}

// get all admin orders

export const getAllAdminOrders = async()=>{
    return api(`/admin/orders`)
}

// get admin orders by id

export const getAdminOrdersById = async(orderId:number)=>{
    return api(`/admin/orders/${orderId}`)
}

// update order status through admin

export const upateAdminOrderStatus =async(orderId:number,status:OrderStatus)=>{
return api(`/admin/orders/${orderId}/status`,{
    method:"PATCH",
    body:{status}
})
}