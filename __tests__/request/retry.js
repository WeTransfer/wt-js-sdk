const {
  isNetworkOrIdempotentRequestError: retry,
} = require('../../src/request/retry');

describe('Request retry module', () => {
  let response;

  beforeEach(() => {
    response = {
      status: 200,
      config: {
        method: 'get',
      },
    };
  });

  it('should retry if status code is 429', () => {
    response.status = 429;
    expect(retry(response)).toBe(true);
  });

  it('should retry if status code is 500', () => {
    response.status = 500;
    expect(retry(response)).toBe(true);
  });

  it('should retry if http method is delete', () => {
    response.status = 500;
    response.config.method = 'delete';
    expect(retry(response)).toBe(true);
  });

  it('should not retry if request has been cancelled', () => {
    response.status = 0;
    response.config.method = 'delete';
    expect(retry(response)).toBe(false);
  });

  it('should not retry if config is not available', () => {
    delete response.config;
    expect(retry(response)).toBe(false);
  });
});
