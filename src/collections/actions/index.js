const request = require('../../request');
const routes = require('../../config/routes');

module.exports = {
  createCollection: require('./create')({ request, routes }),
  findCollection: require('./find')({ request, routes }),
  addFilesToCollection: require('./add-files')({ request, routes }),
  addLinksToCollection: require('./add-links')({ request, routes }),
  uploadFile: require('./upload-file')({ request, routes }),
};
