const queue = require('async/queue');

const config = require('../../config');
const logger = require('../../config/logger');

function canRetryUpload(chunk, config) {
  return chunk.retries < config.chunkRetries;
}

function retryUpload(chunk, callback, config) {
  chunk.retries++;
  return setTimeout(
    () => enqueueChunk(chunk, callback),
    config.chunkRetryDelay
  );
}

module.exports = function({ uploadChunk }) {
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
      if (error) {
        logger.debug(
          `[${chunk.file.name}] Chunk #${chunk.partNumber} failed to upload.`
        );

        if (canRetryUpload(chunk, config)) {
          return retryUpload(chunk, callback, config);
        }

        return callback(error);
      }

      callback(null, chunk);
    });
  };
};
