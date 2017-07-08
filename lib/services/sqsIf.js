import AWS from 'aws-sdk';
import { agent } from '../common';
import {
  EmptyQueue,
} from '../errors';

class SqsIf {
  constructor(config) {
    this.config = config;
    this.sqsIf = new AWS.SQS({
      region: config.region,
      agent,
    });
  }

  getQueueUrl() {
    const params = {
      QueueName: this.config.sqs.serverlessQueueName,
    };
    return this.sqsIf.getQueueUrl(params).promise()
      .then((data) => {
        this.config.sqs.serverlessQueueUrl = data.QueueUrl;
        return data.QueueUrl;
      });
  }

  enqueueJob(payload) {
    const params = {
      MessageBody: JSON.stringify(payload),
      QueueUrl: this.config.sqs.serverlessQueueUrl,
    };
    return this.sqsIf.sendMessage(params).promise();
  }

  receiveJob() {
    const params = {
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 6,
      QueueUrl: this.config.sqs.serverlessQueueUrl,
    };
    return this.sqsIf.receiveMessage(params).promise()
      .then((data) => {
        if (!data.Messages) {
          return Promise.reject(new EmptyQueue());
        }
        return data.Messages[0];
      });
  }

  deleteJob(data) {
    const params = {
      ReceiptHandle: data.ReceiptHandle,
      QueueUrl: this.config.sqs.serverlessQueueUrl,
    };
    return this.sqsIf.deleteMessage(params).promise();
  }
}

export default SqsIf;
