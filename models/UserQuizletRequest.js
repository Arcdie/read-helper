const mongoose = require('mongoose');

const UserQuizletRequest = new mongoose.Schema({
  user_id: {
    required: true,
    type: mongoose.Schema.ObjectId,
  },

  phrase: {
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

module.exports = mongoose.model('UserQuizletRequest', UserQuizletRequest, 'user-quizlet-requests');
