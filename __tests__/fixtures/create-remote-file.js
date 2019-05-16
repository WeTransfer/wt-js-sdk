module.exports = function createRemoteMockFile(file) {
  return Object.assign(
    {},
    {
      id: 'random-hash',
      name: 'kittie.gif',
      size: 1024,
      type: 'file',
      multipart: {
        id: 'multipart-id',
        part_numbers: 1,
        chunk_size: 1024,
      },
    },
    file
  );
};
