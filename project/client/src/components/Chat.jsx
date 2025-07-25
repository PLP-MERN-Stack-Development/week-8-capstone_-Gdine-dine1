import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';

const API_URL = import.meta.env.VITE_API_URL;

function Chat() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [reactions, setReactions] = useState({});
  const [reactionTarget, setReactionTarget] = useState(null);

  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef();
  const user = JSON.parse(localStorage.getItem('user'));
  const socketRef = useRef();

  useEffect(() => {
    if (!user?.username) return;
    socketRef.current = io(API_URL);
    socketRef.current.connect();
    socketRef.current.emit('online', user.username);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();

    socketRef.current.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on('messageUpdated', (updated) => {
      setMessages((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
    });

    socketRef.current.on('messageDeleted', (id) => {
      setMessages((prev) => prev.filter((m) => m._id !== id));
    });

    socketRef.current.on('typing', (username) => {
      if (username !== user.username) {
        setTypingUser(`${username} is typing...`);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingUser(''), 2000);
      }
    });

    socketRef.current.on('usersOnline', (count) => {
      setOnlineCount(count);
    });

    socketRef.current.on('messageReacted', ({ messageId, emoji, username }) => {
      setReactions((prev) => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), { emoji, username }],
      }));
    });

    socketRef.current.on('clearAllMessages', () => {
      setMessages([]);
    });

    return () => {
      socketRef.current.off('receiveMessage');
      socketRef.current.off('messageUpdated');
      socketRef.current.off('messageDeleted');
      socketRef.current.off('typing');
      socketRef.current.off('usersOnline');
      socketRef.current.off('messageReacted');
      socketRef.current.off('clearAllMessages');
      socketRef.current.disconnect();
    };
  }, [user?.username]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = (e) => {
    setContent(e.target.value);
    socketRef.current.emit('typing', user?.username);
  };

  const sendMessage = async () => {
    if (!content.trim()) return;

    const newMessage = {
      sender: user.username,
      content,
      replyTo: replyTo?._id || null,
    };

    try {
      if (editingId) {
        const res = await axios.put(`${API_URL}/api/messages/${editingId}`, {
          content,
        });
        socketRef.current.emit('editMessage', res.data);
        setEditingId(null);
      } else {
        const res = await axios.post(`${API_URL}/api/messages`, newMessage);
        socketRef.current.emit('sendMessage', res.data);
      }
      setContent('');
      setReplyTo(null);
    } catch (err) {
      console.error('Send failed', err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/messages/${id}`);
      socketRef.current.emit('deleteMessage', id);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEmojiClick = (emoji) => {
    if (reactionTarget) {
      handleReaction(reactionTarget, emoji.emoji);
      setReactionTarget(null);
    } else {
      setContent((prev) => prev + emoji.emoji);
    }
  };

  const handleReaction = (messageId, emoji) => {
    socketRef.current.emit('reactMessage', { messageId, emoji, username: user.username });
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((msg) => {
      const date = new Date(msg.createdAt);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      const msgDate = date.toDateString();
      const label =
        msgDate === today.toDateString()
          ? 'Today'
          : msgDate === yesterday.toDateString()
          ? 'Yesterday'
          : msgDate;

      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(msg);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  const clearAllMessages = async () => {
    if (!window.confirm('Are you sure you want to clear all chats?')) return;
    try {
      await axios.delete(`${API_URL}/api/messages/admin/clear`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    } catch (err) {
      console.error('Clear failed', err);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1602169088182-7c36ec2fdf84?auto=format&fit=crop&w=1600&q=80")',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-100/80 to-green-300/60 z-0"></div>
      <div className="relative z-10">
        <div className="max-w-2xl mx-auto bg-white/90 shadow rounded-lg p-4 h-[90vh] flex flex-col backdrop-blur-sm">
          <div className="flex justify-between mb-2 items-center">
            <h2 className="text-xl font-bold text-green-700">🌿 AgriChat</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">🟢 {onlineCount} online</span>
              {user?.role === 'admin' && (
                <button
                  onClick={clearAllMessages}
                  className="text-red-600 hover:underline text-sm"
                >
                  🧹 Clear All
                </button>
              )}
            </div>
          </div>

          {typingUser && <div className="text-sm italic text-gray-500 mb-1">{typingUser}</div>}

          <div className="flex-1 overflow-y-auto border rounded p-2 bg-green-50 space-y-4">
            {Object.entries(groupedMessages).map(([label, msgs]) => (
              <div key={label}>
                <div className="text-center my-2">
                  <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-xs shadow-sm">
                    {label}
                  </span>
                </div>
                {msgs.map((msg) => {
                  const isOwn = msg.sender === user.username;
                  const repliedMsg = messages.find((m) => m._id === msg.replyTo);
                  return (
                    <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-start`}>
                      <div
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setReactionTarget(msg._id);
                          setShowEmoji(true);
                        }}
                        className={`relative max-w-xs md:max-w-sm px-4 py-2 rounded-lg shadow-md text-sm cursor-pointer ${
                          isOwn
                            ? 'bg-green-500 text-white rounded-br-none'
                            : 'bg-white border text-gray-800 rounded-bl-none pl-4'
                        }`}
                      >
                        {repliedMsg && (
                          <div className="text-[10px] text-gray-600 italic mb-1 border-l-4 pl-2 border-green-400">
                            Reply to <span className="font-semibold">{repliedMsg.sender}</span>: "{repliedMsg.content}"
                          </div>
                        )}
                        <p>{msg.content}</p>
                        <div className="text-[10px] mt-1 opacity-70 text-right">
                          <span className="italic mr-1">{isOwn ? 'You' : msg.sender}</span>
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1 text-[10px]">
                          {reactions[msg._id] && reactions[msg._id].length > 0 && (
                            <div className="flex gap-1 ml-2">
                              {reactions[msg._id].map((r, i) => (
                                <span key={i}>{r.emoji}</span>
                              ))}
                            </div>
                          )}
                          {isOwn ? (
                            <div className="flex gap-1 ml-auto">
                              <button
                                onClick={() => {
                                  setContent(msg.content);
                                  setEditingId(msg._id);
                                }}
                                className="text-blue-200 hover:text-white"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteMessage(msg._id)}
                                className="text-red-200 hover:text-white"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReplyTo(msg)}
                              className="text-green-600 hover:underline ml-auto"
                            >
                              Reply
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={scrollRef}></div>
          </div>

          {replyTo && (
            <div className="text-xs text-gray-600 italic mb-1 px-2">
              Replying to <span className="font-semibold">{replyTo.sender}</span>: "{replyTo.content}"
              <button onClick={() => setReplyTo(null)} className="ml-2 text-red-500">
                x
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => {
                setShowEmoji(!showEmoji);
                setReactionTarget(null);
              }}
              className="text-2xl"
            >
              😊
            </button>
            <textarea
              value={content}
              onChange={handleTyping}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 px-3 py-2 border rounded resize-none focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingId ? 'Update' : 'Send'}
            </button>
          </div>

          {showEmoji && (
            <div className="mt-2">
              <EmojiPicker onEmojiClick={(e) => handleEmojiClick(e)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
