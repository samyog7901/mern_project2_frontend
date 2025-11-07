import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "../assets/globals/types/cartTypes";
import { Status } from "../assets/globals/types/types";
import type { AppDispatch } from "./store";
import APIWITHTOKEN from "../http/APIWITHTOKEN";


const initialState:CartState = {
    items : [],
    status : Status.LOADING
}
interface DeleteAction{
    productId : string
}
interface UpdateAction extends DeleteAction{
    quantity : number
}
const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducers : {
        setItems(state:CartState,action:PayloadAction<CartItem[]>){
            state.items = action.payload
            
        },
        setStatus(state:CartState,action:PayloadAction<Status>){
            state.status = action.payload
        },
        setDeleteItem(state:CartState,action:PayloadAction<DeleteAction>){
            const index = state.items.findIndex((item)=>item.Product.id === action.payload.productId)
            state.items.splice(index,1)
            

        },
        setUpdateItem(state:CartState,action:PayloadAction<UpdateAction>){
            const index = state.items.findIndex((item)=>item.Product.id === action.payload.productId)
            if(index !== -1){
                state.items[index].quantity = action.payload.quantity
            }
        },
        setClearCart(state){
            state.items = []
        }
    }
})

export const {setItems,setStatus,setDeleteItem,setUpdateItem,setClearCart} = cartSlice.actions
export default cartSlice.reducer

export function addToCart(productId:string){
    return async function addToCartThunk(dispatch:AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try{
           const response = await APIWITHTOKEN.post("customer/cart",{
            productId,
            quantity : 1
            })
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setItems(response.data.data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        }catch(error){
            dispatch(setStatus(Status.ERROR))
        }
    }

}

export function fetchCartItems(){
    return async function fetchCartItemsThunk(dispatch:AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try{
           const response = await APIWITHTOKEN.get("customer/cart")
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setItems(response.data.data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        }catch(error){
            dispatch(setStatus(Status.ERROR))
        }
    }

}

export function deleteCartItem(productId:string){
    return async function deleteCartItemThunk(dispatch:AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try{
           const response = await APIWITHTOKEN.delete("customer/cart/" + productId)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setDeleteItem({productId}))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        }catch(error){
            dispatch(setStatus(Status.ERROR))
        }
    }

}

export function updateCartItem(productId:string,quantity:number){
    return async function deleteCartItemThunk(dispatch:AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try{
           const response = await APIWITHTOKEN.patch("customer/cart/" + productId,{
            quantity
           })
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setUpdateItem({productId,quantity}))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        }catch(error){
            dispatch(setStatus(Status.ERROR))
        }
    }

}
