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
    
    <button
  onClick={handleRedirect}
  className="bg-gray-300 p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 fixed top-24 left-3 z-50 rounded-full flex items-center"
>
  <i className="fa-solid fa-arrow-left text-lg"></i>
</button>

<div className="pt-24 bg-gray-100 dark:bg-gray-800 min-h-screen">
  <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
    
    <div className="flex flex-col md:flex-row gap-8">

      {/* LEFT SECTION */}
      <div className="md:w-1/2">
        
        {/* Image */}
        <div className="
          bg-gray-300 dark:bg-gray-700 
          rounded-2xl overflow-y-auto 
          max-h-[420px] sm:max-h-[480px] 
          flex items-center justify-center scroll-auto scrollbar-hide
        ">
          <img
            className="w-full h-full object-contain rounded-2xl hover:scale-102 duration-10"
            src={singleProduct?.imageUrl}
            alt="Product Image"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleAddToCart}
            className="
              flex-1 bg-blue-700 hover:bg-blue-800 
              dark:bg-blue-600 dark:hover:bg-blue-700 
              text-white py-2 px-4 rounded-full font-bold
            "
          >
            Add to Cart
          </button>

          <button
            className="
              flex-1 bg-gray-200 dark:bg-gray-700 
              text-gray-800 dark:text-white 
              py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600
            "
          >
            Add to Wishlist
          </button>
        </div>

      </div>

      {/* RIGHT SECTION */}
      <div className="md:flex-1 px-4 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {singleProduct?.productName}
        </h2>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* Price */}
          <div className="bg-green-100 dark:bg-green-800 px-4 py-2 rounded-lg shadow-md text-center">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Price: </span>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Rs.{singleProduct?.price}
            </span>
          </div>

          {/* Stock Qty */}
          <div className="bg-yellow-100 dark:bg-yellow-700 px-4 py-2 rounded-lg shadow-md text-center">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Stock: </span>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {singleProduct?.stockQty}
            </span>
          </div>
        </div>

        {/* ⭐ Category added here */}
        <p className="text-gray-700 dark:text-gray-300 text-lg mt-3">
          Category: <span className="font-semibold">{singleProduct?.Category?.categoryName}</span>
        </p>

        <ProductDescription description={singleProduct?.description || ""} />
      </div>

    </div>

  </div>
</div>

   </>

  )
}

export default SingleProduct