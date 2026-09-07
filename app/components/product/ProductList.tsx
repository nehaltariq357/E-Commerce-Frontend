"use client"
import { useEffect, useState } from "react";
import {getProducts} from "./product.api"
import {ProductCard} from "./ProductCard";
import { Product } from "./product.type";

export const ProductList = ()=>{
const [products,setProducts] = useState<Product[]>([])
const [loading,setLoading] = useState(true)
const [error,setError] = useState("")

useEffect(()=>{
    const fetchProducts = async()=>{
        try{
            setLoading(true)
            const response = await getProducts()
            setProducts(response.data)
        }catch(error){
            setError(
                error instanceof Error ? error.message : "Failed to fetch products"
            )
        }finally{
            setLoading(false)
        }
    }
    fetchProducts()
},[])

if(loading){
    return <p>Loading...</p>
}
if(error){
    return <p>{error}</p>
}

if (products.length ===0){
    return <p>No products found</p>
}
    return(
        <div>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    )
}