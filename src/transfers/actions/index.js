const request = require('../../request');
const routes = require('../../config/routes');

const uploadFileToTransfer = require('./upload-file')({ request, routes });
const finalizeTransfer = require('./finalize')({ request, routes });

module.exports = {
  createTransfer: require('./create')({
    request,
    routes,
    uploadFileToTransfer,
    finalizeTransfer,
  }),
  findTransfer: require('./find')({ request, routes }),
  getFileUploadURLToTransfer: require('./get-upload-url')({
    request,
    routes,
  }),
  completeFileUploadToTransfer: require('./complete-file-upload')({
    request,
    routes,
  }),
  finalizeTransfer: require('./finalize')({ request, routes }),
};
