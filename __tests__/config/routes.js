const routes = require('../../src/config/routes');

describe('Routes configuration', () => {
  it('should define the right prefix', async () => {
    expect(routes.prefix).toBe('/v2');
  });

  it('should define an authorize path', () => {
    expect(routes.authorize).toEqual({ url: '/v2/authorize' });
  });

  describe('boards namespace', () => {
    it('should define all endpoints', () => {
      expect(routes.boards).toMatchSnapshot();
    });

    it('should define a find path', () => {
      expect(routes.boards.find('board-id')).toMatchSnapshot();
    });

    it('should define an addFiles path', () => {
      expect(routes.boards.addFiles({ id: 'board-id' })).toMatchSnapshot();
    });

    it('should define an addLinks path', () => {
      expect(routes.boards.addLinks({ id: 'board-id' })).toMatchSnapshot();
    });

    it('should define a multipart upload path', () => {
      expect(
        routes.boards.multipart(
          { id: 'board-id' },
          {
            id: 'file-id',
            multipart: {
              id: 'multipart-upload-id',
            },
          },
          1
        )
      ).toMatchSnapshot();
    });

    it('should define an upload path', () => {
      expect(routes.boards.upload('s3://upload-url')).toMatchSnapshot();
    });

    it('should define an uploadComplete path', () => {
      expect(
        routes.boards.uploadComplete({ id: 'board-id' }, { id: 'file-id' })
      ).toMatchSnapshot();
    });
  });

  describe('transfers namespace', () => {
    it('should define all endpoints', () => {
      expect(routes.transfers).toMatchSnapshot();
    });

    it('should define a find path', () => {
      expect(routes.transfers.find('transfer-id')).toMatchSnapshot();
    });

    it('should define a multipart upload path', () => {
      expect(
        routes.transfers.multipart(
          { id: 'transfer-id' },
          {
            id: 'file-id',
            multipart: {
              id: 'multipart-upload-id',
            },
          },
          1
        )
      ).toMatchSnapshot();
    });

    it('should define an upload path', () => {
      expect(routes.transfers.upload('s3://upload-url')).toMatchSnapshot();
    });

    it('should define an uploadComplete path', () => {
      expect(
        routes.transfers.uploadComplete(
          { id: 'transfer-id' },
          { id: 'file-id' }
        )
      ).toMatchSnapshot();
    });

    it('should define an finalize path', () => {
      expect(
        routes.transfers.finalize({ id: 'transfer-id' })
      ).toMatchSnapshot();
    });
  });
});
