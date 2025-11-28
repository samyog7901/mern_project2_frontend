import { useEffect, useState } from "react";
// import Navbar from "../../../assets/globals/components/navbar/Navbar";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {  fetchMyOrderDetails, updateOrderDetailsStatusInStore, updateOrderDetailsPaymentStatusInStore, setDeleteOrderById } from "../../../store/checkoutSlice";
import { useNavigate, useParams } from "react-router-dom";
import { OrderStatus, PaymentStatus, type OrderData } from "../../../assets/globals/types/checkoutTypes";
import { socket } from "../../../App";
import toast from "react-hot-toast";
// import { useAnimation } from "framer-motion";

// import SlidePageWrapper from "../../../assets/globals/components/SlidePageWrapper";

const MyOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orderDetails } = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchMyOrderDetails(id));
  }, [id, dispatch]);

  const handleDeleteOrder = (orderId: string) => {
    socket.emit("deleteOrder", { orderId });
  };

  useEffect(() => {
    const handleOrderDeleted = (orderId: string) => {
      setIsLoading(true);
      dispatch(setDeleteOrderById({ orderId }));
      toast.error("Your Order has been deleted!");
      setTimeout(() => {
        navigate("/myOrders");
        setIsLoading(false);
      }, 2000);
    };

    socket.on("orderDeleted", handleOrderDeleted);
    return () => {
      socket.off("orderDeleted", handleOrderDeleted);
    };
  }, [dispatch, navigate]);

  const paymentMap: Record<string, PaymentStatus> = {
    paid: PaymentStatus.Paid,
    unpaid: PaymentStatus.Unpaid,
    pending: PaymentStatus.Pending,
  };

  const orderMap: Record<string, OrderStatus> = {
    pending: OrderStatus.Pending,
    delivered: OrderStatus.Delivered,
    ontheway: OrderStatus.Ontheway,
    preparation: OrderStatus.Preparation,
    cancelled: OrderStatus.Cancelled,
    all: OrderStatus.All,
  };

  useEffect(() => {
    const handler = ({ type, status, orderId }: any) => {
      if (type === "ORDER_STATUS") {
        dispatch(updateOrderDetailsStatusInStore({ orderId, status }));
      }
      if (type === "PAYMENT_STATUS") {
        dispatch(updateOrderDetailsPaymentStatusInStore({ orderId, status }));
      }
    };

    socket.on("statusUpdated", handler);
    return () => {
      socket.off("statusUpdated", handler);
    };
  }, [dispatch]);

  if (isLoading || !orderDetails || orderDetails.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading order details...
      </div>
    );
  }

  const handleClick = () => navigate("/myOrders");

  return (
    <>
      {/* Back Button */}
      <div
        className="fixed top-20 left-4 z-30 flex items-center gap-2 bg-white/80 dark:bg-gray-900/60 
        backdrop-blur-md px-3 py-2 rounded-full shadow-md cursor-pointer hover:shadow-lg transition"
        onClick={handleClick}
      >
        <span className="text-xl">👈</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">Back</span>
      </div>

      <div className="py-20 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl font-semibold text-gray-700 dark:text-white">Order {id}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {orderDetails[0]?.createdAt && new Date(orderDetails[0].createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Order Items */}
        <div className="flex flex-col space-y-4">
          {orderDetails.map((order) => (
            <div
              key={order.Order?.id}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center gap-4 transition hover:shadow-lg"
            >
              {/* Product Image */}
              <div className="w-full sm:w-32 aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={order.Product?.imageUrl}
                  alt={order.Product?.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{order.Product?.productName}</h3>
                <div className="flex items-center space-x-4 mt-2 sm:mt-0 text-gray-700 dark:text-gray-300">
                  <p>Rs.{order.Product?.price}</p>
                  <p>Qty: {order.quantity}</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Rs.{order.Product?.price * order.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Order Summary</h3>
          <div className="space-y-1 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <p>Payment Method</p>
              <p>{orderDetails[0].Order?.Payment?.paymentMethod}</p>
            </div>
            <div className="flex justify-between">
              <p>Payment Status</p>
              <p>{paymentMap[orderDetails[0].Order?.Payment?.paymentStatus || "pending"]}</p>
            </div>
            <div className="flex justify-between">
              <p>Order Status</p>
              <p>{orderMap[orderDetails[0].Order?.orderStatus || "pending"]}</p>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>Rs. {orderDetails[0].Order?.totalAmount - 100}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping (24-hour delivery)</p>
              <p>Rs. 100</p>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <p>Total</p>
              <p>Rs. {orderDetails[0].Order?.totalAmount}</p>
            </div>
          </div>
        </div>

        {/* Customer Details & Actions */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Customer Details</h3>
            <p className="text-gray-700 dark:text-gray-300"><strong>Address:</strong> {orderDetails[0].Order?.shippingAddress}</p>
            <p className="text-gray-700 dark:text-gray-300"><strong>Phone:</strong> {orderDetails[0].Order?.phoneNumber}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <button className="py-2 rounded-lg border border-gray-800 dark:border-gray-300 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900 transition">
              Edit Order
            </button>
            {orderDetails[0].Order.Payment.paymentStatus !== PaymentStatus.Paid && (
              <button className="py-2 rounded-lg border border-yellow-500 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900 transition">
                Cancel Order
              </button>
            )}
            <button
              onClick={() => handleDeleteOrder(orderDetails[0].Order.id)}
              className="py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Delete Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};


export default MyOrderDetails;
