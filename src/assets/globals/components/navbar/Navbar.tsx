import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { logout } from "../../../../store/authSlice";
import { fetchCartItems } from "../../../../store/cartSlice";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isProfile = location.pathname === "/profile";
  const isauthPage = location.pathname === "/login" || location.pathname === "/register";

  const { user } = useAppSelector((state) => state.auth);

  // Check login status
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user || (token && token.trim() !== ""));
  const {items} = useAppSelector((state) => state.carts);
  useEffect(()=>{
    dispatch(fetchCartItems())
  },[dispatch])

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
    dispatch(logout()); // ✅ uses thunk
    navigate("/login");
  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 sm:px-6 relative">
        {/* Logo */}
     <Link to="/">
        <div className="flex items-center space-x-2 text-white">
          <svg
            className="h-7 w-7 text-green-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 3a1 1 0 000 2h1.22l.94 4.68A3 3 0 008.08 12h7.84a3 3 0 002.92-2.32l1.16-5.32A1 1 0 0019 3H6.21l-.2-1H3zm5.08 7L7.2 5h10.6l-.93 4.27A1 1 0 0115.92 10H8.08zM7 16a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span className="text-xl font-bold tracking-wide">ShopNest</span>
        </div>
     </Link>

        {/* Centered Text for Profile Page */}
        {isProfile && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-white text-2xl font-semibold tracking-wider">
              My Profile
            </span>
          </div>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center space-x-10 text-white">
          {!isauthPage && isLoggedIn ? (
            <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-xh6g9sP9m7tZ5qIV6S0cQ8cz0qZo2Xce3sM1tV9zZP3k4l5Z/7+VvJqNfCeJ/NmZK9l5DYc6MxEkmvN2s4aCzA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />


            <Link to="/cart" className="relative text-gray-700 hover:text-white">
              <i className="fas fa-shopping-cart "></i>
              {/* Badge (optional) */}
              <p className="text-white text-sm">Cart</p>
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                {items.length }
              </span>
            </Link>

              {/* Hamburger Menu */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white text-xl focus:outline-none"
                >
                  ☰
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 text-sm z-50">
                    <MenuItem to="/" label="Home" />
                    <MenuItem to="/profile" label="My Profile" />
                    <MenuItem to="/wishlist" label="Wishlist" />
                    <MenuItem to="/myOrders" label="Track Orders" />
                    <MenuItem to="/returns" label="Manage Returns" />
                    <MenuItem to="/packages" label="Your Packages" />
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
            <div className="space-x-4 text-sm font-medium">
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-200">
                Register
              </Link>
            </div>
          )}

          {/* Dashboard Welcome */}
          {isDashboard && !isProfile && (
            <div className="space-x-4 text-sm font-medium">
              <span className="text-2xl">
                Welcome {user?.username ?? "Guest"}!
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const MenuItem = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue-600"
  >
    {label}
  </Link>
);

export default Navbar;
