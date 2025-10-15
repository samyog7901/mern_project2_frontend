import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../assets/globals/types/types";
import type { MyOrdersData, OrderData, OrderDetails, OrderResponseData, OrderResponseItem } from "../assets/globals/types/checkoutTypes";
import type { AppDispatch } from "./store";
import APIWITHTOKEN from "../http/APIWITHTOKEN";

const initialState:OrderResponseData= {
    items : [],
    status : Status.LOADING,
    khaltiUrl : null,
    myOrders : [],
    orderDetails : []
}

const orderSlice = createSlice({
    name:'order',
    initialState,
    reducers : {
        setItems(state:OrderResponseData,action:PayloadAction<OrderResponseItem>){
            state.items.push(action.payload)
        },
        setMyOrders(state:OrderResponseData,action:PayloadAction<MyOrdersData[]>){
            state.myOrders = action.payload
        },
        setOrderDetails(state:OrderResponseData,action:PayloadAction<OrderDetails[]>){
            state.orderDetails = action.payload
        },
        setStatus(state:OrderResponseData,action:PayloadAction<Status>){
            state.status = action.payload
        },
        setKhaltiUrl(state:OrderResponseData,action:PayloadAction<OrderResponseData['khaltiUrl']>){
            state.khaltiUrl = action.payload
        }
    }
})

export const {setItems,setStatus,setKhaltiUrl,setMyOrders,setOrderDetails} = orderSlice.actions
export default orderSlice.reducer


export function orderItem(data:OrderData){
    return async function orderItemThunk(dispatch:AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try{
            const response = await APIWITHTOKEN.post('/order',data)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setItems(response.data.data))
                if(response.data.url){
                    dispatch(setKhaltiUrl(response.data.url))
                }else{
                    dispatch(setKhaltiUrl(null))
                }
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        }catch(error){
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function fetchMyOrders(){
    return async function fetchMyOrdersThunk(dispatch:AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try{
            const response = await APIWITHTOKEN.get('/order/customer')
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setMyOrders(response.data.data))
            
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        }catch(error){
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function fetchMyOrderDetails(id:string){
    return async function fetchMyOrderDetailsThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIWITHTOKEN.get('/order/customer/' + id)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setOrderDetails(response.data.data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}