const queue = require('async/queue');

const config = require('../../config');
const logger = require('../../config/logger');

module.exports = function({ uploadChunk }) {
  // Create a queue object with concurrency of 5 (default).
  // uploadChunk will be executed for every chunk.
  const uploadQueue = queue(uploadChunk, config.concurrency);

  function canRetryUpload(chunk, config) {
    return chunk.retries < config.chunkRetries;
  }

  return function enqueueChunk(chunk, callback) {
    logger.debug(
      `[${chunk.file.name}] Queuing chunk #${chunk.partNumber}. Retry #${
        chunk.retries
      }.`
    );

    uploadQueue.push(chunk, (error) => {
      if (error) {
        logger.debug(
          `[${chunk.file.name}] Chunk #${chunk.partNumber} failed to upload.`
        );

        if (canRetryUpload(chunk, config)) {
          chunk.retries++;
          return enqueueChunk(chunk, callback);
        }

        return callback(error);
      }

      logger.debug(
        `[${chunk.file.name}] Chunk #${chunk.partNumber} upload complete.`
      );
      callback(null, chunk);
    });
  };
};
