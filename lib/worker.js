import { exec } from 'child_process';
import config from './config';
import Sqs from './services/sqsIf';

/* -- Register the binaries in PATH. -- */
const binariesPath = `${process.cwd()}/binaries`;
process.env.PATH += `:${binariesPath}`;
process.env.LD_LIBRARY_PATH = binariesPath;
/* ----- */

const sqs = new Sqs(config);

(function pollQueue() {
  return sqs.getQueueUrl()
    .then(() => sqs.receiveJob())
    .then((job) => {
      const data = JSON.parse(job.Body);
      console.log('%j', data);
      return new Promise((resolve, reject) => {
        exec(`serverlessSG ${data.attendees}`, (err, stdout, stderr) => {
          if (err || stderr !== '') {
            return reject(new Error(`${err} - stderr ${stderr}`));
          }
          console.log(stdout);
          return resolve(job);
        });
      });
    })
    .then(job => sqs.deleteJob(job))
    .then(() => {
      pollQueue();
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'EmptyQueue') {
        return 0;
      }
      return pollQueue();
    });
}());
