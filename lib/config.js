import pkg from '../package.json';

function featureStage() {
  const environment = process.env.ENVIRONMENT || 'dev';
  return environment.startsWith('feature');
}

const config = {
  environment: process.env.ENVIRONMENT || 'dev',
  featureStage: featureStage(),
  downloadRootPath: process.env.DOWNLOAD_ROOT_PATH || '/tmp/serverlessSG',
  local: process.env.LOCAL || false,
  region: process.env.REGION || 'ap-northeast-1',
  serviceName: process.env.SERVICE_NAME || pkg.name,
  version: process.env.VERSION || pkg.version,
  serverlessSgExecPath: process.env.SERVERLESS_SG_EXECPATH || 'serverlessSG',
  sqs: {
    serverlessQueueUrl: process.env.SERVERLESS_QUEUE_URL,
    serverlessQueueName: process.env.SERVERLESS_QUEUE_NAME || 'bandlab-serverlesssg-developer-ServerlessQueue',
  },
  ecs: {
    task: process.env.TASK_DEFINITION || '',
    cluster: process.env.ECS_CLUSTER || '',
  },
};

export default config;
