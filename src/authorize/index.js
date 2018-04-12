const routes = require('../config/routes');
const request = require('../request');

module.exports = async function authorize() {
  const auth = await request.send(routes.authorize);
  request.jwt = auth.token;
  return auth;
};
