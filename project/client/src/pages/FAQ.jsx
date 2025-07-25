import { useState } from 'react';
import { FaQuestionCircle, FaShoppingCart, FaUserShield, FaComments, FaUserPlus, FaHandsHelping, FaEnvelope } from 'react-icons/fa';

function FAQ() {
  const faqs = [
    {
      q: "Is AgriConnect free to use?",
      a: "Yes! It’s completely free to sign up, post, and interact with other farmers.",
      icon: <FaUserPlus className="inline mr-2 text-green-600" />,
    },
    {
      q: "Who can join?",
      a: "Anyone interested in agriculture — from small-scale farmers to large agribusiness professionals.",
      icon: <FaHandsHelping className="inline mr-2 text-green-600" />,
    },
    {
      q: "Can I post questions and get help?",
      a: "Absolutely. Our platform is designed to help users get answers from peers and experts.",
      icon: <FaQuestionCircle className="inline mr-2 text-green-600" />,
    },
    {
      q: "What is AgriChatShop?",
      a: "AgriChatShop is our online shop where you can order farm requirements. Admins manage the shop items, and customers can place orders directly from the shop page.",
      icon: <FaShoppingCart className="inline mr-2 text-green-600" />,
    },
    {
      q: "How do I place an order in AgriChatShop?",
      a: "Go to the AgriChatShop page, add items to your order, adjust quantities, and click 'Place Order'. You can view your order history on the same page.",
      icon: <FaShoppingCart className="inline mr-2 text-green-600" />,
    },
    {
      q: "How do I upload and manage my products?",
      a: "Go to the Market page. You can upload new products, and if you are the owner, you can edit or delete your products.",
      icon: <FaShoppingCart className="inline mr-2 text-green-600" />,
    },
    {
      q: "What can admins do?",
      a: "Admins can manage all posts, products, messages, and shop items. They can also view and update all customer orders in AgriChatShop.",
      icon: <FaUserShield className="inline mr-2 text-green-600" />,
    },
    {
      q: "How does the chatroom work?",
      a: "The chatroom lets you chat live with other users, reply to messages, use emojis, and see who is online. Admins can clear all messages if needed.",
      icon: <FaComments className="inline mr-2 text-green-600" />,
    },
    {
      q: "How do I contact support?",
      a: "Use the Contact page to send us a message. We’re here to help!",
      icon: <FaEnvelope className="inline mr-2 text-green-600" />,
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState('');

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(search.toLowerCase()) ||
    faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-green-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Frequently Asked Questions</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-green-300"
          />
        </div>
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <p className="text-gray-500">No questions found.</p>
          ) : (
            filteredFaqs.map((item, index) => (
              <div key={index} className="border-b pb-2">
                <button
                  className="flex items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-green-200"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span className="text-lg font-semibold text-green-800 flex-1">{item.q}</span>
                  <span className="ml-2 text-green-600">{openIndex === index ? '-' : '+'}</span>
                </button>
                {openIndex === index && (
                  <div className="mt-2 text-gray-700 animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="mt-8 text-center">
          <a
            href="/contact"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
