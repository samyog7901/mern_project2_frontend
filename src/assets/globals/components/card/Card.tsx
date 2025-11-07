import { Link } from "react-router-dom"
import type { Product } from "../../types/productTypes"


interface CardProps{
  data : Product
}

const Card:React.FC<CardProps> = ({data}) => {
  return (
    <>
      <Link to={`/product/${data.id}`}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-md rounded-3xl max-w-[400px] dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 hover:scale-105 hover:shadow-xl">

          <div className="bg-gray-300 dark:bg-gray-700 mb-4 rounded-2xl overflow-hidden" style={{ maxHeight: '300px' }} > <img className="w-full rounded-2xl hover:transition-transform duration-300 hover:scale-105" src={data?.imageUrl} alt="Product Image" /> </div>

            <div className="px-5 pb-5">
              <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white">
                {data?.productName}
              </h3>

              <div className="flex items-center mt-2.5 mb-5">
                {/* Keep your stars here */}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">Rs.{data?.price}</span>
                <button className="text-white bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-lg text-sm">
                  Shop
                </button>
              </div>
            </div>
          </div>
        </div>

      </Link>

    </>

  )
}

export default Card