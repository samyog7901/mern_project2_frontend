import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import Navbar from "../../assets/globals/components/navbar/Navbar"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { PaymentMethod, type ItemDetails, type OrderData } from "../../assets/globals/types/checkoutTypes"
import { orderItem } from "../../store/checkoutSlice"
import { Status } from "../../assets/globals/types/types"
import { useNavigate } from "react-router-dom"


const Checkout = () => {
    const {items} = useAppSelector((state)=>state.carts)
    const {khaltiUrl,status} = useAppSelector((state)=>state.orders)
    console.log(khaltiUrl)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [paymentMethod,setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD)
    const [data,setData] = useState<OrderData>({
        phoneNumber : "",
        shippingAddress : "",
        totalAmount : 0,
        paymentDetails : {
            paymentMethod : PaymentMethod.COD
        },
        items : []
    })

    const handlePaymentMethod = (e:ChangeEvent<HTMLInputElement>)=>{
        setPaymentMethod(e.target.value as PaymentMethod)
        setData({
            ...data,
            paymentDetails : {
                paymentMethod : e.target.value as PaymentMethod
            }
        })
    }
    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name,value} = e.target
        setData({
            ...data,
            [name] : value
        })
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const itemDetails:ItemDetails[] = items.map((item)=>{
            return{
                productId : item?.Product?.id,
                quantity : item?.quantity
            }
        })
        const orderData = {
          ...data,
          items : itemDetails,
          totalAmount
        }
        await dispatch(orderItem(orderData))
        if(status === Status.SUCCESS && paymentMethod === PaymentMethod.COD){
            navigate('/myOrders')
        }
      
    }
    useEffect(()=>{
      if(khaltiUrl){
        window.location.href = khaltiUrl
        return
      }
   
    },[khaltiUrl])
    const totalAmount = items.reduce((total,item)=>item?.quantity * item?.Product?.price + total,0)
  
   
    
  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row mt-[-12px] sm:px-10 lg:px-20 xl:px-32">

  <div className="mt-4 py-7 text-xs sm:mt-0 sm:ml-auto sm:text-base">

  </div>
</div>
<div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
  <div className="px-4 pt-8">
    <p className="text-xl font-medium">Order Summary</p>
    <p className="text-gray-400">Check your items. And select a suitable shipping method.</p>
    <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
        {
            items.length > 0 && items.map((item)=>{
                return(
                    <div key={item?.Product?.id} className="flex flex-col rounded-lg bg-white sm:flex-row">
                    <img className="m-2 h-24 w-28 rounded-md border object-cover object-center" src={item?.Product?.imageUrl} />
                    <div className="flex w-full flex-col px-4 py-4">
                      <span className="font-semibold">{item?.Product?.productName}</span>
                      <span className="float-right text-gray-400">Qty :{item?.quantity}</span>
                      <p className="text-lg font-bold">Rs.{item?.Product?.price}</p>
                    </div>
                  </div>
                )
            })
        }
    </div>

    <p className="mt-8 text-lg font-medium">Payment Methods</p>
    <form className="mt-5 grid gap-6">
      <div className="relative">
        <input className="peer hidden" id="radio_1" type="radio" name="radio" value={PaymentMethod.COD} onChange={handlePaymentMethod} />
        <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
        <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" htmlFor="radio_1">
          <img className="w-14 object-contain" src="/images/naorrAeygcJzX0SyNI4Y0.png" alt="" />
          <div className="ml-5">
            <span className="mt-2 font-semibold">COD(Cash On Delivery)</span>
          </div>
        </label>
      </div>
      <div className="relative">
        <input className="peer hidden" id="radio_2" type="radio" value={PaymentMethod.KHALTI} name="radio" onChange={handlePaymentMethod} />
        <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
        <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" htmlFor="radio_2">
          <img className="w-14 object-contain" src="/images/oG8xsl3xsOkwkMsrLGKM4.png" alt="" />
          <div className="ml-5">
            <span className="mt-2 font-semibold">Online(Khalti)</span>
          </div>
        </label>
      </div>
    </form>
  </div>
 <form onSubmit={handleSubmit}  noValidate>
 <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
    <p className="text-xl font-medium">Payment Details</p>
    <p className="text-gray-400">Complete your order by providing your payment details.</p>
    <div className="">
      
      <label htmlFor="phoneNumber" className="mt-4 mb-2 block text-sm font-medium">Phone Number</label>
      <div className="relative">
        <input type="number" onChange={handleChange} id="phoneNumber" name="phoneNumber" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Your Phone Number" />

       

      </div>
 
      <label htmlFor="billing-address" className="mt-4 mb-2 block text-sm font-medium">Shipping Address</label>
      <div className="flex flex-col sm:flex-row">
        <div className="relative flex-shrink-0 sm:w-7/12">
          <input type="text" onChange={handleChange} id="billing-address" name="shippingAddress" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Street Address" />
          {/* <p>{formState.errors.shippingAddress && formState.errors.shippingAddress.message}</p> */}
          <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
            <img className="h-4 w-4 object-contain" src="https://flagpack.xyz/_nuxt/4c829b6c0131de7162790d2f897a90fd.svg" alt="" />
          </div>
        </div>
       
      </div>

     
      <div className="mt-6 border-t border-b py-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">Subtotal</p>
          <p className="font-semibold text-gray-900">Rs. {totalAmount}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">Shipping</p>
          <p className="font-semibold text-gray-900">Rs. 4</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">Total</p>
        <p className="text-2xl font-semibold text-gray-900">Rs. {totalAmount+4}</p>
      </div>
    </div>

      <button type="submit" className="mt-4 mb-8 w-full rounded-md bg-gray-900 hover:cursor-pointer hover:bg-gray-800 px-6 py-3 font-medium text-white">Place Order</button>
  
      <button type="submit" className="mt-4 mb-8 w-full rounded-md bg-purple-600 hover:bg-purple-700 hover:cursor-pointer px-6 py-3 font-medium text-white">Pay With Khalti</button>
  
  </div>
 </form>
</div>
    </>

  )
}

export default Checkout