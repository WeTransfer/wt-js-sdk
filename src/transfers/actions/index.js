const request = require('../../request');
const routes = require('../../config/routes');

module.exports = {
  createTransfer: require('./create')({ request, routes }),
  findTransfer: require('./find')({ request, routes }),
  uploadFileToTransfer: require('./upload-file')({ request, routes }),
  finalizeTransfer: require('./finalize-transfer')({ request, routes }),
  // getFileUploadURLToCollection: require('./get-upload-url')({
  //   request,
  //   routes,
  // }),
  // completeFileUploadToCollection: require('./complete-file-upload')({
  //   request,
  //   routes,
  // }),
};
