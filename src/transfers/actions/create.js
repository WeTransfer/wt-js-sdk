const contentForFiles = require('../../utils/content-for-files');

const WTError = require('../../error');
const logger = require('../../config/logger');
const { futureTransfer, RemoteTransfer } = require('../models');

module.exports = function({
  request,
  routes,
  enqueueFileTask,
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

  /**
   * Given the content of the files and a remote transfer,
   * upload all the files and finalize the transfer.
   * @param   {Array}   filesContent   An array containing the content of each file
   * @param   {Object}  remoteTransfer A transfer object
   * @returns {Promise}                A transfer object
   */
  async function uploadFilesAndFinalize(filesContent, remoteTransfer) {
    await Promise.all(
      remoteTransfer.files.map((file) =>
        enqueueFileTask({
          transferOrBoard: remoteTransfer,
          file: file,
          content: filesContent[file.name],
        })
      )
    );

    return await finalizeTransfer(remoteTransfer);
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
        const filesContent = contentForFiles(transfer.files);
        return await uploadFilesAndFinalize(filesContent, remoteTransfer);
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
