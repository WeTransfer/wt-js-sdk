const axiosRetry = require('axios-retry');

module.exports = Object.seal({
  concurrency: 5,
  retries: 15,
  retryDelay: axiosRetry.exponentialDelay,
  chunkRetries: 30,
  chunkRetryDelay: 1000,
  logger: {
    level: 'info',
  },
});
