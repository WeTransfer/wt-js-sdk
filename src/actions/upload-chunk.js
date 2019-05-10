module.exports = function({ request }) {
  return async function uploadChunk(chunk) {
    // Randomly fail 50%V of the times
    // if (Math.floor(Math.random() * 100) + 1 > 50) {
    //   throw new Error('Cannot get upload url');
    // }

    const url = await chunk.uploadUrl();
    await request.upload(url, chunk.content);
    chunk.complete();
  };
};
