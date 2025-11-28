import { Link, useNavigate } from "react-router-dom"
// import Navbar from "../../assets/globals/components/navbar/Navbar"
import { deleteCartItem, fetchCartItems, updateCartItem } from "../../store/cartSlice"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { useEffect, useState } from "react";


const Cart = () => {
    const { items } = useAppSelector((state) => state.carts);
    const cartItems = Array.isArray(items) ? items : [];
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      dispatch(fetchCartItems());
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    
        
    }, [dispatch]);
    if (loading) {
      return (
        <div className="py-10 px-4 space-y-6">
          <p className="text-lg font-medium text-gray-500 mb-4">Loading your cart...</p>
          
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg animate-pulse"
            >
              {/* Image placeholder */}
              <div className="w-full sm:w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4 sm:mb-0"></div>
  
              {/* Details placeholder */}
              <div className="flex-1 sm:ml-4 w-full space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
  
              {/* Price placeholder */}
              <div className="mt-4 sm:mt-0 w-16 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    const handleDelete = (productId:string)=>{
        dispatch(deleteCartItem(productId))
    }
    const handleUpdate = (productId:string,quantity:number)=>{
        dispatch(updateCartItem(productId,quantity))
    }
    const handleRedirect = () => {
        navigate("/", { state: { scrollTo: "featured-products" } });
    }

  
      


    const totalItemInCarts = cartItems.reduce((total,item)=>item?.quantity + total,0)
    const totalPriceInCarts = cartItems.reduce((total,item)=>item?.quantity * item?.Product?.price + total,0)
  return (
    <>
   
    {/* <Navbar />      */}
    
    <div className="h-auto bg-gray-100 pt-20 mt-15">
        {cartItems.length !== 0 ? (
        <>
        <button onClick={handleRedirect} className="bg-gray-300 p-1 ml-2 shadow-blue-300 hover:shadow-blue-500 shadow-xl transition-transform duration-300 hover:scale-105 top-30 left-5 fixed">add more items</button>
          <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 overflow-y-auto scroll-auto max-h-135">
            <div className="rounded-lg md:w-2/3 overflow-y-auto custom-scrollbar scroll-smooth scrollbar-hide max-h-145">
            {cartItems.length > 0 &&
  cartItems.map((item, index) => (
    <div
      key={item?.Product?.id ?? `cart-item-${index}`}
      className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
    >
      <img
        src={item?.Product?.imageUrl}
        alt={item?.Product?.productName ?? "product"}
        className="h-[100px]"
      />
      <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
        <div className="mt-5 sm:mt-0">
          <h2 className="text-lg font-bold text-gray-900">
            {item?.Product?.productName}
          </h2>
        </div>
        <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
          <div className="flex items-center border-gray-100">
            <span
              className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
              onClick={() => {
                if (item.quantity > 1)
                  handleUpdate(item.Product.id, item.quantity - 1);
              }}
            >
              -
            </span>
            <input
              className="h-8 w-8 border bg-white text-center text-xs outline-none"
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleUpdate(item.Product.id, Number(e.target.value))
              }
              min={1}
            />
            <span
              className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
              onClick={() =>
                handleUpdate(item.Product.id, item.quantity + 1)
              }
            >
              +
            </span>
          </div>
          <div className="flex items-center justify-end">
            <p className="text-sm mx-5">Rs.{item?.Product?.price}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              onClick={() => handleDelete(item.Product.id)}
              className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  ))}

           
            
            </div>
            {/* Sub total */}
            <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3 mb-2">
            <div className="mb-2 flex justify-between">
                <p className="text-gray-700">Total Items</p>
                <p className="text-gray-700">{totalItemInCarts}</p>
            </div>
            <div className="mb-2 flex justify-between">
                <p className="text-gray-700">Subtotal</p>
                <p className="text-gray-700">Rs.{totalPriceInCarts}</p>
            </div>
            <div className="flex justify-between">
                <p className="text-gray-700">Shipping</p>
                <p className="text-gray-700">Rs.100</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
                <p className="text-lg font-bold">Total</p>
                <div>
                <p className="mb-1 text-lg font-bold">Rs.{totalPriceInCarts + 100}</p>
                <p className="text-sm text-gray-700">including VAT</p>
                </div>
            </div>
            <Link to="/checkout"><button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">Check out</button></Link>
            </div>
        </div>
        </>
        ):(
            <div className="flex flex-col items-center gap-y-20">
                <h1 className="text-center text-3xl text-fuchsia-900 relative top-10 h-1">My Shopping Cart</h1>
                <p className="relative top-20 text-center text-fuchsia-900 ">your cart is currently empty.</p>
                <p onClick={handleRedirect} className="w-40 text-center hover:text-fuchsia-900 mb-2  hover:cursor-pointer transition-transform duration-300 hover:scale-105 mt-3">Continue shopping</p>
            </div>
        )}
    </div>
    </>

  )
}

export default Cart