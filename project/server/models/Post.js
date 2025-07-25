const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Optional: for quick display
  },
  { timestamps: true }
);

module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);
