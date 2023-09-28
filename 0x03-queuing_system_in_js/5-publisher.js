#!/usr/bin/node
import { createClient } from 'redis';

const client = createClient();

// Event handler for successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
  
  // Function to publish a message after a specified time
  const publishMessage = (message, time) => {
    setTimeout(() => {
      console.log(`About to send ${message}`);
      client.publish('holberton school channel', message);
    }, time);
  };

  // Call the publishMessage function for various messages
  publishMessage('Holberton Student #1 starts course', 100);
  publishMessage('Holberton Student #2 starts course', 200);
  publishMessage('KILL_SERVER', 300);
  publishMessage('Holberton Student #3 starts course', 400);
});

