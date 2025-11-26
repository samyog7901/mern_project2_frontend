
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store/store'
import { Toaster } from 'react-hot-toast';
// import Home from './pages/home/Home'
// import Login from './pages/auth/login/Login'
// import Register from './pages/auth/register/Register'
// import DashBoard from './pages/dashboard/DashBoard'
// import Profile from './pages/dashboard/Profile'
// import SingleProduct from './pages/singleProduct/SingleProduct'
// import Cart from './pages/cart/Cart'
// import Checkout from './pages/checkout/Checkout'
// import MyOrders from './pages/orders/myOrders/MyOrders'
// import MyOrderDetails from './pages/orders/myOrders/MyOrderDetails'
import PaymentVerify from './pages/payment/PaymentVerify'
import ProtectedRoute from './assets/globals/components/ProtectedRoute';
import {io} from 'socket.io-client'
import AnimatedRoutes from './assets/globals/components/AnimatedRoutes.tsx';
// import Navbar from './assets/globals/components/navbar/Navbar.tsx';
// import Register from './pages/auth/register/Register.tsx';
// import LoginProtectedRoute from './pages/auth/login/LoginProtectedRoute.tsx';

// import LoginProtectedRoute from './pages/auth/login/LoginProtectedRoute';




export const socket = io("https://ecommerce-platform-2sjj.onrender.com/",{
  auth : {
    token : localStorage.getItem('token')
  }
})


const App = () => {
  return (
   <>
   <Provider store={store}>
    <BrowserRouter>
        <Toaster position='top-center' reverseOrder={false}/>
        {/* <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path='/dashboard' element={<DashBoard/>}/>
            <Route path ="/profile" element={<Profile/>}/>
            <Route path ="/product/:id" element={<SingleProduct/>}/>
            
            <Route path='/checkout' element={<ProtectedRoute><Checkout/></ProtectedRoute>} />
            <Route path='/myorders' element={<ProtectedRoute><MyOrders/></ProtectedRoute>}/>
            <Route path='/myorders/:id' element={<ProtectedRoute><MyOrderDetails/></ProtectedRoute>}/>
            <Route path="/payment-verify" element={<ProtectedRoute><PaymentVerify /></ProtectedRoute>} />
          
        </Routes> */}
      
      {/* <header className="fixed top-0 left-0 w-full z-10000 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <Navbar /> 
        
      </header> */}
    
     

  
      
      <AnimatedRoutes />
    
    </BrowserRouter>
   </Provider> 
   {/* Provider ko through bata store access garna sakxan children le*/ }

   </>
    
  )
}

export default App