import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Card from "../../assets/globals/components/card/Card";
import Footer from "../../assets/globals/components/footer/Footer";
import CategoryDropdown from "../../assets/globals/components/CategoryDropDown";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/productSlice";
import { fetchCategories } from "../../store/categorySlice";

/**
 * Home page - cleaned, responsive, hero banner slider (Full ecommerce style),
 * greeting for logged-in users, sticky left sidebar, product grid.
 */

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // redux state
  const { user } = useAppSelector((s) => s.auth);
  const { product } = useAppSelector((s) => s.product);

  // login detection
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isLoggedIn = Boolean(user || (token && token.trim() !== ""));

  // local UI state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // hero show/animation control
  const [showHero, setShowHero] = useState<boolean>(() => !isLoggedIn);
  const [heroAnimateOut, setHeroAnimateOut] = useState(false);

  // carousel state
  const heroImages = useMemo(
    () => [
      {
        src: "/images/hero-1.jpg",
        title: "New Arrivals — Must-have picks",
        subtitle: "Fresh products just for you. Free shipping over Rs. 2000",
        cta: { text: "Shop New", to: "/?filter=new" },
      },
      {
        src: "/images/hero-2.jpg",
        title: "Festive Sale: Up to 40% Off",
        subtitle: "Limited time deals across categories.",
        cta: { text: "View Offers", to: "/?filter=sale" },
      },
      {
        src: "/images/hero-3.jpg",
        title: "Quality Essentials",
        subtitle: "Best sellers curated for daily life.",
        cta: { text: "Browse Bestsellers", to: "/?filter=bestseller" },
      },
    ],
    []
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const AUTO_PLAY_MS = 4000;

  // Fetch products & categories on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Preserve hero show behaviour when login changes:
  useEffect(() => {
    if (isLoggedIn && showHero) {
      setHeroAnimateOut(true);
      const t = window.setTimeout(() => {
        setShowHero(false);
        setHeroAnimateOut(false);
      }, 500);
      return () => clearTimeout(t);
    }
    // if user logs out, re-show hero
    if (!isLoggedIn) {
      setShowHero(true);
    }
  }, [isLoggedIn, showHero]);

  // Automatic slide (only while hero is visible)
  useEffect(() => {
    if (!showHero) return;
    slideIntervalRef.current = window.setInterval(() => {
      setCurrentSlide((s) => (s + 1) % heroImages.length);
    }, AUTO_PLAY_MS);
    return () => {
      if (slideIntervalRef.current) window.clearInterval(slideIntervalRef.current);
    };
  }, [showHero, heroImages.length]);

  // Pause on hover
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const handleMouseEnter = () => {
      if (slideIntervalRef.current) {
        window.clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
    };
    const handleMouseLeave = () => {
      if (!slideIntervalRef.current && showHero) {
        slideIntervalRef.current = window.setInterval(() => {
          setCurrentSlide((s) => (s + 1) % heroImages.length);
        }, AUTO_PLAY_MS);
      }
    };
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [showHero, heroImages.length]);

  // Jump to featured section if navigation state asks for it
  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [location]);

  // Filtered & searched products (memoized)
  const finalProducts = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    return product
      .filter((p) => (selectedCategory === "All" ? true : p.Category.categoryName === selectedCategory))
      .filter((p) => {
        if (!q) return true;
        return (
          p.id.toString().toLowerCase().includes(q) ||
          p.productName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.price.toString().includes(q) ||
          p.Category.categoryName.toLowerCase().includes(q)
        );
      });
  }, [product, selectedCategory, searchTerm]);

  // helpers for slider controls
  const goTo = (index: number) => setCurrentSlide(((index % heroImages.length) + heroImages.length) % heroImages.length);
  const prev = () => setCurrentSlide((s) => (s - 1 + heroImages.length) % heroImages.length);
  const next = () => setCurrentSlide((s) => (s + 1) % heroImages.length);

  return (
    <>
      <div className="min-h-screen flex flex-col">
      {showHero && (
        <header
          className={`w-full hero-no-scroll ${heroAnimateOut ? "animate-fade-out-up" : "animate-fade-slide"}`}
          aria-hidden={!showHero}
        >
          <div className="relative mt-16 w-full h-[520px] md:h-[520px] overflow-hidden rounded-2xl shadow-xl">
            {heroImages.map((slide, idx) => (
              <div
                key={idx}
                className={`hero-slide ${idx === currentSlide ? "active" : ""}`}
              >
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-2xl px-6 md:px-12 lg:px-16 text-left">
                    <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow-lg">
                      {slide.title}
                    </h3>
                    <p className="mt-3 text-white text-sm md:text-base lg:text-lg drop-shadow">
                      {slide.subtitle}
                    </p>
                    <div className="mt-6">
                      <Link to={slide.cta.to}>
                        <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg">
                          {slide.cta.text}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full ${i === currentSlide ? "bg-white" : "bg-white/60"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </header>
      )}





        {/* Greeting (for logged-in users) — normal scrolling block, 15vh height */}
        {isLoggedIn && !showHero && (
          <div className="relative h-[15vh] bg-white shadow-sm flex flex-col items-center justify-center px-4 animate-fade-slide mt-12">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Welcome back, <span className="text-purple-600">{user?.username || "there"}</span> 👋
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Explore today’s best deals</p>
          </div>
        )}

        {/* Main / Featured section */}
        <main id="featured-products" className="w-full bg-white py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside
                className={`w-full lg:w-1/5 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm lg:sticky lg:top-[8vh] transition-all duration-200 ${
                  sidebarOpen ? "block" : "hidden lg:block"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Filter by Category</h3>
                  <button
                    className="lg:hidden text-sm text-gray-600"
                    onClick={() => setSidebarOpen((s) => !s)}
                  >
                    {sidebarOpen ? "Close" : "Open"}
                  </button>
                </div>
                <CategoryDropdown selected={selectedCategory} onSelect={setSelectedCategory} />
              </aside>

              {/* Products area */}
              <section className="flex-1">
                {/* Header row: title + search */}
                <div className="relative flex items-center gap-4 mb-2 md:gap-4">
                  {/* Heading */}
                  <h2 className="absolute left-1/3 transform -translate-x-1/2 text-2xl md:text-3xl font-bold text-gray-800">
                    Featured Products
                  </h2>

                  {/* Search box aligned to right */}
                  <div className="ml-auto w-full md:w-1/3 lg:w-1/4">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                          <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        placeholder="Find products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>



                {/* Product grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {finalProducts.length > 0 ? (
                    finalProducts.map((pd) => <Card key={pd.id} data={pd} />)
                  ) : (
                    <p className="text-gray-500">No products found.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Footer />
        </div>
      </footer>
    </>
  );
};

export default Home;
