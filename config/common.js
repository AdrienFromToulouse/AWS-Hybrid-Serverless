'use strict';

module.exports.config = () =>
  Object({
    awsProfile: 'default',
    asg: {
      minSize: '1',
      maxSize: '1',
    },
    sshKeyPair: 'serverlessSG',
  });
