import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { PaymentMethod, type ItemDetails, type OrderData } from "../../assets/globals/types/checkoutTypes";
import { orderItem, setStatus } from "../../store/checkoutSlice";
import { Status } from "../../assets/globals/types/types";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { items: cartItems } = useAppSelector((state) => state.carts);
  const { khaltiUrl, status } = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowProduct = location.state?.product;
  const buyNowQuantity = location.state?.quantity || 1;

  const items = buyNowProduct
    ? [{ product: buyNowProduct, quantity: buyNowQuantity }]
    : cartItems.map((item) => ({ product: item, quantity: item.quantity }));

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [errors, setErrors] = useState({ phoneNumber: "", shippingAddress: "" });
  const [data, setData] = useState<OrderData>({
    phoneNumber: "",
    shippingAddress: "",
    totalAmount: 0,
    paymentDetails: { paymentMethod: PaymentMethod.COD },
    items: [],
  });

  const handlePaymentMethod = (e: ChangeEvent<HTMLInputElement>) => {
    const method = e.target.value as PaymentMethod;
    setPaymentMethod(method);
    setData((prev) => ({
      ...prev,
      paymentDetails: { paymentMethod: method },
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = { phoneNumber: "", shippingAddress: "" };
    const phonePattern = /^(98|97)\d{8}$/;

    if (!data.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!phonePattern.test(data.phoneNumber.trim()))
      newErrors.phoneNumber = "Enter a valid 10-digit Nepali number (starts with 98/97)";

    if (!data.shippingAddress.trim()) newErrors.shippingAddress = "Shipping address is required";

    setErrors(newErrors);
    return !newErrors.phoneNumber && !newErrors.shippingAddress;
  };

  const totalAmount = items.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const itemDetails: ItemDetails[] = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const orderData: OrderData = {
      ...data,
      items: itemDetails,
      totalAmount: totalAmount + 100, // Add shipping
    };

    dispatch(setStatus(Status.LOADING));
    await dispatch(orderItem(orderData));
  };

  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
      return;
    }

    if (status === Status.SUCCESS) {
      if (paymentMethod === PaymentMethod.COD) {
        navigate("/myOrders");
        dispatch(setStatus(Status.LOADING));
      } else if (paymentMethod === PaymentMethod.KHALTI && khaltiUrl) {
        window.location.href = khaltiUrl;
      }
    }
  }, [status, khaltiUrl, navigate, paymentMethod, dispatch, initialRender]);

  return (
    <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32 mt-20 max-h-fit">
      {/* Order Summary */}
      <div className="px-4 pt-8">
        <p className="text-xl font-medium">Order Summary</p>
        <p className="text-gray-400">Check your items. And select a suitable shipping method.</p>
        <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6 max-h-[300px] overflow-y-auto custom-scrollbar scrollbar-hide">
          {items.map((item) => (
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
                <span className="font-semibold text-sm sm:text-base truncate">{item.product.productName}</span>
                <span className="text-gray-400 text-xs sm:text-sm">Qty: {item.quantity}</span>
                <p className="text-base sm:text-lg font-bold">Rs. {item.product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <p className="mt-8 text-lg font-medium">Payment Methods</p>
        <form className="mt-2 grid gap-6 mb-8">
          {Object.values(PaymentMethod).map((method) => (
            <div className="relative rounded-lg" key={method}>
              <input
                className="peer hidden"
                id={`radio_${method}`}
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={handlePaymentMethod}
              />
              <label
                htmlFor={`radio_${method}`}
                className="flex items-center cursor-pointer select-none rounded-lg border border-gray-300 p-4
                  transition-all duration-200
                  peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:shadow-md
                  hover:border-indigo-400 hover:bg-indigo-50"
              >
                <span className="ml-3 font-semibold">{method}</span>
              </label>
            </div>
          ))}
        </form>
      </div>

      {/* Payment Details Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Payment Details</p>
          <p className="text-gray-400">Complete your order by providing your payment details.</p>

          <label className="mt-4 mb-2 block text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={data.phoneNumber}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

          <label className="mt-4 mb-2 block text-sm font-medium text-gray-700">
            Shipping Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="shippingAddress"
            value={data.shippingAddress}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2"
          />
          {errors.shippingAddress && <p className="text-red-500 text-sm">{errors.shippingAddress}</p>}

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-indigo-600 p-3 text-white font-semibold hover:bg-indigo-700 transition-all duration-200"
          >
            Place Order (Rs. {totalAmount + 100})
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
