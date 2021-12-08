const log = require('../../../libs/logger');

const PhraseTranslation = require('../../../models/PhraseTranslation');

const createPhraseTranslation = async ({
  phrase,
  translations,
}) => {
  try {
    if (!phrase) {
      return {
        status: false,
        message: 'No phrase',
      };
    }

    if (!translations || !translations.length) {
      return {
        status: false,
        message: 'No or empty translations',
      };
    }

    const newPhraseTranslation = new PhraseTranslation({
      phrase: phrase.trim(),
      translation: translations[0],
    });

    await newPhraseTranslation.save();

    return {
      status: true,
      result: newPhraseTranslation._doc,
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
  createPhraseTranslation,
};
