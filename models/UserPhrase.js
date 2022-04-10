const mongoose = require('mongoose');

const UserPhrase = new mongoose.Schema({
  user_id: {
    required: true,
    type: mongoose.Schema.ObjectId,
  },

  book_id: mongoose.Schema.ObjectId,

  phrase: {
    type: String,
    required: true,
  },

  phrase_translation: {
    type: String,
    required: true,
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

module.exports = mongoose.model('UserPhrase', UserPhrase, 'user-phrases');
