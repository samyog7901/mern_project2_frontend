// src/AnimatedRoutes.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Home from "../../../pages/home/Home";
import MyOrders from "../../../pages/orders/myOrders/MyOrders";
import MyOrderDetails from "../../../pages/orders/myOrders/MyOrderDetails";
import Checkout from "../../../pages/checkout/Checkout";
import Cart from "../../../pages/cart/Cart";
import SingleProduct from "../../../pages/singleProduct/SingleProduct";
import Login from "../../../pages/auth/login/Login";
import Navbar from "./navbar/Navbar";
import ProtectedRoute from "./ProtectedRoute";
import LoginProtectedRoute from "../../../pages/auth/login/LoginProtectedRoute"
import Register from "../../../pages/auth/register/Register";



const pageVariants:Variants = {
  initial: { opacity: 0, scale: 0.8 },
  in: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  out: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      <Navbar/>
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="min-h-screen"
            >
              <Home/>
            </motion.div>
          }
        />
        <Route
          path="/myOrders"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="min-h-screen"
            >
              <ProtectedRoute><MyOrders/></ProtectedRoute>
            </motion.div>
          }
        />
        <Route
          path='/myorders/:id'
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="min-h-screen w-max"
            >
              <ProtectedRoute><MyOrderDetails/></ProtectedRoute>
            </motion.div>
          }
        />
        <Route
          path="/checkout"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="min-h-screen"
            >
              <ProtectedRoute><Checkout/></ProtectedRoute>
            </motion.div>
          }
        />

<Route
          path="/cart"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="min-h-screen"
            >
              <ProtectedRoute><Cart/></ProtectedRoute>
            </motion.div>
          }
        />

<Route
          path ="/product/:id"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="min-h-screen"
            >
              <SingleProduct />
            </motion.div>
          }
        />
        <Route
          path ="/login"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="min-h-screen"
            >
              <LoginProtectedRoute><Login /></LoginProtectedRoute>
            </motion.div>
          }
        />

<Route
          path ="/register"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="min-h-screen"
            >
              <LoginProtectedRoute><Register /></LoginProtectedRoute>
            </motion.div>
          }
        />
     
      </Routes>
    </AnimatePresence>
    </div>
  );
}
