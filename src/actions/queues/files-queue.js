const queue = require('async/queue');

const config = require('../../config');
const logger = require('../../config/logger');

module.exports = function({ uploadFile }) {
  // Expand the data from the task to perform a file upload
  async function processFileTask(task) {
    await uploadFile(task.transferOrBoard, task.file, task.content);
  }

  // Create a queue object with a concurrency defined in the configuration.
  // processFileTask will be executed for every task.
  const uploadQueue = queue(processFileTask, config.concurrency);

  return function enqueueFileTask(task) {
    return new Promise((resolve, reject) => {
      const fileName = task.file.name;

      logger.debug(`[${fileName}] Queuing file to be uploaded.`);

      uploadQueue.push(task, (error) => {
        if (error) {
          logger.debug(`[${fileName}] Queue: file failed to upload.`);

          return reject(error);
        }

        logger.debug(`[${fileName}] Queue: file upload complete.`);

        resolve(task);
      });
    });
  };
};
