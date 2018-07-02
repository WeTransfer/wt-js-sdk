const logger = require('../../config/logger');
const WTError = require('../../error');

module.exports = function({ request, routes }) {
  const completeFileUpload = require('./complete-file-upload')({
    request,
    routes
  });

  const MAX_CHUNK_SIZE = 6 * 1024 * 1024;

  /**
   * Uploads a chunk of the file to S3
   * @param   {Object}  file       Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  data       File content
   * @param   {Array}   chunkSizes An array containing the chunk size for each part
   * @param   {Number}  partNumber Which part number we want to upload
   * @returns {Promise}            Empty response if everything goes well 🤔
   */
  function uploadPart(file, data, partNumber) {
    logger.debug(
      `[${file.name}] Requesting S3 upload URL for part #${partNumber}`
    );
    return request
      .send(routes.multipart(file, partNumber))
      .then((multipartItem) => {
        logger.debug(
          `[${file.name}] Uploading ${
            data.length
          } bytes for part #${partNumber} to S3`
        );
        return request.upload(multipartItem.upload_url, data);
      });
  }

  /**
   * Given a file content, and the number of parts that must be uploaded to S3,
   * it chunkes the file and uploads each part sequentially
   * @param   {Object}  file    Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  content File content
   * @returns {Array}           Array of part upload promises
   */
  async function uploadAllParts(file, content) {
    const totalParts = file.meta.multipart_parts;
    logger.debug(
      `[${
        file.name
      }] Splitting file into ${totalParts} parts. Total size to upload: ${
        content.length
      } bytes.`
    );

    for (let partNumber = 0; partNumber < totalParts; partNumber++) {
      const chunkStart = partNumber * MAX_CHUNK_SIZE;
      const chunkEnd = (partNumber + 1) * MAX_CHUNK_SIZE;

      logger.debug(
        `[${file.name}] Part #${partNumber +
          1} of ${totalParts}. Bytes from ${chunkStart} to ${chunkEnd}.`
      );

      await uploadPart(
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
   * @param   {Object}  file    Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  content File content
   * @returns {Promise}         Empty response if everything goes well 🤔
   */
  return async function uploadFile(file, content) {
    logger.info(`[${file.name}] Starting file upload.`);

    try {
      await uploadAllParts(file, content);
      const response = await completeFileUpload(file);
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
