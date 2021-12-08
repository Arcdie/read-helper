const mongoose = require('mongoose');

const {
  TYPES_RESOURCES,
} = require('../controllers/user-search-requests/constants');

const typesResources = [...TYPES_RESOURCES.values()];

const UserSearchRequest = new mongoose.Schema({
  user_id: {
    required: true,
    type: mongoose.Schema.ObjectId,
  },

  phrase: {
    type: String,
    required: true,
  },

  resource: {
    type: String,
    required: true,
    enum: typesResources,
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

module.exports = mongoose.model('UserSearchRequest', UserSearchRequest, 'user-search-requests');
