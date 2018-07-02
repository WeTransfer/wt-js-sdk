const WTError = require('../error');
const logger = require('../config/logger');

module.exports = function({ request, routes }) {
  return async function authorize() {
    try {
      logger.info('Authorizing your API key.');
      return await request.send(routes.authorize);
    } catch (error) {
      throw new WTError(
        'The authorization call failed and no usable JWT could be found there. Please check your API Key.',
        error
      );
    }
  };
};
