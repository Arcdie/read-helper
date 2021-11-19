const mongodb = require('mongodb');

const getUnix = targetDate =>
  parseInt((targetDate ? new Date(targetDate) : new Date()).getTime() / 1000, 10);

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const generateMongoId = () => {
  return new mongodb.ObjectID();
};

module.exports = {
  sleep,
  getUnix,
  generateMongoId,
};
