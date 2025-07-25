import { useEffect, useState } from 'react';
import axios from 'axios';
import AddProductForm from '../components/AddProductForm';
import { motion, AnimatePresence } from 'framer-motion';

function MarketPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
      alert('Failed to load products: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setShowForm(false);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEditToggle = (product) => {
    setEditingProductId(product._id);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSubmit = async (e, productId) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/api/products/${productId}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? res.data : p))
      );
      setEditingProductId(null);
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-800">🛒 Agri Market</h1>
      <div className="font-bold italic mb-4">Let shop together in our Agrimarket. Post your ready product,buy products and lets enjoy agriculture</div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Toggle Add Product Form */}
      <div className="mb-6">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? 'Close Form' : '➕ Add Product'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <AddProductForm onProductAdded={handleProductAdded} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
          >
            {editingProductId === product._id ? (
              <form onSubmit={(e) => handleEditSubmit(e, product._id)} className="space-y-2">
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="imageUrl"
                  value={editFormData.imageUrl}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProductId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {product.imageUrl && (
                  <img
                    src={
                      product.imageUrl.startsWith('http')
                        ? product.imageUrl
                        : `${API_URL}${product.imageUrl}`
                    }
                    alt={product.name}
                    className="w-full max-h-80 object-contain rounded mb-3 bg-white"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                  />
                )}
                <h2 className="text-lg font-bold text-green-700">{product.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <p className="text-sm text-gray-700">
                  Price: <strong>KES {product.price}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Farmer: {product.farmer?.username || 'Unknown'}
                </p>

                {/* Owner Controls or Contact */}
                {user && (user._id === product.farmer?._id) ? (
                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      onClick={() => handleEditToggle(product)}
                      className="w-full bg-blue-300 text-white py-2 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => setSelectedFarmer(product.farmer)}
                  >
                    Contact Farmer
                  </button>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>
      {selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Contact {selectedFarmer.username}
            </h2>
            <p className="text-gray-700 mb-2">
              Email: <strong>{selectedFarmer.email || 'Not available'}</strong>
            </p>
            <p className="text-gray-700 mb-4">
              Phone: <strong>{selectedFarmer.phone || 'Not available'}</strong>
            </p>
            {selectedFarmer.email && (
              <a
                href={`mailto:${selectedFarmer.email}`}
                className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center mb-2"
              >
                Send Email
              </a>
            )}
            <button
              onClick={() => setSelectedFarmer(null)}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketPage;
