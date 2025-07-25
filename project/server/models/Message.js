const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    edited: { type: Boolean, default: false },
    reactions: {
  type: Map,
  of: Number, // e.g., { 👍: 2, ❤️: 1 }
  default: {},
    },
     replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Message', messageSchema);
