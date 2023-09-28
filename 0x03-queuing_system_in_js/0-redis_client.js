#!/usr/bin/node
// Import the necessary modules
import redis from 'redis';

// Create a Redis client
const client = redis.createClient();

// Handle Redis client errors
client.on('error', (err) => {
  console.error('Redis Client not connected to the server:', err);
});

// Handle Redis client connection
client.on('connect', () => {
  console.log('Redis Client connected to the server.');
});

