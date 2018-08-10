const WTError = require('../../error');
const logger = require('../../config/logger');
const futureCollection = require('../models/future-collection');
const RemoteCollection = require('../models/remote-collection');

module.exports = function({ request, routes }) {
  /**
   * Creates a new collection, without items.
   * @param   {Object}  collection A collection object without items.
   * @returns {Promise}            A collection object
   */
  return async function createCollection(collection) {
    try {
      logger.info('Creating a new collection.');
      const response = await request.send(
        routes.collections.create,
        futureCollection(collection)
      );
      logger.info(`Collection created with id ${response.id}.`);
      return new RemoteCollection(response);
    } catch (error) {
      throw new WTError(
        'There was an error when creating the collection.',
        error
      );
    }
  };
};
