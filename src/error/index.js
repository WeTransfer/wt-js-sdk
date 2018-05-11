const { get, trim } = require('lodash');

class WTError extends Error {
  constructor(message = null, raw = {}) {
    super(raw);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WTError);
    }

    this.message = this.enhanceErrorMessage(message, raw);
    this.raw = raw;
    this.timestamp = Date.now();
  }

  enhanceErrorMessage(originalMessage, error) {
    const responseMessage = get(error, 'response.data.message', '');
    const message = originalMessage
      ? originalMessage
      : this.defaultErrorMessage(get(error, 'response', ''));

    return trim(`${message}\n${responseMessage}`);
  }

  defaultErrorMessage({ status } = {}) {
    if (status >= 200 && status <= 299) {
      return '';
    } else if (status >= 400 && status <= 499) {
      return `Response had a ${status} code, the server will not accept this request even if retried.`;
    } else if (status >= 500 && status <= 504) {
      return `Response had a ${status} code, we could retry.`;
    }

    return `Response had a ${status} code, no idea what to do with that.`;
  }
}

module.exports = WTError;
