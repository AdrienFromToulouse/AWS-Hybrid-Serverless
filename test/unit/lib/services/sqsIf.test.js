import AWS from 'aws-sdk-mock';
import config from '../../../../lib/config';
import SqsIf from '../../../../lib/services/sqsIf';
import sqsResponseQueuedMsg from '../../../support/fixtures/sqsResponseQueuedMsg.json';
import sqsResponseReadMsg from '../../../support/fixtures/sqsResponseReadMsg.json';

const payload = { attendees: 300 };

describe('SqsIf', () => {
  beforeEach(() => {
    AWS.mock('SQS', 'getQueueUrl', { QueueUrl: 'QueueUrl' });
    AWS.mock('SQS', 'receiveMessage', { Messages: [payload] });
    AWS.mock('SQS', 'sendMessage', sqsResponseQueuedMsg);
    AWS.mock('SQS', 'deleteMessage');
  });

  afterEach(() => {
    AWS.restore('SQS');
  });

  describe('construct()', () => {
    describe('success', () => {
      test('sets attributes', () => {
        const sqsIf = new SqsIf(config);
        expect(sqsIf.sqsIf).toBeDefined();
        expect(sqsIf.config).toBeDefined();
      });
    });
  });

  describe('getQueueUrl()', () => {
    describe('success', () => {
      test('returns queue URL', () => {
        const sqsIf = new SqsIf(config);
        return sqsIf.getQueueUrl()
          .then((response) => {
            expect(response).toBe('QueueUrl');
          });
      });
    });
  });

  describe('enqueueJob()', () => {
    describe('success', () => {
      test('returns confirmation message', () => {
        const sqsIf = new SqsIf(config);
        return sqsIf.enqueueJob(payload)
          .then((response) => {
            expect(response).toBe(sqsResponseQueuedMsg);
          });
      });
    });
  });

  describe('receiveJob()', () => {
    describe('success', () => {
      test('returns the payload', () => {
        const sqsIf = new SqsIf(config);
        return sqsIf.receiveJob()
          .then((response) => {
            expect(response).toBe(payload);
          });
      });
    });
  });

  describe('deleteJob()', () => {
    describe('success', () => {
      test('returns none', () => {
        const sqsIf = new SqsIf(config);
        const job = sqsResponseReadMsg.Messages[0];
        return sqsIf.deleteJob(job)
          .then((response) => {
            expect(response).toBe();
          });
      });
    });
  });
});

describe('SqsIf', () => {
  beforeEach(() => {
    AWS.mock('SQS', 'receiveMessage', {});
  });

  afterEach(() => {
    AWS.restore('SQS');
  });
  describe('receiveJob()', () => {
    describe('fail', () => {
      test('returns emptyQueue message error', () => {
        const sqsIf = new SqsIf(config);
        return sqsIf.receiveJob()
          .catch((err) => {
            expect(err.name).toBe('EmptyQueue');
            expect(err.message).toBe('There is no job to process.');
          });
      });
    });
  });
});
