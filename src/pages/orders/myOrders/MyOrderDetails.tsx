import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchMyOrderDetails,
  updateOrderDetailsStatusInStore,
  updateOrderDetailsPaymentStatusInStore,
  setDeleteOrderById,
} from "../../../store/checkoutSlice";
import { useNavigate, useParams } from "react-router-dom";
import { OrderStatus, PaymentStatus } from "../../../assets/globals/types/checkoutTypes";
import { socket } from "../../../App";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Status } from "../../../assets/globals/types/types";

const MyOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orderDetails } = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchMyOrderDetails(id));
  }, [id]);

  const handleDeleteOrder = (orderId: string) => {
    socket.emit("deleteOrder", { orderId });
  };

  useEffect(() => {
    const handleOrderDeleted = (orderId: string) => {
      setIsLoading(true);
      dispatch(setDeleteOrderById({ orderId }));
      toast.error("Your order has been deleted!");

      setTimeout(() => {
        navigate("/myOrders");
        setIsLoading(false);
      }, 2000);
    };

    socket.on("orderDeleted", handleOrderDeleted);
    return () => {
      socket.off("orderDeleted", handleOrderDeleted);
    }
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
    // @ts-ignore
    const handler = ({ type, status, orderId }) => {
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
    }
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
      {/* 🌟 Floating Back Button */}
      <div
        className="fixed top-20 left-4 z-30 flex items-center gap-2 bg-white/80 dark:bg-gray-900/60 
        backdrop-blur-md px-3 py-2 rounded-full shadow-md cursor-pointer hover:shadow-lg transition"
        onClick={handleClick}
      >
        <span className="text-xl">👈</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">Back</span>
      </div>

      <div className="pt-28 pb-10 px-4 sm:px-6 lg:px-10 max-w-9xl mx-auto space-y-8 lg:mx-5 sm:mx-2">

        {/* 🌟 Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Order Details
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {new Date(orderDetails[0]?.createdAt).toLocaleDateString()}
          </p>
        </motion.div>

        {/* 🌟 Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SECTION */}
          <div className="space-y-6 lg:col-span-2">

            {/* ⭐ Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 
              rounded-2xl shadow-md p-6 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Items in this Order
              </h2>

              {orderDetails.map((order) => (
                <div
                  key={order.Order.id}
                  className="flex flex-col sm:flex-row gap-4 items-start border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <img
                    className="w-full sm:w-28 h-28 rounded-xl object-cover shadow-sm"
                    src={order.Product?.imageUrl}
                    alt={order.Product?.productName}
                  />

                  <div className="flex flex-col w-full">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {order.Product?.productName}
                    </h3>

                    <div className="flex justify-between mt-2 text-gray-600 dark:text-gray-300 text-sm">
                      <p>Rs. {order.Product?.price}</p>
                      <p>Qty: {order.quantity}</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Rs. {order.Product?.price * order.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* ⭐ Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 
              rounded-2xl shadow-md p-6 space-y-4"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Order Summary
              </h2>

              <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span>{orderDetails[0].Order.Payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <span>{paymentMap[orderDetails[0].Order.Payment.paymentStatus]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Status</span>
                  <span>{orderMap[orderDetails[0].Order.orderStatus]}</span>
                </div>

                <hr className="my-2 border-gray-200 dark:border-gray-700" />

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {orderDetails[0].Order.totalAmount - 100}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Rs. 100</span>
                </div>

                <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-gray-100">
                  <span>Total</span>
                  <span>Rs. {orderDetails[0].Order.totalAmount}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SECTION — Sticky */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 
            rounded-2xl shadow-md p-6 space-y-5 lg:sticky lg:top-28"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Customer Details
            </h2>

            <p className="text-gray-600 dark:text-gray-300">
              <strong>Address:</strong> {orderDetails[0].Order.shippingAddress}
            </p>

            <p className="text-gray-600 dark:text-gray-300">
              <strong>Phone:</strong> {orderDetails[0].Order.phoneNumber}
            </p>

            {/* ⭐ Action Buttons */}
            <div className="flex flex-col space-y-3 pt-4">
              <button className="w-full py-2.5 rounded-xl border border-gray-300 
                dark:border-gray-600 text-gray-700 dark:text-gray-200 
                hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Edit Order
              </button>

              {orderDetails[0].Order.Payment.paymentStatus !== PaymentStatus.Paid && (
                <button className="w-full py-2.5 rounded-xl border border-yellow-500 text-yellow-700
                  hover:bg-yellow-100 dark:hover:bg-yellow-900 transition">
                  Cancel Order
                </button>
              )}

              <button
                onClick={() => handleDeleteOrder(orderDetails[0].Order.id)}
                className="w-full py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete Order
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default MyOrderDetails;
