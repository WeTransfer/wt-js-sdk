const { get } = require('lodash');

const WTError = require('./error');
const logger = require('./config/logger');

const authorize = require('./authorize');
const request = require('./request');

const { createBoard, findBoard } = require('./boards');
const { createTransfer, findTransfer } = require('./transfers');

const {
  addFilesToBoard,
  addLinksToBoard,
  getFileUploadURLToBoard,
  completeFileUploadToBoard,
} = require('./boards/actions');

const {
  completeFileUploadToTransfer,
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
  request.configure(options);

  return {
    authorize,
    board: {
      create: createBoard,
      find: findBoard,
      addFiles: addFilesToBoard,
      addLinks: addLinksToBoard,
      getFileUploadURL: getFileUploadURLToBoard,
      completeFileUpload: completeFileUploadToBoard,
    },
    transfer: {
      create: createTransfer,
      find: findTransfer,
      getFileUploadURL: getFileUploadURLToTransfer,
      completeFileUpload: completeFileUploadToTransfer,
      finalize: finalizeTransfer,
    },
  };
};
