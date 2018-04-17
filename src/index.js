const authorize = require('./authorize');
const request = require('./request');
const transfer = require('./transfer');

module.exports = async function createWTClient(apiKey) {
  if (!apiKey) {
    throw new Error('No API Key provided');
  }

  request.apiKey = apiKey;
  request.jwt = (await authorize()).token;

  return {
    authorize,
    transfer
  };
};
