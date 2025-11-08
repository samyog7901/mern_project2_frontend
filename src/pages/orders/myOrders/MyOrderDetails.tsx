import { useEffect } from "react";
import Navbar from "../../../assets/globals/components/navbar/Navbar";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { deleteOrderById, fetchMyOrderDetails, updateOrderDetailsStatusInStore, updatePaymentStatusInStore } from "../../../store/checkoutSlice";
import { useNavigate, useParams } from "react-router-dom";
import { OrderStatus, PaymentStatus } from "../../../assets/globals/types/checkoutTypes";
import { socket } from "../../../App";

const MyOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const { orderDetails } = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();

  // @ts-ignore
  useEffect(() => {
    if (id) dispatch(fetchMyOrderDetails(id));
  }, [id])
  

  const handleDeleteOrder = (orderId:string)=>{
    dispatch(deleteOrderById(orderId))
    navigate("/myOrders")
  }

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
    all : OrderStatus.All,
  };

  useEffect(() => {
    //@ts-ignore
    const handler = ({ type, status, orderId }) => {
      if (type === "ORDER_STATUS") {
        dispatch(updateOrderDetailsStatusInStore({ orderId, status }));
      }
      if (type === "PAYMENT_STATUS") {
        dispatch(updatePaymentStatusInStore({ orderId, status }));
      }
    };
  
    socket.on("statusUpdated", handler);
  
    return () => {
      socket.off("statusUpdated", handler);
    };
  }, []);
  
  

  return (
    <>
      <Navbar />
      <div className="py-20 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
        {/* ---------- Header ---------- */}
        <div className="flex flex-col space-y-2 my-2">
          <h1 className="text-2xl font-semibold text-gray-700">
            Order Details
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400">
            {orderDetails[0]?.createdAt
              ? new Date(orderDetails[0].createdAt).toLocaleDateString()
              : ""}
          </p>
        </div>

        {/* ---------- Main Layout ---------- */}
        <div className="mt-10 flex flex-col xl:flex-row justify-between items-start w-full xl:space-x-8 space-y-8 xl:space-y-0">
          
          {/* ---------- Left Section: Scrollable Order Details + Summary ---------- */}
          <div className="flex flex-col w-full space-y-6 xl:max-h-[80vh] xl:overflow-y-auto pr-2 scrollbar-hide">


            {/* ---------- Order Items ---------- */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm flex flex-col w-full space-y-6 xl:max-h-[39vh] xl:overflow-y-auto pr-2 scrollbar-hide">
              <p className="text-lg md:text-xl dark:text-white font-semibold mb-4">
                My Order
              </p>

              {orderDetails.length > 0 &&
                orderDetails.map((order) => (
                  <div
                    key={order.Order.id}
                    className="flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 border-b border-gray-200 pb-6 mb-4"
                  >
                    <div className="w-full md:w-36">
                      <img
                        className="w-full rounded-lg object-cover"
                        src={order.Product?.imageUrl}
                        alt={order.Product?.productName}
                      />
                    </div>
                    <div className="flex md:flex-row justify-between items-baseline-last w-full md:items-center mt-4 md:mt-0 space-y-2 md:space-y-0 ">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {order.Product?.productName}
                      </h3>
                      <div className="flex justify-between md:justify-end space-x-6 w-full md:w-auto">
                        <p className="text-gray-700 dark:text-gray-300">
                          Rs.{order.Product?.price}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          Qty: {order.quantity}
                        </p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          Rs.{order.Product?.price * order.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* ---------- Order Summary ---------- */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Order Summary
              </h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <p>Payment Method</p>
                  <p>{orderDetails?.[0]?.Order?.Payment?.paymentMethod}</p>
                </div>
                <div className="flex justify-between">
                  <p>Payment Status</p>
                  <p>
                    {paymentMap[orderDetails?.[0]?.Order?.Payment?.paymentStatus || "pending"]}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Order Status</p>
                  <p>{orderMap[orderDetails?.[0]?.Order?.orderStatus || "pending"]}</p>
                </div>
                <hr className="my-2 border-gray-300" />
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>Rs. {orderDetails?.[0]?.Order?.totalAmount - 100}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping (24-hour delivery)</p>
                  <p>Rs. 100</p>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2">
                  <p>Total</p>
                  <p>Rs. {orderDetails?.[0]?.Order?.totalAmount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Right Section: Sticky Customer Details ---------- */}
          <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 p-6 rounded-xl shadow-sm flex flex-col justify-between space-y-6 xl:sticky xl:top-24">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Customer Details
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Address:</strong>{" "}
                {orderDetails?.[0]?.Order?.shippingAddress}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Phone:</strong> {orderDetails?.[0]?.Order?.phoneNumber}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button className="border border-gray-800 dark:border-gray-300 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-900 text-gray-800 dark:text-white transition">
                Edit Order
              </button>

              {orderDetails?.[0]?.Order.Payment.paymentStatus !== PaymentStatus.Paid && (
                <button className="border border-yellow-500 text-yellow-700 py-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900 dark:text-yellow-400 transition">
                Cancel Order
              </button>
              )}

              <button onClick={()=>handleDeleteOrder(orderDetails?.[0]?.Order.id)} className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                Delete Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrderDetails;
