const request = require('../../request');
const routes = require('../../config/routes');

const {
  futureFile,
  RemoteFile,
  futureLink,
  RemoteLink,
  normalizeItem,
  normalizeResponseItem,
} = require('../models');

const sendItems = require('./send-items')({ request, routes });

module.exports = {
  addItems: require('./add-items')({
    sendItems,
    normalizeItem,
    normalizeResponseItem,
  }),
  addFiles: require('./add-files')({ sendItems, futureFile, RemoteFile }),
  addLinks: require('./add-links')({ sendItems, futureLink, RemoteLink }),
  uploadFile: require('./upload-file')({ request, routes }),
  completeFileUpload: require('./complete-file-upload')({ request, routes }),
  getUploadURL: require('./get-upload-url')({ request, routes }),
};
