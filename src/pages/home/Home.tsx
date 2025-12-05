import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Card from "../../assets/globals/components/card/Card";
import Footer from "../../assets/globals/components/footer/Footer";
import CategoryDropdown from "../../assets/globals/components/CategoryDropDown";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/productSlice";
import { fetchCategories } from "../../store/categorySlice";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // const { user } = useAppSelector((s) => s.auth);
  const { product } = useAppSelector((s) => s.product);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = user?.username?.trim().split(" ")[0] || "there";

 

  const isLoggedIn = !!token && !!user?.id;



  // Get initial search from URL (from Navbar)
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar category filter independent of Navbar
  const [sidebarCategory, setSidebarCategory] = useState("All");

  // Hero
  const [showHero, setShowHero] = useState(() => !isLoggedIn);
  const [heroAnimateOut, setHeroAnimateOut] = useState(false);

  const heroImages = [
    { src: "/images/hero-1.jpg", title: "New Arrivals", subtitle: "Fresh products just for you.", cta: { text: "Shop New", to: "/?filter=new" } },
    { src: "/images/hero-2.jpg", title: "Festive Sale", subtitle: "Limited time deals.", cta: { text: "View Offers", to: "/?filter=sale" } },
    { src: "/images/hero-3.jpg", title: "Quality Essentials", subtitle: "Best sellers curated.", cta: { text: "Browse Bestsellers", to: "/?filter=bestseller" } },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef<number | null>(null);
  const AUTO_PLAY_MS = 4000;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn && showHero) {
      setHeroAnimateOut(true);
      const t = window.setTimeout(() => {
        setShowHero(false);
        setHeroAnimateOut(false);
      }, 500);
      return () => clearTimeout(t);
    }
    if (!isLoggedIn) setShowHero(true);
  }, [isLoggedIn, showHero]);

  // Automatic hero slide
  useEffect(() => {
    if (!showHero) return;
    slideIntervalRef.current = window.setInterval(() => {
      setCurrentSlide((s) => (s + 1) % heroImages.length);
    }, AUTO_PLAY_MS);
    return () => {
      if (slideIntervalRef.current) window.clearInterval(slideIntervalRef.current);
    };
  }, [showHero]);

  // Sync search from Navbar (URL) once
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
  
    setSearchTerm(search);
  
    // Scroll to the products section when a search is performed
    if (search.trim()) {
      setTimeout(() => {
        const section = document.getElementById("featured-products");
        if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [location.search])

  // Final products filtered
  const finalProducts = useMemo(() => {
    return product
      .filter(p => sidebarCategory === "All" ? true : p.Category.categoryName === sidebarCategory)
      .filter(p => {
        if (!searchTerm.trim()) return true;
        const search = searchTerm.toLowerCase().trim();
        return (
          p.id.toString().toLowerCase().includes(search) ||
          p.productName.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.price.toString().includes(search) ||
          p.Category.categoryName.toLowerCase().includes(search)
        );
      });
  }, [product, sidebarCategory, searchTerm]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Hero */}
        {showHero && (
          <header className={`w-full hero-no-scroll ${heroAnimateOut ? "animate-fade-out-up" : "animate-fade-slide"}`} aria-hidden={!showHero}>
            <div className="relative mt-16 w-full h-[520px] md:h-[520px] overflow-hidden rounded-2xl shadow-xl">
              {heroImages.map((slide, idx) => (
                <div key={idx} className={`hero-slide ${idx === currentSlide ? "active" : ""}`}>
                  <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-2xl px-6 md:px-12 lg:px-16 text-left">
                      <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-lg">{slide.title}</h3>
                      <p className="mt-3 text-white text-sm md:text-base lg:text-lg drop-shadow">{slide.subtitle}</p>
                      <div className="mt-6">
                        <Link to={slide.cta.to}>
                          <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg">{slide.cta.text}</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </header>
        )}

        {/* Greeting */}
        {isLoggedIn && !showHero && (
          <div className="relative bg-white shadow-sm flex flex-col items-center justify-center px-4 animate-fade-slide mt-20 pt-20 sm:pt-0 py-6">


            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Welcome back, <span className="text-purple-600">{firstName}</span> 👋</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Explore today’s best deals</p>
          </div>
        )}

        {/* Products */}
        <main id="featured-products" className="w-full bg-white py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Sidebar */}
              <aside className={`w-full lg:w-1/5 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm lg:sticky lg:top-[8vh] transition-all duration-200 ${sidebarOpen ? "block" : "hidden lg:block"}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Filter by Category</h3>
                  <button className="lg:hidden text-sm text-gray-600" onClick={() => setSidebarOpen((s) => !s)}>
                    {sidebarOpen ? "Close" : "Open"}
                  </button>
                </div>
                <CategoryDropdown selected={sidebarCategory} onSelect={setSidebarCategory} />
              </aside>

              {/* Products */}
              <section className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {finalProducts.length > 0 ? finalProducts.map((pd) => <Card key={pd.id} data={pd} />)
                    : <p className="text-gray-500 text-center col-span-full">No products found.</p>}
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>

      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Footer />
        </div>
      </footer>
    </>
  );
};

export default Home;
