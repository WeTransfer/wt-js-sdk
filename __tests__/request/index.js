const axios = require('axios');

const request = require('../../src/request');

jest.mock('axios');

describe('Request module', () => {
  beforeEach(() => {
    axios.mockImplementation(() => Promise.resolve({ data: {} }));
  });

  afterEach(() => {
    delete request._apiKey;
    delete request._jwt;
  });

  it('should set defaults', () => {
    expect(axios.defaults).toEqual(expect.objectContaining({
      baseURL: 'https://dev.wetransfer.com/',
      method: 'post'
    }));
  });

  describe('apiKey property', () => {
    it('should set an apiKey value', () => {
      request.apiKey = 'secret-api-key';
      expect(request._apiKey).toBe('secret-api-key');
    });

    it('should throw an error when no apiKey is provided', () => {
      expect(() => {
        request.apiKey = undefined;
      }).toThrow('No API Key provided');
    });
  });

  describe('JWT property', () => {
    it('should set an JWT value', () => {
      request.jwt = 'json-web-token';
      expect(request._jwt).toBe('json-web-token');
    });

    it('should throw an error when no jwt is provided', () => {
      expect(() => {
        request.jwt = undefined;
      }).toThrow('No JWT provided');
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
          'x-api-key': 'secret-api-key'
        },
        data: null
      });
    });

    it('should create a request including JTW', async () => {
      request.jwt = 'json-web-token';
      await request.send();
      expect(axios).toHaveBeenLastCalledWith({
        headers: {
          'Authorization': 'Bearer json-web-token',
          'Content-Type': 'application/json',
          'x-api-key': 'secret-api-key'
        },
        data: null
      });
    });

    it('should create a request including extra options', async () => {
      request.jwt = 'json-web-token';
      await request.send({ headers: { 'X-Extra-Header' : 'value' } });
      expect(axios).toHaveBeenLastCalledWith({
        headers: {
          'Authorization': 'Bearer json-web-token',
          'Content-Type': 'application/json',
          'x-api-key': 'secret-api-key',
          'X-Extra-Header': 'value'
        },
        data: null
      });
    });

    it('should create a request including extra data', async () => {
      request.jwt = 'json-web-token';
      await request.send({}, 'some-data');
      expect(axios).toHaveBeenLastCalledWith({
        headers: {
          'Authorization': 'Bearer json-web-token',
          'Content-Type': 'application/json',
          'x-api-key': 'secret-api-key'
        },
        data: 'some-data'
      });
    });
  });

  describe('upload method', () => {
    it('should create a PUT request', async () => {
      await request.upload('https://dev.wetransfer.com/very-long-url', 'some-data');
      expect(axios).toHaveBeenLastCalledWith({
        data: 'some-data',
        method: 'put',
        url: 'https://dev.wetransfer.com/very-long-url'
      });
    });
  });
});
