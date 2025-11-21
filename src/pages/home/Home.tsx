import { useEffect, useState } from "react";
import Card from "../../assets/globals/components/card/Card";
import Footer from "../../assets/globals/components/footer/Footer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/productSlice";
import { Link, useLocation } from "react-router-dom";
import { fetchCategories } from "../../store/categorySlice";
import CategoryDropdown from "../../assets/globals/components/CategoryDropDown";

const Home = () => {
  const { user } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user || (token && token.trim() !== ""));
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((state) => state.product);
  const [searchTerm,setSearchTerm] = useState<string>('')
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredProducts, setFilteredProducts] = useState(product);


  // Extract unique categories from products


  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories())
  
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [location]);

  useEffect(() => {
    if (selectedCategory === "All") setFilteredProducts(product);
    else
      setFilteredProducts(
        product.filter((p) => p.Category.categoryName === selectedCategory)
      );
  }, [selectedCategory, product]);

  const scrollToFeaturedProducts = () => {
    const el = document.getElementById("featured-products");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

// COMBINED FILTER: Category + Search
const finalProducts = product
  // 1. Category filter
  .filter((p) =>
    selectedCategory === "All"
      ? true
      : p.Category.categoryName === selectedCategory
  )
  // 2. Search filter
  .filter((p) => {
    const s = searchTerm.toLowerCase();
    if (!s) return true;

    return (
      p.id.toString().toLowerCase().includes(s) ||
      p.productName.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      p.price.toString().includes(s) ||
      p.Category.categoryName.toLowerCase().includes(s)
    );
  }); 

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex items-center justify-center min-h-[90vh] bg-gradient-to-tr from-purple-100 via-white to-teal-100 pt-40 px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl w-full text-center space-y-8">
            {isLoggedIn ? (
              <>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
                  Welcome to <span className="text-purple-600">ShopNest</span>
                </h1>
                <p
                  className="text-gray-600 text-lg md:text-xl hover:underline hover:cursor-pointer"
                  onClick={scrollToFeaturedProducts}
                >
                  Discover the best products at unbeatable prices. Fast shipping. Easy returns.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
                  Welcome to <span className="text-purple-600">ShopNest!</span>
                </h1>
                <p
                  className="text-gray-600 text-lg md:text-xl hover:underline hover:cursor-pointer"
                  onClick={scrollToFeaturedProducts}
                >
                  Discover the best products at unbeatable prices. Fast shipping. Easy returns.
                </p>

                <div className="flex justify-center gap-4 flex-wrap">
                  <Link to="/login">
                    <button className="px-6 py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-md transition">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-6 py-3 text-lg bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 rounded-2xl shadow-md transition">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </>
            )}

            <img
              src="https://media.istockphoto.com/id/2190128714/photo/young-woman-preparing-shipping-boxes-is-talking-on-the-phone.webp?a=1&b=1&s=612x612&w=0&k=20&c=o4DxNImQUTqN99dRVila3bJ3NywBb-_oPyH9MalYm9A="
              alt="E-commerce illustration"
              className="w-full max-w-[250px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[550px] mx-auto mt-10 rounded-xl shadow-lg hover:transition-transform hover:scale-105 duration-500"
            />
          </div>
        </section>

        {/* Featured Products Section with Filter */}
        <section className="w-full bg-white py-20 px-4 sm:px-8" id="featured-products">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Mobile Sidebar Toggle */}
            <div className="flex justify-between items-center lg:hidden mb-4">
              <h3 className="font-bold text-gray-800 dark:text-white">Filter by Category</h3>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                {sidebarOpen ? "Hide" : "Show"}
              </button>
            </div>

            {/* Sidebar */}
            <aside
              className={`w-full lg:w-1/5 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md h-fit mb-6 lg:mb-0 transition-all duration-300 ${
                sidebarOpen ? "block" : "hidden lg:block"
              }`}
            >
              <CategoryDropdown selected={selectedCategory} onSelect={setSelectedCategory} />
            </aside>

            {/* Products + Search */}
            <div className="flex-1 flex flex-col gap-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">Featured Products</h2>

              {/* Search Bar */}
              <div className="flex justify-center mb-6">
                <div className="w-full sm:w-3/4 md:w-1/2 relative">
                  <span className="h-full absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                      <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search your findings.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-full border border-gray-400 block pl-10 pr-4 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
                {finalProducts.length > 0 ? (
                  finalProducts.map((pd) => <Card key={pd.id} data={pd} />)
                ) : (
                  <p className="text-gray-500 col-span-full text-center">No products found.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Footer />
        </div>
      </footer>
    </>
  );
};

export default Home;
