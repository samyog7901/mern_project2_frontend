
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store/store'
import { Toaster } from 'react-hot-toast';
import Home from './pages/home/Home'
import Login from './pages/auth/login/Login'
import Register from './pages/auth/register/Register'
// import DashBoard from './pages/dashboard/DashBoard'
// import Profile from './pages/dashboard/Profile'
import SingleProduct from './pages/singleProduct/SingleProduct'
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/Checkout'
import MyOrders from './pages/orders/myOrders/MyOrders'
import MyOrderDetails from './pages/orders/myOrders/MyOrderDetails'
import PaymentVerify from './pages/payment/paymentVerify'

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
            {/* <Route path='/dashboard' element={<DashBoard/>}/>
            <Route path ="/profile" element={<Profile/>}/> */}
            <Route path ="/product/:id" element={<SingleProduct/>}/>
            <Route path ="/cart/" element={<Cart/>} />
            <Route path='/checkout' element={<Checkout/>} />
            <Route path='/myorders' element={<MyOrders/>}/>
            <Route path='/myorders/:id' element={<MyOrderDetails/>}/>
            <Route path="/payment-verify" element={<PaymentVerify />} />
        </Routes>
    </BrowserRouter>
   </Provider> 
   {/* Provider ko through bata store access garna sakxan children le*/ }

   </>
    
  )
}

export default App