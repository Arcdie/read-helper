const mongoose = require('mongoose');

const Book = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  path_to_book: {
    type: String,
    required: true,
  },

  is_active: {
    type: Boolean,
    default: true,
  },

  created_by: {
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

module.exports = mongoose.model('Book', Book, 'books');
