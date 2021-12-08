const log = require('../../../libs/logger');

const {
  getPhraseTranslation,
} = require('./utils/get-phrase-translation');

const {
  createUserSearchRequest,
} = require('../../user-search-requests/utils/create-user-search-request');

const {
  TYPES_RESOURCES,
} = require('../../user-search-requests/constants');

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

  const resultGetPhraseTranslation = await getPhraseTranslation({
    phrase: phrase.trim(),
  });

  if (!resultGetPhraseTranslation || !resultGetPhraseTranslation.status) {
    const message = resultGetPhraseTranslation.message || 'Cant getPhraseTranslation';

    log.warn(message);

    return res.json({
      status: false,
      message,
    });
  }

  const resultCreate = await createUserSearchRequest({
    userId: user._id,
    phrase,
    typeResource: TYPES_RESOURCES.get('reverso'),
  });

  if (!resultCreate || !resultCreate.status) {
    log.warn(resultCreate.message || 'Cant createUserSearchRequest');
  }

  return res.json({
    status: true,
    result: resultGetPhraseTranslation.result,
  });
};
