import kue from 'kue';
import chai from 'chai';
import createPushNotificationsJobs from './8-job.js';

const { expect } = chai;

describe('createPushNotificationsJobs', () => {
  let queue;

  before(() => {
    // Create a Kue queue in test mode
    queue = kue.createQueue({ redis: { createClientFactory: () => kue.redis.createClient() }, jobEvents: false });
    queue.testMode.enter();
  });

  after(() => {
    // Clear the queue and exit test mode after tests
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('should display an error message if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs(null, queue)).to.throw('Jobs is not an array');
  });

  it('should create two new jobs to the queue', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    // Ensure that two jobs have been added to the queue
    expect(queue.testMode.jobs.length).to.equal(2);
  });
});

