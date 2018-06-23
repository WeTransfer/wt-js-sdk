const request = require('../../request');
const routes = require('../../config/routes');

const {
  futureFile,
  RemoteFile,
  futureLink,
  RemoteLink,
  normalizeItem,
  normalizeResponseItem
} = require('../models');

module.exports = {
  addItems: require('./add-items')({
    request,
    routes,
    normalizeItem,
    normalizeResponseItem
  }),
  addFiles: require('./add-files')({ request, routes, futureFile, RemoteFile }),
  addLinks: require('./add-links')({ request, routes, futureLink, RemoteLink }),
  uploadFile: require('./upload-file')({ request, routes }),
  completeFileUpload: require('./complete-file-upload')({ request, routes })
};
