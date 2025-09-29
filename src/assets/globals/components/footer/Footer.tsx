

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-100 py-8 flex flex-wrap sm: flex-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <ul>
                <li><a href="#" className="hover:underline">Our Story</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul>
                <li><a href="#" className="hover:underline">Contact Us</a></li>
                <li><a href="#" className="hover:underline">Shipping &amp; Delivery</a></li>
                <li><a href="#" className="hover:underline">Returns &amp; Exchanges</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul>
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
                <li><a href="#" className="hover:underline">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="mb-4">Subscribe to our newsletter for exclusive offers and updates.</p>
              <form>
                <input type="email" placeholder="Your email" className="px-4 py-2 border rounded-md mb-2" />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">© 2025 ShopNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>

  )
}

export default Footer