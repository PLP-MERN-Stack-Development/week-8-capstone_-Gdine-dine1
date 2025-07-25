import { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem("token");

  // ✅ Axios instance with Authorization header
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me');
        setUser(res.data);
        setNewBio(res.data.bio || '');
      } catch (err) {
        setError("Failed to load profile.");
        console.error("Fetch user error:", err);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await api.get('/users/me/posts');
        setPosts(res.data);
      } catch (err) {
        console.error("Fetch posts error:", err);
      }
    };

    if (token) {
      fetchUser();
      fetchPosts();
    } else {
      setError("You must be logged in to view your profile.");
    }
  }, [token]);

  const handleSave = async () => {
    try {
      const res = await api.put('/users/me', { bio: newBio });
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update bio:', err);
    }
  };

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow rounded p-6">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={`https://ui-avatars.com/api/?name=${user.username}`}
          alt="avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold text-green-700">{user.username}</h2>
          <p className="text-sm text-gray-500">
            Joined: {new Date(user.joinedAt || user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700">Bio</h3>
        {editing ? (
          <div>
            <textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              className="w-full border rounded p-2 mb-2"
            />
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 text-gray-800 px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-600">{user.bio || "No bio yet."}</p>
            <button
              onClick={() => setEditing(true)}
              className="mt-2 text-sm text-green-700 underline"
            >
              Edit Bio
            </button>
          </>
        )}
      </div>

      {/* Posts Section */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Posts by {user.username}</h3>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post._id} className="bg-green-50 p-3 rounded shadow-sm">
                <p>{post.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
