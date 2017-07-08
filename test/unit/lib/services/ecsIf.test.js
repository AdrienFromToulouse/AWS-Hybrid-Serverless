import AWS from 'aws-sdk-mock';
import config from '../../../../lib/config';
import EcsIf from '../../../../lib/services/ecsIf';
import ecsRunTaskResponse from '../../../support/fixtures/ecsRunTaskResponse.json';

describe('EcsIf', () => {
  beforeEach(() => {
    AWS.mock('ECS', 'runTask', ecsRunTaskResponse);
  });

  afterEach(() => {
    AWS.restore('ECS');
  });

  describe('construct()', () => {
    describe('success', () => {
      test('sets attributes', () => {
        const ecsIf = new EcsIf(config);
        expect(ecsIf.config).toBeDefined();
        expect(ecsIf.ecs).toBeDefined();
      });
    });
  });

  describe('runTask()', () => {
    describe('success', () => {
      test('run task', () => {
        const ecsIf = new EcsIf(config);
        return ecsIf.runTask()
          .then((response) => {
            expect(response).toBe(ecsRunTaskResponse);
          });
      });
    });
  });
});
