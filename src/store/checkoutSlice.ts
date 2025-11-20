import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../assets/globals/types/types";
import type { MyOrdersData, OrderData, OrderDetails, OrderResponseData, OrderResponseItem, OrderStatus, PaymentStatus } from "../assets/globals/types/checkoutTypes";
import type { AppDispatch } from "./store";
import APIWITHTOKEN from "../http/APIWITHTOKEN";
import { setClearCart } from "./cartSlice";

const initialState:OrderResponseData= {
    items : [],
    status : Status.LOADING,
    khaltiUrl : null,
    myOrders : [],
    orderDetails : []
}
interface DeleteOrderById{
    orderId : string
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
        },
        // checkoutSlice.ts
        setDeleteOrderById: (state, action: PayloadAction<{ orderId: string }>) => {
            state.myOrders = state.myOrders.filter(order => order.id !== action.payload.orderId);
        },

        updateOrderStatus(state:OrderResponseData, action:PayloadAction<{status:OrderStatus,orderId:string}>){
            const {status, orderId} = action.payload
            const updatedOrder = state.myOrders.map(order=>order.id == orderId ? {...order, orderStatus :status} : order)
            state.myOrders = updatedOrder
        },
        updatePaymentStatus(state: OrderResponseData, action: PayloadAction<{status: PaymentStatus, orderId: string}>) {
            const { status, orderId } = action.payload;
            state.myOrders = state.myOrders.map(order =>
                order.id === orderId
                    ? { ...order, Payment: { ...order.Payment, paymentStatus: status } }
                    : order
            );
        },
        
        updatePaymentStatusInOrderDetails(state, action: PayloadAction<{ status: PaymentStatus, orderId: string }>) {
            const { status, orderId } = action.payload;
            state.orderDetails = state.orderDetails.map(detail =>
                detail.Order.id === orderId
                    ? { ...detail, Order: { ...detail.Order, Payment: { ...detail.Order.Payment, paymentStatus: status } } }
                    : detail
            );
        },
        
        updateOrderStatusInOrderDetails(state, action: PayloadAction<{ status: OrderStatus, orderId: string }>) {
            const { status, orderId } = action.payload;
            state.orderDetails = state.orderDetails.map(detail =>
                detail.Order.id === orderId
                    ? { ...detail, Order: { ...detail.Order, orderStatus: status } }
                    : detail
            );
        }
        
    }
})

export const {setItems,setStatus,setKhaltiUrl,setMyOrders,setOrderDetails,setDeleteOrderById, updateOrderStatus, updatePaymentStatus,updateOrderStatusInOrderDetails,updatePaymentStatusInOrderDetails} = orderSlice.actions
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
                    dispatch(setClearCart())
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

export function deleteOrderById(orderId:string){
    return async function deleteOrderByIdThunk(dispatch:AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try{
           const response = await APIWITHTOKEN.delete("/order/admin/" + orderId)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setDeleteOrderById({orderId}))
                
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        }catch(error){
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function updateOrderStatusInStore(data:any){
    return function updateOrderStatusInStoreThunk(dispatch:AppDispatch){
        dispatch(updateOrderStatus(data))
    }
}
export function updatePaymentStatusInStore(data:any){
    return function updatePaymentStatusInStoreThunk(dispatch:AppDispatch){
        dispatch(updatePaymentStatus(data))
    }
}

export function updateOrderDetailsPaymentStatusInStore(data:any){
    return function updatePaymentStatusInStoreThunk(dispatch:AppDispatch){
        dispatch(updatePaymentStatusInOrderDetails(data))
    }
}


export const updateOrderDetailsStatusInStore = (data:any) => (dispatch:AppDispatch) => {
    dispatch(updateOrderStatusInOrderDetails(data));
  };