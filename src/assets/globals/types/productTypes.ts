import type { Status } from "./types"



interface User{
    id : string,
    username : string,
    email : string
}

export interface Category{
    id : string,
    categoryname : string
}

export interface Product{
    id : string,
    productName : string,
    description : string,
    price : number,
    stockQty : number,
    imageUrl : string,
    createdAt : string,
    updatedAt : string,
    userId : string,
    categoryId : string,
    User : User,
    Category : Category

}

export interface ProductState{
    product : Product[],
    status : Status,
    singleProduct : Product | null
}