
export interface ProductImage {
    id:number,
    productId:number,
    imageUrl:string
}

export interface Productvariant{
    id:number,
    productId:number,
    size :string | null,
    stock:number,
    color:string | null,
    sku:string
}

export interface ProductCategory{
    id:number,
    name:string,
    description:string | null,
    isActive:boolean,
    createdAt:string,
    updatedAt:string

}

export interface Product {
    id:number,
    name:string,
    description:string,
    slug:string,
    price:string,
    isActive:boolean,
    categoryId:number | null,
    category:ProductCategory | null,
    productImages?:ProductImage[],
    productVariants?:Productvariant[]
    createdAt:string,
    updatedAt:string
}