const { get } = require('lodash');

const WTError = require('./error');
const logger = require('./config/logger');

const authorize = require('./authorize');
const request = require('./request');

const { createCollection, findCollection } = require('./collections');
const { createTransfer, findTransfer } = require('./transfers');

const {
  addFilesToCollection,
  addLinksToCollection,
  uploadFileToCollection,
  getFileUploadURLToCollection,
  completeFileUploadToCollection,
} = require('./collections/actions');

const {
  uploadFileToTransfer,
  finalizeTransfer,
} = require('./transfers/actions');

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
      uploadFile: uploadFileToCollection,
      getFileUploadURL: getFileUploadURLToCollection,
      completeFileUpload: completeFileUploadToCollection,
    },
    transfer: {
      create: createTransfer,
      find: findTransfer,
      uploadFile: uploadFileToTransfer,
      finalize: finalizeTransfer,
    },
  };
};
