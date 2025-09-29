import { useEffect } from "react";
import Card from "../../assets/globals/components/card/Card";
import Footer from "../../assets/globals/components/footer/Footer";
import Navbar from "../../assets/globals/components/navbar/Navbar";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/productSlice";

const Home = () => {
  const {user} = useAppSelector((state)=>state.auth)
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user || (token && token.trim() !== ""));
  const dispatch = useAppDispatch()
  const {product,status} = useAppSelector((state)=>state.product)
 

  useEffect(()=>{
    dispatch(fetchProducts())
  },[dispatch])
  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Navbar Section */}
        <Navbar />

        {/* Hero Section */}
        <section className="flex items-center justify-center h-screen bg-gradient-to-tr from-purple-100 via-white to-teal-100 pt-40 px-4">
          <div className="max-w-4xl w-full text-center space-y-8">
           {isLoggedIn ?(
                 <>
                 <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
                 Welcome to <span className="text-purple-600">ShopNest</span>
               </h1>
               <p className="text-gray-600 text-lg md:text-xl">
                 Discover the best products at unbeatable prices. Fast shipping. Easy returns.
               </p>
                </>
                ):(
                  <>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
                 Welcome to <span className="text-purple-600">ShopNest!</span>
               </h1>
               <p className="text-gray-600 text-lg md:text-xl">
                 Discover the best products at unbeatable prices. Fast shipping. Easy returns.
               </p>
   
                <div className="flex justify-center gap-4 flex-wrap">
                  <a href="/login">
                    <button className="px-6 py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-md transition">
                      Login
                    </button>
                  </a>
                  <a href="/register">
                    <button className="px-6 py-3 text-lg bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 rounded-2xl shadow-md transition">
                      Sign Up
                    </button>
                  </a>
                  </div>
                  
                  </>
                )}
            

            <img
              src="https://media.istockphoto.com/id/2190128714/photo/young-woman-preparing-shipping-boxes-is-talking-on-the-phone.webp?a=1&b=1&s=612x612&w=0&k=20&c=o4DxNImQUTqN99dRVila3bJ3NywBb-_oPyH9MalYm9A="
              alt="E-commerce illustration"
              className="max-w-xs sm:max-w-md mx-auto mt-10 rounded-xl shadow-lg"
            />
          </div>
        </section>

        {/* Card Section */}
        <section className="w-full bg-white py-16 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Featured Products</h2>
            <p className="text-gray-600 mt-2">
              Explore our exclusive range of products tailored just for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {product.length > 0 && product.map((pd)=>{
              return(
                <Card key={pd.id} data={pd} />
              )
            })}
           
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
