const request = require('../../request');
const routes = require('../../config/routes');

const uploadFileToBoard = require('./upload-file')({ request, routes });

module.exports = {
  createBoard: require('./create')({ request, routes }),
  findBoard: require('./find')({ request, routes }),
  addFilesToBoard: require('./add-files')({
    request,
    routes,
    uploadFileToBoard,
  }),
  addLinksToBoard: require('./add-links')({ request, routes }),
  getFileUploadURLToBoard: require('./get-upload-url')({
    request,
    routes,
  }),
  completeFileUploadToBoard: require('./complete-file-upload')({
    request,
    routes,
  }),
};
