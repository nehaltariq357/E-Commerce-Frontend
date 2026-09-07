import {api} from "../../lib/api";
import {Product,ProductImage,Productvariant} from "./product.type"

interface ProductsResponse{
    success:boolean
    message:string
    data:Product[]
}

interface ProductResponse{
    success:boolean
    message:string
    data:Product
}

// get all product

export const getProducts = async()=>{
    return api<ProductsResponse>("/products")
}

// get product by id 

export const getProductById = async(productId:number)=>{
    return api<ProductResponse>(`/products/${productId}`)
}


