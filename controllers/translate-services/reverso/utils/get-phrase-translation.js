const ReversoAPI = require('reverso-api');

const log = require('../../../../libs/logger');

const reverso = new ReversoAPI();

const getPhraseTranslation = async ({
  phrase,
}) => {
  try {
    const result = await reverso.getTranslation(phrase, 'English', 'Russian');

    if (!result) {
      return {
        status: true,
        result: [],
      };
    }

    return {
      status: true,
      result: result.translation,
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
  getPhraseTranslation,
};
