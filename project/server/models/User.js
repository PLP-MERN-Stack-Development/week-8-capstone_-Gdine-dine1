// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bio: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
