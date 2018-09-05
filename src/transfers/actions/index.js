const request = require('../../request');
const routes = require('../../config/routes');

const uploadFileToTransfer = require('./upload-file')({ request, routes });
const finalizeTransfer = require('./finalize')({ request, routes });

module.exports = {
  createTransfer: require('./create')({ request, routes, uploadFileToTransfer, finalizeTransfer }),
  // findTransfer: require('./find')({ request, routes }),
  // uploadFileToTransfer: require('./upload-file')({ request, routes }),
  // finalizeTransfer: require('./finalize')({ request, routes }),
  // getFileUploadURLToCollection: require('./get-upload-url')({
  //   request,
  //   routes,
  // }),
  // completeFileUploadToCollection: require('./complete-file-upload')({
  //   request,
  //   routes,
  // }),
};
