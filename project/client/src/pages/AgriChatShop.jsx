import { useEffect, useState } from 'react';
import axios from 'axios';

function AgriChatShop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState([]); // [{ shopItem, quantity }]
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', imageUrl: '', stock: '' });
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState({ name: '', description: '', price: '', imageUrl: '', stock: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchItems();
    if (user && user.role !== 'admin') {
      fetchOrderHistory();
    }
    if (user && user.role === 'admin') {
      fetchAllOrders();
    }
  }, []);

  // Sync order state with localStorage for cart icon
  useEffect(() => {
    if (user && user.role !== 'admin') {
      localStorage.setItem('shopOrder', JSON.stringify(order));
    }
  }, [order, user]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/shop/items`);
      setItems(res.data);
      // Cache items for navbar cart dropdown
      localStorage.setItem('shopItemsCache', JSON.stringify(res.data));
    } catch (err) {
      setError('Failed to load shop items');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/shop/orders`, { headers: { Authorization: `Bearer ${token}` } });
      setOrderHistory(res.data);
    } catch (err) {
      // Optionally handle error
    }
  };

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/shop/orders/all`, { headers: { Authorization: `Bearer ${token}` } });
      setAllOrders(res.data);
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/shop/orders/${orderId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      fetchAllOrders();
    } catch {
      alert('Failed to update order status');
    }
  };

  // Admin: Add item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/shop/items`, newItem, { headers: { Authorization: `Bearer ${token}` } });
      setNewItem({ name: '', description: '', price: '', imageUrl: '', stock: '' });
      setShowAddForm(false);
      fetchItems();
    } catch {
      alert('Failed to add item');
    }
  };

  // Admin: Edit item
  const handleEditItem = (item) => {
    setEditId(item._id);
    setEditItem({ ...item });
  };
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/shop/items/${editId}`, editItem, { headers: { Authorization: `Bearer ${token}` } });
      setEditId(null);
      fetchItems();
    } catch {
      alert('Failed to update item');
    }
  };
  // Admin: Delete item
  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`${API_URL}/api/shop/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchItems();
    } catch {
      alert('Failed to delete item');
    }
  };

  // Customer: Add to order
  const handleAddToOrder = (item) => {
    setOrder((prev) => {
      const exists = prev.find((o) => o.shopItem === item._id);
      if (exists) {
        return prev.map((o) => o.shopItem === item._id ? { ...o, quantity: o.quantity + 1 } : o);
      }
      return [...prev, { shopItem: item._id, quantity: 1 }];
    });
  };
  const handleOrderQtyChange = (id, qty) => {
    setOrder((prev) => prev.map((o) => o.shopItem === id ? { ...o, quantity: qty } : o));
  };
  const handleRemoveFromOrder = (id) => {
    setOrder((prev) => prev.filter((o) => o.shopItem !== id));
  };
  // Customer: Place order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!order.length) return;
    try {
      await axios.post(`${API_URL}/api/shop/orders`, { items: order }, { headers: { Authorization: `Bearer ${token}` } });
      setOrder([]);
      setOrderSuccess(true);
      fetchOrderHistory();
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch {
      alert('Order failed');
    }
  };

  // Filtered items by search
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-green-200 p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-800 text-center">AgriChat Shop 🛒</h1>
      {loading ? (
        <div>Loading shop items...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Admin Add Item */}
          {user?.role === 'admin' && (
            <div className="mb-6">
              <button
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                onClick={() => setShowAddForm((prev) => !prev)}
              >
                {showAddForm ? 'Close Form' : 'Add Shop Item'}
              </button>
              {showAddForm && (
                <form onSubmit={handleAddItem} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
                  <input type="text" placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="p-2 border rounded" required />
                  <input type="text" placeholder="Description" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} className="p-2 border rounded" />
                  <input type="number" placeholder="Price" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} className="p-2 border rounded" required />
                  <input type="text" placeholder="Image URL" value={newItem.imageUrl} onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })} className="p-2 border rounded" />
                  <input type="number" placeholder="Stock" value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} className="p-2 border rounded" />
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-2">Add Item</button>
                </form>
              )}
            </div>
          )}

          {/* Main Content and Sidebar Layout */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6 flex justify-center">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full max-w-md px-4 py-2 border border-green-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Shop Items List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
              {filteredItems.map(item => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-lg p-4 flex flex-col transition-transform duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105 border-2 border-green-100 hover:border-green-300 hover:shadow-2xl group"
                >
                  {editId === item._id ? (
                    <form onSubmit={handleUpdateItem} className="space-y-2">
                      <input type="text" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} className="w-full p-2 border rounded" required />
                      <input type="text" value={editItem.description} onChange={e => setEditItem({ ...editItem, description: e.target.value })} className="w-full p-2 border rounded" />
                      <input type="number" value={editItem.price} onChange={e => setEditItem({ ...editItem, price: e.target.value })} className="w-full p-2 border rounded" required />
                      <input type="text" value={editItem.imageUrl} onChange={e => setEditItem({ ...editItem, imageUrl: e.target.value })} className="w-full p-2 border rounded" />
                      <input type="number" value={editItem.stock} onChange={e => setEditItem({ ...editItem, stock: e.target.value })} className="w-full p-2 border rounded" />
                      <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                        <button type="button" onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="h-36 w-full object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300" />}
                      <h2 className="text-xl font-bold text-green-700 mb-1 group-hover:text-green-900 transition">{item.name}</h2>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg text-green-800 font-semibold">KES {item.price}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Stock: {item.stock}</span>
                      </div>
                      {user?.role === 'admin' ? (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleEditItem(item)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                          <button onClick={() => handleDeleteItem(item._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                        </div>
                      ) : (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleAddToOrder(item)} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition">Add to Order</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar for Order and Order History */}
          {user && user.role !== 'admin' && (
            <div className="w-full lg:w-[350px] flex flex-col gap-6 sticky top-8 h-fit">
              {/* Your Order */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-green-700 text-center">Your Order</h2>
                {order.length === 0 ? (
                  <p className="text-gray-500 text-center">No items in your order.</p>
                ) : (
                  <form onSubmit={handlePlaceOrder}>
                    <ul className="mb-4 divide-y">
                      {order.map(o => {
                        const item = items.find(i => i._id === o.shopItem);
                        return (
                          <li key={o.shopItem} className="flex items-center gap-2 py-2">
                            <span className="flex-1 font-medium text-green-800">{item?.name}</span>
                            <input
                              type="number"
                              min={1}
                              max={item?.stock || 99}
                              value={o.quantity}
                              onChange={e => handleOrderQtyChange(o.shopItem, Number(e.target.value))}
                              className="w-16 border rounded p-1"
                            />
                            <button type="button" onClick={() => handleRemoveFromOrder(o.shopItem)} className="text-red-500 ml-2">Remove</button>
                          </li>
                        );
                      })}
                    </ul>
                    <button type="submit" className="w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">Place Order</button>
                    {orderSuccess && <div className="text-green-600 mt-2 text-center">Order placed successfully!</div>}
                  </form>
                )}
              </div>
              {/* Order History */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-green-700 text-center">Order History</h2>
                {orderHistory.length === 0 ? (
                  <p className="text-gray-500 text-center">No past orders.</p>
                ) : (
                  <ul className="space-y-4">
                    {orderHistory.map(order => (
                      <li key={order._id} className="border-b pb-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Order #{order._id.slice(-6)}</span>
                          <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-700">{order.status}</span>
                        </div>
                        <ul className="ml-4 mt-1 text-sm text-gray-700">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.quantity} x {item.shopItem?.name || 'Item'}
                            </li>
                          ))}
                        </ul>
                        <div className="text-xs text-gray-500 mt-1">Placed: {new Date(order.createdAt).toLocaleString()}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AgriChatShop; 