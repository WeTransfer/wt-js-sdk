const axios = require('axios');
const axiosRetry = require('axios-retry');
const { get, merge } = require('lodash');

const config = require('../config');
const logger = require('../config/logger');
const { isNetworkOrIdempotentRequestError } = require('./retry');

axios.defaults.baseURL = 'https://dev.wetransfer.com/';

const auth = {
  apiKey: null,
  jwt: null,
};

function configure(options = {}) {
  axiosRetry(axios, {
    retries: get(options, 'retries', config.retries),
    retryDelay: get(options, 'retryDelay', config.retryDelay),
    // Retry if it's a network error, a 5XX error, API rate limit error on an idempotent request
    retryCondition(error) {
      const retry = isNetworkOrIdempotentRequestError(error.response);
      if (retry) {
        logger.debug('Retrying previous network request.');
      }

      return retry;
    },
  });
}

function defaultOptions(apiKey, jwt) {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
  };

  if (jwt) {
    options.headers['Authorization'] = `Bearer ${jwt}`;
  }

  return options;
}

function send(options = {}, data = null) {
  const requestOptions = merge(
    {},
    defaultOptions(auth.apiKey, auth.jwt),
    options,
    { data }
  );

  const log = {
    method: requestOptions.method.toUpperCase(),
  };
  logger.debug(
    `Network request ${log.method} ${options.url} ${JSON.stringify(data)}`
  );
  return axios(requestOptions).then((response) => response.data);
}

function upload(uploadUrl, data) {
  const requestOptions = {
    url: uploadUrl,
    method: 'put',
    data,
  };

  logger.debug(`File upload request PUT ${uploadUrl}`);
  return axios(requestOptions).then((response) => response.data);
}

module.exports = {
  send,
  upload,
  configure,
  set apiKey(apiKey) {
    auth.apiKey = apiKey;
  },
  set jwt(jwt) {
    auth.jwt = jwt;
  },
};
