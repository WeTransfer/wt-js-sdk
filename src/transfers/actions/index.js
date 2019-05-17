const request = require('../../request');
const routes = require('../../config/routes');
const RemoteTransfer = require('../models/remote-transfer');

const getUploadUrl = require('../../actions/get-upload-url')({
  request,
  multipartRoute: routes.transfers.multipart,
});
const uploadChunk = require('../../actions/upload-chunk')({
  request,
  getUploadUrl,
});
const enqueueChunk = require('../../actions/queues/chunks-queue')({
  uploadChunk,
});
const completeFileUpload = require('../../actions/complete-file-upload')({
  request,
  uploadCompleteRoute: routes.transfers.uploadComplete,
});
const uploadFileToTransfer = require('../../actions/upload-file')({
  enqueueChunk,
  completeFileUpload,
});
const enqueueFileTask = require('../../actions/queues/files-queue')({
  uploadFile: uploadFileToTransfer,
});
const finalizeTransfer = require('./finalize')({ request, routes });
const createTransfer = require('./create')({
  request,
  routes,
  enqueueFileTask,
  finalizeTransfer,
});
const findTransfer = require('../../actions/find')({
  request,
  findRoute: routes.transfers.find,
  RemoteItem: RemoteTransfer,
});

module.exports = {
  createTransfer,
  findTransfer,
  getFileUploadURLToTransfer: getUploadUrl,
  completeFileUploadToTransfer: completeFileUpload,
  finalizeTransfer,
};
