
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store/store'
import Home from './pages/home/Home'
import Login from './pages/auth/login/Login'
import Register from './pages/auth/register/Register'
import DashBoard from './pages/dashboard/DashBoard'
import Profile from './pages/dashboard/Profile'
import SingleProduct from './pages/singleProduct/SingleProduct'
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/Checkout'

const App = () => {
  return (
   <>
   <Provider store={store}>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            {/* <Route path='/dashboard' element={<DashBoard/>}/>
            <Route path ="/profile" element={<Profile/>}/> */}
            <Route path ="/product/:id" element={<SingleProduct/>}/>
            <Route path ="/cart/" element={<Cart/>} />
            <Route path='/checkout' element={<Checkout/>} />
        </Routes>
    </BrowserRouter>
   </Provider> 
   {/* Provider ko through bata store access garna sakxan children le*/ }

   </>
    
  )
}

export default App