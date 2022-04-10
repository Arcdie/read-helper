const mongoose = require('mongoose');

const UserBookBound = new mongoose.Schema({
  user_id: {
    required: true,
    type: mongoose.Schema.ObjectId,
  },

  book_id: {
    required: true,
    type: mongoose.Schema.ObjectId,
  },

  is_active: {
    type: Boolean,
    default: true,
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

module.exports = mongoose.model('UserBookBound', UserBookBound, 'user-book-bounds');
