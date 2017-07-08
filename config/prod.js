'use strict';

module.exports.config = () =>
  Object({
    awsProfile: 'default',
    asg: {
      minSize: '2',
      maxSize: '3',
    },
    sshKeyPair: 'serverlessSG',
  });
