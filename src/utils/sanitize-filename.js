const emojiStrip = require('emoji-strip');
const sanitizeFileName = require('sanitize-filename');

/**
 * WeTransfer doesn't support emojis as a part of filenames 😢
 * Let's also sanitize the filename, just in case.
 *
 * @param   {String} fileName Original filename
 * @returns {String}          The sanitized filename
 */
module.exports = function(fileName = '') {
  return sanitizeFileName(emojiStrip(fileName));
};
