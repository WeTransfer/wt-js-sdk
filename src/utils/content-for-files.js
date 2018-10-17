const sanitizeFileName = require('./sanitize-filename');

/**
 * Create a hash where the key is the (sanitized) name of the file,
 * and the value is the content of the file. This will be useful
 * when mapping the remoteTransfer/Board files with the local files.
 *
 * @param   {Array}  files List of files with names and content
 * @returns {Object}       Hash with file names => file content
 */
function contentForFiles(files) {
  return files.reduce((filesContent, file) => {
    filesContent[sanitizeFileName(file.name)] = file.content;
    return filesContent;
  }, {});
}

module.exports = contentForFiles;
