# Prerequisite

The project is built thanks to [Babel](https://babeljs.io/)

- Install [yarn](https://yarnpkg.com/en/docs/getting-started)
- Install [Docker](https://docs.docker.com/engine/installation/)
- Install [Serverless Framework](https://github.com/serverless/serverless)

Then run `yarn` at the root of the project in oder to install the dependencies.

```bash
yarn
```

# 1. Build and deploy the Lambda function

Beforehand create a `sshKeyPair` via the AWS console -> confer [config file](./config/common.js).
This will be required in order for the EC2 to be accessible via SSH -> confer [ContainerInstances](./cloudformation/template.yml)


```bash
AWS_PROFILE=YOUR_AWS_PROFILE REGION=YOUR_REGION STAGE=YOUR_STAGE yarn run sls:build
```

Default:

- region: `ap-southeast-1`
- stage: `dev`

# 2. Build the docker image

Will expect 1. to have been executed first.

```bash
docker build -t serverless-dev-serverless .
docker tag serverless-dev-serverless:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/serverless-dev-serverless:latest
```

Connect to `ECR`:

```bash
aws ecr get-login --region ap-southeast-1 --profile=YOUR_AWS_PROFILE
```

Push the image:

```bash
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/serverless-dev-serverless:latest
```

# 3. Once deployed

Test your deployment via the AWS console.
Access your EC2 via SSH: `ssh -i serverlessSG.pem ec2-user@ec2-54-xxx-xxx-xxx.ap-southeast-1.compute.amazonaws.com`

# Unit Tests

`yarn run test`

# For more insights

https://engineers.sg/video/building-hybrid-serverless-architecture-serverless-singapore--1872
