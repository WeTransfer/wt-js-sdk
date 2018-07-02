const { get } = require('lodash');

const WTError = require('./error');
const logger = require('./config/logger');

const authorize = require('./authorize');
const request = require('./request');
const { create } = require('./transfer');
const {
  addItems,
  addFiles,
  addLinks,
  uploadFile,
  completeFileUpload
} = require('./items');

module.exports = async function createWTClient(
  apiKey,
  options = { logger: {} }
) {
  if (!apiKey) {
    throw new WTError('No API Key provided');
  }

  logger.setLoggerLevel(get(options, 'logger.level', 'info'));

  request.apiKey = apiKey;
  request.jwt = (await authorize()).token;

  return {
    authorize,
    transfer: {
      create,
      addFiles,
      addItems,
      addLinks,
      uploadFile,
      completeFileUpload
    }
  };
};
