const logger = require('../../config/logger');

module.exports = function({ request, routes }) {
  /**
   * Get an upload URL for an specific file part
   * @param   {Object}  transfer   Transfer item.
   * @param   {Object}  file       Item containing information about number of parts, upload url, etc.
   * @param   {Number}  partNumber Which part number to upload
   * @returns {Promise}            An object containing the upload url, expiring date, etc
   */
  return async function getFileUploadURLToTransfer(
    transferId,
    fileId,
    partNumber
  ) {
    logger.info(
      `Requesting S3 upload URL for part #${partNumber} of file ${fileId}`
    );

    const transfer = {
      id: transferId,
    };
    const file = {
      id: fileId,
    };
    return request.send(routes.transfers.multipart(transfer, file, partNumber));
  };
};
