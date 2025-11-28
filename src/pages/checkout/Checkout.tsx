import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { PaymentMethod, type ItemDetails, type OrderData } from "../../assets/globals/types/checkoutTypes"
import { orderItem, setStatus } from "../../store/checkoutSlice"
import { Status } from "../../assets/globals/types/types"
import { useLocation, useNavigate } from "react-router-dom"

const Checkout = () => {
  const { items: cartItems } = useAppSelector((state) => state.carts)
  const { khaltiUrl, status } = useAppSelector((state) => state.orders)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const buyNowProduct = location.state?.product
  const buyNowQuantity = location.state?.quantity || 1

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD)
  const [errors, setErrors] = useState({ phoneNumber: "", shippingAddress: "" })

  // Use either BuyNow product or cart items
  const items = buyNowProduct
    ? [{ product: buyNowProduct, quantity: buyNowQuantity }]
    : cartItems.map((item) => ({ product: item, quantity: item.quantity }))

  const totalAmount = items.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  )

  const [data, setData] = useState<OrderData>({
    phoneNumber: "",
    shippingAddress: "",
    totalAmount: totalAmount + 100, // include shipping by default
    paymentDetails: { paymentMethod },
    items: items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
  })

  // Sync items/total if cart changes
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      totalAmount: totalAmount + 100,
    }))
  }, [items, totalAmount])

  const handlePaymentMethod = (e: ChangeEvent<HTMLInputElement>) => {
    const method = e.target.value as PaymentMethod
    setPaymentMethod(method)
    setData((prev) => ({
      ...prev,
      paymentDetails: { paymentMethod: method },
    }))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const newErrors = { phoneNumber: "", shippingAddress: "" }
    const phonePattern = /^(98|97)\d{8}$/

    if (!data.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    else if (!phonePattern.test(data.phoneNumber.trim()))
      newErrors.phoneNumber = "Enter a valid 10-digit Nepali number (starts with 98/97)"

    if (!data.shippingAddress.trim()) newErrors.shippingAddress = "Shipping address is required"

    setErrors(newErrors)
    return !newErrors.phoneNumber && !newErrors.shippingAddress
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    dispatch(setStatus(Status.LOADING))
    await dispatch(orderItem(data))
  }

  useEffect(() => {
    if (status === Status.SUCCESS && paymentMethod === PaymentMethod.COD) {
      navigate("/myOrders")
      dispatch(setStatus(Status.LOADING))
    }

    if (status === Status.SUCCESS && paymentMethod === PaymentMethod.KHALTI && khaltiUrl) {
      window.location.href = khaltiUrl
    }
  }, [status, khaltiUrl, navigate, paymentMethod, dispatch])

  return (
    <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32 mt-20 max-h-fit">
      {/* Order Summary */}
      <div className="px-4 pt-8">
        <p className="text-xl font-medium">Order Summary</p>
        <p className="text-gray-400">Check your items. And select a suitable shipping method.</p>
        <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6 max-h-[300px] overflow-y-auto custom-scrollbar scrollbar-hide">
          {items.length > 0 &&
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row items-center rounded-lg bg-white p-2 hover:shadow-md transition-all duration-200"
              >
                <img
                  className="m-2 h-20 w-24 sm:h-24 sm:w-28 rounded-md border object-cover object-center flex-shrink-0 transition-transform hover:scale-105 duration-300"
                  src={item.product.imageUrl}
                  alt={item.product.productName}
                />
                <div className="flex w-full flex-col px-2 py-2 sm:px-4">
                  <span className="font-semibold text-sm sm:text-base truncate">
                    {item.product.productName}
                  </span>
                  <span className="text-gray-400 text-xs sm:text-sm">Qty: {item.quantity}</span>
                  <p className="text-base sm:text-lg font-bold">Rs. {item.product.price}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Payment Methods */}
        <p className="mt-8 text-lg font-medium">Payment Methods</p>
        <form className="mt-2 grid gap-6 mb-8">
          <div className="relative rounded-lg">
            <input
              className="peer hidden"
              id="radio_1"
              type="radio"
              name="radio"
              value={PaymentMethod.COD}
              onChange={handlePaymentMethod}
              checked={paymentMethod === PaymentMethod.COD}
            />
            <label htmlFor="radio_1" className="flex items-center cursor-pointer select-none rounded-lg border p-4 peer-checked:border-indigo-600 peer-checked:bg-indigo-50">
              COD (Cash On Delivery)
            </label>
          </div>

          <div className="relative rounded-lg">
            <input
              className="peer hidden"
              id="radio_2"
              type="radio"
              name="radio"
              value={PaymentMethod.KHALTI}
              onChange={handlePaymentMethod}
              checked={paymentMethod === PaymentMethod.KHALTI}
            />
            <label htmlFor="radio_2" className="flex items-center cursor-pointer select-none rounded-lg border p-4 peer-checked:bg-violet-700 peer-checked:text-white">
              Khalti
            </label>
          </div>
        </form>
      </div>

      {/* Payment Details Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
        <p className="text-xl font-medium">Payment Details</p>
        <p className="text-gray-400">Complete your order by providing your payment details.</p>

        <label htmlFor="phoneNumber" className="mt-4 mb-2 block text-sm font-medium text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="phoneNumber"
          value={data.phoneNumber}
          onChange={handleChange}
          className="w-full rounded-md border p-2"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

        <label htmlFor="shippingAddress" className="mt-4 mb-2 block text-sm font-medium text-gray-700">
          Shipping Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="shippingAddress"
          value={data.shippingAddress}
          onChange={handleChange}
          className="w-full rounded-md border p-2"
        />
        {errors.shippingAddress && <p className="text-red-500 text-sm">{errors.shippingAddress}</p>}

        <p className="mt-4 text-lg font-semibold">Total: Rs. {data.totalAmount}</p>

        <button type="submit" className="mt-6 w-full rounded bg-indigo-600 py-3 text-white hover:bg-indigo-700">
          Place Order
        </button>
      </form>
    </div>
  )
}

export default Checkout
