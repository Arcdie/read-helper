const mongodb = require('mongodb');

const getUnix = targetDate =>
  parseInt((targetDate ? new Date(targetDate) : new Date()).getTime() / 1000, 10);

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const generateMongoId = () => {
  return new mongodb.ObjectID();
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = {
  sleep,
  getUnix,
  getRandomNumber,
  generateMongoId,
};
