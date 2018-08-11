const { get } = require('lodash');

const WTError = require('./error');
const logger = require('./config/logger');

const authorize = require('./authorize');
const request = require('./request');

const { createCollection, findCollection } = require('./collections');
const {
  addFilesToCollection,
  addLinksToCollection,
  uploadFile,
  //   addItems,
  //   addFiles,
  //   addLinks,
  //   completeFileUpload,
  //   getUploadURL,
} = require('./collections/actions');

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
    collection: {
      create: createCollection,
      find: findCollection,
      addFiles: addFilesToCollection,
      addLinks: addLinksToCollection,
      uploadFile: uploadFile,
      // addItems,
      // addLinks,
      // completeFileUpload,
    },
    // file: {
    //   getUploadURL,
    // },
  };
};
