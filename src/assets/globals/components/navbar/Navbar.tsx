import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { logout } from "../../../../store/authSlice";
import { fetchCartItems } from "../../../../store/cartSlice";
import { ChevronDown } from "lucide-react";
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

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const [selectedCategory, setSelectedCategory] = useState("All");

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

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md fixed top-0 z-[100000] h-16">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-4 sm:px-6 h-full">

        {/* ------------------ LEFT : LOGO ------------------ */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 text-white">
            <svg
              className="h-7 w-7 text-green-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 3a1 1 ..." />
            </svg>
            <span className="text-xl font-bold tracking-wide">ShopNest</span>
          </Link>
        </div>

        {/* ------------------ CENTER : AMAZON SEARCH BAR ------------------ */}
       {!isauthPage && (
         <div className="flex justify-center">
         <div
           className="
             relative w-full max-w-xl 
             transition-all duration-300 ease-out 
             focus-within:max-w-2xl 
             focus-within:shadow-xl
           "
         >
           {/* Search Bar Box */}
           <div className="flex bg-white rounded-md ">

             {/* -------- Category Dropdown Inside Search Bar -------- */}
             <div className="relative group">
               {/* <button
                 className="
                   px-3 h-full bg-gray-100 text-gray-700 text-sm 
                   border-r border-gray-300 flex items-center gap-1
                 "
               >
                 {selectedCategory}
                 <ChevronDown className="w-4 h-4" />
               </button> */}

               <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-[99999]">
                 <CategoryDropdown
                   selected={selectedCategory}
                   onSelect={setSelectedCategory}
                 />
               </div>
             </div>

             {/* --------- Search Input --------- */}
             <input
               type="text"
               placeholder="Search products..."
               className="
                 w-full px-4 py-2 outline-none 
                 transition-all duration-300
                 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500
               "
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />

             {/* --------- Search Button --------- */}
             <button
               className="
                 px-4 bg-yellow-400 hover:bg-yellow-500 
                 text-black font-medium transition-colors duration-200
               "
             >
               <i className="fas fa-search"></i>
             </button>
           </div>
         </div>
       </div>
       )}

        {/* ------------------ RIGHT : CART + MENU ------------------ */}
        <div className="flex items-center justify-end space-x-10 text-white">

          {!isauthPage && isLoggedIn ? (
            <>
              <Link to="/cart" className="relative text-gray-100 hover:text-white">
                <i className="fas fa-shopping-cart"></i>
                <p className="text-white text-sm">Cart</p>
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {items?.length}
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
            <div className="space-x-4 text-sm font-medium">
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
