const request = require('../../request');
const routes = require('../../config/routes');

module.exports = {
  create: require('./create')({ request, routes })
};
