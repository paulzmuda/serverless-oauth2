// AWS Secrets Manager
const AWS = require('aws-sdk');
// const credentials = new AWS.SharedIniFileCredentials({ profile: process.env.AWS_PROFILE });

const sm = new AWS.SecretsManager({
  region: process.env.AWS_REGION,
  // credentials // if running locally
});
const secretId = process.env.AWS_SECRET_ID;

/*
* To replace token storage mechanism re-use the functions below
*/
const fetchToken = async (_callback = () => {}) => {
  return await new Promise((resolve, reject) => {
    sm.getSecretValue({ SecretId: secretId }, (err, result) => {
      if (err) reject(err);
      else resolve(
        _callback(JSON.parse(result.SecretString))
      );
    });
  });
}

const storeToken = async (response, _callback = () => {}) => {
  const data = JSON.stringify(response);
  return await new Promise((resolve, reject) => {
    sm.putSecretValue({ SecretId: secretId, SecretString: data }, (err, result) => {
      if (err) {
        reject(err);
        console.error(err);
        _callback(err, null);
      } else {
        resolve(
          _callback(null, result)
        );
      }
    });
  });
}


module.exports = {
  storeToken,
  fetchToken,
}
