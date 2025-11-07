import type { Product } from "./productTypes"
import type { Status } from "./types"

export enum PaymentMethod{
    COD = 'cod',
    KHALTI = 'khalti'
}

export enum OrderStatus{
    Pending = '🕔 pending',
    Delivered = '✅ delivered',
    Ontheway = '🚍🚚 ontheway',
    Cancelled = '❌ cancelled',
    Preparation = '📦 preparation',
    All = 'all'
}

export enum PaymentStatus{
    Paid = '✅ paid',
    Unpaid = '❌ unpaid',
    Pending = '🕔 pending'
}
export interface ItemDetails{
    productId : string,
    quantity : number
}
export interface OrderResponseItem extends ItemDetails{
    orderId : string
}

interface Payment {
    paymentMethod : PaymentMethod
}
interface OrderPaymentData extends Payment{
    paymentStatus : PaymentStatus
}


export interface OrderData{
    phoneNumber : string,
    shippingAddress : string,
    totalAmount : number,
    paymentDetails : Payment
    items : ItemDetails[]

}

export interface OrderResponseData{
    items : OrderResponseItem[],
    status : Status,
    khaltiUrl : string | null,
    myOrders : MyOrdersData[],
    orderDetails : OrderDetails[]
}

interface UserData{
    username : string,
    email : string
}
export interface MyOrdersData{
    id : string,
    phoneNumber : string,
    shippingAddress : string,
    totalAmount : number,
    orderStatus : OrderStatus,
    quantity : number,
    createdAt : string,
    paymentId : string,
    userId  : UserData
    Payment : OrderPaymentData
    
}
export interface OrderDetails{
    id : string,
    quantity : number,
    orderId : string,
    Product : Product,
    createdAt : string,
    Order : MyOrdersData
    // Payment : OrderPaymentData


}
