const SAFE_HTTP_METHODS = ['get', 'head', 'options'];
const IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat([
  'post',
  'put',
  'delete',
]);

function isNetworkError(response) {
  // Prevents retrying cancelled requests
  return !response && Boolean(response.status);
}

function isRetryableError(response) {
  return (
    !response ||
    response.status === 400 ||
    (response.status >= 500 && response.status <= 599)
  );
}

function isIdempotentRequestError(response) {
  if (!response.config) {
    // Cannot determine if the request can be retried
    return false;
  }

  return (
    isRetryableError(response) &&
    IDEMPOTENT_HTTP_METHODS.indexOf(response.config.method) !== -1
  );
}

function isNetworkOrIdempotentRequestError(response) {
  return isNetworkError(response) || isIdempotentRequestError(response);
}

module.exports = {
  isNetworkOrIdempotentRequestError,
};
