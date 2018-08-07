const axios = require('axios');

const request = require('../../src/request');

jest.mock('axios');

describe('Request module', () => {
  beforeEach(() => {
    axios.mockImplementation(() => Promise.resolve({ data: {} }));
  });

  afterEach(() => {
    request.apiKey = null;
    request.jwt = null;
  });

  it('should set defaults', () => {
    expect(axios.defaults).toEqual(
      expect.objectContaining({
        baseURL: 'https://dev.wetransfer.com/',
        method: 'post',
      })
    );
  });

  describe('apiKey property', () => {
    beforeEach(() => {
      request.apiKey = 'secret-api-key';
    });

    it('should set an apiKey value', async () => {
      await request.send();
      expect(axios).toHaveBeenLastCalledWith({
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'secret-api-key',
        },
        data: null,
      });
    });
  });

  describe('JWT property', () => {
    beforeEach(() => {
      request.apiKey = 'secret-api-key';
    });

    it('should set a JWT value', async () => {
      request.jwt = 'json-web-token';
      await request.send();
      expect(axios).toHaveBeenLastCalledWith({
        headers: {
          'Authorization': 'Bearer json-web-token',
          'Content-Type': 'application/json',
          'x-api-key': 'secret-api-key',
        },
        data: null,
      });
    });
  });

  describe('send method', () => {
    beforeEach(() => {
      request.apiKey = 'secret-api-key';
    });

    it('should create a default request if no extra options are provided', async () => {
      await request.send();
      expect(axios).toHaveBeenLastCalledWith({
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'secret-api-key',
        },
        data: null,
      });
    });

    it('should create a request including JWT', async () => {
      request.jwt = 'json-web-token';
      await request.send();
      expect(axios).toHaveBeenLastCalledWith({
        headers: {
          'Authorization': 'Bearer json-web-token',
          'Content-Type': 'application/json',
          'x-api-key': 'secret-api-key',
        },
        data: null,
      });
    });

    it('should create a request including extra options', async () => {
      request.jwt = 'json-web-token';
      await request.send({ headers: { 'X-Extra-Header': 'value' } });
      expect(axios).toHaveBeenLastCalledWith({
        headers: {
          'Authorization': 'Bearer json-web-token',
          'Content-Type': 'application/json',
          'x-api-key': 'secret-api-key',
          'X-Extra-Header': 'value',
        },
        data: null,
      });
    });

    it('should create a request including extra data', async () => {
      request.jwt = 'json-web-token';
      await request.send({}, 'some-data');
      expect(axios).toHaveBeenLastCalledWith({
        headers: {
          'Authorization': 'Bearer json-web-token',
          'Content-Type': 'application/json',
          'x-api-key': 'secret-api-key',
        },
        data: 'some-data',
      });
    });
  });

  describe('upload method', () => {
    it('should create a PUT request', async () => {
      await request.upload(
        'https://dev.wetransfer.com/very-long-url',
        'some-data'
      );
      expect(axios).toHaveBeenLastCalledWith({
        data: 'some-data',
        method: 'put',
        url: 'https://dev.wetransfer.com/very-long-url',
      });
    });
  });
});
