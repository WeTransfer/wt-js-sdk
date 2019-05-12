const WTError = require('../../error');
const logger = require('../../config/logger');
const futureFile = require('../models/future-file');
const { RemoteFile } = require('../../models');
const contentForFiles = require('../../utils/content-for-files');

module.exports = function({ request, routes, uploadFileToBoard }) {
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
   * Add files to an existing board.
   * @param   {Object}  board Existing board object
   * @param   {Array}   files A board of files to be added to the board
   * @returns {Promise}       A board of created items
   */
  return async function addFilesToBoard(board, files) {
    try {
      logger.info(`Adding ${files.length} files to board with ID ${board.id}`);
      const response = await request.send(
        routes.boards.addFiles(board),
        files.map(futureFile)
      );

      const boardFiles = response.map((item) => new RemoteFile(item));
      board.addFiles(...boardFiles);

      if (shouldUploadFiles(files)) {
        const filesContent = contentForFiles(files);
        await Promise.all(
          boardFiles.map((file) => {
            return uploadFileToBoard(board, file, filesContent[file.name]);
          })
        );
      }

      return boardFiles;
    } catch (error) {
      throw new WTError(
        'There was an error when adding files to the board.',
        error
      );
    }
  };
};
