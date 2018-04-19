const axios = require('axios');

const transferItems = require('../../src/transfer/items');
const request = require('../../src/request');

jest.mock('axios');

describe('Transfer module', () => {
  describe('Items', () => {
    describe('getChunkSizes method', () => {
      it('should return one chunk with file size, if smaller than 5MB', () => {
        expect(transferItems.getChunkSizes(1024)).toEqual([0, 1024]);
      });

      it('should return one chunk with file size, if it\'s 5MB', () => {
        expect(transferItems.getChunkSizes(5242880)).toEqual([0, 5242880]);
      });

      it('should return more than one chunk , if bigger than 5MB', () => {
        expect(transferItems.getChunkSizes(5243904)).toEqual([
          0,
          5242880,
          1024
        ]);
      });
    });

    describe('extractDataChunk method', () => {
      let data = [];
      let chunkSizes = [];
      beforeEach(() => {
        data = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        chunkSizes = [0, 5, 3];
      });

      it('should extract first chunk', () => {
        expect(transferItems.extractDataChunk(data, chunkSizes, 2, 1)).toEqual([
          '00',
          '01',
          '02',
          '03',
          '04'
        ]);
      });

      it('should extract last chunk', () => {
        expect(transferItems.extractDataChunk(data, chunkSizes, 2, 2)).toEqual([
          '05',
          '06',
          '07',
          '08',
          '09'
        ]);
      });
    });

    describe('addItems method', () => {
      let items = [];
      let createdItems = [];

      beforeEach(() => {
        axios.mockImplementation(() => Promise.resolve({}));

        request.apiKey = 'secret-api-key';
        request.jwt = 'json-web-token';

        items = [
          {
            filename: 'item-01.txt',
            filesize: 1024,
            content_identifier: 'file',
            local_identifier: 'item-01.txt'
          }
        ];

        createdItems = [
          {
            id: 'random-hash',
            content_identifier: 'file',
            local_identifier: 'item-01.txt',
            meta: {
              multipart_parts: 2,
              multipart_upload_id: 'some.random-id--'
            },
            name: 'item-01.txt',
            size: 195906
          }
        ];

        // TODO: move all these to an integration test?
        // nock('https://dev.wetransfer.com')
        //   .post('/v1/transfers/transfer-id/items')
        //   .reply(200, createdItems);

        // nock('https://dev.wetransfer.com')
        //   .get('/v1/files/random-hash/uploads/1/some.random-id--')
        //   .reply(200, {
        //     'upload_url': 'https://presigned-s3-put-url/part-1',
        //     'part_number': 1,
        //     'upload_id': 'an-s3-issued-multipart-upload-id',
        //     'upload_expires_at': 1519988329
        //   });

        // nock('https://dev.wetransfer.com')
        //   .get('/v1/files/random-hash/uploads/2/some.random-id--')
        //   .reply(200, {
        //     'upload_url': 'https://presigned-s3-put-url/part-2',
        //     'part_number': 2,
        //     'upload_id': 'an-s3-issued-multipart-upload-id',
        //     'upload_expires_at': 1519988329
        //   });

        // nock('https://presigned-s3-put-url')
        //   .put('/part-1')
        //   .reply(204);

        // nock('https://presigned-s3-put-url')
        //   .put('/part-2')
        //   .reply(204);

        // nock('https://dev.wetransfer.com')
        //   .post('/v1/files/random-hash/uploads/complete')
        //   .reply(204);
      });

      it('should create an add items request', async () => {
        axios.mockImplementation(() => Promise.resolve({ data: createdItems }));
        await transferItems.addItems('transfer-id', items);
        expect(axios).toHaveBeenLastCalledWith({
          data: {
            items: [
              {
                content_identifier: 'file',
                filename: 'item-01.txt',
                filesize: 1024,
                local_identifier: 'item-01.txt'
              }
            ]
          },
          headers: {
            'Authorization': 'Bearer json-web-token',
            'Content-Type': 'application/json',
            'x-api-key': 'secret-api-key'
          },
          url: '/v1/transfers/transfer-id/items'
        });
      });

      it('should return created items', async () => {
        axios.mockImplementation(() => Promise.resolve({ data: createdItems }));
        const newItems = await transferItems.addItems('transfer-id', items);
        expect(newItems).toEqual(createdItems);
      });
    });
  });
});
