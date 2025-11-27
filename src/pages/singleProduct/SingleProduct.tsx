import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import { fetchByProductId, fetchProducts } from "../../store/productSlice";
import { addToCart } from "../../store/cartSlice";
import ProductDescription from "./ProductDescription";
import { Helmet } from "react-helmet";

const SingleProduct = () => {
  // 1️⃣ Tell TS that id is string
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { singleProduct, product } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.auth);

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user || (token && token.trim() !== ""));

  const [currentStock, setCurrentStock] = useState(singleProduct?.stockQty || 0);

  // Fetch product data
  useEffect(() => {
    if (productId) {
      dispatch(fetchByProductId(productId));
    }
    dispatch(fetchProducts());
  }, [dispatch, productId]);

  useEffect(() => {
    setCurrentStock(singleProduct?.stockQty || 0);
  }, [singleProduct]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (currentStock <= 0) {
      alert("Product is out of stock");
      return;
    }

    if (!productId) return; // safeguard

    try {
      setCurrentStock((prev) => prev - 1); // optimistic update
      await dispatch(addToCart(productId));
    } catch (err) {
      console.error(err);
      setCurrentStock((prev) => prev + 1); // revert if error
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) return navigate("/login");
    if (!productId) return;
    navigate(`/checkout/${productId}`);
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

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;

    return (
      <div className="flex items-center space-x-1">
        {[...Array(full)].map((_, i) => (
          <i key={i} className="fa-solid fa-star text-yellow-400"></i>
        ))}
        {half && <i className="fa-solid fa-star-half-stroke text-yellow-400"></i>}
        {[...Array(5 - full - (half ? 1 : 0))].map((_, i) => (
          <i key={i} className="fa-regular fa-star text-gray-400"></i>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{singleProduct?.productName} | ShopNest</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      {/* Go Back Button */}
      <button onClick={handleRedirect} className="bg-gray-300 p-1 ml-2 shadow-blue-300 hover:shadow-blue-500 shadow-xl transition-transform duration-300 hover:scale-105 fixed top-24 left-5 z-50" > <i className="fa-solid fa-arrow-left text-lg"></i> <span className="font-medium ml-2">Go Back</span> </button>

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
              <div className="bg-gray-300 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg">
                <img
                  className="w-full object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
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
                In Stock: <span className="font-bold">{currentStock}</span>
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
