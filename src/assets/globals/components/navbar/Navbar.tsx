import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { logout } from "../../../../store/authSlice";
import { fetchCartItems } from "../../../../store/cartSlice";
import CategoryDropdown from "../CategoryDropDown";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isProfile = location.pathname === "/profile";
  const isauthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.carts);

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user || (token && token.trim() !== ""));
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(
      `/?search=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(
        selectedCategory
      )}`
    );
  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md fixed top-0 z-[100000] h-16">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-4 sm:px-6 h-full">

        {/* ------------------ LEFT : LOGO ------------------ */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 text-white">
            {/* Dummy Logo */}
            <svg
              className="h-7 w-7 text-green-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-xl font-bold tracking-wide">ShopNest</span>
          </Link>
        </div>

        {/* ------------------ CENTER : SEARCH BAR ------------------ */}
        {!isauthPage && (
          <div className="flex justify-center">
            <div className="relative w-full max-w-xl">
              <div className="flex bg-white rounded-md overflow-hidden shadow-sm">
                {/* Category Selector */}
                <CategoryDropdown
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                  className="w-36 px-3 border-r border-gray-300"
                />

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="px-4 bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                >
                  🔍
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------ RIGHT : CART / LOGIN / MENU ------------------ */}
        <div
          className={`flex items-center space-x-6 text-white ${
            isauthPage ? "justify-end" : "justify-end"
          }`}
        >
          {!isauthPage && isLoggedIn ? (
            <>
              {/* Cart */}
              <Link
                to="/cart"
                className="relative text-gray-100 hover:text-white flex flex-col items-center"
              >
                <i className="fas fa-shopping-cart text-xl"></i>
                <span className="text-xs">Cart</span>
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {items?.length || 0}
                </span>
              </Link>

              {/* Hamburger Menu */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white text-xl"
                >
                  ☰
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 text-sm z-[10000]">
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Home
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Wishlist
                    </Link>
                    <Link
                      to="/myOrders"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Track Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex space-x-4 text-sm font-medium">
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-200">
                Register
              </Link>
            </div>
          )}

          {isDashboard && !isProfile && (
            <span className="text-2xl">Welcome {user?.username ?? "Guest"}!</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
