const request = require('../../request');
const routes = require('../../config/routes');

const getUploadUrl = require('../../actions/get-upload-url')({
  request,
  multipartRoute: routes.transfers.multipart,
});
const completeFileUpload = require('../../actions/complete-file-upload')({
  request,
  uploadCompleteRoute: routes.transfers.uploadComplete,
});
const uploadFileToTransfer = require('../../actions/upload-file')({
  request,
  getUploadUrl,
  completeFileUpload,
});
const finalizeTransfer = require('./finalize')({ request, routes });
const createTransfer = require('./create')({
  request,
  routes,
  uploadFileToTransfer,
  finalizeTransfer,
});
const findTransfer = require('./find')({ request, routes });

module.exports = {
  createTransfer,
  findTransfer,
  getFileUploadURLToTransfer: getUploadUrl,
  completeFileUploadToTransfer: completeFileUpload,
  finalizeTransfer,
};
