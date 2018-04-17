const routes = require('../../src/config/routes');

describe('Routes configuration', () => {
  it('should define the right prefix', async () => {
    expect(routes.prefix).toBe('/v1');
  });

  it('should define an authorize path', () => {
    expect(routes.authorize).toEqual({ url: '/v1/authorize' });
  });

  it('should define a transfers path', () => {
    expect(routes.transfers).toEqual({ url: '/v1/transfers' });
  });

  it('should define an items path', () => {
    expect(routes.items('id')).toEqual({ url: '/v1/transfers/id/items' });
  });

  it('should define a multipart upload path', () => {
    expect(routes.multipart({
      id: 'item_id',
      meta: {
        multipart_upload_id: 'multipart_upload_id'
      }
    }, 1)).toEqual({ url: '/v1/files/item_id/uploads/1/multipart_upload_id', method: 'get' });
  });

  it('should define an upload path', () => {
    expect(routes.upload('https://dev.wetransfer.com/very-long-url')).toEqual({ url: 'https://dev.wetransfer.com/very-long-url' });
  });

  it('should define an uploadComplete path', () => {
    expect(routes.uploadComplete('id')).toEqual({ url: '/v1/files/id/uploads/complete' });
  });
});
