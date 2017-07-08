import config from '../lib/config';
import Sqs from '../lib/services/sqsIf';
import Ecs from '../lib/services/ecsIf';

module.exports.handler = (event, context, callback) => {
  const sqs = new Sqs(config);
  const ecs = new Ecs(config);

  return sqs.getQueueUrl()
    .then(() => sqs.enqueueJob(event))
    .then(() => ecs.runTask())
    .then(ecsResponse =>
      callback(null, Object({
        statusCode: 200,
        body: ecsResponse,
      })),
    )
    .catch((err) => {
      callback(err);
    });
};
