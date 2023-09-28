#!/usr/bin/node

const kue = require('kue');
const queue = kue.createQueue();

// Define the job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'Hello, this is a test notification.'
};

// Create a job in the queue
const job = queue.create('push_notification_code', jobData).save();

// Event handler when the job is created without error
job.on('enqueue', () => {
  console.log(`Notification job created: ${job.id}`);
});

// Event handler when the job is completed
job.on('complete', () => {
  console.log('Notification job completed');
});

// Event handler when the job is failing
job.on('failed', () => {
  console.log('Notification job failed');
});

