import { FaShoppingCart, FaComments, FaBoxOpen } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import { Link } from 'react-router-dom';

function DashboardBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
      {/* Gradient sun */}
      <svg className="absolute left-1/2 -translate-x-1/2 top-0 w-80 h-80 opacity-40" viewBox="0 0 320 320">
        <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe066" />
          <stop offset="100%" stopColor="#fffde4" />
        </radialGradient>
        <circle cx="160" cy="160" r="120" fill="url(#sunGradient)" />
      </svg>
      {/* Floating leaves with Tailwind animation */}
      <svg className="absolute left-10 top-1/2 w-16 h-16 animate-bounce" viewBox="0 0 64 64">
        <ellipse cx="32" cy="32" rx="24" ry="10" fill="#b9e77a" />
      </svg>
      <svg className="absolute right-10 top-1/3 w-12 h-12 animate-pulse" viewBox="0 0 48 48">
        <ellipse cx="24" cy="24" rx="16" ry="7" fill="#a3d977" />
      </svg>
      <svg className="absolute left-1/4 bottom-10 w-20 h-10 animate-spin" viewBox="0 0 80 40">
        <ellipse cx="40" cy="20" rx="30" ry="8" fill="#b2ebf2" />
      </svg>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [reload, setReload] = useState(false);

  const handlePostCreated = () => {
    setReload(prev => !prev); // trigger PostList refresh
  };

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 overflow-hidden">
      <DashboardBackground />
      {/* Header */}
      <header className="bg-white/90 shadow p-4 px-6 flex justify-between items-center relative z-10">
        <h1 className="text-xl font-bold text-green-700">AgriConnect Dashboard</h1>
        <div className="relative group">
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.username}`}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-green-500"
            />
            <span className="text-green-700 font-medium">
              {user?.username}
            </span>
          </div>
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all z-10 min-w-[150px]">
            <Link
              to={`/profile/${user?.id}`}
              className="block px-4 py-2 text-gray-700 hover:bg-green-100"
            >
              View Profile
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
              }}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      {/* Content */}
      <main className="p-8 max-w-5xl mx-auto w-full relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-green-700 mb-2 animate-bounce">Welcome Back, {user?.username || 'User'}!</h2>
          <p className="text-gray-700 text-lg mb-2">
            Explore posts, chat with others, shop for farm requirements, and share your farming ideas.
          </p>
        </div>
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link to="/market" className="bg-gradient-to-br from-green-200 via-green-100 to-green-300 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition group border-2 border-green-300">
            <FaBoxOpen className="text-green-700 text-4xl mb-2 group-hover:scale-110 transition" />
            <h3 className="text-lg font-bold text-green-900 mb-1">Market</h3>
            <p className="text-green-800 text-center">Browse, upload, and manage farm products. Connect with buyers and sellers.</p>
          </Link>
          <Link to="/AgriChatShop" className="bg-gradient-to-br from-yellow-100 via-green-100 to-green-200 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition group border-2 border-yellow-200">
            <FaShoppingCart className="text-yellow-600 text-4xl mb-2 group-hover:scale-110 transition" />
            <h3 className="text-lg font-bold text-yellow-800 mb-1">AgriChatShop</h3>
            <p className="text-yellow-900 text-center">Order farm requirements, view your orders, and track your purchases.</p>
          </Link>
          <Link to="/chatroom" className="bg-gradient-to-br from-blue-100 via-green-100 to-green-200 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition group border-2 border-blue-200">
            <FaComments className="text-blue-600 text-4xl mb-2 group-hover:scale-110 transition" />
            <h3 className="text-lg font-bold text-blue-800 mb-1">Chatroom</h3>
            <p className="text-blue-900 text-center">Chat live with other farmers, ask questions, and share experiences.</p>
          </Link>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Share Your Farming Thoughts</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <PostForm onPostCreated={handlePostCreated} />
          <PostList key={reload} />
        </div>
      </main>
      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 py-6 bg-green-100 border-t mt-auto relative z-10">
        <p>
          &copy; {new Date().getFullYear()} AgriConnect. All rights reserved. |
          <a href="/about" className="text-green-700 hover:underline mx-2 inline-block">About</a> |
          <a href="/faq" className="text-green-700 hover:underline mx-2 inline-block">FAQ</a> |
          <a href="/contact" className="text-green-700 hover:underline inline-block">Contact</a>
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
