import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Card from "../../assets/globals/components/card/Card";
import Footer from "../../assets/globals/components/footer/Footer";
import CategoryDropdown from "../../assets/globals/components/CategoryDropDown";
import { fetchProducts } from "../../store/productSlice";
import { fetchCategories } from "../../store/categorySlice";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((s) => s.product);

  // Sidebar category filter independent of Navbar
  const [sidebarCategory, setSidebarCategory] = useState("All");
  const [sidebarSearch, setSidebarSearch] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filtered products (sidebar + search)
  const filteredProducts = useMemo(() => {
    return product
      .filter(p => sidebarCategory === "All" ? true : p.Category.categoryName === sidebarCategory)
      .filter(p => {
        if (!sidebarSearch.trim()) return true;
        const s = sidebarSearch.toLowerCase().trim();
        return (
          p.productName.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.Category.categoryName.toLowerCase().includes(s)
        );
      });
  }, [product, sidebarCategory, sidebarSearch]);

  return (
    <div className="min-h-screen flex flex-col mt-16">

      <main className="w-full bg-white py-12 md:py-20 px-4 sm:px-6 lg:px-8">
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

              <input
                type="text"
                placeholder="Search in category..."
                className="w-full mt-3 px-3 py-2 border rounded-md outline-none"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
              />
            </aside>

            {/* Products */}
            <section className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">Featured Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((pd) => <Card key={pd.id} data={pd} />)
                ) : (
                  <p className="text-gray-500 text-center col-span-full">No products found.</p>
                )}
              </div>
            </section>

          </div>
        </div>
      </main>

      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default Home;
