const WTError = require('../../error');
const logger = require('../../config/logger');
const futureFile = require('../models/future-file');
const RemoteFile = require('../models/remote-file');

module.exports = function({ request, routes }) {
  /**
   * Add files to an existing collection.
   * @param   {Object}  collection Existing collection object
   * @param   {Array}   files      A collection of files to be added to the collection
   * @returns {Promise}            A collection of created items
   */
  return async function addFilesToCollection(collection, files) {
    try {
      logger.info(
        `Adding ${files.length} files to collection with ID ${collection.id}`
      );
      const response = await request.send(
        routes.collections.addFiles(collection),
        files.map(futureFile)
      );
      const collectionItems = response.map((item) => new RemoteFile(item));
      collection.addFiles(...collectionItems);

      return collectionItems;
    } catch (error) {
      throw new WTError(
        'There was an error when adding files to the collection.',
        error
      );
    }
  };
};
