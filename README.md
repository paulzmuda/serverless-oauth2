# Serverless Oauth2

This is a Lambda function that can be triggered upon an expired access token. Tokens here are stored in AWS Secrets Manager but can be adapted to any other storage method such as writing a JSON file to AWS S3.

This example is used with the Constant Contact v3 API. Their server-flow still requires a client to approve and receive the first set of tokens. There is an additional Lambda API Server in this repository to facilitate that. Once you have the first access token / refresh token your Lambda function should be self-sufficient for automation. I decided to open this repo to the public when I was struggling to find an existing example using this flow.

`sam local start-api`
`sam local invoke getUserPrivileges --event events/event-get-user-privileges.json`

## Prerequisites
- AWS CLI
- AWS SAM
- Constant Contact Account and Registered App (Or some other OAuth 2 API).
- AWS Secrets Manager Secret

## Setup
`npm install`
`sam local start-api --profile YOUR_LOCAL_AWS_CLI_PROFILE`
Navigate to http://localhost:3000
[ Picture ]
Allow your application access.
Test your stored token on an authorized API Endpoint, this example checks your user privileges.
`sam local invoke getUserPrivileges --event events/event-get-user-privileges.json --profile YOUR_LOCAL_AWS_CLI_PROFILE`

### AWS Secrets Manager
AWS Secrets Manager is being used to store and exchange tokens. Login to your AWS Console and navigate [here](https://console.aws.amazon.com/secretsmanager) to create a new secret.

1. Select "Other type of secrets"
2. Add two rows, one for "access_token" and one for "refresh_token". Enter any value for now.

[ Picture ]

3. Name your secret and then add that name to the environment variables under "AWS_SECRET_ID".

[ picture ] [ picture]

4. "Next" > "Next" and "Store"

### AWS CLI
To run this Lambda locally, you will need to install and configure the AWS CLI. A profile and user is required to interact with AWS. [More info here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

Be sure to create a separate user for your machine to generate an Access key ID.

### AWS SAM
To run this Lambda locally, you will need to install and configure [AWS Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/). You will also need Docker installed.


### Constant Contact 
This example is used to connect to the [Constant Contact V3 API](https://v3.developer.constantcontact.com/). It can be applied to any other API using OAuth2. You can create a free account to get started.

1. Navigate to [My Applications](https://v3.developer.constantcontact.com/login/index.html) and create a "New Application".
2. Change the Redirect URI to include "http://localhost:3000/callback".
3. Copy the API Key to the environment variables under "CC_API_KEY".
4. "Generate Secret" and copy this secret to the environment variables under "CC_API_SECRET".
5. Add "contact_data" to the environment variables under "CC_API_SCOPE".
5. Click "Save" before moving on.
