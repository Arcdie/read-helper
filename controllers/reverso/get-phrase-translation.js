// const Reverso = require('reverso-api');

const log = require('../../libs/logger');

const {
  getPhraseTranslation,
} = require('./utils/get-phrase-translation');

// const {
//   createUserReversoRequest,
// } = require('../user-reverso-requests/utils/create-user-reverso-request');

// const reverso = new Reverso();

module.exports = async (req, res, next) => {
  const {
    body: {
      phrase,
    },

    user,
  } = req;

  if (!user) {
    return res.json({
      status: false,
      message: 'Not authorized',
    });
  }

  if (!phrase) {
    return res.json({
      status: false,
      message: 'No phrase',
    });
  }

  return res.json({
    status: true,
    // result: data.suggestions.suggestions.map(suggestion => suggestion.text),
  });
};
