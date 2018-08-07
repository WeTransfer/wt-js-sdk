const request = require('../request');
const routes = require('../config/routes');

const authorize = require('./authorize');

module.exports = authorize({
  request,
  routes,
});
