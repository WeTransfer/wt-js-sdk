const logger = require('../config/logger');

module.exports = function({ request, multipartRoute }) {
  /**
   * Get an upload URL for an specific file part
   * @param   {Object}  transferOrBoardId Board or Transfer id.
   * @param   {Object}  fileId            File identifier
   * @param   {Number}  partNumber        Which part number to upload
   * @param   {Number}  [multipartId]     Multipart identifier for files in boards
   * @returns {Promise}                   An object containing the upload url, expiring date, etc
   */
  return function getFileUploadURL(
    transferOrBoardId,
    fileId,
    partNumber,
    multipartId
  ) {
    logger.info(
      `Requesting S3 upload URL for part #${partNumber} of file ${fileId}`
    );

    const transferOrBoard = { id: transferOrBoardId };
    const file = { id: fileId };

    if (multipartId) {
      file.multipart = {
        id: multipartId,
      };
    }

    return request.send(multipartRoute(transferOrBoard, file, partNumber));
  };
};
