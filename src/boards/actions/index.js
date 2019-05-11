const request = require('../../request');
const routes = require('../../config/routes');
const RemoteBoard = require('../models/remote-board');

const createBoard = require('./create')({ request, routes });
const findBoard = require('../../actions/find')({
  request,
  findRoute: routes.boards.find,
  RemoteItem: RemoteBoard,
});
const getUploadUrl = require('../../actions/get-upload-url')({
  request,
  multipartRoute: routes.boards.multipart,
});
const uploadChunk = require('../../actions/upload-chunk')({
  request,
});
const enqueueChunk = require('../../actions/queues/chunks-queue')({
  uploadChunk,
});
const completeFileUpload = require('../../actions/complete-file-upload')({
  request,
  uploadCompleteRoute: routes.boards.uploadComplete,
});
const uploadFileToBoard = require('../../actions/upload-file')({
  getUploadUrl,
  enqueueChunk,
  completeFileUpload,
});
const addFilesToBoard = require('./add-files')({
  request,
  routes,
  uploadFileToBoard,
});
const addLinksToBoard = require('./add-links')({ request, routes });

module.exports = {
  createBoard,
  findBoard,
  addFilesToBoard,
  addLinksToBoard,
  getFileUploadURLToBoard: getUploadUrl,
  completeFileUploadToBoard: completeFileUpload,
};
