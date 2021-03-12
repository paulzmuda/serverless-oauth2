const request = require('superagent');
const { scope } = require('../constants');
const {
  storeToken,
  fetchToken
} = require('./storage');


// Constant Contact OAuth2
const authBaseUrl = 'https://api.cc.email/v3/idfed';
const accessTokenBaseUrl = 'https://idfed.constantcontact.com/as/token.oauth2';

const getAuthorizationURL = (redirectUri, clientId) => {
  const authURL = `${authBaseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`; 

  return authURL;
}

const getAccessToken = (redirectUri, clientId, clientSecret, code, _callback = () => {}) => {
  const authUrl = `${accessTokenBaseUrl}?code=${code}&grant_type=authorization_code&scope=${scope}&redirect_uri=${redirectUri}`;
  const credentials = new Buffer.from(`${clientId}:${clientSecret}`);
  const authorization = `Basic ${credentials.toString('base64')}`;

  return request
    .post(authUrl)
    .accept('application/json')
    .set('Authorization', authorization)
    .end((err, res) => _callback(err, res));
}

const refreshNewToken = (refreshToken, clientId, clientSecret, _callback = () => {}) => {
  const authUrl = `${accessTokenBaseUrl}?refresh_token=${refreshToken}&grant_type=refresh_token`;
  const credentials = new Buffer.from(`${clientId}:${clientSecret}`);
  const authorization = `Basic ${credentials.toString('base64')}`;

  return request
    .post(authUrl)
    .accept('application/json')
    .set('Authorization', authorization)
    .end((err, res) => _callback(err, res));
}


module.exports = {
  getAuthorizationURL,
  getAccessToken,
  refreshNewToken,
  storeToken,
  fetchToken
}
