import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      alert('Failed to fetch posts: ' + (err.response?.data?.error || err.message));
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`${API_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch {
      alert('Delete failed');
    }
  };

  const startEdit = (post) => {
    setEditingId(post._id);
    setEditContent(post.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/posts/${id}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchPosts();
    } catch {
      alert('Edit failed');
    }
  };

  const toggleLike = async (postId) => {
    try {
      await axios.put(
        `${API_URL}/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="px-4 py-6">
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts yet.</p>
      ) : (
        posts.map(post => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow p-4 mb-4 border border-green-100"
          >
            {editingId === post._id ? (
              <>
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full border rounded p-2 mb-2"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(post._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <Link to={`/posts/${post._id}`} className="flex-1 hover:bg-green-50 rounded px-1 py-1">
                    <p className="text-gray-800">{post.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Posted by {post.username || 'Unknown'} on {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </Link>
                  <button
                    onClick={() => toggleLike(post._id)}
                    className="text-red-500 text-sm flex items-center gap-1 ml-4 hover:scale-105 transition"
                    title="Like post"
                  >
                    <FaHeart className="text-lg" />
                    <span>{post.likes?.length || 0}</span>
                  </button>
                </div>

                {user?.id === post.userId && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => startEdit(post)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PostList;
