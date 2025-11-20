// import { useEffect, useState, type JSX } from "react";
// import Navbar from "../../assets/globals/components/navbar/Navbar";
// import {
//   FaShoppingCart,
//   FaShippingFast,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaHeadset,
//   FaHeart,
// } from "react-icons/fa";

// const UserDashboard = () => {
//   const [userName, setUserName] = useState("Guest");

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (user?.name) setUserName(user.name);
//   }, []);

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-[#fffaf0] to-[#f3f4f6] text-gray-800">
//         {/* Header */}
//         <div className="mb-10">
//           <Navbar />
//         </div>

//         {/* Dashboard Content */}
//         <div className="p-6 sm:p-10 bg-gray-100 min-h-screen">
  

//           {/* Overview Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-110">
//             <OverviewCard
//               icon={<FaShoppingCart className="text-indigo-600 text-4xl" />}
//               title="Total Orders"
//               count={42}
//             />
//             <OverviewCard
//               icon={<FaShippingFast className="text-yellow-500 text-4xl" />}
//               title="In Transit"
//               count={8}
//             />
//             <OverviewCard
//               icon={<FaCheckCircle className="text-green-500 text-4xl" />}
//               title="Delivered"
//               count={30}
//             />
//             <OverviewCard
//               icon={<FaTimesCircle className="text-red-500 text-4xl" />}
//               title="Cancelled Orders"
//               count={4}
//             />
//             <OverviewCard
//               icon={<FaHeadset className="text-blue-500 text-4xl" />}
//               title="Support Tickets"
//               count={2}
//             />
//             <OverviewCard
//               icon={<FaHeart className="text-pink-500 text-4xl" />}
//               title="Wishlist Items"
//               count={10}
//             />
//           </div>
//            {/* Footer */}
//         <footer className="mt-16 text-center text-sm text-gray-600 py-10 border-t border-gray-300">
//           <p>© 2025 ShopNest. Built with ❤️ to power your shopping experience.</p>
//         </footer>
//         </div>

       
//       </div>
//     </>
//   );
// };

// // OverviewCard component
// const OverviewCard = ({
//   icon,
//   title,
//   count,
// }: {
//   icon: JSX.Element;
//   title: string;
//   count: number;
// }) => (
//   <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 flex items-center space-x-4">
//     <div>{icon}</div>
//     <div>
//       <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
//       <p className="text-2xl font-bold text-gray-900">{count}</p>
//     </div>
//   </div>
// );

// export default UserDashboard;
