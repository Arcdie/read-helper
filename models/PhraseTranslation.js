const mongoose = require('mongoose');

const PhraseTranslation = new mongoose.Schema({
  phrase: {
    type: String,
    required: true,
    index: true,
  },

  translation: {
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

module.exports = mongoose.model('PhraseTranslation', PhraseTranslation, 'phrase-translations');
