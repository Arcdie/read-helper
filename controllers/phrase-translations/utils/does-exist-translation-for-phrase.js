const log = require('../../../libs/logger');

const PhraseTranslation = require('../../../models/PhraseTranslation');

const doesExistTranslationForPhrase = async ({
  phrase,
}) => {
  try {
    const phraseTranslationDoc = await PhraseTranslation.findOne({
      phrase: phrase.trim(),
    }, {
      translation: 1,
    }).exec();

    if (!phraseTranslationDoc) {
      return {
        status: true,
        result: [],
      };
    }

    return {
      status: true,
      result: [phraseTranslationDoc.translation],
    };
  } catch (error) {
    log.error(error.message);

    return {
      status: false,
      result: error.message,
    };
  }
};

module.exports = {
  doesExistTranslationForPhrase,
};
