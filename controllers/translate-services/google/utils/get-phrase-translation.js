const tunnel = require('tunnel');
const translate = require('@vitalets/google-translate-api');

const log = require('../../../../libs/logger');

const getPhraseTranslation = async ({
  phrase,
  doesUseProxy,
}) => {
  try {
    const funcParams = [phrase, {
      from: 'en',
      to: 'ru',
    }];

    if (doesUseProxy) {
      funcParams.push({
        agent: tunnel.httpsOverHttp({
          proxy: {
            // host: proxyOptions.ip,
            // port: proxyOptions.port,
            // proxyAuth: ':2dd791ad49',

            headers: {
              'User-Agent': 'Node',
            },
          },
        }),
      });
    }

    const result = await translate(...funcParams);

    if (!result
      || !result.text) {
      return {
        status: true,
        result: [],
      };
    }

    return {
      status: true,
      result: [result.text],
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
