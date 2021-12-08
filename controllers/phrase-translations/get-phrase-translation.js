const log = require('../../libs/logger');

const {
  getPhraseTranslation: getPhraseTranslationFromGoogle,
} = require('../translate-services/google/utils/get-phrase-translation');

const {
  getPhraseTranslation: getPhraseTranslationFromQuizlet,
} = require('../translate-services/quizlet/utils/get-phrase-translation');

const {
  getPhraseTranslation: getPhraseTranslationFromReverso,
} = require('../translate-services/reverso/utils/get-phrase-translation');

const {
  createUserSearchRequest,
} = require('../user-search-requests/utils/create-user-search-request');

const {
  createPhraseTranslation,
} = require('./utils/create-phrase-translation');

const {
  doesExistTranslationForPhrase,
} = require('./utils/does-exist-translation-for-phrase');

const {
  TYPES_RESOURCES,
} = require('../user-search-requests/constants');

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

  const resultGetTranslationFromBase = await doesExistTranslationForPhrase({
    phrase,
  });

  if (!resultGetTranslationFromBase || !resultGetTranslationFromBase.status) {
    const message = resultGetTranslationFromBase.message || 'Cant doesExistTranslationForPhrase';
    log.warn(message);

    return res.json({
      status: false,
      message,
    });
  }

  if (resultGetTranslationFromBase.result
    && resultGetTranslationFromBase.result.length) {
    return res.json({
      status: true,
      result: resultGetTranslationFromBase.result,
    });
  }

  let execFunc;
  let typeResource;
  const numberWords = phrase.toString().split(' ');

  if (numberWords.length === 1) {
    execFunc = getPhraseTranslationFromQuizlet;
    typeResource = TYPES_RESOURCES.get('quizlet');
  } else {
    execFunc = getPhraseTranslationFromGoogle;
    typeResource = TYPES_RESOURCES.get('google');
  }

  let resultGetPhraseTranslation = await execFunc({
    phrase: phrase.trim(),
  });

  if (!resultGetPhraseTranslation || !resultGetPhraseTranslation.status) {
    const message = resultGetPhraseTranslation.message || 'Cant getPhraseTranslation';
    log.warn(`${typeResource}: ${message}`);

    typeResource = TYPES_RESOURCES.get('reverso');

    resultGetPhraseTranslation = await getPhraseTranslationFromReverso({
      phrase: phrase.trim(),
    });

    if (!resultGetPhraseTranslation || !resultGetPhraseTranslation.status) {
      const message = resultGetPhraseTranslation.message || 'Cant getPhraseTranslation';
      log.warn(`${typeResource}: ${message}`);

      return res.json({
        status: false,
        result: message,
      });
    }
  }

  if (resultGetPhraseTranslation.result
    && resultGetPhraseTranslation.result.length) {
    const resultCreatePhraseTranslation = await createPhraseTranslation({
      phrase: phrase.trim(),
      translations: resultGetPhraseTranslation.result,
    });

    if (!resultCreatePhraseTranslation || !resultCreatePhraseTranslation.status) {
      log.warn(resultCreatePhraseTranslation.message || 'Cant createPhraseTranslation');
    }
  }

  const resultCreateRequest = await createUserSearchRequest({
    userId: user._id,
    phrase,
    typeResource,
  });

  if (!resultCreateRequest || !resultCreateRequest.status) {
    log.warn(resultCreateRequest.message || 'Cant createUserSearchRequest');
  }

  return res.json({
    status: true,
    result: resultGetPhraseTranslation.result,
  });
};
