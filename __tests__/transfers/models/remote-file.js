const { RemoteFile } = require('../../../src/models');

const createRemoteMockFile = require('../../fixtures/create-remote-file');

describe('RemoteFile model', () => {
  let file = null;
  beforeEach(() => {
    file = new RemoteFile(createRemoteMockFile());
  });

  describe('contructor', () => {
    it('should create a normalized file', () => {
      expect(file).toMatchSnapshot();
    });
  });
});
