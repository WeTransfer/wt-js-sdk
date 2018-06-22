const nock = require('nock');

const transferClient = require('../../src/transfer');
const request = require('../../src/request');

describe('Transfer module', () => {
  beforeEach(() => {
    request.apiKey = 'secret-api-key';
    request.jwt = 'json-web-token';
  });

  describe('create method', () => {
    let transfer = {};

    beforeEach(() => {
      transfer = {
        id: 'random-hash',
        state: 'uploading',
        shortened_url: 'https://we.tl/s-random-hash',
        name: 'WeTransfer',
        description: null,
        size: 0,
        total_items: 0,
        items: []
      };

      nock('https://dev.wetransfer.com')
        .post('/v1/transfers')
        .reply(200, transfer);
    });

    it('should create a new transfer request', async () => {
      const newTransfer = await transferClient.create({
        name: 'WeTransfer SDK'
      });
      expect(newTransfer).toEqual(transfer);
    });
  });
});
