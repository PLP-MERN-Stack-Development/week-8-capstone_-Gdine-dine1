import { FaSeedling, FaComments, FaShoppingCart, FaUserShield, FaUsers, FaBoxOpen } from 'react-icons/fa';

function About() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-xl shadow-md max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-green-700 mb-4 flex items-center gap-2">
          <FaSeedling className="text-2xl" /> About AgriConnect
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          <span className="font-semibold text-green-700">AgriConnect</span> is a modern digital platform that empowers farmers, agricultural experts, and consumers to connect, collaborate, and grow together. Our mission is to bridge the gap between farm and market, knowledge and action, and people and community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start gap-3">
            <FaComments className="text-green-600 text-2xl mt-1" />
            <div>
              <h2 className="font-bold text-green-800">Live Chatroom</h2>
              <p className="text-gray-600">Chat in real time with fellow farmers, ask questions, share tips, and build your network.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FaShoppingCart className="text-green-600 text-2xl mt-1" />
            <div>
              <h2 className="font-bold text-green-800">AgriChatShop</h2>
              <p className="text-gray-600">Order farm requirements directly from our shop. Admins manage shop items, and customers can place and track orders easily.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FaBoxOpen className="text-green-600 text-2xl mt-1" />
            <div>
              <h2 className="font-bold text-green-800">Product Uploads</h2>
              <p className="text-gray-600">Upload, edit, and manage your own farm products. Connect with buyers and grow your business.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FaUserShield className="text-green-600 text-2xl mt-1" />
            <div>
              <h2 className="font-bold text-green-800">Admin & Customer Roles</h2>
              <p className="text-gray-600">Admins manage posts, products, messages, and shop orders. Customers can shop, post, and chat freely.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <FaUsers className="text-green-600 text-2xl" />
          <span className="text-green-800 font-semibold">Community-Driven</span>
        </div>
        <p className="text-gray-700 mb-2">
          Whether you’re new to farming or a seasoned expert, AgriConnect provides the tools and community to help you thrive. Share your experiences, learn from others, and be part of a growing agricultural movement.
        </p>
        <p className="text-gray-500 text-sm mt-6">Built with the MERN stack for real-time interaction, secure data, and a seamless user experience.</p>
      </div>
    </div>
  );
}

export default About;
