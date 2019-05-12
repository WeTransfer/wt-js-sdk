const logger = require('../config/logger');

module.exports = function({ request }) {
  return async function uploadChunk(chunk) {
    logger.debug(
      `[${chunk.file.name}] Uploading ${chunk.content.length} bytes for part #${
        chunk.partNumber
      } to S3`
    );
    const url = await chunk.uploadUrl();
    await request.upload(url, chunk.content);
    chunk.uploadComplete();
  };
};
