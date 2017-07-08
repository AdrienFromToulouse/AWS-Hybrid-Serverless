import AWS from 'aws-sdk';
import { httpOptions } from '../common';

export default class EcsIf {
  constructor(config) {
    this.config = config;
    this.ecs = new AWS.ECS({
      region: config.region,
      httpOptions,
    });
  }

  runTask() {
    const params = {
      cluster: this.config.ecs.cluster,
      taskDefinition: this.config.ecs.task,
      count: 1,
    };
    return this.ecs.runTask(params).promise();
  }
}
