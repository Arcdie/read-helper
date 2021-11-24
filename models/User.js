const mongoose = require('mongoose');

const User = new mongoose.Schema({
  name: {
    unique: true,
    type: String,
    required: true,
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
