import { useState } from 'react';
import axios from 'axios';

function PostForm({ onPostCreated }) {
  const [content, setContent] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      await axios.post(`${API_URL}/api/posts`, 
        { content }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      onPostCreated(); // refresh post list
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create post.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Share a farming idea or question..."
        className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        rows="3"
        required
      ></textarea>
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Post
      </button>
    </form>
  );
}

export default PostForm;
