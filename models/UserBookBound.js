const mongoose = require('mongoose');

const User = new mongoose.Schema({
  user_id: {
    required: true,
    type: mongoose.Schema.ObjectId,
  },

  book_id: {
    required: true,
    type: mongoose.Schema.ObjectId,
  },

  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },

  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('User', User, 'users');
