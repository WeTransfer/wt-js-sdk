const queue = require('async/queue');

const logger = require('../../config/logger');

module.exports = function({ uploadChunk }) {
  // Create a queue object with concurrency of 3
  // uploadChunk will be executed for every chunk
  const uploadQueue = queue(uploadChunk, 3);

  return function enqueueChunk(chunk, callback) {
    logger.debug(
      `[${chunk.file.name}] Queuing chunk #${chunk.partNumber}. Retry #${
        chunk.retries
      }.`
    );

    uploadQueue.push(chunk, (error) => {
      if (error && chunk.canRetry) {
        logger.debug(
          `[${chunk.file.name}] Chunk #${chunk.partNumber} failed to upload.`
        );
        logger.error(error);

        chunk.retries++;
        return enqueueChunk(chunk);
      }

      if (error && !chunk.canRetry) {
        throw new Error(error);
      }

      callback();
    });
  };
};
