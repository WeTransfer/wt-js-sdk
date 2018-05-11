const routes = require('../config/routes');
const WTError = require('../error');
const request = require('../request');

module.exports = async function authorize() {
  try {
    return await request.send(routes.authorize);
  } catch (error) {
    throw new WTError(
      'The authorization call failed and no usable JWT could be found there. Please check your API Key.',
      error
    );
  }
};
