const SAFE_HTTP_METHODS = ['get', 'head', 'options'];
const IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(['put', 'delete']);

function isNetworkError(response) {
  // Prevents retrying cancelled requests
  return Boolean(response.status);
}

function isRetryableError(response) {
  return (
    !response ||
    // 429 - Retry ("Too Many Requests")
    response.status === 429 ||
    // 5XX - Retry (Server errors)
    (response.status >= 500 && response.status <= 599)
  );
}

function isIdempotentRequestError(response) {
  // Cannot determine if the request can be retried
  if (!response.config) {
    return false;
  }

  return (
    isRetryableError(response) &&
    IDEMPOTENT_HTTP_METHODS.includes(response.config.method)
  );
}

function isNetworkOrIdempotentRequestError(response) {
  return isNetworkError(response) && isIdempotentRequestError(response);
}

module.exports = {
  isNetworkOrIdempotentRequestError,
};
