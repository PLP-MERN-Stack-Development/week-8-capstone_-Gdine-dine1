import { useEffect, useState } from 'react';
import axios from 'axios';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(
        `${API_URL}/api/comments/${postId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
      fetchComments();
    } catch {
      alert('Failed to post comment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch {
      alert('Failed to delete comment');
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) return;
    try {
      await axios.put(
        `${API_URL}/api/comments/${id}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCommentId(null);
      setEditText('');
      fetchComments();
    } catch {
      alert('Failed to update comment');
    }
  };

  return (
    <div className="mt-8 max-w-2xl mx-auto bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4 text-green-700">Comments</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded p-2 mb-2"
          rows={3}
          placeholder="Write a comment..."
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          Post Comment
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        comments.map((c) => (
          <div
            key={c._id}
            className="border-t pt-2 mt-2 text-sm text-gray-800"
          >
            {editingCommentId === c._id ? (
              <div className="mb-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border rounded p-2 mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(c._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditText('');
                    }}
                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between">
                <div>
                  <p>{c.text}</p>
                  <span className="text-xs text-gray-500">
                    {c.username} · {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                {user?.id === c.userId && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-500 text-xs hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CommentSection;
