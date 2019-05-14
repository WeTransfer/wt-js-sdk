const queue = require('async/queue');

const config = require('../../config');
const logger = require('../../config/logger');

module.exports = function({ uploadChunk }) {
  function canRetryUpload(chunk, config) {
    return chunk.retries < config.chunkRetries;
  }

  // Create a queue object with concurrency of 5 (default).
  // uploadChunk will be executed for every chunk.
  const uploadQueue = queue(uploadChunk, config.concurrency);

  return function enqueueChunk(chunk, callback) {
    logger.debug(
      `[${chunk.file.name}] Queuing chunk #${chunk.partNumber}. Retry #${
        chunk.retries
      }.`
    );

    uploadQueue.push(chunk, (error) => {
      const canRetry = canRetryUpload(chunk, config);

      if (error && canRetry) {
        logger.debug(
          `[${chunk.file.name}] Chunk #${chunk.partNumber} failed to upload.`
        );

        chunk.retries++;
        return setTimeout(
          () => enqueueChunk(chunk, callback),
          config.chunkRetryDelay
        );
      }

      if (error && !canRetry) {
        return callback(error);
      }

      chunk.uploadComplete();
      callback();
    });
  };
};
