const request = require('../../request');
const routes = require('../../config/routes');
const RemoteTransfer = require('../models/remote-transfer');

const createUploadUrl = require('../../actions/create-upload-url')({
  request,
  multipartRoute: routes.transfers.multipart,
});
const completeFileUpload = require('../../actions/complete-file-upload')({
  request,
  uploadCompleteRoute: routes.transfers.uploadComplete,
});
const MultipartChunk = require('../../actions/multipart-chunk');
const createMultipartChunksForFile = require('../../actions/create-chunks-for-file')(
  {
    MultipartChunk,
  }
);
const uploadChunk = require('../../actions/upload-chunk')({ request });
const enqueueChunks = require('../../actions/enqueue-chunks')({ uploadChunk });
const finalizeTransfer = require('./finalize')({ request, routes });
const createTransfer = require('./create')({
  request,
  routes,
  enqueueChunks,
  createUploadUrl,
  createMultipartChunksForFile,
  completeFileUpload,
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
  // getFileUploadURLToTransfer: getUploadUrl,
  completeFileUploadToTransfer: completeFileUpload,
  finalizeTransfer,
};
