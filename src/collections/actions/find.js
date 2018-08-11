const WTError = require('../../error');
const logger = require('../../config/logger');
const RemoteCollection = require('../models/remote-collection');

module.exports = function({ request, routes }) {
  /**
   * Retrieve a collection given an id
   * @param   {strint}  collectionId An existing? collection id
   * @returns {Promise}              A collection object
   */
  return async function findCollection(collectionId) {
    try {
      logger.info('Retrieving a collection.');
      const response = await request.send(
        routes.collections.find(collectionId)
      );
      return new RemoteCollection(response);
    } catch (error) {
      throw new WTError(
        'There was an error when finding the collection.',
        error
      );
    }
  };
};
