const logger = require('../../config/logger');

module.exports = function({ request, routes }) {
  /**
   * Get an upload URL for an specific file part
   * @param   {Object}  board      Board item.
   * @param   {Object}  file       Item containing information about number of parts, upload url, etc.
   * @param   {Number}  partNumber Which part number to upload
   * @returns {Promise}            An object containing the upload url, expiring date, etc
   */
  return async function getFileUploadURLToBoard(
    boardId,
    fileId,
    partNumber,
    multipartId
  ) {
    logger.info(
      `Requesting S3 upload URL for part #${partNumber} of file ${fileId}`
    );

    const board = {
      id: boardId,
    };
    const file = {
      id: fileId,
      multipart: {
        id: multipartId,
      },
    };
    return request.send(routes.boards.multipart(board, file, partNumber));
  };
};
