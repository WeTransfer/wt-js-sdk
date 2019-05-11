const logger = require('../config/logger');

module.exports = function({ MultipartChunk }) {
  /**
   * Given the content of the file, and the number of parts that must be uploaded to S3,
   * it splits the file into chunks and create a task ready to be executed
   * @param   {Object}  transferOrBoard Transfer or Board item.
   * @param   {Object}  file            Item containing information about number of parts, upload url, etc.
   * @param   {Buffer}  content         File content
   */
  return function createMultipartChunksForFile(
    file,
    content,
    createChunkUploadUrl
  ) {
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
          createChunkUploadUrl(file.id, partNumber + 1)
        )
      );
    }

    return chunks;
  };
};
