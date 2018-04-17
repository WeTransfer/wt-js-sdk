const authorize = require('./authorize');
const request = require('./request');
const transfer = require('./transfer');

module.exports = function createWTClient(apiKey) {
  request.apiKey = apiKey;

  return {
    authorize,
    transfer
  };
};
