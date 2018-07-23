const logger = require('../../config/logger');

module.exports = function({ request, routes }) {
  /**
   * Get an upload URL for an specific file part
   * @param   {Object}  file       Item containing information about number of parts, upload url, etc.
   * @param   {Number}  partNumber A collection of items to be added to the transfer
   * @returns {Promise}            A collection of created items
   */
  return async function getUploadURL(file, partNumber) {
    logger.info(
      `Requesting S3 upload URL for part #${partNumber} of file ${file.id}`
    );

    return request.send(routes.multipart(file, partNumber));
  };
};
