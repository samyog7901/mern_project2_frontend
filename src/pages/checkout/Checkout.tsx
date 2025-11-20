import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
// import Navbar from "../../assets/globals/components/navbar/Navbar"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { PaymentMethod, type ItemDetails, type OrderData } from "../../assets/globals/types/checkoutTypes"
import { orderItem, setStatus } from "../../store/checkoutSlice"
import { Status } from "../../assets/globals/types/types"
import { useNavigate } from "react-router-dom"

const Checkout = () => {
  const { items } = useAppSelector((state) => state.carts)
  const { khaltiUrl, status } = useAppSelector((state) => state.orders)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD)
  const [errors, setErrors] = useState({ phoneNumber: "", shippingAddress: "" })

  const [data, setData] = useState<OrderData>({
    phoneNumber: "",
    shippingAddress: "",
    totalAmount: 0,
    paymentDetails: {
      paymentMethod: PaymentMethod.COD,
    },
    items: [],
  })

  const handlePaymentMethod = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value as PaymentMethod)
    setData({
      ...data,
      paymentDetails: {
        paymentMethod: e.target.value as PaymentMethod,
      },
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value,
    })
    setErrors({ ...errors, [name]: "" }) // clear error while typing
  }

  const validate = () => {
    const newErrors = { phoneNumber: "", shippingAddress: "" }
    const phonePattern = /^(98|97)\d{8}$/ // 10-digit Nepali number validation

    if (!data.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!phonePattern.test(data.phoneNumber.trim())) {
      newErrors.phoneNumber = "Enter a valid 10-digit Nepali number (starts with 98/97)"
    }

    if (!data.shippingAddress.trim()) {
      newErrors.shippingAddress = "Shipping address is required"
    }

    setErrors(newErrors)
    return !newErrors.phoneNumber && !newErrors.shippingAddress
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    const itemDetails: ItemDetails[] = items.map((item) => ({
      productId: item?.Product?.id,
      quantity: item?.quantity,
    }))

    const orderData = {
      ...data,
      items: itemDetails,
      totalAmount: totalAmount + 100, // including shipping fee
    }
    dispatch(setStatus(Status.LOADING))
    await dispatch(orderItem(orderData))
 
  }
  const [initialRender, setInitialRender] = useState(true)

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false)
      return
    }
   
    if (status === Status.SUCCESS && paymentMethod === PaymentMethod.COD) {
      navigate("/myOrders")
      dispatch(setStatus(Status.LOADING))
    }
    if (status === Status.SUCCESS && paymentMethod === PaymentMethod.KHALTI && khaltiUrl) {
      window.location.href = khaltiUrl
    }
  }, [status,khaltiUrl,navigate])

  const totalAmount = items.reduce((total, item) => item?.quantity * item?.Product?.price + total, 0)

  return (
    <>
      {/* <Navbar /> */}

      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32 mt-20 max-h-fit">
        {/* Order Summary */}
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">Check your items. And select a suitable shipping method.</p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6 max-h-[300px] overflow-y-auto custom-scrollbar scrollbar-hide">
            {items.length > 0 &&
              items.map((item) => (
                <div
                  key={item?.Product?.id}
                  className="flex flex-col sm:flex-row items-center rounded-lg bg-white p-2 hover:shadow-md transition-all duration-200"
                >
                  <img
                    className="m-2 h-20 w-24 sm:h-24 sm:w-28 rounded-md border object-cover object-center flex-shrink-0 transition-transform hover:scale-105 duration-300"
                    src={item?.Product?.imageUrl}
                    alt={item?.Product?.productName}
                  />
                  <div className="flex w-full flex-col px-2 py-2 sm:px-4">
                    <span className="font-semibold text-sm sm:text-base truncate">
                      {item?.Product?.productName}
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">Qty: {item?.quantity}</span>
                    <p className="text-base sm:text-lg font-bold">Rs. {item?.Product?.price}</p>
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
            />
            <span className="peer-checked:border-indigo-600 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-4 border-gray-300 bg-white transition-colors duration-200"></span>
            <label
              htmlFor="radio_1"
              className="flex items-center cursor-pointer select-none rounded-lg border border-gray-300 p-4
                        transition-all duration-200
                        peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:shadow-md
                        hover:border-indigo-400 hover:bg-indigo-50"
            >
              <img className="w-14 object-contain" src="data:image/png;base64,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" alt="COD Icon" />
              <div className="ml-5 flex flex-col">
                <span className="text-gray-900 font-semibold text-base peer-checked:text-indigo-700 mt-2">
                  COD (Cash On Delivery)
                </span>
                <span className="text-gray-500 text-sm mt-1">
                  Pay with cash upon delivery. No online payment required.
                </span>
              </div>
            </label>
            </div>

            <div className="relative rounded-lg">
            <input
              className="peer hidden"
              id="radio_2"
              type="radio"
              value={PaymentMethod.KHALTI}
              name="radio"
              onChange={handlePaymentMethod}
            />
            <span className="peer-checked:border-white absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 "></span>
            <label
              className="flex cursor-pointer select-none rounded-lg border border-gray-300 p-4
                        peer-checked:bg-violet-700 peer-checked:text-white
                        hover:bg-violet-700 hover:text-white transition-all duration-200"
              htmlFor="radio_2"
            >
              <img className="w-14 object-contain" src="data:image/png;base64,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" alt="Khalti_logo" />
              <div className="ml-5 mt-5">
                <span className="mt-2 font-semibold peer-checked:text-white">Online (Khalti)</span>
              </div>
            </label>
            </div>

          </form>
        </div>

        {/* Payment Details */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl font-medium">Payment Details</p>
            <p className="text-gray-400">Complete your order by providing your payment details.</p>

            {/* Phone Number */}
            <label htmlFor="phoneNumber" className="mt-4 mb-2 block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                onChange={handleChange}
                id="phoneNumber"
                name="phoneNumber"
                className={`w-full rounded-md border px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 transition-all duration-200 ${
                  errors.phoneNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="Your Phone Number"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3 text-gray-400">
                📞
              </div>
            </div>
            {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}

            {/* Shipping Address */}
            <label htmlFor="billing-address" className="mt-4 mb-2 block text-sm font-medium text-gray-700">
              Shipping Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                onChange={handleChange}
                id="billing-address"
                name="shippingAddress"
                className={`w-full rounded-md border px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 transition-all duration-200 ${
                  errors.shippingAddress
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="Street Address"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
              <img
                className="h-4 w-4 object-contain"
                src="https://flagcdn.com/w20/np.png"
                alt="Nepal Flag"
              />

              </div>
            </div>
            {errors.shippingAddress && (
              <p className="text-sm text-red-500 mt-1">{errors.shippingAddress}</p>
            )}

            {/* Totals */}
            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                <p className="font-semibold text-gray-900">Rs. {totalAmount}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Shipping</p>
                <p className="font-semibold text-gray-900">Rs. 100</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-gray-900">Rs. {totalAmount + 100}</p>
            </div>

            {/* Buttons */}
            <button
              type="submit"
              className="mt-4 mb-8 w-full rounded-md bg-green-400 hover:bg-green-700 px-6 py-3 font-medium text-white transition-all duration-200"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Checkout
