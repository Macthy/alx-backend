#!/usr/bin/node
import { createClient } from 'redis';

const client = createClient();

// Event handler for successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');

  // Subscribe to the "holberton school channel"
  client.subscribe('holberton school channel');
});

// Event handler for errors
client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error.message}`);
});

// Event handler for incoming messages
client.on('message', (channel, message) => {
  console.log(`${channel}: ${message}`);

  // If the message is "KILL_SERVER", unsubscribe and quit
  if (message === 'KILL_SERVER') {
    client.unsubscribe('holberton school channel');
    client.quit();
  }
});

