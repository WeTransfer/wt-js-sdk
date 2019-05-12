const { get } = require('lodash');

const logger = require('../config/logger');
const WTError = require('../error');

const { MultipartChunk } = require('../models');

module.exports = function({ getUploadUrl, enqueueChunk, completeFileUpload }) {
  /**
   * Given a list of chunks, it enqueues the tasks and resolves the promise
   * when all tasks have been completed
   * @param   {Object}  file   Item containing information about number of parts, upload url, etc.
   * @param   {Array}   chunks A list of chunks
   * @returns {Promise}
   */
  function uploadAllChunks(file, chunks) {
    return new Promise((resolve, reject) => {
      function callback(error) {
        if (error) {
          return reject(error);
        }

        // After a chunk is completed, check if all file chunks have been uploaded.
        if (file.uploadComplete()) {
          return resolve();
        }
      }

      chunks.forEach((chunk) => {
        enqueueChunk(chunk, callback);
      });
    });
  }

  /**
   * Given the content of the file, and the number of parts that must be uploaded to S3,
   * it splits the file into chunks and create a task ready to be executed
   * @param   {Object}   transferOrBoard Transfer or Board item.
   * @param   {Object}   file            Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}   content         File content
   * @returns {Array}    chunks          A list of chunks ready to be uploaded
   */
  function createMultipartChunksForFile(transferOrBoard, file, content) {
    const totalParts = file.multipart.part_numbers;
    logger.debug(
      `[${
        file.name
      }] Splitting file into ${totalParts} parts. Total size to upload: ${
        content.length
      } bytes.`
    );

    const chunks = [];
    for (let partNumber = 0; partNumber < totalParts; partNumber++) {
      const chunkStart = partNumber * file.multipart.chunk_size;
      const chunkEnd = (partNumber + 1) * file.multipart.chunk_size;

      logger.debug(
        `[${file.name}] Part #${partNumber +
          1} of ${totalParts}. Bytes from ${chunkStart} to ${chunkEnd}.`
      );

      chunks.push(
        new MultipartChunk(
          file,
          content.slice(chunkStart, chunkEnd),
          () =>
            getUploadUrl(
              transferOrBoard.id,
              file.id,
              partNumber + 1,
              get(file, 'multipart.id')
            ),
          partNumber + 1
        )
      );
    }

    return chunks;
  }

  /**
   * Given the content of the file, and the number of parts that must be uploaded to S3,
   * it splits the file into chunks and uploads each part sequentially.
   * Completes the file upload at the end.
   * @param   {Object}  transferOrBoard Transfer or Board item.
   * @param   {Object}  file            Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  content         File content
   * @returns {Promise}                 Empty response if everything goes well 🤔
   */
  return async function uploadFile(transferOrBoard, file, content) {
    logger.info(`[${file.name}] Starting file upload.`);

    try {
      const chunks = createMultipartChunksForFile(
        transferOrBoard,
        file,
        content
      );
      await uploadAllChunks(file, chunks);
      const response = await completeFileUpload(transferOrBoard, file);
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
