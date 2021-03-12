const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');

const {
  getAccessToken,
  getAuthorizationURL,
  storeToken
} = require('../oauth');

const {
  apiKey,
  secret,
  redirectUri,
  port
} = require('../constants');

const app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', (req, res) => {
  const authUrl = getAuthorizationURL(redirectUri, apiKey);
  res.redirect(authUrl);
})

app.get('/callback', (req, res) => {
  if (req.query.code) {
    try {
      getAccessToken(redirectUri, apiKey, secret, req.query.code, (error, response) => {
        if (error) {
          console.error(error);
          res.send(error);
        }

        if (response && response.status === 200 && response.text) {
          storeToken(JSON.parse(response.text), (err, result) => {
            if (err) {
              res.send(`Error storing token: ${err}`)
            } else {
              res.redirect('/success')
            }
          });
        } else {
          storeToken(response);
          res.send(response);
        }

      });
    } catch(err) {
      res.send(err);
    }
  } else {
    res.send('No code received, please try authorizing again.');
  }
});

app.get('/success', (req, res) => {
  res.send('Your new token is stored in the secrets manager, you can now exit.');
})

exports.handler = serverless(app);
