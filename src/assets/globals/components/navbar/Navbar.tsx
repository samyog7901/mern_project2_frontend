import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { logout } from "../../../../store/authSlice";
import { fetchCartItems } from "../../../../store/cartSlice";
import CategoryDropdown from "../CategoryDropDown";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.carts);

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user || (token && token.trim() !== ""));
  const isHome = location.pathname === "/";

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const initialCategory = queryParams.get("category") || "All";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  // CLOSE MENU ON ROUTE CHANGE
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // CLOSE MENU WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMenuOpen(false);
  };

  // SYNC SEARCH STATE WITH URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
    setSelectedCategory(params.get("category") || "All");
  }, [location.search]);

  const handleSearch = () => {
    navigate(
      `/?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}`
    );
  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md fixed top-0 z-[1000] h-16">
      <div
        className={`max-w-7xl mx-auto grid ${
          isHome ? "grid-cols-3" : "grid-cols-2"
        } items-center px-4 sm:px-6 h-full gap-2`}
      >
        {/* LOGO */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 text-white">
            <svg
              className="h-7 w-7 text-green-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 3a1 1 0 000 2h1.22l.94 4.68A3 3 0 008.08 12h7.84a3 3 0 002.92-2.32l1.16-5.32A1 1 0 0019 3H6.21l-.2-1H3zm5.08 7L7.2 5h10.6l-.93 4.27A1 1 0 0115.92 10H8.08zM7 16a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span className="text-xl font-bold tracking-wide">ShopNest</span>
          </Link>
        </div>

        {/* SEARCH BAR (RESPONSIVE) */}
        {isHome && (
          <div className="flex justify-center w-full">
            <div className="relative w-full max-w-xl transition-all duration-300 focus-within:max-w-2xl">
              <div className="flex bg-white rounded-md overflow-hidden">

                {/* CATEGORY DROPDOWN */}
                <div className="relative min-w-[110px] sm:min-w-[140px]">
                  <CategoryDropdown
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                </div>

                {/* SEARCH INPUT */}
                <form
                  className="flex flex-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 outline-none text-sm sm:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-4 bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* CART + MENU ICON (RESPONSIVE) */}
        <div className="flex items-center justify-end space-x-5 sm:space-x-10 text-white">

          {isLoggedIn ? (
            <>
              {/* CART */}
              <Link to="/cart" className="relative text-gray-100 hover:text-white">
                <i className="fas fa-shopping-cart text-lg"></i>
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {items?.length}
                </span>
              </Link>

              {/* MOBILE & DESKTOP MENU */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white text-2xl sm:text-xl"
                >
                  ☰
                </button>

                {/* MENU LIST */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-md shadow-lg py-2 text-sm z-[10000] animate-fadeIn">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Home</Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                    <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Wishlist</Link>
                    <Link to="/myOrders" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Orders</Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-x-4 text-xs sm:text-sm font-medium">
              <Link to="/login" className="hover:text-gray-200">Login</Link>
              <Link to="/register" className="hover:text-gray-200">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
