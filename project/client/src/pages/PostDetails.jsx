import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/CommentSection';

function PostDetail() {
  const { id } = useParams(); // post ID from URL
  const [post, setPost] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error('Error fetching post:', err);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <div className="p-6">Loading post...</div>;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-green-700 mb-2">Post by {post.username}</h2>
        <p className="text-gray-800 mb-2">{post.content}</p>
        <p className="text-xs text-gray-500">
          Posted on {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>

      <CommentSection postId={id} />
    </div>
  );
}

export default PostDetail;
