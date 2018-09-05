const logger = require('../../config/logger');

module.exports = function({ request, routes }) {
  /**
   * Get an upload URL for an specific file part
   * @param   {Object}  collection Collection item.
   * @param   {Object}  file       Item containing information about number of parts, upload url, etc.
   * @param   {Number}  partNumber Which part number to upload
   * @returns {Promise}            An object containing the upload url, expiring date, etc
   */
  return async function getFileUploadURLToCollection(
    collectionId,
    fileId,
    partNumber,
    multipartId
  ) {
    logger.info(
      `Requesting S3 upload URL for part #${partNumber} of file ${fileId}`
    );

    const collection = {
      id: collectionId,
    };
    const file = {
      id: fileId,
      multipart: {
        id: multipartId,
      },
    };
    return request.send(
      routes.collections.multipart(collection, file, partNumber)
    );
  };
};
