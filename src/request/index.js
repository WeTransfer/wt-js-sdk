const axios = require('axios');
const { merge } = require('lodash');

const logger = require('../config/logger');

axios.defaults.baseURL = 'https://dev.wetransfer.com/';
axios.defaults.method = 'post';

const auth = {
  apiKey: null,
  jwt: null
};

function defaultOptions(apiKey, jwt) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    }
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
    method: (options.method || axios.defaults.method).toUpperCase()
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
    data
  };

  logger.debug(`File upload request PUT ${uploadUrl}`);
  return axios(requestOptions).then((response) => response.data);
}

module.exports = {
  send,
  upload,
  set apiKey(apiKey) {
    auth.apiKey = apiKey;
  },
  set jwt(jwt) {
    auth.jwt = jwt;
  }
};
