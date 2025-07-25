import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add state for forms and editing
  const [newPost, setNewPost] = useState({ content: '', userId: '', username: '' });
  const [editPost, setEditPost] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');

  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', imageUrl: '', farmer: '' });
  const [editProduct, setEditProduct] = useState(null);
  const [editProductData, setEditProductData] = useState({ name: '', description: '', price: '', imageUrl: '', farmer: '' });

  const [newMessage, setNewMessage] = useState({ sender: '', content: '', replyTo: '' });
  const [editMessage, setEditMessage] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState('');

  // Get token from localStorage user object
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    try {
      const [postsRes, productsRes, messagesRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/admin/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Check if any of the responses returned HTML instead of JSON
      const isHTML = async (res) => {
        const text = await res.clone().text();
        return text.startsWith('<!DOCTYPE html>');
      };

      if (
        await isHTML(postsRes) ||
        await isHTML(productsRes) ||
        await isHTML(messagesRes)
      ) {
        throw new Error('Received HTML instead of JSON. Check proxy config or backend status.');
      }

      const [postsData, productsData, messagesData] = await Promise.all([
        postsRes.json(),
        productsRes.json(),
        messagesRes.json(),
      ]);

      setPosts(postsData);
      setProducts(productsData);
      setMessages(messagesData);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CRUD handlers ---
  // POSTS
  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/admin/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });
      setNewPost({ content: '', userId: '', username: '' });
      fetchData();
    } catch (err) {
      alert('Failed to add post');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await fetch(`${API_URL}/api/admin/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  const handleEditPost = (post) => {
    setEditPost(post._id);
    setEditPostContent(post.content);
  };

  const handleUpdatePost = async (id) => {
    await fetch(`${API_URL}/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: editPostContent }),
    });
    setEditPost(null);
    setEditPostContent('');
    fetchData();
  };

  // PRODUCTS
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      setNewProduct({ name: '', description: '', price: '', imageUrl: '', farmer: '' });
      fetchData();
    } catch (err) {
      alert('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  const handleEditProduct = (product) => {
    setEditProduct(product._id);
    setEditProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      farmer: product.farmer,
    });
  };

  const handleUpdateProduct = async (id) => {
    await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editProductData),
    });
    setEditProduct(null);
    setEditProductData({ name: '', description: '', price: '', imageUrl: '', farmer: '' });
    fetchData();
  };

  // MESSAGES
  const handleAddMessage = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/admin/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMessage),
      });
      setNewMessage({ sender: '', content: '', replyTo: '' });
      fetchData();
    } catch (err) {
      alert('Failed to add message');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await fetch(`${API_URL}/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  const handleEditMessage = (message) => {
    setEditMessage(message._id);
    setEditMessageContent(message.content);
  };

  const handleUpdateMessage = async (id) => {
    await fetch(`${API_URL}/api/admin/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: editMessageContent }),
    });
    setEditMessage(null);
    setEditMessageContent('');
    fetchData();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">Loading admin dashboard...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 relative overflow-hidden">
      {/* Decorative background using Tailwind */}
      <div className="absolute bottom-0 left-0 w-full h-44 bg-gradient-to-t from-green-400 to-transparent z-0" />
      <div className="absolute bottom-0 left-0 w-full flex justify-between z-0">
        <div className="w-1/4 h-32 bg-green-300 rounded-full blur-2xl opacity-60" />
        <div className="w-1/4 h-32 bg-green-500 rounded-full blur-2xl opacity-40" />
      </div>
      <div className="relative z-10 p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-green-800 text-center drop-shadow-lg">🌱 Welcome, Admin! 🌾</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Posts */}
          <div className="bg-white/90 p-6 rounded-2xl shadow-2xl border border-green-200 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-green-700 border-b border-green-100 pb-2">Posts</h2>
            <form onSubmit={handleAddPost} className="mb-4 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Content"
                value={newPost.content}
                onChange={e => setNewPost({ ...newPost, content: e.target.value, userId: user?.id, username: user?.username })}
                className="border border-green-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-300"
                required
              />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition">Add Post</button>
            </form>
            <div className="flex-1 overflow-y-auto">
          {posts.length === 0 ? (
                <p className="text-gray-500">No posts available.</p>
          ) : (
                <ul className="space-y-2">
              {posts.map((post) => (
                    <li key={post._id} className="bg-green-50 rounded-lg px-3 py-2 shadow-sm mb-2">
                      {editPost === post._id ? (
                        <>
                          <input
                            type="text"
                            value={editPostContent}
                            onChange={e => setEditPostContent(e.target.value)}
                            className="border px-2 py-1 mr-2 rounded w-full mb-2"
                          />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleUpdatePost(post._id)} className="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
                            <button onClick={() => setEditPost(null)} className="bg-gray-300 px-2 py-1 rounded">Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-green-900 font-medium block mb-2">{post.content}</span>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleEditPost(post)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                            <button onClick={() => handleDeletePost(post._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                          </div>
                        </>
                      )}
                    </li>
              ))}
            </ul>
          )}
            </div>
        </div>

        {/* Products */}
          <div className="bg-white/90 p-6 rounded-2xl shadow-2xl border border-green-200 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-green-700 border-b border-green-100 pb-2">Products</h2>
            <form onSubmit={handleAddProduct} className="mb-4 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value, farmer: user?.id })}
                className="border border-green-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-300"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border border-green-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-300"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                className="border border-green-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-300"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.imageUrl}
                onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                className="border border-green-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-300"
              />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition">Add Product</button>
            </form>
            <div className="flex-1 overflow-y-auto">
          {products.length === 0 ? (
                <p className="text-gray-500">No products available.</p>
          ) : (
                <ul className="space-y-2">
              {products.map((product) => (
                    <li key={product._id} className="bg-green-50 rounded-lg px-3 py-2 shadow-sm mb-2">
                      {editProduct === product._id ? (
                        <>
                          <input
                            type="text"
                            value={editProductData.name}
                            onChange={e => setEditProductData({ ...editProductData, name: e.target.value })}
                            className="border px-2 py-1 mr-2 rounded w-full mb-2"
                          />
                          <input
                            type="text"
                            value={editProductData.description}
                            onChange={e => setEditProductData({ ...editProductData, description: e.target.value })}
                            className="border px-2 py-1 mr-2 rounded w-full mb-2"
                          />
                          <input
                            type="number"
                            value={editProductData.price}
                            onChange={e => setEditProductData({ ...editProductData, price: e.target.value })}
                            className="border px-2 py-1 mr-2 rounded w-full mb-2"
                          />
                          <input
                            type="text"
                            value={editProductData.imageUrl}
                            onChange={e => setEditProductData({ ...editProductData, imageUrl: e.target.value })}
                            className="border px-2 py-1 mr-2 rounded w-full mb-2"
                          />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleUpdateProduct(product._id)} className="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
                            <button onClick={() => setEditProduct(null)} className="bg-gray-300 px-2 py-1 rounded">Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-green-900 font-medium block mb-2">{product.name}</span>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleEditProduct(product)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                            <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                          </div>
                        </>
                      )}
                    </li>
              ))}
            </ul>
          )}
            </div>
        </div>

        {/* Messages */}
          <div className="bg-white/90 p-6 rounded-2xl shadow-2xl border border-green-200 flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-green-700 border-b border-green-100 pb-2">Messages</h2>
            <form onSubmit={handleAddMessage} className="mb-4 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Sender"
                value={newMessage.sender}
                onChange={e => setNewMessage({ ...newMessage, sender: e.target.value })}
                className="border border-green-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-300"
                required
              />
              <input
                type="text"
                placeholder="Content"
                value={newMessage.content}
                onChange={e => setNewMessage({ ...newMessage, content: e.target.value })}
                className="border border-green-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-300"
                required
              />
              <input
                type="text"
                placeholder="Reply To (optional)"
                value={newMessage.replyTo}
                onChange={e => setNewMessage({ ...newMessage, replyTo: e.target.value })}
                className="border border-green-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-300"
              />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition">Add Message</button>
            </form>
            <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
                <p className="text-gray-500">No messages available.</p>
          ) : (
                <ul className="space-y-2">
              {messages.map((message) => (
                    <li key={message._id} className="bg-green-50 rounded-lg px-3 py-2 shadow-sm mb-2">
                      {editMessage === message._id ? (
                        <>
                          <input
                            type="text"
                            value={editMessageContent}
                            onChange={e => setEditMessageContent(e.target.value)}
                            className="border px-2 py-1 mr-2 rounded w-full mb-2"
                          />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleUpdateMessage(message._id)} className="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
                            <button onClick={() => setEditMessage(null)} className="bg-gray-300 px-2 py-1 rounded">Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-green-900 font-medium block mb-2">{message.content}</span>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleEditMessage(message)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                            <button onClick={() => handleDeleteMessage(message._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                          </div>
                        </>
                      )}
                    </li>
              ))}
            </ul>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
