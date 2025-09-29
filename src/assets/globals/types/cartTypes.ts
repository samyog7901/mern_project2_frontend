import type { Product } from "./productTypes";
import type { Status } from "./types";

export interface CartItem{
    Product : Product,
    quantity : number
}
export interface CartState{
    items : CartItem[],
    status : Status
}