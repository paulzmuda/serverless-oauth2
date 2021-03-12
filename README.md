# Serverless Oauth2

This is a Lambda function that can be triggered upon an expired access token. Tokens here are stored in AWS Secrets Manager but can be adapted to any other storage method such as writing a JSON file to AWS S3.

This example is used with the Constant Contact v3 API. Their server-flow still requires a client to approve and receive the first set of tokens. There is an additional Lambda API Server in this repository to facilitate that. Once you have the first access token / refresh token your Lambda function should be self-sufficient for automation. I decided to open this repo to the public when I was struggling to find an existing example using this flow.

`sam local start-api --profile YOUR_LOCAL_AWS_CLI_PROFILE`\
`sam local invoke getUserPrivileges --event events/event-get-user-privileges.json --profile YOUR_LOCAL_AWS_CLI_PROFILE`

## Prerequisites
- AWS CLI
- AWS SAM
- Constant Contact Account and Registered App (Or some other OAuth 2 API).
- AWS Secrets Manager Secret

## Setup
1. `npm install`\
2. `sam local start-api --profile YOUR_LOCAL_AWS_CLI_PROFILE`\
3. Navigate to http://localhost:3000
4. Allow your application access.

![Screen Shot 2021-03-11 at 10 21 48 PM](https://user-images.githubusercontent.com/4179018/110896900-202cb800-82c2-11eb-95a1-18b9ff90212f.png)

5. Test your stored token on an authorized API Endpoint, this example checks your user privileges.
`sam local invoke getUserPrivileges --event events/event-get-user-privileges.json --profile YOUR_LOCAL_AWS_CLI_PROFILE`

### AWS Secrets Manager
AWS Secrets Manager is being used to store and exchange tokens. Login to your AWS Console and navigate [here](https://console.aws.amazon.com/secretsmanager) to create a new secret.

1. Select "Other type of secrets"
2. Add two rows, one for "access_token" and one for "refresh_token". Enter any value for now.

![Screen Shot 2021-03-11 at 9 50 17 PM](https://user-images.githubusercontent.com/4179018/110896997-418da400-82c2-11eb-93b1-9fcaea22d775.png)

3. Name your secret and then add that name to the environment variables under "AWS_SECRET_ID".

![Screen Shot 2021-03-11 at 9 52 36 PM](https://user-images.githubusercontent.com/4179018/110897015-481c1b80-82c2-11eb-9d87-dbe9dc51f9f2.png)

![Screen Shot 2021-03-11 at 11 35 19 PM](https://user-images.githubusercontent.com/4179018/110897103-7568c980-82c2-11eb-98e8-6d65ba63e623.png)

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

![Screen Shot 2021-03-11 at 9 56 11 PM](https://user-images.githubusercontent.com/4179018/110897191-9cbf9680-82c2-11eb-8af8-2ce035b877d0.png)

4. "Generate Secret" and copy this secret to the environment variables under "CC_API_SECRET".

![Screen Shot 2021-03-11 at 9 58 17 PM](https://user-images.githubusercontent.com/4179018/110897235-b234c080-82c2-11eb-9bdb-3b10fe6df75e.png)


5. Add "contact_data" to the environment variables under "CC_API_SCOPE".

![Screen Shot 2021-03-11 at 11 35 19 PM](https://user-images.githubusercontent.com/4179018/110897103-7568c980-82c2-11eb-98e8-6d65ba63e623.png)

6. Click "Save" before moving on.
