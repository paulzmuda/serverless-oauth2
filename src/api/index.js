const request = require('superagent');
const {
  apiKey,
  secret,
} = require('../constants');
const { objectToQueryString } = require('../utils');
const {
  fetchToken,
  refreshNewToken,
  storeToken,
 } = require('../oauth');


const apiBaseUrl = 'https://api.cc.email/v3';
let attempts = 0;

const useAuth = async (_callback, params = {}) => await fetchToken((authToken) => _callback(authToken, params));

const getNewToken = (refreshToken, _callback, params = {}) => {
  return refreshNewToken(refreshToken, apiKey, secret, (error, response) => {
    if (error) {
      console.error(error.status);
      return Error;
    }
    if (response && response.status === 200 && response.text) {
      console.info(response.status);
      storeToken(JSON.parse(response.text));
      return useAuth(_callback, params);
    } else {
      console.info(response.status);
      return useAuth(_callback, params);
    }
  });
}

const sendRequest = async (token, options = { method: '', path: '', body: '' }) => {
  return request(options.method, `${apiBaseUrl}${options.path}`)
    .accept('application/json')
    .set('Authorization', `Bearer ${token.access_token}`)
    .send(options.body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      const unauthorized = (err.message == 'Unauthorized');
      if (unauthorized && attempts < 3) {
        attempts++;
        if (token.refresh_token) {
          return getNewToken(token.refresh_token, sendRequest, options) 
        } else {
          return 'No refresh token found. Need to re-auth in the client.';
        }
      }
      return err;
    })
}

const apiRequest = (token, lambdaEvent = { method: 'GET', path: '/', getParams: {}, body: {}}) => sendRequest(token, {
  method: lambdaEvent.method,
  path: `${lambdaEvent.path}${objectToQueryString(lambdaEvent.getParams)}`,
  body: lambdaEvent.body
});

module.exports = {
  apiRequest: (lambdaEvent) => useAuth(apiRequest, lambdaEvent)
}
