const log = require('../../libs/logger');

const {
  getPhraseTranslation,
} = require('./utils/get-phrase-translation');

const {
  createUserQuizletRequest,
} = require('../user-quizlet-requests/utils/create-user-quizlet-request');

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

  await createUserQuizletRequest({
    userId: user._id,
    phrase,
  });

  const resultPhraseTranslation = resultGetPhraseTranslation.result;

  if (!resultPhraseTranslation
    || !resultPhraseTranslation.responses || !resultPhraseTranslation.responses.length
  ) {
    return res.json({
      status: true,
      result: [],
    });
  }

  const { data } = resultGetPhraseTranslation.result.responses[0];

  if (!data) {
    return res.json({
      status: true,
      result: [],
    });
  }

  if (!data.suggestions.suggestions
    || !data.suggestions.suggestions.length) {
    return res.json({
      status: true,
      result: [],
    });
  }

  return res.json({
    status: true,
    result: data.suggestions.suggestions.map(suggestion => suggestion.text),
  });
};
