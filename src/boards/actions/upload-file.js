const logger = require('../../config/logger');
const WTError = require('../../error');

module.exports = function({ request, routes }) {
  const getUploadUrl = require('./get-upload-url')({ request, routes });
  const completeFileUpload = require('./complete-file-upload')({
    request,
    routes,
  });

  /**
   * Uploads a chunk of the file to S3
   * @param   {Object}  board      Board item.
   * @param   {Object}  file       Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  data       File content
   * @param   {Array}   chunkSizes An array containing the chunk size for each part
   * @param   {Number}  partNumber Which part number we want to upload
   * @returns {Promise}            Empty response if everything goes well 🤔
   */
  function uploadPart(board, file, data, partNumber) {
    logger.debug(
      `[${file.name}] Requesting S3 upload URL for part #${partNumber}`
    );
    return getUploadUrl(board.id, file.id, partNumber, file.multipart.id).then(
      (multipartItem) => {
        logger.debug(
          `[${file.name}] Uploading ${
            data.length
          } bytes for part #${partNumber} to S3`
        );
        // TODO: change upload_url to url
        return request.upload(multipartItem.url, data);
      }
    );
  }

  /**
   * Given a file content, and the number of parts that must be uploaded to S3,
   * it chunkes the file and uploads each part sequentially
   * @param   {Object}  board   Board item.
   * @param   {Object}  file    Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  content File content
   * @returns {Array}           Array of part upload promises
   */
  async function uploadAllParts(board, file, content) {
    const totalParts = file.multipart.part_numbers;
    logger.debug(
      `[${
        file.name
      }] Splitting file into ${totalParts} parts. Total size to upload: ${
        content.length
      } bytes.`
    );

    for (let partNumber = 0; partNumber < totalParts; partNumber++) {
      const chunkStart = partNumber * file.multipart.chunk_size;
      const chunkEnd = (partNumber + 1) * file.multipart.chunk_size;

      logger.debug(
        `[${file.name}] Part #${partNumber +
          1} of ${totalParts}. Bytes from ${chunkStart} to ${chunkEnd}.`
      );

      await uploadPart(
        board,
        file,
        content.slice(chunkStart, chunkEnd),
        partNumber + 1
      );

      logger.debug(
        `[${file.name}] Uploaded part #${partNumber +
          1} of ${totalParts} to S3"`
      );
    }
  }

  /**
   * Given a file content, and the number of parts that must be uploaded to S3,
   * it chunkes the file and uploads each part sequentially. Completes the file upload at the end.
   * @param   {Object}  board   Board item.
   * @param   {Object}  file    Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  content File content
   * @returns {Promise}         Empty response if everything goes well 🤔
   */
  return async function uploadFileToBoard(board, file, content) {
    logger.info(`[${file.name}] Starting file upload.`);

    try {
      await uploadAllParts(board, file, content);
      const response = await completeFileUpload(board, file);
      logger.info(`[${file.name}] File upload complete.`);

      return response;
    } catch (error) {
      throw new WTError(
        `There was an error when uploading ${file.name}.`,
        error
      );
    }
  };
};
