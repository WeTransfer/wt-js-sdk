const request = require('../../request');
const routes = require('../../config/routes');

module.exports = {
  createCollection: require('./create')({ request, routes }),
  findCollection: require('./find')({ request, routes }),
  addFilesToCollection: require('./add-files')({ request, routes }),
  addLinksToCollection: require('./add-links')({ request, routes }),
  uploadFileToCollection: require('./upload-file')({ request, routes }),
  getFileUploadURLToCollection: require('./get-upload-url')({
    request,
    routes,
  }),
  completeFileUploadToCollection: require('./complete-file-upload')({
    request,
    routes,
  }),
};
