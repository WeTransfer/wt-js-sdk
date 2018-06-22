const request = require('../../request');
const routes = require('../../config/routes');

module.exports = {
  create: require('./create')({ request, routes }),
  createAndUpload: require('./create-and-upload')({ request, routes })
};
