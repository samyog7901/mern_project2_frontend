import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import { fetchByProductId, fetchProducts } from "../../store/productSlice";
import { addToCart, setItems } from "../../store/cartSlice";
import ProductDescription from "./ProductDescription";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";

const SingleProduct = () => {

  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { singleProduct, product } = useAppSelector((state) => state.product);

  
  const { user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.carts.items);
  const [loading, setLoading] = useState(false);
  // const [items, setItems] = useState(singleProduct?.id)

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user || (token && token.trim() !== ""));

  // Calculate stock dynamically based on items already in cart
  const cartItem = cartItems.find(item => item.Product?.id === singleProduct?.id);
  const availableStock = singleProduct
    ? singleProduct.stockQty - (cartItem?.quantity || 0)
    : 0;
  

  // Fetch product data
  useEffect(() => {
    if (productId) dispatch(fetchByProductId(productId));
    dispatch(fetchProducts());
  }, [dispatch, productId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  
  const handleAddToCart = async () => {
    if (!isLoggedIn) return navigate("/login");
    if (!singleProduct) return toast.error("Product not found");
  
    // Find existing item in cart
    const existingCartItem = cartItems.find(item => item.Product?.id === singleProduct?.id);
    const availableStock = singleProduct.stockQty - (existingCartItem?.quantity || 0);
  
    if (availableStock <= 0) return toast.error("Out of stock");
  
    // // ✅ Make sure Product is fully typed and non-null
    // const newItem = {
    //   Product: singleProduct,
    //   quantity: (existingCartItem?.quantity || 0) + 1
    // };
    if (loading) return; // Prevent multiple clicks
    setLoading(true);
  
    try {
      // Wait for API first
      await dispatch(addToCart(singleProduct.id));
    
      // Update local Redux state after successful API call
      const existingCartItem = cartItems.find(item => item.Product?.id === singleProduct?.id);
      const newItem = {
        Product: singleProduct,
        quantity: (existingCartItem?.quantity || 0) + 1
      };
    
      dispatch(setItems([
        ...cartItems.filter(item => item.Product?.id !== singleProduct?.id),
        newItem
      ]));
    } catch (err) {
      toast.error("Failed to add to cart");
    }finally{
      setLoading(false)
    }
    
  };
  
  
  

  const handleBuyNow = () => {
    if (!isLoggedIn) return navigate("/login");
    if (!productId) return;
    navigate("/checkout");
  };

  const handleRedirect = () => {
    navigate("/", { state: { scrollTo: "featured-products" } });
  };

  const metaDescription = singleProduct?.description
    ? singleProduct.description.split("Highlights:")[0].trim().substring(0, 157) + "..."
    : "Explore this product on ShopNest!";

  const similarProducts = product
    ?.filter(
      (p) =>
        p.Category?.categoryName === singleProduct?.Category?.categoryName &&
        p.id !== productId
    )
    .slice(0, 8);

    if (!singleProduct) {
      return (
        <div className="pt-24 min-h-screen flex justify-center items-center text-gray-600 dark:text-gray-300">
          Loading product...
        </div>
      );
    }

  return (
    <>
      <Helmet>
        <title>{singleProduct?.productName} | ShopNest</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      {/* Go Back Button */}
      <button
        onClick={handleRedirect}
        className="bg-gray-300 p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 fixed top-24 left-3 z-50 rounded-full flex items-center sm:top-1"
      >
        <i className="fa-solid fa-arrow-left text-lg"></i>
      </button>

      <div className="pt-24 bg-gray-100 dark:bg-gray-800 min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 text-gray-600 dark:text-gray-300 pb-4 text-sm">
          Home /
          <span className="text-purple-500 ml-1">
            {singleProduct?.Category?.categoryName}
          </span>
          /
          <span className="text-gray-400 ml-1">{singleProduct?.productName}</span>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* LEFT IMAGE + ACTIONS */}
            <div className="md:w-1/2">
              <div className="bg-gray-300 dark:bg-gray-700 rounded-2xl overflow-y-auto shadow-lg max-h-[480px]">
                <img
                  className="w-full  object-contain rounded-2xl transition-transform duration-300 hover:scale-105"
                  src={singleProduct?.imageUrl}
                  alt={singleProduct?.productName}
                />
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleAddToCart}
                  className="w-1/2 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-full font-bold"
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-bold"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* RIGHT DETAILS */}
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                {singleProduct?.productName}
              </h2>

              <p className="text-purple-500 text-lg font-medium mb-3">
                Category: {singleProduct?.Category?.categoryName}
              </p>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  Rs. {singleProduct?.price}
                </div>
              </div>

              {/* STOCK */}
              <div className="bg-yellow-200 dark:bg-yellow-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-md w-fit mb-5">
                In Stock: <span className="font-bold">{availableStock}</span>
              </div>

              <ProductDescription description={singleProduct?.description || ""} />
            </div>
          </div>

          {/* SIMILAR PRODUCTS */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Similar Products
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {similarProducts?.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-xl transition p-3 cursor-pointer"
                >
                  <img
                    src={p.imageUrl}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="font-semibold mt-2 text-gray-800 dark:text-white">
                    {p.productName}
                  </p>
                  <p className="font-bold text-green-600">Rs. {p.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
