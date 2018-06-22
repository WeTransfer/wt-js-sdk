const request = require('../../request');
const routes = require('../../config/routes');

module.exports = {
  addItems: require('./add-items')({ request, routes }),
  uploadFile: require('./upload-file')({ request, routes }),
  completeFileUpload: require('./complete-file-upload')({ request, routes })
};
