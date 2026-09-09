
export interface Address{
    id:number,
    userId:number,
    fullName:string,
    phone:string,
    addressLine:string,
    city:string,
    state:string | null,
    postalCode:string,
    country:string,
    isDefault:boolean,
    createdAt:string,
    updatedAt:string
}

export interface CreatedAddressInput{
    fullName:string,
    phone:string,
    addressLine:string,
    city:string,
    state?:string,
    postalCode:string,
    country:string,
    isDefault?:boolean
}

export interface UpdatedAddressInput{
    fullName?:string,
    phone?:string,
    addressLine?:string,
    city?:string,
    state?:string | null,
    postalCode?:string,
    country?:string,
    isDefault?:boolean
}