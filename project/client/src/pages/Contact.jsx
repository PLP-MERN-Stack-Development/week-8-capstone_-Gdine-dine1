import { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaUser, FaPaperPlane, FaWhatsapp, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${API_URL}/api/contact`, form);
      setSuccess('Message sent successfully! We will get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-xl shadow-md max-w-xl w-full">
        <div className="flex items-center justify-center mb-2">
          <FaEnvelope className="text-green-600 text-3xl mr-2" />
          <h1 className="text-3xl font-bold text-green-700">Contact Us</h1>
        </div>
        <p className="text-center text-gray-600 mb-6">We'd love to hear from you! Fill out the form below and our team will respond as soon as possible.</p>
        {success && <div className="mb-4 text-green-700 bg-green-100 border border-green-200 rounded p-2 text-center">{success}</div>}
        {error && <div className="mb-4 text-red-700 bg-red-100 border border-red-200 rounded p-2 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-green-400" />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-green-400" />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <textarea
            name="message"
            rows="4"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-lg"
          >
            <FaPaperPlane /> Send Message
          </button>
        </form>

        {/* More Contact Options */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2"><FaEnvelope /> Other Ways to Reach Us</h2>
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/254748653881"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:underline"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-2xl" /> WhatsApp: +254 748653881
            </a>
            <a
              href="tel:+254700000000"
              className="flex items-center gap-2 text-green-700 hover:underline"
              aria-label="Phone"
            >
              <FaPhone className="text-2xl" /> Phone: +254 748653881
            </a>
            <div className="flex items-center gap-2 text-green-700">
              <FaMapMarkerAlt className="text-2xl" />
              <span>123 Agri Street, Nairobi, Kenya</span>
            </div>
            <div className="flex gap-4 mt-2">
              <a href="https://facebook.com/agrichat" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook className="text-2xl text-blue-600 hover:scale-110 transition" />
              </a>
              <a href="https://twitter.com/agrichat" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="text-2xl text-blue-400 hover:scale-110 transition" />
              </a>
              <a href="https://instagram.com/agrichat" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="text-2xl text-pink-500 hover:scale-110 transition" />
              </a>
            </div>
            <div className="text-xs text-gray-500 mt-4">
              <strong>Office Hours:</strong> Mon-Fri, 8:00am - 5:00pm EAT<br />
              <strong>Response Time:</strong> Within 24 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
