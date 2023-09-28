#!/usr/bin/node

const kue = require('kue');
const queue = kue.createQueue();

// Define a function to send notifications
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Set up the queue process for the 'push_notification_code' job type
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;

  // Call the sendNotification function with the job data
  sendNotification(phoneNumber, message);

  // Mark the job as completed
  done();
});

console.log('Listening for jobs...');

