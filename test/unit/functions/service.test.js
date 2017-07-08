import AWS from 'aws-sdk-mock';
import LambdaTester from 'lambda-tester';

import sqsResponseQueuedMsg from '../../support/fixtures/sqsResponseQueuedMsg.json';
import ecsRunTaskResponse from '../../support/fixtures/ecsRunTaskResponse.json';
import handler from '../../../functions/service';

const payload = { attendees: 300 };

describe('service', () => {
  describe('handler()', () => {
    describe('success', () => {
      describe('returns the ECS task response', () => {
        beforeEach(() => {
          AWS.mock('SQS', 'getQueueUrl', { QueueUrl: 'QueueUrl' });
          AWS.mock('SQS', 'receiveMessage', { Messages: [payload] });
          AWS.mock('SQS', 'sendMessage', sqsResponseQueuedMsg);
          AWS.mock('SQS', 'deleteMessage');
          AWS.mock('ECS', 'runTask', ecsRunTaskResponse);
        });

        afterEach(() => {
          AWS.restore('SQS');
          AWS.restore('ECS');
        });

        test('returns result', () =>
          LambdaTester(handler.handler)
            .event(payload)
            .expectResult((data) => {
              expect(data.statusCode).toBe(200);
              expect(data.body).toMatchSnapshot();
            }),
        );
      });
    });

    describe('fail', () => {
      describe('returns error on SQS getQueueUrl', () => {
        beforeEach(() => {
          AWS.mock('SQS', 'getQueueUrl', {});
          AWS.mock('SQS', 'receiveMessage', { Messages: [payload] });
          AWS.mock('SQS', 'sendMessage', sqsResponseQueuedMsg);
          AWS.mock('SQS', 'deleteMessage');
          AWS.mock('ECS', 'runTask', ecsRunTaskResponse);
        });

        afterEach(() => {
          AWS.restore('SQS');
          AWS.restore('ECS');
        });

        test('returns result', () =>
          LambdaTester(handler.handler)
            .event(payload)
            .expectError((data) => {
              expect(data.body).toMatchSnapshot();
            }),
        );
      });
    });
  });
});
