const authorize = require('./authorize');
const WTError = require('./error');
const request = require('./request');
const { create } = require('./transfer');
const {
  addItems,
  addFiles,
  addLinks,
  uploadFile,
  completeFileUpload
} = require('./items');

module.exports = async function createWTClient(apiKey) {
  if (!apiKey) {
    throw new WTError('No API Key provided');
  }

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
