import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import PostDetail from './pages/PostDetails';
import Chat from './components/Chat';
import Profile from './pages/Profile';
import MarketPage from './pages/MarketPage';
import UploadProduct from './pages/uploadProduct';
import AdminDashboard from './pages/AdminDashboard';
import AgriChatShop from './pages/AgriChatShop';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// AdminRoute to protect admin-only routes
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  // Cart count state (shared via localStorage for simplicity)
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const cartRef = useRef();

  useEffect(() => {
    // Listen for cart changes in localStorage
    const updateCart = () => {
      const order = JSON.parse(localStorage.getItem('shopOrder')) || [];
      setCartCount(order.length);
      setCartItems(order);
    };
    window.addEventListener('storage', updateCart);
    updateCart();
    return () => window.removeEventListener('storage', updateCart);
  }, []);

  // Close cart dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    }
    if (cartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [cartOpen]);

  // Helper to get item details for dropdown
  function getCartDetails() {
    const items = JSON.parse(localStorage.getItem('shopOrder')) || [];
    const shopItems = JSON.parse(localStorage.getItem('shopItemsCache')) || [];
    return items.map(o => {
      const found = shopItems.find(i => i._id === o.shopItem);
      return { ...o, name: found?.name || 'Item', imageUrl: found?.imageUrl, price: found?.price };
    });
  }

  // Cache shop items for dropdown (update on AgriChatShop page)
  useEffect(() => {
    function handleShopItemsCache(e) {
      if (e.key === 'shopItemsCache') setCartOpen(false); // force close on shop update
    }
    window.addEventListener('storage', handleShopItemsCache);
    return () => window.removeEventListener('storage', handleShopItemsCache);
  }, []);

  // Place order from navbar cart
  async function handlePlaceOrderFromCart() {
    if (!cartItems.length) return;
    try {
      const token = user?.token;
      await axios.post('/api/shop/orders', { items: cartItems }, { headers: { Authorization: `Bearer ${token}` } });
      setOrderSuccess(true);
      setCartItems([]);
      setCartCount(0);
      localStorage.setItem('shopOrder', JSON.stringify([]));
      // Removed window.dispatchEvent(new Event('storage')) to prevent infinite loop
      setTimeout(() => setOrderSuccess(false), 2500);
      setCartOpen(false);
    } catch {
      alert('Order failed');
    }
  }

  return (
    <Router>
      {/* Simple NavBar */}
      <nav className="bg-green-700 text-white px-4 py-3 flex gap-4 items-center relative">
        <a href="/" className="font-bold hover:underline">Home</a>
        <a href="/market" className="hover:underline">Market</a>
        <a href="/dashboard" className="hover:underline">Dashboard</a>
        {user?.role === 'admin' && (
          <a href="/admin" className="hover:underline">Admin</a>
        )}
        <a href="/AgriChatShop" className="hover:underline flex items-center gap-1">
          AgriChatShop
          {user && user.role !== 'admin' && (
            <span className="relative inline-block ml-2" ref={cartRef}>
              <button
                className="relative focus:outline-none"
                onClick={e => { e.preventDefault(); setCartOpen(v => !v); }}
                aria-label="View cart"
              >
                <svg className="w-7 h-7 text-yellow-300 drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 animate-pulse">{cartCount}</span>
                )}
              </button>
              {/* Cart Dropdown */}
              {cartOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg border z-50 animate-fade-in">
                  <div className="p-3 border-b font-bold text-green-700 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" /></svg>
                    Your Cart
                  </div>
                  <ul className="max-h-60 overflow-y-auto divide-y">
                    {getCartDetails().length === 0 ? (
                      <li className="p-4 text-center text-gray-400">Cart is empty</li>
                    ) : (
                      getCartDetails().map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 p-2 hover:bg-green-50 transition">
                          {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded" />}
                          <div className="flex-1">
                            <div className="font-semibold text-green-800">{item.name}</div>
                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                          </div>
                          <div className="text-green-700 font-bold text-sm">KES {item.price}</div>
                        </li>
                      ))
                    )}
                  </ul>
                  <div className="p-3 border-t text-center">
                    <a href="/AgriChatShop" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mr-2">Go to Shop</a>
                    {getCartDetails().length > 0 && (
                      <button
                        onClick={handlePlaceOrderFromCart}
                        className="inline-block bg-yellow-400 text-green-900 px-4 py-2 rounded hover:bg-yellow-500 transition font-bold"
                      >
                        Place Order
                      </button>
                    )}
                    {orderSuccess && (
                      <div className="mt-2 text-green-600 font-semibold animate-pulse">Order placed successfully!</div>
                    )}
                  </div>
                </div>
              )}
            </span>
          )}
        </a>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/chatroom" element={<Chat />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/upload" element={<UploadProduct />} />
        <Route path="/AgriChatShop" element={<AgriChatShop />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        {/* Fallback route for 404 */}
        <Route path="*" element={<h1 className="p-10 text-center text-2xl">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
