const axios = require('axios');

const getPhraseTranslation = async ({
  phrase,
}) => {
  const responseGetInfo = await axios({
    method: 'get',
    url: `https://quizlet.com/webapi/3.2/suggestions/definition?word=${phrase}&limit=3&defLang=ru&wordLang=en&localTermId=-1`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    status: true,
    result: responseGetInfo.data,
  };
};

module.exports = {
  getPhraseTranslation,
};
