#!/usr/bin/node

const kue = require('kue');
const queue = kue.createQueue();

// Create an array of jobs data
const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  // Add more job objects here
];

// Process each job in the array
jobs.forEach((jobData, index) => {
  const job = queue.create('push_notification_code_2', jobData);

  job
    .on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    })
    .on('failed', (err) => {
      console.log(`Notification job ${job.id} failed: ${err}`);
    })
    .on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });

  job.save((err) => {
    if (err) {
      console.error(`Error creating job: ${err}`);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });
});

console.log('Creating notification jobs...');

