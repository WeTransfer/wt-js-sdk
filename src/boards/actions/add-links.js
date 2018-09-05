const WTError = require('../../error');
const logger = require('../../config/logger');
const futureLink = require('../models/future-link');
const RemoteLink = require('../models/remote-link');

module.exports = function({ request, routes }) {
  /**
   * Add links to an existing collection.
   * @param   {Object}  collection Existing collection object
   * @param   {Array}   links      A collection of links to be added to the collection
   * @returns {Promise}            A collection of created items
   */
  return async function addLinksToCollection(collection, links) {
    try {
      logger.info(
        `Adding ${links.length} links to collection with ID ${collection.id}`
      );
      const response = await request.send(
        routes.collections.addLinks(collection),
        links.map(futureLink)
      );
      const collectionItems = response.map((item) => new RemoteLink(item));
      collection.addLinks(...collectionItems);

      return collectionItems;
    } catch (error) {
      throw new WTError(
        'There was an error when adding links to the collection.',
        error
      );
    }
  };
};
