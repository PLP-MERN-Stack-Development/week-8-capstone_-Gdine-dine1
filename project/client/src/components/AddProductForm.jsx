import { useState, useEffect } from 'react';
import axios from 'axios';

function AddProductForm({ initialData, isEdit, onProductAdded, onProductUpdated, onCancel }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
      });
    }
  }, [isEdit, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      if (image) data.append('image', image);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      if (isEdit) {
        const res = await axios.put(
          `${API_URL}/api/products/${initialData._id}`,
          data,
          config
        );
        onProductUpdated(res.data);
      } else {
        const res = await axios.post(`${API_URL}/api/products`, data, config);
        onProductAdded(res.data);
        setFormData({ name: '', description: '', price: '' });
        setImage(null);
      }
    } catch (err) {
      console.error('Product submission failed:', err);
      alert('Something went wrong!');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded shadow"
    >
      <h2 className="col-span-2 text-xl font-semibold text-green-700">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Price (KES)"
        value={formData.price}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />

      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="p-2 border rounded"
      />

      <div className="col-span-2 flex gap-4 mt-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {isEdit ? 'Update Product' : 'Upload Product'}
        </button>

        {isEdit && (
          <button
            type="button"
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AddProductForm;
