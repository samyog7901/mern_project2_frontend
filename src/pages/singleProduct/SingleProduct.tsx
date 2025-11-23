import { useNavigate, useParams } from "react-router-dom"
// import Navbar from "../../assets/globals/components/navbar/Navbar"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { useEffect } from "react"
import { fetchByProductId } from "../../store/productSlice"
import { addToCart } from "../../store/cartSlice"
import ProductDescription from "./ProductDescription"
import { Helmet } from "react-helmet"


const SingleProduct = () => {
  const {id} = useParams()
  const {user} = useAppSelector((state)=>state.auth)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {singleProduct} = useAppSelector((state)=>state.product)
  useEffect(()=>{
    if(id){
      dispatch(fetchByProductId(id))
    }
  },[dispatch,id])
  const handleAddToCart = async ()=>{
    if(id && isLoggedIn){
      await dispatch(addToCart(id))
    }else{
      navigate("/login")
    }
  }
  const handleRedirect = () => {
    navigate("/", { state: { scrollTo: "featured-products" } });
}
  const token = localStorage.getItem("token")
  const isLoggedIn = Boolean(user || (token && token.trim() !== ""));

  const metaDescription = singleProduct?.description
    ? singleProduct.description.split("Highlights:")[0].trim().substring(0, 157) + "..."
    : "Explore this product on ShopNest!";
  return (
   <>
   {/* Helmet for SEO */}
    <Helmet>
      <title>{singleProduct?.productName} | ShopNest</title>
      <meta name="description" content={metaDescription} />
    </Helmet>
    
    <button onClick={handleRedirect} className="bg-gray-300 p-1 ml-2 shadow-blue-300 hover:shadow-blue-500 shadow-xl transition-transform duration-300 hover:scale-105 top-30 left-5 fixed">
      <i className="fa-solid fa-arrow-left text-lg"></i>
      <span className="font-medium ml-2">Go Back</span>
    </button>
    <div className="pt-20 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4">
         <div className="md:flex-1 px-4">
            <div
              className="bg-gray-300 dark:bg-gray-700 mb-4 rounded-2xl overflow-y-auto custom-scrollbar scrollbar-hide  hover:transition-transform duration-300 "
              style={{ maxHeight: '530px' }}
            >
              <img
                className="w-full object-contain rounded-2xl hover:scale-102 duration-10"
                src={singleProduct?.imageUrl}
                alt="Product Image"
              />
            </div>

            <div className="flex -mx-2 mb-4">
              <div className="w-1/2 px-2">
                <button onClick={handleAddToCart} className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white py-2 px-4 rounded-full font-bold dark:hover:bg-blue-700">Add to Cart</button>
              </div>
              <div className="w-1/2 px-2">
                <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600">Add to Wishlist</button>
              </div>
            </div>
          </div>
          <div className="md:flex-1 px-4 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{singleProduct?.productName}</h2>
            {/* <p className="text-white text-xl">{singleProduct?.Category?.categoryname}</p> */}
          
           
            {/* <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">Select Color:</span>
              <div className="flex items-center mt-2">
                <button className="w-6 h-6 rounded-full bg-gray-800 dark:bg-gray-200 mr-2" />
                <button className="w-6 h-6 rounded-full bg-red-500 dark:bg-red-700 mr-2" />
                <button className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-700 mr-2" />
                <button className="w-6 h-6 rounded-full bg-yellow-500 dark:bg-yellow-700 mr-2" />
              </div>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 dark:text-gray-300">Select Size:</span>
              <div className="flex items-center mt-2">
                <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">S</button>
                <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">M</button>
                <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">L</button>
                <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">XL</button>
                <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">XXL</button>
              </div>
            </div> */}
            <ProductDescription description={singleProduct?.description || ""} />
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
  {/* Price */}
  <div className="bg-green-100 dark:bg-green-800 px-4 py-2 rounded-lg shadow-md">
    <span className="font-semibold text-gray-700 dark:text-gray-200">Price: </span>
    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
      Rs.{singleProduct?.price}
    </span>
  </div>

  {/* Stock Qty */}
  <div className="bg-yellow-100 dark:bg-yellow-700 px-4 py-2 rounded-lg shadow-md">
    <span className="font-semibold text-gray-700 dark:text-gray-200">Stock: </span>
    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
      {singleProduct?.stockQty}
    </span>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
   </>

  )
}

export default SingleProduct