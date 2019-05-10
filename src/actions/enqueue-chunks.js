const queue = require('async/queue');

module.exports = function({ uploadChunk }) {
  // Create a queue object with concurrency of 3
  // uploadChunk will be executed for every chunk
  const uploadQueue = queue(uploadChunk, 5);

  function enqueueChunk(chunk) {
    uploadQueue.push(chunk, (error) => {
      // TODO: log the error, check retries, and try again if possible
      if (error && chunk.canRetry) {
        console.error('Chunk worker error. Retry.');
        return enqueueChunk(chunk);
      }

      console.log('Chunk done', chunk.file.name);
    });
  }

  return function enqueueChunks(chunks) {
    // Notify when the whole queue has been processed
    uploadQueue.drain = () => {
      console.log('The queue is empty!');
    };

    // Queue all the chunks
    chunks.forEach(enqueueChunk);
  };
};
