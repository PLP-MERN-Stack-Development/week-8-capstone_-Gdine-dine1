import { useState } from 'react';
import axios from 'axios';

function UploadProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user')); // assumes user has `_id` stored
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) return setMessage('You must be logged in as a farmer');

    try {
      const newProduct = {
        name,
        description,
        price,
        farmer: user._id,
      };

      await axios.post(`${API_URL}/api/products`, newProduct);
      setMessage('✅ Product uploaded successfully!');
      setName('');
      setDescription('');
      setPrice('');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to upload product');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-green-700">📤 Upload Product</h2>

        {message && <p className="mb-4 text-sm text-center">{message}</p>}

        <label className="block mb-2 text-sm font-medium">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2 text-sm font-medium">Price (KES)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadProduct;
