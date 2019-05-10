const contentForFiles = require('../../utils/content-for-files');

const WTError = require('../../error');
const logger = require('../../config/logger');
const { futureTransfer, RemoteTransfer } = require('../models');

module.exports = function({
  request,
  routes,
  enqueueChunks,
  createUploadUrl,
  createMultipartChunksForFile,
  completeFileUpload,
  finalizeTransfer,
}) {
  /**
   * Check if the user also passed the content for files.
   * In that case, we can upload the files in one go.
   *
   * @param {Array} files A list of file object, containing name, size and maybe content
   */
  function shouldUploadFiles(files) {
    return files.reduce(
      (uploadFiles, file) => uploadFiles && Boolean(file.content),
      true
    );
  }

  function createFileMultipartChunks(remoteTransfer, filesContent) {
    const uploadUrl = createUploadUrl(remoteTransfer.id);

    return remoteTransfer.files.map((file) => {
      file.chunks = createMultipartChunksForFile(
        file,
        filesContent[file.name],
        uploadUrl
      );
      return file;
    });
  }

  /**
   * Given a list of chunks and a remote transfer,
   * queues the tasks with a concurrency of 3 and finalizes the transfer.
   * @param   {Array}   chunks         An array of chunks that must be uploaded to S3 concurrently
   * @returns {Promise}                A transfer object
   */
  async function uploadChunksAndComplete(fileMultipartChunks) {
    const chunks = fileMultipartChunks.map((file) => file.chunks);
    return enqueueChunks([].concat(...chunks));
  }

  /**
   * Creates a new transfer
   * @param   {Object}  transfer A transfer object containing files.
   * @returns {Promise}          A transfer object
   */
  return async function createTransfer(transfer) {
    try {
      logger.info('Creating a new transfer.');

      const response = await request.send(
        routes.transfers.create,
        futureTransfer(transfer)
      );
      logger.info(`Transfer created with id ${response.id}.`);

      const remoteTransfer = new RemoteTransfer(response);

      // If the files array contains the content of the file
      // lets upload directly, without asking the user to do it,
      // and finalize the transfer in one go.
      if (shouldUploadFiles(transfer.files)) {
        const fileMultipartChunks = createFileMultipartChunks(
          remoteTransfer,
          contentForFiles(transfer.files)
        );
        const filesUploadCompleted = fileMultipartChunks.map((file) =>
          file
            .onUploadComplete()
            .then(() => completeFileUpload(remoteTransfer, file))
        );

        uploadChunksAndComplete(fileMultipartChunks);

        return await Promise.all(filesUploadCompleted).then(() =>
          finalizeTransfer(remoteTransfer)
        );
      }

      return remoteTransfer;
    } catch (error) {
      throw new WTError(
        'There was an error when creating the transfer.',
        error
      );
    }
  };
};
