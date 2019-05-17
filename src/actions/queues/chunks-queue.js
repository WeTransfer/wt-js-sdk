const queue = require('async/queue');

const config = require('../../config');
const logger = require('../../config/logger');

module.exports = function({ uploadChunk }) {
  // Create a queue object with a concurrency defined in the configuration.
  // uploadChunk will be executed for every chunk.
  const uploadQueue = queue(uploadChunk, config.concurrency);

  // Checks if we can try to upload the provided chunk
  // based on the number of actual retries and the maximum
  // number of retries per chunk.
  function canRetryUpload(chunk, config) {
    return chunk.retries < config.chunkRetries;
  }

  return function enqueueChunk(chunk) {
    return new Promise((resolve, reject) => {
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
            return enqueueChunk(chunk)
              .then(resolve)
              .catch(reject);
          }

          return reject(error);
        }

        logger.debug(
          `[${chunk.file.name}] Chunk #${chunk.partNumber} upload complete.`
        );

        resolve(chunk);
      });
    });
  };
};
