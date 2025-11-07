
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store/store'
import { Toaster } from 'react-hot-toast';
import Home from './pages/home/Home'
import Login from './pages/auth/login/Login'
import Register from './pages/auth/register/Register'
import DashBoard from './pages/dashboard/DashBoard'
import Profile from './pages/dashboard/Profile'
import SingleProduct from './pages/singleProduct/SingleProduct'
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/Checkout'
import MyOrders from './pages/orders/myOrders/MyOrders'
import MyOrderDetails from './pages/orders/myOrders/MyOrderDetails'
import PaymentVerify from './pages/payment/PaymentVerify'
import ProtectedRoute from './assets/globals/components/ProtectedRoute';
import {io} from 'socket.io-client'



export const socket = io("http://localhost:3000",{
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
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path='/dashboard' element={<DashBoard/>}/>
            <Route path ="/profile" element={<Profile/>}/>
            <Route path ="/product/:id" element={<SingleProduct/>}/>
            <Route path ="/cart/" element={<ProtectedRoute><Cart/></ProtectedRoute>} />
            <Route path='/checkout' element={<ProtectedRoute><Checkout/></ProtectedRoute>} />
            <Route path='/myorders' element={<ProtectedRoute><MyOrders/></ProtectedRoute>}/>
            <Route path='/myorders/:id' element={<ProtectedRoute><MyOrderDetails/></ProtectedRoute>}/>
            <Route path="/payment-verify" element={<ProtectedRoute><PaymentVerify /></ProtectedRoute>} />
        </Routes>
    </BrowserRouter>
   </Provider> 
   {/* Provider ko through bata store access garna sakxan children le*/ }

   </>
    
  )
}

export default App