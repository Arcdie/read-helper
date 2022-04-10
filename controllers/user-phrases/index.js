const getUserPhrases = require('./get-user-phrases');
const createUserPhrase = require('./create-user-phrase');
const removeUserPhrase = require('./remove-user-phrase');

const changeActiveStatus = require('./change-active-status');

module.exports = {
  getUserPhrases,
  createUserPhrase,
  removeUserPhrase,

  changeActiveStatus,
};
