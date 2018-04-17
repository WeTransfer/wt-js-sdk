const routes = require('../config/routes');
const request = require('../request');

module.exports = function authorize() {
  return request.send(routes.authorize);
};
