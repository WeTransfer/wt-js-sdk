module.exports = function createLocalMockFile(file) {
  return Object.assign(
    {},
    {
      name: 'kittie.gif',
      size: 1024,
    },
    file
  );
};
