const request = require('../../request');
const routes = require('../../config/routes');

module.exports = {
  createCollection: require('./create')({ request, routes }),
  addFilesToCollection: require('./add-files')({ request, routes }),
  uploadFile: require('./upload-file')({ request, routes }),
};
