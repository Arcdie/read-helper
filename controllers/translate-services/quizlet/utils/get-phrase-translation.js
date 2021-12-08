const axios = require('axios');

const log = require('../../../../libs/logger');

const getPhraseTranslation = async ({
  phrase,
}) => {
  try {
    const resultRequest = await axios({
      method: 'get',
      url: `https://quizlet.com/webapi/3.2/suggestions/definition?word=${phrase}&limit=3&defLang=ru&wordLang=en&localTermId=-1`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resultPhraseTranslation = resultRequest.data;

    if (!resultPhraseTranslation
      || !resultPhraseTranslation.responses
      || !resultPhraseTranslation.responses.length
    ) {
      return {
        status: true,
        result: [],
      };
    }

    const { data } = resultPhraseTranslation.responses[0];

    if (!data) {
      return {
        status: true,
        result: [],
      };
    }

    if (!data.suggestions.suggestions
      || !data.suggestions.suggestions.length) {
      return {
        status: true,
        result: [],
      };
    }

    return {
      status: true,
      result: data.suggestions.suggestions.map(suggestion => suggestion.text),
    };
  } catch (error) {
    log.error(error.message);

    return {
      status: false,
      message: error.message,
    };
  }
};

module.exports = {
  getPhraseTranslation,
};
